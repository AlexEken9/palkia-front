import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { reportsApi } from "@/lib/api";
import { toast } from "sonner";

export function useReports() {
  return useQuery({
    queryKey: ["reports"],
    queryFn: async () => {
      const { data } = await reportsApi.getAll();
      return data;
    },
  });
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
