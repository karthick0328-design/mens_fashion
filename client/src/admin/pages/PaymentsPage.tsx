import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Search, ShieldCheck } from 'lucide-react';
import adminApi from '../services/adminApi';
import { DataTable, Column } from '../components/DataTable';
import { StatusBadge } from '../components/StatusBadge';
import { IPaymentTransaction } from '../types/admin';

export const PaymentsPage: React.FC = () => {
  const [search, setSearch] = useState('');
  const [methodFilter, setMethodFilter] = useState('ALL');

  const { data: payments = [], isLoading } = useQuery<IPaymentTransaction[]>({
    queryKey: ['adminPayments'],
    queryFn: async () => {
      const res = await adminApi.getPayments();
      return res.data?.data || [];
    },
  });

  const totalCaptured = payments
    .filter((p) => p.status === 'PAID')
    .reduce((sum, p) => sum + (p.amount || 0), 0);

  const totalPending = payments
    .filter((p) => p.status === 'PENDING')
    .reduce((sum, p) => sum + (p.amount || 0), 0);

  const filtered = payments.filter((p) => {
    const matchesSearch =
      p.transactionId.toLowerCase().includes(search.toLowerCase()) ||
      p.orderNumber.toLowerCase().includes(search.toLowerCase()) ||
      p.customerName.toLowerCase().includes(search.toLowerCase());

    if (!matchesSearch) return false;
    if (methodFilter !== 'ALL' && p.method !== methodFilter) return false;
    return true;
  });

  const columns: Column<IPaymentTransaction>[] = [
    {
      header: 'Transaction ID',
      accessor: (p) => (
        <span className="font-mono font-bold text-neutral-900 text-xs">
          {p.transactionId}
        </span>
      ),
    },
    {
      header: 'Order Reference',
      accessor: (p) => (
        <a
          href={`/admin/orders/${p.orderId}`}
          className="font-mono font-bold text-yellow-600 hover:underline text-xs"
        >
          {p.orderNumber}
        </a>
      ),
    },
    {
      header: 'Patron',
      accessor: (p) => (
        <div>
          <span className="font-bold text-neutral-900 block text-xs">
            {p.customerName}
          </span>
          <span className="text-[10px] text-neutral-400 block truncate max-w-[150px]">
            {p.customerEmail}
          </span>
        </div>
      ),
    },
    {
      header: 'Amount',
      accessor: (p) => (
        <span className="font-serif-luxury font-bold text-neutral-900 text-xs">
          ₹{p.amount.toLocaleString('en-IN')}
        </span>
      ),
    },
    {
      header: 'Method',
      accessor: (p) => (
        <span className="text-[11px] font-mono font-semibold text-neutral-700 ">
          {p.method}
        </span>
      ),
    },
    {
      header: 'Payment Status',
      accessor: (p) => <StatusBadge status={p.status} type="payment" />,
    },
    {
      header: 'Settlement Date',
      accessor: (p) => (
        <span className="text-neutral-400 font-mono text-[10px]">
          {new Date(p.date).toLocaleString()}
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
            Financial Ledger
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold font-serif-luxury text-neutral-900 uppercase tracking-tight">
            Payments & Settlements
          </h1>
          <p className="text-xs text-neutral-500 mt-1">
            Real-time transaction settlements, gateway reconciliations, and refund audits.
          </p>
        </div>
      </div>

      {/* Summary Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-xl bg-white border border-neutral-200 shadow-sm space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
            Total Settled Revenue
          </span>
          <div className="text-2xl font-bold font-serif-luxury text-neutral-900 ">
            ₹{totalCaptured.toLocaleString('en-IN')}
          </div>
          <span className="text-[11px] text-emerald-600 font-semibold block">
            Cleared via payment gateways
          </span>
        </div>

        <div className="p-5 rounded-xl bg-white border border-neutral-200 shadow-sm space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
            Pending / COD Collections
          </span>
          <div className="text-2xl font-bold font-serif-luxury text-amber-500">
            ₹{totalPending.toLocaleString('en-IN')}
          </div>
          <span className="text-[11px] text-neutral-400 block">
            Awaiting courier delivery handover
          </span>
        </div>

        <div className="p-5 rounded-xl bg-white border border-neutral-200 shadow-sm space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
            Security & PCI Standard
          </span>
          <div className="text-lg font-bold text-neutral-900 flex items-center space-x-1.5 pt-1">
            <ShieldCheck className="w-5 h-5 text-emerald-500" />
            <span>PCI-DSS Level 1 Encrypted</span>
          </div>
          <span className="text-[11px] text-neutral-400 block">
            Zero plain-text credential persistence
          </span>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="p-4 rounded-xl bg-white border border-neutral-200 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-sm">
        <div className="relative w-full sm:w-80">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search transaction ID, order #, patron..."
            className="w-full bg-neutral-50 border border-neutral-300 rounded-lg pl-9 pr-4 py-2 text-neutral-900 placeholder:text-neutral-400 text-xs focus:outline-none focus:border-yellow-400"
          />
          <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
        </div>

        <div className="flex items-center space-x-1.5 w-full sm:w-auto overflow-x-auto no-scrollbar pb-1 sm:pb-0 text-xs">
          {['ALL', 'ONLINE', 'UPI', 'CARD', 'COD'].map((method) => (
            <button
              key={method}
              onClick={() => setMethodFilter(method)}
              className={`px-3 py-1.5 rounded-lg font-semibold whitespace-nowrap transition-all ${
                methodFilter === method
                  ? 'bg-neutral-900 text-white shadow-sm'
                  : 'text-neutral-500 hover:text-neutral-900 bg-neutral-100 '
              }`}
            >
              {method}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <DataTable
        columns={columns}
        data={filtered}
        keyExtractor={(p) => p.transactionId}
        isLoading={isLoading}
        emptyTitle="NO TRANSACTIONS FOUND"
        emptySubtitle="Transaction entries will appear as client checkout orders are processed."
      />
    </div>
  );
};

export default PaymentsPage;
