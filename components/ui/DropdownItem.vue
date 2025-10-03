<template>
  <!-- Dropdown Item -->
  <button
    @click="handleClick"
    :class="itemClasses"
    :disabled="disabled"
    class="w-full px-3 py-2 text-left text-gray-700 hover:bg-purple-50 hover:text-purple-700 transition-all duration-300 flex items-center space-x-2 rounded-md hover:shadow-sm border border-transparent hover:border-purple-200 relative"
  >
    <!-- Slot cho icon/flag -->
    <div v-if="$slots.icon" class="flex-shrink-0">
      <slot name="icon" />
    </div>
    
    <!-- Slot cho content chính -->
    <div class="flex-1 min-w-0">
      <slot />
    </div>
    
    <!-- Slot cho action (tick, arrow, etc.) -->
    <div v-if="$slots.action" class="flex-shrink-0 ml-auto">
      <slot name="action" />
    </div>
  </button>
</template>

<script setup lang="ts">
// Props interface
interface Props {
  disabled?: boolean;
  active?: boolean;
  class?: string;
}

// Props
const props = withDefaults(defineProps<Props>(), {
  disabled: false,
  active: false,
  class: ''
});

// Emits
const emit = defineEmits<{
  click: [event: MouseEvent];
}>();

// Computed classes
const itemClasses = computed(() => [
  props.class,
  {
    'bg-purple-100 text-purple-700 shadow-sm border-purple-200': props.active,
    'opacity-50 cursor-not-allowed': props.disabled
  }
]);

// Methods
const handleClick = (event: MouseEvent) => {
  if (!props.disabled) {
    emit('click', event);
  }
};
</script>
