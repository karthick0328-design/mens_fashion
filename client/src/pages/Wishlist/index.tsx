import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Heart, ShoppingBag, ArrowRight } from 'lucide-react';
import api from '../../services/api';
import { IProduct } from '../../types';
import { AnnouncementBar } from '../../components/layout/AnnouncementBar';
import { Header } from '../../components/layout/Header';
import { Footer } from '../../components/layout/Footer';
import { CartDrawer } from '../../components/cart/CartDrawer';
import { ProductCard } from '../../components/product/ProductCard';
import { useAuthStore } from '../../store/useAuthStore';

export const WishlistPage: React.FC = () => {
  const { isAuthenticated } = useAuthStore();

  const { data: wishlist = [], isLoading } = useQuery<IProduct[]>({
    queryKey: ['wishlist'],
    queryFn: async () => {
      const res = await api.get('/wishlist');
      return res.data?.data || [];
    },
    enabled: isAuthenticated,
  });

  return (
    <div className="min-h-screen flex flex-col bg-neutral-50">
      <AnnouncementBar />
      <Header />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="border-b border-neutral-200 pb-4 mb-8 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-amber-700 block mb-1">
              Personal Atelier
            </span>
            <h1 className="text-2xl font-extrabold uppercase tracking-tight font-serif-luxury text-neutral-900">
              My Saved Wishlist ({wishlist.length})
            </h1>
          </div>
          <Link
            to="/products"
            className="text-xs font-bold uppercase tracking-wider text-neutral-700 hover:text-neutral-950 flex items-center space-x-1"
          >
            <span>Continue Shopping</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {!isAuthenticated ? (
          <div className="bg-white border border-neutral-200 rounded-xl p-12 text-center max-w-md mx-auto my-12">
            <Heart className="w-12 h-12 text-neutral-300 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-neutral-900 mb-1">Sign in to sync your wishlist</h3>
            <p className="text-xs text-neutral-500 mb-6">
              Save your favorite luxury pieces across devices and receive notifications on price drops.
            </p>
            <Link
              to="/login"
              className="inline-block bg-neutral-950 text-white font-bold text-xs uppercase tracking-wider px-8 py-3 rounded hover:bg-neutral-800 transition-colors"
            >
              Sign In Now
            </Link>
          </div>
        ) : isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="bg-white rounded-lg aspect-[3/4] animate-pulse bg-neutral-200" />
            ))}
          </div>
        ) : wishlist.length === 0 ? (
          <div className="bg-white border border-neutral-200 rounded-xl p-12 text-center max-w-md mx-auto my-12">
            <Heart className="w-12 h-12 text-neutral-300 mx-auto mb-4 stroke-1" />
            <h3 className="text-lg font-bold text-neutral-900 mb-1">Your wishlist is currently empty</h3>
            <p className="text-xs text-neutral-500 mb-6">
              Explore our contemporary menswear collections and tap the heart icon on any piece to save it here.
            </p>
            <Link
              to="/products"
              className="inline-flex items-center space-x-2 bg-neutral-950 text-white font-bold text-xs uppercase tracking-wider px-6 py-3 rounded hover:bg-neutral-800 transition-colors"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Explore Collection</span>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
            {wishlist.map((prod) => (
              <ProductCard key={prod._id} product={prod} />
            ))}
          </div>
        )}
      </main>

      <Footer />
      <CartDrawer />
    </div>
  );
};

export default WishlistPage;
