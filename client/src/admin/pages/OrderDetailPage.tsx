import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ArrowLeft, MapPin } from 'lucide-react';
import adminApi from '../services/adminApi';
import { StatusBadge } from '../components/StatusBadge';
import { Modal } from '../components/Modal';
import { OrderStatus } from '../../types';

export const OrderDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Modals state
  const [isTrackingModalOpen, setIsTrackingModalOpen] = useState(false);
  const [courierName, setCourierName] = useState('Bluedart Atelier Express');
  const [trackingNumber, setTrackingNumber] = useState('');
  const [estimatedDelivery, setEstimatedDelivery] = useState('3–5 Business Days');

  const [isRefundModalOpen, setIsRefundModalOpen] = useState(false);
  const [refundReason, setRefundReason] = useState('Customer exchange/return requested');

  const { data: order, isLoading } = useQuery<any>({
    queryKey: ['adminOrderDetail', id],
    queryFn: async () => {
      if (!id) return null;
      const res = await adminApi.getOrderById(id);
      return res.data?.data;
    },
    enabled: Boolean(id),
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ status, note }: { status: OrderStatus; note?: string }) => {
      if (!id) return;
      return adminApi.updateOrderStatus(id, status, note);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminOrderDetail', id] });
      queryClient.invalidateQueries({ queryKey: ['adminOrders'] });
    },
  });

  const updateTrackingMutation = useMutation({
    mutationFn: async () => {
      if (!id) return;
      return adminApi.updateOrderTracking(id, courierName, trackingNumber, estimatedDelivery);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminOrderDetail', id] });
      setIsTrackingModalOpen(false);
    },
  });

  const refundMutation = useMutation({
    mutationFn: async () => {
      if (!id) return;
      return adminApi.refundOrder(id, refundReason, order?.pricing?.totalAmount);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminOrderDetail', id] });
      setIsRefundModalOpen(false);
    },
  });

  if (isLoading || !order) {
    return (
      <div className="py-24 text-center text-xs text-neutral-400">
        <div className="w-5 h-5 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        Loading sartorial order records...
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-16">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-neutral-200 ">
        <div className="flex items-center space-x-3">
          <button
            onClick={() => navigate('/admin/orders')}
            className="p-2 rounded-lg border border-neutral-200 text-neutral-400 hover:text-neutral-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-yellow-600 ">
                Order Inspection
              </span>
              <StatusBadge status={order.orderStatus} type="order" />
            </div>
            <h1 className="text-2xl font-bold font-serif-luxury text-neutral-900 uppercase tracking-tight font-mono">
              {order.orderNumber}
            </h1>
          </div>
        </div>

        {/* Quick Action Buttons */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          {order.orderStatus === 'CONFIRMED' && (
            <button
              onClick={() => updateStatusMutation.mutate({ status: 'PROCESSING', note: 'Sent to atelier workshop' })}
              className="px-4 py-2 bg-neutral-900 text-white font-bold uppercase text-[10px] tracking-wider rounded-lg shadow-sm"
            >
              Process Order
            </button>
          )}

          {order.orderStatus === 'PROCESSING' && (
            <button
              onClick={() => setIsTrackingModalOpen(true)}
              className="px-4 py-2 bg-yellow-400 hover:bg-yellow-500 text-neutral-950 font-bold uppercase text-[10px] tracking-wider rounded-lg shadow-sm"
            >
              Dispatch & Add Tracking
            </button>
          )}

          {order.orderStatus === 'SHIPPED' && (
            <button
              onClick={() => updateStatusMutation.mutate({ status: 'DELIVERED', note: 'Customer delivery confirmed' })}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold uppercase text-[10px] tracking-wider rounded-lg shadow-sm"
            >
              Mark Delivered
            </button>
          )}

          {order.orderStatus !== 'CANCELLED' && order.orderStatus !== 'DELIVERED' && (
            <button
              onClick={() => setIsRefundModalOpen(true)}
              className="px-3.5 py-2 border border-rose-300 text-rose-600 font-bold uppercase text-[10px] tracking-wider rounded-lg hover:bg-rose-50 "
            >
              Cancel & Refund
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Order Items & Timeline */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order Items Table */}
          <div className="bg-white border border-neutral-200 rounded-xl p-6 shadow-sm space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-900 font-serif-luxury pb-2 border-b border-neutral-100 ">
              Purchased Fashion Pieces ({order.items?.length || 0})
            </h3>

            <div className="divide-y divide-neutral-100 ">
              {order.items?.map((item: any, idx: number) => (
                <div key={idx} className="py-4 flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-3.5">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-12 h-14 object-cover rounded-md bg-neutral-100 border border-neutral-200 flex-shrink-0"
                    />
                    <div>
                      <span className="font-bold text-neutral-900 block line-clamp-1">
                        {item.title}
                      </span>
                      <span className="text-[11px] text-neutral-400 font-mono block">
                        SKU: {item.sku}
                      </span>
                      <span className="text-[11px] text-neutral-500 mt-0.5 block">
                        Color: {item.color?.name || 'Black'} | Size: {item.size}
                      </span>
                    </div>
                  </div>

                  <div className="text-right space-y-1">
                    <span className="font-bold text-neutral-900 font-serif-luxury block">
                      ₹{item.unitPrice?.toLocaleString('en-IN')} × {item.quantity}
                    </span>
                    <span className="text-xs font-bold text-yellow-600 block font-serif-luxury">
                      = ₹{item.totalPrice?.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Timeline */}
          <div className="bg-white border border-neutral-200 rounded-xl p-6 shadow-sm space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-900 font-serif-luxury pb-2 border-b border-neutral-100 ">
              Fulfillment Journey & Timeline
            </h3>

            <div className="relative pl-6 space-y-5 text-xs before:absolute before:left-2 before:top-2 before:bottom-2 before:w-[1px] before:bg-neutral-200 ">
              {order.timeline?.map((step: any, index: number) => (
                <div key={index} className="relative">
                  <div className="absolute -left-[19px] top-1 w-2.5 h-2.5 rounded-full bg-yellow-400 ring-4 ring-white " />
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-neutral-900 font-mono uppercase text-[11px]">
                      {step.status}
                    </span>
                    <span className="text-[10px] text-neutral-400">
                      {new Date(step.timestamp).toLocaleString()}
                    </span>
                  </div>
                  {step.note && (
                    <p className="text-[11px] text-neutral-500 mt-0.5">
                      {step.note}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Customer Info, Addresses, Summary, Shipping */}
        <div className="space-y-6">
          {/* Order Summary */}
          <div className="bg-white border border-neutral-200 rounded-xl p-6 shadow-sm space-y-3 text-xs">
            <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-900 font-serif-luxury pb-2 border-b border-neutral-100 ">
              Order Financials
            </h3>

            <div className="space-y-2 text-neutral-600 ">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-mono text-neutral-900 ">
                  ₹{order.pricing?.subtotal?.toLocaleString('en-IN') || 0}
                </span>
              </div>
              <div className="flex justify-between text-emerald-600 ">
                <span>Promotional Discount</span>
                <span className="font-mono">
                  -₹{order.pricing?.discount?.toLocaleString('en-IN') || 0}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Courier Handling</span>
                <span className="font-mono text-neutral-900 ">
                  {order.pricing?.shippingFee === 0 ? 'Complimentary' : `₹${order.pricing?.shippingFee}`}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Estimated Taxes</span>
                <span className="font-mono text-neutral-900 ">
                  ₹{order.pricing?.tax?.toLocaleString('en-IN') || 0}
                </span>
              </div>
            </div>

            <div className="pt-3 border-t border-neutral-200 flex justify-between items-center text-sm font-bold">
              <span className="text-neutral-900 uppercase font-serif-luxury">
                Grand Total
              </span>
              <span className="text-base text-yellow-600 font-serif-luxury">
                ₹{order.pricing?.totalAmount?.toLocaleString('en-IN') || 0}
              </span>
            </div>
          </div>

          {/* Payment & Logistics Card */}
          <div className="bg-white border border-neutral-200 rounded-xl p-6 shadow-sm space-y-3 text-xs">
            <div className="flex items-center justify-between pb-2 border-b border-neutral-100 ">
              <span className="font-bold uppercase tracking-wider text-neutral-900 font-serif-luxury">
                Payment & Carrier
              </span>
              <StatusBadge status={order.payment?.status} type="payment" />
            </div>

            <div className="space-y-2 text-neutral-600 ">
              <div className="flex justify-between">
                <span>Payment Method</span>
                <span className="font-semibold text-neutral-900 ">
                  {order.payment?.method}
                </span>
              </div>
              {order.payment?.transactionId && (
                <div className="flex justify-between">
                  <span>Txn ID</span>
                  <span className="font-mono text-[11px] text-neutral-500">
                    {order.payment.transactionId}
                  </span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Courier Partner</span>
                <span className="font-medium text-neutral-900 ">
                  {order.shippingDetails?.courier || 'Bluedart Atelier'}
                </span>
              </div>
              {order.shippingDetails?.trackingNumber && (
                <div className="flex justify-between">
                  <span>Tracking #</span>
                  <span className="font-mono text-[11px] font-bold text-yellow-600 ">
                    {order.shippingDetails.trackingNumber}
                  </span>
                </div>
              )}
            </div>

            <div className="pt-2">
              <button
                onClick={() => setIsTrackingModalOpen(true)}
                className="w-full py-2 rounded-lg border border-neutral-300 text-xs font-semibold text-neutral-700 hover:bg-neutral-100 transition-colors uppercase tracking-wider"
              >
                Update Tracking Details
              </button>
            </div>
          </div>

          {/* Shipping Address */}
          <div className="bg-white border border-neutral-200 rounded-xl p-6 shadow-sm space-y-3 text-xs">
            <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-900 font-serif-luxury pb-2 border-b border-neutral-100 flex items-center space-x-2">
              <MapPin className="w-4 h-4 text-yellow-600 " />
              <span>Client Delivery Address</span>
            </h3>

            <div className="text-neutral-600 space-y-1">
              <p className="font-bold text-neutral-900 text-xs">
                {order.shippingAddress?.name}
              </p>
              <p>{order.shippingAddress?.addressLine1}</p>
              {order.shippingAddress?.addressLine2 && <p>{order.shippingAddress.addressLine2}</p>}
              <p>
                {order.shippingAddress?.city}, {order.shippingAddress?.state} - {order.shippingAddress?.postalCode}
              </p>
              <p>{order.shippingAddress?.country || 'India'}</p>
              <p className="font-mono text-[11px] pt-1 text-neutral-500">
                Contact: {order.shippingAddress?.phone}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* TRACKING MODAL */}
      <Modal
        isOpen={isTrackingModalOpen}
        onClose={() => setIsTrackingModalOpen(false)}
        title="Shipment & Carrier Dispatch"
        subtitle="Associate courier tracking numbers to send customer dispatch alerts."
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            updateTrackingMutation.mutate();
          }}
          className="space-y-4 text-xs"
        >
          <div>
            <label className="block text-neutral-700 font-semibold mb-1">
              Courier Partner
            </label>
            <input
              type="text"
              required
              value={courierName}
              onChange={(e) => setCourierName(e.target.value)}
              className="w-full bg-neutral-50 border border-neutral-300 rounded-lg p-2.5 text-neutral-900 focus:outline-none focus:border-yellow-400"
            />
          </div>

          <div>
            <label className="block text-neutral-700 font-semibold mb-1">
              Airway Bill / Tracking Number <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={trackingNumber}
              onChange={(e) => setTrackingNumber(e.target.value)}
              placeholder="e.g. BD-892401824"
              className="w-full bg-neutral-50 border border-neutral-300 rounded-lg p-2.5 text-neutral-900 font-mono focus:outline-none focus:border-yellow-400"
            />
          </div>

          <div>
            <label className="block text-neutral-700 font-semibold mb-1">
              Estimated Delivery Window
            </label>
            <input
              type="text"
              value={estimatedDelivery}
              onChange={(e) => setEstimatedDelivery(e.target.value)}
              className="w-full bg-neutral-50 border border-neutral-300 rounded-lg p-2.5 text-neutral-900 focus:outline-none focus:border-yellow-400"
            />
          </div>

          <div className="pt-3 border-t border-neutral-200 flex justify-end space-x-2">
            <button
              type="button"
              onClick={() => setIsTrackingModalOpen(false)}
              className="px-4 py-2 border border-neutral-300 rounded-lg text-neutral-600 font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={updateTrackingMutation.isPending}
              className="px-6 py-2 bg-yellow-400 text-neutral-950 rounded-lg font-bold uppercase tracking-wider"
            >
              Confirm Dispatch
            </button>
          </div>
        </form>
      </Modal>

      {/* REFUND MODAL */}
      <Modal
        isOpen={isRefundModalOpen}
        onClose={() => setIsRefundModalOpen(false)}
        title="Cancel & Refund Sartorial Order"
        subtitle="This will transition order to cancelled and initiate full transaction refund."
      >
        <div className="space-y-4 text-xs">
          <p className="text-neutral-600 ">
            Total refund amount payable:{' '}
            <strong className="text-neutral-900 font-serif-luxury">
              ₹{order.pricing?.totalAmount?.toLocaleString('en-IN')}
            </strong>
          </p>

          <div>
            <label className="block text-neutral-700 font-semibold mb-1">
              Cancellation & Refund Justification
            </label>
            <textarea
              rows={3}
              value={refundReason}
              onChange={(e) => setRefundReason(e.target.value)}
              className="w-full bg-neutral-50 border border-neutral-300 rounded-lg p-2.5 text-neutral-900 focus:outline-none focus:border-yellow-400"
            />
          </div>

          <div className="pt-3 border-t border-neutral-200 flex justify-end space-x-2">
            <button
              type="button"
              onClick={() => setIsRefundModalOpen(false)}
              className="px-4 py-2 border border-neutral-300 rounded-lg text-neutral-600 font-semibold"
            >
              Back
            </button>
            <button
              type="button"
              disabled={refundMutation.isPending}
              onClick={() => refundMutation.mutate()}
              className="px-6 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-lg font-bold uppercase tracking-wider"
            >
              Process Refund
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default OrderDetailPage;
