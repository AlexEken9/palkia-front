export type SourceType = string;

export type ProcessingStatus =
  | "pending"
  | "downloading"
  | "transcribing"
  | "processing"
  | "extracting"
  | "completed"
  | "failed";

export type ConceptType =
  | "definition"
  | "framework"
  | "methodology"
  | "principle"
  | "insight"
  | "opinion"
  | "fact"
  | "recommendation";

export type EntityType =
  | "person"
  | "book"
  | "tool"
  | "company"
  | "concept"
  | "resource"
  | "event";

export interface KnowledgeBase {
  id: string;
  name: string;
  description: string | null;
  created_at: string;
  updated_at: string;
  source_count: number;
  media_count: number;
}

export interface KnowledgeBaseCreate {
  name: string;
  description?: string | null;
}

export interface Source {
  id: string;
  knowledge_base_id: string;
  source_type: SourceType;
  url: string;
  title: string | null;
  language: string | null;
  created_at: string;
  media_count: number;
}

export interface SourceCreate {
  url: string;
  language?: string | null;
}

export interface ContentStatusCounts {
  total: number;
  pending: number;
  downloading: number;
  transcribing: number;
  processing: number;
  completed: number;
  failed: number;
}

export interface CurrentContentInfo {
  id: string;
  title: string;
  status: string;
}

export interface SourceIngestionStatus {
  source_id: string;
  source_type: string;
  title: string | null;
  status: "fetching_metadata" | "processing" | "completed" | "failed";
  progress_percent: number;
  current_stage: string;
  message: string | null;
  media: ContentStatusCounts;
  current_item: CurrentContentInfo | null;
}

export interface MediaContent {
  id: string;
  source_id: string | null;
  remote_id: string;
  platform: string;
  title: string;
  description: string | null;
  duration_seconds: number | null;
  upload_date: string | null;
  thumbnail_url: string | null;
  language: string | null;
  status: ProcessingStatus;
  created_at: string;
  processed_at: string | null;
}

export interface ProcessingStatusResponse {
  knowledge_base_id: string;
  total_items: number;
  pending: number;
  processing: number;
  extracting: number;
  completed: number;
  failed: number;
}

export interface ExtractedConcept {
  id: string;
  chunk_id: string;
  concept_type: ConceptType;
  name: string;
  description: string;
  context: string | null;
  raw_quote: string | null;
  confidence: number;
  created_at: string;
  media_id?: string;
  media_title?: string;
  source_id?: string;
  source_url?: string;
  start_time?: number | null;
}

export interface ExtractedEntity {
  id: string;
  chunk_id: string;
  entity_type: EntityType;
  name: string;
  description: string | null;
  context: string | null;
  sentiment: string | null;
  url: string | null;
  created_at: string;
  media_id?: string;
  media_title?: string;
  source_id?: string;
  source_url?: string;
  start_time?: number | null;
}

export interface ExtractionStatus {
  knowledge_base_id: string;
  total_chunks: number;
  chunks_processed: number;
  concepts_extracted: number;
  entities_extracted: number;
  status: "pending" | "in_progress" | "completed" | "failed";
}

/**
 * Detailed media ingestion status for real-time pipeline tracking
 */
export interface MediaIngestionStatus {
  media_id: string;
  title: string;
  status: ProcessingStatus;
  progress_percent: number;
  current_stage: string;
  message: string | null;
  error_message: string | null;
  started_at: string | null;
  completed_at: string | null;
}

/**
 * UI-friendly status label mapping
 */
export const PROCESSING_STATUS_LABELS: Record<ProcessingStatus, string> = {
  pending: "En cola para procesar...",
  downloading: "Descargando...",
  transcribing: "Transcribiendo...",
  processing: "Procesando...",
  extracting: "Extrayendo...",
  completed: "Completado",
  failed: "Error",
};

/**
 * Progress ranges for each status stage
 */
export const PROCESSING_STATUS_PROGRESS: Record<ProcessingStatus, { min: number; max: number }> = {
  pending: { min: 0, max: 0 },
  downloading: { min: 10, max: 30 },
  transcribing: { min: 30, max: 70 },
  processing: { min: 70, max: 90 },
  extracting: { min: 90, max: 99 },
  completed: { min: 100, max: 100 },
  failed: { min: 0, max: 0 },
};

/**
 * Check if a processing status is a final state (no more processing)
 */
export function isTerminalStatus(status: ProcessingStatus): boolean {
  return status === "completed" || status === "failed";
}

/**
 * Check if a processing status indicates active processing
 */
export function isActiveStatus(status: ProcessingStatus): boolean {
  return ["downloading", "transcribing", "processing", "extracting"].includes(status);
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  skip: number;
  limit: number;
  has_more: boolean;
}
