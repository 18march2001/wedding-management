import apiClient from '@/utils/axios'
import type { Gallery, CreateGalleryPayload, UpdateGalleryPayload, GalleryImage } from '@/types'
import type { PaginatedResponse } from '@/types'

export interface GalleryFilters {
  page?: number
  per_page?: number
  search?: string
  gallery_category_id?: number
}

const toFormData = (payload: CreateGalleryPayload | UpdateGalleryPayload): FormData => {
  const form = new FormData()
  form.append('title', payload.title)
  form.append('gallery_category_id', String(payload.gallery_category_id))
  if (payload.location) form.append('location', payload.location)
  if (payload.event_date) form.append('event_date', payload.event_date)
  if (payload.cover_image) form.append('cover_image', payload.cover_image)
  return form
}

export const galleryService = {
  getAll(filters?: GalleryFilters): Promise<PaginatedResponse<Gallery>> {
    return apiClient.get('/galleries', { params: filters })
  },

  getBySlug(slug: string): Promise<Gallery> {
    return apiClient.get(`/galleries/${slug}`)
  },

  create(payload: CreateGalleryPayload): Promise<Gallery> {
    return apiClient.post('/galleries', toFormData(payload), {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
  },

  update(id: number, payload: UpdateGalleryPayload): Promise<Gallery> {
    const form = toFormData(payload)
    form.append('_method', 'PUT')
    return apiClient.post(`/galleries/${id}`, form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
  },

  delete(id: number): Promise<void> {
    return apiClient.delete(`/galleries/${id}`)
  },

  getImages(galleryId: number): Promise<{ data: GalleryImage[] }> {
    return apiClient.get(`/gallery-images/${galleryId}`)
  },

  uploadImages(galleryId: number, images: File[], onProgress?: (percent: number) => void): Promise<void> {
    const form = new FormData()
    form.append('gallery_id', String(galleryId))
    images.forEach((img) => form.append('images[]', img))
    return apiClient.post('/galleries/add-images', form, {
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress: (e) => {
        if (onProgress && e.total) onProgress(Math.round((e.loaded * 100) / e.total))
      },
    })
  },

  updateImage(mediaId: number, data: { alt?: string }): Promise<GalleryImage> {
    return apiClient.put(`/gallery-images/${mediaId}`, data)
  },

  deleteImage(mediaId: number): Promise<void> {
    return apiClient.delete(`/gallery-images/${mediaId}`)
  },
}
