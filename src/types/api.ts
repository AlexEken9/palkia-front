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
  extracting: number;
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
  status: "fetching_metadata" | "processing" | "extracting" | "completed" | "failed";
  progress_percent: number;
  current_stage: string;
  message: string | null;
  media: ContentStatusCounts;
  current_item: CurrentContentInfo | null;
}

export interface MediaProgressInfo {
  stage: string;
  percent: number;
  message: string | null;
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
  error_message: string | null;
  created_at: string;
  processed_at: string | null;
  progress: MediaProgressInfo | null;
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

export const PROCESSING_STATUS_CONFIG: Record<
  ProcessingStatus,
  { label: string; progress: number; color: string }
> = {
  pending: { label: "Queued", progress: 0, color: "slate" },
  downloading: { label: "Downloading", progress: 20, color: "blue" },
  transcribing: { label: "Transcribing", progress: 40, color: "amber" },
  processing: { label: "Processing", progress: 60, color: "purple" },
  extracting: { label: "Extracting", progress: 80, color: "pink" },
  completed: { label: "Completed", progress: 100, color: "green" },
  failed: { label: "Failed", progress: 0, color: "red" },
};

export function isTerminalStatus(status: ProcessingStatus): boolean {
  return status === "completed" || status === "failed";
}

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
