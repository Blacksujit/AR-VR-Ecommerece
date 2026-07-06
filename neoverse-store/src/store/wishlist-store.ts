import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface WishlistState {
  items: string[];
  toggleItem: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  clearWishlist: () => void;
  initItems: (ids: string[]) => void;
  addItem: (productId: string) => void;
  removeItem: (productId: string) => void;
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],
      toggleItem: (productId) => {
        set((state) => ({
          items: state.items.includes(productId)
            ? state.items.filter((id) => id !== productId)
            : [...state.items, productId],
        }));
      },
      isInWishlist: (productId) => get().items.includes(productId),
      clearWishlist: () => set({ items: [] }),
      initItems: (ids) => set({ items: ids }),
      addItem: (productId) => set((state) => ({
        items: state.items.includes(productId) ? state.items : [...state.items, productId],
      })),
      removeItem: (productId) => set((state) => ({
        items: state.items.filter((id) => id !== productId),
      })),
    }),
    { name: 'neoverse-wishlist' }
  )
);
