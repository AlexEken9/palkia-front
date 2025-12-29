import { apiClient } from "./client";
import type {
  IntelligenceReport,
  IntelligenceReportSummary,
  ReportMarkdown,
} from "@/types/api";

export const reportsApi = {
  getByKnowledgeBase: (kbId: string, includeOldVersions = false) =>
    apiClient.get<IntelligenceReportSummary[]>(`/knowledge-bases/${kbId}/reports`, {
      params: { include_old_versions: includeOldVersions },
    }),
  
  generateReport: (kbId: string, options?: { title?: string; include_all_concepts?: boolean }) =>
    apiClient.post<IntelligenceReportSummary>(`/knowledge-bases/${kbId}/generate-report`, options || {}),
  
  getById: (reportId: string) =>
    apiClient.get<IntelligenceReport>(`/reports/${reportId}`),
  
  getMarkdown: (reportId: string) =>
    apiClient.get<ReportMarkdown>(`/reports/${reportId}/markdown`),
  
  downloadMarkdown: (reportId: string) =>
    apiClient.get<string>(`/reports/${reportId}/download`, {
      responseType: "blob",
    }),
};
