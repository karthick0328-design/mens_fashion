import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Package, ChevronRight } from 'lucide-react';
import api from '../../services/api';
import { IOrder } from '../../types';
import { AnnouncementBar } from '../../components/layout/AnnouncementBar';
import { Header } from '../../components/layout/Header';
import { Footer } from '../../components/layout/Footer';
import { useAuthStore } from '../../store/useAuthStore';

export const OrdersPage: React.FC = () => {
  const { isAuthenticated } = useAuthStore();

  const { data: orders = [], isLoading } = useQuery<IOrder[]>({
    queryKey: ['myOrders'],
    queryFn: async () => {
      const res = await api.get('/orders');
      return res.data?.data || [];
    },
    enabled: isAuthenticated,
  });

  return (
    <div className="min-h-screen flex flex-col bg-neutral-50">
      <AnnouncementBar />
      <Header />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="border-b border-neutral-200 pb-4 mb-8 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-amber-700 block mb-1">
              Account History
            </span>
            <h1 className="text-2xl font-extrabold uppercase tracking-tight font-serif-luxury text-neutral-900">
              My Orders ({orders.length})
            </h1>
          </div>
          <Link to="/products" className="text-xs font-bold uppercase tracking-wider text-neutral-600 hover:text-neutral-900">
            Browse Atelier
          </Link>
        </div>

        {!isAuthenticated ? (
          <div className="bg-white border border-neutral-200 rounded-xl p-12 text-center max-w-md mx-auto my-12 shadow-sm">
            <Package className="w-12 h-12 text-neutral-400 mx-auto mb-3" />
            <h2 className="text-base font-bold text-neutral-900 mb-1">Sign in to view orders</h2>
            <p className="text-xs text-neutral-500 mb-5">Access your order receipts and live shipment tracking.</p>
            <Link
              to="/login"
              className="bg-neutral-950 text-white font-bold text-xs uppercase tracking-wider px-6 py-2.5 rounded"
            >
              Sign In
            </Link>
          </div>
        ) : isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((n) => (
              <div key={n} className="bg-white border rounded-xl p-6 h-36 animate-pulse" />
            ))}
          </div>
        ) : orders.length === 0 ? (
          <div className="bg-white border border-neutral-200 rounded-xl p-16 text-center max-w-md mx-auto my-12 shadow-sm">
            <Package className="w-16 h-16 text-neutral-300 mx-auto mb-4 stroke-1" />
            <h2 className="text-base font-bold text-neutral-900 mb-1">No orders placed yet</h2>
            <p className="text-xs text-neutral-500 mb-6">
              When you purchase our handcrafted clothing, watches, or accessories, they will appear here.
            </p>
            <Link
              to="/products"
              className="bg-neutral-950 text-white font-bold text-xs uppercase tracking-wider px-6 py-3 rounded"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div
                key={order._id}
                className="bg-white border border-neutral-200 rounded-xl p-5 sm:p-6 shadow-sm hover:border-neutral-300 transition-all space-y-4"
              >
                {/* Order Top Bar */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-neutral-100 gap-2 text-xs">
                  <div>
                    <span className="font-bold text-neutral-900 block font-mono text-sm">
                      {order.orderNumber}
                    </span>
                    <span className="text-neutral-500 text-[11px]">
                      Placed on {new Date(order.createdAt).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </span>
                  </div>

                  <div className="flex items-center space-x-3">
                    <span
                      className={`px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider ${
                        order.orderStatus === 'DELIVERED'
                          ? 'bg-emerald-100 text-emerald-800'
                          : order.orderStatus === 'CANCELLED'
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-amber-100 text-amber-900'
                      }`}
                    >
                      {order.orderStatus}
                    </span>
                    <span className="text-sm font-bold text-neutral-900">
                      ₹{order.pricing.totalAmount.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>

                {/* Items Thumbnails */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center space-x-2 sm:space-x-3 overflow-x-auto py-1 no-scrollbar">
                    {order.items.slice(0, 4).map((item, idx) => (
                      <div key={idx} className="flex items-center space-x-2 bg-neutral-50 p-1.5 rounded-lg border border-neutral-100 flex-shrink-0">
                        <img
                          src={item.image}
                          alt={item.title}
                          className="w-12 h-14 object-cover rounded bg-neutral-200 flex-shrink-0"
                        />
                        <div className="text-[11px] pr-2 hidden sm:block">
                          <span className="font-semibold text-neutral-900 line-clamp-1 max-w-[140px]">{item.title}</span>
                          <span className="text-neutral-500">Qty: {item.quantity}</span>
                        </div>
                      </div>
                    ))}
                    {order.items.length > 4 && (
                      <span className="text-xs text-neutral-500 font-semibold pl-1 flex-shrink-0">
                        +{order.items.length - 4} more
                      </span>
                    )}
                  </div>

                  <Link
                    to={`/user/order/${order._id}`}
                    className="inline-flex items-center space-x-1 text-xs font-bold uppercase tracking-wider text-amber-700 hover:text-amber-950 sm:pl-4 self-end sm:self-auto flex-shrink-0"
                  >
                    <span>View Tracking</span>
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default OrdersPage;
