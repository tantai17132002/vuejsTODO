import type { AxiosError } from 'axios'
import type { ApiError, ApiErrorDetail } from '~/types/api'

export interface ParsedApiError {
  statusCode?: number
  message: string
  details: ApiErrorDetail[]
  fieldErrors: Record<string, string>
  isNetworkError: boolean
}

/**
 * Chuẩn hóa lỗi Axios theo contract: ưu tiên statusCode và details.
 * Không parse substring message tiếng Anh để quyết định loại lỗi.
 */
export function parseApiError(error: unknown): ParsedApiError {
  const axiosError = error as AxiosError<ApiError>
  const isNetworkError = !axiosError.response && !!axiosError.request
  const data = axiosError.response?.data
  const statusCode = axiosError.response?.status ?? data?.statusCode

  const details = Array.isArray(data?.details) ? data.details : []
  const fieldErrors: Record<string, string> = {}
  for (const detail of details) {
    if (detail?.field && detail?.message) {
      fieldErrors[detail.field] = detail.message
    }
  }

  let message = ''
  if (typeof data?.message === 'string') {
    message = data.message
  } else if (Array.isArray(data?.message)) {
    message = data.message.join(', ')
  }

  return {
    statusCode,
    message,
    details,
    fieldErrors,
    isNetworkError,
  }
}

/** Key i18n theo HTTP status; không dựa vào nguyên văn message. */
export function errorI18nKey(parsed: ParsedApiError): string {
  if (parsed.isNetworkError || !parsed.statusCode) {
    return 'errors.network'
  }

  switch (parsed.statusCode) {
    case 400:
      return 'errors.validation'
    case 401:
      return 'errors.unauthorized'
    case 403:
      return 'errors.forbidden'
    case 404:
      return 'errors.notFound'
    case 409:
      return 'errors.conflict'
    case 500:
      return 'errors.server'
    default:
      return 'common.error'
  }
}
