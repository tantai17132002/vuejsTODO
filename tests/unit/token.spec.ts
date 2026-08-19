import { describe, expect, it } from 'vitest'
import { getTokenMaxAgeSeconds, safeInternalPath } from '../../utils/token'

describe('token utils', () => {
  it('đọc exp từ JWT để tính maxAge', () => {
    const exp = Math.floor(Date.now() / 1000) + 120
    const payload = btoa(JSON.stringify({ exp })).replace(/\+/g, '-').replace(/\//g, '_')
    const token = `header.${payload}.sig`
    const maxAge = getTokenMaxAgeSeconds(token)
    expect(maxAge).toBeGreaterThan(100)
    expect(maxAge).toBeLessThanOrEqual(120)
  })

  it('fallback khi token không decode được', () => {
    expect(getTokenMaxAgeSeconds('not-a-jwt', 99)).toBe(99)
  })

  it('chặn open redirect', () => {
    expect(safeInternalPath('/dashboard')).toBe('/dashboard')
    expect(safeInternalPath('https://evil.com')).toBe('/dashboard')
    expect(safeInternalPath('//evil.com')).toBe('/dashboard')
    expect(safeInternalPath(123)).toBe('/dashboard')
  })
})
