import type { Metadata } from "next";
import { AdminShell } from "./_components/admin-shell";

export const metadata: Metadata = {
  title: {
    default: "Панель управления — Инфологистик-24",
    template: "%s — Админ — Инфологистик-24",
  },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AdminShell>{children}</AdminShell>;
}
