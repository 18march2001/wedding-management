export interface Inquiry {
  id: number
  name: string
  contact_number: string
  subject: string
  email: string
  message: string
  created_at: string
}

export interface InquiryFilters {
  page?: number
  per_page?: number
  search?: string
}
