/**
 * Bảo vệ route cần đăng nhập.
 * Await restore session; thiếu token hoặc /auth/me thất bại thì về /login.
 */
export default defineNuxtRouteMiddleware(async (to) => {
  const auth = useAuthStore()

  try {
    await auth.restoreSession()
  } catch {
    return navigateTo({
      path: '/login',
      query: { redirect: to.fullPath },
    })
  }

  if (!auth.token || !auth.user) {
    return navigateTo({
      path: '/login',
      query: { redirect: to.fullPath },
    })
  }
})
