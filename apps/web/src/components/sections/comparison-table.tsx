"use client";

import { motion } from "framer-motion";
import { Check, Minus, X } from "lucide-react";

import { cn } from "@/lib/utils";

interface ComparisonTableProps {
  className?: string;
}

type CellValue = "yes" | "no" | "partial" | string;

interface ComparisonRow {
  label: string;
  self: CellValue;
  cheap: CellValue;
  us: CellValue;
}

const rows: ComparisonRow[] = [
  {
    label: "Срок оформления",
    self: "2-4 недели",
    cheap: "1-2 недели",
    us: "3 дня",
  },
  {
    label: "Гарантия результата",
    self: "no",
    cheap: "no",
    us: "yes",
  },
  {
    label: "Повторная подача",
    self: "Сами",
    cheap: "За доплату",
    us: "Бесплатно",
  },
  {
    label: "Временный пропуск",
    self: "no",
    cheap: "За доплату",
    us: "Бесплатно",
  },
  {
    label: "Договор и чеки",
    self: "partial",
    cheap: "no",
    us: "yes",
  },
  {
    label: "Возврат при отказе",
    self: "partial",
    cheap: "no",
    us: "yes",
  },
  {
    label: "Стоимость",
    self: "Бесплатно*",
    cheap: "от 5 000 ₽",
    us: "от 12 000 ₽",
  },
];

function CellContent({ value, highlight }: { value: CellValue; highlight?: boolean }) {
  if (value === "yes") {
    return (
      <span className="flex items-center justify-center">
        <Check className={cn("size-5", highlight ? "text-accent" : "text-green-600")} />
      </span>
    );
  }
  if (value === "no") {
    return (
      <span className="flex items-center justify-center">
        <X className="size-5 text-destructive/70" />
      </span>
    );
  }
  if (value === "partial") {
    return (
      <span className="flex items-center justify-center">
        <Minus className="size-5 text-muted-foreground/50" />
      </span>
    );
  }
  return <span className="text-sm">{value}</span>;
}

export function ComparisonTable({ className }: ComparisonTableProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className={cn(
        "overflow-hidden rounded-3xl bg-card p-6 sm:p-8",
        className
      )}
    >
      <div className="mb-6">
        <h2 className="font-heading text-2xl font-bold text-foreground sm:text-3xl">
          Почему мы, а не...
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          50 000+ клиентов уже сделали выбор
        </p>
      </div>

      <div className="overflow-x-auto -mx-6 px-6 sm:-mx-8 sm:px-8">
        <table className="w-full min-w-[500px]">
          <thead>
            <tr>
              <th className="w-[30%] pb-4 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground" />
              <th className="w-[20%] pb-4 text-center">
                <span className="text-xs font-medium text-muted-foreground">Сами</span>
              </th>
              <th className="w-[20%] pb-4 text-center">
                <span className="text-xs font-medium text-muted-foreground">Дешёвые</span>
              </th>
              <th className="w-[30%] pb-4 text-center">
                <div className="inline-flex flex-col items-center gap-1">
                  <span className="rounded-full bg-accent px-3 py-0.5 text-[10px] font-semibold text-accent-foreground">
                    Лучший выбор
                  </span>
                  <span className="text-xs font-bold text-foreground">Инфологистик-24</span>
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, index) => (
              <tr
                key={row.label}
                className="border-t border-border/30"
              >
                <td className="py-3.5 pr-4 text-sm font-medium text-foreground">
                  {row.label}
                </td>
                <td className="py-3.5 text-center text-sm text-muted-foreground">
                  <CellContent value={row.self} />
                </td>
                <td className="py-3.5 text-center text-sm text-muted-foreground">
                  <CellContent value={row.cheap} />
                </td>
                <td
                  className={cn(
                    "py-3.5 text-center text-sm font-medium text-foreground",
                    index === 0 && "rounded-t-xl",
                    index === rows.length - 1 && "rounded-b-xl",
                    "bg-primary/5"
                  )}
                >
                  <CellContent value={row.us} highlight />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}
