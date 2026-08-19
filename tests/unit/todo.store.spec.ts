import { beforeEach, describe, expect, it, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useTodoStore } from '../../stores/todo'

const list = vi.fn()
const create = vi.fn()
const update = vi.fn()
const remove = vi.fn()

vi.mock('~/composables/useApi', () => ({
  useApi: () => ({
    todoApi: { list, create, update, remove, getById: vi.fn() },
  }),
}))

describe('todo store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    list.mockReset()
    create.mockReset()
    update.mockReset()
    remove.mockReset()
  })

  it('giữ filter khi đổi trang', async () => {
    list.mockResolvedValue({
      todos: [],
      pagination: { page: 2, limit: 10, total: 20, totalPages: 2, hasNextPage: false, hasPrevPage: true },
      filters: {},
    })
    const store = useTodoStore()
    store.query.search = 'nest'
    store.query.isDone = false
    await store.setPage(2)
    expect(list).toHaveBeenCalledWith(expect.objectContaining({ page: 2, search: 'nest', isDone: false }))
  })

  it('toggle rollback khi lỗi', async () => {
    const store = useTodoStore()
    store.items = [{
      id: 1,
      title: 'A',
      isDone: false,
      ownerId: 1,
      createdAt: '',
      updatedAt: '',
    }]
    update.mockRejectedValue(new Error('fail'))
    await expect(store.toggleTodo(1, true)).rejects.toThrow()
    expect(store.items[0]?.isDone).toBe(false)
  })

  it('reset xóa items và query', () => {
    const store = useTodoStore()
    store.items = [{ id: 1, title: 'A', isDone: false, ownerId: 1, createdAt: '', updatedAt: '' }]
    store.query.search = 'x'
    store.reset()
    expect(store.items).toEqual([])
    expect(store.query.search).toBeUndefined()
  })
})
