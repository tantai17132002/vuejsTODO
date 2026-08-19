<template>
  <div class="p-4 border-b border-gray-100 bg-gray-50 space-y-3">
    <div class="flex flex-col lg:flex-row gap-3">
      <label class="sr-only" for="todo-search">{{ $t('dashboard.search') }}</label>
      <input
        id="todo-search"
        v-model="searchInput"
        type="search"
        :placeholder="$t('dashboard.searchPlaceholder')"
        class="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
      />

      <select
        v-model="statusFilter"
        class="px-3 py-2 border border-gray-300 rounded-lg"
        :aria-label="$t('dashboard.filterBy')"
      >
        <option value="all">{{ $t('dashboard.filterAll') }}</option>
        <option value="pending">{{ $t('dashboard.filterPending') }}</option>
        <option value="completed">{{ $t('dashboard.filterCompleted') }}</option>
      </select>

      <select
        v-model="sortBy"
        class="px-3 py-2 border border-gray-300 rounded-lg"
        :aria-label="$t('dashboard.sortBy')"
      >
        <option value="createdAt">{{ $t('dashboard.sortCreatedAt') }}</option>
        <option value="updatedAt">{{ $t('dashboard.sortUpdatedAt') }}</option>
        <option value="title">{{ $t('dashboard.sortTitle') }}</option>
        <option value="isDone">{{ $t('dashboard.sortStatus') }}</option>
        <option value="id">{{ $t('dashboard.sortId') }}</option>
      </select>

      <select
        v-model="sortOrder"
        class="px-3 py-2 border border-gray-300 rounded-lg"
        :aria-label="$t('dashboard.sortOrder')"
      >
        <option value="desc">{{ $t('dashboard.sortDesc') }}</option>
        <option value="asc">{{ $t('dashboard.sortAsc') }}</option>
      </select>
    </div>

    <div class="flex flex-col sm:flex-row gap-3 items-end">
      <div class="flex-1">
        <label for="dateFrom" class="block text-xs text-gray-600 mb-1">{{ $t('dashboard.dateFrom') }}</label>
        <input
          id="dateFrom"
          v-model="dateFrom"
          type="date"
          class="w-full px-3 py-2 border border-gray-300 rounded-lg"
        />
      </div>
      <div class="flex-1">
        <label for="dateTo" class="block text-xs text-gray-600 mb-1">{{ $t('dashboard.dateTo') }}</label>
        <input
          id="dateTo"
          v-model="dateTo"
          type="date"
          class="w-full px-3 py-2 border border-gray-300 rounded-lg"
        />
      </div>
      <BaseButton variant="ghost" @click="$emit('reset')">
        {{ $t('dashboard.resetFilters') }}
      </BaseButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { TodoQuery } from '~/types/todo'

interface Props {
  query: TodoQuery
}

const props = defineProps<Props>()

const emit = defineEmits<{
  filterChange: [filters: TodoQuery]
  reset: []
}>()

const searchInput = ref(props.query.search || '')
const statusFilter = ref(props.query.isDone === true ? 'completed' : props.query.isDone === false ? 'pending' : 'all')
const dateFrom = ref(toDateInput(props.query.dateFrom))
const dateTo = ref(toDateInput(props.query.dateTo))
const sortBy = ref(props.query.sortBy || 'createdAt')
const sortOrder = ref(props.query.sortOrder || 'desc')

const ready = ref(false)
let syncing = false
let searchTimer: ReturnType<typeof setTimeout> | null = null

watch(
  () => props.query,
  (query) => {
    syncing = true
    searchInput.value = query.search || ''
    statusFilter.value = query.isDone === true ? 'completed' : query.isDone === false ? 'pending' : 'all'
    dateFrom.value = toDateInput(query.dateFrom)
    dateTo.value = toDateInput(query.dateTo)
    sortBy.value = query.sortBy || 'createdAt'
    sortOrder.value = query.sortOrder || 'desc'
    nextTick(() => {
      syncing = false
    })
  },
  { deep: true },
)

onMounted(() => {
  ready.value = true
})

watch(searchInput, (value) => {
  if (!ready.value || syncing) return
  if (searchTimer) clearTimeout(searchTimer)
  searchTimer = setTimeout(() => emitFilters({ search: value.trim() || undefined }), 400)
})

watch([statusFilter, dateFrom, dateTo, sortBy, sortOrder], () => {
  if (!ready.value || syncing) return
  emitFilters()
})

function emitFilters(extra: TodoQuery = {}) {
  const isDone = statusFilter.value === 'completed' ? true : statusFilter.value === 'pending' ? false : undefined
  emit('filterChange', {
    isDone,
    search: searchInput.value.trim() || undefined,
    dateFrom: dateFrom.value ? new Date(`${dateFrom.value}T00:00:00.000Z`).toISOString() : undefined,
    dateTo: dateTo.value ? new Date(`${dateTo.value}T23:59:59.999Z`).toISOString() : undefined,
    sortBy: sortBy.value as TodoQuery['sortBy'],
    sortOrder: sortOrder.value as TodoQuery['sortOrder'],
    ...extra,
  })
}

function toDateInput(iso?: string) {
  if (!iso) return ''
  return iso.slice(0, 10)
}

onUnmounted(() => {
  if (searchTimer) clearTimeout(searchTimer)
})
</script>
