<template>
  <FormsTodoForm
    :loading="loading"
    :error="error"
    :initial-data="todo"
    @submit="handleUpdate"
    @cancel="handleCancel"
  />
</template>

<script setup lang="ts">
// Import stores
import { useTodoStore } from "~/stores/todo";
import type { Todo } from "~/stores/todo";

// Props
interface Props {
  todo: Todo
}

const props = defineProps<Props>();

// Emits
const emit = defineEmits<{
  cancel: []
  success: []
}>();

// Lấy stores và i18n
const todoStore = useTodoStore();
const { t } = useI18n();
const router = useRouter();

// Định nghĩa middleware để bảo vệ route
definePageMeta({
  middleware: 'auth'
});

// Reactive state
const loading = ref(false);
const error = ref('');

// Hàm xử lý cập nhật todo
const handleUpdate = async (data: { title: string; description?: string; isDone?: boolean }) => {
  try {
    loading.value = true;
    error.value = '';
    
    // Gọi API cập nhật todo
    await todoStore.updateTodo(props.todo.id, {
      title: data.title,
      description: data.description,
      isDone: data.isDone
    });
    
    // Emit success event để đóng modal
    emit('success');
  } catch (err: any) {
    // Xử lý lỗi
    error.value = err.response?.data?.message || 'Có lỗi xảy ra khi cập nhật todo';
    console.error('Error updating todo:', err);
  } finally {
    loading.value = false;
  }
};

// Hàm xử lý hủy
const handleCancel = () => {
  emit('cancel');
};
</script>
