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
import { authClient } from "@/lib/auth/client";

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

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((w) => w[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

interface DashboardShellProps {
  children: React.ReactNode;
  userName: string;
  userEmail: string;
}

export function DashboardShell({ children, userName, userEmail }: DashboardShellProps) {
  const pathname = usePathname();
  const crumbs = getBreadcrumbs(pathname);

  async function handleSignOut() {
    await authClient.signOut();
    window.location.href = "/";
  }

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
                    <AvatarFallback>{getInitials(userName)}</AvatarFallback>
                  </Avatar>
                  <span className="hidden text-sm font-medium md:inline-block">
                    {userName}
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium">{userName}</p>
                    <p className="text-xs text-muted-foreground">{userEmail}</p>
                  </div>
                </DropdownMenuLabel>
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
                <DropdownMenuItem variant="destructive" onClick={handleSignOut}>
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
