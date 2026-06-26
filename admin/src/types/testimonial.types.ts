export interface Testimonial {
  id: number
  name: string
  description?: string
  photo_url?: string
  created_at: string
}

export interface CreateTestimonialPayload {
  name: string
  description?: string
  photo?: File
}

export interface UpdateTestimonialPayload extends Partial<CreateTestimonialPayload> {}
