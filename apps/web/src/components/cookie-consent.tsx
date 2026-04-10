"use client";

import { useState, useEffect } from "react";

import { Button } from "@/components/ui/button";

type ConsentPreference = "all" | "necessary" | null;

const CONSENT_KEY = "cookie-consent";

export function CookieConsent() {
  const [preference, setPreference] = useState<ConsentPreference | "loading">(
    "loading",
  );

  useEffect(() => {
    const stored = localStorage.getItem(CONSENT_KEY);
    setPreference((stored as ConsentPreference) ?? null);
  }, []);

  const savePreference = (pref: "all" | "necessary") => {
    localStorage.setItem(CONSENT_KEY, pref);
    setPreference(pref);
  };

  // Don't render during SSR or if preference is already set
  if (preference === "loading" || preference !== null) {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 rounded-2xl border border-border/60 bg-card p-4 shadow-[0_8px_30px_-4px_rgba(28,28,30,0.12)] sm:left-auto sm:right-6 sm:max-w-md">
      <div className="flex flex-col items-start gap-4">
        <p className="flex-1 text-sm text-muted-foreground">
          Мы используем cookies для улучшения работы сайта. Вы можете принять все
          cookies или оставить только необходимые для работы сайта.
        </p>
        <div className="flex shrink-0 gap-2">
          <Button
            variant="outline"
            size="sm"
            className="rounded-xl"
            onClick={() => savePreference("necessary")}
          >
            Только необходимые
          </Button>
          <Button size="sm" className="rounded-xl bg-accent text-accent-foreground hover:bg-accent/90" onClick={() => savePreference("all")}>
            Принять все
          </Button>
        </div>
      </div>
    </div>
  );
}
