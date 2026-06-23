import { ref } from 'vue'
import { defineStore } from 'pinia'
import { websiteSettingsService, type HeroSliderImage, type ContentImage } from '@/services/website-settings.service'

export const useWebsiteSettingsStore = defineStore('websiteSettings', () => {
  const websiteContent = ref('')
  const heroSliderImages = ref<HeroSliderImage[]>([])
  const leftSideImage = ref<ContentImage | null>(null)
  const rightSideImage = ref<ContentImage | null>(null)
  const isLoading = ref(false)
  const isSaving = ref(false)
  const isUploading = ref(false)
  const isUploadingContent = ref(false)

  const fetchSettings = async () => {
    isLoading.value = true
    try {
      const res = await websiteSettingsService.get()
      websiteContent.value = res.data.website_content ?? ''
      heroSliderImages.value = res.data.hero_slider_images ?? []
      leftSideImage.value = res.data.left_side_image ?? null
      rightSideImage.value = res.data.right_side_image ?? null
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

  const uploadContentImage = async (position: 'left' | 'right', image: File) => {
    isUploadingContent.value = true
    try {
      const res = await websiteSettingsService.uploadContentImage(position, image)
      if (position === 'left') leftSideImage.value = res.data
      else rightSideImage.value = res.data
    } finally {
      isUploadingContent.value = false
    }
  }

  const deleteContentImage = async (position: 'left' | 'right', mediaId: number) => {
    await websiteSettingsService.deleteContentImage(mediaId)
    if (position === 'left') leftSideImage.value = null
    else rightSideImage.value = null
  }

  return {
    websiteContent,
    heroSliderImages,
    leftSideImage,
    rightSideImage,
    isLoading,
    isSaving,
    isUploading,
    isUploadingContent,
    fetchSettings,
    updateWebsiteContent,
    uploadImages,
    deleteImage,
    uploadContentImage,
    deleteContentImage,
  }
})
