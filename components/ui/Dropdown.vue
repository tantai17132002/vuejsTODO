<template>
  <!-- Dropdown Container -->
  <div class="relative" ref="dropdownRef">
    <!-- Trigger Button -->
    <button
      @click="toggleDropdown"
      :class="triggerClasses"
      :disabled="disabled"
    >
      <!-- Slot cho trigger content -->
      <slot name="trigger" :isOpen="isOpen" />
    </button>

    <!-- Dropdown Menu -->
    <Transition
      enter-active-class="transition ease-out duration-200"
      enter-from-class="opacity-0 scale-95"
      enter-to-class="opacity-100 scale-100"
      leave-active-class="transition ease-in duration-150"
      leave-from-class="opacity-100 scale-100"
      leave-to-class="opacity-0 scale-95"
    >
      <div
        v-if="isOpen"
        :class="menuClasses"
        class="absolute z-50 mt-2 w-full min-w-max bg-white rounded-lg shadow-xl border border-gray-200 py-2 px-2 backdrop-blur-sm overflow-hidden"
      >
        <!-- Dropdown Items -->
        <slot name="items" :close="closeDropdown" />
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
// Props interface
interface Props {
  disabled?: boolean;
  triggerClass?: string;
  menuClass?: string;
  position?: 'left' | 'right' | 'center';
  width?: 'auto' | 'full' | 'min';
}

// Props với default values
const props = withDefaults(defineProps<Props>(), {
  disabled: false,
  triggerClass: '',
  menuClass: '',
  position: 'right',
  width: 'auto'
});

// Reactive state
const isOpen = ref(false);
const dropdownRef = ref<HTMLElement | null>(null);

// Computed classes
const triggerClasses = computed(() => [
  'flex items-center space-x-2 px-3 py-2 text-white hover:text-white border border-gray-600 hover:border-purple-500 hover:bg-purple-600/20 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/25 rounded-lg',
  props.triggerClass
]);

const menuClasses = computed(() => {
  const positionClasses = {
    left: 'left-0',
    right: 'right-0',
    center: 'left-1/2 transform -translate-x-1/2'
  };
  
  const widthClasses = {
    auto: 'w-auto',
    full: 'w-full',
    min: 'w-44'
  };
  
  return [
    positionClasses[props.position],
    widthClasses[props.width],
    props.menuClass
  ];
});

// Methods
const toggleDropdown = () => {
  if (!props.disabled) {
    isOpen.value = !isOpen.value;
  }
};

const closeDropdown = () => {
  isOpen.value = false;
};

// Click outside to close
let handleClickOutside: ((event: MouseEvent) => void) | null = null;

onMounted(() => {
  handleClickOutside = (event: MouseEvent) => {
    const target = event.target as HTMLElement;
    if (!target.closest('.relative')) {
      isOpen.value = false;
    }
  };

  document.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
  if (handleClickOutside) {
    document.removeEventListener('click', handleClickOutside);
  }
});

// Expose methods for parent component
defineExpose({
  isOpen: readonly(isOpen),
  toggleDropdown,
  closeDropdown
});
</script>
