export const STORE_NAME = 'NeoVerse';
export const STORE_TAGLINE = 'The Future of Shopping Begins Here.';

export const NAV_LINKS = [
  { label: 'Home', href: '/' },
  { label: 'Products', href: '/products' },
  { label: 'Categories', href: '/categories' },
  { label: 'VR Showroom', href: '/vr-showroom' },
  { label: 'Contact', href: '/contact' },
  { label: 'Docs', href: '/docs' },
];

export const CATEGORIES: { name: string; slug: string; image: string }[] = [];

export const SORT_OPTIONS = [
  { label: 'Price: Low to High', value: 'price-asc' },
  { label: 'Price: High to Low', value: 'price-desc' },
  { label: 'Highest Rated', value: 'rating' },
  { label: 'Newest', value: 'newest' },
  { label: 'Most Popular', value: 'popular' },
] as const;

export const ITEMS_PER_PAGE = 12;

export { API_URL } from './config'

export const PRODUCT_API_BASE = '/api'
