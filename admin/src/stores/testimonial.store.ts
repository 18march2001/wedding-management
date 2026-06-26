import { ref } from 'vue'
import { defineStore } from 'pinia'
import { testimonialService, type TestimonialFilters } from '@/services/testimonial.service'
import type { Testimonial, CreateTestimonialPayload, UpdateTestimonialPayload } from '@/types'

export const useTestimonialStore = defineStore('testimonial', () => {
  const testimonials = ref<Testimonial[]>([])
  const pagination = ref({ currentPage: 1, lastPage: 1, total: 0, perPage: 10 })
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const fetchTestimonials = async (filters: TestimonialFilters = {}) => {
    isLoading.value = true
    error.value = null
    try {
      const res = await testimonialService.getAll({
        page: filters.page ?? pagination.value.currentPage,
        per_page: pagination.value.perPage,
        ...filters,
      })
      testimonials.value = res.data
      pagination.value = {
        currentPage: res.current_page,
        lastPage: res.last_page,
        total: res.total,
        perPage: res.per_page,
      }
    } catch (err: any) {
      error.value = err.message || 'Failed to load testimonials.'
    } finally {
      isLoading.value = false
    }
  }

  const createTestimonial = async (payload: CreateTestimonialPayload) => {
    const created = await testimonialService.create(payload)
    await fetchTestimonials({ page: 1 })
    return created
  }

  const updateTestimonial = async (id: number, payload: UpdateTestimonialPayload) => {
    const updated = await testimonialService.update(id, payload)
    await fetchTestimonials({ page: pagination.value.currentPage })
    return updated
  }

  const deleteTestimonial = async (id: number) => {
    await testimonialService.delete(id)
    await fetchTestimonials({ page: pagination.value.currentPage })
  }

  return {
    testimonials,
    pagination,
    isLoading,
    error,
    fetchTestimonials,
    createTestimonial,
    updateTestimonial,
    deleteTestimonial,
  }
})
