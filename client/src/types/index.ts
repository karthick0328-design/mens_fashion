export type UserRole = 'CUSTOMER' | 'ADMIN' | 'SUPER_ADMIN' | 'MANAGER' | 'STAFF';

export interface IAddress {
  _id?: string;
  name: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
}

export interface IUser {
  _id?: string;
  id?: string;
  name: string;
  email: string;
  phone?: string;
  role: UserRole;
  avatar?: string;
  addresses: IAddress[];
  createdAt?: string;
  updatedAt?: string;
}

export interface ICategory {
  _id: string;
  name: string;
  slug: string;
  parentCategory?: string | ICategory | null;
  image?: string;
  description?: string;
  isActive: boolean;
  sortOrder: number;
}

export type ProductSize =
  | 'XS'
  | 'S'
  | 'M'
  | 'L'
  | 'XL'
  | 'XXL'
  | '3XL'
  | '28'
  | '30'
  | '32'
  | '34'
  | '36'
  | '38'
  | '40'
  | 'FREE';

export const PRODUCT_SIZES: ProductSize[] = [
  'XS',
  'S',
  'M',
  'L',
  'XL',
  'XXL',
  '3XL',
  '28',
  '30',
  '32',
  '34',
  '36',
  '38',
  '40',
  'FREE',
];

export interface IProductColor {
  name: string;
  hex: string;
  images: string[];
}

export interface IProductVariant {
  sku: string;
  color: IProductColor;
  size: ProductSize;
  price: number;
  mrp: number;
  discountPercentage: number;
  stock: number;
  isAvailable: boolean;
}

export interface IProductRating {
  average: number;
  count: number;
}

export interface IProductSpecifications {
  [key: string]: string | number | undefined;
}

export interface IProduct {
  _id: string;
  title: string;
  slug: string;
  brand: string;
  category: string | ICategory;
  subCategory?: string | ICategory;
  description: string;
  images: string[];
  colors: IProductColor[];
  sizes: ProductSize[];
  variants: IProductVariant[];
  specifications: IProductSpecifications;
  rating: IProductRating;
  tags: string[];
  isFeatured: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface IProductFilters {
  search?: string;
  category?: string;
  subCategory?: string;
  brand?: string[];
  color?: string[];
  size?: ProductSize[];
  minPrice?: number;
  maxPrice?: number;
  rating?: number;
  discount?: number;
  availability?: boolean;
  sort?: 'relevance' | 'popularity' | 'price_asc' | 'price_desc' | 'newest' | 'rating' | 'discount';
  page?: number;
  limit?: number;
}

export interface ICartItem {
  _id?: string;
  productId: string;
  sku: string;
  title: string;
  image: string;
  color: IProductColor;
  size: ProductSize;
  price: number;
  mrp: number;
  quantity: number;
  stock: number;
}

export interface ICart {
  _id: string;
  userId: string;
  items: ICartItem[];
  subtotal: number;
  discount: number;
  total: number;
  itemCount: number;
  updatedAt: string;
}

export type OrderStatus =
  | 'PENDING'
  | 'CONFIRMED'
  | 'PROCESSING'
  | 'SHIPPED'
  | 'DELIVERED'
  | 'CANCELLED'
  | 'RETURN_REQUESTED'
  | 'RETURNED';

export const ORDER_STATUSES: OrderStatus[] = [
  'PENDING',
  'CONFIRMED',
  'PROCESSING',
  'SHIPPED',
  'DELIVERED',
  'CANCELLED',
  'RETURN_REQUESTED',
  'RETURNED',
];

export type PaymentMethod = 'COD' | 'ONLINE' | 'CARD' | 'UPI';
export type PaymentStatus = 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED';

export interface IOrderItem {
  productId: string;
  sku: string;
  title: string;
  image: string;
  color: IProductColor;
  size: ProductSize;
  unitPrice: number;
  mrp: number;
  quantity: number;
  totalPrice: number;
}

export interface IOrder {
  _id: string;
  orderNumber: string;
  userId: string;
  items: IOrderItem[];
  shippingAddress: IAddress;
  pricing: {
    subtotal: number;
    discount: number;
    shippingFee: number;
    tax: number;
    totalAmount: number;
  };
  payment: {
    method: PaymentMethod;
    status: PaymentStatus;
    transactionId?: string;
    paidAt?: string;
  };
  orderStatus: OrderStatus;
  timeline: Array<{
    status: OrderStatus;
    timestamp: string;
    note?: string;
  }>;
  couponApplied?: {
    code: string;
    discountAmount: number;
  };
  createdAt: string;
  updatedAt: string;
}

export interface IReview {
  _id: string;
  productId: string;
  userId: {
    _id: string;
    name: string;
  };
  rating: number;
  title: string;
  comment: string;
  images: string[];
  verifiedPurchase: boolean;
  likes: number;
  createdAt: string;
  updatedAt: string;
}

export interface IApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
  meta?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
  errors?: Array<{
    field?: string;
    message: string;
  }>;
}
