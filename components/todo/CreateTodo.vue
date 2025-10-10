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

// Lấy stores và i18n
const todoStore = useTodoStore();
const { t } = useI18n();

// Reactive state
const loading = ref(false);
const error = ref('');

// Hàm xử lý tạo todo mới
const handleCreate = async (data: { title: string; description?: string; isDone?: boolean }) => {
  try {
    loading.value = true;
    error.value = '';
    
    // Gọi API tạo todo mới
    await todoStore.addTodo({
      title: data.title,
      description: data.description
    });
    
    // Emit success event để đóng modal
    emit('success');
  } catch (err: any) {
    // Xử lý lỗi
    error.value = err.response?.data?.message || 'Có lỗi xảy ra khi tạo todo';
    console.error('Error creating todo:', err);
  } finally {
    loading.value = false;
  }
};

// Hàm xử lý hủy
const handleCancel = () => {
  emit('cancel');
};
</script>
