<template>
  <div class="max-w-2xl w-full">
    <div class="bg-white rounded-xl shadow-lg overflow-hidden">
      <!-- Header -->
      <div class="bg-gradient-to-r from-red-600 to-pink-600 px-6 py-4">
        <div class="flex items-center space-x-3">
          <div class="bg-white/20 p-2 rounded-lg">
            <!-- Logout Icon -->
            <svg
              v-if="isLogout"
              class="w-6 h-6 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </svg>
            <!-- Delete Icon -->
            <svg
              v-else
              class="w-6 h-6 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 18.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>
          <div>
            <h2 class="text-xl font-bold text-white">
              {{ isLogout ? $t("navbar.logoutConfirmTitle") : $t("deleteModal.title") }}
            </h2>
          </div>
        </div>
      </div>

      <!-- Content -->
      <div class="p-6">
        <div class="flex items-start space-x-4">
          <div class="flex-shrink-0">
            <div class="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
              <!-- Logout Icon -->
              <svg
                v-if="isLogout"
                class="w-6 h-6 text-red-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
              <!-- Delete Icon -->
              <svg
                v-else
                class="w-6 h-6 text-red-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
            </div>
          </div>
          <div class="flex-1">
            <h3 class="text-lg font-medium text-gray-900 mb-2">
              {{ isLogout ? $t("navbar.logoutConfirmTitle") : $t("deleteModal.confirmTitle") }}
            </h3>
            <p class="text-sm text-gray-600 mb-4">
              {{ isLogout ? $t("navbar.logoutConfirmMessage") : $t("deleteModal.confirmMessage") }}
            </p>
            <div v-if="!isLogout" class="bg-gray-50 rounded-lg p-3">
              <p class="text-sm font-medium text-gray-900">{{ todo.title }}</p>
              <p v-if="todo.description" class="text-xs text-gray-500 mt-1">
                {{ todo.description }}
              </p>
            </div>
          </div>
        </div>

        <!-- Error Message -->
        <div
          v-if="error"
          class="bg-red-50 border border-red-200 rounded-lg p-4 mt-4"
        >
          <div class="flex">
            <svg
              class="h-5 w-5 text-red-400"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fill-rule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clip-rule="evenodd"
              />
            </svg>
            <div class="ml-3">
              <h3 class="text-sm font-medium text-red-800">
                {{ $t("deleteModal.errorTitle") }}
              </h3>
              <div class="mt-2 text-sm text-red-700">{{ error }}</div>
            </div>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="flex items-center justify-end space-x-4 pt-6">
          <BaseButton
            type="button"
            variant="ghost"
            size="md"
            :ignore-modal-state="true"
            @click="handleCancel"
            class="px-6 py-3 text-gray-600 hover:text-gray-700 hover:bg-gray-50 border border-gray-200 hover:border-gray-300 rounded-lg font-medium transition-all duration-200"
          >
            <svg
              class="w-4 h-4 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
            {{ isLogout ? $t("navbar.cancel") : $t("deleteModal.cancel") }}
          </BaseButton>
          <BaseButton
            type="button"
            :disabled="loading"
            size="md"
            :ignore-modal-state="true"
            @click="handleDelete"
            class="px-6 py-3 bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white font-medium rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            <span class="flex items-center">
              <svg
                v-if="loading"
                class="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  class="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  stroke-width="4"
                ></circle>
                <path
                  class="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              <!-- Logout Icon -->
              <svg
                v-else-if="isLogout"
                class="w-4 h-4 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
              <!-- Delete Icon -->
              <svg
                v-else
                class="w-4 h-4 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
              {{ loading ? (isLogout ? $t("navbar.logout") : $t("deleteModal.deleting")) : (isLogout ? $t("navbar.logout") : $t("deleteModal.delete")) }}
            </span>
          </BaseButton>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Todo } from '~/stores/todo'

// Props
interface Props {
  todo: Todo
  loading?: boolean
  error?: string
  isLogout?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
  error: '',
  isLogout: false
})

// Emits
const emit = defineEmits<{
  cancel: []
  confirm: []
  success: []
}>()

// Toast sẽ được xử lý tự động bởi useApi

// Methods
const handleCancel = () => {
  emit('cancel')
}

const handleDelete = () => {
  emit('confirm')
}

// Watch for success (khi xóa thành công)
watch(() => props.loading, (newLoading, oldLoading) => {
  // Nếu loading từ true chuyển về false và không có error
  if (oldLoading && !newLoading && !props.error) {
    emit('success');
  }
});
</script>
