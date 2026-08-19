/**
 * Khôi phục phiên ở cấp ứng dụng, không chỉ middleware dashboard.
 * Navbar/public route nhận đúng auth state sau reload.
 */
export default defineNuxtPlugin({
  name: 'auth-session',
  dependsOn: ['axios'],
  async setup() {
    const auth = useAuthStore()
    try {
      await auth.restoreSession()
    } catch {
      // Token không hợp lệ đã được clear trong fetchMe.
    }
  },
})
