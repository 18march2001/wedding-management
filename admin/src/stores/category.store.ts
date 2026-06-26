import { ref } from 'vue'
import { defineStore } from 'pinia'
import { categoryService } from '@/services/category.service'
import type { GalleryCategory, CreateGalleryCategoryPayload, UpdateGalleryCategoryPayload } from '@/types'

export const useCategoryStore = defineStore('category', () => {
  const categories = ref<GalleryCategory[]>([])
  const pagination = ref({ currentPage: 1, lastPage: 1, total: 0, perPage: 10 })
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const fetchCategories = async (page = 1, search = '') => {
    isLoading.value = true
    error.value = null
    try {
      const res = await categoryService.getAll({ page, per_page: pagination.value.perPage, search })
      categories.value = res.data
      pagination.value = {
        currentPage: res.current_page,
        lastPage: res.last_page,
        total: res.total,
        perPage: res.per_page,
      }
    } catch (err: any) {
      error.value = err.message || 'Failed to load categories.'
    } finally {
      isLoading.value = false
    }
  }

  const createCategory = async (payload: CreateGalleryCategoryPayload) => {
    const created = await categoryService.create(payload)
    await fetchCategories(pagination.value.currentPage)
    return created
  }

  const updateCategory = async (id: number, payload: UpdateGalleryCategoryPayload) => {
    const updated = await categoryService.update(id, payload)
    await fetchCategories(pagination.value.currentPage)
    return updated
  }

  const deleteCategory = async (id: number) => {
    await categoryService.delete(id)
    await fetchCategories(pagination.value.currentPage)
  }

  return {
    categories,
    pagination,
    isLoading,
    error,
    fetchCategories,
    createCategory,
    updateCategory,
    deleteCategory,
  }
})
