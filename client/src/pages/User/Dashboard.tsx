import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  Package,
  Heart,
  ShoppingBag,
  User as UserIcon,
  MapPin,
  Shield,
  ArrowRight,
  Clock,
  ChevronRight,
} from 'lucide-react';
import api from '../../services/api';
import { IOrder } from '../../types';
import { AnnouncementBar } from '../../components/layout/AnnouncementBar';
import { Header } from '../../components/layout/Header';
import { Footer } from '../../components/layout/Footer';
import { useAuthStore } from '../../store/useAuthStore';
import { useCartStore } from '../../store/useCartStore';
import { useWishlistStore } from '../../store/useWishlistStore';
import UserAccountSection from '../../components/user/UserAccountSection';

export const UserDashboard: React.FC = () => {
  const { user, isAuthenticated, isAdmin } = useAuthStore();
  const { cart } = useCartStore();
  const { wishlistIds } = useWishlistStore();

  const { data: orders = [], isLoading: isLoadingOrders } = useQuery<IOrder[]>({
    queryKey: ['myOrders'],
    queryFn: async () => {
      const res = await api.get('/orders');
      return res.data?.data || [];
    },
    enabled: isAuthenticated,
  });

  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen flex flex-col bg-neutral-50">
        <AnnouncementBar />
        <Header />
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
          <div className="w-16 h-16 rounded-full bg-neutral-100 flex items-center justify-center mb-4">
            <UserIcon className="w-8 h-8 text-neutral-400" />
          </div>
          <h2 className="text-xl font-bold font-serif-luxury text-neutral-900 mb-2">Member Sign In Required</h2>
          <p className="text-xs text-neutral-500 max-w-sm mb-6">
            Please sign in to access your personal dashboard, order tracking, wishlist, and profile.
          </p>
          <Link
            to="/login"
            className="bg-neutral-950 text-white font-bold text-xs uppercase tracking-wider px-8 py-3 rounded-lg hover:bg-neutral-800 transition-colors"
          >
            Sign In to Dashboard
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const latestOrder = orders.length > 0 ? orders[0] : null;

  return (
    <div className="min-h-screen flex flex-col bg-neutral-50">
      <AnnouncementBar />
      <Header />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        {/* Welcome Header */}
        <div className="bg-neutral-950 text-white rounded-2xl p-6 sm:p-8 relative overflow-hidden shadow-xl border border-neutral-800">
          <div className="absolute right-0 top-0 translate-x-8 -translate-y-8 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center space-x-3.5 sm:space-x-4 min-w-0">
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gradient-to-tr from-amber-600 to-amber-400 text-neutral-950 flex items-center justify-center font-bold text-xl sm:text-2xl font-serif-luxury shadow-lg ring-4 ring-neutral-900 flex-shrink-0">
                {(user?.name || 'A').charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                  <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.2em] text-amber-400">
                    Aurelius Atelier Member
                  </span>
                  {isAdmin && (
                    <span className="bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[9px] sm:text-[10px] font-bold uppercase px-1.5 sm:px-2 py-0.5 rounded">
                      Executive Admin
                    </span>
                  )}
                </div>
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold uppercase tracking-tight font-serif-luxury text-white mt-1 truncate">
                  Welcome back, {user?.name || 'Gentleman'}
                </h1>
                <p className="text-[11px] sm:text-xs text-neutral-400 mt-1 truncate">
                  {user?.email} • Member ID: <span className="font-mono text-neutral-300">{(user?._id || user?.id || 'AUR-USER').slice(-8).toUpperCase()}</span>
                </p>
              </div>
            </div>

            {/* Quick Actions in Banner */}
            <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
              <Link
                to="/user/profile"
                className="bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-neutral-200 text-xs font-semibold px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-lg transition-colors flex items-center space-x-2"
              >
                <UserIcon className="w-3.5 h-3.5 text-amber-400" />
                <span>Account Settings</span>
              </Link>
              {isAdmin && (
                <Link
                  to="/admin/dashboard"
                  className="bg-amber-500 hover:bg-amber-400 text-neutral-950 text-xs font-bold uppercase tracking-wider px-4 sm:px-5 py-2 sm:py-2.5 rounded-lg transition-colors flex items-center space-x-2 shadow-md"
                >
                  <Shield className="w-4 h-4" />
                  <span>Admin Portal</span>
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* 4 Metric Summary Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {/* Orders Metric */}
          <Link
            to="/user/order"
            className="group bg-white border border-neutral-200 hover:border-neutral-900 rounded-xl p-4 sm:p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-neutral-500">My Orders</span>
              <div className="w-10 h-10 rounded-lg bg-neutral-100 group-hover:bg-neutral-900 group-hover:text-amber-400 text-neutral-700 flex items-center justify-center transition-colors">
                <Package className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-4">
              <span className="text-3xl font-extrabold text-neutral-950 font-serif-luxury">
                {isLoadingOrders ? '...' : orders.length}
              </span>
              <p className="text-[11px] text-neutral-500 mt-1 flex items-center justify-between">
                <span>Total purchases</span>
                <span className="text-amber-700 font-bold group-hover:translate-x-0.5 transition-transform flex items-center">
                  View <ChevronRight className="w-3 h-3 ml-0.5" />
                </span>
              </p>
            </div>
          </Link>

          {/* Wishlist Metric */}
          <Link
            to="/user/mywhishlist"
            className="group bg-white border border-neutral-200 hover:border-neutral-900 rounded-xl p-4 sm:p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-neutral-500">Wishlist</span>
              <div className="w-10 h-10 rounded-lg bg-neutral-100 group-hover:bg-neutral-900 group-hover:text-rose-400 text-neutral-700 flex items-center justify-center transition-colors">
                <Heart className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-4">
              <span className="text-3xl font-extrabold text-neutral-950 font-serif-luxury">
                {wishlistIds.length}
              </span>
              <p className="text-[11px] text-neutral-500 mt-1 flex items-center justify-between">
                <span>Saved luxury pieces</span>
                <span className="text-amber-700 font-bold group-hover:translate-x-0.5 transition-transform flex items-center">
                  Open <ChevronRight className="w-3 h-3 ml-0.5" />
                </span>
              </p>
            </div>
          </Link>

          {/* Shopping Bag Metric */}
          <Link
            to="/user/mycart"
            className="group bg-white border border-neutral-200 hover:border-neutral-900 rounded-xl p-4 sm:p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-neutral-500">Shopping Bag</span>
              <div className="w-10 h-10 rounded-lg bg-neutral-100 group-hover:bg-neutral-900 group-hover:text-amber-400 text-neutral-700 flex items-center justify-center transition-colors">
                <ShoppingBag className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-4">
              <span className="text-3xl font-extrabold text-neutral-950 font-serif-luxury">
                {cart?.itemCount || 0}
              </span>
              <p className="text-[11px] text-neutral-500 mt-1 flex items-center justify-between">
                <span>₹{(cart?.subtotal || 0).toLocaleString('en-IN')} subtotal</span>
                <span className="text-amber-700 font-bold group-hover:translate-x-0.5 transition-transform flex items-center">
                  Checkout <ChevronRight className="w-3 h-3 ml-0.5" />
                </span>
              </p>
            </div>
          </Link>

          {/* Saved Addresses Metric */}
          <Link
            to="/user/profile"
            className="group bg-white border border-neutral-200 hover:border-neutral-900 rounded-xl p-4 sm:p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-neutral-500">Saved Addresses</span>
              <div className="w-10 h-10 rounded-lg bg-neutral-100 group-hover:bg-neutral-900 group-hover:text-amber-400 text-neutral-700 flex items-center justify-center transition-colors">
                <MapPin className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-4">
              <span className="text-3xl font-extrabold text-neutral-950 font-serif-luxury">
                {user.addresses?.length || 0}
              </span>
              <p className="text-[11px] text-neutral-500 mt-1 flex items-center justify-between">
                <span>Shipping destinations</span>
                <span className="text-amber-700 font-bold group-hover:translate-x-0.5 transition-transform flex items-center">
                  Manage <ChevronRight className="w-3 h-3 ml-0.5" />
                </span>
              </p>
            </div>
          </Link>
        </div>

        {/* Flipkart-Style Account Settings & Personal Profile Section */}
        <div className="pt-2">
          <div className="border-b border-neutral-200 pb-3 mb-6 flex items-center justify-between">
            <h2 className="text-base font-bold uppercase tracking-wider text-neutral-900 font-serif-luxury">
              Account Management Center
            </h2>
            <span className="text-xs text-neutral-500">Settings & Atelier Privileges</span>
          </div>

          <UserAccountSection initialTab="profile" />
        </div>

        {/* Latest Order Spotlight */}
        <div className="bg-white border border-neutral-200 rounded-2xl p-6 sm:p-8 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-4 border-b border-neutral-100">
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4 text-amber-600" />
              <h2 className="text-sm font-bold uppercase tracking-wider text-neutral-900 font-serif-luxury">
                Latest Order Activity
              </h2>
            </div>
            <Link
              to="/user/order"
              className="text-xs font-bold uppercase tracking-wider text-amber-700 hover:text-amber-950 flex items-center space-x-1"
            >
              <span>View All ({orders.length})</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {latestOrder ? (
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pt-2">
              <div className="space-y-2">
                <div className="flex items-center space-x-3">
                  <span className="font-mono font-bold text-neutral-950 text-sm">{latestOrder.orderNumber}</span>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      latestOrder.orderStatus === 'DELIVERED'
                        ? 'bg-emerald-100 text-emerald-800'
                        : latestOrder.orderStatus === 'CANCELLED'
                        ? 'bg-rose-100 text-rose-800'
                        : 'bg-amber-100 text-amber-900'
                    }`}
                  >
                    {latestOrder.orderStatus}
                  </span>
                </div>
                <p className="text-xs text-neutral-500">
                  Placed on {new Date(latestOrder.createdAt).toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  })} • {latestOrder.items.length} piece{latestOrder.items.length > 1 ? 's' : ''} • Total: ₹{latestOrder.pricing.totalAmount.toLocaleString('en-IN')}
                </p>

                {/* Items Thumbnails */}
                <div className="flex items-center space-x-2 pt-2 overflow-x-auto">
                  {latestOrder.items.slice(0, 4).map((item, idx) => (
                    <img
                      key={idx}
                      src={item.image}
                      alt={item.title}
                      title={item.title}
                      className="w-12 h-14 object-cover rounded bg-neutral-100 border border-neutral-200 flex-shrink-0"
                    />
                  ))}
                  {latestOrder.items.length > 4 && (
                    <span className="text-xs text-neutral-400 pl-1">
                      +{latestOrder.items.length - 4} more
                    </span>
                  )}
                </div>
              </div>

              <div className="flex-shrink-0">
                <Link
                  to={`/user/order/${latestOrder._id}`}
                  className="inline-flex items-center space-x-2 bg-neutral-950 hover:bg-neutral-800 text-white font-bold text-xs uppercase tracking-wider px-6 py-3 rounded-lg transition-colors shadow-sm"
                >
                  <span>Track This Order</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ) : (
            <div className="py-8 text-center text-neutral-400 space-y-3">
              <Package className="w-10 h-10 text-neutral-300 mx-auto" />
              <p className="text-xs text-neutral-500">You haven't placed any orders yet.</p>
              <Link
                to="/products"
                className="inline-flex items-center space-x-1.5 text-xs font-bold uppercase tracking-wider text-amber-700 hover:text-amber-900"
              >
                <span>Browse the Atelier Collection</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default UserDashboard;
