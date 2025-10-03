<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <div class="bg-white shadow">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center py-6">
          <div>
            <h1 class="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p class="text-gray-600">Welcome to your dashboard</p>
          </div>
          <div class="flex items-center space-x-4">
            <span class="text-sm text-gray-500">Hello, {{ auth.user?.name || auth.user?.email || 'User' }}</span>
            <BaseButton @click="logout" variant="outline" size="sm">
              Logout
            </BaseButton>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <!-- User Info Card -->
        <div class="bg-white rounded-lg shadow p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">User Information</h3>
          <div class="space-y-2">
            <p><span class="font-medium">Name:</span> {{ auth.user?.name || 'N/A' }}</p>
            <p><span class="font-medium">Email:</span> {{ auth.user?.email || 'N/A' }}</p>
            <p><span class="font-medium">ID:</span> {{ auth.user?.id || 'N/A' }}</p>
          </div>
        </div>

        <!-- Auth Status Card -->
        <div class="bg-white rounded-lg shadow p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Authentication Status</h3>
          <div class="space-y-2">
            <p><span class="font-medium">Status:</span> 
              <span :class="auth.isLoggedIn ? 'text-green-600' : 'text-red-600'">
                {{ auth.isLoggedIn ? 'Logged In' : 'Not Logged In' }}
              </span>
            </p>
            <p><span class="font-medium">Token:</span> {{ auth.token ? 'Present' : 'Missing' }}</p>
          </div>
        </div>

        <!-- Quick Actions Card -->
        <div class="bg-white rounded-lg shadow p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div class="space-y-2">
            <BaseButton @click="refreshUser" variant="outline" size="sm" class="w-full">
              Refresh User Info
            </BaseButton>
            <BaseButton @click="logout" variant="outline" size="sm" class="w-full">
              Logout
            </BaseButton>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
/**
 * Dashboard Page - Trang dashboard
 * 
 * 🎯 CHỨC NĂNG:
 * - Hiển thị thông tin user đã đăng nhập
 * - Hiển thị trạng thái authentication
 * - Cung cấp quick actions (refresh, logout)
 * - Protected by auth middleware
 * 
 * 🔧 MIDDLEWARE:
 * - Sử dụng auth middleware để bảo vệ route
 * - Tự động redirect nếu chưa đăng nhập
 * - Load user info nếu cần thiết
 */

// Import auth store để quản lý authentication
import { useAuthStore } from "../stores/auth";

// Lấy auth store
const auth = useAuthStore();

// Định nghĩa middleware để bảo vệ route
definePageMeta({
  middleware: 'auth'
});

// Hàm refresh user info
const refreshUser = async () => {
  try {
    await auth.fetchMe();
  } catch (error) {
    console.error('Error refreshing user:', error);
  }
};

// Hàm logout
const logout = () => {
  auth.clearAuth();
  navigateTo('/login');
};
</script>