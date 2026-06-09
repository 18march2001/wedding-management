import apiClient from '@/utils/axios'
import type { Inquiry, InquiryFilters } from '@/types'
import type { PaginatedResponse } from '@/types'

export const inquiryService = {
  getAll(filters?: InquiryFilters): Promise<PaginatedResponse<Inquiry>> {
    return apiClient.get('/inquiries', { params: filters })
  },

  getById(id: number): Promise<Inquiry> {
    return apiClient.get(`/inquiries/${id}`)
  },

  delete(id: number): Promise<{ message: string }> {
    return apiClient.delete(`/inquiries/${id}`)
  },
}
