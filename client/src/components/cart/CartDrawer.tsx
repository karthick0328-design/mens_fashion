import React from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Trash2, Plus, Minus, ArrowRight, ShoppingBag } from 'lucide-react';
import { useCartStore } from '../../store/useCartStore';

export const CartDrawer: React.FC = () => {
  const navigate = useNavigate();
  const { cart, isOpen, closeCart, updateItemQty, removeItem, isLoading } = useCartStore();

  if (!isOpen) return null;

  const handleCheckout = () => {
    closeCart();
    navigate('/checkout');
  };

  const handleViewCart = () => {
    closeCart();
    navigate('/user/mycart');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-neutral-950/60 backdrop-blur-sm transition-opacity"
        onClick={closeCart}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-4 sm:pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col">
          {/* Header */}
          <div className="p-5 border-b border-neutral-100 flex items-center justify-between bg-neutral-50/50">
            <div className="flex items-center space-x-2">
              <ShoppingBag className="w-5 h-5 text-neutral-800" />
              <h2 className="text-base font-bold uppercase tracking-wider text-neutral-900">
                Your Bag ({cart?.itemCount || 0})
              </h2>
            </div>
            <button
              onClick={closeCart}
              className="p-1 rounded-full text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {!cart || cart.items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 text-neutral-400">
                <ShoppingBag className="w-16 h-16 text-neutral-200 mb-4 stroke-[1.5]" />
                <h3 className="text-base font-semibold text-neutral-700 mb-1">Your bag is empty</h3>
                <p className="text-sm text-neutral-500 mb-6">Looks like you haven't added any luxury pieces yet.</p>
                <button
                  onClick={() => {
                    closeCart();
                    navigate('/products');
                  }}
                  className="bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-bold uppercase tracking-wider px-6 py-3 rounded transition-colors"
                >
                  Explore Collection
                </button>
              </div>
            ) : (
              cart.items.map((item) => (
                <div
                  key={item.sku}
                  className="flex space-x-4 p-3 border border-neutral-100 rounded-lg hover:border-neutral-200 transition-all bg-white"
                >
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-20 h-24 object-cover rounded bg-neutral-100 flex-shrink-0"
                  />
                  <div className="flex-1 flex flex-col justify-between min-w-0">
                    <div>
                      <div className="flex justify-between items-start">
                        <h4 className="text-xs font-semibold text-neutral-900 line-clamp-1 pr-2">
                          {item.title}
                        </h4>
                        <button
                          onClick={() => removeItem(item.sku)}
                          disabled={isLoading}
                          className="text-neutral-400 hover:text-red-600 transition-colors p-0.5"
                          title="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <div className="text-[11px] text-neutral-500 mt-1 space-x-2">
                        <span>Color: <strong className="text-neutral-700">{item.color.name}</strong></span>
                        <span>•</span>
                        <span>Size: <strong className="text-neutral-700">{item.size}</strong></span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-3">
                      {/* Quantity Controls */}
                      <div className="flex items-center border border-neutral-200 rounded">
                        <button
                          onClick={() => updateItemQty(item.sku, Math.max(1, item.quantity - 1))}
                          disabled={isLoading || item.quantity <= 1}
                          className="p-1 hover:bg-neutral-50 text-neutral-600 disabled:opacity-40"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2 text-xs font-bold text-neutral-800">{item.quantity}</span>
                        <button
                          onClick={() => updateItemQty(item.sku, item.quantity + 1)}
                          disabled={isLoading || item.quantity >= item.stock}
                          className="p-1 hover:bg-neutral-50 text-neutral-600 disabled:opacity-40"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      {/* Price */}
                      <div className="text-right">
                        <span className="text-sm font-bold text-neutral-900">
                          ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                        </span>
                        {item.mrp > item.price && (
                          <div className="text-[10px] text-neutral-400 line-through">
                            ₹{(item.mrp * item.quantity).toLocaleString('en-IN')}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer / Summary */}
          {cart && cart.items.length > 0 && (
            <div className="p-5 border-t border-neutral-100 bg-neutral-50/60 space-y-3">
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-neutral-600">
                  <span>Subtotal</span>
                  <span className="font-semibold text-neutral-900">
                    ₹{cart.subtotal.toLocaleString('en-IN')}
                  </span>
                </div>
                {cart.discount > 0 && (
                  <div className="flex justify-between text-emerald-600">
                    <span>Total Savings</span>
                    <span>-₹{cart.discount.toLocaleString('en-IN')}</span>
                  </div>
                )}
                <div className="flex justify-between text-neutral-600">
                  <span>Shipping</span>
                  <span>{cart.subtotal >= 999 ? <strong className="text-emerald-600 uppercase text-[11px]">Free</strong> : '₹99'}</span>
                </div>
                <div className="pt-2 border-t border-neutral-200 flex justify-between text-sm font-bold text-neutral-900">
                  <span>Estimated Total</span>
                  <span className="text-base text-neutral-900">
                    ₹{(cart.subtotal + (cart.subtotal >= 999 ? 0 : 99)).toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              <div className="pt-2 grid grid-cols-2 gap-2">
                <button
                  onClick={handleViewCart}
                  className="w-full border border-neutral-300 hover:border-neutral-900 text-neutral-800 text-xs font-bold uppercase tracking-wider py-3 rounded transition-colors"
                >
                  View Bag
                </button>
                <button
                  onClick={handleCheckout}
                  className="w-full bg-neutral-950 hover:bg-neutral-800 text-white text-xs font-bold uppercase tracking-wider py-3 rounded flex items-center justify-center space-x-1.5 transition-colors shadow-sm"
                >
                  <span>Checkout</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
