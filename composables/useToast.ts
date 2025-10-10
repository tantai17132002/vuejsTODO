/**
 * Composable for toast notifications
 * Sử dụng plugin toast.ts một cách gọn gàng
 */
export const useToast = () => {
  const { $toast } = useNuxtApp()
  
  // Kiểm tra toast có sẵn sàng không
  if (!$toast || typeof $toast.success !== 'function') {
    console.warn('Toast not available')
    return {
      success: (message: string) => console.log('Toast success:', message),
      error: (message: string) => console.log('Toast error:', message),
      info: (message: string) => console.log('Toast info:', message),
      warning: (message: string) => console.log('Toast warning:', message)
    }
  }
  
  return {
    success: (message: string) => $toast.success(message),
    error: (message: string) => $toast.error(message),
    info: (message: string) => $toast.info(message),
    warning: (message: string) => $toast.warning(message)
  }
}
