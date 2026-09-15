import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CartItem, Product } from '@/types';

interface CartState {
  items: CartItem[];
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getSubtotal: () => number;
  setItems: (items: CartItem[]) => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (product, quantity = 1) => {
        const safeQuantity = Math.max(1, Math.floor(quantity));
        set((state) => {
          const existing = state.items.find((item) => item.product._id === product._id);
          if (existing) {
            return {
              items: state.items.map((item) =>
                item.product._id === product._id
                  ? { ...item, quantity: Math.min(item.product.stock, item.quantity + safeQuantity) }
                  : item
              ),
            };
          }
          return { items: [...state.items, { product, quantity: Math.min(product.stock, safeQuantity) }] };
        });
      },
      removeItem: (productId) => {
        set((state) => ({
          items: state.items.filter((item) => item.product._id !== productId),
        }));
      },
      updateQuantity: (productId, quantity) => {
        set((state) => ({
          items: state.items
            .map((item) =>
              item.product._id === productId
                ? { ...item, quantity: Math.min(item.product.stock, Math.max(1, Math.floor(quantity))) }
                : item
            )
            .filter((item) => item.product.stock > 0),
        }));
      },
      clearCart: () => set({ items: [] }),
      getTotalItems: () => get().items.reduce((total, item) => total + item.quantity, 0),
      getSubtotal: () =>
        get().items.reduce(
          (total, item) =>
            total + (item.product.price - (item.product.price * item.product.discount) / 100) * item.quantity,
          0
        ),
      setItems: (items) => set({ items }),
    }),
    { name: 'neoverse-cart' }
  )
);
