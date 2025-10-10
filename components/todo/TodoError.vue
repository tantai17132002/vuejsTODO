<template>
  <div class="p-6">
    <div class="bg-gradient-to-r from-red-50 to-pink-50 border border-red-200 rounded-xl p-6">
      <div class="flex items-start">
        <div class="flex-shrink-0">
          <div class="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
            <svg class="h-6 w-6 text-red-600" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
            </svg>
          </div>
        </div>
        <div class="ml-4 flex-1">
          <h3 class="text-lg font-semibold text-red-800">{{ $t('dashboard.errorTitle') }}</h3>
          <div class="mt-2 text-red-700">{{ error }}</div>
          <div class="mt-4">
            <BaseButton @click="$emit('dismiss')" variant="ghost" size="sm" class="text-red-600 hover:text-red-700">
              {{ $t('dashboard.dismiss') }}
            </BaseButton>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Props
interface Props {
  error: string
}

defineProps<Props>()

// Emits
defineEmits<{
  dismiss: []
}>()
</script>
