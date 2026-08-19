<template>
  <div class="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 relative z-0">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <TodoList
        :todos="todoStore.items"
        :loading="todoStore.loading"
        :error="errorMessage"
        :current-page="todoStore.pagination.page"
        :total-pages="todoStore.pagination.totalPages"
        :total-items="todoStore.pagination.total"
        :items-per-page="todoStore.pagination.limit"
        :show-pagination="todoStore.pagination.totalPages > 1"
        @toggle="handleToggle"
        @delete="handleDelete"
        @retry="todoStore.fetchTodos()"
        @clear-error="todoStore.error = null"
        @open-create-modal="showCreateModal = true"
        @edit="handleEdit"
        @page-change="handlePageChange"
      >
        <template #filters>
          <TodoFilter
            :query="todoStore.query"
            @filter-change="handleFilterChange"
            @reset="handleResetFilters"
          />
        </template>
      </TodoList>
    </div>

    <UiModal :is-open="showCreateModal" @close="showCreateModal = false">
      <TodoCreateTodo
        @cancel="showCreateModal = false"
        @success="handleCreateSuccess"
      />
    </UiModal>

    <UiModal :is-open="showEditModal" @close="showEditModal = false">
      <TodoEditTodo
        v-if="editingTodo"
        :todo="editingTodo"
        @cancel="showEditModal = false"
        @success="handleEditSuccess"
      />
    </UiModal>

    <UiModal :is-open="showDeleteModal" @close="showDeleteModal = false">
      <TodoDeleteConfirmModal
        v-if="deletingTodo"
        :todo="deletingTodo"
        :loading="deleteLoading"
        :error="deleteError"
        :is-logout="false"
        @cancel="showDeleteModal = false"
        @confirm="handleDeleteConfirm"
      />
    </UiModal>
  </div>
</template>

<script setup lang="ts">
import type { Todo, TodoQuery } from '~/types/todo'
import { errorI18nKey, parseApiError } from '~/utils/apiError'
import { todoQueryFromRoute, todoQueryToRoute } from '~/utils/todoQuery'

definePageMeta({
  middleware: 'auth',
})

const todoStore = useTodoStore()
const route = useRoute()
const router = useRouter()
const { t } = useI18n()
const { setModalOpen } = useModalState()

const showCreateModal = ref(false)
const showEditModal = ref(false)
const editingTodo = ref<Todo | null>(null)
const showDeleteModal = ref(false)
const deletingTodo = ref<Todo | null>(null)
const deleteLoading = ref(false)
const deleteError = ref('')

const errorMessage = computed(() => {
  if (!todoStore.error) return null
  return t(errorI18nKey({
    statusCode: todoStore.error.statusCode,
    message: typeof todoStore.error.message === 'string' ? todoStore.error.message : '',
    details: todoStore.error.details || [],
    fieldErrors: {},
    isNetworkError: false,
  }))
})

watch([showCreateModal, showEditModal, showDeleteModal], ([create, edit, deleteModal]) => {
  setModalOpen(create || edit || deleteModal)
}, { immediate: true })

/**
 * Chỉ fetch một lần khi mount. Query lấy từ URL để reload giữ filter.
 */
onMounted(async () => {
  todoStore.query = todoQueryFromRoute(route.query)
  await todoStore.fetchTodos()
})

watch(
  () => todoStore.query,
  (query) => {
    router.replace({ query: todoQueryToRoute(query) })
  },
  { deep: true },
)

const handleDelete = (todo: Todo) => {
  deletingTodo.value = todo
  showDeleteModal.value = true
  deleteError.value = ''
}

const handleToggle = async (id: number, isDone: boolean) => {
  try {
    await todoStore.toggleTodo(id, isDone)
  } catch {
    // Toast/interceptor đã xử lý; optimistic rollback nằm trong store.
  }
}

const handleCreateSuccess = () => {
  showCreateModal.value = false
}

const handleEdit = (todo: Todo) => {
  editingTodo.value = todo
  showEditModal.value = true
}

const handleEditSuccess = () => {
  showEditModal.value = false
  editingTodo.value = null
}

const handleDeleteConfirm = async () => {
  if (!deletingTodo.value) return

  try {
    deleteLoading.value = true
    deleteError.value = ''
    await todoStore.deleteTodo(deletingTodo.value.id)
    showDeleteModal.value = false
    deletingTodo.value = null
  } catch (error: unknown) {
    const parsed = parseApiError(error)
    deleteError.value = t(errorI18nKey(parsed))
    if (parsed.statusCode === 404 || parsed.statusCode === 403) {
      await todoStore.fetchTodos()
    }
  } finally {
    deleteLoading.value = false
  }
}

const handlePageChange = async (page: number) => {
  await todoStore.setPage(page)
}

const handleFilterChange = async (filters: TodoQuery) => {
  await todoStore.setFilters(filters)
}

const handleResetFilters = async () => {
  todoStore.reset()
  await todoStore.fetchTodos()
}
</script>
