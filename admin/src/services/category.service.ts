import apiClient from '@/utils/axios'
import type { GalleryCategory, CreateGalleryCategoryPayload, UpdateGalleryCategoryPayload } from '@/types'
import type { PaginatedResponse, PaginationParams } from '@/types'

function toFormData(payload: Record<string, any>): FormData {
  const fd = new FormData()
  Object.entries(payload).forEach(([k, v]) => v !== undefined && fd.append(k, v))
  return fd
}

export const categoryService = {
  getAll(params?: Partial<PaginationParams>): Promise<PaginatedResponse<GalleryCategory>> {
    return apiClient.get('/gallery-categories', { params })
  },

  getById(id: number): Promise<GalleryCategory> {
    return apiClient.get(`/gallery-categories/${id}`)
  },

  create(payload: CreateGalleryCategoryPayload): Promise<GalleryCategory> {
    if (payload.image || payload.video) {
      return apiClient.post('/gallery-categories', toFormData(payload), {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
    }
    return apiClient.post('/gallery-categories', payload)
  },

  update(id: number, payload: UpdateGalleryCategoryPayload): Promise<GalleryCategory> {
    if (payload.image || payload.video) {
      const fd = toFormData(payload)
      fd.append('_method', 'PUT')
      return apiClient.post(`/gallery-categories/${id}`, fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
    }
    return apiClient.put(`/gallery-categories/${id}`, payload)
  },

  delete(id: number): Promise<void> {
    return apiClient.delete(`/gallery-categories/${id}`)
  },
}
