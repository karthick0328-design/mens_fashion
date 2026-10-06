import React from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '../../services/api';
import { IProduct } from '../../types';
import { AnnouncementBar } from '../../components/layout/AnnouncementBar';
import { Header } from '../../components/layout/Header';
import { Footer } from '../../components/layout/Footer';
import { CartDrawer } from '../../components/cart/CartDrawer';
import { HeroBanner } from '../../components/home/HeroBanner';
import { CategoryGrid } from '../../components/home/CategoryGrid';
import { ProductSection } from '../../components/home/ProductSection';
import { WatchSpotlight } from '../../components/home/WatchSpotlight';

export const HomePage: React.FC = () => {
  // Fetch Featured Products
  const { data: featuredProducts = [], isLoading: isFeaturedLoading } = useQuery<IProduct[]>({
    queryKey: ['products', 'featured'],
    queryFn: async () => {
      const res = await api.get('/products/featured');
      return res.data?.data || [];
    },
  });

  // Fetch Trending Products
  const { data: trendingProducts = [], isLoading: isTrendingLoading } = useQuery<IProduct[]>({
    queryKey: ['products', 'trending'],
    queryFn: async () => {
      const res = await api.get('/products/trending');
      return res.data?.data || [];
    },
  });

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <AnnouncementBar />
      <Header />

      <main className="flex-1">
        {/* 1. Hero Banner */}
        <HeroBanner />

        {/* 2. Shop By Category Grid */}
        <CategoryGrid />

        {/* 3. Trending Now Section */}
        <ProductSection
          title="Trending Across India"
          subtitle="Most Desired This Week"
          products={trendingProducts}
          viewAllLink="/products?sort=popularity"
          isLoading={isTrendingLoading}
        />

        {/* 4. Fine Horology & Watch Spotlight */}
        <WatchSpotlight />

        {/* 5. Best Sellers Section */}
        <ProductSection
          title="Curated Best Sellers"
          subtitle="Heirloom Quality Essentials"
          products={featuredProducts}
          viewAllLink="/products"
          isLoading={isFeaturedLoading}
        />
      </main>

      <Footer />
      <CartDrawer />
    </div>
  );
};

export default HomePage;
