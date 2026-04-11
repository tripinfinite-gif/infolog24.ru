import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ShieldCheck, AlertTriangle, XCircle, CalendarDays } from "lucide-react";
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
import { getSession } from "@/lib/auth/session";
import { getPermitsByUser } from "@/lib/dal/permits";

export const metadata: Metadata = {
  title: "Пропуска",
};

const zoneLabels: Record<string, string> = {
  mkad: "МКАД",
  ttk: "ТТК",
  sk: "СК",
};

const typeLabels: Record<string, string> = {
  mkad_day: "Дневной",
  mkad_night: "Ночной",
  ttk: "Годовой",
  sk: "Годовой",
  temp: "Временный",
};

function formatDate(date: string): string {
  const d = new Date(date);
  return d.toLocaleDateString("ru-RU", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

function getPermitDisplayStatus(
  status: string,
  validUntil: string,
): "active" | "expiring" | "expired" | "revoked" {
  if (status === "revoked") return "revoked";
  if (status === "expired") return "expired";

  const now = new Date();
  const expiry = new Date(validUntil);
  const daysUntilExpiry = Math.ceil(
    (expiry.getTime() - now.getTime()) / 86400000,
  );

  if (daysUntilExpiry < 0) return "expired";
  if (daysUntilExpiry <= 30) return "expiring";
  return "active";
}

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
  revoked: {
    label: "Аннулирован",
    variant: "destructive" as const,
    icon: XCircle,
    borderColor: "border-red-200",
  },
};

export default async function PermitsPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  const permits = await getPermitsByUser(session.user.id);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold">Пропуска</h1>
        {permits.length > 0 && (
          <Button asChild variant="outline" size="sm">
            <a
              href="/api/dashboard/calendar"
              download="infolog24-deadlines.ics"
            >
              <CalendarDays className="size-4" />
              <span>Скачать в календарь</span>
            </a>
          </Button>
        )}
      </div>

      {permits.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            У вас пока нет пропусков.
            <br />
            <Link href="/dashboard/orders/new">
              <Button variant="link" className="mt-2">
                Оформить пропуск
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {permits.map((permit) => {
            const displayStatus = getPermitDisplayStatus(
              permit.status,
              permit.validUntil,
            );
            const config = statusConfig[displayStatus];
            const Icon = config.icon;

            return (
              <Card
                key={permit.id}
                className={cn(
                  "transition-shadow hover:shadow-md",
                  config.borderColor,
                )}
              >
                <CardHeader className="flex-row items-start justify-between">
                  <div>
                    <CardTitle className="text-base">
                      {permit.permitNumber}
                    </CardTitle>
                  </div>
                  <Badge
                    variant={config.variant}
                    className="flex items-center gap-1"
                  >
                    <Icon className="size-3" />
                    {config.label}
                  </Badge>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Зона:</span>
                    <Badge variant="outline">
                      {zoneLabels[permit.zone] ?? permit.zone}
                    </Badge>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Тип:</span>
                    <span>{typeLabels[permit.type] ?? permit.type}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Действует:</span>
                    <span>
                      {formatDate(permit.validFrom)} —{" "}
                      {formatDate(permit.validUntil)}
                    </span>
                  </div>
                </CardContent>
                {displayStatus === "expiring" && (
                  <CardFooter>
                    <Link href="/dashboard/orders/new" className="w-full">
                      <Button className="w-full" size="sm">
                        Продлить
                      </Button>
                    </Link>
                  </CardFooter>
                )}
                {(displayStatus === "expired" ||
                  displayStatus === "revoked") && (
                  <CardFooter>
                    <Link href="/dashboard/orders/new" className="w-full">
                      <Button
                        className="w-full"
                        variant="outline"
                        size="sm"
                      >
                        Оформить заново
                      </Button>
                    </Link>
                  </CardFooter>
                )}
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
