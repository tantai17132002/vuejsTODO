import { defineStore } from 'pinia'
import type { ApiError } from '~/types/api'
import { EMPTY_PAGINATION } from '~/types/api'
import type { User, UserQuery } from '~/types/user'
import type { UserRole } from '~/types/auth'
import { parseApiError } from '~/utils/apiError'
import { useApi } from '~/composables/useApi'
import { useAuthStore } from '~/stores/auth'

export const useUserStore = defineStore('user', {
  state: () => ({
    users: [] as User[],
    selectedUser: null as User | null,
    pagination: { ...EMPTY_PAGINATION },
    query: { page: 1, limit: 10 } as UserQuery,
    loading: false,
    mutating: false,
    error: null as ApiError | null,
  }),

  actions: {
    async fetchUsers(query: UserQuery = {}) {
      this.query = { ...this.query, ...query }
      this.loading = true
      this.error = null

      try {
        const { userApi } = useApi()
        const response = await userApi.list(this.query)
        this.users = response.users || []
        this.pagination = response.pagination || { ...EMPTY_PAGINATION }
      } catch (error: unknown) {
        this.error = toStoreError(error, '/users')
        throw error
      } finally {
        this.loading = false
      }
    },

    async fetchUser(id: number) {
      this.loading = true
      this.error = null
      try {
        const { userApi } = useApi()
        this.selectedUser = await userApi.getById(id)
        return this.selectedUser
      } catch (error: unknown) {
        this.error = toStoreError(error, `/users/${id}`)
        throw error
      } finally {
        this.loading = false
      }
    },

    /**
     * PATCH /users/:id/role. Không khẳng định thành công trước response.
     * Nếu đổi role của chính mình thì refresh /auth/me.
     */
    async updateRole(id: number, role: UserRole) {
      this.mutating = true
      this.error = null
      try {
        const { userApi } = useApi()
        const updated = await userApi.updateRole(id, role)

        const index = this.users.findIndex((user) => user.id === id)
        if (index !== -1) {
          this.users[index] = updated
        }
        if (this.selectedUser?.id === id) {
          this.selectedUser = updated
        }

        const auth = useAuthStore()
        if (auth.user?.id === id) {
          await auth.fetchMe()
        }

        return updated
      } catch (error: unknown) {
        this.error = toStoreError(error, `/users/${id}/role`)
        throw error
      } finally {
        this.mutating = false
      }
    },

    reset() {
      this.users = []
      this.selectedUser = null
      this.pagination = { ...EMPTY_PAGINATION }
      this.query = { page: 1, limit: 10 }
      this.loading = false
      this.mutating = false
      this.error = null
    },
  },
})

function toStoreError(error: unknown, path: string): ApiError {
  const parsed = parseApiError(error)
  return {
    statusCode: parsed.statusCode || 500,
    message: parsed.message,
    timestamp: new Date().toISOString(),
    path,
    details: parsed.details,
  }
}
