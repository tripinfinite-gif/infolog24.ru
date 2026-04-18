"use client";

import { useEffect } from "react";

/**
 * Регистрирует service worker `/sw.js` в продакшн-окружении.
 * В dev-режиме SW намеренно не регистрируется — чтобы не кешировать hot-reload ресурсы.
 */
export function ServiceWorkerRegister() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!("serviceWorker" in navigator)) return;
    if (process.env.NODE_ENV !== "production") return;

    const onLoad = () => {
      navigator.serviceWorker.register("/sw.js").catch((err) => {
        console.warn("SW registration failed:", err);
      });
    };

    if (document.readyState === "complete") onLoad();
    else window.addEventListener("load", onLoad, { once: true });
  }, []);

  return null;
}
