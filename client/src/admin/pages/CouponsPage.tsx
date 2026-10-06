import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Trash2 } from 'lucide-react';
import adminApi from '../services/adminApi';
import { DataTable, Column } from '../components/DataTable';
import { StatusBadge } from '../components/StatusBadge';
import { Modal } from '../components/Modal';
import { ConfirmDialog } from '../components/ConfirmDialog';

export const CouponsPage: React.FC = () => {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  // Form states
  const [code, setCode] = useState('');
  const [discountType, setDiscountType] = useState<'PERCENTAGE' | 'FIXED'>('PERCENTAGE');
  const [discountValue, setDiscountValue] = useState('15');
  const [minOrder, setMinOrder] = useState('1999');
  const [maxDiscount, setMaxDiscount] = useState('1000');
  const [usageLimit, setUsageLimit] = useState('1000');
  const [endDate, setEndDate] = useState(new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]);

  const { data: coupons = [], isLoading } = useQuery<any[]>({
    queryKey: ['adminCoupons'],
    queryFn: async () => {
      const res = await adminApi.getCoupons();
      return res.data?.data || [];
    },
  });

  const saveMutation = useMutation({
    mutationFn: async () => {
      return adminApi.createCoupon({
        code,
        discountType,
        discountValue: parseFloat(discountValue),
        minOrderAmount: parseFloat(minOrder),
        maxDiscount: maxDiscount ? parseFloat(maxDiscount) : null,
        usageLimit: parseInt(usageLimit, 10),
        endDate,
        isActive: true,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminCoupons'] });
      setIsModalOpen(false);
      setCode('');
    },
    onError: (err: any) => {
      alert(err.response?.data?.message || 'Error creating coupon');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return adminApi.deleteCoupon(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminCoupons'] });
      setDeleteId(null);
    },
  });

  const toggleStatusMutation = useMutation({
    mutationFn: async ({ id, isActive }: { id: string; isActive: boolean }) => {
      return adminApi.updateCoupon(id, { isActive });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminCoupons'] });
    },
  });

  const columns: Column<any>[] = [
    {
      header: 'Voucher Code',
      accessor: (c) => (
        <span className="font-mono font-bold text-neutral-900 text-xs tracking-wider">
          {c.code}
        </span>
      ),
    },
    {
      header: 'Discount Benefit',
      accessor: (c) => (
        <span className="font-serif-luxury font-bold text-yellow-600 text-xs">
          {c.discountType === 'PERCENTAGE' ? `${c.discountValue}% OFF` : `₹${c.discountValue} FLAT OFF`}
        </span>
      ),
    },
    {
      header: 'Eligibility Criteria',
      accessor: (c) => (
        <div className="text-xs space-y-0.5">
          <span className="text-neutral-600 block">
            Min Order: ₹{c.minOrderAmount || 0}
          </span>
          {c.maxDiscount && (
            <span className="text-[10px] text-neutral-400 block">
              Max Cap: ₹{c.maxDiscount}
            </span>
          )}
        </div>
      ),
    },
    {
      header: 'Redemption Pace',
      accessor: (c) => (
        <div className="text-xs space-y-1">
          <span className="font-mono text-neutral-900 font-bold block">
            {c.usedCount || 0} / {c.usageLimit || 1000} used
          </span>
          <div className="w-24 h-1.5 bg-neutral-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-yellow-400 rounded-full"
              style={{
                width: `${Math.min(100, Math.round(((c.usedCount || 0) / (c.usageLimit || 1000)) * 100))}%`,
              }}
            />
          </div>
        </div>
      ),
    },
    {
      header: 'Expiry Date',
      accessor: (c) => (
        <span className="text-neutral-400 font-mono text-[10px]">
          {new Date(c.endDate).toLocaleDateString()}
        </span>
      ),
    },
    {
      header: 'Status',
      accessor: (c) => (
        <button
          onClick={() => toggleStatusMutation.mutate({ id: c._id, isActive: !c.isActive })}
          title="Click to toggle status"
        >
          <StatusBadge status={c.isActive ? 'Active' : 'Disabled'} type="stock" />
        </button>
      ),
    },
    {
      header: 'Action',
      align: 'right',
      accessor: (c) => (
        <button
          onClick={() => setDeleteId(c._id)}
          className="p-1.5 rounded-lg text-neutral-400 hover:text-rose-600 transition-colors"
          title="Delete Coupon"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-neutral-200 ">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-yellow-600 block mb-1">
            Marketing & Promotions
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold font-serif-luxury text-neutral-900 uppercase tracking-tight">
            Coupons & Flash Rules
          </h1>
          <p className="text-xs text-neutral-500 mt-1">
            Configure promotional percentage vouchers, threshold discount caps, and seasonal campaign codes.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-yellow-400 hover:bg-yellow-500 text-neutral-950 font-bold text-xs uppercase tracking-wider px-5 py-2.5 rounded-lg shadow-sm transition-colors flex items-center space-x-2 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>New Promotion Coupon</span>
        </button>
      </div>

      {/* Table */}
      <DataTable
        columns={columns}
        data={coupons}
        keyExtractor={(c) => c._id}
        isLoading={isLoading}
        emptyTitle="NO PROMOTIONAL COUPONS"
        emptySubtitle="Create promo codes like WELCOME10 or LUXE500 to drive customer conversion."
      />

      {/* CREATE COUPON MODAL */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Create Promotional Coupon"
        subtitle="Specify discount logic, thresholds, and expiry limits."
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            saveMutation.mutate();
          }}
          className="space-y-4 text-xs"
        >
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-neutral-700 font-semibold mb-1">
                Coupon Code <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                placeholder="e.g. AUTUMN25, LUXE1000"
                className="w-full bg-neutral-50 border border-neutral-300 rounded-lg p-2.5 text-neutral-900 font-mono uppercase font-bold focus:outline-none focus:border-yellow-400"
              />
            </div>

            <div>
              <label className="block text-neutral-700 font-semibold mb-1">
                Discount Type
              </label>
              <select
                value={discountType}
                onChange={(e) => setDiscountType(e.target.value as any)}
                className="w-full bg-neutral-50 border border-neutral-300 rounded-lg p-2.5 text-neutral-900 focus:outline-none focus:border-yellow-400"
              >
                <option value="PERCENTAGE">Percentage (%) Discount</option>
                <option value="FIXED">Fixed Amount (₹) Off</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-neutral-700 font-semibold mb-1">
                Discount Value <span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                required
                value={discountValue}
                onChange={(e) => setDiscountValue(e.target.value)}
                className="w-full bg-neutral-50 border border-neutral-300 rounded-lg p-2.5 text-neutral-900 font-mono font-bold focus:outline-none focus:border-yellow-400"
              />
            </div>

            <div>
              <label className="block text-neutral-700 font-semibold mb-1">
                Minimum Order (₹)
              </label>
              <input
                type="number"
                value={minOrder}
                onChange={(e) => setMinOrder(e.target.value)}
                className="w-full bg-neutral-50 border border-neutral-300 rounded-lg p-2.5 text-neutral-900 font-mono focus:outline-none focus:border-yellow-400"
              />
            </div>

            <div>
              <label className="block text-neutral-700 font-semibold mb-1">
                Max Discount Cap (₹)
              </label>
              <input
                type="number"
                value={maxDiscount}
                onChange={(e) => setMaxDiscount(e.target.value)}
                className="w-full bg-neutral-50 border border-neutral-300 rounded-lg p-2.5 text-neutral-900 font-mono focus:outline-none focus:border-yellow-400"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-neutral-700 font-semibold mb-1">
                Total Redemptions Cap
              </label>
              <input
                type="number"
                value={usageLimit}
                onChange={(e) => setUsageLimit(e.target.value)}
                className="w-full bg-neutral-50 border border-neutral-300 rounded-lg p-2.5 text-neutral-900 font-mono focus:outline-none focus:border-yellow-400"
              />
            </div>

            <div>
              <label className="block text-neutral-700 font-semibold mb-1">
                Valid Until Date <span className="text-rose-500">*</span>
              </label>
              <input
                type="date"
                required
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full bg-neutral-50 border border-neutral-300 rounded-lg p-2.5 text-neutral-900 focus:outline-none focus:border-yellow-400"
              />
            </div>
          </div>

          <div className="pt-3 border-t border-neutral-200 flex justify-end space-x-2">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 border border-neutral-300 rounded-lg text-neutral-600 font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saveMutation.isPending}
              className="px-6 py-2 bg-yellow-400 text-neutral-950 rounded-lg font-bold uppercase tracking-wider"
            >
              {saveMutation.isPending ? 'Saving...' : 'Create Coupon'}
            </button>
          </div>
        </form>
      </Modal>

      {/* CONFIRM DELETE DIALOG */}
      <ConfirmDialog
        isOpen={Boolean(deleteId)}
        onClose={() => setDeleteId(null)}
        onConfirm={() => deleteId && deleteMutation.mutate(deleteId)}
        title="Delete Coupon"
        message="Are you sure you wish to permanently decommission this coupon? Any customer currently using this code will no longer receive the discount."
        confirmLabel="Delete Coupon"
        isDestructive
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
};

export default CouponsPage;
