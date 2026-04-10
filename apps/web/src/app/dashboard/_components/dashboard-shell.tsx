"use client";

import { Bell, LogOut, Settings, User } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Sidebar } from "@/components/layout/sidebar";
import { Button } from "@/components/ui/button";
import {
  Avatar,
  AvatarFallback,
} from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";

const breadcrumbMap: Record<string, string> = {
  "/dashboard": "Дашборд",
  "/dashboard/orders": "Заявки",
  "/dashboard/orders/new": "Новая заявка",
  "/dashboard/permits": "Пропуска",
  "/dashboard/vehicles": "Транспорт",
  "/dashboard/vehicles/new": "Добавить ТС",
  "/dashboard/documents": "Документы",
  "/dashboard/payments": "Оплата",
  "/dashboard/notifications": "Уведомления",
  "/dashboard/settings": "Настройки",
};

// Sidebar uses transliterated paths, map them too
const sidebarPathMap: Record<string, string> = {
  "/dashboard/zayavki": "/dashboard/orders",
  "/dashboard/propuska": "/dashboard/permits",
  "/dashboard/transport": "/dashboard/vehicles",
  "/dashboard/dokumenty": "/dashboard/documents",
  "/dashboard/oplata": "/dashboard/payments",
  "/dashboard/uvedomleniya": "/dashboard/notifications",
  "/dashboard/nastroyki": "/dashboard/settings",
};

function getBreadcrumbs(pathname: string) {
  const segments = pathname.split("/").filter(Boolean);
  const crumbs: { label: string; href: string }[] = [];

  let path = "";
  for (const segment of segments) {
    path += `/${segment}`;
    const label = breadcrumbMap[path];
    if (label) {
      crumbs.push({ label, href: path });
    }
  }

  return crumbs;
}

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const crumbs = getBreadcrumbs(pathname);

  return (
    <div className="min-h-screen bg-muted/30">
      <Sidebar />

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top bar */}
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-background px-4 lg:px-6">
          {/* Breadcrumbs (desktop) — offset for mobile hamburger */}
          <nav className="ml-12 flex items-center gap-1 text-sm text-muted-foreground lg:ml-0">
            {crumbs.map((crumb, i) => (
              <span key={crumb.href} className="flex items-center gap-1">
                {i > 0 && <span className="mx-1">/</span>}
                {i === crumbs.length - 1 ? (
                  <span className="font-medium text-foreground">
                    {crumb.label}
                  </span>
                ) : (
                  <Link
                    href={crumb.href}
                    className="hover:text-foreground"
                  >
                    {crumb.label}
                  </Link>
                )}
              </span>
            ))}
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-2">
            {/* Notifications */}
            <Link href="/dashboard/notifications">
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="size-5" />
                <Badge className="absolute -top-1 -right-1 flex size-5 items-center justify-center p-0 text-[10px]">
                  3
                </Badge>
              </Button>
            </Link>

            {/* User dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="flex items-center gap-2 px-2"
                >
                  <Avatar>
                    <AvatarFallback>ИИ</AvatarFallback>
                  </Avatar>
                  <span className="hidden text-sm font-medium md:inline-block">
                    Иван Иванов
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuLabel>Мой аккаунт</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <Link href="/dashboard/settings">
                  <DropdownMenuItem>
                    <User className="size-4" />
                    Профиль
                  </DropdownMenuItem>
                </Link>
                <Link href="/dashboard/settings">
                  <DropdownMenuItem>
                    <Settings className="size-4" />
                    Настройки
                  </DropdownMenuItem>
                </Link>
                <DropdownMenuSeparator />
                <DropdownMenuItem variant="destructive">
                  <LogOut className="size-4" />
                  Выйти
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Page content */}
        <main className="p-4 lg:p-6">{children}</main>
      </div>
    </div>
  );
}
