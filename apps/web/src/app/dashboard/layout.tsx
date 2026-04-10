import type { Metadata } from "next";
import { DashboardShell } from "./_components/dashboard-shell";

export const metadata: Metadata = {
  title: {
    default: "Личный кабинет — Инфологистик-24",
    template: "%s — Инфологистик-24",
  },
};

// TODO: Replace with real auth check when DB is connected
// import { requireSession } from "@/lib/auth/session";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DashboardShell>{children}</DashboardShell>;
}
