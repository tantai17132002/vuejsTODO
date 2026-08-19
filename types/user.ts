import type { CurrentUser, UserRole } from './auth'
import type { Pagination } from './api'

/** User công khai đầy đủ từ GET /users và GET /users/:id. */
export interface User extends CurrentUser {
  email: string
  createdAt: string
  updatedAt: string
}

export interface UserQuery {
  page?: number
  limit?: number
}

export interface UserListResponse {
  users: User[]
  pagination: Pagination
}

export interface UpdateRolePayload {
  role: UserRole
}
