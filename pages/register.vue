<template>
  <div class="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 flex items-center justify-center py-8 px-4 sm:px-6 lg:px-8">
    <div class="max-w-lg w-full space-y-8">
      <div class="text-center">
        <div class="mx-auto h-20 w-20 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center mb-4">
          <svg class="h-10 w-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
          </svg>
        </div>
        <h2 class="text-3xl font-bold text-gray-900 mb-2">{{ $t('navbar.register') }}</h2>
        <p class="text-base text-gray-600">{{ $t('register.subtitle') }}</p>
      </div>

      <FormsFormContainer>
        <form @submit.prevent="register" class="space-y-6" novalidate>
          <FormsFormInput
            id="username"
            v-model="username"
            v-bind="usernameAttrs"
            :label="$t('register.usernameLabel')"
            type="text"
            :placeholder="$t('register.usernamePlaceholder')"
            :error="errors.username"
          >
            <template #icon>
              <svg class="h-6 w-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </template>
          </FormsFormInput>

          <FormsFormInput
            id="email"
            v-model="email"
            v-bind="emailAttrs"
            :label="$t('register.emailLabel')"
            type="text"
            :placeholder="$t('register.emailPlaceholder')"
            :error="errors.email"
          >
            <template #icon>
              <svg class="h-6 w-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </template>
          </FormsFormInput>

          <FormsFormInput
            id="password"
            v-model="password"
            v-bind="passwordAttrs"
            :label="$t('register.passwordLabel')"
            type="password"
            :placeholder="$t('register.passwordPlaceholder')"
            :error="errors.password"
          >
            <template #icon>
              <svg class="h-6 w-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
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
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
              </span>
              {{ loading ? $t('register.registering') : $t('register.registerButton') }}
            </BaseButton>
          </div>

          <div v-if="error" class="bg-red-50 border border-red-200 rounded-lg p-5">
            <div class="flex">
              <div class="flex-shrink-0">
                <svg class="h-6 w-6 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
                </svg>
              </div>
              <div class="ml-4">
                <h3 class="text-base font-medium text-red-800">
                  {{ $t("register.errorTitle") }}
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

definePageMeta({
  middleware: 'guest',
})

const { t } = useI18n()
const { authApi } = useApi()

const schema = computed(() =>
  yup.object({
    username: yup.string().required(t('validation.username.required')),
    email: yup
      .string()
      .required(t('validation.email.required'))
      .email(t('validation.email.valid')),
    password: yup
      .string()
      .required(t('validation.password.required'))
      .min(8, t('validation.password.minLength')),
  }),
)

const { errors, handleSubmit, defineField, setFieldError } = useForm({
  validationSchema: schema,
})

const [username, usernameAttrs] = defineField('username')
const [email, emailAttrs] = defineField('email')
const [password, passwordAttrs] = defineField('password')

username.value = username.value || ''
email.value = email.value || ''
password.value = password.value || ''

const error = ref('')
const loading = ref(false)

/**
 * Register: validate → POST /auth/register → toast → /login.
 * Backend không trả token nên không gọi setToken.
 */
const register = handleSubmit(async (values) => {
  try {
    loading.value = true
    error.value = ''

    await authApi.register({
      username: values.username,
      email: values.email,
      password: values.password,
    })

    await navigateTo('/login')
  } catch (err: unknown) {
    const parsed = parseApiError(err)
    Object.entries(parsed.fieldErrors).forEach(([field, message]) => {
      setFieldError(field, message)
    })

    if (parsed.statusCode === 409) {
      error.value = t('register.conflict')
    } else if (parsed.statusCode === 400) {
      error.value = Object.values(parsed.fieldErrors)[0] || t('errors.validation')
    } else if (parsed.isNetworkError) {
      error.value = t('errors.network')
    } else {
      error.value = t('register.errorTitle')
    }
  } finally {
    loading.value = false
  }
})
</script>
