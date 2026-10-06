import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Search, Eye } from 'lucide-react';
import adminApi from '../services/adminApi';
import { DataTable, Column } from '../components/DataTable';
import { StatusBadge } from '../components/StatusBadge';
import { OrderStatus, ORDER_STATUSES } from '../../types';

export const OrdersListPage: React.FC = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [statusFilter, setStatusFilter] = useState('ALL');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  const { data: orderResponse, isLoading } = useQuery({
    queryKey: ['adminOrders', statusFilter, search, page],
    queryFn: async () => {
      const res = await adminApi.getOrders({
        status: statusFilter,
        search,
        page,
        limit: 12,
      });
      return res.data;
    },
  });

  const orders: any[] = orderResponse?.data || [];
  const meta = orderResponse?.meta || { total: 0, totalPages: 1 };

  const updateStatusMutation = useMutation({
    mutationFn: async ({ orderId, status }: { orderId: string; status: OrderStatus }) => {
      return adminApi.updateOrderStatus(orderId, status);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminOrders'] });
      queryClient.invalidateQueries({ queryKey: ['adminDashboard'] });
    },
    onError: (err: any) => {
      alert(err.response?.data?.message || 'Error updating order status');
    },
  });

  const filterTabs = [
    'ALL',
    'CONFIRMED',
    'PROCESSING',
    'SHIPPED',
    'DELIVERED',
    'CANCELLED',
    'RETURN_REQUESTED',
    'RETURNED',
  ];

  const columns: Column<any>[] = [
    {
      header: 'Order Reference',
      accessor: (ord) => (
        <div>
          <button
            onClick={() => navigate(`/admin/orders/${ord._id}`)}
            className="font-mono font-bold text-xs text-neutral-900 hover:text-yellow-600 transition-colors block text-left"
          >
            {ord.orderNumber}
          </button>
          <span className="text-[10px] text-neutral-400">
            {new Date(ord.createdAt).toLocaleDateString()}
          </span>
        </div>
      ),
    },
    {
      header: 'Clientele',
      accessor: (ord) => (
        <div>
          <span className="font-bold text-neutral-900 block truncate max-w-[150px]">
            {ord.shippingAddress?.name || ord.userId?.name || 'Customer'}
          </span>
          <span className="text-[10px] text-neutral-400 block truncate max-w-[150px]">
            {ord.userId?.email || ord.shippingAddress?.phone}
          </span>
        </div>
      ),
    },
    {
      header: 'Items',
      accessor: (ord) => (
        <span className="text-xs font-semibold text-neutral-700 ">
          {ord.items?.length || 1} pieces
        </span>
      ),
    },
    {
      header: 'Grand Total',
      accessor: (ord) => (
        <span className="font-serif-luxury font-bold text-xs text-neutral-900 ">
          ₹{ord.pricing?.totalAmount?.toLocaleString('en-IN') || 0}
        </span>
      ),
    },
    {
      header: 'Payment',
      accessor: (ord) => (
        <div>
          <span className="font-semibold text-neutral-800 block text-[11px]">
            {ord.payment?.method || 'ONLINE'}
          </span>
          <StatusBadge status={ord.payment?.status || 'PENDING'} type="payment" />
        </div>
      ),
    },
    {
      header: 'Logistics',
      accessor: (ord) => (
        <span className="text-[11px] text-neutral-500 font-mono block">
          {ord.shippingDetails?.courier || 'Bluedart Atelier'}
        </span>
      ),
    },
    {
      header: 'Fulfillment State',
      accessor: (ord) => (
        <select
          value={ord.orderStatus}
          onChange={(e) =>
            updateStatusMutation.mutate({
              orderId: ord._id,
              status: e.target.value as OrderStatus,
            })
          }
          className="bg-neutral-100 border border-neutral-300 rounded px-2 py-1 text-[11px] font-bold text-neutral-800 focus:outline-none focus:border-yellow-400 cursor-pointer"
        >
          {ORDER_STATUSES.map((st) => (
            <option key={st} value={st}>
              {st}
            </option>
          ))}
        </select>
      ),
    },
    {
      header: 'Action',
      align: 'right',
      accessor: (ord) => (
        <button
          onClick={() => navigate(`/admin/orders/${ord._id}`)}
          className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-900 hover:bg-neutral-100 transition-colors"
          title="Inspect Order Details"
        >
          <Eye className="w-4 h-4" />
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
            Fulfillment Center
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold font-serif-luxury text-neutral-900 uppercase tracking-tight">
            Client Orders ({meta.total})
          </h1>
          <p className="text-xs text-neutral-500 mt-1">
            Track customer transactions, courier dispatches, status transitions, and issue refunds.
          </p>
        </div>
      </div>

      {/* Filter Tabs & Search */}
      <div className="p-4 rounded-xl bg-white border border-neutral-200 space-y-3 shadow-sm">
        {/* Status Pills */}
        <div className="flex items-center space-x-1.5 overflow-x-auto no-scrollbar pb-1 text-xs">
          {filterTabs.map((st) => (
            <button
              key={st}
              onClick={() => {
                setStatusFilter(st);
                setPage(1);
              }}
              className={`px-3 py-1.5 rounded-lg font-semibold whitespace-nowrap transition-all ${
                statusFilter === st
                  ? 'bg-neutral-900 text-white shadow-sm'
                  : 'text-neutral-500 hover:text-neutral-900 bg-neutral-100 '
              }`}
            >
              {st}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative max-w-md">
          <input
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Search by order #, client name, or phone..."
            className="w-full bg-neutral-50 border border-neutral-300 rounded-lg pl-9 pr-4 py-2 text-neutral-900 placeholder:text-neutral-400 text-xs focus:outline-none focus:border-yellow-400"
          />
          <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
        </div>
      </div>

      {/* Orders Table */}
      <DataTable
        columns={columns}
        data={orders}
        keyExtractor={(ord) => ord._id}
        isLoading={isLoading}
        emptyTitle="NO ORDERS FOUND"
        emptySubtitle="No customer orders currently match the specified status criteria."
        pagination={{
          currentPage: meta.page,
          totalPages: meta.totalPages,
          totalItems: meta.total,
          onPageChange: (p) => setPage(p),
        }}
      />
    </div>
  );
};

export default OrdersListPage;
