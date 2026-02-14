/**
 * Digests API Service
 *
 * Handles all API calls related to digests
 */

import { get, post, patch, del } from '../client'
import type {
  DigestList,
  DigestResponse,
  DigestCreate,
  DigestUpdate,
  DigestListParams,
  DigestGenerateRequest,
  DigestDeliveryRequest,
  ArticleResponse,
} from '../types'

export const digestsService = {
  /**
   * Get list of digests with optional filters and pagination
   */
  async list(params?: DigestListParams): Promise<DigestList> {
    return get<DigestList>('/api/v1/digests', { params })
  },

  /**
   * Get a single digest by ID
   */
  async get(id: string): Promise<DigestResponse> {
    return get<DigestResponse>(`/api/v1/digests/${id}`)
  },

  /**
   * Create a new digest
   */
  async create(data: DigestCreate): Promise<DigestResponse> {
    return post<DigestResponse>('/api/v1/digests', data)
  },

  /**
   * Update an existing digest
   */
  async update(id: string, data: DigestUpdate): Promise<DigestResponse> {
    return patch<DigestResponse>(`/api/v1/digests/${id}`, data)
  },

  /**
   * Delete a digest
   */
  async delete(id: string): Promise<{ message: string }> {
    return del<{ message: string }>(`/api/v1/digests/${id}`)
  },

  /**
   * Generate a new digest from articles
   */
  async generate(
    data: DigestGenerateRequest
  ): Promise<{ message: string; digest_id?: string; job_id?: string }> {
    return post<{ message: string; digest_id?: string; job_id?: string }>(
      '/api/v1/digests/generate',
      data
    )
  },

  /**
   * Deliver a digest via email/Notion
   */
  async deliver(
    data: DigestDeliveryRequest
  ): Promise<{ message: string; job_id?: string }> {
    return post<{ message: string; job_id?: string }>('/api/v1/digests/deliver', data)
  },

  /**
   * Get articles in a digest
   */
  async getArticles(id: string): Promise<ArticleResponse[]> {
    return get<ArticleResponse[]>(`/api/v1/digests/${id}/articles`)
  },
}
