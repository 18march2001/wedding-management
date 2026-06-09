import apiClient from '@/utils/axios'
import type { Testimonial, CreateTestimonialPayload, UpdateTestimonialPayload } from '@/types'
import type { PaginatedResponse } from '@/types'

export interface TestimonialFilters {
  page?: number
  per_page?: number
  search?: string
}

export const testimonialService = {
  getAll(filters?: TestimonialFilters): Promise<PaginatedResponse<Testimonial>> {
    return apiClient.get('/testimonials', { params: filters })
  },

  getById(id: number): Promise<Testimonial> {
    return apiClient.get(`/testimonials/${id}`)
  },

  create(payload: CreateTestimonialPayload): Promise<Testimonial> {
    return apiClient.post('/testimonials', payload)
  },

  update(id: number, payload: UpdateTestimonialPayload): Promise<Testimonial> {
    return apiClient.put(`/testimonials/${id}`, payload)
  },

  delete(id: number): Promise<void> {
    return apiClient.delete(`/testimonials/${id}`)
  },
}
