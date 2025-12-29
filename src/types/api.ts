export type SourceType = 
  | "youtube_channel"
  | "youtube_playlist"
  | "youtube_video"
  | "discord_server"
  | "discord_channel"
  | "whatsapp_chat"
  | "whatsapp_group";

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

export type IdeaType =
  | "thesis"
  | "argument"
  | "pattern"
  | "insight"
  | "belief"
  | "prediction";

export type PatternType =
  | "evolution"
  | "contradiction"
  | "reinforcement"
  | "emergence"
  | "shift";

export interface KnowledgeBase {
  id: string;
  name: string;
  description: string | null;
  created_at: string;
  updated_at: string;
  source_count: number;
  video_count: number;
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
  video_count: number;
}

export interface SourceCreate {
  url: string;
  language?: string | null;
}

export interface Video {
  id: string;
  source_id: string;
  youtube_id: string;
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
  total_videos: number;
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
  video_id?: string;
  video_title?: string;
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
  video_id?: string;
  video_title?: string;
  source_id?: string;
  source_url?: string;
  start_time?: number | null;
}

export interface ConsolidatedIdea {
  id: string;
  knowledge_base_id: string;
  idea_type: IdeaType;
  title: string;
  description: string;
  frequency: number;
  importance_score: number;
  sources: Record<string, unknown>[];
  first_seen: string | null;
  last_seen: string | null;
  evolution_notes: string | null;
  created_at: string;
}

export interface TemporalPattern {
  id: string;
  knowledge_base_id: string;
  pattern_type: PatternType;
  title: string;
  description: string;
  timeline: Record<string, unknown>[];
  interpretation: string | null;
  significance: number;
  created_at: string;
}

export interface IntelligenceReportSummary {
  id: string;
  knowledge_base_id: string;
  title: string;
  version: number;
  is_latest: boolean;
  created_at: string;
}

export interface IntelligenceReport {
  id: string;
  knowledge_base_id: string;
  title: string;
  executive_summary: string;
  sections: Record<string, unknown>;
  metadata: Record<string, unknown>;
  version: number;
  created_at: string;
}

export interface PipelineStageInfo {
  status: "pending" | "in_progress" | "completed" | "failed";
  items_processed: number;
  items_total: number;
}

export interface PipelineStatus {
  knowledge_base_id: string;
  status: "pending" | "processing" | "completed" | "failed";
  current_stage: "loading" | "extracting" | "consolidating" | "reporting" | "completed" | "not_started";
  progress_percent: number;
  stages: Record<string, PipelineStageInfo>;
  errors: string[];
  started_at: string | null;
  completed_at: string | null;
}

export interface ExtractionStatus {
  knowledge_base_id: string;
  total_chunks: number;
  chunks_processed: number;
  concepts_extracted: number;
  entities_extracted: number;
  status: "pending" | "in_progress" | "completed" | "failed";
}

export interface ConsolidationStatus {
  knowledge_base_id: string;
  total_concepts: number;
  consolidated_ideas: number;
  temporal_patterns: number;
  themes: string[];
  status: string;
}

export interface ReportMarkdown {
  report_id: string;
  title: string;
  markdown_content: string;
  created_at: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  skip: number;
  limit: number;
  has_more: boolean;
}
