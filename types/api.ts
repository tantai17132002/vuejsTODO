export interface Pagination {
  page: number
  limit: number
  total: number
  totalPages: number
  hasNextPage: boolean
  hasPrevPage: boolean
}

export interface ApiErrorDetail {
  field: string
  message: string
}

/** Hình dạng lỗi backend theo project-spec.md. */
export interface ApiError {
  statusCode: number
  message: string | string[]
  error?: string
  timestamp: string
  path: string
  details?: ApiErrorDetail[]
  requestId?: string
}

export const EMPTY_PAGINATION: Pagination = {
  page: 1,
  limit: 10,
  total: 0,
  totalPages: 0,
  hasNextPage: false,
  hasPrevPage: false,
}
