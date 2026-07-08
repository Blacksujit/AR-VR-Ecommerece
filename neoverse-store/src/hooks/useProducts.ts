'use client'

import { useQuery } from '@tanstack/react-query'
import type {
  ProductsResponse,
  SingleProductResponse,
  CategoriesResponse,
} from '@/lib/product-types'

const API_BASE = '/api'

async function fetchJson<T>(url: string): Promise<T> {
  const res = await fetch(url)
  if (!res.ok) {
    throw new Error(`Request failed (${res.status})`)
  }
  return res.json()
}

export function useProducts(params: Record<string, string | number | boolean | undefined> = {}) {
  const searchParams = new URLSearchParams()
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== '' && value !== false) {
      searchParams.set(key, String(value))
    }
  })
  const qs = searchParams.toString()
  const queryKey = qs ? `products?${qs}` : 'products'

  return useQuery<ProductsResponse>({
    queryKey: [queryKey],
    queryFn: () => fetchJson<ProductsResponse>(`${API_BASE}/products${qs ? `?${qs}` : ''}`),
    staleTime: 5 * 60 * 1000,
    retry: 1,
  })
}

export function useProduct(slug: string) {
  return useQuery<SingleProductResponse>({
    queryKey: ['product', slug],
    queryFn: () => fetchJson<SingleProductResponse>(`${API_BASE}/products/${slug}`),
    staleTime: 5 * 60 * 1000,
    retry: 1,
  })
}

export function useFeaturedProducts() {
  return useQuery<{ success: boolean; data: import('@/lib/product-types').ProductItem[] }>({
    queryKey: ['featured-products'],
    queryFn: () => fetchJson(`${API_BASE}/products/featured`),
    staleTime: 5 * 60 * 1000,
    retry: 1,
  })
}

export function useCategories() {
  return useQuery<CategoriesResponse>({
    queryKey: ['categories'],
    queryFn: () => fetchJson<CategoriesResponse>(`${API_BASE}/categories`),
    staleTime: 5 * 60 * 1000,
    retry: 1,
  })
}

export function useProductSearch(q: string, limit = 12) {
  return useQuery<{ success: boolean; data: import('@/lib/product-types').ProductItem[]; pagination: { total: number } }>({
    queryKey: ['product-search', q, limit],
    queryFn: () =>
      fetchJson(`${API_BASE}/products/search?q=${encodeURIComponent(q)}&limit=${limit}`),
    staleTime: 2 * 60 * 1000,
    retry: 1,
    enabled: q.trim().length > 0,
  })
}
