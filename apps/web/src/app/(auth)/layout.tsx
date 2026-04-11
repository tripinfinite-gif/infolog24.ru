import { Truck } from "lucide-react";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Авторизация — Инфолог24",
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-muted/30 px-4 py-12">
      <Link
        href="/"
        className="mb-8 flex items-center gap-2 text-xl font-bold"
      >
        <Truck className="size-7 text-primary" />
        Инфолог24
      </Link>
      <div className="w-full max-w-md">{children}</div>
    </div>
  );
}
