import apiClient from '@/utils/axios'
import type { Testimonial, CreateTestimonialPayload, UpdateTestimonialPayload } from '@/types'
import type { PaginatedResponse } from '@/types'

export interface TestimonialFilters {
  page?: number
  per_page?: number
  search?: string
}

function toFormData(payload: Record<string, any>): FormData {
  const fd = new FormData()
  Object.entries(payload).forEach(([k, v]) => v !== undefined && fd.append(k, v))
  return fd
}

export const testimonialService = {
  getAll(filters?: TestimonialFilters): Promise<PaginatedResponse<Testimonial>> {
    return apiClient.get('/testimonials', { params: filters })
  },

  getById(id: number): Promise<Testimonial> {
    return apiClient.get(`/testimonials/${id}`)
  },

  create(payload: CreateTestimonialPayload): Promise<Testimonial> {
    if (payload.photo) {
      return apiClient.post('/testimonials', toFormData(payload), {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
    }
    return apiClient.post('/testimonials', payload)
  },

  update(id: number, payload: UpdateTestimonialPayload): Promise<Testimonial> {
    if (payload.photo) {
      const fd = toFormData(payload)
      fd.append('_method', 'PUT')
      return apiClient.post(`/testimonials/${id}`, fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
    }
    return apiClient.put(`/testimonials/${id}`, payload)
  },

  delete(id: number): Promise<void> {
    return apiClient.delete(`/testimonials/${id}`)
  },
}
