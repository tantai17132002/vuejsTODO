import { getTokenCookieOptions } from '~/utils/token'

/**
 * Cookie token với options cố định.
 * Không đổi maxAge theo từng lần gọi — useCookie Nuxt dùng options lần đầu.
 */
export function useAuthTokenCookie() {
  return useCookie<string | null>('token', {
    default: () => null,
    ...getTokenCookieOptions(),
  })
}
