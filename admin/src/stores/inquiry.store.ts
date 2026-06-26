import { ref } from 'vue'
import { defineStore } from 'pinia'
import { inquiryService } from '@/services/inquiry.service'
import type { Inquiry, InquiryFilters } from '@/types'

export const useInquiryStore = defineStore('inquiry', () => {
  const inquiries = ref<Inquiry[]>([])
  const pagination = ref({ currentPage: 1, lastPage: 1, total: 0, perPage: 10 })
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const fetchInquiries = async (filters: InquiryFilters = {}) => {
    isLoading.value = true
    error.value = null
    try {
      const res = await inquiryService.getAll({
        page: filters.page ?? pagination.value.currentPage,
        per_page: pagination.value.perPage,
        ...filters,
      })
      inquiries.value = res.data
      pagination.value = {
        currentPage: res.current_page,
        lastPage: res.last_page,
        total: res.total,
        perPage: res.per_page,
      }
    } catch (err: any) {
      error.value = err.message || 'Failed to load inquiries.'
    } finally {
      isLoading.value = false
    }
  }

  const deleteInquiry = async (id: number) => {
    await inquiryService.delete(id)
    inquiries.value = inquiries.value.filter((i) => i.id !== id)
    pagination.value.total -= 1
  }

  return {
    inquiries,
    pagination,
    isLoading,
    error,
    fetchInquiries,
    deleteInquiry,
  }
})
