import type { LocationQuery } from 'vue-router'
import type { TodoQuery } from '~/types/todo'

const SORT_FIELDS: Array<NonNullable<TodoQuery['sortBy']>> = [
  'id',
  'title',
  'isDone',
  'createdAt',
  'updatedAt',
]

export const DEFAULT_TODO_QUERY: Required<Pick<TodoQuery, 'page' | 'limit' | 'sortBy' | 'sortOrder'>> & TodoQuery = {
  page: 1,
  limit: 10,
  sortBy: 'createdAt',
  sortOrder: 'desc',
}

/**
 * Gộp query mới vào query hiện tại. Đổi filter/search thì reset page về 1.
 */
export function mergeTodoQuery(current: TodoQuery, patch: TodoQuery): TodoQuery {
  const next: TodoQuery = { ...current, ...patch }
  const resetsPage = patch.search !== undefined
    || patch.isDone !== undefined
    || patch.dateFrom !== undefined
    || patch.dateTo !== undefined
    || patch.sortBy !== undefined
    || patch.sortOrder !== undefined
    || patch.limit !== undefined

  if (resetsPage && patch.page === undefined) {
    next.page = 1
  }

  return next
}

/** Đồng bộ query store với URL để reload/share giữ trạng thái. */
export function todoQueryToRoute(query: TodoQuery): Record<string, string> {
  const params: Record<string, string> = {}

  if (query.page && query.page > 1) params.page = String(query.page)
  if (query.limit && query.limit !== 10) params.limit = String(query.limit)
  if (query.isDone !== undefined) params.isDone = String(query.isDone)
  if (query.search) params.search = query.search
  if (query.dateFrom) params.dateFrom = query.dateFrom
  if (query.dateTo) params.dateTo = query.dateTo
  if (query.sortBy && query.sortBy !== 'createdAt') params.sortBy = query.sortBy
  if (query.sortOrder && query.sortOrder !== 'desc') params.sortOrder = query.sortOrder

  return params
}

export function todoQueryFromRoute(routeQuery: LocationQuery): TodoQuery {
  const query: TodoQuery = { ...DEFAULT_TODO_QUERY }

  const page = Number(routeQuery.page)
  if (Number.isInteger(page) && page >= 1) {
    query.page = page
  }

  const limit = Number(routeQuery.limit)
  if (Number.isInteger(limit) && limit >= 1 && limit <= 100) {
    query.limit = limit
  }

  if (routeQuery.isDone === 'true') query.isDone = true
  if (routeQuery.isDone === 'false') query.isDone = false

  if (typeof routeQuery.search === 'string' && routeQuery.search.trim()) {
    query.search = routeQuery.search.trim()
  }

  if (typeof routeQuery.dateFrom === 'string') query.dateFrom = routeQuery.dateFrom
  if (typeof routeQuery.dateTo === 'string') query.dateTo = routeQuery.dateTo

  if (typeof routeQuery.sortBy === 'string' && (SORT_FIELDS as string[]).includes(routeQuery.sortBy)) {
    query.sortBy = routeQuery.sortBy as TodoQuery['sortBy']
  }

  if (routeQuery.sortOrder === 'asc' || routeQuery.sortOrder === 'desc') {
    query.sortOrder = routeQuery.sortOrder
  }

  return query
}
