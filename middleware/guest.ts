/**
 * Chặn user đã đăng nhập khỏi /login và /register.
 * Phải chờ auth init để tránh nhấp nháy và race sau reload.
 */
export default defineNuxtRouteMiddleware(async () => {
  const auth = useAuthStore()

  try {
    await auth.restoreSession()
  } catch {
    return
  }

  if (auth.user) {
    return navigateTo('/dashboard')
  }
})
