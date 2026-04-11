"use client";

import {
  FileText,
  LayoutDashboard,
  LogOut,
  Megaphone,
  Menu,
  Settings,
  Truck,
  Users,
  Wallet,
  X,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, type ElementType } from "react";
import { toast } from "sonner";

import { authClient } from "@/lib/auth/client";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
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

interface PartnerShellUser {
  name: string | null;
  email: string;
}

const navItems: NavItem[] = [
  { href: "/partner", label: "Дашборд", icon: LayoutDashboard },
  { href: "/partner/passes", label: "Заявки", icon: FileText },
  { href: "/partner/referrals", label: "Рефералы", icon: Users },
  { href: "/partner/payouts", label: "Выплаты", icon: Wallet },
  { href: "/partner/promo", label: "Промо-материалы", icon: Megaphone },
  { href: "/partner/settings", label: "Настройки", icon: Settings },
];

function computeInitials(user: PartnerShellUser): string {
  const source = user.name?.trim();
  if (source) {
    const parts = source.split(/\s+/).filter(Boolean);
    const letters = parts
      .slice(0, 2)
      .map((word) => word[0]!.toUpperCase())
      .join("");
    if (letters.length > 0) return letters;
  }
  return (user.email[0] ?? "?").toUpperCase();
}

export function PartnerShell({
  children,
  user,
}: {
  children: React.ReactNode;
  user: PartnerShellUser;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [signingOut, setSigningOut] = useState(false);

  const initials = computeInitials(user);
  const displayName = user.name ?? user.email;

  async function handleSignOut() {
    if (signingOut) return;
    setSigningOut(true);
    try {
      await authClient.signOut();
      router.push("/partner/login");
      router.refresh();
    } catch (err) {
      toast.error("Не удалось выйти. Попробуйте ещё раз.");
      console.error(err);
    } finally {
      setSigningOut(false);
    }
  }

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Mobile toggle */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed left-4 top-4 z-50 lg:hidden"
        onClick={() => setSidebarOpen(!sidebarOpen)}
        aria-label={sidebarOpen ? "Закрыть меню" : "Открыть меню"}
      >
        {sidebarOpen ? <X className="size-5" /> : <Menu className="size-5" />}
      </Button>

      {/* Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r bg-sidebar-background transition-transform duration-200 lg:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Logo */}
        <div className="flex h-16 items-center gap-2 border-b px-6 lg:h-[72px]">
          <Truck className="size-6 text-sidebar-primary" />
          <div className="flex flex-col">
            <span className="text-lg font-bold leading-tight text-sidebar-foreground">
              Инфолог24
            </span>
            <span className="text-xs text-muted-foreground">
              Партнёрский портал
            </span>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 space-y-1 overflow-y-auto p-4">
          {navItems.map((item) => {
            const isActive =
              item.href === "/partner"
                ? pathname === "/partner"
                : pathname.startsWith(item.href);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
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
          <div className="ml-12 text-sm text-muted-foreground lg:ml-0">
            Партнёрская программа
          </div>

          {/* Right side */}
          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="flex items-center gap-2 px-2"
                >
                  <Avatar>
                    <AvatarFallback>{initials}</AvatarFallback>
                  </Avatar>
                  <span className="hidden max-w-[180px] truncate text-sm font-medium md:inline-block">
                    {displayName}
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuLabel>Партнёрский аккаунт</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <Link href="/partner/settings">
                  <DropdownMenuItem>
                    <Settings className="size-4" />
                    Настройки
                  </DropdownMenuItem>
                </Link>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  variant="destructive"
                  disabled={signingOut}
                  onSelect={(e) => {
                    e.preventDefault();
                    void handleSignOut();
                  }}
                >
                  <LogOut className="size-4" />
                  {signingOut ? "Выход..." : "Выйти"}
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
