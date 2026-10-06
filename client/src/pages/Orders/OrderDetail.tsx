import React from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  CheckCircle2,
  MapPin,
  CreditCard,
  ChevronLeft,
  XCircle,
} from 'lucide-react';
import api from '../../services/api';
import { IOrder, OrderStatus } from '../../types';
import { AnnouncementBar } from '../../components/layout/AnnouncementBar';
import { Header } from '../../components/layout/Header';
import { Footer } from '../../components/layout/Footer';

export const OrderDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const queryClient = useQueryClient();
  const isNewOrder = location.state?.isNewOrder;

  const { data: order, isLoading } = useQuery<IOrder>({
    queryKey: ['order', id],
    queryFn: async () => {
      const res = await api.get(`/orders/${id}`);
      return res.data?.data;
    },
    enabled: Boolean(id),
  });

  const cancelMutation = useMutation({
    mutationFn: async () => {
      const res = await api.patch(`/orders/${id}/cancel`);
      return res.data?.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['order', id] });
      queryClient.invalidateQueries({ queryKey: ['myOrders'] });
      alert('Order cancelled successfully.');
    },
    onError: (err: any) => {
      alert(err.response?.data?.message || 'Could not cancel order.');
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-neutral-50">
        <AnnouncementBar />
        <Header />
        <div className="max-w-4xl mx-auto px-4 py-16 w-full animate-pulse space-y-4">
          <div className="h-10 bg-neutral-200 rounded w-1/3" />
          <div className="h-48 bg-neutral-200 rounded-xl" />
        </div>
        <Footer />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen flex flex-col bg-neutral-50">
        <AnnouncementBar />
        <Header />
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
          <h2 className="text-xl font-bold font-serif-luxury text-neutral-900 mb-2">Order Not Found</h2>
          <Link to="/user/order" className="text-xs font-bold text-amber-700 hover:underline">
            Back to My Orders
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const milestones: OrderStatus[] = ['CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED'];
  const currentStatusIndex = milestones.indexOf(order.orderStatus);

  return (
    <div className="min-h-screen flex flex-col bg-neutral-50">
      <AnnouncementBar />
      <Header />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
        {/* Navigation link */}
        <Link
          to="/user/order"
          className="inline-flex items-center space-x-1 text-xs font-semibold text-neutral-600 hover:text-neutral-900"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Back to All Orders</span>
        </Link>

        {/* New Order Celebration Banner */}
        {isNewOrder && (
          <div className="bg-emerald-950 text-white rounded-xl p-6 sm:p-8 flex items-center space-x-4 shadow-xl border border-emerald-800">
            <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center flex-shrink-0">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-extrabold uppercase font-serif-luxury text-white">
                Thank You For Your Order!
              </h2>
              <p className="text-xs sm:text-sm text-emerald-200 mt-1">
                Your order <strong className="text-white font-mono">{order.orderNumber}</strong> has been received by our atelier and is being carefully prepared.
              </p>
            </div>
          </div>
        )}

        {/* Order Header Card */}
        <div className="bg-white border border-neutral-200 rounded-xl p-6 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-neutral-100 gap-2">
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-bold uppercase tracking-wider text-neutral-500">Order ID:</span>
                <span className="text-base font-extrabold text-neutral-950 font-mono">{order.orderNumber}</span>
              </div>
              <span className="text-xs text-neutral-500">
                Placed on {new Date(order.createdAt).toLocaleDateString('en-IN', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </span>
            </div>

            <div className="flex items-center space-x-3">
              <span
                className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                  order.orderStatus === 'DELIVERED'
                    ? 'bg-emerald-100 text-emerald-800'
                    : order.orderStatus === 'CANCELLED'
                    ? 'bg-rose-100 text-rose-800'
                    : 'bg-amber-100 text-amber-900'
                }`}
              >
                {order.orderStatus}
              </span>

              {/* Cancel Button if eligible */}
              {order.orderStatus === 'CONFIRMED' && (
                <button
                  onClick={() => {
                    if (window.confirm('Are you sure you want to cancel this order?')) {
                      cancelMutation.mutate();
                    }
                  }}
                  disabled={cancelMutation.isPending}
                  className="text-xs font-semibold text-rose-600 hover:text-rose-800 border border-rose-200 hover:border-rose-400 px-3 py-1 rounded"
                >
                  {cancelMutation.isPending ? 'Cancelling...' : 'Cancel Order'}
                </button>
              )}
            </div>
          </div>

          {/* Visual Milestone Tracking Timeline */}
          {order.orderStatus !== 'CANCELLED' ? (
            <div className="py-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-500 mb-6">
                Shipment Progress
              </h3>
              <div className="grid grid-cols-4 gap-2 relative">
                {milestones.map((m, idx) => {
                  const isDone = idx <= currentStatusIndex;
                  const isCurrent = idx === currentStatusIndex;
                  return (
                    <div key={m} className="flex flex-col items-center text-center relative z-10">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                          isDone
                            ? 'bg-neutral-950 text-white shadow-sm'
                            : 'bg-neutral-100 border border-neutral-300 text-neutral-400'
                        } ${isCurrent ? 'ring-4 ring-neutral-200' : ''}`}
                      >
                        {isDone ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : idx + 1}
                      </div>
                      <span className={`text-[9px] sm:text-[11px] font-bold uppercase tracking-wider mt-2 ${isDone ? 'text-neutral-900' : 'text-neutral-400'}`}>
                        {m}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg flex items-center space-x-2 text-xs text-rose-700">
              <XCircle className="w-4 h-4 text-rose-600" />
              <span>This order was cancelled. Restocked in inventory.</span>
            </div>
          )}
        </div>

        {/* Items List */}
        <div className="bg-white border border-neutral-200 rounded-xl p-6 shadow-sm space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-900 pb-3 border-b border-neutral-100">
            Ordered Pieces ({order.items.length})
          </h3>
          <div className="divide-y divide-neutral-100">
            {order.items.map((item) => (
              <div key={item.sku} className="py-3 flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-16 h-20 object-cover rounded-lg bg-neutral-100 flex-shrink-0"
                  />
                  <div className="text-xs space-y-1">
                    <h4 className="font-bold text-neutral-900">{item.title}</h4>
                    <p className="text-neutral-500">
                      Color: <strong>{item.color.name}</strong> • Size: <strong>{item.size}</strong> • Qty: <strong>{item.quantity}</strong>
                    </p>
                    <p className="text-neutral-400 font-mono text-[10px]">SKU: {item.sku}</p>
                  </div>
                </div>
                <div className="text-right text-xs">
                  <span className="font-extrabold text-neutral-900 text-sm">
                    ₹{item.totalPrice.toLocaleString('en-IN')}
                  </span>
                  <span className="block text-neutral-400 text-[11px]">
                    ₹{item.unitPrice.toLocaleString('en-IN')} each
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 2-Col Shipping & Price Breakdown */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Shipping Details */}
          <div className="bg-white border border-neutral-200 rounded-xl p-5 shadow-sm space-y-2 text-xs">
            <div className="flex items-center space-x-1.5 font-bold uppercase tracking-wider text-neutral-900 pb-2 border-b border-neutral-100">
              <MapPin className="w-4 h-4 text-amber-600" />
              <span>Shipping Destination</span>
            </div>
            <p className="font-bold text-neutral-900 pt-1">{order.shippingAddress.name}</p>
            <p className="text-neutral-600 leading-relaxed">
              {order.shippingAddress.addressLine1}, {order.shippingAddress.addressLine2 ? `${order.shippingAddress.addressLine2}, ` : ''}
              {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.postalCode}
            </p>
            <p className="text-neutral-500 font-medium">Contact: {order.shippingAddress.phone}</p>
          </div>

          {/* Pricing Breakdown */}
          <div className="bg-white border border-neutral-200 rounded-xl p-5 shadow-sm space-y-2 text-xs">
            <div className="flex items-center space-x-1.5 font-bold uppercase tracking-wider text-neutral-900 pb-2 border-b border-neutral-100">
              <CreditCard className="w-4 h-4 text-amber-600" />
              <span>Payment & Summary ({order.payment.method})</span>
            </div>
            <div className="space-y-1.5 pt-1 text-neutral-600">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-semibold text-neutral-900">₹{order.pricing.subtotal.toLocaleString('en-IN')}</span>
              </div>
              {order.pricing.discount > 0 && (
                <div className="flex justify-between text-emerald-700">
                  <span>Coupon Discount</span>
                  <span>-₹{order.pricing.discount.toLocaleString('en-IN')}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Delivery Charge</span>
                <span>{order.pricing.shippingFee === 0 ? <strong className="text-emerald-700 uppercase">Free</strong> : `₹${order.pricing.shippingFee}`}</span>
              </div>
              <div className="pt-2 border-t border-neutral-200 flex justify-between text-sm font-extrabold text-neutral-950">
                <span>Total Paid</span>
                <span>₹{order.pricing.totalAmount.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default OrderDetailPage;
