// Import thư viện Pinia để tạo store
import { defineStore } from "pinia";
// Import useCookies để quản lý cookie
import { useCookies } from "@vueuse/integrations/useCookies";

// Tạo auth store để quản lý trạng thái đăng nhập với cookie
export const useAuthStore = defineStore("auth", {
  // State: định nghĩa dữ liệu của store
  state: () => ({
    user: null as any, // Thông tin người dùng
    token: null as string | null, // Token JWT để xác thực người dùng
  }),

  // Actions: các hàm để thay đổi state
  actions: {
    // Hàm lưu token vào cookie và state sau khi đăng nhập thành công
    setToken(token: string) {
      const cookies = useCookies();
      // Lưu token vào cookie với thời hạn 1 ngày
      cookies.set("token", token, { maxAge: 60 * 60 * 24 }); // 1 ngày
      this.token = token;
    },

    // Hàm tải token từ cookie khi khởi động ứng dụng
    loadTokenFromCookie() {
      const cookies = useCookies();
      const token = cookies.get("token");
      if (token) this.token = token;
    },

    // Hàm lấy thông tin người dùng hiện tại từ API
    async fetchMe() {
      try {
        const { $axios } = useNuxtApp();
        const res = await $axios.get("/auth/me");
        this.user = res.data;
      } catch (e) {
        // Nếu lỗi thì xóa toàn bộ thông tin đăng nhập
        this.clearAuth();
      }
    },

    // Hàm xóa toàn bộ thông tin đăng nhập (token, user, cookie)
    clearAuth() {
      const cookies = useCookies();
      cookies.remove("token"); // Xóa token khỏi cookie
      this.token = null;
      this.user = null;
    },
  },

  // Getters: các hàm tính toán dựa trên state
  getters: {
    // Kiểm tra xem người dùng đã đăng nhập chưa
    isLoggedIn: (state) => !!state.token,
  },
});
