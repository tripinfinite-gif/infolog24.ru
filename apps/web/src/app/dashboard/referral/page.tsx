import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { CheckCircle2, Clock, Gift, Users } from "lucide-react";

import { getSession } from "@/lib/auth/session";
import { getOrCreateReferralCode } from "@/lib/dal/users";
import { listClientReferrals } from "@/lib/dal/referrals";
import { absoluteUrl } from "@/lib/utils/base-url";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
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
import type { PartnerReferral } from "@/lib/types";
import { ShareCard } from "./_components/share-card";

export const metadata: Metadata = {
  title: "Пригласить друга",
};

const statusMeta: Record<
  PartnerReferral["status"],
  { label: string; variant: "outline" | "secondary" | "default" }
> = {
  pending: { label: "Ожидает заказа", variant: "outline" },
  confirmed: { label: "Бонус начислен", variant: "secondary" },
  paid: { label: "Бонус использован", variant: "default" },
};

function formatDate(date: Date | string): string {
  return new Intl.DateTimeFormat("ru-RU", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(date));
}

function formatMoney(value: number): string {
  return new Intl.NumberFormat("ru-RU", {
    style: "currency",
    currency: "RUB",
    maximumFractionDigits: 0,
  }).format(value);
}

export default async function ReferralPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  const referralCode = await getOrCreateReferralCode(session.user.id);
  const referralUrl = absoluteUrl(`/?ref=${referralCode}`);
  const referrals = await listClientReferrals(session.user.id);

  const confirmedCount = referrals.filter(
    (r) => r.status === "confirmed" || r.status === "paid",
  ).length;
  const pendingCount = referrals.filter((r) => r.status === "pending").length;

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      {/* Hero */}
      <section className="rounded-2xl bg-gradient-to-br from-primary to-primary/80 p-6 text-primary-foreground sm:p-8">
        <div className="flex items-start gap-4">
          <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-primary-foreground/15">
            <Gift className="size-6" />
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl font-bold sm:text-3xl">
              Пригласите друга — получите 1000 ₽ на следующий заказ
            </h1>
            <p className="text-sm text-primary-foreground/80 sm:text-base">
              Поделитесь ссылкой с коллегой-перевозчиком. Когда друг оформит
              и оплатит первый заказ, мы начислим вам промокод на 1000 ₽.
            </p>
          </div>
        </div>
      </section>

      {/* Счётчики */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="flex items-center gap-3 py-5">
            <div className="flex size-10 items-center justify-center rounded-lg bg-muted">
              <Users className="size-5 text-muted-foreground" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Приглашено</p>
              <p className="text-xl font-bold">{referrals.length}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 py-5">
            <div className="flex size-10 items-center justify-center rounded-lg bg-muted">
              <Clock className="size-5 text-muted-foreground" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Ожидают заказа</p>
              <p className="text-xl font-bold">{pendingCount}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 py-5">
            <div className="flex size-10 items-center justify-center rounded-lg bg-muted">
              <CheckCircle2 className="size-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Бонусов получено</p>
              <p className="text-xl font-bold">{confirmedCount}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Ваша ссылка */}
      <Card>
        <CardHeader>
          <CardTitle>Ваша реферальная ссылка</CardTitle>
          <CardDescription>
            Код {referralCode} — персональный. Любой, кто зарегистрируется
            по этой ссылке, станет вашим рефералом.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ShareCard referralUrl={referralUrl} />
        </CardContent>
      </Card>

      {/* Как это работает */}
      <Card>
        <CardHeader>
          <CardTitle>Как это работает</CardTitle>
          <CardDescription>Три шага — от ссылки до бонуса.</CardDescription>
        </CardHeader>
        <CardContent>
          <ol className="space-y-4">
            <li className="flex gap-4">
              <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                1
              </span>
              <div>
                <p className="font-semibold">Поделитесь ссылкой</p>
                <p className="text-sm text-muted-foreground">
                  Скопируйте ссылку или отправьте её сразу через WhatsApp/Telegram.
                </p>
              </div>
            </li>
            <li className="flex gap-4">
              <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                2
              </span>
              <div>
                <p className="font-semibold">Друг оформляет заявку</p>
                <p className="text-sm text-muted-foreground">
                  После регистрации и подачи первой заявки реферал получает
                  статус «Ожидает заказа».
                </p>
              </div>
            </li>
            <li className="flex gap-4">
              <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                3
              </span>
              <div>
                <p className="font-semibold">
                  Друг оплачивает — вы получаете промокод
                </p>
                <p className="text-sm text-muted-foreground">
                  Как только заказ друга оплачен, мы выдаём вам промокод на
                  1000 ₽. Его можно применить к следующему заказу в течение
                  90 дней.
                </p>
              </div>
            </li>
          </ol>
        </CardContent>
      </Card>

      {/* Таблица рефералов */}
      <Card>
        <CardHeader>
          <CardTitle>Мои приглашённые</CardTitle>
          <CardDescription>
            {referrals.length === 0
              ? "Пока никто не пришёл по вашей ссылке. Поделитесь ей — и вы увидите статус здесь."
              : `Всего приглашений: ${referrals.length}.`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {referrals.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">
              Нет данных. Отправьте ссылку первому другу и отслеживайте
              статус здесь.
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Дата</TableHead>
                  <TableHead>Друг</TableHead>
                  <TableHead>Статус</TableHead>
                  <TableHead className="text-right">Бонус</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {referrals.map((r) => {
                  const meta = statusMeta[r.status];
                  return (
                    <TableRow key={r.id}>
                      <TableCell className="whitespace-nowrap">
                        {formatDate(r.createdAt)}
                      </TableCell>
                      <TableCell>
                        {r.referredUserName ??
                          (r.referredUserEmail ? (
                            <span className="text-muted-foreground">
                              {r.referredUserEmail}
                            </span>
                          ) : (
                            <span className="text-muted-foreground">
                              Ожидает регистрации
                            </span>
                          ))}
                      </TableCell>
                      <TableCell>
                        <Badge variant={meta.variant}>{meta.label}</Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        {r.commission ? formatMoney(r.commission) : "—"}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
