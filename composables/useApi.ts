import type { AxiosResponse } from 'axios'
import type { LoginPayload, LoginResponse, RegisterPayload, RegisterResponse, CurrentUser, UserRole } from '~/types/auth'
import type { CreateTodoPayload, DeleteTodoResponse, Todo, TodoListResponse, TodoQuery, UpdateTodoPayload } from '~/types/todo'
import type { User, UserListResponse, UserQuery } from '~/types/user'
import { errorI18nKey, parseApiError } from '~/utils/apiError'
import { translate } from '~/utils/translate'

interface ApiCallOptions {
  successMessage?: string
  showSuccessToast?: boolean
  showErrorToast?: boolean
}

/**
 * Nguồn ánh xạ endpoint duy nhất. Unwrap AxiosResponse.data, không giả định envelope { success, data }.
 */
export const useApi = () => {
  const { $toast, $axios } = useNuxtApp()
  const t = translate

  const unwrap = async <T>(request: Promise<AxiosResponse<T>>): Promise<T> => {
    const response = await request
    return response.data
  }

  const apiCall = async <T>(
    apiFunction: () => Promise<T>,
    options: ApiCallOptions = {},
  ): Promise<T> => {
    const {
      successMessage = t('common.success'),
      showSuccessToast = false,
      showErrorToast = false,
    } = options

    try {
      const result = await apiFunction()
      if (showSuccessToast) {
        $toast.success(successMessage)
      }
      return result
    } catch (error: unknown) {
      if (showErrorToast) {
        const parsed = parseApiError(error)
        const skipToast = parsed.statusCode === 401
        if (!skipToast) {
          $toast.error(t(errorI18nKey(parsed)))
        }
      }
      throw error
    }
  }

  const todoApi = {
    list: async (query: TodoQuery = {}) => {
      return apiCall(
        () => unwrap<TodoListResponse>($axios.get('/todos', { params: toTodoParams(query) })),
        { showSuccessToast: false, showErrorToast: false },
      )
    },

    getById: async (id: number) => {
      return apiCall(
        () => unwrap<Todo>($axios.get(`/todos/${id}`)),
        { showSuccessToast: false, showErrorToast: false },
      )
    },

    create: async (payload: CreateTodoPayload) => {
      return apiCall(
        () => unwrap<Todo>($axios.post('/todos', payload)),
        { successMessage: t('dashboard.createSuccess'), showSuccessToast: true },
      )
    },

    update: async (id: number, payload: UpdateTodoPayload, callOptions: ApiCallOptions = {}) => {
      const isToggleOnly = payload.isDone !== undefined && payload.title === undefined && payload.description === undefined
      const successMessage = isToggleOnly
        ? (payload.isDone ? t('dashboard.completeSuccess') : t('dashboard.uncompleteSuccess'))
        : t('dashboard.updateSuccess')

      return apiCall(
        () => unwrap<Todo>($axios.patch(`/todos/${id}`, payload)),
        { successMessage, showSuccessToast: true, ...callOptions },
      )
    },

    remove: async (id: number) => {
      return apiCall(
        () => unwrap<DeleteTodoResponse>($axios.delete(`/todos/${id}`)),
        { successMessage: t('dashboard.deleteSuccess'), showSuccessToast: true },
      )
    },
  }

  const authApi = {
    login: async (payload: LoginPayload) => {
      return apiCall(
        () => unwrap<LoginResponse>($axios.post('/auth/login', payload)),
        { showSuccessToast: false, showErrorToast: false },
      )
    },

    register: async (payload: RegisterPayload) => {
      return apiCall(
        () => unwrap<RegisterResponse>($axios.post('/auth/register', payload)),
        { successMessage: t('auth.registerSuccess'), showSuccessToast: true, showErrorToast: false },
      )
    },

    me: async (token?: string | null) => {
      const headers = token ? { Authorization: `Bearer ${token}` } : undefined
      return apiCall(
        () => unwrap<CurrentUser>($axios.get('/auth/me', { headers })),
        { showSuccessToast: false, showErrorToast: false },
      )
    },
  }

  const userApi = {
    list: async (query: UserQuery = {}) => {
      return apiCall(
        () => unwrap<UserListResponse>($axios.get('/users', { params: query })),
        { showSuccessToast: false, showErrorToast: false },
      )
    },

    getById: async (id: number) => {
      return apiCall(
        () => unwrap<User>($axios.get(`/users/${id}`)),
        { showSuccessToast: false, showErrorToast: false },
      )
    },

    updateRole: async (id: number, role: UserRole) => {
      return apiCall(
        () => unwrap<User>($axios.patch(`/users/${id}/role`, { role })),
        { successMessage: t('users.roleUpdateSuccess'), showSuccessToast: true, showErrorToast: false },
      )
    },
  }

  return {
    apiCall,
    todoApi,
    authApi,
    userApi,
  }
}

/** Chỉ gửi param có trong contract GET /todos. */
function toTodoParams(query: TodoQuery): Record<string, string | number | boolean> {
  const params: Record<string, string | number | boolean> = {}

  if (query.page !== undefined) params.page = query.page
  if (query.limit !== undefined) params.limit = query.limit
  if (query.isDone !== undefined) params.isDone = query.isDone
  if (query.search) params.search = query.search
  if (query.dateFrom) params.dateFrom = query.dateFrom
  if (query.dateTo) params.dateTo = query.dateTo
  if (query.sortBy) params.sortBy = query.sortBy
  if (query.sortOrder) params.sortOrder = query.sortOrder

  return params
}
