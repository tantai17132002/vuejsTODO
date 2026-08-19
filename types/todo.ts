import type { Pagination } from './api'

export interface Todo {
  id: number
  title: string
  description?: string
  isDone: boolean
  ownerId: number
  createdAt: string
  updatedAt: string
}

export interface TodoQuery {
  page?: number
  limit?: number
  isDone?: boolean
  search?: string
  dateFrom?: string
  dateTo?: string
  sortBy?: 'id' | 'title' | 'isDone' | 'createdAt' | 'updatedAt'
  sortOrder?: 'asc' | 'desc'
}

export interface TodoFilters {
  isDone?: string | null
  search?: string | null
  dateFrom?: string | null
  dateTo?: string | null
  sortBy?: string | null
  sortOrder?: string | null
}

export interface TodoListResponse {
  todos: Todo[]
  pagination: Pagination
  filters: TodoFilters
}

export interface CreateTodoPayload {
  title: string
  description?: string
  isDone?: boolean
}

/** PATCH /todos/:id chỉ nhận các field này; không gửi id/ownerId/timestamps. */
export interface UpdateTodoPayload {
  title?: string
  description?: string
  isDone?: boolean
}

export interface DeleteTodoResponse {
  deleted: boolean
}
