"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import Link from "next/link";
import { Edit, Plus, Trash2, Truck } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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

const ecoClassLabels: Record<string, string> = {
  euro0: "Евро-0",
  euro1: "Евро-1",
  euro2: "Евро-2",
  euro3: "Евро-3",
  euro4: "Евро-4",
  euro5: "Евро-5",
  euro6: "Евро-6",
};

interface VehicleItem {
  id: string;
  brand: string;
  model: string;
  licensePlate: string;
  vin: string | null;
  year: number | null;
  ecoClass: string | null;
  maxWeight: number | null;
  category: string | null;
}

interface VehiclesListProps {
  vehicles: VehicleItem[];
}

export function VehiclesList({ vehicles }: VehiclesListProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  async function handleDelete(id: string) {
    if (!confirm("Вы уверены, что хотите удалить это ТС?")) return;

    try {
      const res = await fetch(`/api/vehicles/${id}`, { method: "DELETE" });
      if (!res.ok) {
        const data = await res.json();
        toast.error(data.error ?? "Не удалось удалить ТС");
        return;
      }
      toast.success("Транспортное средство удалено");
      startTransition(() => {
        router.refresh();
      });
    } catch {
      toast.error("Произошла ошибка при удалении");
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold">Транспорт</h1>
        <Link href="/dashboard/vehicles/new">
          <Button>
            <Plus className="size-4" />
            Добавить ТС
          </Button>
        </Link>
      </div>

      {vehicles.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            У вас пока нет зарегистрированных транспортных средств.
            <br />
            <Link href="/dashboard/vehicles/new">
              <Button variant="link" className="mt-2">
                Добавить первое ТС
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Mobile cards */}
          <div className="grid gap-4 sm:hidden">
            {vehicles.map((v) => (
              <Card key={v.id}>
                <CardHeader className="flex-row items-center justify-between pb-2">
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Truck className="size-4" />
                    {v.brand} {v.model}
                  </CardTitle>
                  {v.ecoClass && (
                    <Badge variant="outline">
                      {ecoClassLabels[v.ecoClass] ?? v.ecoClass}
                    </Badge>
                  )}
                </CardHeader>
                <CardContent className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Госномер:</span>
                    <span className="font-mono font-medium">
                      {v.licensePlate}
                    </span>
                  </div>
                  {v.year && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Год:</span>
                      <span>{v.year}</span>
                    </div>
                  )}
                  {v.maxWeight && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Масса:</span>
                      <span>{(v.maxWeight / 1000).toFixed(0)} т</span>
                    </div>
                  )}
                  <div className="flex gap-2 pt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      disabled
                    >
                      <Edit className="size-3" />
                      Изменить
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(v.id)}
                    >
                      <Trash2 className="size-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Desktop table */}
          <Card className="hidden sm:block">
            <CardContent className="pt-6">
              <div className={isPending ? "opacity-50" : ""}>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Марка / Модель</TableHead>
                      <TableHead>Госномер</TableHead>
                      <TableHead>Год</TableHead>
                      <TableHead>Экокласс</TableHead>
                      <TableHead>Масса</TableHead>
                      <TableHead>Категория</TableHead>
                      <TableHead className="text-right">Действия</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {vehicles.map((v) => (
                      <TableRow key={v.id}>
                        <TableCell className="font-medium">
                          {v.brand} {v.model}
                        </TableCell>
                        <TableCell className="font-mono">
                          {v.licensePlate}
                        </TableCell>
                        <TableCell>{v.year ?? "—"}</TableCell>
                        <TableCell>
                          {v.ecoClass ? (
                            <Badge variant="outline">
                              {ecoClassLabels[v.ecoClass] ?? v.ecoClass}
                            </Badge>
                          ) : (
                            "—"
                          )}
                        </TableCell>
                        <TableCell>
                          {v.maxWeight
                            ? `${(v.maxWeight / 1000).toFixed(0)} т`
                            : "—"}
                        </TableCell>
                        <TableCell>{v.category ?? "—"}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-1">
                            <Button variant="ghost" size="icon" disabled>
                              <Edit className="size-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDelete(v.id)}
                            >
                              <Trash2 className="size-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
