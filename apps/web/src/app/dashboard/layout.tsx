import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/session";
import { DashboardShell } from "./_components/dashboard-shell";

export const metadata: Metadata = {
  title: {
    default: "Личный кабинет — Инфологистик-24",
    template: "%s — Инфологистик-24",
  },
};

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  if (!session) {
    redirect("/auth/login");
  }

  return (
    <DashboardShell
      userName={session.user.name ?? session.user.email}
      userEmail={session.user.email}
    >
      {children}
    </DashboardShell>
  );
}
