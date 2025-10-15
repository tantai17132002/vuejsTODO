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

// Lấy stores, i18n và API
const todoStore = useTodoStore();
const { t } = useI18n();
const { todoApi } = useApi();
const router = useRouter();


// Reactive state
const loading = ref(false);
const error = ref('');

// Hàm xử lý cập nhật todo
const handleUpdate = async (data: { title: string; description?: string; isDone?: boolean }) => {
  try {
    loading.value = true;
    error.value = '';
    
    // Sử dụng todoApi với toast tự động
    const updatedTodo = await todoApi.updateTodo(props.todo.id, {
      title: data.title,
      description: data.description,
      isDone: data.isDone
    });
    
    // Cập nhật store với response từ API
    const index = todoStore.todos.findIndex(todo => todo.id === props.todo.id);
    if (index !== -1) {
      todoStore.todos[index] = updatedTodo.data || updatedTodo;
    }
    
    // Emit success event để đóng modal
    emit('success');
  } catch (err: any) {
    // Xử lý lỗi
    error.value = err.response?.data?.message || t('todoForm.updateError');
  } finally {
    loading.value = false;
  }
};

// Hàm xử lý hủy
const handleCancel = () => {
  emit('cancel');
};
</script>
