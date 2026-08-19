<template>
  <div class="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 py-10 px-4">
    <div class="max-w-2xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
      <div class="bg-gradient-to-r from-purple-600 to-blue-600 px-6 py-4 flex items-center justify-between">
        <div>
          <h1 class="text-xl font-bold text-white">{{ $t('users.detailTitle') }}</h1>
        </div>
        <BaseButton to="/users" variant="ghost" class="text-white border-white/30">
          {{ $t('users.back') }}
        </BaseButton>
      </div>

      <div v-if="userStore.loading" class="p-8 text-center text-gray-600">
        {{ $t('common.loading') }}
      </div>

      <div v-else-if="userStore.error" class="p-8">
        <p class="text-red-700 mb-4">{{ errorMessage }}</p>
        <BaseButton @click="loadUser" variant="primary">{{ $t('common.retry') }}</BaseButton>
      </div>

      <div v-else-if="userStore.selectedUser" class="p-8 space-y-6">
        <div class="grid grid-cols-1 gap-4">
          <div>
            <p class="text-sm text-gray-500">{{ $t('users.username') }}</p>
            <p class="text-lg font-semibold">{{ userStore.selectedUser.username }}</p>
          </div>
          <div>
            <p class="text-sm text-gray-500">{{ $t('users.email') }}</p>
            <p class="text-lg font-semibold">{{ userStore.selectedUser.email }}</p>
          </div>
          <div>
            <p class="text-sm text-gray-500">{{ $t('users.role') }}</p>
            <p class="text-lg font-semibold">{{ roleLabel(userStore.selectedUser.role) }}</p>
          </div>
          <div>
            <p class="text-sm text-gray-500">{{ $t('users.createdAt') }}</p>
            <p class="text-lg font-semibold">{{ formatDateTime(userStore.selectedUser.createdAt, locale) }}</p>
          </div>
          <div>
            <p class="text-sm text-gray-500">{{ $t('users.updatedAt') }}</p>
            <p class="text-lg font-semibold">{{ formatDateTime(userStore.selectedUser.updatedAt, locale) }}</p>
          </div>
        </div>

        <div class="border-t pt-6">
          <label for="role" class="block text-sm font-medium text-gray-700 mb-2">
            {{ $t('users.updateRole') }}
          </label>
          <select
            id="role"
            v-model="selectedRole"
            class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500"
          >
            <option value="user">{{ $t('users.roleUser') }}</option>
            <option value="admin">{{ $t('users.roleAdmin') }}</option>
          </select>
          <p v-if="formError" class="mt-2 text-sm text-red-600">{{ formError }}</p>
          <BaseButton
            class="mt-4"
            :disabled="userStore.mutating || selectedRole === userStore.selectedUser.role"
            @click="handleRoleClick"
          >
            {{ userStore.mutating ? $t('common.saving') : $t('users.saveRole') }}
          </BaseButton>
        </div>
      </div>
    </div>

    <UiModal :is-open="showDowngradeModal" @close="showDowngradeModal = false">
      <TodoDeleteConfirmModal
        :todo="{
          id: 0,
          title: $t('users.downgradeTitle'),
          description: $t('users.downgradeMessage'),
          isDone: false,
          ownerId: 0,
          createdAt: '',
          updatedAt: '',
        }"
        :loading="userStore.mutating"
        :error="formError"
        :is-logout="true"
        @cancel="showDowngradeModal = false"
        @confirm="confirmRoleUpdate"
      />
    </UiModal>
  </div>
</template>

<script setup lang="ts">
import type { UserRole } from '~/types/auth'
import { errorI18nKey, parseApiError } from '~/utils/apiError'
import { formatDateTime } from '~/utils/formatDate'

definePageMeta({
  middleware: ['auth', 'admin'],
})

const route = useRoute()
const userStore = useUserStore()
const { t, locale } = useI18n()

const selectedRole = ref<UserRole>('user')
const formError = ref('')
const showDowngradeModal = ref(false)

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

const userId = computed(() => Number(route.params.id))

const loadUser = async () => {
  formError.value = ''
  await userStore.fetchUser(userId.value)
  if (userStore.selectedUser) {
    selectedRole.value = userStore.selectedUser.role
  }
}

const handleRoleClick = () => {
  if (!userStore.selectedUser) return
  formError.value = ''
  const isDowngrade = userStore.selectedUser.role === 'admin' && selectedRole.value === 'user'
  if (isDowngrade) {
    showDowngradeModal.value = true
    return
  }
  void confirmRoleUpdate()
}

/**
 * Chỉ khẳng định thành công sau response backend. 409 = admin cuối cùng.
 */
const confirmRoleUpdate = async () => {
  if (!userStore.selectedUser) return
  try {
    formError.value = ''
    await userStore.updateRole(userStore.selectedUser.id, selectedRole.value)
    showDowngradeModal.value = false
  } catch (error: unknown) {
    const parsed = parseApiError(error)
    formError.value = parsed.statusCode === 409
      ? t('users.lastAdminConflict')
      : t(errorI18nKey(parsed))
  }
}

onMounted(loadUser)
</script>
