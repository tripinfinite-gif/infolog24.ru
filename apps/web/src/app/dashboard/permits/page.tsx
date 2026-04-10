import type { Metadata } from "next";
import { ShieldCheck, AlertTriangle, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Пропуска",
};

// -- Mock data ----------------------------------------------------------------

interface Permit {
  id: string;
  number: string;
  zone: string;
  type: string;
  validFrom: string;
  validUntil: string;
  status: "active" | "expiring" | "expired";
  vehicle: string;
}

const mockPermits: Permit[] = [
  {
    id: "1",
    number: "ПР-2024-0045",
    zone: "МКАД",
    type: "Дневной",
    validFrom: "10.04.2025",
    validUntil: "25.04.2026",
    status: "expiring",
    vehicle: "MAN TGX 18.510 — К 123 АА 77",
  },
  {
    id: "2",
    number: "ПР-2024-0032",
    zone: "ТТК",
    type: "Годовой",
    validFrom: "01.05.2025",
    validUntil: "30.04.2026",
    status: "expiring",
    vehicle: "Volvo FH16 — М 456 ВВ 99",
  },
  {
    id: "3",
    number: "ПР-2024-0078",
    zone: "МКАД",
    type: "Ночной",
    validFrom: "15.06.2025",
    validUntil: "15.06.2026",
    status: "active",
    vehicle: "Scania R500 — А 789 СС 50",
  },
  {
    id: "4",
    number: "ПР-2024-0091",
    zone: "СК",
    type: "Годовой",
    validFrom: "01.07.2025",
    validUntil: "01.07.2026",
    status: "active",
    vehicle: "DAF XF — Р 321 ДД 77",
  },
  {
    id: "5",
    number: "ПР-2024-0012",
    zone: "МКАД",
    type: "Дневной",
    validFrom: "01.01.2025",
    validUntil: "01.01.2026",
    status: "expired",
    vehicle: "Mercedes Actros — В 654 ЕЕ 50",
  },
  {
    id: "6",
    number: "ПР-2024-0055",
    zone: "ТТК",
    type: "Годовой",
    validFrom: "15.08.2025",
    validUntil: "15.08.2026",
    status: "active",
    vehicle: "Iveco Stralis — Н 987 ЖЖ 77",
  },
  {
    id: "7",
    number: "ПР-2024-0099",
    zone: "МКАД",
    type: "Дневной",
    validFrom: "20.09.2025",
    validUntil: "20.09.2026",
    status: "active",
    vehicle: "Renault T — О 111 ЗЗ 99",
  },
];

const statusConfig = {
  active: {
    label: "Действует",
    variant: "secondary" as const,
    icon: ShieldCheck,
    borderColor: "border-green-200",
  },
  expiring: {
    label: "Истекает",
    variant: "outline" as const,
    icon: AlertTriangle,
    borderColor: "border-amber-300",
  },
  expired: {
    label: "Истёк",
    variant: "destructive" as const,
    icon: XCircle,
    borderColor: "border-red-200",
  },
};

// -- Component ----------------------------------------------------------------

export default function PermitsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Пропуска</h1>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {mockPermits.map((permit) => {
          const config = statusConfig[permit.status];
          const Icon = config.icon;
          return (
            <Card key={permit.id} className={cn("transition-shadow hover:shadow-md", config.borderColor)}>
              <CardHeader className="flex-row items-start justify-between">
                <div>
                  <CardTitle className="text-base">{permit.number}</CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">
                    {permit.vehicle}
                  </p>
                </div>
                <Badge variant={config.variant} className="flex items-center gap-1">
                  <Icon className="size-3" />
                  {config.label}
                </Badge>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Зона:</span>
                  <Badge variant="outline">{permit.zone}</Badge>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Тип:</span>
                  <span>{permit.type}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Действует:</span>
                  <span>
                    {permit.validFrom} — {permit.validUntil}
                  </span>
                </div>
              </CardContent>
              {permit.status === "expiring" && (
                <CardFooter>
                  <Button className="w-full" size="sm">
                    Продлить
                  </Button>
                </CardFooter>
              )}
              {permit.status === "expired" && (
                <CardFooter>
                  <Button className="w-full" variant="outline" size="sm">
                    Оформить заново
                  </Button>
                </CardFooter>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
}
