// Composable useApi - Gọi API và hiển thị toast tự động
export const useApi = () => {
  // Lấy các plugin từ Nuxt app
  const { $toast } = useNuxtApp(); // Plugin toast để hiển thị thông báo
  const { $axios } = useNuxtApp(); // Plugin axios để gọi API
  const { t } = useI18n(); // Plugin i18n để đa ngôn ngữ

  // Hàm generic để gọi API với toast tự động
  const apiCall = async <T>(
    apiFunction: () => Promise<T>, // Hàm gọi API (GET, POST, PUT, DELETE...)
    options: {
      successMessage?: string; // Thông báo thành công
      errorMessage?: string; // Thông báo lỗi mặc định
      showSuccessToast?: boolean; // Có hiển thị toast thành công không
      showErrorToast?: boolean; // Có hiển thị toast lỗi không
    } = {}
  ): Promise<T> => {
    // Lấy các options với giá trị mặc định
    const {
      successMessage = t('common.success'), // "Thao tác thành công!"
      errorMessage = t('common.error'), // "Có lỗi xảy ra!"
      showSuccessToast = true, // Mặc định hiển thị toast thành công
      showErrorToast = true // Mặc định hiển thị toast lỗi
    } = options;

    try {
      // Gọi API function
      const result = await apiFunction();
      
      // Nếu thành công và được phép hiển thị toast
      if (showSuccessToast) {
        $toast.closeAll(); // Clear all existing toasts trước
        $toast.success(successMessage); // Hiển thị toast xanh
      }
      
      return result; // Trả về kết quả
    } catch (error: any) {
      // Nếu có lỗi và được phép hiển thị toast
      if (showErrorToast) {
        // Ưu tiên message từ backend, nếu không có thì dùng message mặc định
        const message = error.response?.data?.message || errorMessage;
        $toast.closeAll(); // Clear all existing toasts trước
        $toast.error(message); // Hiển thị toast đỏ
      }
      
      throw error; // Ném lại lỗi để component xử lý
    }
  };

  // ===== TODO API CALLS =====
  const todoApi = {
    // Lấy danh sách todos với phân trang và filter
    fetchTodos: async (page: number = 1, limit: number = 10, isDone?: boolean) => {
      const params: any = { page, limit };
      if (isDone !== undefined) {
        params.isDone = isDone;
      }
      
      return apiCall(
        () => $axios.get('/todos', { params }), // GET /todos?page=1&limit=10&isDone=true
        {
          successMessage: t('dashboard.fetchSuccess'), // "Đã tải danh sách todo!"
          showSuccessToast: false // Không hiển thị toast khi load (tránh spam)
        }
      );
    },

    // Tạo todo mới
    createTodo: async (data: { title: string; description?: string }) => {
      return apiCall(
        () => $axios.post('/todos', data), // POST /todos với data
        {
          successMessage: t('dashboard.createSuccess') // "Todo đã được tạo thành công!"
        }
      );
    },

    // Cập nhật todo
    updateTodo: async (id: number, data: { title: string; description?: string; isDone?: boolean }) => {
      return apiCall(
        () => $axios.patch(`/todos/${id}`, data), // PATCH /todos/123 với data
        {
          successMessage: t('dashboard.updateSuccess') // "Todo đã được cập nhật thành công!"
        }
      );
    },

    // Xóa todo
    deleteTodo: async (id: number) => {
      return apiCall(
        () => $axios.delete(`/todos/${id}`), // DELETE /todos/123
        {
          successMessage: t('dashboard.deleteSuccess') // "Todo đã được xóa thành công!"
        }
      );
    },

    // Toggle trạng thái hoàn thành của todo
    toggleTodo: async (id: number, isDone: boolean) => {
      return apiCall(
        () => $axios.patch(`/todos/${id}`, { isDone }), // PATCH /todos/123 với isDone
        {
          // Hiển thị message khác nhau tùy theo trạng thái
          successMessage: isDone ? t('dashboard.completeSuccess') : t('dashboard.uncompleteSuccess')
        }
      );
    }
  };

  // ===== AUTH API CALLS =====
  const authApi = {
    // Đăng nhập
    login: async (data: { email: string; password: string }) => {
      return apiCall(
        () => $axios.post('/auth/login', data), // POST /auth/login
        {
          successMessage: t('auth.loginSuccess') // "Đăng nhập thành công!"
        }
      );
    },

    // Đăng ký tài khoản
    register: async (data: { name: string; email: string; password: string }) => {
      return apiCall(
        () => $axios.post('/auth/register', data), // POST /auth/register
        {
          successMessage: t('auth.registerSuccess') // "Đăng ký thành công!"
        }
      );
    },

    // Đăng xuất
    logout: async () => {
      return apiCall(
        () => $axios.post('/auth/logout'), // POST /auth/logout
        {
          successMessage: t('auth.logoutSuccess') // "Đăng xuất thành công!"
        }
      );
    }
  };

  // ===== USER API CALLS =====
  const userApi = {
    // Lấy thông tin profile của user
    getProfile: async () => {
      return apiCall(
        () => $axios.get('/user/profile'), // GET /user/profile
        {
          showSuccessToast: false // Không hiển thị toast khi load profile
        }
      );
    },

    // Cập nhật thông tin profile
    updateProfile: async (data: { name?: string; email?: string }) => {
      return apiCall(
        () => $axios.put('/user/profile', data), // PUT /user/profile
        {
          successMessage: t('user.profileUpdateSuccess') // "Cập nhật thông tin thành công!"
        }
      );
    }
  };

  // Trả về các API functions để sử dụng trong components
  return {
    apiCall, // Hàm generic để gọi API với toast
    todoApi, // Các API liên quan đến todo
    authApi, // Các API liên quan đến authentication
    userApi // Các API liên quan đến user profile
  };
};
