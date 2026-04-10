import type { Metadata } from "next";

import { PartnersClient } from "./partners-client";

export const metadata: Metadata = {
  title: "Партнёрская программа | Инфологистик-24",
  description:
    "Зарабатывайте с Инфологистик-24. Агентское вознаграждение за привлечённых клиентов, промоматериалы, персональный менеджер.",
  openGraph: {
    title: "Партнёрская программа | Инфологистик-24",
    description: "Зарабатывайте с Инфологистик-24. Партнёрская программа.",
    type: "website",
  },
};

export default function PartnersPage() {
  return <PartnersClient />;
}
