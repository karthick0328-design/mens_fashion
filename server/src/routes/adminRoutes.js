import { Router } from 'express';
import {
  getDashboardAnalytics,
  // Products
  getAdminProducts,
  getProductById,
  createProduct,
  updateProduct,
  duplicateProduct,
  deleteProduct,
  bulkUpdateProducts,
  // Categories & Collections
  getAdminCategories,
  createAdminCategory,
  updateAdminCategory,
  deleteAdminCategory,
  getAdminCollections,
  // Inventory
  getAdminInventory,
  updateVariantStock,
  getInventoryLogs,
  // Orders
  getAdminOrders,
  getAdminOrderById,
  updateOrderStatus,
  updateOrderTracking,
  refundOrder,
  // Customers
  getAdminCustomers,
  getAdminCustomerDetails,
  updateCustomerStatus,
  // Gift Cards
  getAdminGiftCards,
  createGiftCard,
  updateGiftCardStatus,
  getGiftCardTransactions,
  // Coupons
  getAdminCoupons,
  createAdminCoupon,
  updateAdminCoupon,
  deleteAdminCoupon,
  // CMS / Homepage
  getAdminCMSBanners,
  createCMSBanner,
  updateCMSBanner,
  deleteCMSBanner,
  // Reviews
  getAdminReviews,
  moderateReview,
  // Payments
  getAdminPayments,
  // Shipping
  getAdminShippingMethods,
  createShippingMethod,
  updateShippingMethod,
  deleteShippingMethod,
  // Notifications
  getAdminNotifications,
  sendTestNotification,
  // Wishlist & Activity
  getAdminWishlistActivity,
  // Reports
  getAdminReports,
  // Settings
  getAdminSettings,
  updateAdminSettings,
  updateAdminProfile,
} from '../controllers/adminController.js';
import { protect, authorize } from '../middleware/auth.js';
import { USER_ROLES } from '../constants/index.js';

const router = Router();

// Secure all admin routes with authentication and staff/manager/admin roles
router.use(protect);
router.use(
  authorize(
    USER_ROLES.SUPER_ADMIN,
    USER_ROLES.ADMIN,
    USER_ROLES.MANAGER,
    USER_ROLES.STAFF
  )
);

// 1. Dashboard
router.get('/analytics/dashboard', getDashboardAnalytics);
router.get('/dashboard', getDashboardAnalytics);

// 2. Products
router.get('/products', getAdminProducts);
router.get('/products/:id', getProductById);
router.post('/products', createProduct);
router.put('/products/:id', updateProduct);
router.post('/products/:id/duplicate', duplicateProduct);
router.delete('/products/:id', deleteProduct);
router.post('/products/bulk', bulkUpdateProducts);

// 3. Categories & Collections
router.get('/categories', getAdminCategories);
router.post('/categories', createAdminCategory);
router.put('/categories/:id', updateAdminCategory);
router.delete('/categories/:id', deleteAdminCategory);
router.get('/collections', getAdminCollections);

// 4. Inventory
router.get('/inventory', getAdminInventory);
router.patch('/inventory/:sku', updateVariantStock);
router.get('/inventory/logs', getInventoryLogs);

// 5. Orders
router.get('/orders', getAdminOrders);
router.get('/orders/:id', getAdminOrderById);
router.patch('/orders/:id/status', updateOrderStatus);
router.patch('/orders/:id/tracking', updateOrderTracking);
router.post('/orders/:id/refund', refundOrder);

// 6. Customers
router.get('/customers', getAdminCustomers);
router.get('/customers/:id', getAdminCustomerDetails);
router.patch('/customers/:id/status', updateCustomerStatus);

// 7. Gift Cards
router.get('/gift-cards', getAdminGiftCards);
router.post('/gift-cards', createGiftCard);
router.patch('/gift-cards/:id/status', updateGiftCardStatus);
router.get('/gift-cards/transactions', getGiftCardTransactions);

// 8. Coupons
router.get('/coupons', getAdminCoupons);
router.post('/coupons', createAdminCoupon);
router.put('/coupons/:id', updateAdminCoupon);
router.delete('/coupons/:id', deleteAdminCoupon);

// 9. CMS / Homepage
router.get('/cms', getAdminCMSBanners);
router.post('/cms', createCMSBanner);
router.put('/cms/:id', updateCMSBanner);
router.delete('/cms/:id', deleteCMSBanner);

// 10. Reviews Moderation
router.get('/reviews', getAdminReviews);
router.patch('/reviews/:id', moderateReview);

// 11. Payments
router.get('/payments', getAdminPayments);

// 12. Shipping
router.get('/shipping', getAdminShippingMethods);
router.post('/shipping', createShippingMethod);
router.put('/shipping/:id', updateShippingMethod);
router.delete('/shipping/:id', deleteShippingMethod);

// 13. Notifications
router.get('/notifications', getAdminNotifications);
router.post('/notifications/test', sendTestNotification);

// 14. Wishlist & Customer Activity
router.get('/wishlist-activity', getAdminWishlistActivity);

// 15. Reports & Analytics
router.get('/reports', getAdminReports);

// 16. Settings
router.get('/settings', getAdminSettings);
router.put('/settings', updateAdminSettings);
router.put('/profile', updateAdminProfile);

export default router;
