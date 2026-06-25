import apiClient from '@/utils/axios'
import type { Video, CreateVideoPayload, UpdateVideoPayload } from '@/types'
import type { PaginatedResponse } from '@/types'

export interface VideoFilters {
  page?: number
  per_page?: number
  search?: string
  gallery_id?: number
}

export const videoService = {
  getAll(filters?: VideoFilters): Promise<PaginatedResponse<Video>> {
    return apiClient.get('/videos', { params: filters })
  },

  getById(id: number): Promise<Video> {
    return apiClient.get(`/videos/${id}`)
  },

  create(payload: CreateVideoPayload): Promise<Video> {
    return apiClient.post('/videos', payload)
  },

  update(id: number, payload: UpdateVideoPayload): Promise<Video> {
    return apiClient.put(`/videos/${id}`, payload)
  },

  delete(id: number): Promise<void> {
    return apiClient.delete(`/videos/${id}`)
  },
}
