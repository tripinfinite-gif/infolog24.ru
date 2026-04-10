import { ArrowRight, Home, Search } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";

const popularLinks = [
  { href: "/services/propusk-mkad", label: "Пропуск на МКАД" },
  { href: "/services/propusk-ttk", label: "Пропуск на ТТК" },
  { href: "/pricing", label: "Тарифы" },
  { href: "/faq", label: "Частые вопросы" },
  { href: "/contacts", label: "Контакты" },
];

export default function NotFound() {
  return (
    <section className="flex min-h-[60vh] flex-col items-center justify-center px-4 py-16 sm:px-6 lg:px-8">
      <div className="text-center">
        <p className="text-8xl font-bold text-primary">404</p>
        <h1 className="mt-4 font-heading text-2xl font-bold text-foreground sm:text-3xl">
          Страница не найдена
        </h1>
        <p className="mt-2 text-muted-foreground">
          Возможно, страница была перемещена или удалена. Попробуйте начать с
          главной или выберите нужный раздел.
        </p>

        <div className="mt-8">
          <h2 className="text-sm font-semibold text-foreground">
            Популярные разделы
          </h2>
          <ul className="mt-4 space-y-2">
            {popularLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
                >
                  <ArrowRight className="size-3" />
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <Button asChild>
            <Link href="/">
              <Home className="mr-2 size-4" />
              На главную
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/contacts">
              Связаться с нами
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
