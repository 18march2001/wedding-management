// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  timestamp: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  per_page: number;
  current_page: number;
  last_page: number;
  from: number;
  to: number;
}

export interface ApiError {
  success: false;
  message: string;
  errors?: Record<string, string[]>;
  code?: string | number;
  timestamp: string;
}

export interface PaginationParams {
  page: number;
  per_page: number;
  search?: string;
  sort?: string;
  order?: 'asc' | 'desc';
}
