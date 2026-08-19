<template>
  <nav
    class="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-gray-900 via-black to-gray-900 w-full h-16 flex items-center justify-between px-6 shadow-2xl backdrop-blur-sm border-b border-gray-800"
    role="navigation"
    aria-label="Main navigation"
  >
    <div
      class="flex items-center space-x-4 cursor-pointer hover:opacity-80 transition-all duration-300 hover:scale-105"
      @click="() => navigateTo('/')"
    >
      <div class="relative">
        <div class="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg blur-sm opacity-75" />
        <div class="relative bg-black rounded-lg p-1">
          <img
            src="/logo.svg"
            :alt="$t('navbar.name')"
            class="w-10 h-10 object-contain rounded-lg"
          />
        </div>
      </div>
      <div class="flex flex-col">
        <span class="text-xl font-bold leading-tight bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
          {{ $t("navbar.name") }}
        </span>
        <span class="text-gray-300 text-sm font-medium">{{ $t("navbar.description") }}</span>
      </div>
    </div>

    <div class="flex items-center space-x-4">
      <NavbarLanguageSwitcher />

      <div v-if="auth.initializing" class="h-10 w-40 rounded-lg bg-gray-800 animate-pulse" aria-hidden="true" />

      <div v-else-if="auth.user" class="flex items-center space-x-4">
        <BaseButton
          to="/dashboard"
          variant="ghost"
          width="fit"
          class="text-white hover:text-white border border-gray-600 hover:border-purple-500 hover:bg-purple-600/20 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/25 px-4"
        >
          {{ $t("navbar.dashboard.todo") }}
        </BaseButton>

        <BaseButton
          v-if="auth.isAdmin"
          to="/users"
          variant="ghost"
          width="fit"
          class="text-white hover:text-white border border-gray-600 hover:border-purple-500 hover:bg-purple-600/20 transition-all duration-300 px-4"
        >
          {{ $t("navbar.dashboard.user") }}
        </BaseButton>

        <UiDropdown position="right" width="min" variant="avatar">
          <template #trigger>
            <div
              class="relative focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50 rounded-full"
              tabindex="0"
              role="button"
              :aria-label="$t('navbar.userMenu', { username: auth.user.username })"
            >
              <div class="relative w-10 h-10 rounded-full overflow-hidden cursor-pointer hover:scale-110 transition-all duration-300">
                <div class="w-full h-full bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                  {{ getUserInitials(auth.user.username) }}
                </div>
              </div>
            </div>
          </template>

          <template #items="{ close }">
            <div class="px-4 py-3 border-b border-gray-200 bg-gray-50">
              <p class="text-sm font-semibold text-gray-900">{{ auth.user.username }}</p>
              <p class="text-xs text-gray-500">{{ roleLabel }}</p>
            </div>

            <UiDropdownItem @click="navigateWithClose('/profile', close)">
              {{ $t("navbar.profile") }}
            </UiDropdownItem>

            <div class="border-t border-gray-200 my-1" />

            <UiDropdownItem
              class="text-red-600 hover:bg-red-50 hover:text-red-700"
              @click="handleLogoutClick(close)"
            >
              {{ $t("navbar.logout") }}
            </UiDropdownItem>
          </template>
        </UiDropdown>
      </div>

      <div v-else class="flex items-center space-x-4">
        <BaseButton
          to="/login"
          variant="ghost"
          width="fit"
          class="text-white hover:text-white border border-gray-600 hover:border-purple-500 hover:bg-purple-600/20 transition-all duration-300 px-6"
        >
          {{ $t("navbar.login") }}
        </BaseButton>
        <BaseButton
          to="/register"
          variant="ghost"
          width="fit"
          class="text-white hover:text-white border border-gray-600 hover:border-purple-500 hover:bg-purple-600/20 transition-all duration-300 px-6"
        >
          {{ $t("navbar.register") }}
        </BaseButton>
      </div>
    </div>
  </nav>

  <UiModal :is-open="showLogoutModal" @close="showLogoutModal = false">
    <TodoDeleteConfirmModal
      v-if="showLogoutModal"
      :todo="{
        id: 0,
        title: $t('navbar.logoutConfirmTitle'),
        description: $t('navbar.logoutConfirmMessage'),
        isDone: false,
        ownerId: 0,
        createdAt: '',
        updatedAt: '',
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
const auth = useAuthStore()
const { t } = useI18n()
const { setModalOpen } = useModalState()

const showLogoutModal = ref(false)
const logoutLoading = ref(false)
const logoutError = ref('')

const roleLabel = computed(() =>
  auth.user?.role === 'admin' ? t('users.roleAdmin') : t('users.roleUser'),
)

watch(showLogoutModal, (isOpen) => {
  setModalOpen(isOpen)
}, { immediate: true })

const getUserInitials = (username: string | undefined) => {
  if (!username) return 'U'
  return username.substring(0, 2).toUpperCase()
}

const handleLogoutClick = (close: () => void) => {
  close()
  showLogoutModal.value = true
  logoutError.value = ''
}

const handleLogoutConfirm = async () => {
  try {
    logoutLoading.value = true
    logoutError.value = ''
    showLogoutModal.value = false
    setModalOpen(false)
    auth.logout()
    await navigateTo('/login')
  } catch {
    logoutError.value = t('navbar.logoutError')
  } finally {
    logoutLoading.value = false
  }
}

const navigateWithClose = (path: string, close: () => void) => {
  close()
  navigateTo(path)
}
</script>
