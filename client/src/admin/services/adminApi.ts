import api from '../../services/api';
import {
  IAdminDashboardData,
  IAdminInventoryItem,
  IInventoryLog,
  IGiftCard,
  ICMSBanner,
  IShippingMethod,
  IStoreSetting,
  INotificationTemplate,
  IWishlistActivityItem,
  IPaymentTransaction,
} from '../types/admin';
import { IProduct, ICategory, IOrder } from '../../types';

export const adminApi = {
  // Dashboard
  getDashboardAnalytics: (range: string = '30d') =>
    api.get<{ success: boolean; data: IAdminDashboardData }>('/admin/analytics/dashboard', {
      params: { range },
    }),

  // Products
  getProducts: (params: any) =>
    api.get<{ success: boolean; data: IProduct[]; meta: any }>('/admin/products', { params }),
  getProductById: (id: string) =>
    api.get<{ success: boolean; data: IProduct }>(`/admin/products/${id}`),
  createProduct: (payload: any) =>
    api.post<{ success: boolean; message: string; data: IProduct }>('/admin/products', payload),
  updateProduct: (id: string, payload: any) =>
    api.put<{ success: boolean; message: string; data: IProduct }>(`/admin/products/${id}`, payload),
  duplicateProduct: (id: string) =>
    api.post<{ success: boolean; message: string; data: IProduct }>(`/admin/products/${id}/duplicate`),
  deleteProduct: (id: string) =>
    api.delete<{ success: boolean; message: string }>(`/admin/products/${id}`),
  bulkProducts: (productIds: string[], action: 'ACTIVATE' | 'DEACTIVATE' | 'DELETE') =>
    api.post<{ success: boolean; message: string }>('/admin/products/bulk', { productIds, action }),

  // Categories & Collections
  getCategories: () =>
    api.get<{ success: boolean; data: ICategory[] }>('/admin/categories'),
  createCategory: (payload: any) =>
    api.post<{ success: boolean; message: string; data: ICategory }>('/admin/categories', payload),
  updateCategory: (id: string, payload: any) =>
    api.put<{ success: boolean; message: string; data: ICategory }>(`/admin/categories/${id}`, payload),
  deleteCategory: (id: string) =>
    api.delete<{ success: boolean; message: string }>(`/admin/categories/${id}`),
  getCollections: () =>
    api.get<{ success: boolean; data: any[] }>('/admin/collections'),

  // Inventory
  getInventory: () =>
    api.get<{ success: boolean; data: IAdminInventoryItem[] }>('/admin/inventory'),
  updateStock: (sku: string, stock: number, reason?: string) =>
    api.patch<{ success: boolean; message: string }>(`/admin/inventory/${sku}`, { stock, reason }),
  getInventoryLogs: () =>
    api.get<{ success: boolean; data: IInventoryLog[] }>('/admin/inventory/logs'),

  // Orders
  getOrders: (params: any) =>
    api.get<{ success: boolean; data: IOrder[]; meta: any }>('/admin/orders', { params }),
  getOrderById: (id: string) =>
    api.get<{ success: boolean; data: IOrder }>(`/admin/orders/${id}`),
  updateOrderStatus: (id: string, status: string, note?: string) =>
    api.patch<{ success: boolean; message: string; data: IOrder }>(`/admin/orders/${id}/status`, { status, note }),
  updateOrderTracking: (id: string, courier: string, trackingNumber: string, estimatedDelivery?: string) =>
    api.patch<{ success: boolean; message: string; data: IOrder }>(`/admin/orders/${id}/tracking`, {
      courier,
      trackingNumber,
      estimatedDelivery,
    }),
  refundOrder: (id: string, reason: string, refundAmount?: number) =>
    api.post<{ success: boolean; message: string; data: IOrder }>(`/admin/orders/${id}/refund`, {
      reason,
      refundAmount,
    }),

  // Customers
  getCustomers: (params?: any) =>
    api.get<{ success: boolean; data: any[] }>('/admin/customers', { params }),
  getCustomerDetails: (id: string) =>
    api.get<{ success: boolean; data: any }>(`/admin/customers/${id}`),
  updateCustomerStatus: (id: string, isBlocked: boolean) =>
    api.patch<{ success: boolean; message: string }>(`/admin/customers/${id}/status`, { isBlocked }),

  // Gift Cards
  getGiftCards: () =>
    api.get<{ success: boolean; data: { tiers: any[]; issuedGiftCards: IGiftCard[]; giftCardOrders: any[] } }>(
      '/admin/gift-cards'
    ),
  createGiftCard: (payload: any) =>
    api.post<{ success: boolean; message: string; data: IGiftCard }>('/admin/gift-cards', payload),
  updateGiftCardStatus: (id: string, status: string) =>
    api.patch<{ success: boolean; message: string }>(`/admin/gift-cards/${id}/status`, { status }),
  getGiftCardTransactions: () =>
    api.get<{ success: boolean; data: any[] }>('/admin/gift-cards/transactions'),

  // Coupons
  getCoupons: () =>
    api.get<{ success: boolean; data: any[] }>('/admin/coupons'),
  createCoupon: (payload: any) =>
    api.post<{ success: boolean; message: string; data: any }>('/admin/coupons', payload),
  updateCoupon: (id: string, payload: any) =>
    api.put<{ success: boolean; message: string; data: any }>(`/admin/coupons/${id}`, payload),
  deleteCoupon: (id: string) =>
    api.delete<{ success: boolean; message: string }>(`/admin/coupons/${id}`),

  // CMS
  getCMSBanners: () =>
    api.get<{ success: boolean; data: ICMSBanner[] }>('/admin/cms'),
  createCMSBanner: (payload: any) =>
    api.post<{ success: boolean; message: string; data: ICMSBanner }>('/admin/cms', payload),
  updateCMSBanner: (id: string, payload: any) =>
    api.put<{ success: boolean; message: string; data: ICMSBanner }>(`/admin/cms/${id}`, payload),
  deleteCMSBanner: (id: string) =>
    api.delete<{ success: boolean; message: string }>(`/admin/cms/${id}`),

  // Reviews
  getReviews: (status?: string) =>
    api.get<{ success: boolean; data: any[] }>('/admin/reviews', { params: { status } }),
  moderateReview: (id: string, action: 'APPROVE' | 'HIDE' | 'REPORT' | 'DELETE') =>
    api.patch<{ success: boolean; message: string }>(`/admin/reviews/${id}`, { action }),

  // Payments
  getPayments: () =>
    api.get<{ success: boolean; data: IPaymentTransaction[] }>('/admin/payments'),

  // Shipping
  getShippingMethods: () =>
    api.get<{ success: boolean; data: IShippingMethod[] }>('/admin/shipping'),
  createShippingMethod: (payload: any) =>
    api.post<{ success: boolean; message: string; data: IShippingMethod }>('/admin/shipping', payload),
  updateShippingMethod: (id: string, payload: any) =>
    api.put<{ success: boolean; message: string; data: IShippingMethod }>(`/admin/shipping/${id}`, payload),
  deleteShippingMethod: (id: string) =>
    api.delete<{ success: boolean; message: string }>(`/admin/shipping/${id}`),

  // Notifications
  getNotifications: () =>
    api.get<{ success: boolean; data: INotificationTemplate[] }>('/admin/notifications'),
  sendTestNotification: (event: string, recipientEmail?: string) =>
    api.post<{ success: boolean; message: string }>('/admin/notifications/test', { event, recipientEmail }),

  // Wishlist & Customer Activity
  getWishlistActivity: () =>
    api.get<{ success: boolean; data: IWishlistActivityItem[] }>('/admin/wishlist-activity'),

  // Reports
  getReports: (range: string, type: string) =>
    api.get<{ success: boolean; data: any }>('/admin/reports', { params: { range, type } }),

  // Settings
  getSettings: () =>
    api.get<{ success: boolean; data: IStoreSetting }>('/admin/settings'),
  updateSettings: (payload: any) =>
    api.put<{ success: boolean; message: string; data: IStoreSetting }>('/admin/settings', payload),
  updateProfile: (payload: any) =>
    api.put<{ success: boolean; message: string; data: any }>('/admin/profile', payload),
};

export default adminApi;
