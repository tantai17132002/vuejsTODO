<template>
  <div class="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 py-10 px-4">
    <div class="max-w-2xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
      <div class="bg-gradient-to-r from-purple-600 to-blue-600 px-6 py-4">
        <h1 class="text-xl font-bold text-white">{{ $t('profile.title') }}</h1>
        <p class="text-sm text-purple-100">{{ $t('profile.subtitle') }}</p>
      </div>

      <div v-if="loading" class="p-8 text-center text-gray-600">
        {{ $t('common.loading') }}
      </div>

      <div v-else-if="error" class="p-8">
        <p class="text-red-700 mb-4">{{ error }}</p>
        <BaseButton @click="loadProfile" variant="primary">{{ $t('common.retry') }}</BaseButton>
      </div>

      <div v-else class="p-8 space-y-4">
        <div>
          <p class="text-sm text-gray-500">{{ $t('profile.username') }}</p>
          <p class="text-lg font-semibold text-gray-900">{{ displayUser?.username }}</p>
        </div>
        <div>
          <p class="text-sm text-gray-500">{{ $t('profile.role') }}</p>
          <p class="text-lg font-semibold text-gray-900">{{ roleLabel }}</p>
        </div>
        <div v-if="fullUser">
          <p class="text-sm text-gray-500">{{ $t('profile.email') }}</p>
          <p class="text-lg font-semibold text-gray-900">{{ fullUser.email }}</p>
        </div>
        <div v-if="fullUser">
          <p class="text-sm text-gray-500">{{ $t('profile.createdAt') }}</p>
          <p class="text-lg font-semibold text-gray-900">{{ formatDateTime(fullUser.createdAt, locale) }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { User } from '~/types/user'
import { errorI18nKey, parseApiError } from '~/utils/apiError'
import { formatDateTime } from '~/utils/formatDate'

definePageMeta({
  middleware: 'auth',
})

const auth = useAuthStore()
const { userApi } = useApi()
const { t, locale } = useI18n()

const loading = ref(false)
const error = ref('')
const fullUser = ref<User | null>(null)

const displayUser = computed(() => fullUser.value || auth.user)
const roleLabel = computed(() =>
  displayUser.value?.role === 'admin' ? t('users.roleAdmin') : t('users.roleUser'),
)

/**
 * MVP hiện username/role từ /auth/me.
 * Nếu được phép, bổ sung GET /users/:id của chính mình cho email/timestamps.
 */
const loadProfile = async () => {
  loading.value = true
  error.value = ''
  try {
    if (!auth.user) {
      await auth.fetchMe()
    }
    if (auth.user) {
      try {
        fullUser.value = await userApi.getById(auth.user.id)
      } catch (err: unknown) {
        const parsed = parseApiError(err)
        if (parsed.statusCode !== 403 && parsed.statusCode !== 404) {
          throw err
        }
      }
    }
  } catch (err: unknown) {
    error.value = t(errorI18nKey(parseApiError(err)))
  } finally {
    loading.value = false
  }
}

onMounted(loadProfile)
</script>
