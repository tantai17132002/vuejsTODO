<template>
  <div
    v-if="isOpen"
    class="fixed inset-0 z-50 overflow-y-auto"
    @click="handleBackdropClick"
  >
    <!-- Backdrop -->
    <div
      class="fixed inset-0 bg-gray-900/30 backdrop-blur-sm transition-opacity"
    ></div>

    <!-- Modal Container -->
    <div class="flex min-h-screen items-center justify-center p-4">
      <div class="relative w-full max-w-2xl" @click.stop>
        <!-- Modal Content - No background, just the form -->
        <slot />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Props
interface Props {
  isOpen: boolean;
  closeOnBackdrop?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  closeOnBackdrop: true,
});

// Emits
const emit = defineEmits<{
  close: [];
}>();
// Methods
const handleBackdropClick = () => {
  if (props.closeOnBackdrop) {
    emit("close");
  }
};

// Close on escape key
onMounted(() => {
  const handleEscape = (e: KeyboardEvent) => {
    if (e.key === "Escape" && props.isOpen) {
      emit("close");
    }
  };

  document.addEventListener("keydown", handleEscape);

  onUnmounted(() => {
    document.removeEventListener("keydown", handleEscape);
  });
});
</script>
