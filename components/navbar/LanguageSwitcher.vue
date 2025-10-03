<template>
  <!-- Language Switcher Component sử dụng Dropdown chung -->
  <UiDropdown position="right" width="min" variant="default">
    <!-- Trigger Button -->
    <template #trigger="{ isOpen }">
      <!-- Icon ngôn ngữ -->
      <svg
        class="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129"
        />
      </svg>
      <!-- Tên ngôn ngữ hiện tại -->
      <span class="text-sm font-medium">{{ currentLocaleName }}</span>
      <!-- Icon mũi tên -->
      <svg
        class="w-4 h-4 transition-transform duration-200"
        :class="{ 'rotate-180': isOpen }"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M19 9l-7 7-7-7"
        />
      </svg>
    </template>

    <!-- Dropdown Items -->
    <template #items="{ close }">
      <UiDropdownItem
        v-for="locale in availableLocales"
        :key="locale.code"
        :active="locale.code === $i18n.locale"
        @click="switchLanguage(locale.code, close)"
      >
        <!-- Icon cờ -->
        <template #icon>
          <div class="w-6 h-4 rounded-md border border-gray-200 shadow-sm overflow-hidden hover:shadow-md transition-all duration-300 hover:scale-105">
            <!-- Cờ Việt Nam -->
            <svg
              v-if="locale.code === 'vi'"
              class="w-full h-full iconify iconify--twemoji"
              viewBox="0 0 36 36"
              xmlns="http://www.w3.org/2000/svg"
              xmlns:xlink="http://www.w3.org/1999/xlink"
              aria-hidden="true"
              role="img"
              preserveAspectRatio="xMidYMid meet"
              fill="#000000"
            >
              <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
              <g
                id="SVGRepo_tracerCarrier"
                stroke-linecap="round"
                stroke-linejoin="round"
              ></g>
              <g id="SVGRepo_iconCarrier">
                <path
                  fill="#DA251D"
                  d="M32 5H4a4 4 0 0 0-4 4v18a4 4 0 0 0 4 4h28a4 4 0 0 0 4-4V9a4 4 0 0 0-4-4z"
                ></path>
                <path
                  fill="#FF0"
                  d="M19.753 16.037L18 10.642l-1.753 5.395h-5.672l4.589 3.333l-1.753 5.395L18 21.431l4.589 3.334l-1.753-5.395l4.589-3.333z"
                ></path>
              </g>
            </svg>

            <!-- Cờ tiếng anh -->
            <svg
              v-if="locale.code === 'en'"
              class="w-full h-full iconify iconify--twemoji"
              viewBox="0 0 36 36"
              xmlns="http://www.w3.org/2000/svg"
              xmlns:xlink="http://www.w3.org/1999/xlink"
              aria-hidden="true"
              role="img"
              preserveAspectRatio="xMidYMid meet"
              fill="#000000"
            >
              <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
              <g
                id="SVGRepo_tracerCarrier"
                stroke-linecap="round"
                stroke-linejoin="round"
              ></g>
              <g id="SVGRepo_iconCarrier">
                <path
                  fill="#EEE"
                  d="M32 5H4a4 4 0 0 0-4 4v18a4 4 0 0 0 4 4h28a4 4 0 0 0 4-4V9a4 4 0 0 0-4-4z"
                ></path>
                <path
                  fill="#CE1124"
                  d="M21 5h-6v10H0v6h15v10h6V21h15v-6H21z"
                ></path>
              </g>
            </svg>
          </div>
        </template>

        <!-- Tên ngôn ngữ -->
        <span class="text-sm font-medium">{{ locale.name }}</span>

        <!-- Dấu tick cho ngôn ngữ hiện tại -->
        <template #action>
          <svg
            v-if="locale.code === $i18n.locale"
            class="w-5 h-5 text-purple-600 animate-pulse"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fill-rule="evenodd"
              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
              clip-rule="evenodd"
            />
          </svg>
        </template>
      </UiDropdownItem>
    </template>
  </UiDropdown>
</template>

<script setup lang="ts">
// Nhập các thành phần có thể cấu hình
const { $i18n } = useNuxtApp();

// Trạng thái phản ứng
const availableLocales = computed(() => {
  return [
    { code: 'vi', name: $i18n.t('navbar.language.VNname') },
    { code: 'en', name: $i18n.t('navbar.language.ENname') }
  ];
});

const currentLocaleName = computed(() => {
  const current = availableLocales.value.find(
    (locale) => locale.code === $i18n.locale.value
  );
  return current?.name || "Language";
});

// Phương pháp
const switchLanguage = async (localeCode: string, close: () => void) => {
  await $i18n.setLocale(localeCode);
  // Lưu locale vào localStorage để persist
  if (process.client) {
    localStorage.setItem('preferred-locale', localeCode);
  }
  close();
};
</script>
