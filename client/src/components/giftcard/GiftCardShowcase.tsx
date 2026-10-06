import React, { useState } from 'react';
import { ShoppingBag, Check, X, Gift, ShieldCheck } from 'lucide-react';
import { useCartStore } from '../../store/useCartStore';

export interface GiftCardTier {
  id: string;
  name: string;
  tagline: string;
  price: number;
  bgImage: string;
  textColor: string;
  subtextColor: string;
  flourishColor: string;
  accentBorder: string;
  description: string;
}

export const GIFT_CARD_TIERS: GiftCardTier[] = [
  {
    id: 'platinum',
    name: 'PLATINUM',
    tagline: 'Premium Style. Elevated.',
    price: 10000,
    bgImage: '/images/giftcards/platinum.jpg',
    textColor: 'text-neutral-900',
    subtextColor: 'text-neutral-600',
    flourishColor: '#404040',
    accentBorder: 'border-neutral-400/40',
    description: 'A curated wardrobe refresh for the discerning gentleman. Valid across all bespoke suiting, footwear, and leather goods.',
  },
  {
    id: 'gold',
    name: 'GOLD',
    tagline: 'More Style. More Possibilities.',
    price: 25000,
    bgImage: '/images/giftcards/gold.jpg',
    textColor: 'text-amber-950',
    subtextColor: 'text-amber-800',
    flourishColor: '#78350f',
    accentBorder: 'border-amber-300/50',
    description: 'Our most popular atelier gift. Unlocks premium Swiss horology, handmade cashmere overcoats, and private styling sessions.',
  },
  {
    id: 'silver',
    name: 'SILVER',
    tagline: 'A Thoughtful Gift.',
    price: 5000,
    bgImage: '/images/giftcards/silver.jpg',
    textColor: 'text-neutral-900',
    subtextColor: 'text-neutral-600',
    flourishColor: '#525252',
    accentBorder: 'border-neutral-300/60',
    description: 'The quintessential gesture. Ideal for luxury silk ties, bespoke cufflinks, Italian leather wallets, and fine fragrances.',
  },
  {
    id: 'diamond',
    name: 'DIAMOND',
    tagline: 'The Ultimate Expression.',
    price: 50000,
    bgImage: '/images/giftcards/diamond.jpg',
    textColor: 'text-amber-200',
    subtextColor: 'text-amber-100/80',
    flourishColor: '#fbbf24',
    accentBorder: 'border-amber-500/40',
    description: 'The pinnacle of sartorial indulgence. Includes bespoke tailoring appointment, champagne reception, and custom trunk delivery.',
  },
];

interface GiftCardShowcaseProps {
  onCardPurchased?: (tier: GiftCardTier) => void;
  showHeroBanner?: boolean;
}

export const GiftCardShowcase: React.FC<GiftCardShowcaseProps> = ({
  onCardPurchased,
  showHeroBanner = true,
}) => {
  const { toggleCart } = useCartStore();
  const [selectedTier, setSelectedTier] = useState<GiftCardTier | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [recipientName, setRecipientName] = useState('');
  const [recipientEmail, setRecipientEmail] = useState('');
  const [senderName, setSenderName] = useState('');
  const [giftMessage, setGiftMessage] = useState('');
  const [deliveryType, setDeliveryType] = useState<'instant' | 'scheduled'>('instant');
  const [isAdded, setIsAdded] = useState(false);

  const handleSelectCard = (tier: GiftCardTier) => {
    setSelectedTier(tier);
    setIsModalOpen(true);
    setIsAdded(false);
  };

  const handleAddToCart = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTier) return;

    setIsAdded(true);
    if (onCardPurchased) {
      onCardPurchased(selectedTier);
    }

    setTimeout(() => {
      setIsModalOpen(false);
      toggleCart();
    }, 1000);
  };

  return (
    <div className="w-full">
      {/* ========================================================= */}
      {/* 1. HERO BANNER SECTION (EXACT REFERENCE LAYOUT)            */}
      {/* ========================================================= */}
      {showHeroBanner && (
        <section className="relative overflow-hidden bg-gradient-to-r from-neutral-50 via-white to-neutral-50/40 border-b border-neutral-100">
          <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-12 md:py-16">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              {/* Left Column: Typography */}
              <div className="lg:col-span-7 space-y-4 pr-0 lg:pr-8">
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif-luxury text-neutral-950 uppercase tracking-[0.08em] font-normal leading-tight">
                  GIFT CARDS
                </h1>
                <p className="text-xs sm:text-sm font-semibold tracking-[0.25em] text-neutral-500 uppercase">
                  THE PERFECT GIFT FOR EVERY OCCASION
                </p>
                <p className="text-neutral-600 text-sm sm:text-base leading-relaxed max-w-xl pt-2 font-light">
                  Give the gift of timeless style with AURELIUS Gift Cards. Choose from our exclusive tiers
                  and let them experience luxury, their way.
                </p>
              </div>

              {/* Right Column: Luxury Black Gift Box Image with gold debossed ribbon */}
              <div className="lg:col-span-5 relative flex justify-center lg:justify-end">
                <div className="relative w-full max-w-md aspect-[16/10] sm:aspect-[16/9] lg:aspect-[16/10] overflow-hidden rounded-sm shadow-[0_20px_50px_rgba(0,0,0,0.12)]">
                  <img
                    src="/images/giftcards/hero-box.jpg"
                    alt="AURELIUS Atelier Luxury Gift Box with Black Ribbon"
                    className="w-full h-full object-cover object-center transform hover:scale-105 transition-transform duration-700 ease-out"
                    onError={(e) => {
                      // Fallback if image path differs
                      (e.currentTarget as HTMLImageElement).src =
                        'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?q=80&w=1200&auto=format&fit=crop';
                    }}
                  />
                  {/* Subtle corner brand mark */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent flex items-end p-4">
                    <span className="text-[10px] tracking-[0.3em] uppercase text-white/90 font-serif-luxury">
                      AURELIUS &bull; ATELIER HOMME
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ========================================================= */}
      {/* 2. FOUR LUXURY GIFT CARDS WITH REFLECTIONS                */}
      {/* ========================================================= */}
      <section className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-14 lg:py-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6 xl:gap-8">
          {GIFT_CARD_TIERS.map((tier) => (
            <div
              key={tier.id}
              onClick={() => handleSelectCard(tier)}
              className="group cursor-pointer flex flex-col items-center focus:outline-none"
            >
              {/* CARD CONTAINER WITH 3D SHEEN & BEVEL */}
              <div className="relative w-full aspect-[1.586/1] max-w-[320px] rounded-2xl overflow-hidden shadow-[0_12px_30px_rgba(0,0,0,0.15)] group-hover:shadow-[0_20px_45px_rgba(0,0,0,0.25)] group-hover:-translate-y-1.5 transition-all duration-300 ease-out border border-white/30">
                {/* Background Texture Image */}
                <img
                  src={tier.bgImage}
                  alt={`${tier.name} Gift Card Texture`}
                  className="absolute inset-0 w-full h-full object-cover object-center"
                />

                {/* Metallic Highlight Gradient Sheen */}
                <div className="absolute inset-0 bg-gradient-to-tr from-black/20 via-transparent to-white/20 pointer-events-none" />

                {/* Interactive Card Face */}
                <div className="relative h-full w-full flex flex-col justify-between items-center text-center p-4 sm:p-5 select-none">
                  {/* Top Branding */}
                  <div className="space-y-0.5 pt-1">
                    <h3 className={`font-serif-luxury text-sm tracking-[0.25em] font-semibold uppercase ${tier.textColor}`}>
                      AURELIUS
                    </h3>
                    <p className={`text-[8px] tracking-[0.3em] uppercase font-medium ${tier.subtextColor}`}>
                      ATELIER HOMME
                    </p>
                  </div>

                  {/* Center Tier & Flourish */}
                  <div className="space-y-1 my-auto">
                    <p className={`text-[9px] tracking-[0.3em] uppercase font-semibold ${tier.subtextColor}`}>
                      GIFT CARD
                    </p>
                    <p className={`font-serif-luxury text-base sm:text-lg tracking-[0.25em] font-semibold uppercase ${tier.textColor}`}>
                      {tier.name}
                    </p>

                    {/* Classic Atelier Flourish Divider: ─── ◆ ─── */}
                    <div className="flex items-center justify-center space-x-1.5 pt-1">
                      <span className="w-8 h-[1px] opacity-60" style={{ backgroundColor: tier.flourishColor }} />
                      <span className="text-[8px] opacity-75" style={{ color: tier.flourishColor }}>
                        ◆
                      </span>
                      <span className="w-8 h-[1px] opacity-60" style={{ backgroundColor: tier.flourishColor }} />
                    </div>
                  </div>

                  {/* Subtle Bottom Chip / Watermark placeholder */}
                  <div className="w-full flex justify-between items-center text-[7px] tracking-[0.2em] uppercase opacity-40 px-2 font-mono">
                    <span>AUR-{tier.id.toUpperCase()}</span>
                    <span>EXCLUSIVE</span>
                  </div>
                </div>
              </div>

              {/* MIRROR REFLECTION ON GLOSSY SURFACE (EXACT SCREENSHOT EFFECT) */}
              <div
                className="relative w-full aspect-[1.586/0.5] max-w-[320px] overflow-hidden pointer-events-none select-none -mt-1 opacity-30 group-hover:opacity-40 transition-opacity"
                aria-hidden="true"
                style={{
                  maskImage: 'linear-gradient(to bottom, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0) 80%)',
                  WebkitMaskImage: 'linear-gradient(to bottom, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0) 80%)',
                }}
              >
                <div className="w-full aspect-[1.586/1] rounded-2xl overflow-hidden transform -scale-y-100 blur-[0.6px]">
                  <img
                    src={tier.bgImage}
                    alt=""
                    className="w-full h-full object-cover object-center"
                  />
                  <div className="absolute inset-0 bg-neutral-900/10" />
                </div>
              </div>

              {/* CARD DETAILS BELOW (EXACT REFERENCE TYPOGRAPHY) */}
              <div className="text-center mt-3 space-y-1">
                <h4 className="text-xs sm:text-sm font-bold uppercase tracking-[0.2em] text-neutral-900">
                  {tier.name}
                </h4>
                <p className="text-xs text-neutral-500 font-normal">
                  {tier.tagline}
                </p>
                <p className="text-sm font-bold text-neutral-900 pt-0.5 tracking-wide">
                  ₹{tier.price.toLocaleString('en-IN')}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ========================================================= */}
      {/* 3. LUXURY GIFT CARD MODAL / CUSTOMIZATION DRAWER           */}
      {/* ========================================================= */}
      {isModalOpen && selectedTier && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white max-w-lg w-full rounded-2xl shadow-2xl overflow-hidden border border-neutral-200">
            {/* Modal Header */}
            <div className="relative p-6 bg-neutral-950 text-white flex items-center justify-between">
              <div>
                <span className="text-amber-400 text-[10px] tracking-[0.3em] uppercase block font-mono">
                  Atelier Luxury Voucher
                </span>
                <h3 className="text-xl font-serif-luxury tracking-wider uppercase">
                  {selectedTier.name} GIFT CARD &bull; ₹{selectedTier.price.toLocaleString('en-IN')}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-neutral-400 hover:text-white p-1 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body: Personalization Form */}
            <form onSubmit={handleAddToCart} className="p-6 space-y-4 text-xs">
              <div className="p-3 bg-neutral-50 rounded-lg border border-neutral-100 flex items-start space-x-3">
                <Gift className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <p className="text-neutral-600 text-[11px] leading-relaxed">
                  {selectedTier.description} Includes signature digital luxury sleeve and complimentary custom tailoring consultation.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-700 font-semibold mb-1 uppercase tracking-wider text-[10px]">
                    Recipient Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={recipientName}
                    onChange={(e) => setRecipientName(e.target.value)}
                    placeholder="e.g. Lord Alexander"
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:border-neutral-900 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-neutral-700 font-semibold mb-1 uppercase tracking-wider text-[10px]">
                    Recipient Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={recipientEmail}
                    onChange={(e) => setRecipientEmail(e.target.value)}
                    placeholder="alexander@domain.com"
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:border-neutral-900 text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-700 font-semibold mb-1 uppercase tracking-wider text-[10px]">
                    Sender Name
                  </label>
                  <input
                    type="text"
                    value={senderName}
                    onChange={(e) => setSenderName(e.target.value)}
                    placeholder="Your Name (Optional)"
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:border-neutral-900 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-neutral-700 font-semibold mb-1 uppercase tracking-wider text-[10px]">
                    Delivery Option
                  </label>
                  <select
                    value={deliveryType}
                    onChange={(e: any) => setDeliveryType(e.target.value)}
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:border-neutral-900 text-xs bg-white"
                  >
                    <option value="instant">Instant Delivery (via Email)</option>
                    <option value="scheduled">Schedule for Special Occasion</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-neutral-700 font-semibold mb-1 uppercase tracking-wider text-[10px]">
                  Personal Scented Note / Message
                </label>
                <textarea
                  rows={2}
                  value={giftMessage}
                  onChange={(e) => setGiftMessage(e.target.value)}
                  placeholder="With deepest regards on your special milestone..."
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:border-neutral-900 text-xs resize-none"
                />
              </div>

              <div className="pt-3 border-t border-neutral-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center space-x-1.5 text-neutral-500 text-[11px]">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span>Never expires &bull; Valid online & in ateliers</span>
                </div>

                <button
                  type="submit"
                  disabled={isAdded}
                  className={`flex items-center justify-center space-x-2 px-6 py-3 sm:py-2.5 rounded-lg font-bold text-xs uppercase tracking-wider transition-all w-full sm:w-auto ${
                    isAdded
                      ? 'bg-emerald-600 text-white'
                      : 'bg-neutral-950 text-white hover:bg-neutral-800'
                  }`}
                >
                  {isAdded ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>ADDED TO BAG</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-4 h-4" />
                      <span>ADD TO BAG &bull; ₹{selectedTier.price.toLocaleString('en-IN')}</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default GiftCardShowcase;
