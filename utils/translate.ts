/**
 * Dịch key i18n mà không gọi useI18n().
 * useI18n() chỉ được dùng trong setup; store/interceptor gọi sẽ ném
 * "Must be called at the top of a `setup` function".
 */
export function translate(key: string): string {
  const i18n = useNuxtApp().$i18n as { t: (path: string) => string }
  return i18n.t(key)
}
