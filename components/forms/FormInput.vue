<template>
  <!-- Container chính cho input field -->
  <div>
    <!-- Label cho input -->
    <label
      :for="id"
      class="block text-base font-semibold text-gray-700 mb-3"
    >
      {{ label }}
    </label>
    
    <!-- Container cho input với icon -->
    <div class="relative">
      <!-- Icon bên trái input -->
      <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
        <!-- Slot để custom icon từ component cha -->
        <slot name="icon">
          <!-- Default icon nếu không có slot -->
          <svg class="h-6 w-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </slot>
      </div>
      
      <!-- Input field chính -->
      <input
        :id="id"
        :value="modelValue"
        v-bind="$attrs"
        :type="type"
        :placeholder="placeholder"
        :class="inputClasses"
        @input="$emit('update:modelValue', $event.target.value)"
      />
    </div>
    
    <!-- Hiển thị lỗi validation nếu có -->
    <div v-if="error" class="mt-2 text-sm text-red-600">
      {{ error }}
    </div>
  </div>
</template>

<script setup lang="ts">
// Định nghĩa interface cho props
interface Props {
  id: string;           // ID unique cho input
  label: string;         // Text hiển thị label
  modelValue: string;   // Giá trị input (v-model)
  type?: string;        // Loại input (text, password, email...)
  placeholder?: string;  // Text placeholder
  error?: string;       // Thông báo lỗi validation
}

// Khai báo props với giá trị mặc định
const props = withDefaults(defineProps<Props>(), {
  type: 'text',         // Mặc định là text input
  placeholder: '',      // Mặc định không có placeholder
  error: ''            // Mặc định không có lỗi
});

// Định nghĩa events mà component có thể emit
const emit = defineEmits<{
  'update:modelValue': [value: string];  // Event cho v-model
}>();

// Computed classes cho input styling
const inputClasses = computed(() => [
  // Base classes - styling cơ bản
  'block w-full pl-12 pr-4 py-4 border rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 text-base',
  // Conditional classes - styling theo trạng thái
  props.error ? 'border-red-300 bg-red-50' : 'border-gray-300'  // Đỏ nếu có lỗi, xám nếu bình thường
]);
</script>
