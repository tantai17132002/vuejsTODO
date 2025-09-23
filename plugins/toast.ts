import Toast from "vue-toastification";
import "vue-toastification/dist/index.css";

// Khai báo kiểu dữ liệu cho function tự động import của Nuxt
declare const defineNuxtPlugin: any;

// Plugin toast notification cho Nuxt - hiển thị thông báo
export default defineNuxtPlugin((nuxtApp: any) => {
  // Cấu hình toast với các tùy chọn
  const toastOptions = {
    position: "top-right" as const,
    timeout: 3000,
    closeOnClick: true,
    pauseOnFocusLoss: true,
    pauseOnHover: true,
    draggable: true,
    draggablePercent: 0.6,
    showCloseButtonOnHover: false,
    hideProgressBar: false,
    closeButton: "button",
    icon: true,
    rtl: false,
  };

  // Đăng ký plugin toast với Vue app
  nuxtApp.vueApp.use(Toast, toastOptions);

  // Cung cấp toast instance cho toàn bộ ứng dụng
  return {
    provide: {
      toast: nuxtApp.vueApp.config.globalProperties.$toast,
    },
  };
});