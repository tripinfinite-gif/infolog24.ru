import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { documents } from "@/lib/db/schema";
import type { NewDocument, Document } from "@/lib/types";
import { logger } from "@/lib/logger";

export async function uploadDocument(
  data: Omit<NewDocument, "id" | "createdAt">,
): Promise<Document> {
  const [doc] = await db.insert(documents).values(data).returning();

  if (!doc) throw new Error("Failed to create document");

  logger.info({ documentId: doc.id, orderId: data.orderId }, "Document uploaded");
  return doc;
}

export async function getDocumentsByOrder(
  orderId: string,
): Promise<Document[]> {
  return db.query.documents.findMany({
    where: eq(documents.orderId, orderId),
  });
}

export async function getDocumentsByUser(
  userId: string,
): Promise<Document[]> {
  return db.query.documents.findMany({
    where: eq(documents.userId, userId),
  });
}

export async function getDocumentById(id: string): Promise<Document | null> {
  const doc = await db.query.documents.findFirst({
    where: eq(documents.id, id),
  });
  return doc ?? null;
}

export async function updateDocumentStatus(
  id: string,
  status: Document["status"],
  rejectionReason?: string,
): Promise<Document> {
  const [updated] = await db
    .update(documents)
    .set({ status, rejectionReason: rejectionReason ?? null })
    .where(eq(documents.id, id))
    .returning();

  if (!updated) throw new Error("Document not found");

  logger.info({ documentId: id, status }, "Document status updated");
  return updated;
}
