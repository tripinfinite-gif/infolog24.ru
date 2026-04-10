import type { Metadata } from "next";

import { CheckStatusClient } from "./check-status-client";

export const metadata: Metadata = {
  title: "Проверить статус пропуска | Инфологистик-24",
  description:
    "Проверьте статус оформления вашего пропуска по номеру заказа.",
  openGraph: {
    title: "Проверить статус пропуска | Инфологистик-24",
    description: "Проверьте статус оформления вашего пропуска.",
    type: "website",
  },
};

export default function CheckStatusPage() {
  return <CheckStatusClient />;
}
