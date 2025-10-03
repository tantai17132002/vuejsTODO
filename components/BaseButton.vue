<template>
  <!-- Mode 1: NuxtLink cho navigation -->
  <NuxtLink v-if="isLink" :to="to" :class="buttonClasses" v-bind="$attrs" @click="handleNavigation">
    <slot />
  </NuxtLink>

  <!-- Mode 2: Button thường cho click actions -->
  <button
    v-else
    :type="type"
    :disabled="disabled"
    :class="buttonClasses"
    v-bind="$attrs"
    @click="handleClick"
  >
    <slot />
  </button>
</template>

<script setup lang="ts">
// Định nghĩa interface cho các props của component
interface Props {
  to?: string | object; // Đường dẫn để điều hướng (nếu có sẽ dùng NuxtLink)
  type?: "button" | "submit" | "reset"; // Loại button HTML
  variant?: "primary" | "secondary" | "ghost" | "danger" | "success"; // Kiểu màu sắc
  size?: "sm" | "md" | "lg"; // Kích thước button
  width?: "auto" | "full" | "fit" | "equal"; // Chiều rộng button
  disabled?: boolean; // Trạng thái vô hiệu hóa
}

// Định nghĩa props với giá trị mặc định
const props = withDefaults(defineProps<Props>(), {
  type: "button", // Mặc định là button thường
  variant: "primary", // Mặc định màu xanh
  size: "md", // Mặc định kích thước trung bình
  width: "auto", // Mặc định chiều rộng tự động
  disabled: false, // Mặc định không bị vô hiệu hóa
});

// Emit events để parent component có thể handle
const emit = defineEmits<{
  click: [event: MouseEvent];
}>();

// Computed: Xác định mode dựa trên props
// Mode 1: NuxtLink (có 'to' prop) - cho navigation
// Mode 2: Button thường (không có 'to') - cho click actions
const isLink = computed(() => {
  return !!props.to; // Có 'to' prop = NuxtLink mode
});

// Method: Xử lý click event
const handleClick = (event: MouseEvent) => {
  // Emit click event để parent có thể handle
  emit("click", event);

  // Nếu có prop 'to', NuxtLink sẽ tự động xử lý navigation
  // Nếu không có 'to', parent có thể handle logic khác
};

// Method: Xử lý navigation để blur focus
const handleNavigation = () => {
  // Tự động blur focus sau khi navigate
  if (isLink.value) {
    setTimeout(() => {
      if (document.activeElement instanceof HTMLElement) {
        document.activeElement.blur();
      }
    }, 100);
  }
};

// Các class CSS cơ bản cho button
// Bao gồm: layout, font, transition, focus states, disabled states, cursor
const baseClasses =
  "inline-flex items-center justify-center font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer";

// Computed: Tạo class CSS cho kích thước button
const sizeClasses = computed(() => {
  switch (props.size) {
    case "sm":
      return "px-3 py-1.5 text-sm rounded-md"; // Nhỏ: padding ít, text nhỏ
    case "lg":
      return "px-6 py-3 text-lg rounded-lg"; // Lớn: padding nhiều, text lớn
    default:
      return "px-4 py-2 text-base rounded-md"; // Trung bình: padding và text vừa
  }
});

// Computed: Tạo class CSS cho chiều rộng button
const widthClasses = computed(() => {
  switch (props.width) {
    case "full":
      return "w-full"; // Chiều rộng 100%
    case "fit":
      return "w-fit"; // Chiều rộng vừa với nội dung
    case "equal":
      return "w-24"; // Chiều rộng cố định để các button bằng nhau
    default:
      return "w-auto"; // Chiều rộng tự động (mặc định)
  }
});

// Computed: Tạo class CSS cho màu sắc button
const variantClasses = computed(() => {
  switch (props.variant) {
    case "primary":
      return "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500"; // Xanh dương
    case "secondary":
      return "bg-gray-600 text-white hover:bg-gray-700 focus:ring-gray-500"; // Xám
    case "ghost":
      return "bg-transparent text-gray-700 hover:bg-gray-100 focus:ring-gray-500 border border-transparent"; // Trong suốt với border transparent
    case "danger":
      return "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500"; // Đỏ
    case "success":
      return "bg-green-600 text-white hover:bg-green-700 focus:ring-green-500"; // Xanh lá
    default:
      return "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500"; // Mặc định xanh dương
  }
});

// Computed: Kết hợp tất cả các class CSS
const buttonClasses = computed(() => {
  return [
    baseClasses, // Class cơ bản
    sizeClasses.value, // Class kích thước
    widthClasses.value, // Class chiều rộng
    variantClasses.value, // Class màu sắc
  ].join(" "); // Nối các class bằng dấu cách
});
</script>
