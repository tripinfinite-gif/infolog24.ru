import { NextResponse } from "next/server";
import { z } from "zod";
import { env } from "@/env";
import { logger } from "@/lib/logger";
import { getDeal } from "@/lib/integrations/bitrix24";
import {
  getWebhookClientIp,
  isWebhookIpAllowed,
} from "@/lib/security/webhook-allowlist";

export const runtime = "nodejs";

/**
 * Bitrix24 -> Infologistic webhook handler.
 *
 * Receives inbound events from Bitrix24 (deal status updates, etc.),
 * validates the shared token, and updates local order state accordingly.
 *
 * Security:
 * - Token validation via BITRIX24_INCOMING_TOKEN env var (compared to `auth[application_token]`
 *   or `token` query param per Bitrix outgoing-webhook contract)
 * - Optional IP allowlist via BITRIX24_ALLOWED_IPS
 *
 * All errors are logged and return 200 to avoid Bitrix retry loops for
 * unrecoverable conditions; a real validation failure returns 4xx.
 */

// Bitrix24 outgoing webhook body (x-www-form-urlencoded) parsed to object
const bitrixEventSchema = z.object({
  event: z.string(),
  data: z
    .object({
      FIELDS: z
        .object({
          ID: z.union([z.string(), z.number()]).optional(),
        })
        .passthrough()
        .optional(),
    })
    .passthrough()
    .optional(),
  ts: z.union([z.string(), z.number()]).optional(),
  auth: z
    .object({
      application_token: z.string().optional(),
      domain: z.string().optional(),
    })
    .passthrough()
    .optional(),
});

function validateToken(parsed: z.infer<typeof bitrixEventSchema>, url: URL) {
  const expected = env.BITRIX24_INCOMING_TOKEN;
  if (!expected) {
    // Without a configured token, reject by default in production
    if (process.env.NODE_ENV === "production") {
      return { ok: false as const, reason: "token_not_configured" };
    }
    logger.warn("BITRIX24_INCOMING_TOKEN not set — accepting in dev only");
    return { ok: true as const };
  }
  const token =
    parsed.auth?.application_token ?? url.searchParams.get("token") ?? "";
  if (token !== expected) {
    return { ok: false as const, reason: "token_mismatch" };
  }
  return { ok: true as const };
}

async function parseBody(request: Request): Promise<unknown> {
  const contentType = request.headers.get("content-type") ?? "";
  if (contentType.includes("application/json")) {
    return request.json();
  }
  // Bitrix sends x-www-form-urlencoded by default
  const text = await request.text();
  const params = new URLSearchParams(text);
  const result: Record<string, unknown> = {};
  for (const [key, value] of params.entries()) {
    setNested(result, key, value);
  }
  return result;
}

/**
 * Converts a Bitrix-style form key like data[FIELDS][ID] into nested object keys.
 */
function setNested(
  obj: Record<string, unknown>,
  key: string,
  value: string,
): void {
  const path = key
    .replace(/\]/g, "")
    .split("[")
    .filter((s) => s.length > 0);

  let cursor: Record<string, unknown> = obj;
  for (let i = 0; i < path.length - 1; i++) {
    const segment = path[i]!;
    const next = cursor[segment];
    if (typeof next !== "object" || next === null) {
      cursor[segment] = {};
    }
    cursor = cursor[segment] as Record<string, unknown>;
  }
  cursor[path[path.length - 1]!] = value;
}

export async function POST(request: Request) {
  try {
    // IP allowlist (optional — Bitrix uses many IPs, often skipped)
    const ip = getWebhookClientIp(request);
    if (!isWebhookIpAllowed(ip, "bitrix24")) {
      logger.warn({ ip }, "Bitrix24 webhook blocked by IP allowlist");
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const url = new URL(request.url);
    const rawBody = await parseBody(request);

    const parsed = bitrixEventSchema.safeParse(rawBody);
    if (!parsed.success) {
      logger.warn(
        { errors: parsed.error.flatten() },
        "Invalid Bitrix24 webhook payload",
      );
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    const tokenCheck = validateToken(parsed.data, url);
    if (!tokenCheck.ok) {
      logger.warn(
        { reason: tokenCheck.reason },
        "Bitrix24 webhook token invalid",
      );
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const event = parsed.data.event;
    const dealId = parsed.data.data?.FIELDS?.ID;

    logger.info(
      { event, dealId, domain: parsed.data.auth?.domain },
      "Bitrix24 webhook received",
    );

    if (event === "ONCRMDEALUPDATE" && dealId !== undefined) {
      // Fetch authoritative deal state from Bitrix24 (don't trust the webhook body)
      const dealResult = await getDeal(String(dealId));
      if (!dealResult.ok) {
        logger.warn(
          { dealId, error: dealResult.error },
          "Failed to fetch updated Bitrix24 deal — will not sync",
        );
      } else {
        logger.info(
          { dealId, stage: dealResult.data.STAGE_ID },
          "Bitrix24 deal state fetched",
        );
        // NOTE: automatic order status update skipped — correlation requires
        // a Bitrix deal ID column on the orders table (not in current schema).
        // Implement in queue worker once schema is extended.
      }
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    logger.error(error, "Failed to process Bitrix24 webhook");
    // Still 200 to avoid retry loops; error is logged.
    return NextResponse.json({ ok: true });
  }
}
