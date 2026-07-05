import { create } from 'zustand';
import type { Product, SearchFilters, PaginationInfo } from '@/types';

interface ProductsState {
  products: Product[];
  selectedProduct: Product | null;
  filters: SearchFilters;
  pagination: PaginationInfo;
  isLoading: boolean;
  error: string | null;
  setProducts: (products: Product[]) => void;
  setSelectedProduct: (product: Product | null) => void;
  setFilters: (filters: Partial<SearchFilters>) => void;
  resetFilters: () => void;
  setPagination: (pagination: PaginationInfo) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useProductStore = create<ProductsState>()((set) => ({
  products: [],
  selectedProduct: null,
  filters: {},
  pagination: { page: 1, pages: 1, total: 0, limit: 12 },
  isLoading: false,
  error: null,
  setProducts: (products) => set({ products }),
  setSelectedProduct: (product) => set({ selectedProduct: product }),
  setFilters: (filters) => set((state) => ({ filters: { ...state.filters, ...filters } })),
  resetFilters: () => set({ filters: {} }),
  setPagination: (pagination) => set({ pagination }),
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),
}));
