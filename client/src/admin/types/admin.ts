import { IOrder, ProductSize } from '../../types';

export interface IAdminKPI {
  value: number;
  formatted: string;
  change: string;
  isPositive: boolean;
  comparison: string;
}

export interface IAdminDashboardData {
  kpis: {
    totalRevenue: IAdminKPI;
    totalOrders: IAdminKPI;
    totalCustomers: IAdminKPI;
    totalProducts: IAdminKPI;
    lowStockProducts: IAdminKPI;
    giftCardSales: IAdminKPI;
  };
  salesOverview: {
    chart: Array<{
      label: string;
      revenue: number;
      orders: number;
      aov: number;
    }>;
    range: string;
    avgOrderValue: number;
  };
  recentOrders: Array<IOrder & { userId?: { name: string; email: string; phone?: string } }>;
  topSellingProducts: Array<{
    productId: string;
    title: string;
    brand: string;
    category: string;
    image: string;
    unitsSold: number;
    revenue: number;
    stock: number;
  }>;
  lowStockAlerts: Array<{
    productId: string;
    title: string;
    brand: string;
    category: string;
    image: string;
    sku: string;
    color: string;
    size: ProductSize;
    stock: number;
    threshold: number;
    isOutOfStock: boolean;
    status: string;
  }>;
  customerOverview: {
    newCustomers: number;
    returningCustomers: number;
    totalCustomers: number;
    satisfactionRate: number;
  };
  activeCouponsCount: number;
}

export interface IAdminInventoryItem {
  productId: string;
  title: string;
  brand: string;
  categoryName: string;
  image: string;
  sku: string;
  color: string;
  size: ProductSize;
  price: number;
  stock: number;
  reserved: number;
  available: number;
  threshold: number;
  warehouse: string;
  status: 'In Stock' | 'Low Stock' | 'Out of Stock';
}

export interface IInventoryLog {
  _id: string;
  productId: {
    _id: string;
    title: string;
    brand: string;
    images: string[];
  };
  sku: string;
  previousStock: number;
  newStock: number;
  change: number;
  reason: string;
  adminId?: {
    name: string;
    email: string;
  };
  createdAt: string;
}

export interface IGiftCardTier {
  id: string;
  name: string;
  amount: number;
  description: string;
  validity: string;
  status: string;
}

export interface IGiftCard {
  _id: string;
  code: string;
  tier: 'SILVER' | 'GOLD' | 'PLATINUM' | 'DIAMOND';
  initialAmount: number;
  balance: number;
  senderName: string;
  recipientName: string;
  recipientEmail: string;
  message?: string;
  designImage?: string;
  expiryDate: string;
  status: 'ACTIVE' | 'REDEEMED' | 'EXPIRED' | 'DISABLED';
  transactions: Array<{
    _id?: string;
    type: 'ISSUED' | 'REDEEMED' | 'REFUNDED' | 'EXPIRED';
    amount: number;
    orderNumber?: string;
    note?: string;
    date: string;
  }>;
  createdAt: string;
}

export interface ICMSBanner {
  _id: string;
  sectionType: 'HERO' | 'PROMOTIONAL' | 'FEATURED_COLLECTION' | 'EDITORIAL' | 'ANNOUNCEMENT';
  title: string;
  subtitle?: string;
  description?: string;
  desktopImage: string;
  mobileImage?: string;
  ctaText?: string;
  ctaLink?: string;
  badgeText?: string;
  sortOrder: number;
  isActive: boolean;
  createdAt?: string;
}

export interface IShippingMethod {
  _id: string;
  name: string;
  description: string;
  price: number;
  estimatedDelivery: string;
  zones: string[];
  freeAboveAmount: number;
  isActive: boolean;
  isDefault?: boolean;
  sortOrder?: number;
}

export interface IStoreSetting {
  _id?: string;
  storeName: string;
  tagline: string;
  contactEmail: string;
  phone: string;
  address: string;
  currency: string;
  currencySymbol: string;
  timezone: string;
  taxPercentage: number;
  taxNumber: string;
  maintenanceMode: boolean;
  allowGuestCheckout: boolean;
  orderPrefix: string;
  enable2FA: boolean;
  rolesConfig: Array<{
    role: string;
    description: string;
    permissions: string[];
  }>;
}

export interface INotificationTemplate {
  id: string;
  event: string;
  subject: string;
  active: boolean;
  channel: string;
}

export interface IWishlistActivityItem {
  productId: string;
  title: string;
  brand: string;
  image: string;
  category: string;
  wishlistCount: number;
  views: number;
  conversionRate: string;
}

export interface IPaymentTransaction {
  transactionId: string;
  orderId: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  amount: number;
  method: string;
  status: string;
  date: string;
}
