
export default defineNuxtRouteMiddleware((to, from) => {
  // Lấy auth store để kiểm tra trạng thái đăng nhập
  const auth = useAuthStore();
  
  // Load token từ cookie trước khi kiểm tra
  auth.loadTokenFromCookie();
  
  // Nếu chưa đăng nhập, redirect đến trang login
  if (!auth.isLoggedIn) {
    return navigateTo('/login');
  }
  
  // Nếu đã đăng nhập nhưng chưa có thông tin user, load user info
  if (auth.isLoggedIn && !auth.user) {
    auth.fetchMe();
  }
});