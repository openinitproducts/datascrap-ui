/**
 * TypeScript Type Definitions for DataScrap API
 *
 * These types mirror the backend Pydantic schemas for type safety.
 */

// ============================================================================
// Common Types
// ============================================================================

export interface PaginatedResponse<T> {
  total: number
  page: number
  page_size: number
}

// ============================================================================
// Source Types
// ============================================================================

export enum SourceType {
  WEBSITE = 'website',
  RSS = 'rss',
}

export enum SourceStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  ERROR = 'error',
}

export interface SourceCreate {
  name: string
  url: string
  type: SourceType
  status: SourceStatus
  scrape_frequency?: number // in seconds, default 3600
}

export interface SourceUpdate {
  name?: string
  url?: string
  type?: SourceType
  status?: SourceStatus
  scrape_frequency?: number
}

export interface SourceResponse {
  id: string
  user_id: string
  name: string
  url: string
  type: SourceType
  status: SourceStatus
  scrape_frequency: number
  last_scraped_at: string | null
  articles_count: number
  created_at: string
  updated_at: string
}

export interface SourceList extends PaginatedResponse<SourceResponse> {
  sources: SourceResponse[]
}

// ============================================================================
// Article Types
// ============================================================================

export interface ArticleCreate {
  source_id: string
  title: string
  url: string
  content?: string
  excerpt?: string
  summary?: string
  author?: string
  published_at?: string
}

export interface ArticleUpdate {
  title?: string
  content?: string
  excerpt?: string
  summary?: string
  author?: string
  published_at?: string
}

export interface ArticleResponse {
  id: string
  source_id: string
  user_id: string
  title: string
  url: string
  content: string | null
  excerpt: string | null
  summary: string | null
  author: string | null
  published_at: string | null
  scraped_at: string
  created_at: string
  updated_at: string
}

export interface ArticleList extends PaginatedResponse<ArticleResponse> {
  articles: ArticleResponse[]
}

export interface ArticleSummarizeRequest {
  article_id: string
  max_length?: number // default 500, min 100, max 2000
  model?: string // default "gpt-4"
}

export interface ArticleStats {
  total: number
  last_24_hours: number
  last_7_days: number
  last_30_days: number
  by_source: Record<string, number>
}

// ============================================================================
// Digest Types
// ============================================================================

export enum DigestStatus {
  DRAFT = 'draft',
  PENDING = 'pending',
  SENT = 'sent',
  FAILED = 'failed',
}

export enum DigestFrequency {
  DAILY = 'daily',
  WEEKLY = 'weekly',
}

export enum DeliveryMethod {
  EMAIL = 'email',
  NOTION = 'notion',
  BOTH = 'both',
}

export interface DigestCreate {
  title?: string
  frequency?: DigestFrequency
  delivery_method?: DeliveryMethod
  article_ids?: string[]
  auto_generate?: boolean
}

export interface DigestUpdate {
  title?: string
  status?: DigestStatus
  content?: Record<string, any>
}

export interface DigestResponse {
  id: string
  user_id: string
  title: string
  status: DigestStatus
  content: Record<string, any> | null
  article_count: number
  delivery_method: DeliveryMethod
  sent_at: string | null
  created_at: string
  updated_at: string
}

export interface DigestList extends PaginatedResponse<DigestResponse> {
  digests: DigestResponse[]
}

export interface DigestGenerateRequest {
  source_ids?: string[]
  start_date?: string
  end_date?: string
  max_articles?: number // default 10, min 1, max 50
  delivery_method?: DeliveryMethod
}

export interface DigestDeliveryRequest {
  digest_id: string
  delivery_method?: DeliveryMethod
  recipient_email?: string
  notion_database_id?: string
}

// ============================================================================
// API Query Parameters
// ============================================================================

export interface ListQueryParams {
  page?: number
  page_size?: number
}

export interface SourceListParams extends ListQueryParams {
  status?: SourceStatus
  type?: SourceType
}

export interface ArticleListParams extends ListQueryParams {
  source_id?: string
  search?: string
  start_date?: string
  end_date?: string
}

export interface DigestListParams extends ListQueryParams {
  status?: DigestStatus
  delivery_method?: DeliveryMethod
  start_date?: string
  end_date?: string
}

// ============================================================================
// Utility Types
// ============================================================================

export type APIResponse<T> = T

export interface APIErrorDetail {
  loc: string[]
  msg: string
  type: string
}

export interface APIErrorResponse {
  detail: string | APIErrorDetail[]
}
