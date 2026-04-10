import { logger } from "@/lib/logger";

/**
 * Bitrix24 CRM integration client.
 *
 * Currently a mock — all calls are logged but not dispatched.
 * Replace with real REST API calls when the webhook URL is configured.
 */
export class Bitrix24Client {
  private webhookUrl: string;

  constructor(webhookUrl: string) {
    this.webhookUrl = webhookUrl;
  }

  /**
   * Sync an order status to Bitrix24 as a CRM deal.
   */
  async syncOrder(
    orderId: string,
    status: string,
    data: Record<string, string>,
  ): Promise<void> {
    // TODO: Implement Bitrix24 REST API calls
    // POST ${this.webhookUrl}/crm.deal.add or crm.deal.update
    logger.info({ orderId, status, webhookUrl: this.webhookUrl }, "Bitrix24 sync (mock)");
  }

  /**
   * Fetch deals from Bitrix24 CRM.
   */
  async getDeals(
    filter?: Record<string, string>,
  ): Promise<Record<string, unknown>[]> {
    // TODO: GET ${this.webhookUrl}/crm.deal.list?filter=...
    logger.info({ filter, webhookUrl: this.webhookUrl }, "Bitrix24 getDeals (mock)");
    return [];
  }

  /**
   * Create or update a contact in Bitrix24 CRM.
   */
  async syncContact(
    userId: string,
    data: Record<string, string>,
  ): Promise<void> {
    logger.info({ userId, webhookUrl: this.webhookUrl }, "Bitrix24 syncContact (mock)");
  }
}
