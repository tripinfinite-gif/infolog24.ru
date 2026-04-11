import type { Metadata } from "next";

import { termsOfService } from "@/content/legal";

export const metadata: Metadata = {
  title: "Пользовательское соглашение — Инфолог24",
  description:
    "Пользовательское соглашение (оферта) ООО «Инфологистик 24» на оказание услуг по оформлению пропусков в Москву.",
  openGraph: {
    title: "Пользовательское соглашение — Инфолог24",
    description: "Пользовательское соглашение ООО «Инфологистик 24».",
    type: "website",
    url: "https://inlog24.ru/terms",
    siteName: "Инфолог24",
  },
  alternates: {
    canonical: "https://inlog24.ru/terms",
  },
};

function renderLegalMarkdown(content: string) {
  const lines = content.split("\n");
  const elements: React.ReactNode[] = [];
  let listItems: string[] = [];
  let key = 0;

  function flushList() {
    if (listItems.length > 0) {
      elements.push(
        <ul key={key++} className="my-4 list-disc space-y-1 pl-6">
          {listItems.map((item, i) => (
            <li key={i} dangerouslySetInnerHTML={{ __html: formatInline(item) }} />
          ))}
        </ul>
      );
      listItems = [];
    }
  }

  function formatInline(text: string): string {
    return text.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
  }

  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.startsWith("# ")) {
      flushList();
    } else if (trimmed.startsWith("### ")) {
      flushList();
      elements.push(
        <h3 key={key++} className="mt-6 mb-3 text-lg font-semibold text-foreground">
          {trimmed.slice(4)}
        </h3>
      );
    } else if (trimmed.startsWith("## ")) {
      flushList();
      elements.push(
        <h2 key={key++} className="mt-10 mb-4 text-xl font-bold text-foreground">
          {trimmed.slice(3)}
        </h2>
      );
    } else if (trimmed.startsWith("- ")) {
      listItems.push(trimmed.slice(2));
    } else if (trimmed === "") {
      flushList();
    } else {
      flushList();
      elements.push(
        <p
          key={key++}
          className="my-3 leading-relaxed"
          dangerouslySetInnerHTML={{ __html: formatInline(trimmed) }}
        />
      );
    }
  }
  flushList();
  return elements;
}

export default function TermsPage() {
  return (
    <section className="px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
      <div className="prose prose-slate mx-auto max-w-3xl text-muted-foreground">
        <h1 className="font-heading text-3xl font-bold text-foreground sm:text-4xl">
          Пользовательское соглашение
        </h1>
        {renderLegalMarkdown(termsOfService)}
      </div>
    </section>
  );
}
