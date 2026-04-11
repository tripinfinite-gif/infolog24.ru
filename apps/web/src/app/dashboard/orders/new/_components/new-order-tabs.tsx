"use client";

import { FileArchive, FileText } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArchiveUploader } from "./archive-uploader";
import { NewOrderForm } from "./new-order-form";

interface VehicleOption {
  id: string;
  brand: string;
  model: string;
  licensePlate: string;
}

interface NewOrderTabsProps {
  vehicles: VehicleOption[];
  initialTab?: "form" | "archive";
  initialType?: string | null;
  initialVehicleId?: string | null;
}

export function NewOrderTabs({
  vehicles,
  initialTab = "form",
  initialType = null,
  initialVehicleId = null,
}: NewOrderTabsProps) {
  return (
    <Tabs defaultValue={initialTab} className="w-full">
      <TabsList className="mb-6 grid w-full grid-cols-2 sm:max-w-md">
        <TabsTrigger value="form" className="gap-2">
          <FileText className="size-4" />
          <span>Заполнить форму</span>
        </TabsTrigger>
        <TabsTrigger value="archive" className="gap-2">
          <FileArchive className="size-4" />
          <span>Загрузить архив</span>
        </TabsTrigger>
      </TabsList>

      <TabsContent value="form">
        <NewOrderForm
          vehicles={vehicles}
          initialType={initialType}
          initialVehicleId={initialVehicleId}
        />
      </TabsContent>

      <TabsContent value="archive">
        <div className="rounded-2xl border bg-card p-6">
          <div className="mb-4">
            <h2 className="text-lg font-semibold">Загрузить архив документов</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Соберите все документы (СТС, ПТС, доверенность, договор) в один
              ZIP и загрузите. Мы автоматически распакуем, классифицируем и
              создадим заявку. Если у вас включён OCR — данные грузовика
              распознаются автоматически.
            </p>
          </div>
          <ArchiveUploader vehicles={vehicles} />
        </div>
      </TabsContent>
    </Tabs>
  );
}
