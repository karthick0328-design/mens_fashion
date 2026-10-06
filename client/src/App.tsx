import React from 'react';
import { Routes, Route, Navigate, useParams } from 'react-router-dom';
import HomePage from './pages/Home';
import ProductsPage from './pages/Products';
import ProductDetailsPage from './pages/ProductDetails';
import CartPage from './pages/Cart';
import WishlistPage from './pages/Wishlist';
import CheckoutPage from './pages/Checkout';
import OrdersPage from './pages/Orders';
import OrderDetailPage from './pages/Orders/OrderDetail';
import ProfilePage from './pages/Profile';
import UserDashboard from './pages/User/Dashboard';
import LoginPage from './pages/Auth/Login';
import RegisterPage from './pages/Auth/Register';
import GiftCardsPage from './pages/GiftCards';

// Admin Suite Components
import AdminLayout from './admin/layouts/AdminLayout';
import DashboardPage from './admin/pages/DashboardPage';
import ProductsListPage from './admin/pages/ProductsListPage';
import ProductFormPage from './admin/pages/ProductFormPage';
import CategoriesPage from './admin/pages/CategoriesPage';
import InventoryPage from './admin/pages/InventoryPage';
import OrdersListPage from './admin/pages/OrdersListPage';
import OrderDetailPageAdmin from './admin/pages/OrderDetailPage';
import CustomersListPage from './admin/pages/CustomersListPage';
import GiftCardsPageAdmin from './admin/pages/GiftCardsPage';
import CouponsPage from './admin/pages/CouponsPage';
import HomepageCMSPage from './admin/pages/HomepageCMSPage';
import ReviewsPage from './admin/pages/ReviewsPage';
import PaymentsPage from './admin/pages/PaymentsPage';
import ShippingPage from './admin/pages/ShippingPage';
import NotificationsPage from './admin/pages/NotificationsPage';
import WishlistActivityPage from './admin/pages/WishlistActivityPage';
import ReportsPage from './admin/pages/ReportsPage';
import SettingsPage from './admin/pages/SettingsPage';

const OrderDetailRedirect: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  return <Navigate to={`/user/order/${id}`} replace />;
};

const NotFoundPage: React.FC = () => (
  <div className="min-h-screen bg-neutral-950 text-white flex flex-col items-center justify-center p-6 text-center">
    <span className="text-amber-500 font-mono text-sm tracking-widest uppercase mb-2">404 Exception</span>
    <h1 className="text-4xl sm:text-6xl font-black font-serif-luxury uppercase tracking-wider mb-4">
      Page Not Found
    </h1>
    <p className="text-neutral-400 text-sm max-w-sm mb-8">
      The requested sartorial page or collection does not exist in our atelier.
    </p>
    <a
      href="/"
      className="bg-amber-500 text-neutral-950 font-bold uppercase tracking-wider text-xs px-8 py-3.5 rounded-lg hover:bg-amber-400 transition-colors"
    >
      Return to Storefront
    </a>
  </div>
);

const App: React.FC = () => {
  return (
    <Routes>
      {/* Customer Marketplace Routes */}
      <Route path="/" element={<HomePage />} />
      <Route path="/products" element={<ProductsPage />} />
      <Route path="/products/:slug" element={<ProductDetailsPage />} />
      <Route path="/category/:slug" element={<ProductsPage />} />
      <Route path="/search" element={<ProductsPage />} />
      <Route path="/checkout" element={<CheckoutPage />} />
      <Route path="/gift-cards" element={<GiftCardsPage />} />
      <Route path="/giftcards" element={<Navigate to="/gift-cards" replace />} />
      <Route path="/giftcard" element={<Navigate to="/gift-cards" replace />} />

      {/* User Dashboard & Portal Routes */}
      <Route path="/user/dashboard" element={<UserDashboard />} />
      <Route path="/user/profile" element={<ProfilePage />} />
      <Route path="/user/profile/addresses" element={<ProfilePage />} />
      <Route path="/user/mywhishlist" element={<WishlistPage />} />
      <Route path="/user/mywishlist" element={<WishlistPage />} />
      <Route path="/user/mycart" element={<CartPage />} />
      <Route path="/user/order" element={<OrdersPage />} />
      <Route path="/user/order/:id" element={<OrderDetailPage />} />
      <Route path="/user" element={<Navigate to="/user/dashboard" replace />} />

      {/* Legacy / Direct Route Compatibility Redirects */}
      <Route path="/cart" element={<Navigate to="/user/mycart" replace />} />
      <Route path="/wishlist" element={<Navigate to="/user/mywhishlist" replace />} />
      <Route path="/orders" element={<Navigate to="/user/order" replace />} />
      <Route path="/orders/:id" element={<OrderDetailRedirect />} />
      <Route path="/profile" element={<Navigate to="/user/profile" replace />} />
      <Route path="/profile/addresses" element={<Navigate to="/user/profile" replace />} />

      {/* Auth Routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Admin Portal Suite Routes */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="dashboard" element={<DashboardPage />} />
        
        {/* Product Management */}
        <Route path="products" element={<ProductsListPage />} />
        <Route path="products/create" element={<ProductFormPage />} />
        <Route path="products/edit/:id" element={<ProductFormPage />} />
        <Route path="categories" element={<CategoriesPage />} />
        <Route path="inventory" element={<InventoryPage />} />

        {/* Sales */}
        <Route path="orders" element={<OrdersListPage />} />
        <Route path="orders/:id" element={<OrderDetailPageAdmin />} />
        <Route path="customers" element={<CustomersListPage />} />
        <Route path="payments" element={<PaymentsPage />} />
        <Route path="gift-cards" element={<GiftCardsPageAdmin />} />

        {/* Marketing */}
        <Route path="coupons" element={<CouponsPage />} />
        <Route path="cms" element={<HomepageCMSPage />} />
        <Route path="notifications" element={<NotificationsPage />} />

        {/* Engagement */}
        <Route path="reviews" element={<ReviewsPage />} />
        <Route path="wishlist-activity" element={<WishlistActivityPage />} />

        {/* Intelligence & System */}
        <Route path="reports" element={<ReportsPage />} />
        <Route path="shipping" element={<ShippingPage />} />
        <Route path="settings" element={<SettingsPage />} />
      </Route>

      {/* 404 Fallback */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default App;
