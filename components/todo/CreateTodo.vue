<template>
  <FormsTodoForm
    :loading="loading"
    :error="error"
    @submit="handleCreate"
    @cancel="handleCancel"
  />
</template>

<script setup lang="ts">
const emit = defineEmits<{
  cancel: []
  success: []
}>()

const todoStore = useTodoStore()
const { t } = useI18n()
const loading = ref(false)
const error = ref('')

const handleCreate = async (data: { title: string; description?: string; isDone?: boolean }) => {
  try {
    loading.value = true
    error.value = ''
    await todoStore.createTodo({
      title: data.title.trim(),
      description: data.description,
    })
    emit('success')
  } catch {
    error.value = t('todoForm.createError')
  } finally {
    loading.value = false
  }
}

const handleCancel = () => {
  emit('cancel')
}
</script>
