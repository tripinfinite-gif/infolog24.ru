import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/session";
import { getDocumentsByUser } from "@/lib/dal/documents";
import { DocumentsList } from "./_components/documents-list";

export const metadata: Metadata = {
  title: "Документы",
};

export default async function DocumentsPage() {
  const session = await getSession();
  if (!session) redirect("/auth/login");

  const documents = await getDocumentsByUser(session.user.id);

  return <DocumentsList documents={documents} />;
}
