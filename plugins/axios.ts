import axios, { AxiosHeaders, type AxiosError, type InternalAxiosRequestConfig } from 'axios'
import { parseApiError } from '~/utils/apiError'
import { translate } from '~/utils/translate'

const LOGIN_PATH = '/auth/login'
const REGISTER_PATH = '/auth/register'
const ME_PATH = '/auth/me'
const ADMIN_PREFIX = '/users'

/**
 * Plugin Axios: base URL, Bearer token, interceptor 401/403.
 * Không log token hoặc toàn bộ request headers.
 */
export default defineNuxtPlugin({
  name: 'axios',
  setup() {
    const config = useRuntimeConfig()

    const instance = axios.create({
      baseURL: config.public.apiBaseUrl,
      withCredentials: false,
    })

    instance.interceptors.request.use((requestConfig: InternalAxiosRequestConfig) => {
      const requestUrl = String(requestConfig.url || '')
      const isPublicAuth =
        requestUrl.includes(LOGIN_PATH) || requestUrl.includes(REGISTER_PATH)

      if (isPublicAuth) {
        return requestConfig
      }

      try {
        const auth = useAuthStore()
        if (auth.token) {
          assignAuthHeader(requestConfig, auth.token)
        }
      } catch {
        // Giữ Authorization mà caller đã gắn (ví dụ authApi.me(token)).
      }
      return requestConfig
    })

    instance.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        const parsed = parseApiError(error)
        const requestUrl = String(error.config?.url || '')
        const isLoginRequest = requestUrl.includes(LOGIN_PATH)
        const isMeRequest = requestUrl.includes(ME_PATH)

        if (parsed.statusCode === 401 && !isLoginRequest && !isMeRequest) {
          await handleUnauthorized()
        }

        if (parsed.statusCode === 403) {
          await handleForbidden()
        }

        return Promise.reject(error)
      },
    )

    return {
      provide: {
        axios: instance,
      },
    }
  },
})

/** Axios 1 có lúc nhận headers object thường, không có .set(). Không thay cả object headers để giữ Content-Type. */
function assignAuthHeader(requestConfig: InternalAxiosRequestConfig, token: string) {
  const value = `Bearer ${token}`
  const headers = requestConfig.headers
  if (headers && typeof headers.set === 'function') {
    headers.set('Authorization', value)
    return
  }
  requestConfig.headers = AxiosHeaders.from(headers || {})
  requestConfig.headers.set('Authorization', value)
}

/**
 * 401: xóa phiên client, reset store phụ thuộc user, về /login.
 */
async function handleUnauthorized() {
  const auth = useAuthStore()
  const todoStore = useTodoStore()
  const userStore = useUserStore()
  const route = useRoute()

  auth.clearAuth()
  todoStore.reset()
  userStore.reset()

  if (route.path !== '/login') {
    await navigateTo({
      path: '/login',
      query: route.path === '/register' ? undefined : { redirect: route.fullPath },
    })
  }
}

/**
 * 403: giữ phiên. Chỉ can thiệp điều hướng khi đang ở route admin.
 */
async function handleForbidden() {
  const route = useRoute()
  if (!route.path.startsWith(ADMIN_PREFIX)) {
    return
  }

  const { $toast } = useNuxtApp()
  $toast.error(translate('errors.forbidden'))
  await navigateTo('/dashboard')
}
