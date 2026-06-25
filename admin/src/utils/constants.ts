// File Upload Constants
export const MAX_FILE_SIZE = Number(import.meta.env.VITE_MAX_FILE_SIZE || 5242880) // 5MB in bytes
export const ACCEPTED_FORMATS = (import.meta.env.VITE_ACCEPTED_FORMATS || 'jpg,jpeg,png,webp,gif,mp4,webm').split(',')
export const ACCEPTED_IMAGE_FORMATS = ['jpg', 'jpeg', 'png', 'webp', 'gif']
export const ACCEPTED_VIDEO_FORMATS = ['mp4', 'webm']

// Pagination
export const DEFAULT_PAGE_SIZE = 10
export const PAGE_SIZE_OPTIONS = [10, 20, 50, 100]

// User Roles
export const USER_ROLES = [
  { value: 'admin', label: 'Administrator' },
  { value: 'editor', label: 'Editor' },
  { value: 'viewer', label: 'Viewer' },
] as const

// Visibility Options
export const VISIBILITY_OPTIONS = [
  { value: 'public', label: 'Public' },
  { value: 'private', label: 'Private' },
  { value: 'draft', label: 'Draft' },
] as const

// Rating Options
export const RATING_OPTIONS = [
  { value: 1, label: '1 Star' },
  { value: 2, label: '2 Stars' },
  { value: 3, label: '3 Stars' },
  { value: 4, label: '4 Stars' },
  { value: 5, label: '5 Stars' },
] as const

// Sort Options
export const SORT_OPTIONS = [
  { value: 'name', label: 'Name' },
  { value: 'title', label: 'Title' },
  { value: 'created_at', label: 'Created Date' },
  { value: 'updated_at', label: 'Updated Date' },
  { value: 'order', label: 'Order' },
] as const

// Toast Notification Defaults
export const TOAST_DURATION = 5000 // 5 seconds
export const TOAST_DURATION_ERROR = 7000 // 7 seconds

// Date/Time Formats
export const DATE_FORMAT = 'MMM DD, YYYY'
export const TIME_FORMAT = 'HH:mm'
export const DATETIME_FORMAT = 'MMM DD, YYYY HH:mm'

// API Endpoints
export const API_ENDPOINTS = {
  // Dashboard
  DASHBOARD: '/dashboard',

  // Gallery Categories
  GALLERY_CATEGORIES: '/gallery-categories',
  GALLERY_CATEGORIES_FEATURED: '/gallery-categories/featured',

  // Galleries
  GALLERIES: '/galleries',
  GALLERIES_FEATURED: '/galleries/featured',

  // Gallery Photos
  GALLERY_PHOTOS: '/gallery-photos',
  GALLERY_PHOTOS_BULK: '/gallery-photos/bulk',
  GALLERY_PHOTOS_REORDER: '/gallery-photos/reorder',

  // Videos
  VIDEOS: '/videos',
  VIDEOS_FEATURED: '/videos/featured',

  // Testimonials
  TESTIMONIALS: '/testimonials',
  TESTIMONIALS_FEATURED: '/testimonials/featured',

  // Users
  USERS: '/users',
  USERS_PERMISSIONS: '/users/permissions',

  // Settings
  SETTINGS: '/settings',
  SETTINGS_GENERAL: '/settings/general',
  SETTINGS_PROFILE: '/settings/profile',
  SETTINGS_SOCIAL: '/settings/social',
  SETTINGS_FOOTER: '/settings/footer',
  SETTINGS_SECURITY: '/settings/security',
} as const

// Error Messages
export const ERROR_MESSAGES = {
  FILE_TOO_LARGE: `File size must not exceed ${MAX_FILE_SIZE / 1024 / 1024}MB`,
  INVALID_FILE_TYPE: `Invalid file type. Accepted formats: ${ACCEPTED_FORMATS.join(', ')}`,
  UPLOAD_FAILED: 'File upload failed. Please try again.',
  NETWORK_ERROR: 'Network error. Please check your connection.',
  SERVER_ERROR: 'Server error. Please try again later.',
  VALIDATION_ERROR: 'Please check the form for errors.',
  UNAUTHORIZED: 'You are not authorized to perform this action.',
  NOT_FOUND: 'The requested resource was not found.',
} as const

// Success Messages
export const SUCCESS_MESSAGES = {
  CREATED: 'Item created successfully',
  UPDATED: 'Item updated successfully',
  DELETED: 'Item deleted successfully',
  UPLOADED: 'File uploaded successfully',
  SAVED: 'Changes saved successfully',
} as const
