"use client";

import {
  Clock,
  Download,
  Mic,
  Cog,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Check,
} from "lucide-react";
import type { ProcessingStatus, MediaProgressInfo } from "@/types";

const STATUS_ICONS: Record<ProcessingStatus, React.ComponentType<{ className?: string }>> = {
  pending: Clock,
  downloading: Download,
  transcribing: Mic,
  processing: Cog,
  extracting: Sparkles,
  completed: CheckCircle2,
  failed: AlertTriangle,
};

const STATUS_LABELS: Record<ProcessingStatus, string> = {
  pending: "Queued",
  downloading: "Downloading",
  transcribing: "Transcribing",
  processing: "Processing",
  extracting: "Extracting",
  completed: "Completed",
  failed: "Failed",
};

const PIPELINE_STAGES: ProcessingStatus[] = ["downloading", "transcribing", "processing", "extracting"];

interface StageIndicatorProps {
  stage: ProcessingStatus;
  currentStage: ProcessingStatus;
  stagePercent: number;
}

function StageIndicator({ stage, currentStage, stagePercent }: StageIndicatorProps) {
  const Icon = STATUS_ICONS[stage];
  const currentIndex = PIPELINE_STAGES.indexOf(currentStage);
  const stageIndex = PIPELINE_STAGES.indexOf(stage);
  
  const isCompleted = stageIndex < currentIndex;
  const isCurrent = stage === currentStage;
  const isPending = stageIndex > currentIndex;

  const getColors = () => {
    if (isCompleted) {
      return {
        ring: "ring-emerald-500",
        bg: "bg-emerald-500",
        icon: "text-white",
      };
    }
    if (isCurrent) {
      return {
        ring: "ring-palkia-500",
        bg: "bg-palkia-100 dark:bg-palkia-950",
        icon: "text-palkia-600 dark:text-palkia-400",
      };
    }
return {
        ring: "ring-muted-foreground/30",
        bg: "bg-muted",
        icon: "text-muted-foreground",
      };
  };

  const colors = getColors();
  const displayPercent = Math.round(stagePercent);

  return (
    <div className="flex flex-col items-center relative">
      <div
        className={`
          relative z-10 w-9 h-9 rounded-full flex items-center justify-center
          ring-2 ${colors.ring} ${colors.bg}
          transition-all duration-300
          ${isCurrent ? "ring-offset-2 ring-offset-background" : ""}
        `}
      >
        {isCompleted ? (
          <Check className="h-4 w-4 text-white" strokeWidth={3} />
        ) : (
          <Icon className={`h-4 w-4 ${colors.icon} ${isCurrent ? "animate-pulse" : ""}`} />
        )}
        
        {isCurrent && (
          <svg 
            className="absolute -inset-0.5 w-10 h-10" 
            viewBox="0 0 40 40"
            style={{ transform: "rotate(-90deg)" }}
          >
            <circle
              cx="20"
              cy="20"
              r="18"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              className="text-palkia-200 dark:text-palkia-900"
            />
            <circle
              cx="20"
              cy="20"
              r="18"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              className="text-palkia-500"
              strokeLinecap="round"
              strokeDasharray={`${(displayPercent / 100) * 113} 113`}
            />
          </svg>
        )}
      </div>
      
      <div className="flex flex-col items-center mt-1.5">
        <span className={`
          text-[10px] font-semibold whitespace-nowrap leading-tight
          ${isCompleted ? "text-emerald-600 dark:text-emerald-400" : ""}
          ${isCurrent ? "text-palkia-600 dark:text-palkia-400" : ""}
          ${isPending ? "text-muted-foreground" : ""}
        `}>
          {STATUS_LABELS[stage]}
        </span>
        {isCurrent && (
          <span className="text-[11px] font-bold tabular-nums text-palkia-500">
            {displayPercent}%
          </span>
        )}
      </div>
    </div>
  );
}

interface MediaProgressBarProps {
  status: ProcessingStatus;
  progress?: MediaProgressInfo | null;
}

export function MediaProgressBar({ status, progress }: MediaProgressBarProps) {
  const stagePercent = progress?.percent ?? 0;

  if (status === "failed") {
    return (
      <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900">
        <AlertTriangle className="h-4 w-4 text-red-500" />
        <span className="text-xs font-medium text-red-600 dark:text-red-400">
          Processing failed
        </span>
      </div>
    );
  }

  if (status === "completed") {
    return (
      <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900">
        <CheckCircle2 className="h-4 w-4 text-emerald-500" />
        <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
          Completed
        </span>
      </div>
    );
  }

  if (status === "pending") {
    return (
      <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-muted border border-border">
        <Clock className="h-4 w-4 text-muted-foreground animate-pulse" />
        <span className="text-xs font-medium text-muted-foreground">Queued</span>
      </div>
    );
  }

  const currentStageIndex = PIPELINE_STAGES.indexOf(status);

  return (
    <div className="px-3 py-3 rounded-lg bg-muted/50 border border-border">
      <div className="flex items-start justify-between gap-1">
        {PIPELINE_STAGES.map((stage, index) => (
          <div key={stage} className="flex items-center flex-1 last:flex-none">
            <StageIndicator
              stage={stage}
              currentStage={status}
              stagePercent={stagePercent}
            />
            
            {index < PIPELINE_STAGES.length - 1 && (
              <div className="flex-1 h-0.5 mx-2 self-start mt-[18px]">
                <div className={`
                  h-full rounded-full transition-all duration-500
                  ${index < currentStageIndex 
                    ? "bg-emerald-500" 
                    : index === currentStageIndex 
                      ? "bg-gradient-to-r from-palkia-500 to-muted-foreground/30"
                      : "bg-muted"
                  }
                `} />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
