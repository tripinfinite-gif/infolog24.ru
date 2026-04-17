"use client";

import {
  Bell,
  CreditCard,
  FileText,
  Files,
  Gift,
  LayoutDashboard,
  Menu,
  Settings,
  ShieldCheck,
  Truck,
  X,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, type ElementType } from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface NavItem {
  href: string;
  label: string;
  icon: ElementType;
}

const navItems: NavItem[] = [
  { href: "/dashboard", label: "Дашборд", icon: LayoutDashboard },
  { href: "/dashboard/zayavki", label: "Заявки", icon: FileText },
  { href: "/dashboard/propuska", label: "Пропуска", icon: ShieldCheck },
  { href: "/dashboard/transport", label: "Транспорт", icon: Truck },
  { href: "/dashboard/dokumenty", label: "Документы", icon: Files },
  { href: "/dashboard/oplata", label: "Оплата", icon: CreditCard },
  { href: "/dashboard/uvedomleniya", label: "Уведомления", icon: Bell },
  { href: "/dashboard/referral", label: "Пригласить друга", icon: Gift },
  { href: "/dashboard/nastroyki", label: "Настройки", icon: Settings },
];

interface SidebarProps {
  className?: string;
}

export function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
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
          isOpen ? "translate-x-0" : "-translate-x-full",
          className
        )}
      >
        {/* Logo */}
        <div className="flex h-16 items-center gap-2 border-b px-6 lg:h-[72px]">
          <Truck className="size-6 text-sidebar-primary" />
          <span className="text-lg font-bold text-sidebar-foreground">
            Инфолог24
          </span>
        </div>

        {/* Nav */}
        <nav className="flex-1 space-y-1 overflow-y-auto p-4">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
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
    </>
  );
}
