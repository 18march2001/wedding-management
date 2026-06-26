import { ref } from 'vue'
import { defineStore } from 'pinia'
import { galleryService, type GalleryFilters } from '@/services/gallery.service'
import type { Gallery, GalleryImage, CreateGalleryPayload, UpdateGalleryPayload } from '@/types'

export const useGalleryStore = defineStore('gallery', () => {
  const galleries = ref<Gallery[]>([])
  const pagination = ref({ currentPage: 1, lastPage: 1, total: 0, perPage: 10 })
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const fetchGalleries = async (filters: GalleryFilters = {}) => {
    isLoading.value = true
    error.value = null
    try {
      const res = await galleryService.getAll({
        page: filters.page ?? pagination.value.currentPage,
        per_page: pagination.value.perPage,
        ...filters,
      })
      galleries.value = res.data
      pagination.value = {
        currentPage: res.current_page,
        lastPage: res.last_page,
        total: res.total,
        perPage: res.per_page,
      }
    } catch (err: any) {
      error.value = err.message || 'Failed to load galleries.'
    } finally {
      isLoading.value = false
    }
  }

  const createGallery = async (payload: CreateGalleryPayload) => {
    const created = await galleryService.create(payload)
    await fetchGalleries({ page: 1 })
    return created
  }

  const updateGallery = async (id: number, payload: UpdateGalleryPayload) => {
    const updated = await galleryService.update(id, payload)
    await fetchGalleries({ page: pagination.value.currentPage })
    return updated
  }

  const deleteGallery = async (id: number) => {
    await galleryService.delete(id)
    await fetchGalleries({ page: pagination.value.currentPage })
  }

  // --- Photo management ---
  const images = ref<GalleryImage[]>([])
  const imagesLoading = ref(false)
  const imagesError = ref<string | null>(null)
  const activeGalleryId = ref<number | null>(null)

  const fetchImages = async (galleryId: number) => {
    imagesLoading.value = true
    imagesError.value = null
    activeGalleryId.value = galleryId
    try {
      const res = await galleryService.getImages(galleryId)
      images.value = res.data
    } catch (err: any) {
      imagesError.value = err.message || 'Failed to load images.'
    } finally {
      imagesLoading.value = false
    }
  }

  const uploadImages = async (galleryId: number, files: File[], onProgress?: (percent: number) => void) => {
    await galleryService.uploadImages(galleryId, files, onProgress)
  }

  const deleteImage = async (mediaId: number) => {
    await galleryService.deleteImage(mediaId)
    images.value = images.value.filter((img: GalleryImage) => img.id !== mediaId)
  }

  return {
    galleries,
    pagination,
    isLoading,
    error,
    fetchGalleries,
    createGallery,
    updateGallery,
    deleteGallery,
    images,
    imagesLoading,
    imagesError,
    activeGalleryId,
    fetchImages,
    uploadImages,
    deleteImage,
  }
})
