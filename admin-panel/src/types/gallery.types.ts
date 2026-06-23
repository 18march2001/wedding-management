// Gallery Category
export interface GalleryCategory {
  id: number
  name: string
  slug: string
  description?: string
  image_url?: string
  video_url?: string
  created_at: string
  updated_at: string
}

export interface CreateGalleryCategoryPayload {
  name: string
  description?: string
  image?: File
  video?: File
}

export interface UpdateGalleryCategoryPayload extends Partial<CreateGalleryCategoryPayload> {}

// Gallery
export interface Gallery {
  id: number
  title: string
  slug: string
  gallery_category_id: number
  category?: { id: number; name: string }
  location?: string
  event_date?: string
  cover_image_url?: string
  cover_thumb_url?: string
  images_count: number
  created_at: string
}

export interface CreateGalleryPayload {
  title: string
  gallery_category_id: number
  location?: string
  event_date?: string
  cover_image: File
}

export interface UpdateGalleryPayload {
  title: string
  gallery_category_id: number
  location?: string
  event_date?: string
  cover_image?: File
}

export interface GalleryImage {
  id: number
  url: string
  thumb_url: string
  alt?: string
}

