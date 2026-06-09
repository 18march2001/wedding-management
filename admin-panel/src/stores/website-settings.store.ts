import { ref } from 'vue'
import { defineStore } from 'pinia'
import { websiteSettingsService, type HeroSliderImage } from '@/services/website-settings.service'

export const useWebsiteSettingsStore = defineStore('websiteSettings', () => {
  const websiteContent = ref('')
  const heroSliderImages = ref<HeroSliderImage[]>([])
  const isLoading = ref(false)
  const isSaving = ref(false)
  const isUploading = ref(false)

  const fetchSettings = async () => {
    isLoading.value = true
    try {
      const res = await websiteSettingsService.get()
      websiteContent.value = res.data.website_content ?? ''
      heroSliderImages.value = res.data.hero_slider_images ?? []
    } finally {
      isLoading.value = false
    }
  }

  const updateWebsiteContent = async (content: string) => {
    isSaving.value = true
    try {
      await websiteSettingsService.updateContent(content)
      websiteContent.value = content
    } finally {
      isSaving.value = false
    }
  }

  const uploadImages = async (images: File[]) => {
    isUploading.value = true
    try {
      const res = await websiteSettingsService.uploadSliderImages(images)
      heroSliderImages.value.push(...res.data)
    } finally {
      isUploading.value = false
    }
  }

  const deleteImage = async (mediaId: number) => {
    await websiteSettingsService.deleteSliderImage(mediaId)
    heroSliderImages.value = heroSliderImages.value.filter((img) => img.id !== mediaId)
  }

  return {
    websiteContent,
    heroSliderImages,
    isLoading,
    isSaving,
    isUploading,
    fetchSettings,
    updateWebsiteContent,
    uploadImages,
    deleteImage,
  }
})
