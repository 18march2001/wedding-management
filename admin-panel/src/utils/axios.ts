import axios, { AxiosInstance, AxiosError, AxiosResponse } from 'axios'
import { ApiError } from '@/types'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api'
const API_TIMEOUT = Number(import.meta.env.VITE_API_TIMEOUT || 30000)
const TOKEN_KEY = 'acp_admin_token'

class ApiClient {
  private client: AxiosInstance

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      timeout: API_TIMEOUT,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    })

    this.setupInterceptors()
  }

  private setupInterceptors(): void {
    // Request Interceptor
    this.client.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem(TOKEN_KEY)
        if (token) {
          config.headers.Authorization = `Bearer ${token}`
        }
        return config
      },
      (error) => {
        return Promise.reject(error)
      }
    )

    // Response Interceptor
    this.client.interceptors.response.use(
      (response: AxiosResponse) => {
        return response.data
      },
      (error: AxiosError) => {
        const apiError: ApiError = {
          success: false,
          message: error.message || 'An error occurred',
          timestamp: new Date().toISOString(),
        }

        if (error.response) {
          const data = error.response.data as any
          apiError.message = data?.message || error.statusText || 'Server error'
          apiError.code = error.response.status
          apiError.errors = data?.errors || undefined

          if (error.response.status === 401) {
            localStorage.removeItem(TOKEN_KEY)
          }
        }

        return Promise.reject(apiError)
      }
    )
  }

  public getInstance(): AxiosInstance {
    return this.client
  }
}

export default new ApiClient().getInstance()
