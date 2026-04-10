import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Статус системы — Инфологистик-24",
  description: "Текущий статус всех систем Инфологистик-24",
};

interface SystemStatus {
  name: string;
  status: "operational" | "degraded" | "down";
  label: string;
}

const systems: SystemStatus[] = [
  { name: "Сайт", status: "operational", label: "Работает" },
  { name: "API", status: "operational", label: "Работает" },
  { name: "База данных", status: "operational", label: "Работает" },
  { name: "Платежи", status: "operational", label: "Работает" },
  { name: "Telegram-бот", status: "operational", label: "Работает" },
];

const statusColors: Record<SystemStatus["status"], string> = {
  operational: "bg-green-500",
  degraded: "bg-yellow-500",
  down: "bg-red-500",
};

export default function StatusPage() {
  const allOperational = systems.every((s) => s.status === "operational");
  const now = new Date().toLocaleString("ru-RU", {
    timeZone: "Europe/Moscow",
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="mx-auto max-w-2xl px-4 py-16">
      <h1 className="mb-2 text-3xl font-bold">Статус системы</h1>

      <div className="mb-8 rounded-lg border p-4">
        {allOperational ? (
          <div className="flex items-center gap-3">
            <span className="inline-block h-3 w-3 rounded-full bg-green-500" />
            <span className="text-lg font-medium text-green-700">
              Все системы работают нормально
            </span>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <span className="inline-block h-3 w-3 rounded-full bg-yellow-500" />
            <span className="text-lg font-medium text-yellow-700">
              Ведутся работы
            </span>
          </div>
        )}
      </div>

      <div className="space-y-3">
        {systems.map((system) => (
          <div
            key={system.name}
            className="flex items-center justify-between rounded-lg border p-4"
          >
            <span className="font-medium">{system.name}</span>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">{system.label}</span>
              <span
                className={`inline-block h-2.5 w-2.5 rounded-full ${statusColors[system.status]}`}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 text-sm text-gray-500">
        <p>Обновлено: {now} (МСК)</p>
        <p className="mt-2">
          Следите за обновлениями в нашем{" "}
          <a
            href="https://t.me/infolog24"
            className="text-blue-600 hover:underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            Telegram-канале
          </a>
        </p>
      </div>
    </div>
  );
}
