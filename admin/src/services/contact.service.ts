import apiClient from '@/utils/axios'

export interface ContactSettings {
  phone_number: string
  whatsapp_number: string
  email: string
  address: string
  business_hours: string
  facebook_url: string
  instagram_url: string
}

export const contactService = {
  get(): Promise<ContactSettings> {
    return apiClient.get('/contact-settings')
  },

  update(payload: ContactSettings): Promise<{ message: string; contact: ContactSettings }> {
    return apiClient.post('/contact-settings', payload)
  },
}
