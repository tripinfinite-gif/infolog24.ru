import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    default: "Партнёрский портал — Инфолог24",
    template: "%s — Партнёрский портал — Инфолог24",
  },
};

export default function PartnerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
