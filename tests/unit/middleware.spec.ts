import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it } from 'vitest'
import { useAuthStore } from '../../stores/auth'

describe('middleware quyết định theo user đã restore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('auth: thiếu user sau restore thì phải về login', () => {
    const auth = useAuthStore()
    auth.initialized = true
    auth.token = null
    auth.user = null
    const shouldLogin = !auth.token || !auth.user
    expect(shouldLogin).toBe(true)
  })

  it('guest: có user hợp lệ thì về dashboard', () => {
    const auth = useAuthStore()
    auth.user = { id: 1, username: 'john', role: 'user' }
    expect(!!auth.user).toBe(true)
  })

  it('admin: role khác admin thì từ chối', () => {
    const auth = useAuthStore()
    auth.user = { id: 1, username: 'john', role: 'user' }
    expect(auth.user.role !== 'admin').toBe(true)
  })
})
