<template>
  <div 
    :class="[
      'p-6 hover:bg-gradient-to-r hover:from-purple-50 hover:to-blue-50 transition-all duration-300 group',
      $attrs.class
    ]"
  >
    <div class="flex items-start justify-between">
      <!-- Todo Content -->
      <div class="flex-1 min-w-0">
        <div class="flex items-start gap-4">
          <!-- Checkbox -->
          <button 
            @click="handleToggle"
            :class="[
              'flex-shrink-0 w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all duration-300 transform hover:scale-110',
              todo.isDone 
                ? 'bg-gradient-to-r from-green-500 to-emerald-500 border-green-500 text-white shadow-lg' 
                : 'border-gray-300 hover:border-green-400 hover:bg-green-50'
            ]"
          >
            <svg v-if="todo.isDone" class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
            </svg>
          </button>
          
          <!-- Todo Info -->
          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-3 mb-2">
              <h3 
                :class="[
                  'text-lg font-semibold transition-all duration-300',
                  todo.isDone ? 'text-gray-600' : 'text-gray-900 group-hover:text-purple-700'
                ]"
              >
                {{ todo.title }}
              </h3>
              <span 
                v-if="todo.isDone"
                class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800"
              >
                <svg class="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                </svg>
                {{ $t('dashboard.completed') }}
              </span>
            </div>
            <p 
              v-if="todo.description" 
              :class="[
                'text-sm transition-all duration-300 mb-3',
                todo.isDone ? 'text-gray-400' : 'text-gray-600 group-hover:text-gray-700'
              ]"
            >
              {{ todo.description }}
            </p>
            <div class="flex items-center gap-4 text-xs text-gray-500">
              <div class="flex items-center gap-1">
                <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{{ $t('dashboard.created') }}: {{ formatDate(todo.createdAt) }}</span>
              </div>
              <span v-if="todo.updatedAt !== todo.createdAt" class="flex items-center gap-1">
                <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                <span>{{ $t('dashboard.updated') }}: {{ formatDate(todo.updatedAt) }}</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Actions -->
      <div class="flex items-center gap-2 ml-6">
        <BaseButton 
          @click="handleEdit"
          variant="ghost" 
          size="sm"
          class="text-blue-600 hover:text-blue-700 hover:bg-blue-50 border border-blue-200 hover:border-blue-300 transition-all duration-200"
        >
          <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
          {{ $t('dashboard.edit') }}
        </BaseButton>
        <BaseButton 
          @click="handleDelete" 
          variant="ghost" 
          size="sm"
          class="text-red-600 hover:text-red-700 hover:bg-red-50 border border-red-200 hover:border-red-300 transition-all duration-200"
        >
          <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
          {{ $t('dashboard.delete') }}
        </BaseButton>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Todo } from '~/stores/todo'

defineOptions({
  inheritAttrs: false
})

// Props
interface Props {
  todo: Todo
}

const props = defineProps<Props>()

// Emits
const emit = defineEmits<{
  toggle: [id: number, isDone: boolean]
  delete: [todo: Todo]
  edit: [todo: Todo]
}>()

// Methods
const handleToggle = () => {
  // Emit với id và trạng thái mới (đảo ngược trạng thái hiện tại)
  emit('toggle', props.todo.id, !props.todo.isDone)
}

const handleDelete = () => {
  emit('delete', props.todo)
}

const handleEdit = () => {
  emit('edit', props.todo)
}

// Format date
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('vi-VN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}
</script>
