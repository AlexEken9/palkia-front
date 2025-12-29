import { useQuery, useMutation, useQueryClient, useQueries } from "@tanstack/react-query";
import { reportsApi, knowledgeBasesApi } from "@/lib/api";
import { toast } from "sonner";
import type { IntelligenceReportSummary } from "@/types/api";

export interface ReportWithKBName extends IntelligenceReportSummary {
  kb_name: string;
}

export function useReports() {
  const kbsQuery = useQuery({
    queryKey: ["knowledge-bases"],
    queryFn: async () => {
      const { data } = await knowledgeBasesApi.getAll();
      return data;
    },
  });

  const kbs = kbsQuery.data ?? [];

  const reportQueries = useQueries({
    queries: kbs.map((kb) => ({
      queryKey: ["reports", kb.id],
      queryFn: async () => {
        const { data } = await reportsApi.getByKnowledgeBase(kb.id);
        return data.map((report): ReportWithKBName => ({
          ...report,
          kb_name: kb.name,
        }));
      },
      enabled: !!kb.id,
    })),
  });

  const allReports = reportQueries
    .filter((q) => q.isSuccess && q.data)
    .flatMap((q) => q.data as ReportWithKBName[])
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

  const isLoading = kbsQuery.isLoading || reportQueries.some((q) => q.isLoading);
  const error = kbsQuery.error || reportQueries.find((q) => q.error)?.error;

  return {
    data: allReports,
    isLoading,
    error,
  };
}

export function useReportsByKB(kbId: string, includeOldVersions = false) {
  return useQuery({
    queryKey: ["reports", kbId, includeOldVersions],
    queryFn: async () => {
      const { data } = await reportsApi.getByKnowledgeBase(kbId, includeOldVersions);
      return data;
    },
    enabled: !!kbId,
  });
}

export function useReport(reportId: string) {
  return useQuery({
    queryKey: ["report", reportId],
    queryFn: async () => {
      const { data } = await reportsApi.getById(reportId);
      return data;
    },
    enabled: !!reportId,
  });
}

export function useReportMarkdown(reportId: string) {
  return useQuery({
    queryKey: ["report-markdown", reportId],
    queryFn: async () => {
      const { data } = await reportsApi.getMarkdown(reportId);
      return data;
    },
    enabled: !!reportId,
  });
}

export function useGenerateReport() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ kbId, options }: { kbId: string; options?: { title?: string; include_all_concepts?: boolean } }) => {
      const response = await reportsApi.generateReport(kbId, options);
      return response.data;
    },
    onSuccess: (_, { kbId }) => {
      queryClient.invalidateQueries({ queryKey: ["reports"] });
      queryClient.invalidateQueries({ queryKey: ["reports", kbId] });
      toast.success("Report generation started");
    },
    onError: (error: Error) => {
      toast.error("Failed to generate report");
      console.error(error);
    },
  });
}
