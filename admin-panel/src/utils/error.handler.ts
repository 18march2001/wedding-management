import { ApiError } from '@/types'
import { ERROR_MESSAGES } from './constants'

export class ApiErrorHandler {
  static handle(error: any): string {
    // Handle API Error
    if (this.isApiError(error)) {
      return error.message || ERROR_MESSAGES.SERVER_ERROR
    }

    // Handle Validation Errors
    if (error.errors && typeof error.errors === 'object') {
      const firstError = Object.values(error.errors)[0]
      if (Array.isArray(firstError) && firstError.length > 0) {
        return firstError[0] as string
      }
    }

    // Handle Network Errors
    if (error.message === 'Network Error') {
      return ERROR_MESSAGES.NETWORK_ERROR
    }

    // Handle Timeout
    if (error.code === 'ECONNABORTED') {
      return 'Request timeout. Please try again.'
    }

    // Handle 404
    if (error.code === 404) {
      return ERROR_MESSAGES.NOT_FOUND
    }

    // Handle 401/403
    if (error.code === 401 || error.code === 403) {
      return ERROR_MESSAGES.UNAUTHORIZED
    }

    // Handle Generic Error
    return error.message || ERROR_MESSAGES.SERVER_ERROR
  }

  static isApiError(error: any): error is ApiError {
    return error && typeof error === 'object' && 'success' in error && 'message' in error
  }

  static getFieldErrors(error: any): Record<string, string> {
    if (error.errors && typeof error.errors === 'object') {
      const fieldErrors: Record<string, string> = {}

      Object.entries(error.errors).forEach(([field, messages]: [string, any]) => {
        if (Array.isArray(messages) && messages.length > 0) {
          fieldErrors[field] = messages[0]
        }
      })

      return fieldErrors
    }

    return {}
  }

  static logError(error: any): void {
    if (import.meta.env.DEV) {
      console.error('API Error:', {
        message: error.message,
        code: error.code,
        errors: error.errors,
        timestamp: error.timestamp,
        stack: error.stack,
      })
    }
  }
}

// Error Context for composables
export interface ErrorContext {
  error: string | null
  setError: (message: string) => void
  clearError: () => void
}

export const createErrorContext = (): ErrorContext => {
  let error: string | null = null

  return {
    error,
    setError: (message: string) => {
      error = message
    },
    clearError: () => {
      error = null
    },
  }
}
