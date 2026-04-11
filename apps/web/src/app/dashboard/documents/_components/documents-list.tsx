"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { FileText, Search, Upload, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
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

const statusConfig: Record<
  string,
  { label: string; variant: "default" | "secondary" | "destructive" | "outline" }
> = {
  pending: { label: "На проверке", variant: "outline" },
  approved: { label: "Одобрен", variant: "secondary" },
  rejected: { label: "Отклонён", variant: "destructive" },
};

const typeConfig: Record<
  string,
  { label: string; variant: "default" | "secondary" | "destructive" | "outline" }
> = {
  sts: { label: "СТС", variant: "default" },
  pts: { label: "ПТС", variant: "default" },
  driver_license: { label: "ВУ", variant: "secondary" },
  power_of_attorney: { label: "Доверенность", variant: "secondary" },
  application: { label: "Заявление", variant: "outline" },
  contract: { label: "Договор", variant: "outline" },
  other: { label: "Другое", variant: "outline" },
};

interface DocumentItem {
  id: string;
  fileName: string;
  type: string;
  orderId: string | null;
  vehicleId: string | null;
  status: string;
  rejectionReason: string | null;
  createdAt: Date | string;
}

function formatDate(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString("ru-RU", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

interface DocumentsListProps {
  documents: DocumentItem[];
}

export function DocumentsList({ documents }: DocumentsListProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [uploadOpen, setUploadOpen] = useState(false);
  const [uploadType, setUploadType] = useState("");
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const filteredDocs = documents.filter((doc) => {
    const matchesSearch =
      search === "" ||
      doc.fileName.toLowerCase().includes(search.toLowerCase());
    const matchesType = typeFilter === "all" || doc.type === typeFilter;
    return matchesSearch && matchesType;
  });

  async function handleUpload() {
    if (!uploadFile || !uploadType) {
      toast.error("Выберите тип документа и файл");
      return;
    }

    setIsUploading(true);
    try {
      // Step 1: Get presigned URL
      const urlRes = await fetch("/api/documents/upload-url", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fileName: uploadFile.name,
          mimeType: uploadFile.type,
          fileSize: uploadFile.size,
        }),
      });

      if (!urlRes.ok) {
        toast.error("Не удалось получить ссылку для загрузки");
        return;
      }

      const { uploadUrl, key } = await urlRes.json();

      // Step 2: Upload to S3
      try {
        await fetch(uploadUrl, {
          method: "PUT",
          body: uploadFile,
          headers: { "Content-Type": uploadFile.type },
        });
      } catch {
        toast.warning("Хранилище не настроено. Документ зарегистрирован без файла.");
      }

      // Step 3: Register document
      const docRes = await fetch("/api/documents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: uploadType,
          fileName: uploadFile.name,
          fileUrl: `https://storage.example.com/${key}`,
          fileSize: uploadFile.size,
          mimeType: uploadFile.type,
        }),
      });

      if (!docRes.ok) {
        toast.error("Не удалось зарегистрировать документ");
        return;
      }

      toast.success("Документ загружен");
      setUploadOpen(false);
      setUploadFile(null);
      setUploadType("");
      startTransition(() => {
        router.refresh();
      });
    } catch {
      toast.error("Произошла ошибка при загрузке");
    } finally {
      setIsUploading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold">Документы</h1>
        <Dialog open={uploadOpen} onOpenChange={setUploadOpen}>
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
                <Select value={uploadType} onValueChange={setUploadType}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Выберите тип" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sts">СТС</SelectItem>
                    <SelectItem value="pts">ПТС</SelectItem>
                    <SelectItem value="driver_license">
                      Водительское удостоверение
                    </SelectItem>
                    <SelectItem value="power_of_attorney">
                      Доверенность
                    </SelectItem>
                    <SelectItem value="application">Заявление</SelectItem>
                    <SelectItem value="contract">Договор</SelectItem>
                    <SelectItem value="other">Другое</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-muted-foreground/25 p-8 text-muted-foreground hover:border-primary hover:text-primary">
                <Upload className="size-8" />
                <span className="font-medium">
                  {uploadFile
                    ? uploadFile.name
                    : "Перетащите файл сюда или нажмите для выбора"}
                </span>
                <span className="text-xs">PDF, JPG, PNG до 10 МБ</span>
                <input
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  className="hidden"
                  onChange={(e) => setUploadFile(e.target.files?.[0] ?? null)}
                />
              </label>
              <Button
                className="w-full"
                onClick={handleUpload}
                disabled={isUploading || !uploadFile || !uploadType}
              >
                {isUploading && <Loader2 className="size-4 animate-spin" />}
                Загрузить
              </Button>
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
                placeholder="Поиск по имени файла..."
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
          <div className={isPending ? "opacity-50" : ""}>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Файл</TableHead>
                  <TableHead>Тип</TableHead>
                  <TableHead>Статус</TableHead>
                  <TableHead>Дата</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDocs.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={4}
                      className="py-8 text-center text-muted-foreground"
                    >
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
                            <div>
                              {doc.fileName}
                              {doc.status === "rejected" &&
                                doc.rejectionReason && (
                                  <p className="text-xs text-destructive">
                                    Причина: {doc.rejectionReason}
                                  </p>
                                )}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={tc?.variant}>
                            {tc?.label ?? doc.type}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={sc?.variant}>
                            {sc?.label ?? doc.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{formatDate(doc.createdAt)}</TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
