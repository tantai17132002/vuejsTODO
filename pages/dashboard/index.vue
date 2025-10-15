<template>
  <div class="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 relative z-0">
    <!-- Main Content -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Todo List Component -->
      <TodoList
        :todos="todoStore.todos"
        :loading="todoStore.loading"
        :error="todoStore.error"
        :current-page="todoStore.currentPage"
        :total-pages="todoStore.totalPages"
        :total-items="todoStore.totalItems"
        :items-per-page="todoStore.itemsPerPage"
        :show-pagination="todoStore.totalPages > 1"
        @toggle="handleToggle"
        @delete="handleDelete"
        @clear-error="todoStore.clearError"
        @open-create-modal="showCreateModal = true"
        @edit="handleEdit"
        @page-change="handlePageChange"
      >
        <!-- Filter Slot -->
        <template #header-actions>
          <TodoFilter 
            :current-filter="currentFilter"
            @filter-change="setFilter"
          />
        </template>
      </TodoList>
    </div>

    <!-- Create Todo Modal -->
    <UiModal :is-open="showCreateModal" @close="showCreateModal = false">
      <TodoCreateTodo
        @cancel="showCreateModal = false"
        @success="handleCreateSuccess"
      />
    </UiModal>

    <!-- Edit Todo Modal -->
    <UiModal :is-open="showEditModal" @close="showEditModal = false">
      <TodoEditTodo
        v-if="editingTodo"
        :todo="editingTodo"
        @cancel="showEditModal = false"
        @success="handleEditSuccess"
      />
    </UiModal>

    <!-- Delete Confirm Modal -->
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
// Import stores
import { useAuthStore } from "~/stores/auth";
import { useTodoStore } from "~/stores/todo";

// Lấy stores, i18n và API
const auth = useAuthStore();
const todoStore = useTodoStore();
const { t } = useI18n();
const { todoApi } = useApi();

// Modal state management
const { setModalOpen } = useModalState();

// Định nghĩa middleware để bảo vệ route
definePageMeta({
  middleware: 'auth'
});

// Modal state
const showCreateModal = ref(false);

// Edit modal state
const showEditModal = ref(false);
const editingTodo = ref(null);

// Delete modal state
const showDeleteModal = ref(false);
const deletingTodo = ref<any>(null);
const deleteLoading = ref(false);
const deleteError = ref('');

// Filter state
const currentFilter = ref('all'); // 'all', 'pending', 'completed'

// Watch all modal states and update global state
watch([showCreateModal, showEditModal, showDeleteModal], ([create, edit, deleteModal]) => {
  const anyModalOpen = create || edit || deleteModal;
  setModalOpen(anyModalOpen);
}, { immediate: true });

// Load todos khi component mount
onMounted(async () => {
  await todoApi.fetchTodos();
  // Cập nhật store sau khi fetch
  await todoStore.fetchTodos();
});

// Hàm xử lý xóa todo
const handleDelete = (todo: any) => {
  deletingTodo.value = todo;
  showDeleteModal.value = true;
  deleteError.value = '';
};

// Hàm xử lý toggle trạng thái todo
const handleToggle = async (id: number, isDone: boolean) => {
  await todoApi.toggleTodo(id, isDone);
  // Cập nhật store local
  const todo = todoStore.todos.find(t => t.id === id);
  if (todo) {
    todo.isDone = isDone;
  }
};

// Hàm xử lý tạo todo thành công
const handleCreateSuccess = async () => {
  showCreateModal.value = false;
  
  // Reset filter về "all" và refetch todos
  currentFilter.value = 'all';
  await todoStore.fetchTodos();
};

// Hàm xử lý edit todo
const handleEdit = (todo: any) => {
  editingTodo.value = todo;
  showEditModal.value = true;
};

// Hàm xử lý edit success
const handleEditSuccess = async () => {
  showEditModal.value = false;
  editingTodo.value = null;
  
  // Refetch todos để cập nhật dữ liệu
  await todoStore.fetchTodos();
};

// Hàm xử lý xác nhận xóa
const handleDeleteConfirm = async () => {
  if (!deletingTodo.value) return;
  
  try {
    deleteLoading.value = true;
    deleteError.value = '';
    
    // Sử dụng todoApi với toast tự động
    await todoApi.deleteTodo(deletingTodo.value.id);
    
    // Refetch todos để cập nhật dữ liệu
    await todoStore.fetchTodos();
    
    // Đóng modal sau khi xóa thành công
    showDeleteModal.value = false;
    deletingTodo.value = null;
        } catch (error: any) {
          deleteError.value = error.response?.data?.message || 'Có lỗi xảy ra khi xóa todo';
        } finally {
    deleteLoading.value = false;
  }
};


// Hàm xử lý thay đổi trang
const handlePageChange = async (page: number) => {
  await todoStore.changePage(page);
};

// Filter methods
const setFilter = async (filter: string) => {
  currentFilter.value = filter;
  
  // Gọi API với filter mới
  let isDone: boolean | undefined;
  if (filter === 'completed') {
    isDone = true;
  } else if (filter === 'pending') {
    isDone = false;
  } else {
    isDone = undefined; // 'all'
  }
  
  try {
    // Gọi API trực tiếp với axios
    const { $axios } = useNuxtApp();
    const params: any = { page: 1, limit: 10 };
    if (isDone !== undefined) {
      params.isDone = isDone;
    }
    
    const response = await $axios.get('/todos', { params });
    
    // Cập nhật store với dữ liệu từ API response
    if (response?.data) {
      todoStore.todos = response.data.todos || [];
      if (response.data.pagination) {
        todoStore.currentPage = response.data.pagination.page || 1;
        todoStore.totalPages = response.data.pagination.totalPages || 1;
        todoStore.totalItems = response.data.pagination.total || 0;
      }
    }
  } catch (error) {
    console.error('Error fetching filtered todos:', error);
    // Fallback: gọi lại store fetchTodos nếu có lỗi
    await todoStore.fetchTodos();
  }
};

const getFilterLabel = (filter: string) => {
  switch (filter) {
    case 'all':
      return t('dashboard.filterAll');
    case 'pending':
      return t('dashboard.filterPending');
    case 'completed':
      return t('dashboard.filterCompleted');
    default:
      return t('dashboard.filterAll');
  }
};
</script>