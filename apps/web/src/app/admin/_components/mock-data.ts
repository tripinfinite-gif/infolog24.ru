import type { OrderStatus } from "@/lib/automation/order-state-machine";

// ── Types matching DB schema ─────────────────────────────────────────────

export interface MockUser {
  id: string;
  email: string;
  name: string;
  phone: string;
  company: string;
  inn: string;
  role: "client" | "manager" | "admin";
  image: string | null;
  createdAt: string;
}

export interface MockOrder {
  id: string;
  orderNumber: number;
  userId: string;
  managerId: string | null;
  vehicleId: string;
  type: "mkad_day" | "mkad_night" | "ttk" | "sk" | "temp";
  zone: "mkad" | "ttk" | "sk";
  status: OrderStatus;
  price: number;
  discount: number;
  promoCode: string | null;
  estimatedReadyDate: string | null;
  notes: string | null;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  // Denormalized for display
  clientName: string;
  clientCompany: string;
  managerName: string | null;
  vehiclePlate: string;
}

export interface MockDocument {
  id: string;
  orderId: string;
  userId: string;
  type: "pts" | "sts" | "driver_license" | "power_of_attorney" | "application" | "contract" | "other";
  fileName: string;
  fileUrl: string;
  fileSize: number;
  mimeType: string;
  status: "pending" | "approved" | "rejected";
  rejectionReason: string | null;
  createdAt: string;
}

export interface MockPayment {
  id: string;
  orderId: string;
  orderNumber: number;
  userId: string;
  clientName: string;
  amount: number;
  currency: string;
  status: "pending" | "succeeded" | "cancelled" | "refunded";
  provider: string;
  externalId: string | null;
  paidAt: string | null;
  createdAt: string;
}

export interface MockPermit {
  id: string;
  orderId: string;
  userId: string;
  permitNumber: string;
  zone: "mkad" | "ttk" | "sk";
  type: "mkad_day" | "mkad_night" | "ttk" | "sk" | "temp";
  validFrom: string;
  validUntil: string;
  status: "active" | "expired" | "revoked";
  createdAt: string;
  clientName: string;
  vehiclePlate: string;
}

export interface MockStatusHistory {
  id: string;
  orderId: string;
  fromStatus: string | null;
  toStatus: string;
  changedBy: string;
  changedByName: string;
  comment: string | null;
  createdAt: string;
}

export interface MockComment {
  id: string;
  orderId: string;
  authorId: string;
  authorName: string;
  authorInitials: string;
  text: string;
  createdAt: string;
}

export interface MockAuditEntry {
  id: string;
  userId: string;
  userName: string;
  action: string;
  entityType: string;
  entityId: string;
  details: string;
  ipAddress: string;
  createdAt: string;
}

// ── Mock managers ────────────────────────────────────────────────────────

export const MANAGERS: MockUser[] = [
  { id: "m1", email: "petrov@infolog24.ru", name: "Петров Алексей", phone: "+7 (999) 111-22-33", company: "Инфолог24", inn: "", role: "manager", image: null, createdAt: "2024-01-15" },
  { id: "m2", email: "sidorova@infolog24.ru", name: "Сидорова Мария", phone: "+7 (999) 222-33-44", company: "Инфолог24", inn: "", role: "manager", image: null, createdAt: "2024-03-01" },
  { id: "m3", email: "kozlov@infolog24.ru", name: "Козлов Дмитрий", phone: "+7 (999) 333-44-55", company: "Инфолог24", inn: "", role: "manager", image: null, createdAt: "2024-06-10" },
  { id: "m4", email: "volkova@infolog24.ru", name: "Волкова Екатерина", phone: "+7 (999) 444-55-66", company: "Инфолог24", inn: "", role: "manager", image: null, createdAt: "2025-01-20" },
  { id: "admin1", email: "admin@infolog24.ru", name: "Администратор", phone: "+7 (999) 000-00-00", company: "Инфолог24", inn: "", role: "admin", image: null, createdAt: "2024-01-01" },
];

// ── Mock clients ─────────────────────────────────────────────────────────

export const CLIENTS: MockUser[] = [
  { id: "c1", email: "ivanov@logistic.ru", name: "Иванов Сергей Петрович", phone: "+7 (916) 123-45-67", company: 'ООО "ТрансЛогистик"', inn: "7701234567", role: "client", image: null, createdAt: "2025-08-12" },
  { id: "c2", email: "smirnova@mail.ru", name: "Смирнова Анна Викторовна", phone: "+7 (926) 234-56-78", company: "ИП Смирнова А.В.", inn: "770987654321", role: "client", image: null, createdAt: "2025-09-03" },
  { id: "c3", email: "kuznetsov@cargo.ru", name: "Кузнецов Михаил Алексеевич", phone: "+7 (903) 345-67-89", company: 'ООО "КаргоМосква"', inn: "7702345678", role: "client", image: null, createdAt: "2025-10-15" },
  { id: "c4", email: "popov@dostavka.ru", name: "Попов Дмитрий Николаевич", phone: "+7 (495) 456-78-90", company: 'ООО "Экспресс Доставка"', inn: "7703456789", role: "client", image: null, createdAt: "2025-11-20" },
  { id: "c5", email: "morozov@transport.ru", name: "Морозов Виктор Игоревич", phone: "+7 (985) 567-89-01", company: 'ООО "МосТранс"', inn: "7704567890", role: "client", image: null, createdAt: "2025-12-01" },
  { id: "c6", email: "fedorova@gruz.ru", name: "Фёдорова Елена Сергеевна", phone: "+7 (916) 678-90-12", company: 'ООО "ГрузПеревозки"', inn: "7705678901", role: "client", image: null, createdAt: "2026-01-10" },
  { id: "c7", email: "alekseev@perevozki.ru", name: "Алексеев Павел Андреевич", phone: "+7 (926) 789-01-23", company: "ИП Алексеев П.А.", inn: "771234567890", role: "client", image: null, createdAt: "2026-01-25" },
  { id: "c8", email: "lebedev@city-cargo.ru", name: "Лебедев Олег Викторович", phone: "+7 (903) 890-12-34", company: 'ООО "Сити Карго"', inn: "7706789012", role: "client", image: null, createdAt: "2026-02-05" },
  { id: "c9", email: "novikova@express.ru", name: "Новикова Татьяна Ивановна", phone: "+7 (495) 901-23-45", company: 'ООО "Экспресс Логистика"', inn: "7707890123", role: "client", image: null, createdAt: "2026-02-20" },
  { id: "c10", email: "sokolov@mega-trans.ru", name: "Соколов Андрей Петрович", phone: "+7 (985) 012-34-56", company: 'ООО "МегаТранс"', inn: "7708901234", role: "client", image: null, createdAt: "2026-03-01" },
];

// ── Mock orders ──────────────────────────────────────────────────────────

export const ORDERS: MockOrder[] = [
  { id: "o1", orderNumber: 1001, userId: "c1", managerId: "m1", vehicleId: "v1", type: "mkad_day", zone: "mkad", status: "approved", price: 45000, discount: 0, promoCode: null, estimatedReadyDate: "2026-04-05", notes: null, tags: ["VIP"], createdAt: "2026-03-20T10:00:00Z", updatedAt: "2026-04-05T14:00:00Z", clientName: "Иванов С.П.", clientCompany: 'ООО "ТрансЛогистик"', managerName: "Петров Алексей", vehiclePlate: "А123ВС77" },
  { id: "o2", orderNumber: 1002, userId: "c2", managerId: "m2", vehicleId: "v2", type: "ttk", zone: "ttk", status: "processing", price: 85000, discount: 5000, promoCode: "FIRST10", estimatedReadyDate: "2026-04-12", notes: "Клиент просил ускорить", tags: ["срочно"], createdAt: "2026-03-25T11:30:00Z", updatedAt: "2026-04-08T09:00:00Z", clientName: "Смирнова А.В.", clientCompany: "ИП Смирнова А.В.", managerName: "Сидорова Мария", vehiclePlate: "В456ЕК50" },
  { id: "o3", orderNumber: 1003, userId: "c3", managerId: "m1", vehicleId: "v3", type: "sk", zone: "sk", status: "payment_pending", price: 120000, discount: 0, promoCode: null, estimatedReadyDate: null, notes: null, tags: [], createdAt: "2026-03-28T14:00:00Z", updatedAt: "2026-04-07T16:00:00Z", clientName: "Кузнецов М.А.", clientCompany: 'ООО "КаргоМосква"', managerName: "Петров Алексей", vehiclePlate: "С789НМ77" },
  { id: "o4", orderNumber: 1004, userId: "c4", managerId: "m3", vehicleId: "v4", type: "mkad_night", zone: "mkad", status: "documents_pending", price: 35000, discount: 0, promoCode: null, estimatedReadyDate: null, notes: "Нужна доверенность", tags: ["проблемный"], createdAt: "2026-04-01T09:00:00Z", updatedAt: "2026-04-09T10:00:00Z", clientName: "Попов Д.Н.", clientCompany: 'ООО "Экспресс Доставка"', managerName: "Козлов Дмитрий", vehiclePlate: "Е012ОР77" },
  { id: "o5", orderNumber: 1005, userId: "c5", managerId: "m2", vehicleId: "v5", type: "mkad_day", zone: "mkad", status: "submitted", price: 45000, discount: 0, promoCode: null, estimatedReadyDate: "2026-04-15", notes: null, tags: [], createdAt: "2026-04-02T08:30:00Z", updatedAt: "2026-04-09T11:00:00Z", clientName: "Морозов В.И.", clientCompany: 'ООО "МосТранс"', managerName: "Сидорова Мария", vehiclePlate: "К345ТУ50" },
  { id: "o6", orderNumber: 1006, userId: "c6", managerId: null, vehicleId: "v6", type: "ttk", zone: "ttk", status: "draft", price: 85000, discount: 0, promoCode: null, estimatedReadyDate: null, notes: null, tags: [], createdAt: "2026-04-05T16:00:00Z", updatedAt: "2026-04-05T16:00:00Z", clientName: "Фёдорова Е.С.", clientCompany: 'ООО "ГрузПеревозки"', managerName: null, vehiclePlate: "М678ХЦ77" },
  { id: "o7", orderNumber: 1007, userId: "c7", managerId: "m4", vehicleId: "v7", type: "mkad_day", zone: "mkad", status: "processing", price: 45000, discount: 3000, promoCode: "VIP2026", estimatedReadyDate: "2026-04-14", notes: null, tags: ["VIP", "повторный"], createdAt: "2026-04-06T10:00:00Z", updatedAt: "2026-04-09T15:00:00Z", clientName: "Алексеев П.А.", clientCompany: "ИП Алексеев П.А.", managerName: "Волкова Екатерина", vehiclePlate: "О901АВ99" },
  { id: "o8", orderNumber: 1008, userId: "c8", managerId: "m1", vehicleId: "v8", type: "sk", zone: "sk", status: "payment_pending", price: 120000, discount: 10000, promoCode: "PARTNER", estimatedReadyDate: null, notes: null, tags: [], createdAt: "2026-04-07T11:00:00Z", updatedAt: "2026-04-09T12:00:00Z", clientName: "Лебедев О.В.", clientCompany: 'ООО "Сити Карго"', managerName: "Петров Алексей", vehiclePlate: "Р234ГД77" },
  { id: "o9", orderNumber: 1009, userId: "c9", managerId: "m3", vehicleId: "v9", type: "mkad_night", zone: "mkad", status: "rejected", price: 35000, discount: 0, promoCode: null, estimatedReadyDate: null, notes: "Отклонено ЦОДД: несоответствие экокласса", tags: ["проблемный"], createdAt: "2026-04-07T14:00:00Z", updatedAt: "2026-04-10T09:00:00Z", clientName: "Новикова Т.И.", clientCompany: 'ООО "Экспресс Логистика"', managerName: "Козлов Дмитрий", vehiclePlate: "С567ЖЗ50" },
  { id: "o10", orderNumber: 1010, userId: "c10", managerId: "m4", vehicleId: "v10", type: "temp", zone: "mkad", status: "draft", price: 15000, discount: 0, promoCode: null, estimatedReadyDate: null, notes: null, tags: [], createdAt: "2026-04-08T09:00:00Z", updatedAt: "2026-04-08T09:00:00Z", clientName: "Соколов А.П.", clientCompany: 'ООО "МегаТранс"', managerName: "Волкова Екатерина", vehiclePlate: "Т890ИК77" },
  { id: "o11", orderNumber: 1011, userId: "c1", managerId: "m2", vehicleId: "v1", type: "ttk", zone: "ttk", status: "approved", price: 85000, discount: 5000, promoCode: null, estimatedReadyDate: "2026-04-01", notes: null, tags: ["VIP", "повторный"], createdAt: "2026-03-15T10:00:00Z", updatedAt: "2026-04-01T12:00:00Z", clientName: "Иванов С.П.", clientCompany: 'ООО "ТрансЛогистик"', managerName: "Сидорова Мария", vehiclePlate: "А123ВС77" },
  { id: "o12", orderNumber: 1012, userId: "c3", managerId: "m3", vehicleId: "v3", type: "mkad_day", zone: "mkad", status: "cancelled", price: 45000, discount: 0, promoCode: null, estimatedReadyDate: null, notes: "Клиент отказался", tags: [], createdAt: "2026-03-10T09:30:00Z", updatedAt: "2026-03-12T10:00:00Z", clientName: "Кузнецов М.А.", clientCompany: 'ООО "КаргоМосква"', managerName: "Козлов Дмитрий", vehiclePlate: "С789НМ77" },
  { id: "o13", orderNumber: 1013, userId: "c5", managerId: "m1", vehicleId: "v5", type: "mkad_day", zone: "mkad", status: "approved", price: 45000, discount: 0, promoCode: null, estimatedReadyDate: "2026-03-25", notes: null, tags: ["повторный"], createdAt: "2026-03-05T12:00:00Z", updatedAt: "2026-03-25T14:00:00Z", clientName: "Морозов В.И.", clientCompany: 'ООО "МосТранс"', managerName: "Петров Алексей", vehiclePlate: "К345ТУ50" },
  { id: "o14", orderNumber: 1014, userId: "c2", managerId: "m4", vehicleId: "v2", type: "mkad_day", zone: "mkad", status: "documents_pending", price: 45000, discount: 0, promoCode: null, estimatedReadyDate: null, notes: null, tags: ["срочно"], createdAt: "2026-04-09T08:00:00Z", updatedAt: "2026-04-09T08:00:00Z", clientName: "Смирнова А.В.", clientCompany: "ИП Смирнова А.В.", managerName: "Волкова Екатерина", vehiclePlate: "В456ЕК50" },
  { id: "o15", orderNumber: 1015, userId: "c4", managerId: "m2", vehicleId: "v4", type: "ttk", zone: "ttk", status: "processing", price: 85000, discount: 0, promoCode: null, estimatedReadyDate: "2026-04-18", notes: null, tags: [], createdAt: "2026-04-09T10:30:00Z", updatedAt: "2026-04-10T09:00:00Z", clientName: "Попов Д.Н.", clientCompany: 'ООО "Экспресс Доставка"', managerName: "Сидорова Мария", vehiclePlate: "Е012ОР77" },
  { id: "o16", orderNumber: 1016, userId: "c8", managerId: null, vehicleId: "v8", type: "mkad_day", zone: "mkad", status: "draft", price: 45000, discount: 0, promoCode: null, estimatedReadyDate: null, notes: null, tags: [], createdAt: "2026-04-10T07:30:00Z", updatedAt: "2026-04-10T07:30:00Z", clientName: "Лебедев О.В.", clientCompany: 'ООО "Сити Карго"', managerName: null, vehiclePlate: "Р234ГД77" },
  { id: "o17", orderNumber: 1017, userId: "c6", managerId: "m3", vehicleId: "v6", type: "mkad_night", zone: "mkad", status: "payment_pending", price: 35000, discount: 0, promoCode: null, estimatedReadyDate: null, notes: null, tags: [], createdAt: "2026-04-10T08:00:00Z", updatedAt: "2026-04-10T08:30:00Z", clientName: "Фёдорова Е.С.", clientCompany: 'ООО "ГрузПеревозки"', managerName: "Козлов Дмитрий", vehiclePlate: "М678ХЦ77" },
];

// ── Mock documents ───────────────────────────────────────────────────────

export const DOCUMENTS: MockDocument[] = [
  { id: "d1", orderId: "o2", userId: "c2", type: "pts", fileName: "ПТС_В456ЕК50.pdf", fileUrl: "#", fileSize: 2400000, mimeType: "application/pdf", status: "approved", rejectionReason: null, createdAt: "2026-03-26T10:00:00Z" },
  { id: "d2", orderId: "o2", userId: "c2", type: "sts", fileName: "СТС_В456ЕК50.pdf", fileUrl: "#", fileSize: 1800000, mimeType: "application/pdf", status: "approved", rejectionReason: null, createdAt: "2026-03-26T10:05:00Z" },
  { id: "d3", orderId: "o2", userId: "c2", type: "driver_license", fileName: "ВУ_Смирнова.jpg", fileUrl: "#", fileSize: 3200000, mimeType: "image/jpeg", status: "pending", rejectionReason: null, createdAt: "2026-03-26T10:10:00Z" },
  { id: "d4", orderId: "o4", userId: "c4", type: "pts", fileName: "ПТС_Е012ОР77.pdf", fileUrl: "#", fileSize: 2100000, mimeType: "application/pdf", status: "approved", rejectionReason: null, createdAt: "2026-04-01T09:30:00Z" },
  { id: "d5", orderId: "o4", userId: "c4", type: "power_of_attorney", fileName: "Доверенность_Попов.pdf", fileUrl: "#", fileSize: 1500000, mimeType: "application/pdf", status: "rejected", rejectionReason: "Истёк срок действия доверенности", createdAt: "2026-04-01T09:35:00Z" },
  { id: "d6", orderId: "o7", userId: "c7", type: "pts", fileName: "ПТС_О901АВ99.pdf", fileUrl: "#", fileSize: 2300000, mimeType: "application/pdf", status: "approved", rejectionReason: null, createdAt: "2026-04-06T11:00:00Z" },
  { id: "d7", orderId: "o7", userId: "c7", type: "sts", fileName: "СТС_О901АВ99.pdf", fileUrl: "#", fileSize: 1900000, mimeType: "application/pdf", status: "approved", rejectionReason: null, createdAt: "2026-04-06T11:05:00Z" },
  { id: "d8", orderId: "o7", userId: "c7", type: "application", fileName: "Заявление_Алексеев.pdf", fileUrl: "#", fileSize: 800000, mimeType: "application/pdf", status: "approved", rejectionReason: null, createdAt: "2026-04-06T11:10:00Z" },
  { id: "d9", orderId: "o14", userId: "c2", type: "pts", fileName: "ПТС_В456ЕК50_2.pdf", fileUrl: "#", fileSize: 2400000, mimeType: "application/pdf", status: "pending", rejectionReason: null, createdAt: "2026-04-09T08:10:00Z" },
];

// ── Mock payments ────────────────────────────────────────────────────────

export const PAYMENTS: MockPayment[] = [
  { id: "p1", orderId: "o1", orderNumber: 1001, userId: "c1", clientName: "Иванов С.П.", amount: 45000, currency: "RUB", status: "succeeded", provider: "yookassa", externalId: "yk_001", paidAt: "2026-03-22T14:00:00Z", createdAt: "2026-03-22T13:50:00Z" },
  { id: "p2", orderId: "o2", orderNumber: 1002, userId: "c2", clientName: "Смирнова А.В.", amount: 80000, currency: "RUB", status: "succeeded", provider: "yookassa", externalId: "yk_002", paidAt: "2026-03-28T10:00:00Z", createdAt: "2026-03-28T09:45:00Z" },
  { id: "p3", orderId: "o3", orderNumber: 1003, userId: "c3", clientName: "Кузнецов М.А.", amount: 120000, currency: "RUB", status: "pending", provider: "yookassa", externalId: null, paidAt: null, createdAt: "2026-04-07T16:05:00Z" },
  { id: "p4", orderId: "o5", orderNumber: 1005, userId: "c5", clientName: "Морозов В.И.", amount: 45000, currency: "RUB", status: "succeeded", provider: "yookassa", externalId: "yk_004", paidAt: "2026-04-03T09:00:00Z", createdAt: "2026-04-03T08:50:00Z" },
  { id: "p5", orderId: "o7", orderNumber: 1007, userId: "c7", clientName: "Алексеев П.А.", amount: 42000, currency: "RUB", status: "succeeded", provider: "yookassa", externalId: "yk_005", paidAt: "2026-04-07T11:00:00Z", createdAt: "2026-04-07T10:50:00Z" },
  { id: "p6", orderId: "o8", orderNumber: 1008, userId: "c8", clientName: "Лебедев О.В.", amount: 110000, currency: "RUB", status: "pending", provider: "yookassa", externalId: null, paidAt: null, createdAt: "2026-04-09T12:05:00Z" },
  { id: "p7", orderId: "o11", orderNumber: 1011, userId: "c1", clientName: "Иванов С.П.", amount: 80000, currency: "RUB", status: "succeeded", provider: "yookassa", externalId: "yk_007", paidAt: "2026-03-17T15:00:00Z", createdAt: "2026-03-17T14:45:00Z" },
  { id: "p8", orderId: "o12", orderNumber: 1012, userId: "c3", clientName: "Кузнецов М.А.", amount: 45000, currency: "RUB", status: "refunded", provider: "yookassa", externalId: "yk_008", paidAt: "2026-03-11T10:00:00Z", createdAt: "2026-03-10T16:00:00Z" },
  { id: "p9", orderId: "o13", orderNumber: 1013, userId: "c5", clientName: "Морозов В.И.", amount: 45000, currency: "RUB", status: "succeeded", provider: "yookassa", externalId: "yk_009", paidAt: "2026-03-07T12:00:00Z", createdAt: "2026-03-07T11:50:00Z" },
  { id: "p10", orderId: "o15", orderNumber: 1015, userId: "c4", clientName: "Попов Д.Н.", amount: 85000, currency: "RUB", status: "succeeded", provider: "yookassa", externalId: "yk_010", paidAt: "2026-04-09T14:00:00Z", createdAt: "2026-04-09T13:50:00Z" },
  { id: "p11", orderId: "o9", orderNumber: 1009, userId: "c9", clientName: "Новикова Т.И.", amount: 35000, currency: "RUB", status: "cancelled", provider: "yookassa", externalId: "yk_011", paidAt: null, createdAt: "2026-04-08T10:00:00Z" },
  { id: "p12", orderId: "o17", orderNumber: 1017, userId: "c6", clientName: "Фёдорова Е.С.", amount: 35000, currency: "RUB", status: "pending", provider: "yookassa", externalId: null, paidAt: null, createdAt: "2026-04-10T08:35:00Z" },
];

// ── Mock permits ─────────────────────────────────────────────────────────

export const PERMITS: MockPermit[] = [
  { id: "pm1", orderId: "o1", userId: "c1", permitNumber: "ПР-2026-00451", zone: "mkad", type: "mkad_day", validFrom: "2026-04-05", validUntil: "2027-04-05", status: "active", createdAt: "2026-04-05T14:00:00Z", clientName: "Иванов С.П.", vehiclePlate: "А123ВС77" },
  { id: "pm2", orderId: "o11", userId: "c1", permitNumber: "ПР-2026-00398", zone: "ttk", type: "ttk", validFrom: "2026-04-01", validUntil: "2027-04-01", status: "active", createdAt: "2026-04-01T12:00:00Z", clientName: "Иванов С.П.", vehiclePlate: "А123ВС77" },
  { id: "pm3", orderId: "o13", userId: "c5", permitNumber: "ПР-2026-00320", zone: "mkad", type: "mkad_day", validFrom: "2026-03-25", validUntil: "2027-03-25", status: "active", createdAt: "2026-03-25T14:00:00Z", clientName: "Морозов В.И.", vehiclePlate: "К345ТУ50" },
];

// ── Mock status history ──────────────────────────────────────────────────

export const STATUS_HISTORY: MockStatusHistory[] = [
  { id: "sh1", orderId: "o2", fromStatus: null, toStatus: "draft", changedBy: "c2", changedByName: "Смирнова А.В.", comment: "Заявка создана", createdAt: "2026-03-25T11:30:00Z" },
  { id: "sh2", orderId: "o2", fromStatus: "draft", toStatus: "documents_pending", changedBy: "m2", changedByName: "Сидорова Мария", comment: "Запрошены документы", createdAt: "2026-03-25T12:00:00Z" },
  { id: "sh3", orderId: "o2", fromStatus: "documents_pending", toStatus: "payment_pending", changedBy: "m2", changedByName: "Сидорова Мария", comment: "Документы проверены, ожидаем оплату", createdAt: "2026-03-27T10:00:00Z" },
  { id: "sh4", orderId: "o2", fromStatus: "payment_pending", toStatus: "processing", changedBy: "m2", changedByName: "Сидорова Мария", comment: "Оплата получена, начинаем обработку", createdAt: "2026-03-28T10:30:00Z" },
  { id: "sh5", orderId: "o1", fromStatus: null, toStatus: "draft", changedBy: "c1", changedByName: "Иванов С.П.", comment: null, createdAt: "2026-03-20T10:00:00Z" },
  { id: "sh6", orderId: "o1", fromStatus: "draft", toStatus: "documents_pending", changedBy: "m1", changedByName: "Петров Алексей", comment: null, createdAt: "2026-03-20T10:30:00Z" },
  { id: "sh7", orderId: "o1", fromStatus: "documents_pending", toStatus: "payment_pending", changedBy: "m1", changedByName: "Петров Алексей", comment: "Все документы в порядке", createdAt: "2026-03-21T09:00:00Z" },
  { id: "sh8", orderId: "o1", fromStatus: "payment_pending", toStatus: "processing", changedBy: "m1", changedByName: "Петров Алексей", comment: null, createdAt: "2026-03-22T15:00:00Z" },
  { id: "sh9", orderId: "o1", fromStatus: "processing", toStatus: "submitted", changedBy: "m1", changedByName: "Петров Алексей", comment: "Заявка подана в ЦОДД", createdAt: "2026-03-28T10:00:00Z" },
  { id: "sh10", orderId: "o1", fromStatus: "submitted", toStatus: "approved", changedBy: "m1", changedByName: "Петров Алексей", comment: "Пропуск одобрен! Номер: ПР-2026-00451", createdAt: "2026-04-05T14:00:00Z" },
];

// ── Mock comments ────────────────────────────────────────────────────────

export const COMMENTS: MockComment[] = [
  { id: "cm1", orderId: "o2", authorId: "m2", authorName: "Сидорова Мария", authorInitials: "СМ", text: "Запросила у клиента дополнительные документы по ТС", createdAt: "2026-03-25T12:00:00Z" },
  { id: "cm2", orderId: "o2", authorId: "m1", authorName: "Петров Алексей", authorInitials: "ПА", text: "@Сидорова Мария, обрати внимание на экокласс — может потребоваться справка", createdAt: "2026-03-25T14:00:00Z" },
  { id: "cm3", orderId: "o2", authorId: "m2", authorName: "Сидорова Мария", authorInitials: "СМ", text: "Спасибо, проверила. Экокласс в норме, Евро-4", createdAt: "2026-03-26T09:00:00Z" },
  { id: "cm4", orderId: "o4", authorId: "m3", authorName: "Козлов Дмитрий", authorInitials: "КД", text: "Доверенность просрочена, запросил новую у клиента", createdAt: "2026-04-02T10:00:00Z" },
  { id: "cm5", orderId: "o4", authorId: "m3", authorName: "Козлов Дмитрий", authorInitials: "КД", text: "Клиент обещал прислать новую доверенность до конца недели", createdAt: "2026-04-03T15:00:00Z" },
  { id: "cm6", orderId: "o9", authorId: "m3", authorName: "Козлов Дмитрий", authorInitials: "КД", text: "ЦОДД отклонил заявку — экокласс ТС не соответствует требованиям для ночного МКАД. Нужно обсудить с клиентом варианты.", createdAt: "2026-04-10T09:30:00Z" },
];

// ── Mock audit log ───────────────────────────────────────────────────────

export const AUDIT_LOG: MockAuditEntry[] = [
  { id: "a1", userId: "admin1", userName: "Администратор", action: "login", entityType: "session", entityId: "s1", details: "Вход в систему", ipAddress: "185.220.101.45", createdAt: "2026-04-10T08:00:00Z" },
  { id: "a2", userId: "m1", userName: "Петров Алексей", action: "login", entityType: "session", entityId: "s2", details: "Вход в систему", ipAddress: "95.165.12.34", createdAt: "2026-04-10T08:15:00Z" },
  { id: "a3", userId: "m2", userName: "Сидорова Мария", action: "status_change", entityType: "order", entityId: "o15", details: "Статус: documents_pending → processing", ipAddress: "95.165.12.35", createdAt: "2026-04-10T09:00:00Z" },
  { id: "a4", userId: "m3", userName: "Козлов Дмитрий", action: "document_review", entityType: "document", entityId: "d5", details: "Документ отклонён: Истёк срок действия доверенности", ipAddress: "95.165.12.36", createdAt: "2026-04-09T10:30:00Z" },
  { id: "a5", userId: "admin1", userName: "Администратор", action: "settings_change", entityType: "settings", entityId: "pricing", details: "Обновлены тарифы: МКАД дневной 42000 → 45000", ipAddress: "185.220.101.45", createdAt: "2026-04-09T09:00:00Z" },
  { id: "a6", userId: "m1", userName: "Петров Алексей", action: "status_change", entityType: "order", entityId: "o1", details: "Статус: submitted → approved", ipAddress: "95.165.12.34", createdAt: "2026-04-05T14:00:00Z" },
  { id: "a7", userId: "m4", userName: "Волкова Екатерина", action: "login", entityType: "session", entityId: "s3", details: "Вход в систему", ipAddress: "95.165.12.37", createdAt: "2026-04-10T08:30:00Z" },
  { id: "a8", userId: "m2", userName: "Сидорова Мария", action: "assign_manager", entityType: "order", entityId: "o15", details: "Назначен менеджер: Сидорова Мария", ipAddress: "95.165.12.35", createdAt: "2026-04-09T10:35:00Z" },
  { id: "a9", userId: "m3", userName: "Козлов Дмитрий", action: "status_change", entityType: "order", entityId: "o9", details: "Статус: submitted → rejected", ipAddress: "95.165.12.36", createdAt: "2026-04-10T09:00:00Z" },
  { id: "a10", userId: "admin1", userName: "Администратор", action: "user_create", entityType: "user", entityId: "m4", details: "Создан менеджер: Волкова Екатерина", ipAddress: "185.220.101.45", createdAt: "2025-01-20T10:00:00Z" },
  { id: "a11", userId: "m1", userName: "Петров Алексей", action: "document_review", entityType: "document", entityId: "d1", details: "Документ одобрен: ПТС_В456ЕК50.pdf", ipAddress: "95.165.12.34", createdAt: "2026-03-27T09:00:00Z" },
  { id: "a12", userId: "m2", userName: "Сидорова Мария", action: "payment_confirm", entityType: "payment", entityId: "p2", details: "Подтверждена оплата 80 000 ₽", ipAddress: "95.165.12.35", createdAt: "2026-03-28T10:05:00Z" },
  { id: "a13", userId: "admin1", userName: "Администратор", action: "settings_change", entityType: "settings", entityId: "notifications", details: "Обновлён шаблон уведомления: order_approved", ipAddress: "185.220.101.45", createdAt: "2026-04-08T11:00:00Z" },
  { id: "a14", userId: "m4", userName: "Волкова Екатерина", action: "status_change", entityType: "order", entityId: "o7", details: "Статус: payment_pending → processing", ipAddress: "95.165.12.37", createdAt: "2026-04-08T09:00:00Z" },
  { id: "a15", userId: "m1", userName: "Петров Алексей", action: "comment_add", entityType: "order", entityId: "o2", details: "Добавлен комментарий к заявке #1002", ipAddress: "95.165.12.34", createdAt: "2026-03-25T14:00:00Z" },
  { id: "a16", userId: "admin1", userName: "Администратор", action: "settings_change", entityType: "settings", entityId: "team", details: "Обновлена роль: Козлов Дмитрий → старший менеджер", ipAddress: "185.220.101.45", createdAt: "2026-04-01T10:00:00Z" },
  { id: "a17", userId: "m3", userName: "Козлов Дмитрий", action: "export_data", entityType: "report", entityId: "orders_march", details: "Экспорт заявок за март 2026", ipAddress: "95.165.12.36", createdAt: "2026-04-01T11:00:00Z" },
  { id: "a18", userId: "m2", userName: "Сидорова Мария", action: "login", entityType: "session", entityId: "s4", details: "Вход в систему", ipAddress: "95.165.12.35", createdAt: "2026-04-10T08:20:00Z" },
  { id: "a19", userId: "m1", userName: "Петров Алексей", action: "status_change", entityType: "order", entityId: "o8", details: "Статус: documents_pending → payment_pending", ipAddress: "95.165.12.34", createdAt: "2026-04-09T12:00:00Z" },
  { id: "a20", userId: "admin1", userName: "Администратор", action: "logout", entityType: "session", entityId: "s1", details: "Выход из системы", ipAddress: "185.220.101.45", createdAt: "2026-04-09T18:00:00Z" },
];

// ── Helper functions ─────────────────────────────────────────────────────

export const ORDER_TYPE_LABELS: Record<string, string> = {
  mkad_day: "МКАД дневной",
  mkad_night: "МКАД ночной",
  ttk: "ТТК",
  sk: "Садовое кольцо",
  temp: "Временный",
};

export const ZONE_LABELS: Record<string, string> = {
  mkad: "МКАД",
  ttk: "ТТК",
  sk: "СК",
};

export const DOCUMENT_TYPE_LABELS: Record<string, string> = {
  pts: "ПТС",
  sts: "СТС",
  driver_license: "Водительское удостоверение",
  power_of_attorney: "Доверенность",
  application: "Заявление",
  contract: "Договор",
  other: "Прочее",
};

export const TAG_STYLES: Record<string, string> = {
  "срочно": "bg-red-100 text-red-700 border-red-200",
  "VIP": "bg-purple-100 text-purple-700 border-purple-200",
  "проблемный": "bg-orange-100 text-orange-700 border-orange-200",
  "повторный": "bg-blue-100 text-blue-700 border-blue-200",
};

export function formatPrice(price: number): string {
  return new Intl.NumberFormat("ru-RU").format(price) + " \u20BD";
}

export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("ru-RU", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

export function formatDateTime(dateStr: string): string {
  return new Date(dateStr).toLocaleString("ru-RU", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}
