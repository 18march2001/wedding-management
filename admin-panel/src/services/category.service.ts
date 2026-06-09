import apiClient from '@/utils/axios'
import type { GalleryCategory, CreateGalleryCategoryPayload, UpdateGalleryCategoryPayload } from '@/types'
import type { PaginatedResponse, PaginationParams } from '@/types'

export const categoryService = {
  getAll(params?: Partial<PaginationParams>): Promise<PaginatedResponse<GalleryCategory>> {
    return apiClient.get('/gallery-categories', { params })
  },

  getById(id: number): Promise<GalleryCategory> {
    return apiClient.get(`/gallery-categories/${id}`)
  },

  create(payload: CreateGalleryCategoryPayload): Promise<GalleryCategory> {
    return apiClient.post('/gallery-categories', payload)
  },

  update(id: number, payload: UpdateGalleryCategoryPayload): Promise<GalleryCategory> {
    return apiClient.put(`/gallery-categories/${id}`, payload)
  },

  delete(id: number): Promise<void> {
    return apiClient.delete(`/gallery-categories/${id}`)
  },
}
