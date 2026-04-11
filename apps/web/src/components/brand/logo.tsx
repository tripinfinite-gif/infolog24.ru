import Link from "next/link";

import { cn } from "@/lib/utils";

interface LogoMarkProps {
  className?: string;
  size?: number;
}

/**
 * Чисто графическая часть логотипа: оранжевый знак со скруглением + белая «и».
 * Используется отдельно (например, в мобильной шапке) или внутри `<Logo />`.
 */
export function LogoMark({ className, size = 36 }: LogoMarkProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("shrink-0", className)}
      role="img"
      aria-label="Инфолог24"
    >
      <rect width="40" height="40" rx="10" fill="currentColor" />
      <text
        x="20"
        y="29"
        textAnchor="middle"
        fill="white"
        fontSize="24"
        fontWeight="900"
        fontFamily="system-ui, -apple-system, sans-serif"
      >
        и
      </text>
      <circle cx="32" cy="11" r="3.5" fill="white" />
    </svg>
  );
}

interface LogoProps {
  className?: string;
  iconClassName?: string;
  textClassName?: string;
  size?: number;
  withText?: boolean;
  asLink?: boolean;
  href?: string;
}

/**
 * Полный логотип бренда Инфолог24: знак + текстовая часть.
 *
 * `name`: «Инфолог24» (коммерческий бренд) — это НЕ юридическое название.
 * Юридическое название «ООО «Инфологистик 24»» используется только в правовых
 * документах (политика, оферта, footer-bottom-bar, json-ld LegalName).
 */
export function Logo({
  className,
  iconClassName,
  textClassName,
  size = 36,
  withText = true,
  asLink = true,
  href = "/",
}: LogoProps) {
  const content = (
    <>
      <LogoMark
        size={size}
        className={cn("text-accent", iconClassName)}
      />
      {withText && (
        <span
          className={cn(
            "font-[family-name:var(--font-manrope)] text-lg font-extrabold tracking-tight text-foreground lg:text-xl",
            textClassName
          )}
        >
          Инфолог<span className="text-accent">24</span>
        </span>
      )}
    </>
  );

  if (!asLink) {
    return (
      <span className={cn("inline-flex items-center gap-2.5", className)}>
        {content}
      </span>
    );
  }

  return (
    <Link
      href={href}
      className={cn(
        "inline-flex items-center gap-2.5 transition-opacity hover:opacity-90",
        className
      )}
    >
      {content}
    </Link>
  );
}
