import type { Metadata } from "next";
import { SubmitArchiveForm } from "./_components/submit-archive-form";

export const metadata: Metadata = {
  title: "Новая заявка — Партнёрский портал",
};

export default function NewPassPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          Новая заявка на пропуск
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Заполните данные ТС и загрузите архив с документами клиента. Система
          автоматически определит документы и рассчитает вашу комиссию.
        </p>
      </div>
      <SubmitArchiveForm />
    </div>
  );
}
