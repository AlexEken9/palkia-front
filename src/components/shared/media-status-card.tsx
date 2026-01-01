"use client";

import {
  Clock,
  Download,
  Mic,
  Cog,
  Sparkles,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { Badge } from "@/components/ui";
import type { ProcessingStatus } from "@/types";
import { PROCESSING_STATUS_LABELS, isActiveStatus } from "@/types/api";

const STATUS_ICONS: Record<ProcessingStatus, React.ComponentType<{ className?: string }>> = {
  pending: Clock,
  downloading: Download,
  transcribing: Mic,
  processing: Cog,
  extracting: Sparkles,
  completed: CheckCircle2,
  failed: XCircle,
};

const STATUS_BADGE_VARIANTS: Record<ProcessingStatus, "outline" | "palkia" | "pearl" | "destructive" | "default"> = {
  pending: "outline",
  downloading: "outline",
  transcribing: "pearl",
  processing: "pearl",
  extracting: "palkia",
  completed: "palkia",
  failed: "destructive",
};

export function MediaStatusBadge({ status }: { status: ProcessingStatus }) {
  const StatusIcon = STATUS_ICONS[status];
  const label = PROCESSING_STATUS_LABELS[status];
  const variant = STATUS_BADGE_VARIANTS[status];

  return (
    <Badge variant={variant} className="gap-1">
      <StatusIcon
        className={`h-3 w-3 ${isActiveStatus(status) ? "animate-spin" : ""}`}
      />
      {label}
    </Badge>
  );
}
