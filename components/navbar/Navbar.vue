<template>
  <!-- Navbar chính - fixed top, gradient background, full width, chiều cao 16 (64px) -->
  <nav
    class="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-gray-900 via-black to-gray-900 w-full h-16 flex items-center justify-between px-6 shadow-2xl backdrop-blur-sm border-b border-gray-800"
    role="navigation"
    aria-label="Main navigation"
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
        <!-- Dashboard button -->
        <BaseButton
          to="/dashboard"
          variant="ghost"
          width="fit"
          class="text-white hover:text-white border border-gray-600 hover:border-purple-500 hover:bg-purple-600/20 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/25 px-4"
        >
          {{ $t("navbar.dashboard.todo") }}
        </BaseButton>

        <!-- Avatar Dropdown -->
        <UiDropdown position="right" width="min" variant="avatar">
          <!-- Trigger - Avatar -->
          <template #trigger="{ isOpen }">
            <div 
              class="relative focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50 rounded-full"
              tabindex="0"
              role="button"
              :aria-label="`User menu for ${auth.user?.username || 'user'}`"
              @keydown.enter="() => {}"
              @keydown.space.prevent="() => {}"
            >
              <!-- Avatar container - kích thước bằng border Dashboard button -->
              <div
                class="relative w-10 h-10 rounded-full overflow-hidden cursor-pointer hover:scale-110 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/25"
              >
                <!-- Avatar content trực tiếp -->
                <div
                  class="w-full h-full bg-gray-800 rounded-full flex items-center justify-center"
                >
                  <!-- Avatar image hoặc initials -->
                  <img
                    v-if="auth.user?.avatar"
                    :src="auth.user.avatar"
                    :alt="auth.user.username"
                    class="w-full h-full object-cover rounded-full"
                  />
                  <div
                    v-else
                    class="w-full h-full bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm"
                  >
                    {{ getUserInitials(auth.user?.username) }}
                  </div>
                </div>
              </div>

              <!-- Online indicator -->
              <div
                class="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-gray-900 rounded-full"
              ></div>
            </div>
          </template>

          <!-- Dropdown Items -->
          <template #items="{ close }">
            <!-- User Info Header -->
            <div class="px-4 py-3 border-b border-gray-200 bg-gray-50">
              <div class="flex items-center space-x-3">
                <div
                  class="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white font-bold text-xs"
                >
                  {{ getUserInitials(auth.user?.username) }}
                </div>
                <div>
                  <p class="text-sm font-semibold text-gray-900">
                    {{ auth.user?.username }}
                  </p>
                  <p class="text-xs text-gray-500">{{ auth.user?.email }}</p>
                </div>
              </div>
            </div>

            <!-- Profile -->
            <UiDropdownItem @click="navigateWithClose('/dashboard', close)">
              <template #icon>
                <svg
                  class="w-4 h-4 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </template>
              {{ $t("navbar.profile") }}
            </UiDropdownItem>

            <!-- Settings -->
            <UiDropdownItem @click="navigateWithClose('/dashboard', close)">
              <template #icon>
                <svg
                  class="w-4 h-4 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                  />
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </template>
              {{ $t("navbar.settings") }}
            </UiDropdownItem>

            <!-- Divider -->
            <div class="border-t border-gray-200 my-1"></div>

            <!-- Logout -->
            <UiDropdownItem
              @click="handleLogoutClick(close)"
              class="text-red-600 hover:bg-red-50 hover:text-red-700"
            >
              <template #icon>
                <svg
                  class="w-4 h-4 text-red-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                  />
                </svg>
              </template>
              {{ $t("navbar.logout") }}
            </UiDropdownItem>
          </template>
        </UiDropdown>
      </div>

      <!-- Nếu chưa đăng nhập -->
      <div v-else class="flex items-center space-x-4">
        <!-- Nút đăng nhập -->
        <BaseButton
          to="/login"
          variant="ghost"
          width="fit"
          class="text-white hover:text-white border border-gray-600 hover:border-purple-500 hover:bg-purple-600/20 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/25 px-6 focus:outline-none focus:ring-0"
        >
          {{ $t("navbar.login") }}
        </BaseButton>

        <!-- Nút đăng ký -->
        <BaseButton
          to="/register"
          variant="ghost"
          width="fit"
          class="text-white hover:text-white border border-gray-600 hover:border-purple-500 hover:bg-purple-600/20 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/25 px-6 focus:outline-none focus:ring-0"
        >
          {{ $t("navbar.register") }}
        </BaseButton>
      </div>
    </div>
  </nav>

  <!-- Logout Confirmation Modal - Outside navbar for full page coverage -->
  <UiModal :is-open="showLogoutModal" @close="showLogoutModal = false">
    <TodoDeleteConfirmModal
      v-if="showLogoutModal"
      :todo="{
        id: 0,
        title: $t('navbar.logoutConfirmTitle'),
        description: $t('navbar.logoutConfirmMessage'),
      }"
      :loading="logoutLoading"
      :error="logoutError"
      :is-logout="true"
      @cancel="showLogoutModal = false"
      @confirm="handleLogoutConfirm"
    />
  </UiModal>
</template>

<script setup lang="ts">
import { useAuthStore } from "../../stores/auth";

// Lấy auth store
const auth = useAuthStore();

// Modal state management
const { setModalOpen } = useModalState();

// Logout modal state
const showLogoutModal = ref(false);
const logoutLoading = ref(false);
const logoutError = ref("");

// Watch logout modal state
watch(showLogoutModal, (isOpen) => {
  setModalOpen(isOpen);
}, { immediate: true });

// Hàm lấy initials từ username
const getUserInitials = (username: string | undefined) => {
  if (!username) return "U";

  const words = username.split(" ");
  if (words.length >= 2) {
    return (words[0][0] + words[1][0]).toUpperCase();
  }
  return username.substring(0, 2).toUpperCase();
};

// Hàm mở logout modal
const handleLogoutClick = (close: () => void) => {
  close();
  showLogoutModal.value = true;
  logoutError.value = "";
};

// Hàm xác nhận logout
const handleLogoutConfirm = async () => {
  try {
    logoutLoading.value = true;
    logoutError.value = "";

    // Clear auth state
    auth.clearAuth();

    // Đóng modal
    showLogoutModal.value = false;

    // Navigate to home
    await navigateTo("/");
  } catch (error: any) {
    logoutError.value =
      error.response?.data?.message || $t("navbar.logoutError");
  } finally {
    logoutLoading.value = false;
  }
};

// Hàm navigate với close dropdown
const navigateWithClose = (path: string, close: () => void) => {
  close();
  navigateTo(path);
};
</script>
