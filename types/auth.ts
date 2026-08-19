/** Role hợp lệ theo hợp đồng API. */
export type UserRole = 'user' | 'admin'

/**
 * User rút gọn từ GET /auth/me.
 * Không gồm email/timestamps — Navbar không được giả định các field đó.
 */
export interface CurrentUser {
  id: number
  username: string
  role: UserRole
}

export interface LoginPayload {
  usernameOrEmail: string
  password: string
}

export interface LoginResponse {
  access_token: string
}

export interface RegisterPayload {
  username: string
  email: string
  password: string
}

export interface RegisterResponse {
  message: string
  user: import('./user').User
}
