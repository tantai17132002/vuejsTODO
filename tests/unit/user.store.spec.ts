import { beforeEach, describe, expect, it, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useUserStore } from '../../stores/user'

const list = vi.fn()
const getById = vi.fn()
const updateRole = vi.fn()
const fetchMe = vi.fn()

vi.mock('~/composables/useApi', () => ({
  useApi: () => ({
    userApi: { list, getById, updateRole },
  }),
}))

vi.mock('~/stores/auth', () => ({
  useAuthStore: () => ({
    user: { id: 1, username: 'admin', role: 'admin' },
    fetchMe,
  }),
}))

describe('user store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    list.mockReset()
    getById.mockReset()
    updateRole.mockReset()
    fetchMe.mockReset()
  })

  it('fetchUsers lưu list và pagination', async () => {
    list.mockResolvedValue({
      users: [{ id: 1, username: 'a', email: 'a@a.a', role: 'user', createdAt: '', updatedAt: '' }],
      pagination: { page: 1, limit: 10, total: 1, totalPages: 1, hasNextPage: false, hasPrevPage: false },
    })
    const store = useUserStore()
    await store.fetchUsers({ page: 1, limit: 10 })
    expect(store.users).toHaveLength(1)
    expect(store.pagination.total).toBe(1)
  })

  it('updateRole 409 không nuốt lỗi', async () => {
    updateRole.mockRejectedValue({ response: { status: 409, data: { statusCode: 409, message: 'last admin' } } })
    const store = useUserStore()
    store.selectedUser = { id: 2, username: 'b', email: 'b@b.b', role: 'admin', createdAt: '', updatedAt: '' }
    await expect(store.updateRole(2, 'user')).rejects.toBeTruthy()
    expect(store.error?.statusCode).toBe(409)
  })
})
