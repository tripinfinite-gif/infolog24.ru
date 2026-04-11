"use client";

import Link from "next/link";
import {
  ExternalLink,
  FileArchive,
  FileText,
  Phone,
  PhoneCall,
  Plus,
  RefreshCw,
  ScrollText,
  Truck,
  Upload,
  type LucideIcon,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  type ActionCard,
  getActionIconName,
  getActionLabel,
  resolveActionHref,
} from "@/lib/chat/action-cards";

const ICON_MAP: Record<string, LucideIcon> = {
  RefreshCw,
  Plus,
  FileArchive,
  Upload,
  FileText,
  ScrollText,
  Truck,
  Phone,
  PhoneCall,
  ExternalLink,
};

interface ActionCardListProps {
  actions: ActionCard[] | undefined;
}

export function ActionCardList({ actions }: ActionCardListProps) {
  if (!actions || actions.length === 0) return null;

  return (
    <div className="mt-2 flex flex-wrap gap-2 animate-in fade-in slide-in-from-bottom-1 duration-200">
      {actions.map((action, index) => {
        const href = resolveActionHref(action);
        const label = getActionLabel(action);
        const Icon = ICON_MAP[getActionIconName(action)] ?? ExternalLink;
        const key = `${action.kind}-${index}`;

        if (href) {
          return (
            <Button
              key={key}
              asChild
              variant="outline"
              size="sm"
              className="w-full max-sm:w-full sm:w-auto"
            >
              <Link href={href}>
                <Icon className="size-4" />
                <span>{label}</span>
              </Link>
            </Button>
          );
        }

        // contact_manager — inline-handler через window event.
        const detail =
          action.kind === "contact_manager"
            ? { reason: action.reason, priority: action.priority ?? "normal" }
            : {};

        return (
          <Button
            key={key}
            type="button"
            variant="outline"
            size="sm"
            className="w-full max-sm:w-full sm:w-auto"
            onClick={() => {
              if (typeof window === "undefined") return;
              window.dispatchEvent(
                new CustomEvent("infopilot:contact-manager", { detail }),
              );
            }}
          >
            <Icon className="size-4" />
            <span>{label}</span>
          </Button>
        );
      })}
    </div>
  );
}
