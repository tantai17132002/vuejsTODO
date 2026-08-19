<template>
  <FormsTodoForm
    :loading="loading"
    :error="error"
    :initial-data="todo"
    :is-edit="true"
    @submit="handleUpdate"
    @cancel="handleCancel"
  />
</template>

<script setup lang="ts">
import type { Todo } from '~/types/todo'

interface Props {
  todo: Todo
}

const props = defineProps<Props>()

const emit = defineEmits<{
  cancel: []
  success: []
}>()

const todoStore = useTodoStore()
const { t } = useI18n()
const loading = ref(false)
const error = ref('')

const handleUpdate = async (data: { title: string; description?: string; isDone?: boolean }) => {
  const title = data.title.trim()
  const hasChange =
    title !== props.todo.title
    || (data.description || '') !== (props.todo.description || '')
    || data.isDone !== props.todo.isDone

  if (!hasChange) {
    error.value = t('todoForm.noChanges')
    return
  }

  try {
    loading.value = true
    error.value = ''
    await todoStore.updateTodo(props.todo.id, {
      title,
      description: data.description,
      isDone: data.isDone,
    })
    emit('success')
  } catch {
    error.value = t('todoForm.updateError')
  } finally {
    loading.value = false
  }
}

const handleCancel = () => {
  emit('cancel')
}
</script>
