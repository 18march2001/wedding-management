import { DATE_FORMAT, TIME_FORMAT, DATETIME_FORMAT } from './constants'

// Date Formatting
export const formatDate = (date: string | Date, format: string = DATE_FORMAT): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date

  if (isNaN(dateObj.getTime())) {
    return 'Invalid date'
  }

  const day = dateObj.getDate().toString().padStart(2, '0')
  const month = (dateObj.getMonth() + 1).toString().padStart(2, '0')
  const year = dateObj.getFullYear()
  const hours = dateObj.getHours().toString().padStart(2, '0')
  const minutes = dateObj.getMinutes().toString().padStart(2, '0')

  const monthNames = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ]

  const monthShort = monthNames[dateObj.getMonth()]

  let result = format
  result = result.replace('YYYY', year.toString())
  result = result.replace('MM', month)
  result = result.replace('DD', day)
  result = result.replace('MMM', monthShort)
  result = result.replace('HH', hours)
  result = result.replace('mm', minutes)

  return result
}

export const formatTime = (date: string | Date): string => {
  return formatDate(date, TIME_FORMAT)
}

export const formatDateTime = (date: string | Date): string => {
  return formatDate(date, DATETIME_FORMAT)
}

export const formatRelativeTime = (date: string | Date): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  const now = new Date()
  const seconds = Math.floor((now.getTime() - dateObj.getTime()) / 1000)

  if (seconds < 60) return 'Just now'
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`
  if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`

  return formatDate(date)
}

// File Size Formatting
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes'

  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i]
}

// String Formatting
export const capitalize = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

export const slugify = (str: string): string => {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
}

export const truncate = (str: string, length: number, suffix: string = '...'): string => {
  if (str.length <= length) return str
  return str.slice(0, length) + suffix
}

// Number Formatting
export const formatNumber = (num: number, decimals: number = 0): string => {
  return num.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })
}

export const formatCurrency = (amount: number, currency: string = 'USD'): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
  }).format(amount)
}

// Rating Formatting
export const formatRating = (rating: number): string => {
  return `${rating.toFixed(1)}/5.0`
}

export const getStarArray = (rating: number): boolean[] => {
  const stars: boolean[] = []
  for (let i = 1; i <= 5; i++) {
    stars.push(i <= Math.floor(rating))
  }
  return stars
}

// URL/Path Formatting
export const normalizeUrl = (url: string): string => {
  if (!url) return ''
  if (url.startsWith('http://') || url.startsWith('https://')) return url
  return 'https://' + url
}

export const joinPaths = (...paths: string[]): string => {
  return paths
    .filter((p) => p)
    .join('/')
    .replace(/\/+/g, '/')
}
