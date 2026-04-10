"use client";

import { useState, useEffect } from "react";

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
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-gray-200 bg-white p-4 shadow-lg">
      <div className="mx-auto flex max-w-5xl flex-col items-center gap-4 sm:flex-row">
        <p className="flex-1 text-sm text-gray-600">
          Мы используем cookies для улучшения работы сайта. Вы можете принять все
          cookies или оставить только необходимые для работы сайта.
        </p>
        <div className="flex shrink-0 gap-2">
          <button
            onClick={() => savePreference("necessary")}
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
          >
            Только необходимые
          </button>
          <button
            onClick={() => savePreference("all")}
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
          >
            Принять все
          </button>
        </div>
      </div>
    </div>
  );
}
