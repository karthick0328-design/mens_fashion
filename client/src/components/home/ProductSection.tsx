import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { IProduct } from '../../types';
import { ProductCard } from '../product/ProductCard';

interface ProductSectionProps {
  title: string;
  subtitle: string;
  products: IProduct[];
  viewAllLink?: string;
  isLoading?: boolean;
}

export const ProductSection: React.FC<ProductSectionProps> = ({
  title,
  subtitle,
  products,
  viewAllLink = '/products',
  isLoading = false,
}) => {
  return (
    <section className="py-12 sm:py-16 bg-neutral-50/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 pb-4 border-b border-neutral-200">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-amber-600 block mb-1">
              {subtitle}
            </span>
            <h2 className="text-xl sm:text-2xl font-extrabold uppercase tracking-tight font-serif-luxury text-neutral-900">
              {title}
            </h2>
          </div>
          {viewAllLink && (
            <Link
              to={viewAllLink}
              className="mt-3 sm:mt-0 text-xs font-bold uppercase tracking-wider text-neutral-700 hover:text-neutral-950 flex items-center space-x-1 group"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
            </Link>
          )}
        </div>

        {/* Loading Skeletons */}
        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="bg-white border border-neutral-100 rounded-lg overflow-hidden animate-pulse">
                <div className="aspect-[3/4] bg-neutral-200" />
                <div className="p-4 space-y-3">
                  <div className="h-3 bg-neutral-200 rounded w-1/3" />
                  <div className="h-4 bg-neutral-200 rounded w-3/4" />
                  <div className="h-4 bg-neutral-200 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {products.slice(0, 8).map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
