import { apiClient } from "./client";
import type {
  KnowledgeBase,
  KnowledgeBaseCreate,
  Source,
  SourceCreate,
  SourceIngestionStatus,
  MediaContent,
  MediaIngestionStatus,
  ProcessingStatusResponse,
  ExtractedConcept,
  ExtractedEntity,
  ExtractionStatus,
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
  
  getSourceIngestionStatus: (sourceId: string) =>
    apiClient.get<SourceIngestionStatus>(`/sources/${sourceId}/ingestion-status`),
  
  getMedia: (kbId: string, page = 1, limit = 20) =>
    apiClient.get<PaginatedResponse<MediaContent>>(`/knowledge-bases/${kbId}/media`, {
      params: { limit, skip: (page - 1) * limit }
    }),
  
  getProcessingStatus: (kbId: string) =>
    apiClient.get<ProcessingStatusResponse>(`/knowledge-bases/${kbId}/status`),
  
  startExtraction: (kbId: string, options?: { batch_size?: number; reprocess?: boolean }) =>
    apiClient.post<ExtractionStatus>(`/knowledge-bases/${kbId}/extract`, options || {}),
  
  getExtractionStatus: (kbId: string) =>
    apiClient.get<ExtractionStatus>(`/knowledge-bases/${kbId}/extraction-status`),
  
  getConcepts: (kbId: string, page = 1, limit = 20, type?: string, mediaId?: string, includeOrigin = true) =>
    apiClient.get<PaginatedResponse<ExtractedConcept>>(`/knowledge-bases/${kbId}/concepts`, { 
      params: { 
        limit, 
        skip: (page - 1) * limit, 
        concept_type: type === "all" ? undefined : type, 
        media_id: mediaId === "all" ? undefined : mediaId,
        include_origin: includeOrigin 
      } 
    }),
  
  getEntities: (kbId: string, page = 1, limit = 20, type?: string, mediaId?: string, includeOrigin = true) =>
    apiClient.get<PaginatedResponse<ExtractedEntity>>(`/knowledge-bases/${kbId}/entities`, { 
      params: { 
        limit, 
        skip: (page - 1) * limit, 
        entity_type: type === "all" ? undefined : type, 
        media_id: mediaId === "all" ? undefined : mediaId,
        include_origin: includeOrigin 
      } 
    }),

  getMediaIngestionStatus: (kbId: string, mediaId: string) =>
    apiClient.get<MediaIngestionStatus>(`/knowledge-bases/${kbId}/media/${mediaId}/status`),

  retryMedia: (kbId: string, mediaId: string) =>
    apiClient.post<MediaContent>(`/knowledge-bases/${kbId}/media/${mediaId}/retry`),
};
