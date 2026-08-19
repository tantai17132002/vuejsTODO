import { describe, expect, it } from 'vitest'
import { DEFAULT_TODO_QUERY, mergeTodoQuery, todoQueryFromRoute, todoQueryToRoute } from '../../utils/todoQuery'

describe('todoQuery', () => {
  it('đổi filter thì reset page về 1, đổi page thì giữ filter', () => {
    const current = { ...DEFAULT_TODO_QUERY, page: 3, isDone: false, search: 'nest' }
    expect(mergeTodoQuery(current, { page: 2 }).search).toBe('nest')
    expect(mergeTodoQuery(current, { page: 2 }).isDone).toBe(false)
    expect(mergeTodoQuery(current, { search: 'api' }).page).toBe(1)
    expect(mergeTodoQuery(current, { isDone: true }).page).toBe(1)
  })

  it('serialize/parse URL query', () => {
    const query = { page: 2, isDone: false, search: 'nest', sortBy: 'title' as const, sortOrder: 'asc' as const, limit: 10 }
    const route = todoQueryToRoute(query)
    expect(route.page).toBe('2')
    expect(route.isDone).toBe('false')
    expect(route.search).toBe('nest')

    const parsed = todoQueryFromRoute(route)
    expect(parsed.page).toBe(2)
    expect(parsed.isDone).toBe(false)
    expect(parsed.search).toBe('nest')
    expect(parsed.sortBy).toBe('title')
    expect(parsed.sortOrder).toBe('asc')
  })
})
