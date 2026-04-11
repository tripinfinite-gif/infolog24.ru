"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const vehicleSchema = z.object({
  brand: z.string().min(1, "Введите марку"),
  model: z.string().min(1, "Введите модель"),
  licensePlate: z.string().min(1, "Введите госномер"),
  vin: z.string().max(17, "VIN не может быть длиннее 17 символов").optional().or(z.literal("")),
  year: z.union([z.number().int().min(1990).max(2030), z.nan()]).optional(),
  ecoClass: z
    .enum(["euro0", "euro1", "euro2", "euro3", "euro4", "euro5", "euro6", ""])
    .optional(),
  maxWeight: z.union([z.number().int().positive(), z.nan()]).optional(),
  category: z.string().optional(),
});

export default function NewVehiclePage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [form, setForm] = useState({
    brand: "",
    model: "",
    licensePlate: "",
    vin: "",
    year: "",
    ecoClass: "",
    maxWeight: "",
    category: "",
  });

  function update(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => {
      const next = { ...prev };
      delete next[field];
      return next;
    });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrors({});

    // Prepare data
    const data = {
      brand: form.brand.trim(),
      model: form.model.trim(),
      licensePlate: form.licensePlate.trim(),
      vin: form.vin.trim() || undefined,
      year: form.year ? parseInt(form.year, 10) : undefined,
      ecoClass: form.ecoClass || undefined,
      maxWeight: form.maxWeight ? parseInt(form.maxWeight, 10) : undefined,
      category: form.category || undefined,
    };

    // Validate
    const result = vehicleSchema.safeParse(data);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      for (const issue of result.error.issues) {
        const key = issue.path[0]?.toString() ?? "";
        if (key && !fieldErrors[key]) {
          fieldErrors[key] = issue.message;
        }
      }
      setErrors(fieldErrors);
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/vehicles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const body = await res.json();
        toast.error(body.error ?? "Не удалось добавить ТС");
        return;
      }

      toast.success("Транспортное средство добавлено");
      router.push("/dashboard/vehicles");
    } catch {
      toast.error("Произошла ошибка");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/vehicles">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="size-5" />
          </Button>
        </Link>
        <h1 className="text-2xl font-bold">Добавить транспортное средство</h1>
      </div>

      <Card className="max-w-2xl">
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle>Данные ТС</CardTitle>
            <CardDescription>
              Заполните информацию о транспортном средстве
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="brand">Марка *</Label>
                <Input
                  id="brand"
                  placeholder="MAN"
                  value={form.brand}
                  onChange={(e) => update("brand", e.target.value)}
                  required
                />
                {errors.brand && (
                  <p className="text-xs text-destructive">{errors.brand}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="model">Модель *</Label>
                <Input
                  id="model"
                  placeholder="TGX 18.510"
                  value={form.model}
                  onChange={(e) => update("model", e.target.value)}
                  required
                />
                {errors.model && (
                  <p className="text-xs text-destructive">{errors.model}</p>
                )}
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="licensePlate">Госномер *</Label>
                <Input
                  id="licensePlate"
                  placeholder="К 123 АА 77"
                  value={form.licensePlate}
                  onChange={(e) => update("licensePlate", e.target.value)}
                  required
                />
                {errors.licensePlate && (
                  <p className="text-xs text-destructive">
                    {errors.licensePlate}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="vin">VIN</Label>
                <Input
                  id="vin"
                  placeholder="WMAN05ZZ0CY123456"
                  value={form.vin}
                  onChange={(e) => update("vin", e.target.value)}
                  maxLength={17}
                />
                {errors.vin && (
                  <p className="text-xs text-destructive">{errors.vin}</p>
                )}
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="year">Год выпуска</Label>
                <Input
                  id="year"
                  type="number"
                  placeholder="2022"
                  value={form.year}
                  onChange={(e) => update("year", e.target.value)}
                  min={1990}
                  max={2030}
                />
              </div>
              <div className="space-y-2">
                <Label>Экокласс</Label>
                <Select
                  value={form.ecoClass}
                  onValueChange={(v) => update("ecoClass", v)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Выберите" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="euro0">Евро-0</SelectItem>
                    <SelectItem value="euro1">Евро-1</SelectItem>
                    <SelectItem value="euro2">Евро-2</SelectItem>
                    <SelectItem value="euro3">Евро-3</SelectItem>
                    <SelectItem value="euro4">Евро-4</SelectItem>
                    <SelectItem value="euro5">Евро-5</SelectItem>
                    <SelectItem value="euro6">Евро-6</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="maxWeight">Масса (кг)</Label>
                <Input
                  id="maxWeight"
                  type="number"
                  placeholder="18000"
                  value={form.maxWeight}
                  onChange={(e) => update("maxWeight", e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Категория</Label>
              <Select
                value={form.category}
                onValueChange={(v) => update("category", v)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Выберите категорию" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="tractor">Тягач</SelectItem>
                  <SelectItem value="van">Фургон</SelectItem>
                  <SelectItem value="dump">Самосвал</SelectItem>
                  <SelectItem value="flatbed">Бортовой</SelectItem>
                  <SelectItem value="tanker">Цистерна</SelectItem>
                  <SelectItem value="refrigerator">Рефрижератор</SelectItem>
                  <SelectItem value="special">Спецтехника</SelectItem>
                  <SelectItem value="other">Другое</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Link href="/dashboard/vehicles">
              <Button variant="outline" type="button">
                Отмена
              </Button>
            </Link>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="size-4 animate-spin" />}
              Сохранить
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
