import apiClient from '@/utils/axios'

export interface HeroSliderImage {
  id: number
  url: string
}

export interface WebsiteSettings {
  website_content: string
  hero_slider_images: HeroSliderImage[]
}

export const websiteSettingsService = {
  get(): Promise<{ success: boolean; data: WebsiteSettings }> {
    return apiClient.get('/settings/website')
  },

  updateContent(website_content: string): Promise<{ success: boolean; message: string }> {
    return apiClient.put('/settings/website', { website_content })
  },

  uploadSliderImages(images: File[]): Promise<{ success: boolean; data: HeroSliderImage[] }> {
    const form = new FormData()
    images.forEach((img) => form.append('images[]', img))
    return apiClient.post('/settings/website/slider-images', form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
  },

  deleteSliderImage(mediaId: number): Promise<{ success: boolean; message: string }> {
    return apiClient.delete(`/settings/website/slider-images/${mediaId}`)
  },
}
