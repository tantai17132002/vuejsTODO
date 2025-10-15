// Toast Plugin - Cài đặt toast system toàn cục
export default defineNuxtPlugin(() => {
  // Tạo toast container toàn cục
  const createToastContainer = () => {
    let container = document.getElementById('toast-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'toast-container';
      container.className = 'fixed bottom-5 right-5 z-[9999] pointer-events-none flex flex-col items-end space-y-2';
      document.body.appendChild(container);
    }
    return container;
  };

  // Tạo toast element
  const createToast = (message: string, type: 'success' | 'error' | 'info' | 'warning' = 'success', duration: number = 5000) => {
    const container = createToastContainer();
    
    const toastElement = document.createElement('div');
    toastElement.className = getToastClasses(type);
    
    // Tạo icon cho từng loại toast
    const icon = getToastIcon(type);
    
    // HTML structure với icon và message
    toastElement.innerHTML = `
      <div class="flex items-center gap-3">
        <div class="flex-shrink-0">
          ${icon}
        </div>
        <div class="flex-1 text-sm font-medium">
          ${message}
        </div>
        <button class="flex-shrink-0 text-white/70 hover:text-white transition-colors">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>
    `;
    
    // Animation slide in từ dưới lên
    toastElement.style.transform = 'translateY(100%)';
    toastElement.style.opacity = '0';
    
    // Auto remove
    if (duration > 0) {
      setTimeout(() => {
        // Animation slide out xuống dưới
        toastElement.style.transform = 'translateY(100%)';
        toastElement.style.opacity = '0';
        setTimeout(() => {
          if (toastElement.parentNode) {
            toastElement.parentNode.removeChild(toastElement);
          }
        }, 300);
      }, duration);
    }
    
    // Click để đóng
    toastElement.addEventListener('click', () => {
      toastElement.style.transform = 'translateY(100%)';
      toastElement.style.opacity = '0';
      setTimeout(() => {
        if (toastElement.parentNode) {
          toastElement.parentNode.removeChild(toastElement);
        }
      }, 300);
    });
    
    container.appendChild(toastElement);
    
    // Animation slide in
    setTimeout(() => {
      toastElement.style.transform = 'translateY(0)';
      toastElement.style.opacity = '1';
    }, 10);
  };

  // Tạo icon cho từng loại toast
  const getToastIcon = (type: 'success' | 'error' | 'info' | 'warning') => {
    const iconClasses = 'w-5 h-5';
    
    switch (type) {
      case 'success':
        return `<svg class="${iconClasses}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
        </svg>`;
      case 'error':
        return `<svg class="${iconClasses}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
        </svg>`;
      case 'info':
        return `<svg class="${iconClasses}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>`;
      case 'warning':
        return `<svg class="${iconClasses}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
        </svg>`;
      default:
        return `<svg class="${iconClasses}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>`;
    }
  };

  // Lấy classes cho từng loại toast
  const getToastClasses = (type: 'success' | 'error' | 'info' | 'warning') => {
    const baseClasses = 'flex items-center gap-3 px-4 py-3 rounded-xl shadow-2xl min-w-[320px] max-w-[420px] mb-3 pointer-events-auto cursor-pointer transition-all duration-500 ease-out transform hover:scale-105 hover:shadow-3xl backdrop-blur-sm border border-white/20';
    
    switch (type) {
      case 'success':
        return `${baseClasses} bg-gradient-to-r from-green-500 to-emerald-500 text-white`;
      case 'error':
        return `${baseClasses} bg-gradient-to-r from-red-500 to-rose-500 text-white`;
      case 'info':
        return `${baseClasses} bg-gradient-to-r from-blue-500 to-cyan-500 text-white`;
      case 'warning':
        return `${baseClasses} bg-gradient-to-r from-yellow-500 to-orange-500 text-white`;
      default:
        return `${baseClasses} bg-gradient-to-r from-gray-500 to-slate-500 text-white`;
    }
  };

  // Toast API
  const toast = {
    success: (message: string, duration?: number) => createToast(message, 'success', duration),
    error: (message: string, duration?: number) => createToast(message, 'error', duration),
    info: (message: string, duration?: number) => createToast(message, 'info', duration),
    warning: (message: string, duration?: number) => createToast(message, 'warning', duration),
    clear: () => {
      const container = document.getElementById('toast-container');
      if (container) {
        container.innerHTML = '';
      }
    },
    closeAll: () => {
      const container = document.getElementById('toast-container');
      if (container) {
        container.innerHTML = '';
      }
    }
  };

  // Provide toast globally
  return {
    provide: {
      toast
    }
  };
});
