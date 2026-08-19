import { defineStore } from 'pinia'
import type { ApiError } from '~/types/api'
import { EMPTY_PAGINATION } from '~/types/api'
import type { CreateTodoPayload, Todo, TodoQuery, UpdateTodoPayload } from '~/types/todo'
import { parseApiError } from '~/utils/apiError'
import { DEFAULT_TODO_QUERY, mergeTodoQuery } from '~/utils/todoQuery'
import { useApi } from '~/composables/useApi'

/** Số thứ tự request để bỏ qua response cũ khi search/filter nhanh. */
let fetchRequestId = 0

export const useTodoStore = defineStore('todo', {
  state: () => ({
    items: [] as Todo[],
    query: { ...DEFAULT_TODO_QUERY } as TodoQuery,
    pagination: { ...EMPTY_PAGINATION },
    filters: {} as Record<string, unknown>,
    loading: false,
    mutating: false,
    error: null as ApiError | null,
  }),

  getters: {
    todos: (state) => state.items,
  },

  actions: {
    /**
     * Tải danh sách theo query hiện tại. Giữ filter khi đổi trang.
     * Response lệch thứ tự bị bỏ qua bằng request identity.
     */
    async fetchTodos(queryPatch?: TodoQuery) {
      if (queryPatch) {
        this.query = mergeTodoQuery(this.query, queryPatch)
      }

      const requestId = ++fetchRequestId
      this.loading = true
      this.error = null

      try {
        const { todoApi } = useApi()
        const response = await todoApi.list(this.query)
        if (requestId !== fetchRequestId) {
          return
        }

        this.items = response.todos || []
        this.pagination = response.pagination || { ...EMPTY_PAGINATION }
        this.filters = (response.filters || {}) as Record<string, unknown>
      } catch (error: unknown) {
        if (requestId !== fetchRequestId) {
          return
        }
        const parsed = parseApiError(error)
        this.error = {
          statusCode: parsed.statusCode || 500,
          message: parsed.message,
          timestamp: new Date().toISOString(),
          path: '/todos',
          details: parsed.details,
        }
        throw error
      } finally {
        if (requestId === fetchRequestId) {
          this.loading = false
        }
      }
    },

    async createTodo(payload: CreateTodoPayload) {
      this.mutating = true
      this.error = null
      try {
        const { todoApi } = useApi()
        const created = await todoApi.create({
          title: payload.title,
          description: payload.description,
          isDone: payload.isDone,
        })
        await this.fetchTodos()
        return created
      } finally {
        this.mutating = false
      }
    },

    async updateTodo(id: number, payload: UpdateTodoPayload) {
      this.mutating = true
      this.error = null
      try {
        const { todoApi } = useApi()
        const updated = await todoApi.update(id, payload)
        const index = this.items.findIndex((todo) => todo.id === id)
        if (index !== -1) {
          this.items[index] = updated
        }
        return updated
      } finally {
        this.mutating = false
      }
    },

    /**
     * PATCH { isDone }. Optimistic update rồi rollback nếu lỗi.
     */
    async toggleTodo(id: number, isDone: boolean) {
      const todo = this.items.find((item) => item.id === id)
      if (!todo) {
        return
      }

      const previous = todo.isDone
      todo.isDone = isDone

      try {
        const { todoApi } = useApi()
        const updated = await todoApi.update(id, { isDone })
        Object.assign(todo, updated)
      } catch (error) {
        todo.isDone = previous
        throw error
      }
    },

    async deleteTodo(id: number) {
      this.mutating = true
      this.error = null
      try {
        const { todoApi } = useApi()
        await todoApi.remove(id)
        this.items = this.items.filter((todo) => todo.id !== id)

        if (this.items.length === 0 && (this.query.page || 1) > 1) {
          await this.setPage((this.query.page || 1) - 1)
        } else {
          await this.fetchTodos()
        }
      } finally {
        this.mutating = false
      }
    },

    async setPage(page: number) {
      await this.fetchTodos({ page })
    },

    async setFilters(filters: TodoQuery) {
      await this.fetchTodos({ ...filters, page: 1 })
    },

    /**
     * Xóa state để không lộ todo phiên trước sau logout.
     */
    reset() {
      fetchRequestId += 1
      this.items = []
      this.query = { ...DEFAULT_TODO_QUERY }
      this.pagination = { ...EMPTY_PAGINATION }
      this.filters = {}
      this.loading = false
      this.mutating = false
      this.error = null
    },
  },
})
