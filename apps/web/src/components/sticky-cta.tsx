"use client";

import { Phone, FileText } from "lucide-react";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { InlineLeadForm } from "@/components/forms/inline-lead-form";
import { cn } from "@/lib/utils";

interface StickyCTAProps {
  className?: string;
}

export function StickyCTA({ className }: StickyCTAProps) {
  const [visible, setVisible] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);

  useEffect(() => {
    function handleScroll() {
      // Show after scrolling past hero (~500px)
      setVisible(window.scrollY > 500);
    }
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <AnimatePresence>
        {visible && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className={cn(
              "fixed bottom-0 left-0 right-0 z-50 border-t border-border/60 bg-card/95 p-3 backdrop-blur lg:hidden",
              className
            )}
          >
            <div className="flex gap-3">
              <Button
                size="lg"
                variant="outline"
                className="flex-1 gap-2"
                asChild
              >
                <a href="tel:+74991105549">
                  <Phone className="size-4" />
                  Позвонить
                </a>
              </Button>
              <Button
                size="lg"
                className="flex-1 gap-2 bg-accent text-accent-foreground hover:bg-accent/90"
                onClick={() => setSheetOpen(true)}
              >
                <FileText className="size-4" />
                Оставить заявку
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent side="bottom" className="rounded-t-2xl px-6 pb-8 pt-6">
          <SheetHeader className="p-0">
            <SheetTitle>Оставить заявку</SheetTitle>
            <SheetDescription>
              Заполните форму, и мы перезвоним вам за 5 минут
            </SheetDescription>
          </SheetHeader>
          <div className="mt-4">
            <InlineLeadForm
              ctaText="Отправить заявку"
              showZone={false}
              onSuccess={() => {
                setTimeout(() => setSheetOpen(false), 2500);
              }}
            />
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
