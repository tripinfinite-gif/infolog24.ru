"use client";

import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ExportButtonProps {
  data: Record<string, unknown>[];
  filename: string;
  columns: { key: string; label: string }[];
}

export function ExportButton({ data, filename, columns }: ExportButtonProps) {
  function handleExport() {
    // BOM for Excel compatibility with UTF-8
    const BOM = "\uFEFF";
    const header = columns.map((c) => c.label).join(";");
    const rows = data.map((row) =>
      columns
        .map((c) => {
          const val = row[c.key];
          const str = val == null ? "" : String(val);
          // Escape quotes and wrap in quotes if contains separator
          if (str.includes(";") || str.includes('"') || str.includes("\n")) {
            return `"${str.replace(/"/g, '""')}"`;
          }
          return str;
        })
        .join(";")
    );
    const csv = BOM + [header, ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${filename}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  return (
    <Button variant="outline" onClick={handleExport}>
      <Download className="size-4 mr-2" />
      Экспорт CSV
    </Button>
  );
}
