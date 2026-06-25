export interface Video {
  id: number
  title: string
  url: string
  description?: string
  gallery_id?: number
  gallery?: { id: number; title: string }
  created_at: string
}

export interface CreateVideoPayload {
  title: string
  url: string
  description?: string
  gallery_id?: number
}

export interface UpdateVideoPayload extends Partial<CreateVideoPayload> {}
