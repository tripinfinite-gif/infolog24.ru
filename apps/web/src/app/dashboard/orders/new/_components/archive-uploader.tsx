"use client";

import { useCallback, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  AlertCircle,
  CheckCircle2,
  FileArchive,
  Loader2,
  Upload,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface VehicleOption {
  id: string;
  brand: string;
  model: string;
  licensePlate: string;
}

interface ArchiveUploaderProps {
  vehicles: VehicleOption[];
}

interface UploadResult {
  ok: boolean;
  orderId?: string;
  filesUploaded?: number;
  documents?: Array<{
    id: string;
    name: string;
    type: string;
    confidence: string;
    source: string;
  }>;
  vehicleHint?: { plate?: string | null; brand?: string | null; model?: string | null };
  skipped?: Array<{ name: string; reason: string }>;
  error?: string;
  message?: string;
  redirectTo?: string;
}

const TYPE_LABELS: Record<string, string> = {
  sts: "СТС",
  pts: "ПТС",
  driver_license: "Водительское удостоверение",
  power_of_attorney: "Доверенность",
  contract: "Договор",
  application: "Заявление",
  other: "Прочее",
};

const SKIP_REASONS: Record<string, string> = {
  bad_extension: "неподдерживаемый формат",
  file_too_large: "файл слишком большой",
  path_traversal: "подозрительный путь",
  magic_mismatch: "содержимое не соответствует расширению",
  compression_ratio: "слишком высокая степень сжатия",
};

export function ArchiveUploader({ vehicles }: ArchiveUploaderProps) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [result, setResult] = useState<UploadResult | null>(null);
  const [vehicleId, setVehicleId] = useState<string>("auto");
  const [zone, setZone] = useState<"mkad" | "ttk" | "sk">("mkad");
  const [notes, setNotes] = useState("");

  const onFileChosen = useCallback((f: File | null) => {
    setResult(null);
    setFile(f);
  }, []);

  const onDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragging(false);
      const f = e.dataTransfer.files?.[0] ?? null;
      onFileChosen(f);
    },
    [onFileChosen],
  );

  const onSubmit = async () => {
    if (!file || isUploading) return;
    setIsUploading(true);
    setResult(null);

    try {
      const formData = new FormData();
      formData.append("archive", file);
      if (vehicleId !== "auto") formData.append("vehicleId", vehicleId);
      formData.append("zone", zone);
      if (notes.trim()) formData.append("notes", notes.trim());

      const res = await fetch("/api/orders/from-archive", {
        method: "POST",
        body: formData,
      });
      const data: UploadResult = await res.json();
      setResult(data);

      if (data.ok && data.redirectTo) {
        // Небольшая пауза, чтобы клиент увидел список загруженного, потом редирект
        setTimeout(() => router.push(data.redirectTo!), 2500);
      }
    } catch (error) {
      setResult({
        ok: false,
        error: "network",
        message: (error as Error).message ?? "Ошибка сети",
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Drop zone */}
      <div
        onClick={() => fileInputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={onDrop}
        className={cn(
          "flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed p-10 text-center transition-colors",
          isDragging
            ? "border-primary bg-primary/5"
            : "border-muted-foreground/25 hover:border-primary hover:bg-muted/30",
          file && "border-primary/60 bg-primary/5",
        )}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".zip,application/zip,application/x-zip-compressed"
          className="hidden"
          onChange={(e) => onFileChosen(e.target.files?.[0] ?? null)}
        />
        {file ? (
          <>
            <FileArchive className="mb-3 size-10 text-primary" />
            <p className="text-base font-medium">{file.name}</p>
            <p className="mt-1 text-sm text-muted-foreground">
              {(file.size / 1024 / 1024).toFixed(2)} МБ — нажмите «Загрузить»
            </p>
            <Button
              variant="link"
              size="sm"
              type="button"
              className="mt-2"
              onClick={(e) => {
                e.stopPropagation();
                onFileChosen(null);
              }}
            >
              Выбрать другой файл
            </Button>
          </>
        ) : (
          <>
            <Upload className="mb-3 size-10 text-muted-foreground" />
            <p className="text-base font-medium">
              Перетащите ZIP-архив сюда или нажмите для выбора
            </p>
            <p className="mt-2 max-w-md text-sm text-muted-foreground">
              Поддерживаются JPG, PNG, WebP, HEIC, PDF внутри ZIP. До 50 МБ
              на архив, 50 файлов, 10 МБ на каждый.
            </p>
          </>
        )}
      </div>

      {/* Параметры */}
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="vehicle">Грузовик</Label>
          <Select value={vehicleId} onValueChange={setVehicleId}>
            <SelectTrigger id="vehicle">
              <SelectValue placeholder="Выберите грузовик" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="auto">
                Распознать автоматически из СТС/ПТС
              </SelectItem>
              {vehicles.map((v) => (
                <SelectItem key={v.id} value={v.id}>
                  {v.brand} {v.model} — {v.licensePlate}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="text-xs text-muted-foreground">
            Если оставить «автоматически», мы распакуем СТС/ПТС из архива и
            создадим новую карточку грузовика.
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="zone">Зона пропуска</Label>
          <Select value={zone} onValueChange={(v) => setZone(v as "mkad" | "ttk" | "sk")}>
            <SelectTrigger id="zone">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="mkad">МКАД</SelectItem>
              <SelectItem value="ttk">ТТК</SelectItem>
              <SelectItem value="sk">Садовое кольцо</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes">Заметки для менеджера (опционально)</Label>
        <Textarea
          id="notes"
          rows={3}
          maxLength={1000}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Например: срочно, нужен пропуск к понедельнику"
        />
      </div>

      <Button
        type="button"
        size="lg"
        className="w-full sm:w-auto"
        disabled={!file || isUploading}
        onClick={onSubmit}
      >
        {isUploading ? (
          <>
            <Loader2 className="mr-2 size-4 animate-spin" />
            Распаковываем и создаём заявку…
          </>
        ) : (
          <>
            <Upload className="mr-2 size-4" />
            Загрузить и создать заявку
          </>
        )}
      </Button>

      {/* Результат */}
      {result && (
        <div
          className={cn(
            "rounded-xl border p-4",
            result.ok
              ? "border-green-200 bg-green-50 dark:border-green-900 dark:bg-green-950/30"
              : "border-red-200 bg-red-50 dark:border-red-900 dark:bg-red-950/30",
          )}
        >
          <div className="flex items-start gap-3">
            {result.ok ? (
              <CheckCircle2 className="size-5 shrink-0 text-green-600" />
            ) : (
              <AlertCircle className="size-5 shrink-0 text-red-600" />
            )}
            <div className="flex-1 space-y-2">
              <p className="font-medium">
                {result.ok
                  ? `Заявка создана! Загружено документов: ${result.filesUploaded}`
                  : result.message ?? "Не удалось обработать архив"}
              </p>

              {result.ok && result.vehicleHint?.plate && (
                <p className="text-sm text-muted-foreground">
                  Распознан грузовик:{" "}
                  <Badge variant="outline">
                    {result.vehicleHint.brand} {result.vehicleHint.model} —{" "}
                    {result.vehicleHint.plate}
                  </Badge>
                </p>
              )}

              {result.ok && result.documents && result.documents.length > 0 && (
                <div className="space-y-1 text-sm">
                  <p className="text-muted-foreground">Документы:</p>
                  <ul className="space-y-1">
                    {result.documents.map((d) => (
                      <li key={d.id} className="flex items-center gap-2">
                        <CheckCircle2 className="size-3 text-green-600" />
                        <span>{d.name}</span>
                        <Badge variant="secondary" className="text-xs">
                          {TYPE_LABELS[d.type] ?? d.type}
                        </Badge>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {result.skipped && result.skipped.length > 0 && (
                <div className="space-y-1 text-sm">
                  <p className="text-muted-foreground">Пропущено:</p>
                  <ul className="space-y-1">
                    {result.skipped.map((s) => (
                      <li key={s.name} className="text-xs text-muted-foreground">
                        {s.name} — {SKIP_REASONS[s.reason] ?? s.reason}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {result.ok && (
                <p className="text-xs text-muted-foreground">
                  Через мгновение откроется страница заявки…
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
