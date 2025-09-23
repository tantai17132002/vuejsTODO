<template>
  <div class="p-4">
    <!-- Button đăng nhập -->
    <button
      @click="login"
      class="mr-2 px-4 py-2 bg-blue-500 text-white rounded"
    >
      Đăng nhập
    </button>

    <!-- Button lấy thông tin user -->
    <button
      @click="getMe"
      class="mr-2 px-4 py-2 bg-green-500 text-white rounded"
    >
      Lấy user hiện tại
    </button>

    <!-- Hiển thị thông tin user sau khi đăng nhập -->
    <div v-if="me" class="mt-4 p-3 bg-gray-100 rounded">
      <p class="text-lg font-semibold">Xin chào: {{ me.username }}</p>
      <p class="text-sm text-gray-600">Email: {{ me.email }}</p>
    </div>
  </div>
</template>

<script setup>
// Import các thư viện cần thiết
import { useAuthStore } from "../stores/auth"; // Store quản lý authentication
import axios from "axios"; // Thư viện HTTP client

// Lấy cấu hình runtime từ Nuxt
const config = useRuntimeConfig();
// Lấy auth store để quản lý token
const auth = useAuthStore();
// Biến reactive để lưu thông tin user
const me = ref(null);

// Tạo Axios instance với cấu hình cơ bản
const axiosInstance = axios.create({
  baseURL: config.public.apiBaseUrl, // URL gốc của API backend
  withCredentials: false, // Không gửi cookie (có thể thay đổi thành true nếu cần)
});

// Interceptor để tự động gắn token vào mọi request
axiosInstance.interceptors.request.use((config) => {
  // Nếu có token trong auth store thì gắn vào header Authorization
  if (auth.token) {
    config.headers.Authorization = `Bearer ${auth.token}`;
  }
  return config;
});

// Hàm đăng nhập
async function login() {
  try {
    console.log("API Base URL:", config.public.apiBaseUrl);

    // Gửi request POST đến endpoint /auth/login
    const res = await axiosInstance.post("/auth/login", {
      usernameOrEmail: "admin", // Tên đăng nhập (có thể thay đổi)
      password: "admin123", // Mật khẩu (có thể thay đổi)
    });

    // Lấy token từ response
    const token = res.data.access_token;
    // Lưu token vào auth store
    auth.setToken(token);
    alert("Đăng nhập thành công!");
  } catch (error) {
    console.error("Lỗi đăng nhập:", error);
    alert("Đăng nhập thất bại: " + error.message);
  }
}

// Hàm lấy thông tin user hiện tại
async function getMe() {
  try {
    // Gửi request GET đến endpoint /auth/me
    // Token sẽ được tự động gắn bởi interceptor
    const res = await axiosInstance.get("/auth/me");
    // Lưu thông tin user vào biến reactive
    me.value = res.data;
  } catch (error) {
    console.error("Lỗi lấy thông tin user:", error);
    alert("Lấy thông tin user thất bại: " + error.message);
  }
}
</script>
