import { apiClient } from "./client";
import type {
  KnowledgeBase,
  KnowledgeBaseCreate,
  Source,
  SourceCreate,
  Video,
  ProcessingStatusResponse,
  ExtractedConcept,
  ExtractedEntity,
  ConsolidatedIdea,
  TemporalPattern,
  PipelineStatus,
  ExtractionStatus,
  ConsolidationStatus,
  PaginatedResponse,
} from "@/types/api";

export const knowledgeBasesApi = {
  getAll: () => 
    apiClient.get<KnowledgeBase[]>("/knowledge-bases"),
  
  getById: (id: string) => 
    apiClient.get<KnowledgeBase>(`/knowledge-bases/${id}`),
  
  create: (data: KnowledgeBaseCreate) => 
    apiClient.post<KnowledgeBase>("/knowledge-bases", data),
  
  delete: (id: string) => 
    apiClient.delete(`/knowledge-bases/${id}`),
  
  getSources: (kbId: string) =>
    apiClient.get<Source[]>(`/knowledge-bases/${kbId}/sources`),
  
  addSource: (kbId: string, data: SourceCreate) =>
    apiClient.post<Source>(`/knowledge-bases/${kbId}/sources`, data),
  
  deleteSource: (sourceId: string) =>
    apiClient.delete(`/sources/${sourceId}`),
  
  getVideos: (kbId: string) =>
    apiClient.get<PaginatedResponse<Video>>(`/knowledge-bases/${kbId}/videos`),
  
  getProcessingStatus: (kbId: string) =>
    apiClient.get<ProcessingStatusResponse>(`/knowledge-bases/${kbId}/status`),
  
  processVideos: (kbId: string) =>
    apiClient.post(`/knowledge-bases/${kbId}/process`),
  
  startExtraction: (kbId: string, options?: { batch_size?: number; reprocess?: boolean }) =>
    apiClient.post<ExtractionStatus>(`/knowledge-bases/${kbId}/extract`, options || {}),
  
  getExtractionStatus: (kbId: string) =>
    apiClient.get<ExtractionStatus>(`/knowledge-bases/${kbId}/extraction-status`),
  
  getConcepts: (kbId: string, page = 1, limit = 20, type?: string, includeOrigin = true) =>
    apiClient.get<PaginatedResponse<ExtractedConcept>>(`/knowledge-bases/${kbId}/concepts`, { 
      params: { 
        limit, 
        skip: (page - 1) * limit, 
        concept_type: type === "all" ? undefined : type, 
        include_origin: includeOrigin 
      } 
    }),
  
  getEntities: (kbId: string, page = 1, limit = 20, type?: string, includeOrigin = true) =>
    apiClient.get<PaginatedResponse<ExtractedEntity>>(`/knowledge-bases/${kbId}/entities`, { 
      params: { 
        limit, 
        skip: (page - 1) * limit, 
        entity_type: type === "all" ? undefined : type, 
        include_origin: includeOrigin 
      } 
    }),
  
  startConsolidation: (kbId: string, options?: { similarity_threshold?: number }) =>
    apiClient.post<ConsolidationStatus>(`/knowledge-bases/${kbId}/consolidate`, options || {}),
  
  getConsolidationStatus: (kbId: string) =>
    apiClient.get<ConsolidationStatus>(`/knowledge-bases/${kbId}/consolidation-status`),
  
  getConsolidatedIdeas: (kbId: string, limit = 50) =>
    apiClient.get<ConsolidatedIdea[]>(`/knowledge-bases/${kbId}/consolidated-ideas`, { params: { limit } }),
  
  getTemporalPatterns: (kbId: string) =>
    apiClient.get<TemporalPattern[]>(`/knowledge-bases/${kbId}/patterns`),
  
  runPipeline: (kbId: string, options?: { reprocess?: boolean }) =>
    apiClient.post<PipelineStatus>(`/knowledge-bases/${kbId}/run-pipeline`, options || {}),
  
  getPipelineStatus: (kbId: string) =>
    apiClient.get<PipelineStatus>(`/knowledge-bases/${kbId}/pipeline-status`),
};
