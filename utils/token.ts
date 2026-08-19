/**
 * Đọc exp từ JWT chỉ để đồng bộ maxAge cookie với thời hạn token.
 * Không verify chữ ký — backend mới là nơi xác thực.
 */
export function getTokenMaxAgeSeconds(token: string, fallback = 60 * 60 * 24): number {
  try {
    const payloadPart = token.split('.')[1]
    if (!payloadPart) {
      return fallback
    }

    const normalized = payloadPart.replace(/-/g, '+').replace(/_/g, '/')
    const payload = JSON.parse(atob(normalized)) as { exp?: number }
    if (typeof payload.exp !== 'number') {
      return fallback
    }

    const seconds = payload.exp - Math.floor(Date.now() / 1000)
    return seconds > 0 ? seconds : 0
  } catch {
    return fallback
  }
}

/** Cookie token: sameSite lax, path /, secure trên HTTPS. */
export function getTokenCookieOptions(token?: string) {
  const isSecure = import.meta.client
    ? window.location.protocol === 'https:'
    : process.env.NODE_ENV === 'production'

  return {
    maxAge: token ? getTokenMaxAgeSeconds(token) : 60 * 60 * 24,
    sameSite: 'lax' as const,
    path: '/',
    secure: isSecure,
  }
}

/**
 * Chỉ chấp nhận path nội bộ để tránh open redirect sau login.
 */
export function safeInternalPath(value: unknown, fallback = '/dashboard'): string {
  if (typeof value !== 'string') {
    return fallback
  }

  if (!value.startsWith('/') || value.startsWith('//')) {
    return fallback
  }

  return value
}
