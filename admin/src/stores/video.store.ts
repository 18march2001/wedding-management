import { ref } from 'vue'
import { defineStore } from 'pinia'
import { videoService, type VideoFilters } from '@/services/video.service'
import type { Video, CreateVideoPayload, UpdateVideoPayload } from '@/types'

export const useVideoStore = defineStore('video', () => {
  const videos = ref<Video[]>([])
  const pagination = ref({ currentPage: 1, lastPage: 1, total: 0, perPage: 10 })
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const fetchVideos = async (filters: VideoFilters = {}) => {
    isLoading.value = true
    error.value = null
    try {
      const res = await videoService.getAll({
        page: filters.page ?? pagination.value.currentPage,
        per_page: pagination.value.perPage,
        ...filters,
      })
      videos.value = res.data
      pagination.value = {
        currentPage: res.current_page,
        lastPage: res.last_page,
        total: res.total,
        perPage: res.per_page,
      }
    } catch (err: any) {
      error.value = err.message || 'Failed to load videos.'
    } finally {
      isLoading.value = false
    }
  }

  const createVideo = async (payload: CreateVideoPayload) => {
    const created = await videoService.create(payload)
    await fetchVideos({ page: 1 })
    return created
  }

  const updateVideo = async (id: number, payload: UpdateVideoPayload) => {
    const updated = await videoService.update(id, payload)
    await fetchVideos({ page: pagination.value.currentPage })
    return updated
  }

  const deleteVideo = async (id: number) => {
    await videoService.delete(id)
    await fetchVideos({ page: pagination.value.currentPage })
  }

  return {
    videos,
    pagination,
    isLoading,
    error,
    fetchVideos,
    createVideo,
    updateVideo,
    deleteVideo,
  }
})
