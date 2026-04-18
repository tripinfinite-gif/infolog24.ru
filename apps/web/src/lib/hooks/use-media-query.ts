"use client";

import { useEffect, useState } from "react";

/**
 * Reactive CSS media-query hook.
 *
 * Returns `false` during SSR and on the first client render to keep hydration
 * stable — the actual match value is read inside a `useEffect` on the client.
 *
 * @example
 *   const isDesktop = useMediaQuery("(min-width: 768px)");
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
      return;
    }

    const mediaQueryList = window.matchMedia(query);

    // Sync initial value on the client.
    setMatches(mediaQueryList.matches);

    const listener = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };

    // addEventListener is the modern API; addListener is the Safari <14 fallback.
    if (typeof mediaQueryList.addEventListener === "function") {
      mediaQueryList.addEventListener("change", listener);
      return () => {
        mediaQueryList.removeEventListener("change", listener);
      };
    }

    mediaQueryList.addListener(listener);
    return () => {
      mediaQueryList.removeListener(listener);
    };
  }, [query]);

  return matches;
}
