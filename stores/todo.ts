// Interface định nghĩa cấu trúc dữ liệu Todo (match với backend)
export interface Todo {
  id: number                    // ID duy nhất của todo
  title: string                 // Tiêu đề todo
  description?: string          // Mô tả todo (tùy chọn)
  isDone: boolean              // Trạng thái hoàn thành (backend dùng isDone)
  createdAt: string            // Thời gian tạo (backend dùng createdAt)
  updatedAt: string            // Thời gian cập nhật (backend dùng updatedAt)
  ownerId: number              // ID của người sở hữu todo
}

// Store quản lý state của todos sử dụng Pinia
export const useTodoStore = defineStore('todo', {
  // State - dữ liệu được lưu trữ trong store
  state: () => ({
    todos: [] as Todo[],        // Danh sách tất cả todos
    loading: false,             // Trạng thái đang tải
    error: null as string | null, // Thông báo lỗi
    // Pagination state
    currentPage: 1,             // Trang hiện tại
    totalPages: 1,               // Tổng số trang
    totalItems: 0,               // Tổng số items
    itemsPerPage: 10            // Số items per page
  }),

  // Getters - computed properties để lấy dữ liệu đã được xử lý
  getters: {
    // Lấy danh sách todos đã hoàn thành
    completedTodos: (state) => state.todos.filter(todo => todo.isDone),
    // Lấy danh sách todos chưa hoàn thành
    pendingTodos: (state) => state.todos.filter(todo => !todo.isDone),
    // Tìm todo theo ID
    getTodoById: (state) => (id: number) => state.todos.find(todo => todo.id === id)
  },

  // Actions - các hàm thực hiện thao tác với dữ liệu
  actions: {
    // Lấy danh sách todos từ API
    async fetchTodos(query = '', page = 1) {
      this.loading = true      // Bắt đầu loading
      this.error = null        // Xóa lỗi cũ
      try {
        const { $axios } = useNuxtApp()
        const res = await $axios.get(`/todos${query}`, {
          params: {
            page,
            limit: this.itemsPerPage
          }
        })
        // Backend trả về { todos: [], pagination: {}, filters: {} }
        this.todos = res.data.todos || []
        
        // Cập nhật pagination info từ API response
        if (res.data.pagination) {
          // Map API response structure to our store
          this.currentPage = res.data.pagination.page || page
          this.totalPages = res.data.pagination.totalPages || 1
          this.totalItems = res.data.pagination.total || 0
        } else {
          // Fallback nếu API không trả về pagination info
          this.currentPage = page
          this.totalItems = this.todos.length
          this.totalPages = Math.ceil(this.totalItems / this.itemsPerPage) || 1
        }
      } catch (err: any) {
        // Lưu thông báo lỗi
        this.error = err.response?.data?.message || 'Failed to fetch todos'
        throw err
      } finally {
        this.loading = false   // Kết thúc loading
      }
    },

    // Thêm todo mới
    async addTodo(payload: { title: string; description?: string }) {
      this.loading = true
      this.error = null
      try {
        const { $axios } = useNuxtApp()
        const res = await $axios.post('/todos', payload)
        // Thêm todo mới vào đầu danh sách (unshift)
        this.todos.unshift(res.data)
      } catch (err: any) {
        this.error = err.response?.data?.message || 'Failed to add todo'
        throw err
      } finally {
        this.loading = false
      }
    },

    // Cập nhật todo
    async updateTodo(id: number, data: Partial<Todo>) {
      this.loading = true
      this.error = null
      try {
        const { $axios } = useNuxtApp()
        const res = await $axios.patch(`/todos/${id}`, data)
        // Tìm và cập nhật todo trong local state
        const index = this.todos.findIndex(todo => todo.id === id)
        if (index !== -1) {
          // Merge dữ liệu cũ với dữ liệu mới
          this.todos[index] = { ...this.todos[index], ...res.data }
        }
      } catch (err: any) {
        this.error = err.response?.data?.message || 'Failed to update todo'
        throw err
      } finally {
        this.loading = false
      }
    },

    // Xóa todo
    async deleteTodo(id: number) {
      this.loading = true
      this.error = null
      try {
        const { $axios } = useNuxtApp()
        await $axios.delete(`/todos/${id}`)
        // Xóa todo khỏi local state
        this.todos = this.todos.filter(todo => todo.id !== id)
      } catch (err: any) {
        this.error = err.response?.data?.message || 'Failed to delete todo'
        throw err
      } finally {
        this.loading = false
      }
    },

    // Xóa thông báo lỗi
    clearError() {
      this.error = null
    },

    // Toggle trạng thái hoàn thành của todo
    async toggleTodo(id: number) {
      const todo = this.getTodoById(id)
      if (todo) {
        // Đảo ngược trạng thái isDone
        await this.updateTodo(id, { isDone: !todo.isDone })
      }
    },

    // Thay đổi trang
    async changePage(page: number) {
      await this.fetchTodos('', page)
    }
  }
})