"use client";

import dynamic from "next/dynamic";
import { useState, useCallback } from "react";

// Popups are heavy (framer-motion + dialog) — lazy-load them
const ExitIntentPopup = dynamic(
  () =>
    import("@/components/popups/exit-intent-popup").then(
      (m) => m.ExitIntentPopup,
    ),
  { ssr: false },
);
const ScrollPopup = dynamic(
  () =>
    import("@/components/popups/scroll-popup").then((m) => m.ScrollPopup),
  { ssr: false },
);

export function PopupProvider({ children }: { children: React.ReactNode }) {
  const [activePopup, setActivePopup] = useState<"exit" | "scroll" | null>(null);

  const handleExitOpen = useCallback(() => {
    if (activePopup === null) setActivePopup("exit");
  }, [activePopup]);

  const handleExitClose = useCallback(() => {
    setActivePopup(null);
  }, []);

  const handleScrollOpen = useCallback(() => {
    if (activePopup === null) setActivePopup("scroll");
  }, [activePopup]);

  const handleScrollClose = useCallback(() => {
    setActivePopup(null);
  }, []);

  return (
    <>
      {children}
      <ExitIntentPopup
        onOpen={handleExitOpen}
        onClose={handleExitClose}
      />
      <ScrollPopup
        onOpen={handleScrollOpen}
        onClose={handleScrollClose}
      />
    </>
  );
}
