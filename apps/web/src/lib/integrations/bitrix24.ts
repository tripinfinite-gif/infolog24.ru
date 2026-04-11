import { env } from "@/env";
import { logger } from "@/lib/logger";

/**
 * Bitrix24 CRM integration via inbound REST webhook.
 *
 * Webhook URL format:
 * https://yourdomain.bitrix24.ru/rest/{USER_ID}/{WEBHOOK_KEY}/
 *
 * Gracefully degrades when BITRIX24_WEBHOOK_URL is missing: logs a warning,
 * returns error results, and never throws — so API routes stay operational.
 */

const MAX_RETRIES = 3;
const BASE_BACKOFF_MS = 500;
const REQUEST_TIMEOUT_MS = 15_000;

export type BitrixResult<T> =
  | { ok: true; data: T }
  | { ok: false; error: string };

interface BitrixResponse<T> {
  result: T;
  error?: string;
  error_description?: string;
  time?: { start: number; finish: number };
}

// ── Domain types ───────────────────────────────────────────────────────────

export interface CreateContactInput {
  name: string;
  phone?: string;
  email?: string;
  company?: string;
}

export interface CreateDealInput {
  title: string;
  contact: string; // contact name
  phone?: string;
  email?: string;
  comments?: string;
  source?: string; // UTM / channel
  amount?: number;
  currency?: string;
  contactId?: number;
}

// ── Client ─────────────────────────────────────────────────────────────────

function getWebhookUrl(): string | null {
  const url = env.BITRIX24_WEBHOOK_URL;
  if (!url) {
    logger.warn("BITRIX24_WEBHOOK_URL not configured — Bitrix24 disabled");
    return null;
  }
  // Guarantee trailing slash
  return url.endsWith("/") ? url : url + "/";
}

async function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Calls a Bitrix24 REST method with retry & exponential backoff.
 * Never throws — returns a tagged result.
 */
async function callMethod<T = unknown>(
  method: string,
  params: Record<string, unknown>,
): Promise<BitrixResult<T>> {
  const base = getWebhookUrl();
  if (!base) {
    return { ok: false, error: "Bitrix24 не настроен" };
  }

  const url = `${base}${method}.json`;

  let lastError = "Unknown error";
  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(params),
        signal: controller.signal,
      });
      clearTimeout(timeout);

      if (!response.ok) {
        lastError = `HTTP ${response.status}`;
        logger.warn(
          { method, status: response.status, attempt },
          "Bitrix24 request failed",
        );
        // Retry on 5xx and 429; break immediately on client errors
        if (response.status < 500 && response.status !== 429) {
          return { ok: false, error: lastError };
        }
      } else {
        const data = (await response.json()) as BitrixResponse<T>;
        if (data.error) {
          lastError = data.error_description ?? data.error;
          logger.error(
            { method, error: data.error, description: data.error_description },
            "Bitrix24 API error",
          );
          // These are typically non-retryable auth/method errors
          return { ok: false, error: lastError };
        }
        logger.info(
          { method, attempt },
          "Bitrix24 call succeeded",
        );
        return { ok: true, data: data.result };
      }
    } catch (error) {
      clearTimeout(timeout);
      lastError =
        error instanceof Error ? error.message : "Unknown network error";
      logger.warn(
        { method, attempt, err: lastError },
        "Bitrix24 network error",
      );
    }

    if (attempt < MAX_RETRIES) {
      const delay = BASE_BACKOFF_MS * 2 ** (attempt - 1);
      await sleep(delay);
    }
  }

  return { ok: false, error: lastError };
}

// ── Public API ─────────────────────────────────────────────────────────────

/**
 * Creates a contact in Bitrix24 CRM. Returns the contact ID.
 */
export async function addContact(
  input: CreateContactInput,
): Promise<BitrixResult<number>> {
  const fields: Record<string, unknown> = {
    NAME: input.name,
    OPENED: "Y",
    TYPE_ID: "CLIENT",
    SOURCE_ID: "WEB",
  };

  if (input.phone) {
    fields.PHONE = [{ VALUE: input.phone, VALUE_TYPE: "WORK" }];
  }
  if (input.email) {
    fields.EMAIL = [{ VALUE: input.email, VALUE_TYPE: "WORK" }];
  }
  if (input.company) {
    fields.COMPANY_TITLE = input.company;
  }

  const result = await callMethod<number>("crm.contact.add", { fields });
  return result;
}

/**
 * Creates a deal in Bitrix24 CRM. Returns the deal ID.
 */
export async function createDeal(
  input: CreateDealInput,
): Promise<BitrixResult<number>> {
  // Ensure a contact exists first (optional): if we already have contactId, skip
  let contactId = input.contactId;
  if (!contactId) {
    const contactResult = await addContact({
      name: input.contact,
      phone: input.phone,
      email: input.email,
    });
    if (contactResult.ok) {
      contactId = contactResult.data;
    } else {
      logger.warn(
        { error: contactResult.error },
        "Failed to create Bitrix24 contact — deal will be created without contact",
      );
    }
  }

  const fields: Record<string, unknown> = {
    TITLE: input.title,
    TYPE_ID: "SERVICES",
    STAGE_ID: "NEW",
    CURRENCY_ID: input.currency ?? "RUB",
    OPENED: "Y",
    ASSIGNED_BY_ID: 1,
    SOURCE_ID: input.source ?? "WEB",
    COMMENTS: input.comments ?? "",
  };

  if (typeof input.amount === "number") {
    fields.OPPORTUNITY = input.amount;
  }
  if (contactId) {
    fields.CONTACT_ID = contactId;
  }

  return callMethod<number>("crm.deal.add", { fields });
}

/**
 * Updates a deal's fields.
 */
export async function updateDeal(
  dealId: string | number,
  fields: Record<string, unknown>,
): Promise<BitrixResult<boolean>> {
  return callMethod<boolean>("crm.deal.update", {
    id: dealId,
    fields,
  });
}

/**
 * Fetches a single deal by ID.
 */
export async function getDeal(
  dealId: string | number,
): Promise<BitrixResult<Record<string, unknown>>> {
  return callMethod<Record<string, unknown>>("crm.deal.get", { id: dealId });
}

/**
 * Legacy class-based client kept for backwards-compat with existing callers.
 * New code should use the functional API above.
 */
export class Bitrix24Client {
  constructor(private webhookUrl?: string) {
    if (webhookUrl) {
      // If caller explicitly passed a URL, we still read from env for every call.
      logger.info({ webhookUrl }, "Bitrix24Client instantiated");
    }
  }

  async syncOrder(
    orderId: string,
    status: string,
    data: Record<string, string>,
  ): Promise<void> {
    const result = await createDeal({
      title: `Заказ ${orderId}`,
      contact: data.contactName ?? "Клиент",
      phone: data.phone,
      email: data.email,
      comments: `Статус: ${status}\n${data.comments ?? ""}`.trim(),
      source: data.source ?? "WEB",
    });
    if (!result.ok) {
      logger.warn({ orderId, error: result.error }, "Bitrix24 syncOrder failed");
    }
  }

  async syncContact(
    userId: string,
    data: Record<string, string>,
  ): Promise<void> {
    const result = await addContact({
      name: data.name ?? `User ${userId}`,
      phone: data.phone,
      email: data.email,
      company: data.company,
    });
    if (!result.ok) {
      logger.warn({ userId, error: result.error }, "Bitrix24 syncContact failed");
    }
  }

  async getDeals(
    _filter?: Record<string, string>,
  ): Promise<Record<string, unknown>[]> {
    const result = await callMethod<Record<string, unknown>[]>(
      "crm.deal.list",
      { filter: _filter ?? {} },
    );
    return result.ok ? result.data : [];
  }
}
