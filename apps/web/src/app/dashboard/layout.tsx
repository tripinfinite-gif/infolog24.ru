import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/session";
import { ChatWidget } from "@/components/chat/chat-widget";
import { DashboardShell } from "./_components/dashboard-shell";

export const metadata: Metadata = {
  title: {
    default: "Личный кабинет — Инфолог24",
    template: "%s — Инфолог24",
  },
};

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  if (!session) {
    redirect("/login");
  }

  return (
    <>
      <DashboardShell
        userName={session.user.name ?? session.user.email}
        userEmail={session.user.email}
      >
        {children}
      </DashboardShell>
      <ChatWidget isAuthenticated />
    </>
  );
}
