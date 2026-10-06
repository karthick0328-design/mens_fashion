import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Star, Check, EyeOff, Flag, Trash2 } from 'lucide-react';
import adminApi from '../services/adminApi';
import { DataTable, Column } from '../components/DataTable';
import { StatusBadge } from '../components/StatusBadge';
import { ConfirmDialog } from '../components/ConfirmDialog';

export const ReviewsPage: React.FC = () => {
  const queryClient = useQueryClient();
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const { data: reviews = [], isLoading } = useQuery<any[]>({
    queryKey: ['adminReviews', statusFilter],
    queryFn: async () => {
      const res = await adminApi.getReviews(statusFilter === 'ALL' ? undefined : statusFilter);
      return res.data?.data || [];
    },
  });

  const moderateMutation = useMutation({
    mutationFn: async ({ id, action }: { id: string; action: 'APPROVE' | 'HIDE' | 'REPORT' | 'DELETE' }) => {
      return adminApi.moderateReview(id, action);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminReviews'] });
      setDeleteId(null);
    },
  });

  const columns: Column<any>[] = [
    {
      header: 'Patron',
      accessor: (r) => (
        <div>
          <span className="font-bold text-neutral-900 block text-xs">
            {r.userId?.name || 'Customer'}
          </span>
          <span className="text-[10px] text-neutral-400 block truncate max-w-[140px]">
            {r.userId?.email || 'Registered patron'}
          </span>
        </div>
      ),
    },
    {
      header: 'Product Piece',
      accessor: (r) => (
        <div className="flex items-center space-x-2.5">
          <img
            src={r.productId?.images?.[0] || 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800'}
            alt=""
            className="w-8 h-10 object-cover rounded bg-neutral-100 "
          />
          <span className="font-semibold text-neutral-900 text-xs truncate max-w-[160px]">
            {r.productId?.title || 'Fashion Piece'}
          </span>
        </div>
      ),
    },
    {
      header: 'Rating',
      accessor: (r) => (
        <div className="flex items-center space-x-1 text-yellow-600 ">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={`w-3 h-3 ${i < r.rating ? 'fill-current' : 'text-neutral-300 '}`}
            />
          ))}
        </div>
      ),
    },
    {
      header: 'Review Content',
      accessor: (r) => (
        <div className="max-w-xs space-y-0.5 text-xs">
          <span className="font-bold text-neutral-900 block truncate">
            {r.title}
          </span>
          <p className="text-[11px] text-neutral-500 line-clamp-2 leading-relaxed">
            {r.comment}
          </p>
        </div>
      ),
    },
    {
      header: 'Status',
      accessor: (r) => (
        <StatusBadge
          status={r.status || 'APPROVED'}
          type={r.status === 'REPORTED' ? 'stock' : 'order'}
        />
      ),
    },
    {
      header: 'Date',
      accessor: (r) => (
        <span className="text-[10px] text-neutral-400 font-mono">
          {new Date(r.createdAt).toLocaleDateString()}
        </span>
      ),
    },
    {
      header: 'Moderation Actions',
      align: 'right',
      accessor: (r) => (
        <div className="flex items-center justify-end space-x-1">
          {r.status !== 'APPROVED' && (
            <button
              onClick={() => moderateMutation.mutate({ id: r._id, action: 'APPROVE' })}
              className="p-1.5 rounded-lg text-emerald-600 hover:bg-emerald-50 transition-colors"
              title="Approve Review"
            >
              <Check className="w-3.5 h-3.5" />
            </button>
          )}
          {r.status !== 'HIDDEN' && (
            <button
              onClick={() => moderateMutation.mutate({ id: r._id, action: 'HIDE' })}
              className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-900 transition-colors"
              title="Hide from Storefront"
            >
              <EyeOff className="w-3.5 h-3.5" />
            </button>
          )}
          {r.status !== 'REPORTED' && (
            <button
              onClick={() => moderateMutation.mutate({ id: r._id, action: 'REPORT' })}
              className="p-1.5 rounded-lg text-amber-500 hover:bg-amber-50 transition-colors"
              title="Flag as Inappropriate"
            >
              <Flag className="w-3.5 h-3.5" />
            </button>
          )}
          <button
            onClick={() => setDeleteId(r._id)}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-rose-600 transition-colors"
            title="Delete Review"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-neutral-200 ">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-yellow-600 block mb-1">
            Reputation & Ratings
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold font-serif-luxury text-neutral-900 uppercase tracking-tight">
            Reviews & Ratings Moderation
          </h1>
          <p className="text-xs text-neutral-500 mt-1">
            Moderate customer testimonials, verified purchases, craftsmanship feedback, and flag inappropriate remarks.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center space-x-2 overflow-x-auto no-scrollbar border-b border-neutral-200 pb-1 text-xs">
        {['ALL', 'PENDING', 'APPROVED', 'REPORTED', 'HIDDEN'].map((tab) => (
          <button
            key={tab}
            onClick={() => setStatusFilter(tab)}
            className={`px-3.5 py-1.5 rounded-lg font-semibold whitespace-nowrap transition-all ${
              statusFilter === tab
                ? 'bg-neutral-900 text-white shadow-sm'
                : 'text-neutral-500 hover:text-neutral-900 '
            }`}
          >
            {tab} Reviews
          </button>
        ))}
      </div>

      {/* Table */}
      <DataTable
        columns={columns}
        data={reviews}
        keyExtractor={(r) => r._id}
        isLoading={isLoading}
        emptyTitle="NO REVIEWS FOUND"
        emptySubtitle="No customer testimonials currently match the selected moderation status."
      />

      {/* CONFIRM DELETE DIALOG */}
      <ConfirmDialog
        isOpen={Boolean(deleteId)}
        onClose={() => setDeleteId(null)}
        onConfirm={() => deleteId && moderateMutation.mutate({ id: deleteId, action: 'DELETE' })}
        title="Delete Review"
        message="Are you sure you wish to permanently delete this customer testimonial? This action cannot be undone."
        confirmLabel="Delete Review"
        isDestructive
        isLoading={moderateMutation.isPending}
      />
    </div>
  );
};

export default ReviewsPage;
