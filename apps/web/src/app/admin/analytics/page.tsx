"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ORDERS, PAYMENTS, CLIENTS, MANAGERS, formatPrice } from "../_components/mock-data";
import { ExportButton } from "../_components/export-button";

// ── KPI calculations ──────────────────────────────────────────────────────

const totalOrders = ORDERS.length;
const approvedOrders = ORDERS.filter((o) => o.status === "approved").length;
const conversion = Math.round((approvedOrders / totalOrders) * 100);
const succeededPayments = PAYMENTS.filter((p) => p.status === "succeeded");
const totalRevenue = succeededPayments.reduce((sum, p) => sum + p.amount, 0);
const avgCheck = succeededPayments.length > 0 ? Math.round(totalRevenue / succeededPayments.length) : 0;
const newClients = CLIENTS.filter((c) => c.createdAt >= "2026-04").length;
const returningClients = ORDERS.filter((o) => o.tags.includes("повторный")).length;
const retention = totalOrders > 0 ? Math.round((returningClients / totalOrders) * 100) : 0;

const KPI = [
  { label: "Заявки", value: String(totalOrders) },
  { label: "Конверсия", value: `${conversion}%` },
  { label: "Выручка", value: formatPrice(totalRevenue) },
  { label: "Средний чек", value: formatPrice(avgCheck) },
  { label: "Новые клиенты", value: String(newClients) },
  { label: "Retention", value: `${retention}%` },
];

// ── Weekly chart data ─────────────────────────────────────────────────────

const WEEKLY_DATA = [
  { label: "4 апр", value: 5 },
  { label: "5 апр", value: 8 },
  { label: "6 апр", value: 6 },
  { label: "7 апр", value: 10 },
  { label: "8 апр", value: 7 },
  { label: "9 апр", value: 12 },
  { label: "10 апр", value: 9 },
];
const maxWeekly = Math.max(...WEEKLY_DATA.map((d) => d.value));

// ── Top managers ──────────────────────────────────────────────────────────

const managerStats = MANAGERS.filter((m) => m.role === "manager").map((m) => {
  const completed = ORDERS.filter(
    (o) => o.managerId === m.id && o.status === "approved"
  ).length;
  const total = ORDERS.filter((o) => o.managerId === m.id).length;
  return { name: m.name, completed, total };
}).sort((a, b) => b.completed - a.completed);

// ── Zone distribution ─────────────────────────────────────────────────────

const zoneStats = [
  { zone: "МКАД", count: ORDERS.filter((o) => o.zone === "mkad").length, color: "bg-blue-500" },
  { zone: "ТТК", count: ORDERS.filter((o) => o.zone === "ttk").length, color: "bg-amber-500" },
  { zone: "СК", count: ORDERS.filter((o) => o.zone === "sk").length, color: "bg-red-500" },
];
const totalZone = zoneStats.reduce((s, z) => s + z.count, 0);

export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Аналитика</h1>
        <ExportButton
          data={managerStats as unknown as Record<string, unknown>[]}
          filename="analytics"
          columns={[
            { key: "name", label: "Менеджер" },
            { key: "completed", label: "Завершено" },
            { key: "total", label: "Всего" },
          ]}
        />
      </div>

      {/* Period tabs */}
      <Tabs defaultValue="month">
        <TabsList>
          <TabsTrigger value="week">Неделя</TabsTrigger>
          <TabsTrigger value="month">Месяц</TabsTrigger>
          <TabsTrigger value="quarter">Квартал</TabsTrigger>
          <TabsTrigger value="year">Год</TabsTrigger>
        </TabsList>

        <TabsContent value="week" className="space-y-6">
          <AnalyticsContent />
        </TabsContent>
        <TabsContent value="month" className="space-y-6">
          <AnalyticsContent />
        </TabsContent>
        <TabsContent value="quarter" className="space-y-6">
          <AnalyticsContent />
        </TabsContent>
        <TabsContent value="year" className="space-y-6">
          <AnalyticsContent />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function AnalyticsContent() {
  return (
    <>
      {/* KPI */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-6">
        {KPI.map((kpi) => (
          <Card key={kpi.label}>
            <CardContent className="pt-0">
              <p className="text-2xl font-bold">{kpi.value}</p>
              <p className="text-xs text-muted-foreground">{kpi.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Bar chart */}
        <Card>
          <CardHeader>
            <CardTitle>Заявки по дням</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-end gap-2 h-40">
              {WEEKLY_DATA.map((d) => (
                <div key={d.label} className="flex-1 flex flex-col items-center gap-1">
                  <span className="text-xs font-medium">{d.value}</span>
                  <div
                    className="w-full rounded-t bg-primary/80 transition-all"
                    style={{ height: `${(d.value / maxWeekly) * 100}%` }}
                  />
                  <span className="text-[10px] text-muted-foreground">{d.label}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Zone distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Заявки по зонам</CardTitle>
          </CardHeader>
          <CardContent>
            {/* Horizontal stacked bar */}
            <div className="flex h-8 rounded-lg overflow-hidden mb-4">
              {zoneStats.map((z) => (
                <div
                  key={z.zone}
                  className={`${z.color} flex items-center justify-center text-xs font-medium text-white`}
                  style={{ width: `${(z.count / totalZone) * 100}%` }}
                >
                  {z.count}
                </div>
              ))}
            </div>
            <div className="flex justify-center gap-6">
              {zoneStats.map((z) => (
                <div key={z.zone} className="flex items-center gap-2">
                  <div className={`size-3 rounded-full ${z.color}`} />
                  <span className="text-sm">
                    {z.zone} ({Math.round((z.count / totalZone) * 100)}%)
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top managers */}
      <Card>
        <CardHeader>
          <CardTitle>Топ менеджеров</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Менеджер</TableHead>
                <TableHead className="text-center">Завершено</TableHead>
                <TableHead className="text-center">Всего</TableHead>
                <TableHead className="text-center">Конверсия</TableHead>
                <TableHead>Прогресс</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {managerStats.map((m) => (
                <TableRow key={m.name}>
                  <TableCell className="font-medium">{m.name}</TableCell>
                  <TableCell className="text-center">{m.completed}</TableCell>
                  <TableCell className="text-center">{m.total}</TableCell>
                  <TableCell className="text-center">
                    {m.total > 0 ? Math.round((m.completed / m.total) * 100) : 0}%
                  </TableCell>
                  <TableCell>
                    <div className="w-24 h-2 rounded-full bg-muted overflow-hidden">
                      <div
                        className="h-full rounded-full bg-primary"
                        style={{
                          width: `${m.total > 0 ? (m.completed / m.total) * 100 : 0}%`,
                        }}
                      />
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </>
  );
}
