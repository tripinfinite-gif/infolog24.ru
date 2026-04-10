import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    default: "Партнёрский портал — Инфологистик-24",
    template: "%s — Партнёрский портал — Инфологистик-24",
  },
};

export default function PartnerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
