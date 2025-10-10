<template>
  <div class="flex items-center justify-between px-4 py-3 bg-white border-t border-gray-200 sm:px-6">
    <!-- Mobile pagination info -->
    <div class="flex justify-between flex-1 sm:hidden">
      <button
        @click="$emit('page-change', currentPage - 1)"
        :disabled="currentPage <= 1"
        class="relative inline-flex items-center px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded-md hover:bg-gradient-to-r hover:from-purple-50 hover:to-blue-50 hover:border-purple-300 hover:text-purple-700 transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:hover:scale-100"
      >
        <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd" />
        </svg>
      </button>
      <button
        @click="$emit('page-change', currentPage + 1)"
        :disabled="currentPage >= totalPages"
        class="relative inline-flex items-center px-4 py-2 ml-3 text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded-md hover:bg-gradient-to-r hover:from-purple-50 hover:to-blue-50 hover:border-purple-300 hover:text-purple-700 transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:hover:scale-100"
      >
        <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
        </svg>
      </button>
    </div>

    <!-- Desktop pagination -->
    <div class="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
      <div>
        <p class="text-sm text-gray-700">
          {{ $t('pagination.showing') }}
          <span class="font-medium">{{ startItem }}</span>
          {{ $t('pagination.to') }}
          <span class="font-medium">{{ endItem }}</span>
          {{ $t('pagination.of') }}
          <span class="font-medium">{{ totalItems }}</span>
          {{ $t('pagination.results') }}
        </p>
      </div>
      <div>
        <nav class="flex items-center space-x-1" aria-label="Pagination">
          <!-- Previous button -->
          <button
            @click="$emit('page-change', currentPage - 1)"
            :disabled="currentPage <= 1"
            class="relative inline-flex items-center px-3 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded-l-md hover:bg-gradient-to-r hover:from-purple-50 hover:to-blue-50 hover:border-purple-300 hover:text-purple-700 transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:hover:scale-100"
          >
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd" />
            </svg>
          </button>

          <!-- Page numbers -->
          <template v-for="page in visiblePages" :key="page">
            <button
              v-if="page !== '...'"
              @click="page !== currentPage && $emit('page-change', page)"
              :disabled="page === currentPage"
              :class="[
                'relative inline-flex items-center px-4 py-2 text-sm font-medium transition-all duration-200 transform hover:scale-105',
                page === currentPage
                  ? 'z-10 bg-gradient-to-r from-purple-500 to-blue-500 text-white cursor-default shadow-lg'
                  : 'bg-white border border-gray-300 text-gray-600 hover:bg-gradient-to-r hover:from-purple-50 hover:to-blue-50 hover:border-purple-300 hover:text-purple-700 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:hover:scale-100'
              ]"
            >
              {{ page }}
            </button>
            <span
              v-else
              class="relative inline-flex items-center px-4 py-2 text-sm font-medium text-gray-500 bg-gray-50 border border-gray-200"
            >
              ...
            </span>
          </template>

          <!-- Next button -->
          <button
            @click="$emit('page-change', currentPage + 1)"
            :disabled="currentPage >= totalPages"
            class="relative inline-flex items-center px-3 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded-r-md hover:bg-gradient-to-r hover:from-purple-50 hover:to-blue-50 hover:border-purple-300 hover:text-purple-700 transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:hover:scale-100"
          >
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
            </svg>
          </button>
        </nav>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Props
interface Props {
  currentPage: number
  totalPages: number
  totalItems: number
  itemsPerPage: number
}

const props = defineProps<Props>()

// Emits
const emit = defineEmits<{
  'page-change': [page: number]
}>()

// Computed
const startItem = computed(() => {
  return (props.currentPage - 1) * props.itemsPerPage + 1
})

const endItem = computed(() => {
  return Math.min(props.currentPage * props.itemsPerPage, props.totalItems)
})

const visiblePages = computed(() => {
  const pages: (number | string)[] = []
  const { currentPage, totalPages } = props
  
  if (totalPages <= 7) {
    // Show all pages if total is 7 or less
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i)
    }
  } else {
    // Always show first page
    pages.push(1)
    
    if (currentPage > 4) {
      pages.push('...')
    }
    
    // Show pages around current page
    const start = Math.max(2, currentPage - 1)
    const end = Math.min(totalPages - 1, currentPage + 1)
    
    for (let i = start; i <= end; i++) {
      if (i !== 1 && i !== totalPages) {
        pages.push(i)
      }
    }
    
    if (currentPage < totalPages - 3) {
      pages.push('...')
    }
    
    // Always show last page
    if (totalPages > 1) {
      pages.push(totalPages)
    }
  }
  
  return pages
})
</script>
