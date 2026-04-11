"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatPriceRub, ZONE_LABELS } from "../../_components/format-utils";

interface AnalyticsData {
  kpi: {
    totalOrders: number;
    conversion: number;
    totalRevenue: number;
    avgCheck: number;
    totalClients: number;
    newClients: number;
  };
  monthlyRevenue: Array<{ month: string; amount: number }>;
  monthlyOrders: Array<{ month: string; count: number }>;
  zoneStats: Array<{ zone: string; count: number }>;
  managerPerformance: Array<{
    name: string;
    completed: number;
    total: number;
  }>;
  topClients: Array<{
    name: string;
    company: string;
    totalAmount: number;
    paymentCount: number;
  }>;
}

interface AnalyticsClientProps {
  data: AnalyticsData;
}

const MONTH_LABELS: Record<string, string> = {
  "01": "Янв",
  "02": "Фев",
  "03": "Мар",
  "04": "Апр",
  "05": "Май",
  "06": "Июн",
  "07": "Июл",
  "08": "Авг",
  "09": "Сен",
  "10": "Окт",
  "11": "Ноя",
  "12": "Дек",
};

function formatMonthLabel(ym: string): string {
  const parts = ym.split("-");
  return `${MONTH_LABELS[parts[1]] ?? parts[1]} ${parts[0]}`;
}

export function AnalyticsClient({ data }: AnalyticsClientProps) {
  const { kpi, monthlyRevenue, monthlyOrders, zoneStats, managerPerformance, topClients } =
    data;

  const KPI_ITEMS = [
    { label: "Заявки", value: String(kpi.totalOrders) },
    { label: "Конверсия", value: `${kpi.conversion}%` },
    { label: "Выручка", value: formatPriceRub(kpi.totalRevenue) },
    { label: "Средний чек", value: formatPriceRub(kpi.avgCheck) },
    { label: "Всего клиентов", value: String(kpi.totalClients) },
    { label: "Новые клиенты", value: String(kpi.newClients) },
  ];

  const maxRevenue = Math.max(...monthlyRevenue.map((r) => r.amount), 1);
  const maxOrders = Math.max(...monthlyOrders.map((r) => r.count), 1);
  const totalZone = zoneStats.reduce((s, z) => s + z.count, 0) || 1;

  const ZONE_COLORS: Record<string, string> = {
    mkad: "bg-blue-500",
    ttk: "bg-amber-500",
    sk: "bg-red-500",
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Аналитика</h1>

      {/* KPI */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-6">
        {KPI_ITEMS.map((kpi) => (
          <Card key={kpi.label}>
            <CardContent className="pt-0">
              <p className="text-2xl font-bold">{kpi.value}</p>
              <p className="text-xs text-muted-foreground">{kpi.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Monthly revenue chart */}
        <Card>
          <CardHeader>
            <CardTitle>Выручка по месяцам</CardTitle>
          </CardHeader>
          <CardContent>
            {monthlyRevenue.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">
                Нет данных
              </p>
            ) : (
              <div className="flex items-end gap-2 h-40">
                {monthlyRevenue.map((d) => (
                  <div
                    key={d.month}
                    className="flex-1 flex flex-col items-center gap-1"
                  >
                    <span className="text-[10px] font-medium">
                      {formatPriceRub(d.amount)}
                    </span>
                    <div
                      className="w-full rounded-t bg-emerald-500/80 transition-all"
                      style={{
                        height: `${(d.amount / maxRevenue) * 100}%`,
                      }}
                    />
                    <span className="text-[10px] text-muted-foreground">
                      {formatMonthLabel(d.month)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Monthly orders chart */}
        <Card>
          <CardHeader>
            <CardTitle>Заявки по месяцам</CardTitle>
          </CardHeader>
          <CardContent>
            {monthlyOrders.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">
                Нет данных
              </p>
            ) : (
              <div className="flex items-end gap-2 h-40">
                {monthlyOrders.map((d) => (
                  <div
                    key={d.month}
                    className="flex-1 flex flex-col items-center gap-1"
                  >
                    <span className="text-xs font-medium">{d.count}</span>
                    <div
                      className="w-full rounded-t bg-primary/80 transition-all"
                      style={{
                        height: `${(d.count / maxOrders) * 100}%`,
                      }}
                    />
                    <span className="text-[10px] text-muted-foreground">
                      {formatMonthLabel(d.month)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Zone distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Заявки по зонам</CardTitle>
          </CardHeader>
          <CardContent>
            {zoneStats.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">
                Нет данных
              </p>
            ) : (
              <>
                <div className="flex h-8 rounded-lg overflow-hidden mb-4">
                  {zoneStats.map((z) => (
                    <div
                      key={z.zone}
                      className={`${ZONE_COLORS[z.zone] ?? "bg-gray-400"} flex items-center justify-center text-xs font-medium text-white`}
                      style={{ width: `${(z.count / totalZone) * 100}%` }}
                    >
                      {z.count}
                    </div>
                  ))}
                </div>
                <div className="flex justify-center gap-6">
                  {zoneStats.map((z) => (
                    <div key={z.zone} className="flex items-center gap-2">
                      <div
                        className={`size-3 rounded-full ${ZONE_COLORS[z.zone] ?? "bg-gray-400"}`}
                      />
                      <span className="text-sm">
                        {ZONE_LABELS[z.zone] ?? z.zone} (
                        {Math.round((z.count / totalZone) * 100)}%)
                      </span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Top clients */}
        <Card>
          <CardHeader>
            <CardTitle>Топ клиентов по выручке</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Клиент</TableHead>
                  <TableHead className="text-right">Сумма</TableHead>
                  <TableHead className="text-center">Оплат</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {topClients.map((c, i) => (
                  <TableRow key={i}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{c.name}</p>
                        {c.company && (
                          <p className="text-xs text-muted-foreground">
                            {c.company}
                          </p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-right font-medium text-green-600">
                      {formatPriceRub(c.totalAmount)}
                    </TableCell>
                    <TableCell className="text-center">
                      {c.paymentCount}
                    </TableCell>
                  </TableRow>
                ))}
                {topClients.length === 0 && (
                  <TableRow>
                    <TableCell
                      colSpan={3}
                      className="text-center py-4 text-muted-foreground"
                    >
                      Нет данных
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {/* Manager performance */}
      <Card>
        <CardHeader>
          <CardTitle>Эффективность менеджеров</CardTitle>
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
              {managerPerformance.map((m, i) => (
                <TableRow key={i}>
                  <TableCell className="font-medium">{m.name}</TableCell>
                  <TableCell className="text-center">{m.completed}</TableCell>
                  <TableCell className="text-center">{m.total}</TableCell>
                  <TableCell className="text-center">
                    {m.total > 0
                      ? Math.round((m.completed / m.total) * 100)
                      : 0}
                    %
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
              {managerPerformance.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="text-center py-4 text-muted-foreground"
                  >
                    Нет данных
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
