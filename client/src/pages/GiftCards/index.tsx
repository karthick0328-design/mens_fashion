import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, User as UserIcon, CheckCircle2, RefreshCw } from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';
import { useCartStore } from '../../store/useCartStore';
import GiftCardShowcase from '../../components/giftcard/GiftCardShowcase';
import { Footer } from '../../components/layout/Footer';

export const GiftCardsPage: React.FC = () => {
  const { isAuthenticated } = useAuthStore();
  const { cart, toggleCart } = useCartStore();

  const [checkCode, setCheckCode] = useState('');
  const [checkPin, setCheckPin] = useState('');
  const [balanceResult, setBalanceResult] = useState<number | null>(null);
  const [balanceChecked, setBalanceChecked] = useState(false);
  const [isChecking, setIsChecking] = useState(false);

  const cartItemCount = cart?.items?.reduce((acc, item) => acc + item.quantity, 0) || 0;

  const handleCheckBalance = (e: React.FormEvent) => {
    e.preventDefault();
    if (!checkCode.trim()) return;

    setIsChecking(true);
    setTimeout(() => {
      setIsChecking(false);
      setBalanceChecked(true);
      // Deterministic demo balance for verification
      if (checkCode.includes('PLATINUM') || checkCode.includes('10000')) {
        setBalanceResult(10000);
      } else if (checkCode.includes('GOLD') || checkCode.includes('25000')) {
        setBalanceResult(25000);
      } else if (checkCode.includes('DIAMOND') || checkCode.includes('50000')) {
        setBalanceResult(50000);
      } else {
        setBalanceResult(5000);
      }
    }, 600);
  };

  return (
    <div className="min-h-screen bg-white text-neutral-900 flex flex-col font-sans selection:bg-neutral-900 selection:text-white">
      {/* ========================================================= */}
      {/* 1. TOP MINIMAL LUXURY HEADER (EXACT LIKE SCREENSHOT)       */}
      {/* ========================================================= */}
      <header className="w-full bg-white border-b border-neutral-100/80 sticky top-0 z-40 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 h-16 sm:h-20 flex items-center justify-between">
          {/* Atelier Brand Identity */}
          <Link to="/" className="group flex flex-col">
            <span className="font-serif-luxury text-xl sm:text-2xl font-bold tracking-[0.25em] text-neutral-950 group-hover:opacity-80 transition-opacity">
              AURELIUS
            </span>
            <span className="text-[9px] tracking-[0.4em] uppercase text-neutral-500 font-sans -mt-0.5">
              ATELIER HOMME
            </span>
          </Link>

          {/* Right Controls: Exactly 'LOG IN | BAG (0)' or 'DASHBOARD | BAG (X)' */}
          <div className="flex items-center space-x-4 sm:space-x-6 text-xs font-semibold tracking-[0.15em] uppercase text-neutral-900">
            {isAuthenticated ? (
              <Link
                to="/user/dashboard"
                className="hover:text-amber-800 transition-colors flex items-center space-x-1.5"
              >
                <UserIcon className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">MY ACCOUNT</span>
                <span className="sm:hidden">ACCOUNT</span>
              </Link>
            ) : (
              <Link
                to="/login"
                className="hover:text-amber-800 transition-colors tracking-[0.2em]"
              >
                LOG IN
              </Link>
            )}

            <span className="text-neutral-300 font-light select-none">|</span>

            <button
              type="button"
              onClick={toggleCart}
              className="flex items-center space-x-1.5 hover:text-amber-800 transition-colors group"
            >
              <ShoppingBag className="w-3.5 h-3.5 text-neutral-900 group-hover:text-amber-800 transition-colors" />
              <span>BAG ({cartItemCount})</span>
            </button>
          </div>
        </div>
      </header>

      {/* ========================================================= */}
      {/* 2. MAIN GIFT CARD HERO & SHOWCASE SECTION                  */}
      {/* ========================================================= */}
      <main className="flex-1">
        <GiftCardShowcase showHeroBanner={true} />

        {/* ======================================================= */}
        {/* 3. CHECK GIFT CARD BALANCE & FREQUENTLY ASKED QUESTIONS */}
        {/* ======================================================= */}
        <section className="bg-neutral-50 border-t border-neutral-200/80 py-10 sm:py-16 px-4 sm:px-8 lg:px-12">
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
            {/* Left: Check Balance Form */}
            <div className="lg:col-span-5 bg-white p-5 sm:p-8 rounded-2xl border border-neutral-200/80 shadow-sm space-y-6">
              <div className="border-b border-neutral-100 pb-4">
                <span className="text-amber-700 text-[10px] tracking-[0.3em] uppercase block font-mono">
                  Atelier Verification
                </span>
                <h3 className="text-xl font-serif-luxury font-bold text-neutral-950 uppercase tracking-wide">
                  Check Card Balance
                </h3>
                <p className="text-xs text-neutral-500 mt-1">
                  Already have an AURELIUS gift card or voucher? Check your available balance instantly.
                </p>
              </div>

              <form onSubmit={handleCheckBalance} className="space-y-4 text-xs">
                <div>
                  <label className="block text-neutral-700 font-semibold mb-1 uppercase tracking-wider text-[10px]">
                    16-Digit Card Number *
                  </label>
                  <input
                    type="text"
                    required
                    value={checkCode}
                    onChange={(e) => {
                      setCheckCode(e.target.value.toUpperCase());
                      setBalanceChecked(false);
                    }}
                    placeholder="e.g. AUR-GIFT-8921-9921"
                    className="w-full px-3.5 py-2.5 border rounded-lg uppercase tracking-wider text-xs focus:outline-none focus:border-neutral-900 bg-neutral-50/50"
                  />
                </div>

                <div>
                  <label className="block text-neutral-700 font-semibold mb-1 uppercase tracking-wider text-[10px]">
                    6-Digit Security PIN *
                  </label>
                  <input
                    type="password"
                    required
                    maxLength={6}
                    value={checkPin}
                    onChange={(e) => {
                      setCheckPin(e.target.value);
                      setBalanceChecked(false);
                    }}
                    placeholder="••••••"
                    className="w-full px-3.5 py-2.5 border rounded-lg text-xs focus:outline-none focus:border-neutral-900 bg-neutral-50/50"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isChecking}
                  className="w-full bg-neutral-950 text-white font-bold text-xs uppercase tracking-[0.2em] py-3 rounded-lg hover:bg-neutral-800 transition-colors flex items-center justify-center space-x-2"
                >
                  {isChecking ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>VERIFYING ATELIER RECORD...</span>
                    </>
                  ) : (
                    <span>CHECK AVAILABLE BALANCE</span>
                  )}
                </button>
              </form>

              {balanceChecked && balanceResult !== null && (
                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl space-y-1.5 animate-fade-in text-xs">
                  <div className="flex items-center space-x-2 text-emerald-800 font-bold">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Card Active & Valid</span>
                  </div>
                  <div className="flex items-baseline justify-between pt-1">
                    <span className="text-neutral-600 text-[11px] uppercase tracking-wider">Remaining Balance:</span>
                    <span className="text-xl font-bold font-serif-luxury text-emerald-950">
                      ₹{balanceResult.toLocaleString('en-IN')}
                    </span>
                  </div>
                  <p className="text-[10px] text-emerald-700 pt-1 border-t border-emerald-100">
                    Redeemable during checkout on any bespoke tailoring, suiting, watches, or accessories.
                  </p>
                </div>
              )}
            </div>

            {/* Right: Gift Card Privileges & Guarantees */}
            <div className="lg:col-span-7 space-y-6">
              <div>
                <h3 className="text-xl font-serif-luxury font-bold text-neutral-950 uppercase tracking-wide">
                  The Atelier Gifting Experience
                </h3>
                <p className="text-xs text-neutral-500 mt-1">
                  Tailored to perfection with uncompromising luxury standards
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-5 bg-white rounded-xl border border-neutral-200/80 space-y-2">
                  <div className="w-8 h-8 rounded-lg bg-neutral-100 flex items-center justify-center text-neutral-900 font-bold font-serif-luxury">
                    01
                  </div>
                  <h4 className="font-bold uppercase tracking-wider text-neutral-900 text-xs">
                    No Expiry Date
                  </h4>
                  <p className="text-neutral-500 leading-relaxed text-[11px]">
                    AURELIUS gift cards retain their full value indefinitely. The recipient may redeem their credit whenever inspiration strikes.
                  </p>
                </div>

                <div className="p-5 bg-white rounded-xl border border-neutral-200/80 space-y-2">
                  <div className="w-8 h-8 rounded-lg bg-neutral-100 flex items-center justify-center text-neutral-900 font-bold font-serif-luxury">
                    02
                  </div>
                  <h4 className="font-bold uppercase tracking-wider text-neutral-900 text-xs">
                    Bespoke Atelier Styling
                  </h4>
                  <p className="text-neutral-500 leading-relaxed text-[11px]">
                    All cardholders receive complimentary private master tailor consultation and personal style curation in our salons.
                  </p>
                </div>

                <div className="p-5 bg-white rounded-xl border border-neutral-200/80 space-y-2">
                  <div className="w-8 h-8 rounded-lg bg-neutral-100 flex items-center justify-center text-neutral-900 font-bold font-serif-luxury">
                    03
                  </div>
                  <h4 className="font-bold uppercase tracking-wider text-neutral-900 text-xs">
                    Instant Digital Delivery
                  </h4>
                  <p className="text-neutral-500 leading-relaxed text-[11px]">
                    Delivered straight to the recipient's inbox with a bespoke animated envelope and personalized handwritten calligraphy note.
                  </p>
                </div>

                <div className="p-5 bg-white rounded-xl border border-neutral-200/80 space-y-2">
                  <div className="w-8 h-8 rounded-lg bg-neutral-100 flex items-center justify-center text-neutral-900 font-bold font-serif-luxury">
                    04
                  </div>
                  <h4 className="font-bold uppercase tracking-wider text-neutral-900 text-xs">
                    Online & Atelier Redemptions
                  </h4>
                  <p className="text-neutral-500 leading-relaxed text-[11px]">
                    Redeem seamlessly across our digital web platform, mobile portal, or at any international AURELIUS flagship flagship stores.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default GiftCardsPage;
