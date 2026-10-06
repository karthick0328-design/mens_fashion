import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Star } from 'lucide-react';
import { IProduct } from '../../types';
import { useWishlistStore } from '../../store/useWishlistStore';

interface ProductCardProps {
  product: IProduct;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { isInWishlist, toggleWishlist } = useWishlistStore();
  const wishlisted = isInWishlist(product._id);

  // Derive lowest price and highest discount from variants
  const defaultVariant = product.variants?.[0] || {
    price: 999,
    mrp: 1999,
    discountPercentage: 50,
  };

  const primaryImage = product.images?.[0] || 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800';

  return (
    <div className="group relative bg-white border border-neutral-100 rounded-lg overflow-hidden flex flex-col transition-all duration-300 hover:shadow-card-hover hover:border-neutral-200">
      {/* Product Image Container */}
      <div className="relative aspect-[3/4] overflow-hidden bg-neutral-100">
        <Link to={`/products/${product.slug}`} className="block w-full h-full">
          <img
            src={primaryImage}
            alt={product.title}
            loading="lazy"
            className="w-full h-full object-cover object-top transition-transform duration-500 ease-out group-hover:scale-105"
          />
        </Link>

        {/* Wishlist Button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleWishlist(product._id);
          }}
          className="absolute top-2.5 right-2.5 z-10 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm shadow-sm flex items-center justify-center text-neutral-600 hover:text-rose-600 hover:bg-white transition-all transform active:scale-90"
          title={wishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
        >
          <Heart
            className={`w-4 h-4 transition-colors ${
              wishlisted ? 'fill-rose-600 text-rose-600' : 'text-neutral-700'
            }`}
          />
        </button>

        {/* Featured / Trending Badge */}
        {product.isFeatured && (
          <div className="absolute top-2.5 left-2.5 bg-neutral-900/90 backdrop-blur-sm text-white text-[9px] uppercase font-bold tracking-widest px-2 py-0.5 rounded shadow-sm">
            Trending
          </div>
        )}

        {/* Color Indicators on hover bottom */}
        {product.colors && product.colors.length > 0 && (
          <div className="absolute bottom-2 left-2 flex items-center space-x-1.5 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            {product.colors.slice(0, 4).map((c, idx) => (
              <span
                key={idx}
                className="w-2.5 h-2.5 rounded-full border border-black/10 inline-block"
                style={{ backgroundColor: c.hex }}
                title={c.name}
              />
            ))}
            {product.colors.length > 4 && (
              <span className="text-[9px] text-neutral-500 font-bold">+{product.colors.length - 4}</span>
            )}
          </div>
        )}
      </div>

      {/* Product Details Block */}
      <div className="p-3.5 flex-1 flex flex-col justify-between">
        <div>
          {/* Brand */}
          <div className="text-[11px] font-bold uppercase tracking-wider text-neutral-500 mb-1">
            {product.brand}
          </div>

          {/* Title */}
          <Link
            to={`/products/${product.slug}`}
            className="block text-xs sm:text-sm font-medium text-neutral-800 hover:text-neutral-950 transition-colors line-clamp-2 leading-snug mb-1.5"
            title={product.title}
          >
            {product.title}
          </Link>

          {/* Rating Badge */}
          <div className="flex items-center space-x-1.5 mb-2.5">
            <div className="inline-flex items-center space-x-0.5 bg-emerald-700 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
              <span>{product.rating?.average || 4.2}</span>
              <Star className="w-2.5 h-2.5 fill-current" />
            </div>
            <span className="text-[11px] text-neutral-400">
              ({product.rating?.count?.toLocaleString() || 120})
            </span>
          </div>
        </div>

        {/* Pricing & Offer */}
        <div className="pt-2 border-t border-neutral-100">
          <div className="flex items-baseline space-x-2">
            <span className="text-sm sm:text-base font-extrabold text-neutral-900">
              ₹{defaultVariant.price.toLocaleString('en-IN')}
            </span>
            {defaultVariant.mrp > defaultVariant.price && (
              <span className="text-xs text-neutral-400 line-through">
                ₹{defaultVariant.mrp.toLocaleString('en-IN')}
              </span>
            )}
            {defaultVariant.discountPercentage > 0 && (
              <span className="text-xs font-bold text-emerald-600">
                {defaultVariant.discountPercentage}% OFF
              </span>
            )}
          </div>

          {/* Micro Offer tag */}
          <div className="mt-1 text-[10px] font-semibold text-amber-700">
            Special Price Available
          </div>
        </div>
      </div>
    </div>
  );
};
