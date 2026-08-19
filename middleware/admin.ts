/**
 * Chỉ admin được vào /users.
 * Chạy sau auth; role !== admin thì về dashboard.
 * Middleware chỉ cải thiện UX — backend vẫn kiểm tra quyền.
 */
export default defineNuxtRouteMiddleware(async () => {
  const auth = useAuthStore()

  try {
    await auth.restoreSession()
  } catch {
    return navigateTo('/login')
  }

  if (auth.user?.role !== 'admin') {
    return navigateTo('/dashboard')
  }
})
