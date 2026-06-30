import { create } from 'zustand';

interface GalleryState {
  selectedImageIndex: number | null;
  openModal: (index: number) => void;
  closeModal: () => void;
  goToPrev: () => void;
  goToNext: (total: number) => void;
}

export const useGalleryStore = create<GalleryState>((set) => ({
  selectedImageIndex: null,

  openModal: (index) => set({ selectedImageIndex: index }),

  closeModal: () => set({ selectedImageIndex: null }),

  goToPrev: () =>
    set((state) => ({
      selectedImageIndex:
        state.selectedImageIndex !== null && state.selectedImageIndex > 0
          ? state.selectedImageIndex - 1
          : state.selectedImageIndex,
    })),

  goToNext: (total) =>
    set((state) => ({
      selectedImageIndex:
        state.selectedImageIndex !== null && state.selectedImageIndex < total - 1
          ? state.selectedImageIndex + 1
          : state.selectedImageIndex,
    })),
}));
