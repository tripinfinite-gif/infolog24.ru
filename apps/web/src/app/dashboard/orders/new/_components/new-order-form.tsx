"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, Check, Upload, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { analytics } from "@/lib/analytics/events";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

interface VehicleOption {
  id: string;
  brand: string;
  model: string;
  licensePlate: string;
}

const passTypes = [
  { id: "mkad_day", label: "МКАД дневной", zone: "mkad" as const, zoneLabel: "МКАД", price: 12000 },
  { id: "mkad_night", label: "МКАД ночной", zone: "mkad" as const, zoneLabel: "МКАД", price: 12000 },
  { id: "ttk", label: "ТТК", zone: "ttk" as const, zoneLabel: "ТТК", price: 12000 },
  { id: "sk", label: "Садовое кольцо", zone: "sk" as const, zoneLabel: "СК", price: 12000 },
  { id: "temp", label: "Временный", zone: "mkad" as const, zoneLabel: "МКАД", price: 4500 },
];

const steps = [
  { label: "Тип пропуска", step: 1 },
  { label: "Транспорт", step: 2 },
  { label: "Документы", step: 3 },
  { label: "Подтверждение", step: 4 },
];

function formatPrice(amount: number): string {
  return new Intl.NumberFormat("ru-RU").format(amount) + " \u20BD";
}

interface NewOrderFormProps {
  vehicles: VehicleOption[];
  /** Тип пропуска, заранее выбранный из «повторить заявку». */
  initialType?: string | null;
  /** ТС, заранее выбранное из «повторить заявку». */
  initialVehicleId?: string | null;
}

export function NewOrderForm({
  vehicles,
  initialType,
  initialVehicleId,
}: NewOrderFormProps) {
  const router = useRouter();

  // Если из URL пришли оба параметра — пропускаем выбор типа и ТС,
  // сразу открываем шаг с документами.
  const validInitialType = initialType
    ? passTypes.find((p) => p.id === initialType)?.id ?? null
    : null;
  const validInitialVehicle = initialVehicleId
    ? vehicles.find((v) => v.id === initialVehicleId)?.id ?? null
    : null;
  const initialStep =
    validInitialType && validInitialVehicle ? 3 : 1;

  const [currentStep, setCurrentStep] = useState(initialStep);
  const [selectedPass, setSelectedPass] = useState<string | null>(
    validInitialType,
  );
  const [selectedVehicle, setSelectedVehicle] = useState<string | null>(
    validInitialVehicle,
  );
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [notes, setNotes] = useState("");
  const [consent, setConsent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Analytics: фиксируем старт оформления заявки один раз при монтировании формы.
  useEffect(() => {
    analytics.orderStarted();
  }, []);

  const selectedPassData = passTypes.find((p) => p.id === selectedPass);
  const selectedVehicleData = vehicles.find((v) => v.id === selectedVehicle);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    setUploadedFiles((prev) => [...prev, ...files]);
  }

  function removeFile(index: number) {
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index));
  }

  function canProceed() {
    switch (currentStep) {
      case 1:
        return !!selectedPass;
      case 2:
        return !!selectedVehicle;
      case 3:
        return true; // Documents are optional at creation, can be uploaded later
      default:
        return true;
    }
  }

  async function handleSubmit() {
    if (!selectedPassData || !selectedVehicle) return;
    if (!consent) {
      toast.error("Необходимо согласие на обработку персональных данных");
      return;
    }

    setIsSubmitting(true);
    try {
      // Upload documents first if any
      for (const file of uploadedFiles) {
        try {
          // Step 1: Get presigned URL
          const urlRes = await fetch("/api/documents/upload-url", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              fileName: file.name,
              mimeType: file.type,
              fileSize: file.size,
            }),
          });

          if (!urlRes.ok) {
            toast.error(`Не удалось получить ссылку для загрузки файла ${file.name}`);
            continue;
          }

          const { uploadUrl, key } = await urlRes.json();

          // Step 2: Upload to S3 (may fail if S3 not configured)
          try {
            await fetch(uploadUrl, {
              method: "PUT",
              body: file,
              headers: { "Content-Type": file.type },
            });
          } catch {
            // S3 may not be configured yet — continue gracefully
            toast.warning(`Хранилище не настроено. Файл ${file.name} будет загружен позже.`);
          }

          // Step 3: Register document
          const registerRes = await fetch("/api/documents", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              vehicleId: selectedVehicle,
              type: "other",
              fileName: file.name,
              fileUrl: `https://storage.example.com/${key}`,
              fileSize: file.size,
              mimeType: file.type,
            }),
          });
          if (registerRes.ok) {
            analytics.documentUploaded("other");
          }
        } catch {
          toast.error(`Ошибка загрузки файла ${file.name}`);
        }
      }

      // Create order
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          vehicleId: selectedVehicle,
          type: selectedPassData.id,
          zone: selectedPassData.zone,
          price: selectedPassData.price,
          notes: notes || undefined,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        toast.error(data.error ?? "Не удалось создать заявку");
        return;
      }

      const order = await res.json();
      if (order?.id) {
        analytics.orderCompleted(String(order.id));
      }
      toast.success("Заявка успешно создана");
      router.push(`/dashboard/orders/${order.id}`);
    } catch {
      toast.error("Произошла ошибка при создании заявки");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/orders">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="size-5" />
          </Button>
        </Link>
        <h1 className="text-2xl font-bold">Новая заявка</h1>
      </div>

      {/* Step indicator */}
      <div className="flex items-center justify-between">
        {steps.map((s, i) => (
          <div key={s.step} className="flex flex-1 items-center">
            <div className="flex flex-col items-center gap-1">
              <div
                className={cn(
                  "flex size-8 items-center justify-center rounded-full text-sm font-medium",
                  currentStep > s.step
                    ? "bg-primary text-primary-foreground"
                    : currentStep === s.step
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground",
                )}
              >
                {currentStep > s.step ? (
                  <Check className="size-4" />
                ) : (
                  s.step
                )}
              </div>
              <span
                className={cn(
                  "hidden text-xs sm:block",
                  currentStep >= s.step
                    ? "font-medium text-foreground"
                    : "text-muted-foreground",
                )}
              >
                {s.label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div
                className={cn(
                  "mx-2 h-px flex-1",
                  currentStep > s.step ? "bg-primary" : "bg-muted",
                )}
              />
            )}
          </div>
        ))}
      </div>

      {/* Step content */}
      <Card>
        {currentStep === 1 && (
          <>
            <CardHeader>
              <CardTitle>Выберите тип пропуска</CardTitle>
              <CardDescription>
                Укажите зону и тип пропуска, который вам нужен
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {passTypes.map((pass) => (
                  <button
                    key={pass.id}
                    onClick={() => setSelectedPass(pass.id)}
                    className={cn(
                      "flex flex-col items-start rounded-lg border p-4 text-left transition-colors hover:bg-accent",
                      selectedPass === pass.id &&
                        "border-primary bg-primary/5",
                    )}
                  >
                    <div className="flex w-full items-center justify-between">
                      <span className="font-medium">{pass.label}</span>
                      <Badge variant="outline">{pass.zoneLabel}</Badge>
                    </div>
                    <span className="mt-2 text-lg font-bold text-primary">
                      {formatPrice(pass.price)}
                    </span>
                  </button>
                ))}
              </div>
            </CardContent>
          </>
        )}

        {currentStep === 2 && (
          <>
            <CardHeader>
              <CardTitle>Выберите транспортное средство</CardTitle>
              <CardDescription>
                Укажите ТС, для которого оформляется пропуск
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {vehicles.length > 0 ? (
                <div className="space-y-2">
                  <Label>Транспортное средство</Label>
                  <Select
                    value={selectedVehicle ?? undefined}
                    onValueChange={setSelectedVehicle}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Выберите ТС" />
                    </SelectTrigger>
                    <SelectContent>
                      {vehicles.map((v) => (
                        <SelectItem key={v.id} value={v.id}>
                          {v.brand} {v.model} — {v.licensePlate}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              ) : (
                <p className="py-4 text-center text-muted-foreground">
                  У вас нет зарегистрированных ТС. Добавьте транспортное
                  средство.
                </p>
              )}
              <div className="text-center">
                <Link href="/dashboard/vehicles/new">
                  <Button variant="link">+ Добавить новое ТС</Button>
                </Link>
              </div>
            </CardContent>
          </>
        )}

        {currentStep === 3 && (
          <>
            <CardHeader>
              <CardTitle>Загрузите документы</CardTitle>
              <CardDescription>
                Загрузите необходимые документы для оформления пропуска (можно
                добавить позже)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <label className="flex w-full cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-muted-foreground/25 p-8 text-muted-foreground transition-colors hover:border-primary hover:text-primary">
                <Upload className="size-8" />
                <span className="font-medium">
                  Нажмите для загрузки или перетащите файлы сюда
                </span>
                <span className="text-xs">PDF, JPG, PNG до 10 МБ</span>
                <input
                  type="file"
                  multiple
                  accept=".pdf,.jpg,.jpeg,.png"
                  className="hidden"
                  onChange={handleFileChange}
                />
              </label>

              {uploadedFiles.length > 0 && (
                <div className="space-y-2">
                  <Label>Выбранные файлы:</Label>
                  <ul className="space-y-1">
                    {uploadedFiles.map((file, i) => (
                      <li
                        key={`${file.name}-${i}`}
                        className="flex items-center justify-between gap-2 rounded-md bg-muted px-3 py-2 text-sm"
                      >
                        <span className="flex items-center gap-2">
                          <Check className="size-4 text-green-500" />
                          {file.name}
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFile(i)}
                        >
                          Удалить
                        </Button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="notes">Примечания (необязательно)</Label>
                <Textarea
                  id="notes"
                  placeholder="Дополнительная информация к заявке..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                />
              </div>
            </CardContent>
          </>
        )}

        {currentStep === 4 && (
          <>
            <CardHeader>
              <CardTitle>Подтверждение заявки</CardTitle>
              <CardDescription>
                Проверьте данные и подтвердите создание заявки
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3 rounded-lg border p-4">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Тип пропуска:</span>
                  <span className="font-medium">
                    {selectedPassData?.label}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Зона:</span>
                  <Badge variant="outline">
                    {selectedPassData?.zoneLabel}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Транспорт:</span>
                  <span className="font-medium">
                    {selectedVehicleData
                      ? `${selectedVehicleData.brand} ${selectedVehicleData.model} — ${selectedVehicleData.licensePlate}`
                      : "—"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Документы:</span>
                  <span className="font-medium">
                    {uploadedFiles.length} файл(ов)
                  </span>
                </div>
                {notes && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Примечания:</span>
                    <span className="max-w-xs truncate text-sm font-medium">
                      {notes}
                    </span>
                  </div>
                )}
                <div className="flex justify-between border-t pt-3">
                  <span className="font-medium">Стоимость:</span>
                  <span className="text-lg font-bold text-primary">
                    {selectedPassData
                      ? formatPrice(selectedPassData.price)
                      : "—"}
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-2 text-xs text-muted-foreground">
                <Checkbox
                  id="consent-order"
                  checked={consent}
                  onCheckedChange={(checked) => setConsent(checked === true)}
                  required
                  className="mt-0.5"
                />
                <Label
                  htmlFor="consent-order"
                  className="cursor-pointer text-xs font-normal leading-relaxed text-muted-foreground"
                >
                  Я согласен на обработку персональных данных в соответствии с{" "}
                  <Link
                    href="/privacy"
                    className="text-primary underline-offset-2 hover:underline"
                  >
                    Политикой конфиденциальности
                  </Link>{" "}
                  и принимаю условия{" "}
                  <Link
                    href="/terms"
                    className="text-primary underline-offset-2 hover:underline"
                  >
                    публичной оферты
                  </Link>
                  .
                </Label>
              </div>
            </CardContent>
          </>
        )}

        <CardFooter className="flex justify-between">
          <Button
            variant="outline"
            onClick={() => setCurrentStep((s) => Math.max(1, s - 1))}
            disabled={currentStep === 1 || isSubmitting}
          >
            <ArrowLeft className="size-4" />
            Назад
          </Button>
          {currentStep < 4 ? (
            <Button
              onClick={() => setCurrentStep((s) => s + 1)}
              disabled={!canProceed()}
            >
              Далее
              <ArrowRight className="size-4" />
            </Button>
          ) : (
            <Button onClick={handleSubmit} disabled={isSubmitting || !consent}>
              {isSubmitting ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Check className="size-4" />
              )}
              Подтвердить заявку
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
