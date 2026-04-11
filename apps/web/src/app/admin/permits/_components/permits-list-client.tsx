"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  formatDate,
  ORDER_TYPE_LABELS,
  ZONE_LABELS,
  PERMIT_STATUS_LABELS,
  PERMIT_STATUS_COLORS,
} from "../../_components/format-utils";

interface SerializedPermit {
  id: string;
  permitNumber: string;
  zone: string;
  type: string;
  status: string;
  validFrom: string;
  validUntil: string;
  orderId: string;
  userId: string;
  clientName: string;
  vehiclePlate: string;
}

interface PermitsListClientProps {
  permits: SerializedPermit[];
  stats: { active: number; expired: number; total: number };
}

export function PermitsListClient({
  permits,
  stats,
}: PermitsListClientProps) {
  const router = useRouter();
  const [revokeLoading, setRevokeLoading] = useState<string | null>(null);

  async function handleRevoke(permitId: string) {
    setRevokeLoading(permitId);
    try {
      await fetch("/api/admin/permits", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ permitId, action: "revoke" }),
      });
      router.refresh();
    } finally {
      setRevokeLoading(null);
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Пропуска</h1>

      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-0">
            <p className="text-2xl font-bold text-green-600">
              {stats.active}
            </p>
            <p className="text-xs text-muted-foreground">Активных</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-0">
            <p className="text-2xl font-bold text-gray-600">
              {stats.expired}
            </p>
            <p className="text-xs text-muted-foreground">Истекших</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-0">
            <p className="text-2xl font-bold">{stats.total}</p>
            <p className="text-xs text-muted-foreground">Всего</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Номер пропуска</TableHead>
                <TableHead>Клиент</TableHead>
                <TableHead>ТС</TableHead>
                <TableHead>Зона</TableHead>
                <TableHead>Тип</TableHead>
                <TableHead>Действует с</TableHead>
                <TableHead>Действует до</TableHead>
                <TableHead>Статус</TableHead>
                <TableHead className="w-24" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {permits.map((permit) => (
                <TableRow key={permit.id}>
                  <TableCell className="font-mono font-medium">
                    {permit.permitNumber}
                  </TableCell>
                  <TableCell>
                    <Link
                      href={`/admin/clients/${permit.userId}`}
                      className="text-primary hover:underline"
                    >
                      {permit.clientName}
                    </Link>
                  </TableCell>
                  <TableCell>{permit.vehiclePlate}</TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {ZONE_LABELS[permit.zone] ?? permit.zone}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm">
                    {ORDER_TYPE_LABELS[permit.type] ?? permit.type}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {formatDate(permit.validFrom)}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {formatDate(permit.validUntil)}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="secondary"
                      className={PERMIT_STATUS_COLORS[permit.status] ?? ""}
                    >
                      {PERMIT_STATUS_LABELS[permit.status] ?? permit.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {permit.status === "active" && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-red-600"
                        disabled={revokeLoading === permit.id}
                        onClick={() => handleRevoke(permit.id)}
                      >
                        {revokeLoading === permit.id ? "..." : "Отозвать"}
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
              {permits.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={9}
                    className="text-center py-8 text-muted-foreground"
                  >
                    Пропуска не найдены
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
