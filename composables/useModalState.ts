// Global modal state - track any modal being open
const isModalOpen = ref(false);

// Composable để quản lý trạng thái modal
export const useModalState = () => {
  const setModalOpen = (open: boolean) => {
    isModalOpen.value = open;
  };
  
  return {
    isModalOpen: readonly(isModalOpen),
    setModalOpen
  };
};
