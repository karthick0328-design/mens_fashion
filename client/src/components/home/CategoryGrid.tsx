import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';

const categories = [
  {
    name: 'T-Shirts',
    subtitle: 'Everyday Essentials',
    slug: 't-shirts',
    image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=700&auto=format&fit=crop&q=80',
    itemCount: '20+ styles',
  },
  {
    name: 'Shirts',
    subtitle: 'Crisp Oxford & Linens',
    slug: 'shirts',
    image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=700&auto=format&fit=crop&q=80',
    itemCount: '10+ styles',
  },
  {
    name: 'Jeans',
    subtitle: 'Selvedge & Slim Tapered',
    slug: 'jeans',
    image: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=700&auto=format&fit=crop&q=80',
    itemCount: '10+ styles',
  },
  {
    name: 'Trousers',
    subtitle: 'Tailored Chinos & Pleats',
    slug: 'trousers',
    image: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=700&auto=format&fit=crop&q=80',
    itemCount: '10+ styles',
  },
  {
    name: 'Watches',
    subtitle: 'Horology & Precision',
    slug: 'watches',
    image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=700&auto=format&fit=crop&q=80',
    itemCount: '10+ models',
  },
  {
    name: 'Shoes',
    subtitle: 'Sneakers & Oxford Brogues',
    slug: 'footwear',
    image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=700&auto=format&fit=crop&q=80',
    itemCount: '10+ styles',
  },
  {
    name: 'Accessories',
    subtitle: 'Leather Wallets & Belts',
    slug: 'accessories',
    image: 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=700&auto=format&fit=crop&q=80',
    itemCount: '10+ items',
  },
];

export const CategoryGrid: React.FC = () => {
  return (
    <section className="py-16 sm:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-amber-600 block mb-2">
              Curated Wardrobe
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold uppercase tracking-tight font-serif-luxury text-neutral-900">
              Shop By Category
            </h2>
          </div>
          <Link
            to="/products"
            className="mt-4 sm:mt-0 text-xs font-bold uppercase tracking-wider text-neutral-700 hover:text-neutral-950 flex items-center space-x-1 group"
          >
            <span>View All Departments</span>
            <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </div>

        {/* Responsive Grid with consistent aspect ratio */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
          {categories.map((cat, idx) => (
            <Link
              key={cat.slug}
              to={`/products?category=${cat.slug}`}
              className={`group relative overflow-hidden rounded-lg bg-neutral-100 aspect-[4/5] flex flex-col justify-end p-3.5 sm:p-5 transition-all duration-300 hover:shadow-card-hover ${
                idx === 0 ? 'col-span-2 sm:col-span-1 md:col-span-2 lg:col-span-1 aspect-auto min-h-[260px] sm:min-h-[300px]' : ''
              }`}
            >
              {/* Image */}
              <img
                src={cat.image}
                alt={cat.name}
                className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
                loading="lazy"
              />
              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/85 via-neutral-950/20 to-transparent transition-opacity group-hover:opacity-90" />

              {/* Text Info */}
              <div className="relative z-10 space-y-1">
                <span className="text-[10px] font-semibold uppercase tracking-widest text-amber-400 block">
                  {cat.itemCount}
                </span>
                <h3 className="text-base sm:text-lg font-bold uppercase tracking-wider font-serif-luxury text-white">
                  {cat.name}
                </h3>
                <p className="text-xs text-neutral-300 line-clamp-1">
                  {cat.subtitle}
                </p>
                <div className="pt-2 flex items-center space-x-1 text-[11px] font-bold uppercase tracking-wider text-white opacity-0 transform translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                  <span>Explore Now</span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-amber-400" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};
