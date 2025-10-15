<template>
  <FormsTodoForm
    :loading="loading"
    :error="error"
    @submit="handleCreate"
    @cancel="handleCancel"
  />
</template>

<script setup lang="ts">
// Import stores
import { useTodoStore } from "~/stores/todo";

// Emits
const emit = defineEmits<{
  cancel: []
  success: []
}>();

// Lấy stores, i18n và API
const todoStore = useTodoStore();
const { t } = useI18n();
const { todoApi } = useApi();

// Reactive state
const loading = ref(false);
const error = ref('');

// Hàm xử lý tạo todo mới
const handleCreate = async (data: { title: string; description?: string; isDone?: boolean }) => {
  try {
    loading.value = true;
    error.value = '';
    
    // Sử dụng todoApi với toast tự động
    const newTodo = await todoApi.createTodo({
      title: data.title,
      description: data.description
    });
    
    // Cập nhật store với response từ API
    todoStore.todos.unshift(newTodo.data || newTodo);
    
    // Emit success event để đóng modal
    emit('success');
  } catch (err: any) {
    // Xử lý lỗi
    error.value = err.response?.data?.message || t('todoForm.createError');
  } finally {
    loading.value = false;
  }
};

// Hàm xử lý hủy
const handleCancel = () => {
  emit('cancel');
};
</script>
