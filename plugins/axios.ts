import axios from "axios";

// Tạo plugin Axios cho Nuxt
export default defineNuxtPlugin(() => {
  // Lấy cấu hình runtime từ .env
  const config = useRuntimeConfig();

  // Tạo Axios instance với cấu hình cơ bản
  const instance = axios.create({
    baseURL: config.public.apiBaseUrl, // URL gốc của API backend
    withCredentials: false, // Không gửi cookie (có thể thay đổi thành true nếu cần)
  });

  // Interceptor để tự động gắn token vào mọi request
  instance.interceptors.request.use((config) => {
    try {
      // Lấy auth store để kiểm tra token
      const auth = useAuthStore();

      // Nếu có token thì gắn vào header Authorization
      if (auth && auth.token) {
        config.headers.Authorization = `Bearer ${auth.token}`;
      }
    } catch (error) {
      // Bỏ qua lỗi nếu store chưa có sẵn (trong quá trình SSR)
      console.warn("Auth store not available:", error);
    }

    return config;
  });

  // Cung cấp Axios instance cho toàn bộ ứng dụng
  // Có thể sử dụng $axios trong bất kỳ component nào
  return {
    provide: {
      axios: instance,
    },
  };
});
