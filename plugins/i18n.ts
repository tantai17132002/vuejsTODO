export default defineNuxtPlugin(() => {
  const { $i18n } = useNuxtApp();
  
  // Khôi phục locale từ localStorage khi khởi tạo
  if (process.client) {
    const savedLocale = localStorage.getItem('preferred-locale');
    if (savedLocale && savedLocale !== $i18n.locale.value) {
      $i18n.setLocale(savedLocale);
    }
  }
  
  // Lưu locale vào localStorage khi thay đổi
  $i18n.onLanguageSwitched = (oldLocale: string, newLocale: string) => {
    if (process.client) {
      localStorage.setItem('preferred-locale', newLocale);
    }
  };
});
