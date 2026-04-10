"use client";

import { Phone } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface StickyCTAProps {
  className?: string;
}

export function StickyCTA({ className }: StickyCTAProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    function handleScroll() {
      setVisible(window.scrollY > 500);
    }
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className={cn(
            "fixed bottom-0 left-0 right-0 z-40 border-t bg-background/95 p-3 backdrop-blur lg:hidden",
            className
          )}
        >
          <Button
            asChild
            size="lg"
            className="w-full bg-accent text-accent-foreground hover:bg-accent/90"
          >
            <Link href="/zayavka" className="flex items-center gap-2">
              <Phone className="size-4" />
              Оформить пропуск
            </Link>
          </Button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
