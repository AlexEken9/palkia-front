"use client";

import * as React from "react";
import { 
  PipelineStatus, 
  PipelineStageKey, 
  PipelineStageStatus 
} from "@/types/api";
import { cn } from "@/lib/utils";
import { 
  CheckCircle2, 
  Circle, 
  Loader2, 
  AlertCircle, 
  Film, 
  Brain, 
  Database, 
  FileText,
  ChevronDown,
  ChevronUp
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { formatDistanceToNow } from "date-fns";

interface PipelineProgressProps {
  status: PipelineStatus;
  className?: string;
}

const STAGES: { key: PipelineStageKey; label: string; icon: React.ElementType }[] = [
  { key: "video_processing", label: "Video Processing", icon: Film },
  { key: "extraction", label: "Extraction", icon: Brain },
  { key: "consolidation", label: "Consolidation", icon: Database },
  { key: "report", label: "Report Generation", icon: FileText },
];

export function PipelineProgress({ status, className }: PipelineProgressProps) {
  const [expandedStage, setExpandedStage] = React.useState<PipelineStageKey | null>(null);

  const getStageState = (stageKey: PipelineStageKey) => {
    const stageInfo = status.stages?.[stageKey];
    const stageStatus = stageInfo?.status || "pending";
    const isCurrent = status.current_stage === stageKey;
    
    const stageIndex = STAGES.findIndex(s => s.key === stageKey);
    const currentIndex = STAGES.findIndex(s => s.key === status.current_stage);
    
    let derivedStatus: PipelineStageStatus = stageStatus;
    
    if (stageStatus === "pending" && stageIndex < currentIndex) {
      derivedStatus = "completed";
    }

    return {
      status: derivedStatus,
      isCurrent,
      info: stageInfo
    };
  };

  const toggleExpand = (key: PipelineStageKey) => {
    setExpandedStage(expandedStage === key ? null : key);
  };

  return (
    <div className={cn("w-full space-y-6", className)}>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-medium text-silver-500 dark:text-silver-400 uppercase tracking-wider">
            Pipeline Progress
          </h3>
          <div className="flex items-center gap-2 mt-1">
            <span className={cn(
              "text-lg font-bold",
              status.status === "processing" ? "text-palkia-500" :
              status.status === "completed" ? "text-green-600" :
              status.status === "failed" ? "text-red-600" : "text-silver-700"
            )}>
              {status.status === "processing" ? "Processing in Progress" :
               status.status === "completed" ? "Pipeline Completed" :
               status.status === "failed" ? "Processing Failed" : "Pending"}
            </span>
            {status.status === "processing" && (
              <Loader2 className="h-4 w-4 animate-spin text-palkia-500" />
            )}
          </div>
        </div>
        
        {status.started_at && (
          <div className="text-right hidden sm:block">
            <div className="text-xs text-silver-400">Started</div>
            <div className="text-sm font-medium text-silver-700 dark:text-silver-300">
              {formatDistanceToNow(new Date(status.started_at), { addSuffix: true })}
            </div>
          </div>
        )}
      </div>

      <div className="relative">
        <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-silver-200 dark:bg-silver-800 -translate-y-1/2 z-0" />
        
        <div className="flex flex-col md:flex-row justify-between gap-4 relative z-10">
          {STAGES.map((stage, index) => {
            const { status: stageStatus, isCurrent, info } = getStageState(stage.key);
            const isExpanded = expandedStage === stage.key;

            const isActive = isCurrent || stageStatus === "in_progress";
            const isCompleted = stageStatus === "completed";
            const isFailed = stageStatus === "failed";
            
            return (
              <div 
                key={stage.key}
                className={cn(
                  "flex-1 group cursor-pointer transition-all duration-300",
                  "flex md:block items-center gap-4 md:gap-0",
                  "md:bg-white md:dark:bg-silver-950 md:border md:rounded-lg md:p-4",
                  isActive ? "md:border-palkia-500 md:ring-1 md:ring-palkia-500/20" : 
                  isCompleted ? "md:border-green-500/30" : 
                  isFailed ? "md:border-red-500/50" :
                  "md:border-silver-200 md:dark:border-silver-800",
                  "hover:md:border-palkia-400 hover:md:shadow-md"
                )}
                onClick={() => toggleExpand(stage.key)}
              >
                <div className={cn(
                  "md:hidden absolute left-6 top-0 bottom-0 w-0.5 -z-10",
                  "bg-silver-200 dark:bg-silver-800",
                  index === 0 ? "top-8" : "",
                  index === STAGES.length - 1 ? "bottom-auto h-8" : ""
                )} />

                <div className="flex items-center gap-3 md:justify-center md:mb-3">
                  <div className={cn(
                    "flex items-center justify-center w-8 h-8 md:w-10 md:h-10 rounded-full border-2 transition-colors duration-300 bg-white dark:bg-silver-950",
                    isActive ? "border-palkia-500 text-palkia-500" :
                    isCompleted ? "border-green-500 text-green-500 bg-green-50 dark:bg-green-900/10" :
                    isFailed ? "border-red-500 text-red-500" :
                    "border-silver-300 text-silver-300 dark:border-silver-700"
                  )}>
                    <stage.icon className="w-4 h-4 md:w-5 md:h-5" />
                  </div>
                  
                  <div className="flex-1 md:text-center">
                    <div className={cn(
                      "text-sm font-semibold transition-colors",
                      isActive ? "text-palkia-600 dark:text-palkia-400" :
                      isCompleted ? "text-silver-900 dark:text-silver-100" :
                      "text-silver-500"
                    )}>
                      {info?.display_name || stage.label}
                    </div>
                    <div className="text-xs text-silver-400 md:hidden">
                      {isActive ? "Processing..." : 
                       isCompleted ? "Completed" : 
                       isFailed ? "Failed" : "Pending"}
                    </div>
                  </div>

                  <div className="md:hidden text-silver-400">
                    {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </div>
                </div>

                <div className="hidden md:flex justify-center mb-2">
                   {isActive ? (
                     <div className="flex items-center gap-1.5 text-xs font-medium text-palkia-500 animate-pulse">
                       <Loader2 className="w-3 h-3 animate-spin" />
                       In Progress
                     </div>
                   ) : isCompleted ? (
                     <div className="flex items-center gap-1.5 text-xs font-medium text-green-600">
                       <CheckCircle2 className="w-3 h-3" />
                       Done
                     </div>
                   ) : isFailed ? (
                     <div className="flex items-center gap-1.5 text-xs font-medium text-red-600">
                       <AlertCircle className="w-3 h-3" />
                       Failed
                     </div>
                   ) : (
                     <div className="text-xs text-silver-400">Pending</div>
                   )}
                </div>

                {(info?.items_total && info.items_total > 0) || (isActive && info?.progress_percent) ? (
                  <div className="mt-2 md:mt-0 px-2 pb-2">
                    <div className="flex justify-between text-[10px] text-silver-500 mb-1 font-mono">
                      <span>{Math.round(info?.progress_percent || 0)}%</span>
                      {info?.items_total ? (
                        <span>{info.items_processed}/{info.items_total}</span>
                      ) : null}
                    </div>
                    <Progress 
                      value={info?.progress_percent || 0} 
                      className="h-1.5 bg-silver-100 dark:bg-silver-800" 
                      indicatorClassName={cn(
                        isActive ? "bg-palkia-500 animate-pulse" :
                        isCompleted ? "bg-green-500" :
                        isFailed ? "bg-red-500" : "bg-silver-300"
                      )}
                    />
                  </div>
                ) : null}

                <div className={cn(
                  "overflow-hidden transition-all duration-300 ease-in-out px-2",
                  isExpanded ? "max-h-40 opacity-100 mt-2 pb-2 border-t border-silver-100 dark:border-silver-800 pt-2" : "max-h-0 opacity-0"
                )}>
                  <div className="text-xs text-silver-500 space-y-1.5">
                    {info?.started_at && (
                      <div className="flex justify-between">
                        <span>Started:</span>
                        <span className="font-mono text-silver-700 dark:text-silver-300">
                          {new Date(info.started_at).toLocaleTimeString([], {hour: "2-digit", minute:"2-digit"})}
                        </span>
                      </div>
                    )}
                    {info?.completed_at && (
                      <div className="flex justify-between">
                        <span>Ended:</span>
                        <span className="font-mono text-silver-700 dark:text-silver-300">
                           {new Date(info.completed_at).toLocaleTimeString([], {hour: "2-digit", minute:"2-digit"})}
                        </span>
                      </div>
                    )}
                    {info?.error && (
                       <div className="text-red-500 bg-red-50 dark:bg-red-900/10 p-2 rounded text-[10px] mt-2 border border-red-100 dark:border-red-900/30">
                         {info.error}
                       </div>
                    )}
                    {!info?.started_at && !info?.error && (
                      <div className="text-center italic text-silver-300">No details available</div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
