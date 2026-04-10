import Link from "next/link";
import type { Metadata } from "next";
import { Edit, Plus, Trash2, Truck } from "lucide-react";
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

export const metadata: Metadata = {
  title: "Транспорт",
};

// -- Mock data ----------------------------------------------------------------

const mockVehicles = [
  {
    id: "v1",
    brand: "MAN",
    model: "TGX 18.510",
    licensePlate: "К 123 АА 77",
    vin: "WMAN05ZZ0CY123456",
    year: 2022,
    ecoClass: "Евро-5",
    maxWeight: 18000,
    category: "Тягач",
  },
  {
    id: "v2",
    brand: "Volvo",
    model: "FH16",
    licensePlate: "М 456 ВВ 99",
    vin: "YV2RT40A4CB654321",
    year: 2021,
    ecoClass: "Евро-5",
    maxWeight: 16000,
    category: "Тягач",
  },
  {
    id: "v3",
    brand: "Scania",
    model: "R500",
    licensePlate: "А 789 СС 50",
    vin: "XLER4X20005789012",
    year: 2023,
    ecoClass: "Евро-6",
    maxWeight: 19000,
    category: "Фургон",
  },
  {
    id: "v4",
    brand: "DAF",
    model: "XF 480",
    licensePlate: "Р 321 ДД 77",
    vin: "XLRTE47MS0E345678",
    year: 2020,
    ecoClass: "Евро-4",
    maxWeight: 18000,
    category: "Тягач",
  },
  {
    id: "v5",
    brand: "Mercedes-Benz",
    model: "Actros 1845",
    licensePlate: "В 654 ЕЕ 50",
    vin: "WDB96340310901234",
    year: 2019,
    ecoClass: "Евро-5",
    maxWeight: 18000,
    category: "Тягач",
  },
];

// -- Component ----------------------------------------------------------------

export default function VehiclesPage() {
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

      {/* Mobile cards */}
      <div className="grid gap-4 sm:hidden">
        {mockVehicles.map((v) => (
          <Card key={v.id}>
            <CardHeader className="flex-row items-center justify-between pb-2">
              <CardTitle className="flex items-center gap-2 text-base">
                <Truck className="size-4" />
                {v.brand} {v.model}
              </CardTitle>
              <Badge variant="outline">{v.ecoClass}</Badge>
            </CardHeader>
            <CardContent className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Госномер:</span>
                <span className="font-mono font-medium">{v.licensePlate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Год:</span>
                <span>{v.year}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Масса:</span>
                <span>{(v.maxWeight / 1000).toFixed(0)} т</span>
              </div>
              <div className="flex gap-2 pt-2">
                <Button variant="outline" size="sm" className="flex-1">
                  <Edit className="size-3" />
                  Изменить
                </Button>
                <Button variant="outline" size="sm">
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
              {mockVehicles.map((v) => (
                <TableRow key={v.id}>
                  <TableCell className="font-medium">
                    {v.brand} {v.model}
                  </TableCell>
                  <TableCell className="font-mono">{v.licensePlate}</TableCell>
                  <TableCell>{v.year}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{v.ecoClass}</Badge>
                  </TableCell>
                  <TableCell>{(v.maxWeight / 1000).toFixed(0)} т</TableCell>
                  <TableCell>{v.category}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button variant="ghost" size="icon-sm">
                        <Edit className="size-4" />
                      </Button>
                      <Button variant="ghost" size="icon-sm">
                        <Trash2 className="size-4" />
                      </Button>
                    </div>
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
