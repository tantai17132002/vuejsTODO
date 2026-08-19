import { beforeEach, describe, expect, it, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useAuthStore } from '../../stores/auth'

const me = vi.fn()

const cookie = { value: null as string | null }

vi.mock('~/composables/useApi', () => ({
  useApi: () => ({
    authApi: { me },
  }),
}))

vi.mock('~/utils/authCookie', () => ({
  useAuthTokenCookie: () => cookie,
}))

vi.mock('~/stores/todo', () => ({
  useTodoStore: () => ({ reset: vi.fn() }),
}))

vi.mock('~/stores/user', () => ({
  useUserStore: () => ({ reset: vi.fn() }),
}))

describe('auth store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    me.mockReset()
  })

  it('isLoggedIn chỉ dựa trên token', () => {
    const auth = useAuthStore()
    expect(auth.isLoggedIn).toBe(false)
    auth.token = 'jwt'
    expect(auth.isLoggedIn).toBe(true)
    expect(auth.isAdmin).toBe(false)
  })

  it('fetchMe gán CurrentUser', async () => {
    me.mockResolvedValue({ id: 1, username: 'john', role: 'user' })
    const auth = useAuthStore()
    auth.token = 'jwt'
    await auth.fetchMe()
    expect(auth.user?.username).toBe('john')
    expect(auth.isAdmin).toBe(false)
  })

  it('fetchMe thất bại thì clearAuth', async () => {
    me.mockRejectedValue({ response: { status: 401, data: { statusCode: 401, message: 'Unauthorized' } } })
    const auth = useAuthStore()
    auth.token = 'jwt'
    auth.user = { id: 1, username: 'john', role: 'user' }
    await expect(auth.fetchMe()).rejects.toThrow('SESSION_INVALID')
    expect(auth.token).toBeNull()
    expect(auth.user).toBeNull()
  })

  it('fetchMe 401 không xóa token mới hơn vừa set trong lúc request cũ còn chạy', async () => {
    me.mockImplementation(async () => {
      const auth = useAuthStore()
      auth.token = 'new-jwt'
      throw { response: { status: 401, data: { statusCode: 401, message: 'Unauthorized' } } }
    })
    const auth = useAuthStore()
    auth.token = 'old-jwt'
    await expect(auth.fetchMe()).rejects.toMatchObject({ response: { status: 401 } })
    expect(auth.token).toBe('new-jwt')
  })

  it('logout reset token và user', () => {
    const auth = useAuthStore()
    auth.token = 'jwt'
    auth.user = { id: 1, username: 'john', role: 'admin' }
    auth.logout()
    expect(auth.token).toBeNull()
    expect(auth.user).toBeNull()
  })
})
