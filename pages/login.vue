<template>
  <div
    class="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 flex items-center justify-center py-8 px-4 sm:px-6 lg:px-8"
  >
    <div class="max-w-lg w-full space-y-8">
      <div class="text-center">
        <div
          class="mx-auto h-20 w-20 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center mb-4"
        >
          <svg class="h-10 w-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
            />
          </svg>
        </div>
        <h2 class="text-3xl font-bold text-gray-900 mb-2">
          {{ $t("navbar.login") }}
        </h2>
        <p class="text-base text-gray-600">{{ $t("login.subtitle") }}</p>
      </div>

      <FormsFormContainer>
        <form @submit.prevent="login" class="space-y-6">
          <FormsFormInput
            id="usernameOrEmail"
            v-model="usernameOrEmail"
            v-bind="usernameOrEmailAttrs"
            :label="$t('login.usernameLabel')"
            type="text"
            :placeholder="$t('login.usernamePlaceholder')"
            :error="errors.usernameOrEmail"
          >
            <template #icon>
              <svg class="h-6 w-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            </template>
          </FormsFormInput>

          <FormsFormInput
            id="password"
            v-model="password"
            v-bind="passwordAttrs"
            :label="$t('login.passwordLabel')"
            type="password"
            :placeholder="$t('login.passwordPlaceholder')"
            :error="errors.password"
          >
            <template #icon>
              <svg class="h-6 w-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
            </template>
          </FormsFormInput>

          <div>
            <BaseButton
              type="submit"
              :disabled="loading"
              width="full"
              size="lg"
              class="group relative bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 focus:ring-purple-500 transform hover:scale-[1.02] hover:shadow-lg transition-all duration-200"
            >
              <span v-if="loading" class="absolute left-0 inset-y-0 flex items-center pl-4">
                <svg class="animate-spin h-6 w-6 text-white" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                  <path
                    class="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
              </span>
              {{ loading ? $t("login.loggingIn") : $t("login.loginButton") }}
            </BaseButton>
          </div>

          <div v-if="error" class="bg-red-50 border border-red-200 rounded-lg p-5">
            <div class="flex">
              <div class="flex-shrink-0">
                <svg class="h-6 w-6 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fill-rule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clip-rule="evenodd"
                  />
                </svg>
              </div>
              <div class="ml-4">
                <h3 class="text-base font-medium text-red-800">
                  {{ $t("login.errorTitle") }}
                </h3>
                <div class="mt-2 text-base text-red-700">
                  {{ error }}
                </div>
              </div>
            </div>
          </div>
        </form>
      </FormsFormContainer>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useForm } from 'vee-validate'
import * as yup from 'yup'
import { parseApiError } from '~/utils/apiError'
import { safeInternalPath } from '~/utils/token'

definePageMeta({
  middleware: 'guest',
})

const auth = useAuthStore()
const route = useRoute()
const { t } = useI18n()
const { $toast } = useNuxtApp()
const { authApi } = useApi()

const schema = computed(() =>
  yup.object({
    usernameOrEmail: yup.string().required(t('validation.username.required')),
    password: yup
      .string()
      .required(t('validation.password.required'))
      .min(8, t('validation.password.minLength')),
  }),
)

const { errors, handleSubmit, defineField, setFieldError } = useForm({
  validationSchema: schema,
})

const [usernameOrEmail, usernameOrEmailAttrs] = defineField('usernameOrEmail')
const [password, passwordAttrs] = defineField('password')

usernameOrEmail.value = usernameOrEmail.value || ''
password.value = password.value || ''

const error = ref('')
const loading = ref(false)

/**
 * Login: validate → POST /auth/login → lưu token → await GET /auth/me → điều hướng.
 * Lỗi 401 dùng status code, không parse substring message.
 */
const login = handleSubmit(async (values) => {
  try {
    loading.value = true
    error.value = ''

    auth.clearAuth()

    const response = await authApi.login({
      usernameOrEmail: values.usernameOrEmail.trim(),
      password: values.password,
    })

    if (!response?.access_token) {
      error.value = t('login.errorTitle')
      return
    }

    auth.setToken(response.access_token)
    await auth.fetchMe()
    $toast.success(t('auth.loginSuccess'))
    await navigateTo(safeInternalPath(route.query.redirect))
  } catch (err: unknown) {
    const parsed = parseApiError(err)
    Object.entries(parsed.fieldErrors).forEach(([field, message]) => {
      setFieldError(field, message)
    })

    if (err instanceof Error && err.message === 'SESSION_INVALID') {
      error.value = t('errors.unauthorized')
    } else if (parsed.statusCode === 401) {
      error.value = t('login.wrongCredentials')
    } else if (parsed.statusCode === 400) {
      error.value = Object.values(parsed.fieldErrors)[0] || t('errors.validation')
    } else if (parsed.isNetworkError) {
      error.value = t('errors.network')
    } else {
      error.value = t('login.errorTitle')
    }
  } finally {
    loading.value = false
  }
})
</script>
