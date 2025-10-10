<template>
  <!-- Container chính - full height với gradient background -->
  <div class="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 flex items-center justify-center py-8 px-4 sm:px-6 lg:px-8">
    <!-- Form wrapper - responsive width -->
    <div class="max-w-lg w-full space-y-8">
      <!-- Header section - logo, title, subtitle -->
      <div class="text-center">
        <!-- Logo container với gradient background -->
        <div class="mx-auto h-20 w-20 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center mb-4">
          <!-- User plus icon SVG -->
          <svg class="h-10 w-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
          </svg>
        </div>
        <!-- Title - sử dụng i18n -->
        <h2 class="text-3xl font-bold text-gray-900 mb-2">{{ $t('navbar.register') }}</h2>
        <!-- Subtitle - sử dụng i18n -->
        <p class="text-base text-gray-600">{{ $t('register.subtitle') }}</p>
      </div>

      <!-- Form Container - sử dụng reusable component -->
      <FormsFormContainer>
        <!-- Form với validation -->
        <form @submit.prevent="register" class="space-y-6" novalidate>
          <!-- Input tên đăng nhập -->
          <FormsFormInput
            id="username"
            v-model="username"
            v-bind="usernameAttrs"
            :label="$t('register.usernameLabel')"
            type="text"
            :placeholder="$t('register.usernamePlaceholder')"
            :error="errors.username"
          >
            <!-- Custom icon cho username input -->
            <template #icon>
              <svg class="h-6 w-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </template>
          </FormsFormInput>

          <!-- Input email -->
          <FormsFormInput
            id="email"
            v-model="email"
            v-bind="emailAttrs"
            :label="$t('register.emailLabel')"
            type="text"
            :placeholder="$t('register.emailPlaceholder')"
            :error="errors.email"
          >
            <!-- Custom icon cho email input -->
            <template #icon>
              <svg class="h-6 w-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </template>
          </FormsFormInput>

          <!-- Input mật khẩu -->
          <FormsFormInput
            id="password"
            v-model="password"
            v-bind="passwordAttrs"
            :label="$t('register.passwordLabel')"
            type="password"
            :placeholder="$t('register.passwordPlaceholder')"
            :error="errors.password"
          >
            <!-- Custom icon cho password input -->
            <template #icon>
              <svg class="h-6 w-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </template>
          </FormsFormInput>

          <!-- Button đăng ký - sử dụng BaseButton component -->
          <div>
            <BaseButton
              type="submit"
              :disabled="loading"
              width="full"
              size="lg"
              class="group relative bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 focus:ring-purple-500 transform hover:scale-[1.02] hover:shadow-lg transition-all duration-200"
            >
              <!-- Loading spinner khi đang đăng ký -->
              <span v-if="loading" class="absolute left-0 inset-y-0 flex items-center pl-4">
                <svg class="animate-spin h-6 w-6 text-white" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </span>
              <!-- Button text - dynamic theo loading state -->
              {{ loading ? $t('register.registering') : $t('register.registerButton') }}
            </BaseButton>
          </div>

          <!-- Error message container - hiển thị khi có lỗi -->
          <div v-if="error" class="bg-red-50 border border-red-200 rounded-lg p-5">
            <div class="flex">
              <!-- Error icon -->
              <div class="flex-shrink-0">
                <svg class="h-6 w-6 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
                </svg>
              </div>
              <!-- Error content -->
              <div class="ml-4">
                <h3 class="text-base font-medium text-red-800">
                  {{ $t("register.errorTitle") }}
                </h3>
                <div class="mt-2 text-base text-red-700">
                  {{ error }}
                </div>
              </div>
            </div>
          </div>
        </form>
      </FormsFormContainer>
    </div>
  </div>
</template>

<script setup>
// Import auth store để quản lý authentication
import { useAuthStore } from "../stores/auth";
// Import VeeValidate cho form validation
import { useForm } from 'vee-validate'
// Import Yup cho validation schema
import * as yup from 'yup'

// Lấy Axios instance từ Nuxt app để gọi API
const { $axios } = useNuxtApp();
// Lấy auth store để quản lý trạng thái đăng nhập
const auth = useAuthStore();

// Validation schema - định nghĩa rules cho form với computed để reactive với locale
const schema = computed(() => yup.object({
  username: yup
    .string()
    .required($t('validation.username.required')), // Sử dụng i18n cho error message
  email: yup
    .string()
    .required($t('validation.email.required')) // Sử dụng i18n cho error message
    .test('email', $t('validation.email.valid'), function(value) {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value || '');
    }),
  password: yup
    .string()
    .required($t('validation.password.required')) // Sử dụng i18n cho error message
    .min(8, $t('validation.password.minLength')) // Sử dụng i18n cho error message
}));

// Sử dụng VeeValidate - chỉ validate khi submit (cấu hình global)
const { errors, handleSubmit, defineField } = useForm({
  validationSchema: schema.value
});

// Định nghĩa các field với validation attributes
const [username, usernameAttrs] = defineField('username');
const [email, emailAttrs] = defineField('email');
const [password, passwordAttrs] = defineField('password');

// Reactive state cho UI
const error = ref("");        // Error message từ API
const loading = ref(false);   // Loading state cho button

// Hàm xử lý đăng ký với validation
const register = handleSubmit(async (values) => {
  try {
    // Bắt đầu loading
    loading.value = true;
    error.value = "";

    // Gửi request POST đến API đăng ký
    const res = await $axios.post("/auth/register", values);

    // Lưu token vào store và cookie
    auth.setToken(res.data.access_token);

    // Chuyển hướng đến trang login
    await navigateTo("/login");
  } catch (err) {
    const message = err.response?.data?.message;   
    // Kiểm tra email error trước (ưu tiên cao nhất)
    const isEmailError =
      message?.toLowerCase().includes("email") ||
      message?.toLowerCase().includes("invalid email") ||
      message?.toLowerCase().includes("already registered") ||
      message?.toLowerCase().includes("email already") ||
      message?.toLowerCase().includes("email exists") ||
      message?.toLowerCase().includes("email taken") ||
      message?.toLowerCase().includes("email duplicate");
    
    // Kiểm tra username error
    const isUsernameError =
      message?.toLowerCase().includes("username") ||
      message?.toLowerCase().includes("user") ||
      message?.toLowerCase().includes("already exists") ||
      message?.toLowerCase().includes("taken");
    
    // Ưu tiên email error trước
    if (isEmailError) {
      error.value = $t("register.wrongEmail");
    } else if (isUsernameError) {
      error.value = $t("register.wrongUsername");
    } else {
      error.value = message || $t("register.errorTitle");
    }
  } finally {
    // Kết thúc loading
    loading.value = false;
  }
});
</script>
