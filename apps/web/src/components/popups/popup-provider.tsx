"use client";

import { useState, useCallback } from "react";

import { ExitIntentPopup } from "@/components/popups/exit-intent-popup";
import { ScrollPopup } from "@/components/popups/scroll-popup";

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
