"use client";

import {
  BarChart3,
  Bell,
  CreditCard,
  FileText,
  LayoutDashboard,
  LogOut,
  Menu,
  ScrollText,
  Settings,
  ShieldCheck,
  Truck,
  Users,
  X,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, type ElementType } from "react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
import { cn } from "@/lib/utils";

interface NavItem {
  href: string;
  label: string;
  icon: ElementType;
}

const navItems: NavItem[] = [
  { href: "/admin", label: "Дашборд", icon: LayoutDashboard },
  { href: "/admin/orders", label: "Заявки", icon: FileText },
  { href: "/admin/clients", label: "Клиенты", icon: Users },
  { href: "/admin/permits", label: "Пропуска", icon: ShieldCheck },
  { href: "/admin/payments", label: "Платежи", icon: CreditCard },
  { href: "/admin/analytics", label: "Аналитика", icon: BarChart3 },
  { href: "/admin/settings", label: "Настройки", icon: Settings },
  { href: "/admin/audit", label: "Аудит", icon: ScrollText },
];

interface AdminShellProps {
  children: React.ReactNode;
  userName?: string;
  userRole?: string;
}

const ROLE_LABELS: Record<string, string> = {
  admin: "Администратор",
  manager: "Менеджер",
};

export function AdminShell({ children, userName, userRole }: AdminShellProps) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const displayName = userName ?? "Пользователь";
  const roleLabel = ROLE_LABELS[userRole ?? ""] ?? userRole ?? "";
  const initials = displayName
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Mobile toggle */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed left-4 top-4 z-50 lg:hidden"
        onClick={() => setIsOpen(!isOpen)}
        aria-label={isOpen ? "Закрыть меню" : "Открыть меню"}
      >
        {isOpen ? <X className="size-5" /> : <Menu className="size-5" />}
      </Button>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r bg-sidebar-background transition-transform duration-200 lg:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Logo */}
        <div className="flex h-16 items-center gap-2 border-b px-6 lg:h-[72px]">
          <Truck className="size-6 text-sidebar-primary" />
          <div className="flex flex-col">
            <span className="text-lg font-bold leading-tight text-sidebar-foreground">
              Инфолог24
            </span>
            <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
              Панель управления
            </span>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 space-y-1 overflow-y-auto p-4">
          {navItems.map((item) => {
            const isActive =
              item.href === "/admin"
                ? pathname === "/admin"
                : pathname.startsWith(item.href);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-sidebar-primary text-sidebar-primary-foreground"
                    : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                )}
              >
                <Icon className="size-5 shrink-0" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top bar */}
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-background px-4 lg:px-6">
          {/* Left: page title area */}
          <div className="ml-12 lg:ml-0" />

          {/* Right side */}
          <div className="flex items-center gap-3">
            {/* Notifications */}
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="size-5" />
            </Button>

            {/* Role badge */}
            <Badge variant="secondary" className="hidden md:inline-flex">
              {roleLabel}
            </Badge>

            {/* User dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="flex items-center gap-2 px-2"
                >
                  <Avatar>
                    <AvatarFallback>{initials}</AvatarFallback>
                  </Avatar>
                  <span className="hidden text-sm font-medium md:inline-block">
                    {displayName}
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuLabel>Панель управления</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <Link href="/admin/settings">
                  <DropdownMenuItem>
                    <Settings className="size-4" />
                    Настройки
                  </DropdownMenuItem>
                </Link>
                <DropdownMenuSeparator />
                <Link href="/auth/logout">
                  <DropdownMenuItem variant="destructive">
                    <LogOut className="size-4" />
                    Выйти
                  </DropdownMenuItem>
                </Link>
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
