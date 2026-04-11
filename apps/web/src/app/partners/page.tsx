import type { Metadata } from "next";

import { PartnersClient } from "./partners-client";

export const metadata: Metadata = {
  title: "Партнёрская программа | Инфолог24",
  description:
    "Зарабатывайте с Инфолог24. Агентское вознаграждение за привлечённых клиентов, промоматериалы, персональный менеджер.",
  openGraph: {
    title: "Партнёрская программа | Инфолог24",
    description: "Зарабатывайте с Инфолог24. Партнёрская программа.",
    type: "website",
  },
};

export default function PartnersPage() {
  return <PartnersClient />;
}
