"use client";

import Link from "next/link";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { PERMITS, ZONE_LABELS, ORDER_TYPE_LABELS, formatDate } from "../_components/mock-data";

export default function PermitsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Пропуска</h1>

      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-0">
            <p className="text-2xl font-bold text-green-600">
              {PERMITS.filter((p) => p.status === "active").length}
            </p>
            <p className="text-xs text-muted-foreground">Активных</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-0">
            <p className="text-2xl font-bold text-gray-600">
              {PERMITS.filter((p) => p.status === "expired").length}
            </p>
            <p className="text-xs text-muted-foreground">Истекших</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-0">
            <p className="text-2xl font-bold">{PERMITS.length}</p>
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
              </TableRow>
            </TableHeader>
            <TableBody>
              {PERMITS.map((permit) => (
                <TableRow key={permit.id}>
                  <TableCell className="font-mono font-medium">
                    {permit.permitNumber}
                  </TableCell>
                  <TableCell>{permit.clientName}</TableCell>
                  <TableCell>{permit.vehiclePlate}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{ZONE_LABELS[permit.zone]}</Badge>
                  </TableCell>
                  <TableCell className="text-sm">
                    {ORDER_TYPE_LABELS[permit.type]}
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
                      className={cn(
                        permit.status === "active" && "bg-green-100 text-green-700",
                        permit.status === "expired" && "bg-gray-100 text-gray-700",
                        permit.status === "revoked" && "bg-red-100 text-red-700"
                      )}
                    >
                      {permit.status === "active" && "Активен"}
                      {permit.status === "expired" && "Истёк"}
                      {permit.status === "revoked" && "Отозван"}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
