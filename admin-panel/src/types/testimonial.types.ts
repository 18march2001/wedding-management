export interface Testimonial {
  id: number
  name: string
  description?: string
  created_at: string
}

export interface CreateTestimonialPayload {
  name: string
  description?: string
}

export interface UpdateTestimonialPayload extends Partial<CreateTestimonialPayload> {}
