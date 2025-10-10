<template>
  <div class="p-12 text-center">
    <div class="inline-flex flex-col items-center gap-4">
      <div class="relative">
        <div class="w-16 h-16 bg-gradient-to-r from-purple-100 to-blue-100 rounded-full flex items-center justify-center">
          <svg class="animate-spin h-8 w-8 text-purple-600" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>
      </div>
      <div>
        <h3 class="text-lg font-medium text-gray-900">{{ $t('dashboard.loading') }}</h3>
        <p class="text-gray-500 text-sm">Đang tải danh sách công việc...</p>
      </div>
    </div>
  </div>
</template>
