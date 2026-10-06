import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Heart, Eye } from 'lucide-react';
import adminApi from '../services/adminApi';
import { DataTable, Column } from '../components/DataTable';
import { IWishlistActivityItem } from '../types/admin';

export const WishlistActivityPage: React.FC = () => {
  const { data: activity = [], isLoading } = useQuery<IWishlistActivityItem[]>({
    queryKey: ['adminWishlistActivity'],
    queryFn: async () => {
      const res = await adminApi.getWishlistActivity();
      return res.data?.data || [];
    },
  });

  const columns: Column<IWishlistActivityItem>[] = [
    {
      header: 'Fashion Piece',
      accessor: (item) => (
        <div className="flex items-center space-x-3">
          <img
            src={item.image}
            alt={item.title}
            className="w-10 h-12 object-cover rounded bg-neutral-100 border border-neutral-200 "
          />
          <div>
            <span className="font-bold text-neutral-900 block truncate max-w-[220px]">
              {item.title}
            </span>
            <span className="text-[10px] text-neutral-400">
              {item.category} • {item.brand}
            </span>
          </div>
        </div>
      ),
    },
    {
      header: 'Wishlist Curations',
      accessor: (item) => (
        <div className="flex items-center space-x-1.5 text-rose-500 font-bold font-mono">
          <Heart className="w-3.5 h-3.5 fill-current" />
          <span>{item.wishlistCount} saves</span>
        </div>
      ),
    },
    {
      header: 'Total Atelier Views',
      accessor: (item) => (
        <div className="flex items-center space-x-1.5 text-neutral-700 font-mono">
          <Eye className="w-3.5 h-3.5 text-neutral-400" />
          <span>{item.views.toLocaleString('en-IN')} views</span>
        </div>
      ),
    },
    {
      header: 'Cart Conversion Rate',
      accessor: (item) => (
        <span className="font-mono font-bold text-emerald-600 ">
          {item.conversionRate}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-neutral-200 ">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-yellow-600 block mb-1">
            Client Desirability
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold font-serif-luxury text-neutral-900 uppercase tracking-tight">
            Wishlist & Patron Activity
          </h1>
          <p className="text-xs text-neutral-500 mt-1">
            Analyze which garments resonate with clients before purchase, views velocity, and conversion correlations.
          </p>
        </div>
      </div>

      {/* Top 3 Desirable Highlights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {activity.slice(0, 3).map((top, idx) => (
          <div
            key={top.productId}
            className="p-5 rounded-xl bg-white border border-neutral-200 shadow-sm flex items-center space-x-4"
          >
            <img
              src={top.image}
              alt={top.title}
              className="w-16 h-20 object-cover rounded-lg bg-neutral-100 border border-neutral-200 "
            />
            <div className="min-w-0">
              <span className="text-[10px] font-bold uppercase tracking-wider text-yellow-600 ">
                Rank #{idx + 1} Most Wanted
              </span>
              <h4 className="text-xs font-bold text-neutral-900 truncate">
                {top.title}
              </h4>
              <p className="text-[11px] text-rose-500 font-semibold mt-1">
                ❤️ {top.wishlistCount} Patrons Saved
              </p>
              <p className="text-[10px] text-neutral-400 font-mono mt-0.5">
                {top.views} Views • {top.conversionRate} Conv.
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Table */}
      <DataTable
        columns={columns}
        data={activity}
        keyExtractor={(item) => item.productId}
        isLoading={isLoading}
        emptyTitle="NO ACTIVITY LOGGED"
        emptySubtitle="Wishlist additions and product visits will populate here automatically."
      />
    </div>
  );
};

export default WishlistActivityPage;
