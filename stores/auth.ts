import { defineStore } from 'pinia'

// Tạo auth store để quản lý trạng thái đăng nhập
export const useAuthStore = defineStore('auth', {
  // State: định nghĩa dữ liệu của store
  state: () => ({
    token: null as string | null // Token JWT để xác thực người dùng
  }),
  
  // Actions: các hàm để thay đổi state
  actions: {
    // Hàm lưu token sau khi đăng nhập thành công
    setToken(token: string) {
      this.token = token
    },
    
    // Hàm xóa token khi đăng xuất
    clear() {
      this.token = null
    }
  },
  
  // Getters: các hàm tính toán dựa trên state
  getters: {
    // Kiểm tra xem người dùng đã đăng nhập chưa
    isLoggedIn: (state) => !!state.token
  }
})