import { ACCEPTED_FORMATS, MAX_FILE_SIZE } from './constants'

export class ValidationError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'ValidationError'
  }
}

// File Validation
export const validateFile = (file: File, maxSize: number = MAX_FILE_SIZE): void => {
  if (!file) {
    throw new ValidationError('No file provided')
  }

  if (file.size > maxSize) {
    throw new ValidationError(`File size exceeds maximum limit of ${maxSize / 1024 / 1024}MB`)
  }

  const fileExtension = file.name.split('.').pop()?.toLowerCase()
  if (!fileExtension || !ACCEPTED_FORMATS.includes(fileExtension)) {
    throw new ValidationError(
      `Invalid file format. Accepted formats: ${ACCEPTED_FORMATS.join(', ')}`
    )
  }
}

export const validateMultipleFiles = (
  files: File[],
  maxSize: number = MAX_FILE_SIZE
): ValidationError[] => {
  const errors: ValidationError[] = []

  files.forEach((file) => {
    try {
      validateFile(file, maxSize)
    } catch (error) {
      if (error instanceof ValidationError) {
        errors.push(error)
      }
    }
  })

  return errors
}

// String Validation
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export const validateUrl = (url: string): boolean => {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

export const validateMinLength = (value: string, minLength: number): boolean => {
  return value.trim().length >= minLength
}

export const validateMaxLength = (value: string, maxLength: number): boolean => {
  return value.length <= maxLength
}

// Number Validation
export const validateRange = (
  value: number,
  min: number,
  max: number
): boolean => {
  return value >= min && value <= max
}

export const validateRating = (rating: number): boolean => {
  return validateRange(rating, 1, 5)
}

// Form Validation Helper
export const getFormErrors = (errors: Record<string, string[]>): Record<string, string> => {
  const formattedErrors: Record<string, string> = {}

  Object.entries(errors).forEach(([key, messages]) => {
    formattedErrors[key] = messages[0] || 'Invalid value'
  })

  return formattedErrors
}

// Required Field Validation
export const validateRequired = (value: any): boolean => {
  if (value === null || value === undefined) {
    return false
  }

  if (typeof value === 'string') {
    return value.trim().length > 0
  }

  return true
}
