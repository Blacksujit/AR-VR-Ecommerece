export interface Product {
  _id: string;
  name: string;
  slug: string;
  description: string;
  brand: string;
  category: string;
  price: number;
  discount: number;
  stock: number;
  images: string[];
  modelUrl: string;
  specifications: Specification[];
  reviews?: Review[];
  rating: number;
  numReviews: number;
  isARSupported: boolean;
  isVRSupported: boolean;
  aiScore: number;
  featured: boolean;
  trending: boolean;
  newArrival: boolean;
  flashSale: boolean;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Specification {
  key: string;
  value: string;
}

export interface Review {
  _id: string;
  user: { _id: string; name: string; avatar: string };
  rating: number;
  title: string;
  comment: string;
  isVerifiedPurchase: boolean;
  createdAt: string;
}

export interface User {
  _id: string;
  name: string;
  email: string;
  avatar: string;
  phone?: string;
  role: 'user' | 'admin';
  wishlist: string[];
  addresses: Address[];
  createdAt: string;
  updatedAt?: string;
  lastLogin?: string;
}

export interface Address {
  _id: string;
  fullName: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  isDefault: boolean;
}

export interface UserPreferences {
  _id: string;
  darkMode: boolean;
  emailNotifications: boolean;
  pushNotifications: boolean;
  orderUpdates: boolean;
  promoEmails: boolean;
  language: string;
  currency: string;
}

export interface RecentlyViewedItem {
  _id: string;
  user: string;
  product: Product;
  viewedAt: string;
}

export interface Notification {
  _id: string;
  user: string;
  type: 'order' | 'wishlist' | 'promo' | 'system' | 'review';
  title: string;
  message: string;
  link?: string;
  isRead: boolean;
  createdAt: string;
}

export interface NotificationsData {
  notifications: Notification[];
  unreadCount: number;
}

export interface SearchHistoryItem {
  _id: string;
  user: string;
  query: string;
  filters?: Record<string, unknown>;
  resultCount: number;
  createdAt: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Order {
  _id: string;
  user: string;
  items: { product: Product; quantity: number }[];
  shippingAddress: Address;
  paymentMethod: string;
  itemsPrice: number;
  shippingPrice: number;
  taxPrice: number;
  totalPrice: number;
  isPaid: boolean;
  paidAt: string;
  isDelivered: boolean;
  deliveredAt: string;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: string;
}

export interface Category {
  _id: string;
  name: string;
  slug: string;
  image: string;
  description: string;
}

export interface SearchFilters {
  category?: string;
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
  rating?: number;
  inStock?: boolean;
  arCompatible?: boolean;
  vrCompatible?: boolean;
  sort?: 'price-asc' | 'price-desc' | 'rating' | 'newest' | 'popular';
}

export interface PaginationInfo {
  page: number;
  pages: number;
  total: number;
  limit: number;
}


