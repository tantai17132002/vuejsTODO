<template>
  <div class="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 py-10 px-4">
    <div class="max-w-5xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
      <div class="bg-gradient-to-r from-purple-600 to-blue-600 px-6 py-4">
        <h1 class="text-xl font-bold text-white">{{ $t('users.title') }}</h1>
        <p class="text-sm text-purple-100">{{ $t('users.subtitle') }}</p>
      </div>

      <div v-if="userStore.loading" class="p-8 text-center text-gray-600">
        {{ $t('common.loading') }}
      </div>

      <div v-else-if="userStore.error" class="p-8">
        <p class="text-red-700 mb-4">{{ errorMessage }}</p>
        <BaseButton @click="userStore.fetchUsers()" variant="primary">{{ $t('common.retry') }}</BaseButton>
      </div>

      <div v-else-if="userStore.users.length === 0" class="p-8 text-center text-gray-500">
        {{ $t('users.empty') }}
      </div>

      <div v-else class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{{ $t('users.username') }}</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{{ $t('users.email') }}</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{{ $t('users.role') }}</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{{ $t('users.createdAt') }}</th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">{{ $t('users.actions') }}</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="user in userStore.users" :key="user.id">
              <td class="px-6 py-4 text-sm font-medium text-gray-900">{{ user.username }}</td>
              <td class="px-6 py-4 text-sm text-gray-600">{{ user.email }}</td>
              <td class="px-6 py-4 text-sm text-gray-600">{{ roleLabel(user.role) }}</td>
              <td class="px-6 py-4 text-sm text-gray-600">{{ formatDateTime(user.createdAt, locale) }}</td>
              <td class="px-6 py-4 text-right">
                <BaseButton variant="ghost" size="sm" :to="`/users/${user.id}`">
                  {{ $t('users.view') }}
                </BaseButton>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <UiPagination
        v-if="userStore.pagination.totalPages > 1"
        :current-page="userStore.pagination.page"
        :total-pages="userStore.pagination.totalPages"
        :total-items="userStore.pagination.total"
        :items-per-page="userStore.pagination.limit"
        @page-change="(page) => userStore.fetchUsers({ page })"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { UserRole } from '~/types/auth'
import { errorI18nKey } from '~/utils/apiError'
import { formatDateTime } from '~/utils/formatDate'

definePageMeta({
  middleware: ['auth', 'admin'],
})

const userStore = useUserStore()
const { t, locale } = useI18n()

const errorMessage = computed(() => {
  if (!userStore.error) return ''
  return t(errorI18nKey({
    statusCode: userStore.error.statusCode,
    message: typeof userStore.error.message === 'string' ? userStore.error.message : '',
    details: userStore.error.details || [],
    fieldErrors: {},
    isNetworkError: false,
  }))
})

const roleLabel = (role: UserRole) =>
  role === 'admin' ? t('users.roleAdmin') : t('users.roleUser')

onMounted(() => userStore.fetchUsers({ page: 1, limit: 10 }))
</script>
