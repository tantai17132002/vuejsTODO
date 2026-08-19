import { describe, expect, it } from 'vitest'
import { errorI18nKey, parseApiError } from '../../utils/apiError'

describe('parseApiError', () => {
  it('ưu tiên statusCode và details, không cần message tiếng Anh', () => {
    const parsed = parseApiError({
      response: {
        status: 400,
        data: {
          statusCode: 400,
          message: 'Validation failed',
          details: [{ field: 'title', message: 'title should not be empty' }],
        },
      },
    })

    expect(parsed.statusCode).toBe(400)
    expect(parsed.fieldErrors.title).toBe('title should not be empty')
    expect(errorI18nKey(parsed)).toBe('errors.validation')
  })

  it('map 401/403/409 theo status chứ không theo substring', () => {
    expect(errorI18nKey(parseApiError({ response: { status: 401, data: { message: 'nope' } } }))).toBe('errors.unauthorized')
    expect(errorI18nKey(parseApiError({ response: { status: 403, data: { message: 'nope' } } }))).toBe('errors.forbidden')
    expect(errorI18nKey(parseApiError({ response: { status: 409, data: { message: 'nope' } } }))).toBe('errors.conflict')
  })

  it('network error không có response', () => {
    const parsed = parseApiError({ request: {}, message: 'Network Error' })
    expect(parsed.isNetworkError).toBe(true)
    expect(errorI18nKey(parsed)).toBe('errors.network')
  })
})
