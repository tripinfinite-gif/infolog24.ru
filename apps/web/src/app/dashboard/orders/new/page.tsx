"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Check, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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

// -- Mock data ----------------------------------------------------------------

const passTypes = [
  { id: "mkad_day", label: "МКАД дневной", zone: "МКАД", price: "10 000 ₽" },
  { id: "mkad_night", label: "МКАД ночной", zone: "МКАД", price: "8 000 ₽" },
  { id: "ttk", label: "ТТК", zone: "ТТК", price: "15 000 ₽" },
  { id: "sk", label: "Садовое кольцо", zone: "СК", price: "20 000 ₽" },
  { id: "temp_mkad", label: "Временный МКАД", zone: "МКАД", price: "3 500 ₽" },
  { id: "temp_ttk", label: "Временный ТТК", zone: "ТТК", price: "5 000 ₽" },
];

const mockVehicles = [
  { id: "v1", label: "MAN TGX 18.510 — К 123 АА 77" },
  { id: "v2", label: "Volvo FH16 — М 456 ВВ 99" },
  { id: "v3", label: "Scania R500 — А 789 СС 50" },
];

const steps = [
  { label: "Тип пропуска", step: 1 },
  { label: "Транспорт", step: 2 },
  { label: "Документы", step: 3 },
  { label: "Подтверждение", step: 4 },
];

// -- Component ----------------------------------------------------------------

export default function NewOrderPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedPass, setSelectedPass] = useState<string | null>(null);
  const [selectedVehicle, setSelectedVehicle] = useState<string | null>(null);
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);

  const selectedPassData = passTypes.find((p) => p.id === selectedPass);
  const selectedVehicleData = mockVehicles.find((v) => v.id === selectedVehicle);

  function handleFileUpload() {
    // Mock file upload
    setUploadedFiles((prev) => [
      ...prev,
      `document-${prev.length + 1}.pdf`,
    ]);
  }

  function canProceed() {
    switch (currentStep) {
      case 1:
        return !!selectedPass;
      case 2:
        return !!selectedVehicle;
      case 3:
        return uploadedFiles.length > 0;
      default:
        return true;
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
                      : "bg-muted text-muted-foreground"
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
                    : "text-muted-foreground"
                )}
              >
                {s.label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div
                className={cn(
                  "mx-2 h-px flex-1",
                  currentStep > s.step ? "bg-primary" : "bg-muted"
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
                      selectedPass === pass.id && "border-primary bg-primary/5"
                    )}
                  >
                    <div className="flex w-full items-center justify-between">
                      <span className="font-medium">{pass.label}</span>
                      <Badge variant="outline">{pass.zone}</Badge>
                    </div>
                    <span className="mt-2 text-lg font-bold text-primary">
                      {pass.price}
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
                    {mockVehicles.map((v) => (
                      <SelectItem key={v.id} value={v.id}>
                        {v.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
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
                Загрузите необходимые документы для оформления пропуска
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <button
                onClick={handleFileUpload}
                className="flex w-full flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-muted-foreground/25 p-8 text-muted-foreground transition-colors hover:border-primary hover:text-primary"
              >
                <Upload className="size-8" />
                <span className="font-medium">
                  Нажмите для загрузки или перетащите файлы сюда
                </span>
                <span className="text-xs">PDF, JPG, PNG до 10 МБ</span>
              </button>

              {uploadedFiles.length > 0 && (
                <div className="space-y-2">
                  <Label>Загруженные файлы:</Label>
                  <ul className="space-y-1">
                    {uploadedFiles.map((file) => (
                      <li
                        key={file}
                        className="flex items-center gap-2 rounded-md bg-muted px-3 py-2 text-sm"
                      >
                        <Check className="size-4 text-green-500" />
                        {file}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
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
              <div className="rounded-lg border p-4 space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Тип пропуска:</span>
                  <span className="font-medium">
                    {selectedPassData?.label}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Зона:</span>
                  <Badge variant="outline">
                    {selectedPassData?.zone}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Транспорт:</span>
                  <span className="font-medium">
                    {selectedVehicleData?.label}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Документы:</span>
                  <span className="font-medium">
                    {uploadedFiles.length} файл(ов)
                  </span>
                </div>
                <div className="border-t pt-3 flex justify-between">
                  <span className="font-medium">Стоимость:</span>
                  <span className="text-lg font-bold text-primary">
                    {selectedPassData?.price}
                  </span>
                </div>
              </div>
            </CardContent>
          </>
        )}

        <CardFooter className="flex justify-between">
          <Button
            variant="outline"
            onClick={() => setCurrentStep((s) => Math.max(1, s - 1))}
            disabled={currentStep === 1}
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
            <Link href="/dashboard/orders">
              <Button>
                <Check className="size-4" />
                Подтвердить заявку
              </Button>
            </Link>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
