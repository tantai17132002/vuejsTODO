import type { AxiosInstance } from 'axios'

interface ToastApi {
  success: (message: string, duration?: number) => void
  error: (message: string, duration?: number) => void
  info: (message: string, duration?: number) => void
  warning: (message: string, duration?: number) => void
  clear: () => void
  closeAll: () => void
}

declare module '#app' {
  interface NuxtApp {
    $axios: AxiosInstance
    $toast: ToastApi
  }
}

declare module 'vue' {
  interface ComponentCustomProperties {
    $axios: AxiosInstance
    $toast: ToastApi
  }
}

export {}
