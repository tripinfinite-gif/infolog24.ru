import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/session";
import { AdminShell } from "./_components/admin-shell";

export const metadata: Metadata = {
  title: {
    default: "Панель управления — Инфолог24",
    template: "%s — Админ — Инфолог24",
  },
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  if (!session) {
    redirect("/login?callbackUrl=/admin");
  }

  const userRole = (session.user as Record<string, unknown>).role as
    | string
    | undefined;

  if (!userRole || !["admin", "manager"].includes(userRole)) {
    redirect("/dashboard");
  }

  return (
    <AdminShell
      userName={session.user.name ?? session.user.email}
      userRole={userRole}
    >
      {children}
    </AdminShell>
  );
}
