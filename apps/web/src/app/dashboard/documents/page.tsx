"use client";

import { useState } from "react";
import { FileText, Search, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// -- Mock data ----------------------------------------------------------------

interface DocItem {
  id: string;
  fileName: string;
  type: string;
  typeLabel: string;
  orderId: string;
  status: string;
  date: string;
}

const mockDocuments: DocItem[] = [
  { id: "d1", fileName: "СТС_К123АА77.pdf", type: "sts", typeLabel: "СТС", orderId: "ORD-2024-001", status: "approved", date: "09.04.2026" },
  { id: "d2", fileName: "ПТС_К123АА77.pdf", type: "pts", typeLabel: "ПТС", orderId: "ORD-2024-001", status: "approved", date: "09.04.2026" },
  { id: "d3", fileName: "Доверенность.pdf", type: "power_of_attorney", typeLabel: "Доверенность", orderId: "ORD-2024-001", status: "pending", date: "09.04.2026" },
  { id: "d4", fileName: "ВУ_Иванов.pdf", type: "driver_license", typeLabel: "Водительское удостоверение", orderId: "ORD-2024-002", status: "rejected", date: "07.04.2026" },
  { id: "d5", fileName: "СТС_М456ВВ99.pdf", type: "sts", typeLabel: "СТС", orderId: "ORD-2024-002", status: "approved", date: "07.04.2026" },
  { id: "d6", fileName: "Заявление_ТТК.pdf", type: "application", typeLabel: "Заявление", orderId: "ORD-2024-002", status: "pending", date: "07.04.2026" },
  { id: "d7", fileName: "Договор_перевозки.pdf", type: "contract", typeLabel: "Договор", orderId: "ORD-2024-004", status: "pending", date: "03.04.2026" },
  { id: "d8", fileName: "ПТС_А789СС50.pdf", type: "pts", typeLabel: "ПТС", orderId: "ORD-2024-003", status: "approved", date: "05.04.2026" },
];

const statusConfig: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
  pending: { label: "На проверке", variant: "outline" },
  approved: { label: "Одобрен", variant: "secondary" },
  rejected: { label: "Отклонён", variant: "destructive" },
};

const typeConfig: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
  sts: { label: "СТС", variant: "default" },
  pts: { label: "ПТС", variant: "default" },
  driver_license: { label: "ВУ", variant: "secondary" },
  power_of_attorney: { label: "Доверенность", variant: "secondary" },
  application: { label: "Заявление", variant: "outline" },
  contract: { label: "Договор", variant: "outline" },
  other: { label: "Другое", variant: "outline" },
};

// -- Component ----------------------------------------------------------------

export default function DocumentsPage() {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");

  const filteredDocs = mockDocuments.filter((doc) => {
    const matchesSearch =
      search === "" ||
      doc.fileName.toLowerCase().includes(search.toLowerCase()) ||
      doc.orderId.toLowerCase().includes(search.toLowerCase());
    const matchesType = typeFilter === "all" || doc.type === typeFilter;
    return matchesSearch && matchesType;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold">Документы</h1>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Upload className="size-4" />
              Загрузить документ
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Загрузка документа</DialogTitle>
              <DialogDescription>
                Загрузите документ для вашей заявки
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Тип документа</Label>
                <Select>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Выберите тип" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sts">СТС</SelectItem>
                    <SelectItem value="pts">ПТС</SelectItem>
                    <SelectItem value="driver_license">Водительское удостоверение</SelectItem>
                    <SelectItem value="power_of_attorney">Доверенность</SelectItem>
                    <SelectItem value="application">Заявление</SelectItem>
                    <SelectItem value="contract">Договор</SelectItem>
                    <SelectItem value="other">Другое</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-muted-foreground/25 p-8 text-muted-foreground">
                <Upload className="size-8" />
                <span className="font-medium">
                  Перетащите файл сюда или нажмите для выбора
                </span>
                <span className="text-xs">PDF, JPG, PNG до 10 МБ</span>
              </div>
              <Button className="w-full">Загрузить</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Поиск по имени файла или номеру заявки..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Тип документа" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Все типы</SelectItem>
                <SelectItem value="sts">СТС</SelectItem>
                <SelectItem value="pts">ПТС</SelectItem>
                <SelectItem value="driver_license">ВУ</SelectItem>
                <SelectItem value="power_of_attorney">Доверенность</SelectItem>
                <SelectItem value="application">Заявление</SelectItem>
                <SelectItem value="contract">Договор</SelectItem>
                <SelectItem value="other">Другое</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Файл</TableHead>
                <TableHead>Тип</TableHead>
                <TableHead>Заявка</TableHead>
                <TableHead>Статус</TableHead>
                <TableHead>Дата</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredDocs.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                    Документы не найдены
                  </TableCell>
                </TableRow>
              ) : (
                filteredDocs.map((doc) => {
                  const sc = statusConfig[doc.status];
                  const tc = typeConfig[doc.type];
                  return (
                    <TableRow key={doc.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <FileText className="size-4 text-muted-foreground" />
                          {doc.fileName}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={tc?.variant}>{tc?.label}</Badge>
                      </TableCell>
                      <TableCell>{doc.orderId}</TableCell>
                      <TableCell>
                        <Badge variant={sc?.variant}>{sc?.label}</Badge>
                      </TableCell>
                      <TableCell>{doc.date}</TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
