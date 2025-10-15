<template>
  <div class="p-12 text-center">
    <div class="max-w-md mx-auto">
      <div class="w-20 h-20 bg-gradient-to-r from-purple-100 to-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <svg class="w-10 h-10 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
      </div>
      <h3 class="text-xl font-semibold text-gray-900 mb-2">{{ $t('dashboard.noTodos') }}</h3>
      <p class="text-gray-500">{{ $t('dashboard.noTodosDescription') }}</p>
    </div>
  </div>
</template>
