"use client";

import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { MANAGERS } from "../_components/mock-data";

// ── Pricing data ──────────────────────────────────────────────────────────

const initialPricing = [
  { zone: "МКАД", type: "Дневной", price: 45000 },
  { zone: "МКАД", type: "Ночной", price: 35000 },
  { zone: "МКАД", type: "Временный", price: 15000 },
  { zone: "ТТК", type: "Постоянный", price: 85000 },
  { zone: "ТТК", type: "Временный", price: 25000 },
  { zone: "СК", type: "Постоянный", price: 120000 },
  { zone: "СК", type: "Временный", price: 35000 },
];

// ── Notification templates ────────────────────────────────────────────────

const initialTemplates = [
  { id: "t1", event: "order_created", title: "Заявка создана", body: "Ваша заявка #{order_number} создана и принята в обработку.", channels: ["email", "telegram"], isActive: true },
  { id: "t2", event: "documents_requested", title: "Требуются документы", body: "Для заявки #{order_number} необходимо загрузить документы.", channels: ["email", "sms"], isActive: true },
  { id: "t3", event: "payment_required", title: "Ожидание оплаты", body: "Для продолжения обработки заявки #{order_number} необходимо произвести оплату.", channels: ["email", "telegram"], isActive: true },
  { id: "t4", event: "order_approved", title: "Заявка одобрена", body: "Ваша заявка #{order_number} одобрена! Пропуск: {permit_number}.", channels: ["email", "sms", "telegram"], isActive: true },
  { id: "t5", event: "order_rejected", title: "Заявка отклонена", body: "К сожалению, заявка #{order_number} была отклонена. Причина: {reason}.", channels: ["email"], isActive: true },
  { id: "t6", event: "permit_expiring", title: "Пропуск истекает", body: "Ваш пропуск {permit_number} истекает {expiry_date}. Рекомендуем продлить.", channels: ["email", "telegram"], isActive: false },
];

// ── Working hours ─────────────────────────────────────────────────────────

const DAYS = ["Понедельник", "Вторник", "Среда", "Четверг", "Пятница", "Суббота", "Воскресенье"];

const initialHours = DAYS.map((day, i) => ({
  day,
  from: i < 5 ? "09:00" : i === 5 ? "10:00" : "",
  to: i < 5 ? "18:00" : i === 5 ? "15:00" : "",
  enabled: i < 6,
}));

export default function SettingsPage() {
  const [pricing, setPricing] = useState(initialPricing);
  const [templates, setTemplates] = useState(initialTemplates);
  const [hours, setHours] = useState(initialHours);

  function updatePrice(index: number, value: string) {
    setPricing((prev) =>
      prev.map((p, i) => (i === index ? { ...p, price: parseInt(value) || 0 } : p))
    );
  }

  function toggleTemplate(id: string) {
    setTemplates((prev) =>
      prev.map((t) => (t.id === id ? { ...t, isActive: !t.isActive } : t))
    );
  }

  function updateHours(index: number, field: "from" | "to", value: string) {
    setHours((prev) =>
      prev.map((h, i) => (i === index ? { ...h, [field]: value } : h))
    );
  }

  function toggleDay(index: number) {
    setHours((prev) =>
      prev.map((h, i) => (i === index ? { ...h, enabled: !h.enabled } : h))
    );
  }

  const managersList = MANAGERS.filter((m) => m.role === "manager");

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Настройки</h1>

      <Tabs defaultValue="pricing">
        <TabsList>
          <TabsTrigger value="pricing">Тарифы</TabsTrigger>
          <TabsTrigger value="notifications">Уведомления</TabsTrigger>
          <TabsTrigger value="team">Команда</TabsTrigger>
          <TabsTrigger value="hours">Рабочее время</TabsTrigger>
        </TabsList>

        {/* Pricing */}
        <TabsContent value="pricing">
          <Card>
            <CardHeader>
              <CardTitle>Тарифы на пропуска</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Зона</TableHead>
                    <TableHead>Тип</TableHead>
                    <TableHead className="w-48">Цена (руб.)</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pricing.map((item, i) => (
                    <TableRow key={i}>
                      <TableCell className="font-medium">{item.zone}</TableCell>
                      <TableCell>{item.type}</TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          value={item.price}
                          onChange={(e) => updatePrice(i, e.target.value)}
                          className="w-36"
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
            <div className="px-6 pb-6">
              <Button>Сохранить тарифы</Button>
            </div>
          </Card>
        </TabsContent>

        {/* Notifications */}
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Шаблоны уведомлений</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {templates.map((t) => (
                  <div
                    key={t.id}
                    className="rounded-lg border p-4 space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Checkbox
                          checked={t.isActive}
                          onCheckedChange={() => toggleTemplate(t.id)}
                        />
                        <div>
                          <p className="font-medium">{t.title}</p>
                          <p className="text-xs text-muted-foreground font-mono">
                            {t.event}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-1">
                        {t.channels.map((ch) => (
                          <Badge key={ch} variant="outline" className="text-[10px]">
                            {ch}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <Textarea
                      value={t.body}
                      readOnly
                      className="text-sm resize-none h-16"
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Team */}
        <TabsContent value="team">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Команда менеджеров</CardTitle>
                <Button size="sm">
                  <Plus className="size-4 mr-1" />
                  Добавить
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Имя</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Телефон</TableHead>
                    <TableHead>Роль</TableHead>
                    <TableHead>Дата добавления</TableHead>
                    <TableHead className="w-10" />
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {managersList.map((m) => (
                    <TableRow key={m.id}>
                      <TableCell className="font-medium">{m.name}</TableCell>
                      <TableCell className="text-muted-foreground">
                        {m.email}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {m.phone}
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">Менеджер</Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {new Date(m.createdAt).toLocaleDateString("ru-RU")}
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="icon" className="size-8 text-red-500">
                          <Trash2 className="size-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Working hours */}
        <TabsContent value="hours">
          <Card>
            <CardHeader>
              <CardTitle>Рабочее время</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {hours.map((h, i) => (
                  <div
                    key={h.day}
                    className="flex items-center gap-4"
                  >
                    <Checkbox
                      checked={h.enabled}
                      onCheckedChange={() => toggleDay(i)}
                    />
                    <span className="w-32 text-sm font-medium">{h.day}</span>
                    {h.enabled ? (
                      <div className="flex items-center gap-2">
                        <Input
                          type="time"
                          value={h.from}
                          onChange={(e) => updateHours(i, "from", e.target.value)}
                          className="w-28"
                        />
                        <span className="text-muted-foreground">—</span>
                        <Input
                          type="time"
                          value={h.to}
                          onChange={(e) => updateHours(i, "to", e.target.value)}
                          className="w-28"
                        />
                      </div>
                    ) : (
                      <span className="text-sm text-muted-foreground">Выходной</span>
                    )}
                  </div>
                ))}
              </div>
              <Button className="mt-4">Сохранить расписание</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
