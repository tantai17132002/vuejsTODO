<template>
  <div class="bg-white rounded-xl shadow-lg border border-gray-100">
    <!-- Header -->
    <div class="bg-gradient-to-r from-purple-600 to-blue-600 px-6 py-4 relative overflow-visible">
      <div class="flex justify-between items-center">
        <div class="flex items-center space-x-3">
          <div class="bg-white/20 p-2 rounded-lg">
            <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <div>
            <h2 class="text-xl font-bold text-white">{{ $t('dashboard.todoList') }}</h2>
          </div>
        </div>
        <div class="flex items-center space-x-3">
          <!-- Header Actions Slot -->
          <slot name="header-actions"></slot>
          
          <!-- Add New Button -->
          <BaseButton 
            @click="$emit('openCreateModal')"
            variant="ghost" 
            size="md"
            class="bg-white/20 hover:bg-white/30 text-white border-white/30 hover:border-white/50 flex items-center gap-2 transition-all duration-200 rounded-md"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
            {{ $t('dashboard.addNew') }}
          </BaseButton>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <TodoLoading v-if="loading" />

    <!-- Error State -->
    <TodoError v-else-if="error" :error="error" @dismiss="$emit('clearError')" />

    <!-- Empty State -->
    <TodoEmpty v-else-if="todos.length === 0" />

    <!-- Todo List -->
    <div v-else class="overflow-hidden">
      <TodoCard
        v-for="(todo, index) in todos"
        :key="todo.id"
        :todo="todo"
        :class="index % 2 === 0 ? 'bg-white' : 'bg-gray-50'"
        @toggle="(id, isDone) => $emit('toggle', id, isDone)"
        @delete="$emit('delete', $event)"
        @edit="$emit('edit', $event)"
      />
    </div>

    <!-- Pagination -->
    <UiPagination
      v-if="showPagination"
      :current-page="currentPage"
      :total-pages="totalPages"
      :total-items="totalItems"
      :items-per-page="itemsPerPage"
      @page-change="$emit('page-change', $event)"
    />
  </div>
</template>

<script setup lang="ts">
import type { Todo } from '~/stores/todo'

// Props
interface Props {
  todos: Todo[]
  loading: boolean
  error: string | null
  currentPage?: number
  totalPages?: number
  totalItems?: number
  itemsPerPage?: number
  showPagination?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  currentPage: 1,
  totalPages: 1,
  totalItems: 0,
  itemsPerPage: 10,
  showPagination: false
})

// Emits
const emit = defineEmits<{
  toggle: [id: number, isDone: boolean]
  delete: [id: number]
  edit: [todo: Todo]
  clearError: []
  openCreateModal: []
  'page-change': [page: number]
}>()

</script>
