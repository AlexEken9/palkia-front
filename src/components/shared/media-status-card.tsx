"use client";

import { useState, useEffect } from "react";
import {
  Clock,
  Download,
  Mic,
  Cog,
  Sparkles,
  CheckCircle2,
  XCircle,
  RefreshCw,
  ExternalLink,
  Video,
  Loader2,
} from "lucide-react";
import { Button, Card, CardContent, Badge, Progress } from "@/components/ui";
import { useMediaIngestionStatus, useRetryMedia } from "@/lib/hooks";
import { useMediaPollingStore } from "@/lib/stores";
import { formatDuration } from "@/lib/utils";
import type { MediaContent, ProcessingStatus } from "@/types";
import {
  PROCESSING_STATUS_LABELS,
  PROCESSING_STATUS_PROGRESS,
  isTerminalStatus,
  isActiveStatus,
} from "@/types/api";

interface MediaStatusCardProps {
  media: MediaContent;
  kbId: string;
  compact?: boolean;
}

const STATUS_ICONS: Record<ProcessingStatus, React.ComponentType<{ className?: string }>> = {
  pending: Clock,
  downloading: Download,
  transcribing: Mic,
  processing: Cog,
  extracting: Sparkles,
  completed: CheckCircle2,
  failed: XCircle,
};

const STATUS_COLORS: Record<ProcessingStatus, string> = {
  pending: "text-silver-500",
  downloading: "text-blue-500",
  transcribing: "text-amber-500",
  processing: "text-pearl-500",
  extracting: "text-palkia-500",
  completed: "text-green-500",
  failed: "text-red-500",
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

function getEstimatedProgress(status: ProcessingStatus, apiProgress?: number): number {
  if (apiProgress !== undefined && apiProgress > 0) {
    return apiProgress;
  }
  const range = PROCESSING_STATUS_PROGRESS[status];
  return range.min;
}

export function MediaStatusCard({ media, kbId, compact = false }: MediaStatusCardProps) {
  const [shouldPoll, setShouldPoll] = useState(!isTerminalStatus(media.status));
  const { startPolling, stopPolling, updateStatus } = useMediaPollingStore();
  
  const { data: ingestionStatus, isLoading: statusLoading } = useMediaIngestionStatus(
    kbId,
    media.id,
    shouldPoll
  );
  
  const retryMutation = useRetryMedia();
  
  const currentStatus = ingestionStatus?.status ?? media.status;
  const progressPercent = getEstimatedProgress(currentStatus, ingestionStatus?.progress_percent);
  const statusLabel = PROCESSING_STATUS_LABELS[currentStatus];
  const StatusIcon = STATUS_ICONS[currentStatus];
  const statusColor = STATUS_COLORS[currentStatus];
  const badgeVariant = STATUS_BADGE_VARIANTS[currentStatus];
  
  useEffect(() => {
    if (isActiveStatus(currentStatus)) {
      startPolling(kbId, media.id, currentStatus);
    }
    
    if (isTerminalStatus(currentStatus)) {
      setShouldPoll(false);
      stopPolling(media.id);
    } else {
      updateStatus(media.id, currentStatus);
    }
  }, [currentStatus, kbId, media.id, startPolling, stopPolling, updateStatus]);

  const handleRetry = async () => {
    await retryMutation.mutateAsync({ kbId, mediaId: media.id });
    setShouldPoll(true);
  };

  if (compact) {
    return (
      <div className="flex items-center gap-2">
        <Badge variant={badgeVariant} className="gap-1">
          <StatusIcon 
            className={`h-3 w-3 ${isActiveStatus(currentStatus) ? "animate-spin" : ""}`} 
          />
          {statusLabel}
        </Badge>
        {currentStatus === "failed" && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleRetry}
            disabled={retryMutation.isPending}
            className="h-6 px-2 text-xs"
          >
            {retryMutation.isPending ? (
              <Loader2 className="h-3 w-3 animate-spin" />
            ) : (
              <RefreshCw className="h-3 w-3" />
            )}
          </Button>
        )}
      </div>
    );
  }

  return (
    <Card className="glass-card overflow-hidden">
      <CardContent className="p-4">
        <div className="flex gap-4">
          {media.thumbnail_url ? (
            <div className="relative shrink-0 group">
              <img
                src={media.thumbnail_url}
                alt={media.title}
                className="h-20 w-36 rounded-lg object-cover border border-silver-200 dark:border-silver-700"
              />
              {isActiveStatus(currentStatus) && (
                <div className="absolute inset-0 bg-black/40 rounded-lg flex items-center justify-center">
                  <Loader2 className="h-6 w-6 text-white animate-spin" />
                </div>
              )}
            </div>
          ) : (
            <div className="h-20 w-36 shrink-0 rounded-lg bg-silver-100 dark:bg-silver-800 flex items-center justify-center border border-silver-200 dark:border-silver-700">
              <Video className="h-8 w-8 text-silver-400" />
            </div>
          )}

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 mb-2">
              <h4 className="font-medium text-silver-900 dark:text-silver-100 truncate" title={media.title}>
                {media.title}
              </h4>
              {media.platform === "youtube" && (
                <a
                  href={`https://youtube.com/watch?v=${media.remote_id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="shrink-0 text-silver-400 hover:text-palkia-500"
                >
                  <ExternalLink className="h-4 w-4" />
                </a>
              )}
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <StatusIcon className={`h-4 w-4 ${statusColor} ${isActiveStatus(currentStatus) ? "animate-spin" : ""}`} />
                <span className={`text-sm font-medium ${statusColor}`}>
                  {statusLabel}
                </span>
                {media.duration_seconds && (
                  <span className="text-xs text-silver-400 flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {formatDuration(media.duration_seconds)}
                  </span>
                )}
              </div>

              {!isTerminalStatus(currentStatus) && (
                <div className="space-y-1">
                  <Progress value={progressPercent} className="h-1.5" />
                  <div className="flex justify-between text-xs text-silver-500">
                    <span>{ingestionStatus?.current_stage || currentStatus}</span>
                    <span>{Math.round(progressPercent)}%</span>
                  </div>
                </div>
              )}

              {ingestionStatus?.message && isActiveStatus(currentStatus) && (
                <p className="text-xs text-silver-500 truncate" title={ingestionStatus.message}>
                  {ingestionStatus.message}
                </p>
              )}

              {currentStatus === "failed" && (
                <div className="flex items-center gap-2 mt-2">
                  {ingestionStatus?.error_message && (
                    <span className="text-xs text-red-500 truncate flex-1" title={ingestionStatus.error_message}>
                      {ingestionStatus.error_message}
                    </span>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleRetry}
                    disabled={retryMutation.isPending}
                    className="shrink-0 text-xs h-7 px-2 gap-1 border-red-200 text-red-600 hover:bg-red-50 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-900/20"
                  >
                    {retryMutation.isPending ? (
                      <Loader2 className="h-3 w-3 animate-spin" />
                    ) : (
                      <RefreshCw className="h-3 w-3" />
                    )}
                    Retry
                  </Button>
                </div>
              )}

              {currentStatus === "completed" && (
                <Badge variant="palkia" className="text-xs">
                  <CheckCircle2 className="h-3 w-3 mr-1" />
                  Processing Complete
                </Badge>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

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
