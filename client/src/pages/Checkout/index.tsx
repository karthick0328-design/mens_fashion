import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import {
  ShieldCheck,
  CreditCard,
  Truck,
  ArrowRight,
  Plus,
  Lock,
} from 'lucide-react';
import { AnnouncementBar } from '../../components/layout/AnnouncementBar';
import { Header } from '../../components/layout/Header';
import { Footer } from '../../components/layout/Footer';
import { useAuthStore } from '../../store/useAuthStore';
import { useCartStore } from '../../store/useCartStore';
import api from '../../services/api';
import { IAddress } from '../../types';

export const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated } = useAuthStore();
  const { cart, fetchCart } = useCartStore();

  const couponCode = location.state?.couponCode || undefined;
  const couponDiscount = location.state?.couponDiscount || 0;

  const [selectedAddressId, setSelectedAddressId] = useState<string>(
    user?.addresses?.find((a) => a.isDefault)?._id || user?.addresses?.[0]?._id || ''
  );
  const [showNewAddressForm, setShowNewAddressForm] = useState(
    !user?.addresses || user.addresses.length === 0
  );
  const [newAddress, setNewAddress] = useState<Partial<IAddress>>({
    name: user?.name || '',
    phone: user?.phone || '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'India',
  });

  const [paymentMethod, setPaymentMethod] = useState<'COD' | 'ONLINE' | 'UPI'>('COD');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col bg-neutral-50">
        <AnnouncementBar />
        <Header />
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
          <Lock className="w-12 h-12 text-neutral-400 mb-4" />
          <h2 className="text-xl font-bold font-serif-luxury text-neutral-900 mb-2">Secure Checkout</h2>
          <p className="text-xs text-neutral-500 max-w-sm mb-6">
            Please sign in to your Aurelius account to proceed with your saved addresses and secure checkout.
          </p>
          <Link
            to="/login"
            className="bg-neutral-950 text-white font-bold text-xs uppercase tracking-wider px-8 py-3 rounded"
          >
            Sign In to Checkout
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const subtotal = cart?.subtotal || 0;
  const shippingFee = subtotal >= 999 || subtotal === 0 ? 0 : 99;
  const finalTotal = Math.max(0, subtotal - couponDiscount + shippingFee);

  const handleCreateOrder = async () => {
    if (!cart || cart.items.length === 0) {
      alert('Your cart is empty');
      return;
    }

    if (!selectedAddressId && (!newAddress.addressLine1 || !newAddress.city || !newAddress.postalCode)) {
      setCheckoutError('Please select or fill in a delivery address');
      return;
    }

    try {
      setIsSubmitting(true);
      setCheckoutError(null);

      const payload: any = {
        items: cart.items.map((i) => ({ sku: i.sku, quantity: i.quantity })),
        paymentMethod,
        couponCode,
      };

      if (selectedAddressId) {
        payload.shippingAddressId = selectedAddressId;
      } else {
        payload.shippingAddress = newAddress;
      }

      const res = await api.post('/orders', payload);

      if (res.data?.success) {
        await fetchCart(); // Cart is now cleared on server
        const createdOrder = res.data.data;
        navigate(`/user/order/${createdOrder._id}`, {
          state: { isNewOrder: true, orderNumber: createdOrder.orderNumber },
        });
      }
    } catch (err: any) {
      setCheckoutError(err.response?.data?.message || 'Failed to place order. Please review stock or payment.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-neutral-50">
      <AnnouncementBar />
      <Header />

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="border-b border-neutral-200 pb-4 mb-8 flex items-center justify-between">
          <h1 className="text-2xl font-extrabold uppercase tracking-tight font-serif-luxury text-neutral-900">
            Secure Checkout
          </h1>
          <div className="flex items-center space-x-1.5 text-xs text-neutral-500">
            <Lock className="w-3.5 h-3.5 text-emerald-600" />
            <span>256-Bit SSL Encryption</span>
          </div>
        </div>

        {checkoutError && (
          <div className="mb-6 p-4 rounded-lg bg-red-50 border border-red-200 text-xs text-red-700">
            {checkoutError}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT: Steps 1, 2, 3 (8 Cols) */}
          <div className="lg:col-span-8 space-y-6">
            {/* STEP 1: Delivery Address */}
            <div className="bg-white border border-neutral-200 rounded-xl p-5 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="w-6 h-6 rounded-full bg-neutral-950 text-white flex items-center justify-center text-xs font-bold">
                    1
                  </span>
                  <h2 className="text-sm font-bold uppercase tracking-wider text-neutral-900">
                    Delivery Address
                  </h2>
                </div>
                {user?.addresses && user.addresses.length > 0 && (
                  <button
                    onClick={() => setShowNewAddressForm(!showNewAddressForm)}
                    className="text-xs font-bold text-amber-700 hover:text-amber-900 flex items-center space-x-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>{showNewAddressForm ? 'Use Saved Address' : 'Add New Address'}</span>
                  </button>
                )}
              </div>

              {!showNewAddressForm && user?.addresses && user.addresses.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  {user.addresses.map((addr) => (
                    <label
                      key={addr._id}
                      className={`p-3.5 border rounded-lg cursor-pointer transition-all flex items-start space-x-3 text-xs ${
                        selectedAddressId === addr._id
                          ? 'border-neutral-950 bg-neutral-50/60 shadow-sm'
                          : 'border-neutral-200 hover:border-neutral-300 bg-white'
                      }`}
                    >
                      <input
                        type="radio"
                        name="deliveryAddress"
                        checked={selectedAddressId === addr._id}
                        onChange={() => setSelectedAddressId(addr._id || '')}
                        className="mt-0.5 text-neutral-950 focus:ring-0"
                      />
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <span className="font-bold text-neutral-900">{addr.name}</span>
                          {addr.isDefault && (
                            <span className="text-[10px] bg-neutral-200 text-neutral-700 px-1.5 py-0.2 rounded">
                              Default
                            </span>
                          )}
                        </div>
                        <p className="text-neutral-600 leading-tight">
                          {addr.addressLine1}, {addr.addressLine2 ? `${addr.addressLine2}, ` : ''}
                          {addr.city}, {addr.state} - {addr.postalCode}
                        </p>
                        <p className="text-neutral-500 font-medium">Phone: {addr.phone}</p>
                      </div>
                    </label>
                  ))}
                </div>
              ) : (
                /* New Address Form */
                <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="block text-neutral-700 font-semibold mb-1">Recipient Name</label>
                    <input
                      type="text"
                      value={newAddress.name}
                      onChange={(e) => setNewAddress({ ...newAddress, name: e.target.value })}
                      placeholder="e.g. Karthick Ramanathan"
                      className="w-full px-3 py-2 border border-neutral-300 rounded focus:outline-none focus:border-neutral-950"
                    />
                  </div>
                  <div>
                    <label className="block text-neutral-700 font-semibold mb-1">Phone Number</label>
                    <input
                      type="text"
                      value={newAddress.phone}
                      onChange={(e) => setNewAddress({ ...newAddress, phone: e.target.value })}
                      placeholder="e.g. +91 98840 12345"
                      className="w-full px-3 py-2 border border-neutral-300 rounded focus:outline-none focus:border-neutral-950"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-neutral-700 font-semibold mb-1">Address Line 1</label>
                    <input
                      type="text"
                      value={newAddress.addressLine1}
                      onChange={(e) => setNewAddress({ ...newAddress, addressLine1: e.target.value })}
                      placeholder="Flat, House no., Building, Street"
                      className="w-full px-3 py-2 border border-neutral-300 rounded focus:outline-none focus:border-neutral-950"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-neutral-700 font-semibold mb-1">Address Line 2 (Optional)</label>
                    <input
                      type="text"
                      value={newAddress.addressLine2}
                      onChange={(e) => setNewAddress({ ...newAddress, addressLine2: e.target.value })}
                      placeholder="Area, Colony, Landmark"
                      className="w-full px-3 py-2 border border-neutral-300 rounded focus:outline-none focus:border-neutral-950"
                    />
                  </div>
                  <div>
                    <label className="block text-neutral-700 font-semibold mb-1">City</label>
                    <input
                      type="text"
                      value={newAddress.city}
                      onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                      placeholder="e.g. Bengaluru"
                      className="w-full px-3 py-2 border border-neutral-300 rounded focus:outline-none focus:border-neutral-950"
                    />
                  </div>
                  <div>
                    <label className="block text-neutral-700 font-semibold mb-1">State</label>
                    <input
                      type="text"
                      value={newAddress.state}
                      onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })}
                      placeholder="e.g. Karnataka"
                      className="w-full px-3 py-2 border border-neutral-300 rounded focus:outline-none focus:border-neutral-950"
                    />
                  </div>
                  <div>
                    <label className="block text-neutral-700 font-semibold mb-1">PIN Code</label>
                    <input
                      type="text"
                      maxLength={6}
                      value={newAddress.postalCode}
                      onChange={(e) => setNewAddress({ ...newAddress, postalCode: e.target.value })}
                      placeholder="e.g. 560066"
                      className="w-full px-3 py-2 border border-neutral-300 rounded focus:outline-none focus:border-neutral-950"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* STEP 2: Payment Method */}
            <div className="bg-white border border-neutral-200 rounded-xl p-5 shadow-sm space-y-4">
              <div className="flex items-center space-x-2">
                <span className="w-6 h-6 rounded-full bg-neutral-950 text-white flex items-center justify-center text-xs font-bold">
                  2
                </span>
                <h2 className="text-sm font-bold uppercase tracking-wider text-neutral-900">
                  Payment Method
                </h2>
              </div>

              <div className="space-y-2.5 pt-2">
                {/* Cash On Delivery */}
                <label
                  className={`p-4 border rounded-xl cursor-pointer flex items-center justify-between text-xs transition-all ${
                    paymentMethod === 'COD'
                      ? 'border-neutral-950 bg-neutral-50/70 shadow-sm ring-1 ring-neutral-950'
                      : 'border-neutral-200 hover:border-neutral-300'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === 'COD'}
                      onChange={() => setPaymentMethod('COD')}
                      className="text-neutral-950 focus:ring-0"
                    />
                    <div>
                      <span className="font-bold text-neutral-900 block">Cash On Delivery (COD)</span>
                      <span className="text-[11px] text-neutral-500">Pay cash or scan QR upon physical delivery</span>
                    </div>
                  </div>
                  <Truck className="w-5 h-5 text-neutral-700 flex-shrink-0 ml-2" />
                </label>

                {/* Instant Online UPI / Cards */}
                <label
                  className={`p-4 border rounded-xl cursor-pointer flex items-center justify-between text-xs transition-all ${
                    paymentMethod === 'ONLINE'
                      ? 'border-neutral-950 bg-neutral-50/70 shadow-sm ring-1 ring-neutral-950'
                      : 'border-neutral-200 hover:border-neutral-300'
                  }`}
                >
                  <div className="flex items-center space-x-3 min-w-0">
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === 'ONLINE'}
                      onChange={() => setPaymentMethod('ONLINE')}
                      className="text-neutral-950 focus:ring-0 flex-shrink-0"
                    />
                    <div>
                      <span className="font-bold text-neutral-900 block">UPI / Credit Card / Debit Card / Net Banking</span>
                      <span className="text-[11px] text-neutral-500">Instant confirmation via Razorpay / Stripe simulator</span>
                    </div>
                  </div>
                  <CreditCard className="w-5 h-5 text-neutral-700 flex-shrink-0 ml-2" />
                </label>
              </div>
            </div>
          </div>

          {/* RIGHT: Order Summary (4 Cols) */}
          <div className="lg:col-span-4 space-y-4 lg:sticky lg:top-28">
            <div className="bg-white border border-neutral-200 rounded-xl p-5 shadow-sm space-y-4 text-xs">
              <h3 className="font-bold uppercase tracking-wider text-neutral-900 pb-3 border-b border-neutral-100">
                Order Review ({cart?.items.length || 0} items)
              </h3>

              {/* Items Mini List */}
              <div className="max-h-48 overflow-y-auto divide-y divide-neutral-100 pr-1 space-y-2">
                {cart?.items.map((i) => (
                  <div key={i.sku} className="pt-2 flex items-center justify-between">
                    <div className="flex items-center space-x-2.5 min-w-0">
                      <img src={i.image} alt={i.title} className="w-10 h-12 object-cover rounded bg-neutral-100 flex-shrink-0" />
                      <div className="truncate">
                        <span className="font-semibold text-neutral-900 truncate block">{i.title}</span>
                        <span className="text-[11px] text-neutral-500">{i.color.name} | {i.size} × {i.quantity}</span>
                      </div>
                    </div>
                    <span className="font-bold text-neutral-900 pl-2">
                      ₹{(i.price * i.quantity).toLocaleString('en-IN')}
                    </span>
                  </div>
                ))}
              </div>

              {/* Price Details */}
              <div className="pt-3 border-t border-neutral-200 space-y-2 text-neutral-600">
                <div className="flex justify-between">
                  <span>Bag Subtotal</span>
                  <span className="font-semibold text-neutral-900">₹{subtotal.toLocaleString('en-IN')}</span>
                </div>

                {couponDiscount > 0 && (
                  <div className="flex justify-between text-emerald-700">
                    <span>Coupon ({couponCode})</span>
                    <span>-₹{couponDiscount.toLocaleString('en-IN')}</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span>Delivery Charges</span>
                  <span>{shippingFee === 0 ? <strong className="text-emerald-700 uppercase">Free</strong> : `₹${shippingFee}`}</span>
                </div>

                <div className="pt-2 border-t border-neutral-200 flex justify-between text-sm font-extrabold text-neutral-900">
                  <span>Grand Total</span>
                  <span className="text-base text-neutral-950">₹{finalTotal.toLocaleString('en-IN')}</span>
                </div>
              </div>

              <button
                onClick={handleCreateOrder}
                disabled={isSubmitting || !cart || cart.items.length === 0}
                className="w-full bg-neutral-950 hover:bg-neutral-800 disabled:bg-neutral-400 text-white text-xs font-bold uppercase tracking-wider py-4 rounded-xl flex items-center justify-center space-x-2 transition-all shadow-md active:scale-[0.98]"
              >
                <span>{isSubmitting ? 'Confirming Order...' : 'Place Order'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="pt-1 flex items-center justify-center space-x-1.5 text-[11px] text-neutral-500">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Zero-Trust Server-Verified Pricing</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default CheckoutPage;
