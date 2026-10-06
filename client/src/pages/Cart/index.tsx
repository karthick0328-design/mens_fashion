import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, ArrowRight, ShieldCheck, Tag, ShoppingBag, Heart } from 'lucide-react';
import { AnnouncementBar } from '../../components/layout/AnnouncementBar';
import { Header } from '../../components/layout/Header';
import { Footer } from '../../components/layout/Footer';
import { useCartStore } from '../../store/useCartStore';
import { useWishlistStore } from '../../store/useWishlistStore';
import api from '../../services/api';

export const CartPage: React.FC = () => {
  const navigate = useNavigate();
  const { cart, updateItemQty, removeItem, isLoading } = useCartStore();
  const { toggleWishlist } = useWishlistStore();

  const [couponCode, setCouponCode] = useState('');
  const [couponDiscount, setCouponDiscount] = useState<number>(0);
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [couponError, setCouponError] = useState<string | null>(null);
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);

  const subtotal = cart?.subtotal || 0;
  const shippingFee = subtotal >= 999 || subtotal === 0 ? 0 : 99;
  const finalTotal = Math.max(0, subtotal - couponDiscount + shippingFee);

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCode.trim()) return;

    try {
      setIsApplyingCoupon(true);
      setCouponError(null);
      const res = await api.post('/coupons/validate', {
        code: couponCode.trim(),
        cartAmount: subtotal,
      });

      if (res.data?.success) {
        setCouponDiscount(res.data.data.discountAmount);
        setAppliedCoupon(res.data.data.code);
        setCouponError(null);
      }
    } catch (err: any) {
      setCouponError(err.response?.data?.message || 'Invalid coupon code');
      setCouponDiscount(0);
      setAppliedCoupon(null);
    } finally {
      setIsApplyingCoupon(false);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponDiscount(0);
    setCouponCode('');
  };

  const handleProceedToCheckout = () => {
    // Pass applied coupon in navigation state
    navigate('/checkout', { state: { couponCode: appliedCoupon, couponDiscount } });
  };

  return (
    <div className="min-h-screen flex flex-col bg-neutral-50">
      <AnnouncementBar />
      <Header />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="border-b border-neutral-200 pb-4 mb-8 flex items-center justify-between">
          <h1 className="text-2xl font-extrabold uppercase tracking-tight font-serif-luxury text-neutral-900">
            Shopping Bag ({cart?.itemCount || 0})
          </h1>
          <Link to="/products" className="text-xs font-bold uppercase tracking-wider text-neutral-600 hover:text-neutral-900">
            Continue Shopping
          </Link>
        </div>

        {!cart || cart.items.length === 0 ? (
          <div className="bg-white border border-neutral-200 rounded-xl p-16 text-center max-w-md mx-auto my-12 shadow-sm">
            <ShoppingBag className="w-16 h-16 text-neutral-300 mx-auto mb-4 stroke-1" />
            <h2 className="text-lg font-bold text-neutral-900 mb-1">Your bag is currently empty</h2>
            <p className="text-xs text-neutral-500 mb-6">
              Discover our fine craftsmanship and sartorial menswear tailoring.
            </p>
            <Link
              to="/products"
              className="inline-flex items-center space-x-2 bg-neutral-950 text-white font-bold text-xs uppercase tracking-wider px-8 py-3.5 rounded hover:bg-neutral-800 transition-colors"
            >
              <span>Explore Collection</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* LEFT: Items List (8 Cols) */}
            <div className="lg:col-span-8 space-y-4">
              {cart.items.map((item) => (
                <div
                  key={item.sku}
                  className="bg-white border border-neutral-200 rounded-xl p-4 sm:p-5 flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-5 shadow-sm"
                >
                  <Link to={`/products/${item.productId}`}>
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full sm:w-28 h-36 object-cover object-top rounded-lg bg-neutral-100 flex-shrink-0"
                    />
                  </Link>

                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start">
                        <h3 className="text-sm font-bold text-neutral-900 hover:text-neutral-700 transition-colors">
                          <Link to={`/products/${item.productId}`}>{item.title}</Link>
                        </h3>
                        <div className="text-right pl-4">
                          <span className="text-base font-extrabold text-neutral-900">
                            ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                          </span>
                          {item.mrp > item.price && (
                            <span className="block text-xs text-neutral-400 line-through">
                              ₹{(item.mrp * item.quantity).toLocaleString('en-IN')}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center space-x-3 text-xs text-neutral-600 mt-2">
                        <span>Color: <strong className="text-neutral-900">{item.color.name}</strong></span>
                        <span>•</span>
                        <span>Size: <strong className="text-neutral-900">{item.size}</strong></span>
                        <span>•</span>
                        <span className="text-neutral-400 font-mono text-[11px]">SKU: {item.sku}</span>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-neutral-100 mt-4 flex flex-wrap items-center justify-between gap-3">
                      {/* Quantity Selector */}
                      <div className="flex items-center space-x-2">
                        <span className="text-xs text-neutral-500">Qty:</span>
                        <div className="flex items-center border border-neutral-300 rounded">
                          <button
                            onClick={() => updateItemQty(item.sku, Math.max(1, item.quantity - 1))}
                            disabled={isLoading || item.quantity <= 1}
                            className="p-1.5 hover:bg-neutral-50 text-neutral-700 disabled:opacity-40"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="px-3 text-xs font-bold text-neutral-900">{item.quantity}</span>
                          <button
                            onClick={() => updateItemQty(item.sku, item.quantity + 1)}
                            disabled={isLoading || item.quantity >= item.stock}
                            className="p-1.5 hover:bg-neutral-50 text-neutral-700 disabled:opacity-40"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Action Links */}
                      <div className="flex items-center space-x-4 text-xs font-semibold">
                        <button
                          onClick={() => {
                            toggleWishlist(item.productId);
                            removeItem(item.sku);
                          }}
                          className="text-neutral-600 hover:text-neutral-900 flex items-center space-x-1"
                        >
                          <Heart className="w-3.5 h-3.5" />
                          <span>Move to Wishlist</span>
                        </button>
                        <button
                          onClick={() => removeItem(item.sku)}
                          disabled={isLoading}
                          className="text-neutral-500 hover:text-rose-600 flex items-center space-x-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Remove</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* RIGHT: Summary & Coupon (4 Cols) */}
            <div className="lg:col-span-4 space-y-4 lg:sticky lg:top-28">
              {/* Coupon Box */}
              <div className="bg-white border border-neutral-200 rounded-xl p-5 shadow-sm space-y-3">
                <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-neutral-900">
                  <Tag className="w-4 h-4 text-amber-600" />
                  <span>Promotional Voucher</span>
                </div>

                {appliedCoupon ? (
                  <div className="flex items-center justify-between p-2.5 bg-emerald-50 border border-emerald-200 rounded text-xs text-emerald-800">
                    <div>
                      <span className="font-bold">{appliedCoupon} applied!</span>
                      <p className="text-[11px] text-emerald-600">Saved ₹{couponDiscount.toLocaleString('en-IN')}</p>
                    </div>
                    <button
                      onClick={handleRemoveCoupon}
                      className="text-xs font-bold text-rose-600 hover:underline"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleApplyCoupon} className="flex space-x-2">
                    <input
                      type="text"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                      placeholder="e.g. WELCOME10"
                      className="flex-1 px-3 py-2 border border-neutral-300 rounded text-xs uppercase focus:outline-none focus:border-neutral-900"
                    />
                    <button
                      type="submit"
                      disabled={isApplyingCoupon || !couponCode}
                      className="bg-neutral-900 hover:bg-neutral-800 text-white font-bold text-xs uppercase px-4 py-2 rounded transition-colors disabled:opacity-50"
                    >
                      Apply
                    </button>
                  </form>
                )}

                {couponError && (
                  <p className="text-xs text-red-600">{couponError}</p>
                )}
              </div>

              {/* Price Details Breakdown */}
              <div className="bg-white border border-neutral-200 rounded-xl p-5 shadow-sm space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-900 pb-3 border-b border-neutral-100">
                  Price Details ({cart.itemCount} items)
                </h3>

                <div className="space-y-2.5 text-xs text-neutral-600">
                  <div className="flex justify-between">
                    <span>Total Bag Value</span>
                    <span className="font-semibold text-neutral-900">
                      ₹{subtotal.toLocaleString('en-IN')}
                    </span>
                  </div>

                  {cart.discount > 0 && (
                    <div className="flex justify-between text-emerald-700">
                      <span>Product Discount</span>
                      <span>-₹{cart.discount.toLocaleString('en-IN')}</span>
                    </div>
                  )}

                  {couponDiscount > 0 && (
                    <div className="flex justify-between text-emerald-700">
                      <span>Coupon Discount</span>
                      <span>-₹{couponDiscount.toLocaleString('en-IN')}</span>
                    </div>
                  )}

                  <div className="flex justify-between">
                    <span>Delivery Charges</span>
                    <span>
                      {shippingFee === 0 ? (
                        <strong className="text-emerald-700 uppercase">Free</strong>
                      ) : (
                        `₹${shippingFee}`
                      )}
                    </span>
                  </div>

                  <div className="pt-3 border-t border-neutral-200 flex justify-between text-sm font-extrabold text-neutral-900">
                    <span>Total Payable</span>
                    <span className="text-base text-neutral-950">
                      ₹{finalTotal.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>

                <button
                  onClick={handleProceedToCheckout}
                  className="w-full bg-neutral-950 hover:bg-neutral-800 text-white text-xs font-bold uppercase tracking-wider py-4 rounded-xl flex items-center justify-center space-x-2 transition-all shadow-md active:scale-[0.98]"
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <div className="pt-2 flex items-center justify-center space-x-2 text-[11px] text-neutral-500">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Safe and Secure 256-Bit SSL Payments</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default CartPage;
