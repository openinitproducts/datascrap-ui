/**
 * Articles API Service
 *
 * Handles all API calls related to articles
 */

import { get, post, patch, del } from '../client'
import type {
  ArticleList,
  ArticleResponse,
  ArticleUpdate,
  ArticleListParams,
  ArticleSummarizeRequest,
  ArticleStats,
} from '../types'

export const articlesService = {
  /**
   * Get list of articles with optional filters and pagination
   */
  async list(params?: ArticleListParams): Promise<ArticleList> {
    return get<ArticleList>('/api/v1/articles', { params })
  },

  /**
   * Get a single article by ID
   */
  async get(id: string): Promise<ArticleResponse> {
    return get<ArticleResponse>(`/api/v1/articles/${id}`)
  },

  /**
   * Update an existing article
   */
  async update(id: string, data: ArticleUpdate): Promise<ArticleResponse> {
    return patch<ArticleResponse>(`/api/v1/articles/${id}`, data)
  },

  /**
   * Delete an article
   */
  async delete(id: string): Promise<{ message: string }> {
    return del<{ message: string }>(`/api/v1/articles/${id}`)
  },

  /**
   * Trigger AI summarization for an article
   */
  async summarize(
    data: ArticleSummarizeRequest
  ): Promise<{ message: string; job_id?: string }> {
    return post<{ message: string; job_id?: string }>('/api/v1/articles/summarize', data)
  },

  /**
   * Get article statistics overview
   */
  async getStats(): Promise<ArticleStats> {
    return get<ArticleStats>('/api/v1/articles/stats/overview')
  },
}
