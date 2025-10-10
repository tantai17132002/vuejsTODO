<template>
  <div class="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100">
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
      />
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

// Lấy stores và i18n
const auth = useAuthStore();
const todoStore = useTodoStore();
const { t } = useI18n();

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

// Load todos khi component mount
onMounted(async () => {
  try {
    await todoStore.fetchTodos();
  } catch (error) {
    console.error('Error fetching todos:', error);
  }
});

// Hàm xử lý xóa todo
const handleDelete = (todo: any) => {
  deletingTodo.value = todo;
  showDeleteModal.value = true;
  deleteError.value = '';
};

// Hàm xử lý toggle trạng thái todo
const handleToggle = async (id: number) => {
  try {
    await todoStore.toggleTodo(id);
  } catch (error) {
    console.error('Error toggling todo:', error);
  }
};

// Hàm xử lý tạo todo thành công
const handleCreateSuccess = () => {
  showCreateModal.value = false;
};

// Hàm xử lý edit todo
const handleEdit = (todo: any) => {
  editingTodo.value = todo;
  showEditModal.value = true;
};

// Hàm xử lý edit success
const handleEditSuccess = () => {
  showEditModal.value = false;
  editingTodo.value = null;
};

// Hàm xử lý xác nhận xóa
const handleDeleteConfirm = async () => {
  if (!deletingTodo.value) return;
  
  try {
    deleteLoading.value = true;
    deleteError.value = '';
    
    await todoStore.deleteTodo(deletingTodo.value.id);
    
    // Đóng modal sau khi xóa thành công
    showDeleteModal.value = false;
    deletingTodo.value = null;
  } catch (error: any) {
    deleteError.value = error.response?.data?.message || 'Có lỗi xảy ra khi xóa todo';
    console.error('Error deleting todo:', error);
  } finally {
    deleteLoading.value = false;
  }
};

// Hàm xử lý thay đổi trang
const handlePageChange = async (page: number) => {
  try {
    await todoStore.changePage(page);
  } catch (error) {
    console.error('Error changing page:', error);
  }
};
</script>