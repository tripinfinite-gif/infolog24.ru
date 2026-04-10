"use client";

import { useEffect, useRef, useCallback } from "react";
import Script from "next/script";

declare global {
  interface Window {
    turnstile: {
      render: (
        element: HTMLElement,
        options: Record<string, unknown>,
      ) => string;
      reset: (widgetId: string) => void;
      remove: (widgetId: string) => void;
    };
    onTurnstileLoad: () => void;
  }
}

interface TurnstileProps {
  siteKey: string;
  onVerify: (token: string) => void;
  onExpire?: () => void;
  theme?: "light" | "dark" | "auto";
}

export function Turnstile({
  siteKey,
  onVerify,
  onExpire,
  theme = "auto",
}: TurnstileProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | null>(null);

  const renderWidget = useCallback(() => {
    if (!containerRef.current || !window.turnstile) return;

    // Remove existing widget if any
    if (widgetIdRef.current) {
      window.turnstile.remove(widgetIdRef.current);
    }

    widgetIdRef.current = window.turnstile.render(containerRef.current, {
      sitekey: siteKey,
      theme,
      callback: onVerify,
      "expired-callback": onExpire,
    });
  }, [siteKey, theme, onVerify, onExpire]);

  useEffect(() => {
    // If turnstile is already loaded, render immediately
    if (window.turnstile) {
      renderWidget();
    } else {
      // Set up callback for when script loads
      window.onTurnstileLoad = renderWidget;
    }

    return () => {
      if (widgetIdRef.current && window.turnstile) {
        window.turnstile.remove(widgetIdRef.current);
        widgetIdRef.current = null;
      }
    };
  }, [renderWidget]);

  return (
    <>
      <Script
        src="https://challenges.cloudflare.com/turnstile/v0/api.js?onload=onTurnstileLoad"
        strategy="lazyOnload"
      />
      <div ref={containerRef} />
    </>
  );
}
