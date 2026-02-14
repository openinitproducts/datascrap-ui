/**
 * Sources API Service
 *
 * Handles all API calls related to sources (websites/RSS feeds)
 */

import { get, post, patch, del } from '../client'
import type {
  SourceList,
  SourceResponse,
  SourceCreate,
  SourceUpdate,
  SourceListParams,
} from '../types'

export const sourcesService = {
  /**
   * Get list of sources with optional filters and pagination
   */
  async list(params?: SourceListParams): Promise<SourceList> {
    return get<SourceList>('/api/v1/sources', { params })
  },

  /**
   * Get a single source by ID
   */
  async get(id: string): Promise<SourceResponse> {
    return get<SourceResponse>(`/api/v1/sources/${id}`)
  },

  /**
   * Create a new source
   */
  async create(data: SourceCreate): Promise<SourceResponse> {
    return post<SourceResponse>('/api/v1/sources', data)
  },

  /**
   * Update an existing source
   */
  async update(id: string, data: SourceUpdate): Promise<SourceResponse> {
    return patch<SourceResponse>(`/api/v1/sources/${id}`, data)
  },

  /**
   * Delete a source
   */
  async delete(id: string): Promise<{ message: string }> {
    return del<{ message: string }>(`/api/v1/sources/${id}`)
  },

  /**
   * Trigger manual scraping for a source
   */
  async scrape(id: string): Promise<{ message: string; job_id?: string }> {
    return post<{ message: string; job_id?: string }>(`/api/v1/sources/${id}/scrape`)
  },
}
