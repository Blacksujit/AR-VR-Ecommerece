import { create } from 'zustand';

interface UIState {
  isCartOpen: boolean;
  isSearchOpen: boolean;
  isMobileMenuOpen: boolean;
  isDarkMode: boolean;
  toggleCart: () => void;
  toggleSearch: () => void;
  toggleMobileMenu: () => void;
  toggleDarkMode: () => void;
  closeAll: () => void;
}

export const useUIStore = create<UIState>()((set) => ({
  isCartOpen: false,
  isSearchOpen: false,
  isMobileMenuOpen: false,
  isDarkMode: false,
  toggleCart: () => set((state) => ({ isCartOpen: !state.isCartOpen })),
  toggleSearch: () => set((state) => ({ isSearchOpen: !state.isSearchOpen })),
  toggleMobileMenu: () => set((state) => ({ isMobileMenuOpen: !state.isMobileMenuOpen })),
  toggleDarkMode: () => set((state) => ({ isDarkMode: !state.isDarkMode })),
  closeAll: () => set({ isCartOpen: false, isSearchOpen: false, isMobileMenuOpen: false }),
}));
