// Khai báo kiểu dữ liệu cho các function tự động import của Nuxt
declare const defineNuxtRouteMiddleware: any;
declare const useAuthStore: any;
declare const navigateTo: any;

// Middleware xác thực toàn cục - chạy trên mọi route
export default defineNuxtRouteMiddleware((to: any) => {
  // Lấy auth store để kiểm tra trạng thái đăng nhập
  const auth = useAuthStore();

  // Danh sách các route không cần xác thực
  const publicRoutes = ["/auth/login", "/auth/register"];

  // Kiểm tra nếu user chưa đăng nhập và không phải route public
  if (!auth.isLoggedIn && !publicRoutes.includes(to.path)) {
    // Chuyển hướng đến trang đăng nhập
    return navigateTo("/auth/login");
  }

  // Nếu user đã đăng nhập và đang ở trang auth, chuyển về trang chủ
  if (auth.isLoggedIn && to.path.startsWith("/auth/")) {
    return navigateTo("/");
  }
});
