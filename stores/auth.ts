import { defineStore } from 'pinia'
import type { CurrentUser } from '~/types/auth'
import { useAuthTokenCookie } from '~/utils/authCookie'
import { parseApiError } from '~/utils/apiError'
import { useApi } from '~/composables/useApi'
import { useTodoStore } from '~/stores/todo'
import { useUserStore } from '~/stores/user'

/** Khóa restore để middleware và plugin không gọi /auth/me song song. */
let restorePromise: Promise<void> | null = null

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null as CurrentUser | null,
    token: null as string | null,
    initializing: false,
    initialized: false,
  }),

  getters: {
    /** Chỉ nghĩa là có token; quyết định route phải chờ restore. */
    isLoggedIn: (state) => !!state.token,
    isAdmin: (state) => state.user?.role === 'admin',
  },

  actions: {
    /**
     * Lưu access_token vào cookie và default header Axios.
     * Header gắn ngay để GET /auth/me không bị 401 vì thiếu Bearer.
     */
    setToken(token: string) {
      this.token = token
      this.syncAxiosAuthHeader(token)
      const cookie = useAuthTokenCookie()
      cookie.value = token
    },

    syncAxiosAuthHeader(token: string | null) {
      try {
        const { $axios } = useNuxtApp()
        if (token) {
          $axios.defaults.headers.common.Authorization = `Bearer ${token}`
        } else {
          delete $axios.defaults.headers.common.Authorization
        }
      } catch {
        // Store test không có Nuxt app.
      }
    },

    loadTokenFromCookie() {
      const cookie = useAuthTokenCookie()
      if (cookie.value) {
        this.token = cookie.value
        this.syncAxiosAuthHeader(cookie.value)
      }
    },

    /**
     * Khôi phục phiên từ cookie rồi lấy user hiện tại.
     * Phải await trước khi middleware quyết định điều hướng.
     */
    async restoreSession() {
      if (this.initialized) {
        return
      }
      if (restorePromise) {
        await restorePromise
        return
      }

      restorePromise = this.runRestore()
      try {
        await restorePromise
      } finally {
        restorePromise = null
      }
    },

    async runRestore() {
      this.initializing = true
      try {
        this.loadTokenFromCookie()
        if (this.token && !this.user) {
          await this.fetchMe()
        }
      } finally {
        this.initialized = true
        this.initializing = false
      }
    },

    /**
     * GET /auth/me. Chỉ coi 401 là phiên hết hạn; lỗi khác giữ nguyên để không báo sai.
     */
    async fetchMe() {
      const tokenUsed = this.token
      try {
        const { authApi } = useApi()
        this.user = await authApi.me(tokenUsed)
        return this.user
      } catch (error: unknown) {
        if (this.token !== tokenUsed) {
          throw error
        }
        const parsed = parseApiError(error)
        if (parsed.statusCode === 401) {
          this.clearAuth()
          throw new Error('SESSION_INVALID')
        }
        throw error
      }
    },

    /**
     * Logout client-side: xóa cookie, reset auth/todo/admin, không gọi backend.
     */
    logout() {
      this.clearAuth()
      const todoStore = useTodoStore()
      const userStore = useUserStore()
      todoStore.reset()
      userStore.reset()
    },

    clearAuth() {
      const cookie = useAuthTokenCookie()
      cookie.value = null
      this.token = null
      this.user = null
      this.syncAxiosAuthHeader(null)
    },
  },
})
