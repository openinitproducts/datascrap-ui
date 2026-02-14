/**
 * API Client for DataScrap Backend
 *
 * Centralized HTTP client with:
 * - Automatic JWT token injection from Supabase
 * - Error handling and retry logic
 * - Request/response interceptors
 * - TypeScript type safety
 */

import axios, { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'
import { supabase } from '@/lib/supabase/client'

// API error type
export interface APIError {
  message: string
  detail?: string
  status?: number
}

// Create axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 seconds
})

/**
 * Request Interceptor
 * Adds JWT token from Supabase session to all requests
 */
apiClient.interceptors.request.use(
  async (config) => {
    try {
      const { data: { session } } = await supabase.auth.getSession()

      if (session?.access_token) {
        config.headers.Authorization = `Bearer ${session.access_token}`
      }

      // Log request in development
      if (process.env.NODE_ENV === 'development') {
        console.log(`[API] ${config.method?.toUpperCase()} ${config.url}`, config.params || config.data)
      }

      return config
    } catch (error) {
      console.error('Error in request interceptor:', error)
      return config
    }
  },
  (error) => {
    return Promise.reject(error)
  }
)

/**
 * Response Interceptor
 * Handles errors and unwraps response data
 */
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    // Log response in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`[API] Response:`, response.data)
    }

    // Return the data directly
    return response.data
  },
  async (error: AxiosError) => {
    const apiError: APIError = {
      message: 'An error occurred',
      status: error.response?.status,
    }

    if (error.response) {
      // Server responded with error status
      const data = error.response.data as any

      apiError.message = data?.detail || data?.message || `Error ${error.response.status}`
      apiError.detail = data?.detail

      // Handle authentication errors
      if (error.response.status === 401) {
        console.error('Unauthorized - redirecting to login')
        apiError.message = 'You are not authorized. Please log in.'

        // Optionally redirect to login
        if (typeof window !== 'undefined') {
          window.location.href = '/login'
        }
      }

      // Handle forbidden errors
      if (error.response.status === 403) {
        apiError.message = 'You do not have permission to perform this action.'
      }

      // Handle not found errors
      if (error.response.status === 404) {
        apiError.message = 'The requested resource was not found.'
      }

      // Handle validation errors
      if (error.response.status === 422) {
        apiError.message = 'Validation error. Please check your input.'
      }

      // Handle server errors
      if (error.response.status >= 500) {
        apiError.message = 'Server error. Please try again later.'
      }
    } else if (error.request) {
      // Request made but no response received
      apiError.message = 'No response from server. Please check your connection.'
    } else {
      // Something else happened
      apiError.message = error.message || 'An unexpected error occurred'
    }

    console.error('[API Error]:', apiError)
    return Promise.reject(apiError)
  }
)

/**
 * Type-safe wrapper for GET requests
 */
export async function get<T = any>(
  url: string,
  config?: AxiosRequestConfig
): Promise<T> {
  return apiClient.get(url, config)
}

/**
 * Type-safe wrapper for POST requests
 */
export async function post<T = any>(
  url: string,
  data?: any,
  config?: AxiosRequestConfig
): Promise<T> {
  return apiClient.post(url, data, config)
}

/**
 * Type-safe wrapper for PATCH requests
 */
export async function patch<T = any>(
  url: string,
  data?: any,
  config?: AxiosRequestConfig
): Promise<T> {
  return apiClient.patch(url, data, config)
}

/**
 * Type-safe wrapper for DELETE requests
 */
export async function del<T = any>(
  url: string,
  config?: AxiosRequestConfig
): Promise<T> {
  return apiClient.delete(url, config)
}

// Export the axios instance for advanced use cases
export { apiClient }

// Export as default
export default {
  get,
  post,
  patch,
  delete: del,
  client: apiClient,
}
