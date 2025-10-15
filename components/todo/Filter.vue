<template>
  <UiDropdown variant="avatar">
    <template #trigger>
      <BaseButton 
        variant="ghost" 
        size="md" 
        class="bg-white/20 hover:bg-white/30 text-white border-white/30 hover:border-white/50 flex items-center gap-2 transition-all duration-200 rounded-md"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"></path>
        </svg>
        <span>{{ getFilterLabel(currentFilter) }}</span>
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
        </svg>
      </BaseButton>
    </template>
    
    <template #items="{ close }">
      <div class="flex flex-col space-y-1 p-2">
        <DropdownItem 
          @click="() => { $emit('filterChange', 'all'); close(); }" 
          :active="currentFilter === 'all'" 
          class="!flex !items-center !gap-3 !px-4 !py-3 !rounded-lg !transition-all !duration-200 hover:!bg-purple-50 hover:!text-purple-700 !cursor-pointer group"
          :class="currentFilter === 'all' ? '!bg-purple-100 !text-purple-800 !font-medium' : '!text-gray-700'"
        >
          <template #icon>
            <div class="flex items-center justify-center w-8 h-8 rounded-full transition-all duration-200"
                 :class="currentFilter === 'all' ? 'bg-purple-200 text-purple-700' : 'bg-gray-100 text-gray-500 group-hover:bg-purple-200 group-hover:text-purple-600'">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 10h16M4 14h16M4 18h16"></path>
              </svg>
            </div>
          </template>
          <div class="flex flex-col">
            <span class="font-medium">{{ $t('dashboard.filterAll') }}</span>
            <span class="text-xs text-gray-500 mt-0.5">{{ $t('dashboard.filterAllDescription') }}</span>
          </div>
        </DropdownItem>
        
        <DropdownItem 
          @click="() => { $emit('filterChange', 'pending'); close(); }" 
          :active="currentFilter === 'pending'" 
          class="!flex !items-center !gap-3 !px-4 !py-3 !rounded-lg !transition-all !duration-200 hover:!bg-orange-50 hover:!text-orange-700 !cursor-pointer group"
          :class="currentFilter === 'pending' ? '!bg-orange-100 !text-orange-800 !font-medium' : '!text-gray-700'"
        >
          <template #icon>
            <div class="flex items-center justify-center w-8 h-8 rounded-full transition-all duration-200"
                 :class="currentFilter === 'pending' ? 'bg-orange-200 text-orange-700' : 'bg-gray-100 text-gray-500 group-hover:bg-orange-200 group-hover:text-orange-600'">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
          </template>
          <div class="flex flex-col">
            <span class="font-medium">{{ $t('dashboard.filterPending') }}</span>
            <span class="text-xs text-gray-500 mt-0.5">{{ $t('dashboard.filterPendingDescription') }}</span>
          </div>
        </DropdownItem>
        
        <DropdownItem 
          @click="() => { $emit('filterChange', 'completed'); close(); }" 
          :active="currentFilter === 'completed'" 
          class="!flex !items-center !gap-3 !px-4 !py-3 !rounded-lg !transition-all !duration-200 hover:!bg-green-50 hover:!text-green-700 !cursor-pointer group"
          :class="currentFilter === 'completed' ? '!bg-green-100 !text-green-800 !font-medium' : '!text-gray-700'"
        >
          <template #icon>
            <div class="flex items-center justify-center w-8 h-8 rounded-full transition-all duration-200"
                 :class="currentFilter === 'completed' ? 'bg-green-200 text-green-700' : 'bg-gray-100 text-gray-500 group-hover:bg-green-200 group-hover:text-green-600'">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
          </template>
          <div class="flex flex-col">
            <span class="font-medium">{{ $t('dashboard.filterCompleted') }}</span>
            <span class="text-xs text-gray-500 mt-0.5">{{ $t('dashboard.filterCompletedDescription') }}</span>
          </div>
        </DropdownItem>
      </div>
    </template>
  </UiDropdown>
</template>

<script setup lang="ts">
// Import i18n
const { t } = useI18n();

// Props
interface Props {
  currentFilter?: string
}

const props = withDefaults(defineProps<Props>(), {
  currentFilter: 'all'
})

// Emits
const emit = defineEmits<{
  filterChange: [filter: string]
}>()

// Methods
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
