<template>
  <!-- Navbar chính - fixed top, gradient background, full width, chiều cao 16 (64px) -->
  <nav
    class="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-gray-900 via-black to-gray-900 w-full h-16 flex items-center justify-between px-6 shadow-2xl backdrop-blur-sm border-b border-gray-800"
  >
    <!-- Logo và tên ứng dụng bên trái -->
    <div
      class="flex items-center space-x-4 cursor-pointer hover:opacity-80 transition-all duration-300 hover:scale-105"
      @click="() => navigateTo('/')"
    >
      <!-- Container cho logo với gradient border -->
      <div class="relative">
        <div
          class="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg blur-sm opacity-75"
        ></div>
        <div class="relative bg-black rounded-lg p-1">
          <img
            src="/logoSchedule.png"
            alt="ToDo Application Logo"
            class="w-10 h-10 object-contain rounded-lg"
          />
        </div>
      </div>

      <!-- Text thông tin ứng dụng -->
      <div class="flex flex-col">
        <!-- Tên chính của ứng dụng với gradient text -->
        <span
          class="text-xl font-bold leading-tight bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent"
        >
          {{ $t("navbar.name") }}
        </span>
        <!-- Mô tả phụ -->
        <span class="text-gray-300 text-sm font-medium">{{
          $t("navbar.description")
        }}</span>
      </div>
    </div>

    <!-- Menu điều hướng bên phải -->
    <div class="flex items-center space-x-4">
      <!-- Language Switcher -->
      <NavbarLanguageSwitcher />
      
      <!-- Nếu đã đăng nhập -->
      <div v-if="auth.isLoggedIn" class="flex items-center space-x-4">
        <!-- User info -->
        <span class="text-white text-sm">
          {{ auth.user?.name || auth.user?.email || 'User' }}
        </span>
        <!-- Dashboard button -->
        <BaseButton
          to="/dashboard"
          variant="ghost"
          width="fit"
          class="text-white hover:text-white border border-gray-600 hover:border-purple-500 hover:bg-purple-600/20 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/25 px-4"
        >
          Dashboard
        </BaseButton>
        <!-- Logout button -->
        <BaseButton
          @click="logout"
          variant="ghost"
          width="fit"
          class="text-white hover:text-white border border-gray-600 hover:border-red-500 hover:bg-red-600/20 transition-all duration-300 hover:shadow-lg hover:shadow-red-500/25 px-4"
        >
          Logout
        </BaseButton>
      </div>
      
      <!-- Nếu chưa đăng nhập -->
      <div v-else class="flex items-center space-x-4">
        <!-- Nút đăng nhập -->
        <BaseButton
          to="/login"
          variant="ghost"
          width="fit"
          class="text-white hover:text-white border border-gray-600 hover:border-purple-500 hover:bg-purple-600/20 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/25 px-6"
        >
          {{ $t("navbar.login") }}
        </BaseButton>

        <!-- Nút đăng ký -->
        <BaseButton
          to="/register"
          variant="ghost"
          width="fit"
          class="text-white hover:text-white border border-gray-600 hover:border-purple-500 hover:bg-purple-600/20 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/25 px-6"
        >
          {{ $t("navbar.register") }}
        </BaseButton>
      </div>
    </div>
  </nav>
</template>

<script setup>
/**
 * Navbar Component - Component thanh điều hướng
 * 
 * 🎯 CHỨC NĂNG:
 * - Hiển thị logo và tên app
 * - Language switcher
 * - Login/Register buttons (khi chưa đăng nhập)
 * - User info và Dashboard/Logout buttons (khi đã đăng nhập)
 * - Responsive design
 * 
 * 🔧 AUTH INTEGRATION:
 * - Sử dụng auth store để kiểm tra trạng thái đăng nhập
 * - Hiển thị thông tin user khi đã đăng nhập
 * - Cung cấp logout functionality
 */

// Import auth store để quản lý authentication
import { useAuthStore } from "../../stores/auth";

// Lấy auth store
const auth = useAuthStore();

// Hàm logout
const logout = () => {
  auth.clearAuth();
  navigateTo('/');
};
</script>
