import type { InferSelectModel, InferInsertModel } from "drizzle-orm";
import * as schema from "@/lib/db/schema";

export type User = InferSelectModel<typeof schema.users>;
export type NewUser = InferInsertModel<typeof schema.users>;

export type Session = InferSelectModel<typeof schema.sessions>;
export type NewSession = InferInsertModel<typeof schema.sessions>;

export type Vehicle = InferSelectModel<typeof schema.vehicles>;
export type NewVehicle = InferInsertModel<typeof schema.vehicles>;

export type Order = InferSelectModel<typeof schema.orders>;
export type NewOrder = InferInsertModel<typeof schema.orders>;

export type Permit = InferSelectModel<typeof schema.permits>;
export type NewPermit = InferInsertModel<typeof schema.permits>;

export type Document = InferSelectModel<typeof schema.documents>;
export type NewDocument = InferInsertModel<typeof schema.documents>;

export type Payment = InferSelectModel<typeof schema.payments>;
export type NewPayment = InferInsertModel<typeof schema.payments>;

export type Notification = InferSelectModel<typeof schema.notifications>;
export type NewNotification = InferInsertModel<typeof schema.notifications>;

export type NotificationTemplate = InferSelectModel<
  typeof schema.notificationTemplates
>;
export type NewNotificationTemplate = InferInsertModel<
  typeof schema.notificationTemplates
>;

export type OrderStatusHistory = InferSelectModel<
  typeof schema.orderStatusHistory
>;
export type NewOrderStatusHistory = InferInsertModel<
  typeof schema.orderStatusHistory
>;

export type ChatConversation = InferSelectModel<
  typeof schema.chatConversations
>;
export type NewChatConversation = InferInsertModel<
  typeof schema.chatConversations
>;

export type ChatMessage = InferSelectModel<typeof schema.chatMessages>;
export type NewChatMessage = InferInsertModel<typeof schema.chatMessages>;

export type PromoCode = InferSelectModel<typeof schema.promoCodes>;
export type NewPromoCode = InferInsertModel<typeof schema.promoCodes>;

export type PartnerReferral = InferSelectModel<typeof schema.partnerReferrals>;
export type NewPartnerReferral = InferInsertModel<
  typeof schema.partnerReferrals
>;

export type AuditLog = InferSelectModel<typeof schema.auditLog>;
export type NewAuditLog = InferInsertModel<typeof schema.auditLog>;

/** Paginated result wrapper */
export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

/** Common filter options */
export interface PaginationParams {
  page?: number;
  pageSize?: number;
}

export interface OrderFilters extends PaginationParams {
  status?: Order["status"];
  zone?: Order["zone"];
  type?: Order["type"];
  search?: string;
}
