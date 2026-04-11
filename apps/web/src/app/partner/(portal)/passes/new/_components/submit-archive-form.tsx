"use client";

import { useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Upload,
  FileArchive,
  AlertCircle,
  CheckCircle2,
  Loader2,
  XCircle,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";

import {
  submitPartnerArchive,
  type SubmitPartnerArchiveResult,
} from "../../_actions";
import {
  ORDER_TYPE_LABELS,
  ORDER_ZONE_LABELS,
  type OrderType,
  type OrderZone,
} from "@/lib/documents/required-docs";
import { formatRub } from "@/lib/partner/commission";

const ORDER_TYPES: OrderType[] = [
  "mkad_day",
  "mkad_night",
  "ttk",
  "sk",
  "temp",
];

const ORDER_ZONES: OrderZone[] = ["mkad", "ttk", "sk"];

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} Б`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} КБ`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} МБ`;
}

export function SubmitArchiveForm() {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isPending, startTransition] = useTransition();

  // Поля формы (контролируемые)
  const [brand, setBrand] = useState("");
  const [model, setModel] = useState("");
  const [plate, setPlate] = useState("");
  const [vin, setVin] = useState("");
  const [orderType, setOrderType] = useState<OrderType>("mkad_day");
  const [zone, setZone] = useState<OrderZone>("mkad");
  const [validFrom, setValidFrom] = useState("");
  const [validUntil, setValidUntil] = useState("");
  const [notes, setNotes] = useState("");

  // Файл и состояние dropzone
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  // Результат отправки
  const [result, setResult] = useState<SubmitPartnerArchiveResult | null>(null);

  // ── Обработка файла ────────────────────────────────────────────────────

  function handleFileSelect(selected: File | null) {
    if (!selected) {
      setFile(null);
      return;
    }
    if (!selected.name.toLowerCase().endsWith(".zip")) {
      toast.error("Поддерживаются только ZIP-архивы");
      return;
    }
    if (selected.size > 50 * 1024 * 1024) {
      toast.error("Размер архива превышает 50 МБ");
      return;
    }
    setFile(selected);
  }

  function handleDragOver(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }

  function handleDragLeave(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }

  function handleDrop(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const dropped = e.dataTransfer.files?.[0];
    if (dropped) handleFileSelect(dropped);
  }

  function handleFileInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const selected = e.target.files?.[0] ?? null;
    handleFileSelect(selected);
  }

  function clearFile() {
    setFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  // ── Сабмит ─────────────────────────────────────────────────────────────

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!file) {
      toast.error("Загрузите архив с документами");
      return;
    }
    if (!formRef.current) return;

    const fd = new FormData(formRef.current);
    fd.set("archive", file);

    startTransition(async () => {
      const res = await submitPartnerArchive(fd);
      setResult(res);
      if (res.ok) {
        if (res.status === "processing") {
          toast.success(
            `Заявка создана! Все документы на месте. Ваша комиссия: ${formatRub(res.commission.commission)}`,
          );
        } else {
          toast.warning(
            `Заявка создана, но не хватает: ${res.missingLabels.join(", ")}`,
          );
        }
      } else {
        toast.error(res.error);
      }
    });
  }

  // ── Успешный результат ─────────────────────────────────────────────────

  if (result?.ok) {
    return (
      <div className="space-y-4">
        {result.status === "processing" ? (
          <Alert className="border-green-500/40 bg-green-500/5">
            <CheckCircle2 className="h-4 w-4 text-green-600" />
            <AlertTitle className="text-green-700">
              Все документы на месте
            </AlertTitle>
            <AlertDescription className="text-green-700/90">
              Заявка передана в обработку. Мы уведомим вас об изменениях
              статуса.
            </AlertDescription>
          </Alert>
        ) : (
          <Alert className="border-yellow-500/40 bg-yellow-500/5">
            <AlertCircle className="h-4 w-4 text-yellow-700" />
            <AlertTitle className="text-yellow-800">
              Не хватает документов
            </AlertTitle>
            <AlertDescription className="text-yellow-800/90">
              <div className="mb-2">
                Заявка создана, но для подачи нужны ещё эти документы:
              </div>
              <ul className="space-y-1">
                {result.missingLabels.map((label) => (
                  <li key={label} className="flex items-center gap-2">
                    <XCircle className="h-4 w-4 text-yellow-700" />
                    <span>{label}</span>
                  </li>
                ))}
              </ul>
            </AlertDescription>
          </Alert>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Сводка по заявке</CardTitle>
            <CardDescription>Детали только что созданной заявки</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="rounded-lg border bg-muted/30 p-4">
                <div className="text-xs text-muted-foreground">Базовая цена</div>
                <div className="mt-1 text-lg font-semibold">
                  {formatRub(result.commission.basePrice)}
                </div>
              </div>
              <div className="rounded-lg border bg-muted/30 p-4">
                <div className="text-xs text-muted-foreground">Ставка</div>
                <div className="mt-1 text-lg font-semibold">
                  {Math.round(result.commission.rate * 100)}%
                </div>
              </div>
              <div className="rounded-lg border bg-primary/5 p-4">
                <div className="text-xs text-muted-foreground">
                  Ваша комиссия
                </div>
                <div className="mt-1 text-lg font-semibold text-primary">
                  {formatRub(result.commission.commission)}
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="secondary">
                Загружено документов: {result.uploaded}
              </Badge>
              {result.rejected.length > 0 && (
                <Badge variant="outline">
                  Отклонено: {result.rejected.length}
                </Badge>
              )}
            </div>

            {result.rejected.length > 0 && (
              <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-3">
                <div className="mb-2 text-sm font-medium text-destructive">
                  Файлы, которые не были приняты
                </div>
                <ul className="space-y-1 text-sm text-destructive/90">
                  {result.rejected.map((r) => (
                    <li key={r.name}>
                      <span className="font-mono">{r.name}</span> — {r.reason}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="flex flex-wrap gap-3">
          <Button onClick={() => router.push("/partner/passes")}>
            К списку заявок
          </Button>
          {result.status === "documents_pending" && (
            <Button
              variant="outline"
              onClick={() =>
                toast.info("Скоро появится возможность дозагрузки документов")
              }
            >
              Дозагрузить документы
            </Button>
          )}
          <Button
            variant="ghost"
            onClick={() => {
              setResult(null);
              clearFile();
            }}
          >
            Создать ещё одну заявку
          </Button>
        </div>
      </div>
    );
  }

  // ── Форма ──────────────────────────────────────────────────────────────

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
      {/* Блок: ТС */}
      <Card>
        <CardHeader>
          <CardTitle>Транспортное средство</CardTitle>
          <CardDescription>
            Данные грузовика, для которого оформляется пропуск
          </CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="vehicleBrand">Марка</Label>
            <Input
              id="vehicleBrand"
              name="vehicleBrand"
              placeholder="КАМАЗ"
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="vehicleModel">Модель</Label>
            <Input
              id="vehicleModel"
              name="vehicleModel"
              placeholder="65115"
              value={model}
              onChange={(e) => setModel(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="vehiclePlate">Госномер</Label>
            <Input
              id="vehiclePlate"
              name="vehiclePlate"
              placeholder="А123ВС77"
              value={plate}
              onChange={(e) => setPlate(e.target.value.toUpperCase())}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="vehicleVin">
              VIN <span className="text-muted-foreground">(необязательно)</span>
            </Label>
            <Input
              id="vehicleVin"
              name="vehicleVin"
              placeholder="XTA21099..."
              value={vin}
              onChange={(e) => setVin(e.target.value.toUpperCase())}
              maxLength={17}
            />
          </div>
        </CardContent>
      </Card>

      {/* Блок: Пропуск */}
      <Card>
        <CardHeader>
          <CardTitle>Параметры пропуска</CardTitle>
          <CardDescription>Тип, зона и срок действия</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="orderType">Тип пропуска</Label>
            <Select
              value={orderType}
              onValueChange={(v) => setOrderType(v as OrderType)}
            >
              <SelectTrigger id="orderType">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {ORDER_TYPES.map((t) => (
                  <SelectItem key={t} value={t}>
                    {ORDER_TYPE_LABELS[t]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <input type="hidden" name="orderType" value={orderType} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="zone">Зона</Label>
            <Select value={zone} onValueChange={(v) => setZone(v as OrderZone)}>
              <SelectTrigger id="zone">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {ORDER_ZONES.map((z) => (
                  <SelectItem key={z} value={z}>
                    {ORDER_ZONE_LABELS[z]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <input type="hidden" name="zone" value={zone} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="validFrom">Действует с</Label>
            <Input
              id="validFrom"
              name="validFrom"
              type="date"
              value={validFrom}
              onChange={(e) => setValidFrom(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="validUntil">Действует по</Label>
            <Input
              id="validUntil"
              name="validUntil"
              type="date"
              value={validUntil}
              onChange={(e) => setValidUntil(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="notes">
              Комментарий{" "}
              <span className="text-muted-foreground">(необязательно)</span>
            </Label>
            <Textarea
              id="notes"
              name="notes"
              placeholder="Особенности маршрута, сроки и т.п."
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              maxLength={1000}
            />
          </div>
        </CardContent>
      </Card>

      {/* Блок: Архив */}
      <Card>
        <CardHeader>
          <CardTitle>Архив с документами</CardTitle>
          <CardDescription>
            ZIP-архив до 50 МБ с ПТС, СТС, ВУ и доверенностью клиента. Система
            распознает документы по названиям файлов.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`cursor-pointer rounded-lg border-2 border-dashed p-8 text-center transition-colors ${
              isDragging
                ? "border-primary bg-primary/5"
                : file
                  ? "border-green-500/50 bg-green-500/5"
                  : "border-border bg-muted/30 hover:border-primary/50"
            }`}
          >
            {file ? (
              <div className="flex flex-col items-center gap-2">
                <FileArchive className="h-10 w-10 text-green-600" />
                <div className="font-medium">{file.name}</div>
                <div className="text-sm text-muted-foreground">
                  {formatFileSize(file.size)}
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    clearFile();
                  }}
                >
                  Выбрать другой файл
                </Button>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2">
                <Upload className="h-10 w-10 text-muted-foreground" />
                <div className="font-medium">
                  Перетащите ZIP-архив сюда или нажмите для выбора
                </div>
                <div className="text-sm text-muted-foreground">
                  Поддерживаются PDF, JPG, PNG внутри архива. Максимум 50 МБ.
                </div>
              </div>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept=".zip,application/zip,application/x-zip-compressed"
              className="hidden"
              onChange={handleFileInputChange}
            />
          </div>
        </CardContent>
      </Card>

      {/* Ошибка */}
      {result && !result.ok && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Не удалось создать заявку</AlertTitle>
          <AlertDescription>{result.error}</AlertDescription>
        </Alert>
      )}

      <div className="flex items-center justify-end gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push("/partner/passes")}
          disabled={isPending}
        >
          Отмена
        </Button>
        <Button type="submit" disabled={!file || isPending}>
          {isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Отправка…
            </>
          ) : (
            "Отправить заявку"
          )}
        </Button>
      </div>
    </form>
  );
}
