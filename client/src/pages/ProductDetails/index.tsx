import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  Star,
  Heart,
  Share2,
  Truck,
  ShieldCheck,
  RotateCcw,
  Tag,
  ChevronRight,
  ShoppingBag,
  Zap,
  Ruler,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import api from '../../services/api';
import { IProduct, IProductVariant, ProductSize } from '../../types';
import { AnnouncementBar } from '../../components/layout/AnnouncementBar';
import { Header } from '../../components/layout/Header';
import { Footer } from '../../components/layout/Footer';
import { CartDrawer } from '../../components/cart/CartDrawer';
import { ProductCard } from '../../components/product/ProductCard';
import { SizeChartModal } from '../../components/product/SizeChartModal';
import { useCartStore } from '../../store/useCartStore';
import { useWishlistStore } from '../../store/useWishlistStore';

export const ProductDetailsPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  const { addItem, isLoading: isCartLoading } = useCartStore();
  const { isInWishlist, toggleWishlist } = useWishlistStore();

  const [selectedColorName, setSelectedColorName] = useState<string>('');
  const [selectedSize, setSelectedSize] = useState<ProductSize | ''>('');
  const [activeImageIndex, setActiveImageIndex] = useState<number>(0);
  const [sizeChartOpen, setSizeChartOpen] = useState<boolean>(false);
  const [pincode, setPincode] = useState<string>('');
  const [pincodeChecked, setPincodeChecked] = useState<boolean>(false);
  const [deliveryDate, setDeliveryDate] = useState<string>('');
  const [copiedCoupon, setCopiedCoupon] = useState<string | null>(null);

  // Fetch product and similar items
  const { data, isLoading, error } = useQuery({
    queryKey: ['product', slug],
    queryFn: async () => {
      const res = await api.get(`/products/${slug}`);
      return res.data?.data;
    },
    enabled: Boolean(slug),
  });

  const product: IProduct | undefined = data?.product;
  const similarProducts: IProduct[] = data?.similarProducts || [];

  // Initialize selected color and size once product loads
  useEffect(() => {
    if (product) {
      const initialColor = product.colors?.[0]?.name || product.variants?.[0]?.color?.name || '';
      setSelectedColorName(initialColor);

      // Find first available size for this color
      const availableVariant = product.variants?.find(
        (v) => v.color?.name === initialColor && v.stock > 0
      );
      if (availableVariant) {
        setSelectedSize(availableVariant.size);
      } else {
        setSelectedSize(product.variants?.[0]?.size || '');
      }
      setActiveImageIndex(0);
    }
  }, [product]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-white">
        <AnnouncementBar />
        <Header />
        <div className="max-w-7xl mx-auto px-4 py-16 w-full animate-pulse">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="aspect-[3/4] bg-neutral-200 rounded-lg" />
            <div className="space-y-4">
              <div className="h-4 bg-neutral-200 rounded w-1/4" />
              <div className="h-8 bg-neutral-200 rounded w-3/4" />
              <div className="h-6 bg-neutral-200 rounded w-1/3" />
              <div className="h-24 bg-neutral-200 rounded" />
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex flex-col bg-white">
        <AnnouncementBar />
        <Header />
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
          <h2 className="text-2xl font-bold font-serif-luxury text-neutral-900 mb-2">Product Not Found</h2>
          <p className="text-neutral-500 text-sm mb-6">The luxury item you are looking for has been moved or retired.</p>
          <Link
            to="/products"
            className="bg-neutral-950 text-white text-xs font-bold uppercase tracking-wider px-6 py-3 rounded hover:bg-neutral-800"
          >
            Explore All Collections
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  // Active color object
  const activeColorObj = product.colors?.find((c) => c.name === selectedColorName) || product.colors?.[0];
  const galleryImages = (activeColorObj?.images && activeColorObj.images.length > 0)
    ? activeColorObj.images
    : product.images || [];

  const activeImage = galleryImages[activeImageIndex] || galleryImages[0];

  // Selected variant
  const activeVariant: IProductVariant | undefined = product.variants?.find(
    (v) => v.color?.name === selectedColorName && v.size === selectedSize
  );

  const currentPrice = activeVariant ? activeVariant.price : (product.variants?.[0]?.price || 999);
  const currentMrp = activeVariant ? activeVariant.mrp : (product.variants?.[0]?.mrp || 1999);
  const currentDiscount = activeVariant ? activeVariant.discountPercentage : 50;
  const currentStock = activeVariant ? activeVariant.stock : 0;
  const isOutOfStock = currentStock === 0;

  // Handle Pincode Estimation
  const handleCheckPincode = (e: React.FormEvent) => {
    e.preventDefault();
    if (pincode.length === 6 && /^\d+$/.test(pincode)) {
      const estimated = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000);
      setDeliveryDate(
        estimated.toLocaleDateString('en-IN', {
          weekday: 'long',
          month: 'short',
          day: 'numeric',
        })
      );
      setPincodeChecked(true);
    } else {
      alert('Please enter a valid 6-digit Indian PIN code');
    }
  };

  // Add to Cart
  const handleAddToCart = async () => {
    if (!activeVariant) return;
    await addItem(product._id, activeVariant.sku, 1);
  };

  // Buy Now
  const handleBuyNow = async () => {
    if (!activeVariant) return;
    const added = await addItem(product._id, activeVariant.sku, 1);
    if (added) {
      navigate('/checkout');
    }
  };

  const copyCouponCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCoupon(code);
    setTimeout(() => setCopiedCoupon(null), 2500);
  };

  const wishlisted = isInWishlist(product._id);

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <AnnouncementBar />
      <Header />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center space-x-2 text-xs text-neutral-500 mb-6 overflow-x-auto whitespace-nowrap pb-1">
          <Link to="/" className="hover:text-neutral-900 transition-colors">Home</Link>
          <ChevronRight className="w-3 h-3 text-neutral-400" />
          <Link to="/products" className="hover:text-neutral-900 transition-colors">Men</Link>
          {product.category && (
            <>
              <ChevronRight className="w-3 h-3 text-neutral-400" />
              <Link
                to={`/products?category=${typeof product.category === 'object' ? product.category.slug : ''}`}
                className="hover:text-neutral-900 transition-colors capitalize"
              >
                {typeof product.category === 'object' ? product.category.name : 'Category'}
              </Link>
            </>
          )}
          <ChevronRight className="w-3 h-3 text-neutral-400" />
          <span className="font-semibold text-neutral-900 truncate max-w-[200px]">{product.title}</span>
        </nav>

        {/* 2-Column Product Detail Layout (Matching Reference Image 2) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* LEFT: Multi-Angle Image Gallery (5 Cols) */}
          <div className="lg:col-span-6 flex flex-col-reverse sm:flex-row gap-4 lg:sticky lg:top-28">
            {/* Vertical Thumbnail Strip */}
            <div className="flex sm:flex-col gap-3 overflow-x-auto sm:overflow-y-auto max-h-[580px] no-scrollbar flex-shrink-0">
              {galleryImages.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`w-16 h-20 sm:w-20 sm:h-24 rounded-md overflow-hidden border-2 transition-all flex-shrink-0 bg-neutral-100 ${
                    activeImageIndex === idx
                      ? 'border-neutral-900 shadow-md ring-1 ring-neutral-900'
                      : 'border-transparent hover:border-neutral-300 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt={`${product.title} angle ${idx + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>

            {/* Active Large Image with Zoom & Floating Buttons */}
            <div className="relative flex-1 aspect-[3/4] bg-neutral-100 rounded-xl overflow-hidden group shadow-card border border-neutral-100">
              <img
                src={activeImage}
                alt={product.title}
                className="w-full h-full object-cover object-top transition-transform duration-500 ease-out group-hover:scale-110 cursor-crosshair"
              />

              {/* Wishlist Button */}
              <button
                onClick={() => toggleWishlist(product._id)}
                className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-white/90 backdrop-blur shadow-md flex items-center justify-center text-neutral-700 hover:text-rose-600 hover:bg-white transition-all transform active:scale-90"
                title="Wishlist"
              >
                <Heart className={`w-5 h-5 ${wishlisted ? 'fill-rose-600 text-rose-600' : ''}`} />
              </button>

              {/* Share Button */}
              <button
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href);
                  alert('Product link copied to clipboard!');
                }}
                className="absolute top-16 right-4 z-10 w-10 h-10 rounded-full bg-white/90 backdrop-blur shadow-md flex items-center justify-center text-neutral-700 hover:text-neutral-950 hover:bg-white transition-all transform active:scale-90"
                title="Share link"
              >
                <Share2 className="w-4 h-4" />
              </button>

              {/* Floating Low Stock Warning Badge */}
              {!isOutOfStock && currentStock <= 5 && (
                <div className="absolute bottom-4 left-4 bg-amber-500 text-neutral-950 text-xs font-bold px-3 py-1 rounded-full shadow flex items-center space-x-1.5 animate-pulse">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>Only {currentStock} left in stock!</span>
                </div>
              )}
            </div>
          </div>

          {/* RIGHT: Product Information & Buy Box (7 Cols) */}
          <div className="lg:col-span-6 space-y-6">
            {/* Brand & Title */}
            <div>
              <Link
                to={`/products?brand=${encodeURIComponent(product.brand)}`}
                className="text-xs font-bold uppercase tracking-[0.2em] text-neutral-500 hover:text-neutral-900 transition-colors"
              >
                {product.brand}
              </Link>
              <h1 className="text-2xl sm:text-3xl font-extrabold uppercase tracking-tight font-serif-luxury text-neutral-950 mt-1 leading-snug">
                {product.title}
              </h1>

              {/* Rating Capsule */}
              <div className="flex items-center space-x-3 mt-3">
                <div className="inline-flex items-center space-x-1 bg-emerald-700 text-white text-xs font-bold px-2 py-0.5 rounded">
                  <span>{product.rating?.average || 4.3}</span>
                  <Star className="w-3 h-3 fill-current" />
                </div>
                <span className="text-xs text-neutral-500">
                  {product.rating?.count?.toLocaleString() || '1,420'} Ratings & 382 Reviews
                </span>
                <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                  Verified Authentic
                </span>
              </div>
            </div>

            {/* Price Block (Matching Reference Image 2) */}
            <div className="p-4 bg-neutral-50/80 rounded-xl border border-neutral-200 space-y-1.5">
              <div className="flex items-baseline space-x-3">
                <span className="text-2xl sm:text-3xl font-black text-neutral-950">
                  ₹{currentPrice.toLocaleString('en-IN')}
                </span>
                {currentMrp > currentPrice && (
                  <span className="text-base text-neutral-400 line-through">
                    ₹{currentMrp.toLocaleString('en-IN')}
                  </span>
                )}
                {currentDiscount > 0 && (
                  <span className="text-sm font-bold text-emerald-600 bg-emerald-100/60 px-2 py-0.5 rounded">
                    {currentDiscount}% OFF
                  </span>
                )}
              </div>
              <div className="flex items-center justify-between text-xs text-neutral-500">
                <span>Inclusive of all taxes</span>
                {currentMrp > currentPrice && (
                  <span className="font-semibold text-emerald-700">
                    You save ₹{(currentMrp - currentPrice).toLocaleString('en-IN')}
                  </span>
                )}
              </div>
            </div>

            {/* Available Bank & Coupon Offers Card */}
            <div className="p-4 border border-amber-200/80 bg-amber-50/40 rounded-xl space-y-2.5">
              <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-amber-900">
                <Tag className="w-4 h-4 text-amber-700" />
                <span>Available Offers & Promotions</span>
              </div>
              <div className="space-y-2 text-xs text-neutral-700">
                <div className="flex items-start justify-between bg-white p-2 rounded border border-amber-100">
                  <div>
                    <span className="font-bold text-neutral-900">WELCOME10</span>
                    <p className="text-[11px] text-neutral-500">10% instant off on your first order above ₹999</p>
                  </div>
                  <button
                    onClick={() => copyCouponCode('WELCOME10')}
                    className="text-xs font-bold text-amber-700 hover:text-amber-900"
                  >
                    {copiedCoupon === 'WELCOME10' ? 'Copied!' : 'Copy Code'}
                  </button>
                </div>
                <div className="flex items-start justify-between bg-white p-2 rounded border border-amber-100">
                  <div>
                    <span className="font-bold text-neutral-900">FASHION20</span>
                    <p className="text-[11px] text-neutral-500">Extra 20% off on orders above ₹1,999</p>
                  </div>
                  <button
                    onClick={() => copyCouponCode('FASHION20')}
                    className="text-xs font-bold text-amber-700 hover:text-amber-900"
                  >
                    {copiedCoupon === 'FASHION20' ? 'Copied!' : 'Copy Code'}
                  </button>
                </div>
              </div>
            </div>

            {/* Color Swatch Selection */}
            {product.colors && product.colors.length > 0 && (
              <div className="space-y-2.5 pt-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-neutral-900">
                    Color: <strong className="text-neutral-950 font-bold">{selectedColorName}</strong>
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  {product.colors.map((c) => (
                    <button
                      key={c.name}
                      onClick={() => {
                        setSelectedColorName(c.name);
                        setActiveImageIndex(0);
                      }}
                      className={`relative p-0.5 rounded-full border-2 transition-all ${
                        selectedColorName === c.name
                          ? 'border-neutral-900 scale-110 shadow-sm'
                          : 'border-transparent hover:border-neutral-300'
                      }`}
                      title={c.name}
                    >
                      <span
                        className="block w-6 h-6 rounded-full border border-black/10 shadow-inner"
                        style={{ backgroundColor: c.hex }}
                      />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Size Selector & Size Chart Modal Link */}
            {product.sizes && product.sizes.length > 0 && (
              <div className="space-y-2.5 pt-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-neutral-900">
                    Select Size: <strong className="text-neutral-950 font-bold">{selectedSize || 'Choose size'}</strong>
                  </span>
                  <button
                    onClick={() => setSizeChartOpen(true)}
                    className="text-amber-800 hover:text-amber-950 font-semibold flex items-center space-x-1"
                  >
                    <Ruler className="w-3.5 h-3.5" />
                    <span>Size Guide</span>
                  </button>
                </div>

                <div className="flex flex-wrap gap-2.5">
                  {product.sizes.map((sz) => {
                    const variantForSize = product.variants?.find(
                      (v) => v.color?.name === selectedColorName && v.size === sz
                    );
                    const isAvailable = variantForSize && variantForSize.stock > 0;
                    const isSelected = selectedSize === sz;

                    return (
                      <button
                        key={sz}
                        onClick={() => setSelectedSize(sz)}
                        disabled={!isAvailable}
                        className={`min-w-[48px] h-11 px-3 rounded-lg border text-xs font-bold transition-all relative ${
                          isSelected
                            ? 'bg-neutral-950 border-neutral-950 text-white shadow-md'
                            : isAvailable
                            ? 'bg-white border-neutral-300 hover:border-neutral-900 text-neutral-800'
                            : 'bg-neutral-100 border-neutral-200 text-neutral-400 cursor-not-allowed line-through'
                        }`}
                      >
                        <span>{sz}</span>
                        {!isAvailable && (
                          <span className="absolute -top-1.5 -right-1.5 bg-neutral-200 text-[8px] text-neutral-600 px-1 rounded font-normal">
                            Sold
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Pincode & Delivery Checker */}
            <div className="p-4 border border-neutral-200 rounded-xl space-y-2 text-xs">
              <span className="font-semibold text-neutral-900 block">Delivery Options & COD Availability</span>
              <form onSubmit={handleCheckPincode} className="flex space-x-2 max-w-sm">
                <input
                  type="text"
                  maxLength={6}
                  value={pincode}
                  onChange={(e) => {
                    setPincode(e.target.value);
                    setPincodeChecked(false);
                  }}
                  placeholder="Enter 6-digit delivery pincode"
                  className="flex-1 px-3 py-2 border border-neutral-300 rounded text-xs focus:outline-none focus:border-neutral-900"
                />
                <button
                  type="submit"
                  className="bg-neutral-900 hover:bg-neutral-800 text-white font-bold px-4 py-2 rounded text-xs transition-colors"
                >
                  Check
                </button>
              </form>

              {pincodeChecked && (
                <div className="pt-2 space-y-1.5 text-xs text-neutral-700 animate-in fade-in">
                  <div className="flex items-center space-x-2 text-emerald-700 font-semibold">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Delivery by {deliveryDate} | Free Shipping</span>
                  </div>
                  <div className="flex items-center space-x-2 text-neutral-600">
                    <Truck className="w-4 h-4 text-neutral-400" />
                    <span>Cash on Delivery is available for {pincode}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Desktop Action Buttons: ADD TO CART & BUY NOW */}
            <div className="pt-4 grid grid-cols-2 gap-4">
              <button
                onClick={handleAddToCart}
                disabled={isOutOfStock || isCartLoading}
                className="w-full bg-neutral-950 hover:bg-neutral-800 disabled:bg-neutral-300 disabled:cursor-not-allowed text-white font-bold uppercase tracking-wider text-xs py-4 rounded-xl flex items-center justify-center space-x-2 transition-all shadow-md active:scale-[0.98]"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>{isOutOfStock ? 'Out of Stock' : 'Add to Bag'}</span>
              </button>
              <button
                onClick={handleBuyNow}
                disabled={isOutOfStock || isCartLoading}
                className="w-full bg-amber-500 hover:bg-amber-400 disabled:bg-neutral-200 disabled:cursor-not-allowed text-neutral-950 font-bold uppercase tracking-wider text-xs py-4 rounded-xl flex items-center justify-center space-x-2 transition-all shadow-md active:scale-[0.98]"
              >
                <Zap className="w-4 h-4 fill-neutral-950" />
                <span>Buy Now</span>
              </button>
            </div>

            {/* Value Guarantees */}
            <div className="grid grid-cols-3 gap-3 pt-4 border-t border-neutral-200 text-center text-xs text-neutral-600">
              <div className="p-2 bg-neutral-50 rounded-lg">
                <Truck className="w-4 h-4 mx-auto mb-1 text-neutral-700" />
                <span className="font-semibold block text-[11px]">Free Shipping</span>
                <span className="text-[10px] text-neutral-400">Above ₹999</span>
              </div>
              <div className="p-2 bg-neutral-50 rounded-lg">
                <RotateCcw className="w-4 h-4 mx-auto mb-1 text-neutral-700" />
                <span className="font-semibold block text-[11px]">7-Day Returns</span>
                <span className="text-[10px] text-neutral-400">Doorstep pickup</span>
              </div>
              <div className="p-2 bg-neutral-50 rounded-lg">
                <ShieldCheck className="w-4 h-4 mx-auto mb-1 text-neutral-700" />
                <span className="font-semibold block text-[11px]">100% Authentic</span>
                <span className="text-[10px] text-neutral-400">Direct from atelier</span>
              </div>
            </div>

            {/* Product Description */}
            <div className="pt-4 border-t border-neutral-200 space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-900">
                Product Narrative & Craft
              </h3>
              <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Category-Specific Specifications Table */}
            {product.specifications && Object.keys(product.specifications).length > 0 && (
              <div className="pt-4 border-t border-neutral-200 space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-900">
                  Specifications & Material Composition
                </h3>
                <div className="border border-neutral-200 rounded-lg overflow-hidden text-xs">
                  <table className="w-full divide-y divide-neutral-200">
                    <tbody className="divide-y divide-neutral-100">
                      {Object.entries(product.specifications).map(([key, val], idx) => (
                        <tr key={key} className={idx % 2 === 0 ? 'bg-neutral-50/60' : 'bg-white'}>
                          <td className="py-2.5 px-4 font-semibold text-neutral-500 w-1/3">{key}</td>
                          <td className="py-2.5 px-4 font-medium text-neutral-900">{String(val)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Similar Products Recommendation Grid */}
        {similarProducts.length > 0 && (
          <section className="mt-20 pt-12 border-t border-neutral-200">
            <div className="mb-8">
              <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-amber-600 block mb-1">
                You May Also Admire
              </span>
              <h2 className="text-xl sm:text-2xl font-extrabold uppercase tracking-tight font-serif-luxury text-neutral-900">
                Similar Handcrafted Pieces
              </h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
              {similarProducts.slice(0, 4).map((p) => (
                <ProductCard key={p._id} product={p} />
              ))}
            </div>
          </section>
        )}
      </main>

      {/* MOBILE STICKY BOTTOM ACTION BAR (Matching Master Prompt #45) */}
      <div className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur border-t border-neutral-200 p-3 shadow-floating flex items-center space-x-3">
        <div className="flex-1">
          <span className="text-xs text-neutral-400 block line-through">₹{currentMrp.toLocaleString('en-IN')}</span>
          <span className="text-base font-black text-neutral-900">₹{currentPrice.toLocaleString('en-IN')}</span>
        </div>
        <button
          onClick={handleAddToCart}
          disabled={isOutOfStock || isCartLoading}
          className="flex-1 bg-neutral-950 text-white font-bold text-xs uppercase tracking-wider py-3 rounded-lg flex items-center justify-center space-x-1"
        >
          <ShoppingBag className="w-3.5 h-3.5" />
          <span>{isOutOfStock ? 'Sold' : 'Add to Bag'}</span>
        </button>
        <button
          onClick={handleBuyNow}
          disabled={isOutOfStock || isCartLoading}
          className="flex-1 bg-amber-500 text-neutral-950 font-bold text-xs uppercase tracking-wider py-3 rounded-lg flex items-center justify-center space-x-1"
        >
          <Zap className="w-3.5 h-3.5 fill-current" />
          <span>Buy Now</span>
        </button>
      </div>

      {/* Size Chart Modal */}
      <SizeChartModal
        isOpen={sizeChartOpen}
        onClose={() => setSizeChartOpen(false)}
        categoryName={typeof product.category === 'object' ? product.category.name : 'Menswear'}
      />

      <Footer />
      <CartDrawer />
    </div>
  );
};

export default ProductDetailsPage;
