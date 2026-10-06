import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ExternalLink } from 'lucide-react';
import api from '../../services/api';
import { OrderStatus } from '../../types';

export const AdminOrders: React.FC = () => {
  const queryClient = useQueryClient();
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [page, setPage] = useState(1);

  const { data: orderResponse, isLoading } = useQuery({
    queryKey: ['adminOrders', statusFilter, page],
    queryFn: async () => {
      const res = await api.get('/admin/orders', {
        params: { status: statusFilter, page, limit: 12 },
      });
      return res.data;
    },
  });

  const orders = orderResponse?.data || [];
  const meta = orderResponse?.meta || { total: 0, totalPages: 1 };

  const updateStatusMutation = useMutation({
    mutationFn: async ({ orderId, status }: { orderId: string; status: OrderStatus }) => {
      const res = await api.patch(`/admin/orders/${orderId}/status`, { status });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminOrders'] });
      queryClient.invalidateQueries({ queryKey: ['adminAnalytics'] });
      alert('Order status updated');
    },
    onError: (err: any) => {
      alert(err.response?.data?.message || 'Error updating order status');
    },
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto text-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-amber-400 block mb-1">
            Fulfillment Center
          </span>
          <h1 className="text-2xl font-extrabold uppercase tracking-tight font-serif-luxury text-white">
            Customer Orders ({meta.total})
          </h1>
        </div>

        {/* Status Filter Tabs */}
        <div className="flex flex-wrap gap-1.5">
          {['ALL', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'].map((st) => (
            <button
              key={st}
              onClick={() => {
                setStatusFilter(st);
                setPage(1);
              }}
              className={`px-3 py-1 rounded text-[11px] font-semibold transition-colors ${
                statusFilter === st
                  ? 'bg-amber-500 text-neutral-950 font-bold'
                  : 'bg-neutral-950 text-neutral-400 border border-neutral-800 hover:text-white'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-neutral-950 border border-neutral-800 rounded-xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-neutral-800 text-[10px] uppercase font-bold tracking-wider text-neutral-400 bg-neutral-900/60">
                <th className="py-3 px-4">Order Number</th>
                <th className="py-3 px-4">Client</th>
                <th className="py-3 px-4">Date Placed</th>
                <th className="py-3 px-4">Items</th>
                <th className="py-3 px-4">Total Amount</th>
                <th className="py-3 px-4">Payment</th>
                <th className="py-3 px-4">Status Transition</th>
                <th className="py-3 px-4 text-right">View</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-900 text-neutral-300">
              {isLoading ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-neutral-500">
                    Loading customer orders...
                  </td>
                </tr>
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-neutral-500">
                    No orders in this state.
                  </td>
                </tr>
              ) : (
                orders.map((ord: any) => (
                  <tr key={ord._id} className="hover:bg-neutral-900/40 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-amber-400">{ord.orderNumber}</td>
                    <td className="py-3 px-4">
                      <span className="font-semibold text-white block">{ord.userId?.name || 'Customer'}</span>
                      <span className="text-[11px] text-neutral-500">{ord.userId?.email}</span>
                    </td>
                    <td className="py-3 px-4 text-neutral-400">
                      {new Date(ord.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4 font-semibold text-neutral-300">
                      {ord.items?.length || 0} pieces
                    </td>
                    <td className="py-3 px-4 font-bold text-white">
                      ₹{ord.pricing?.totalAmount?.toLocaleString('en-IN')}
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-neutral-300 font-semibold">{ord.payment.method}</span>
                      <span className="block text-[10px] text-emerald-400">{ord.payment.status}</span>
                    </td>
                    <td className="py-3 px-4">
                      <select
                        value={ord.orderStatus}
                        onChange={(e) =>
                          updateStatusMutation.mutate({
                            orderId: ord._id,
                            status: e.target.value as OrderStatus,
                          })
                        }
                        className="bg-neutral-900 border border-neutral-700 text-white text-xs rounded px-2 py-1 focus:outline-none focus:border-amber-400 font-semibold cursor-pointer"
                      >
                        {['CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'].map((st) => (
                          <option key={st} value={st}>{st}</option>
                        ))}
                      </select>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <a
                        href={`/user/order/${ord._id}`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-neutral-400 hover:text-white p-1 inline-block"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {meta.totalPages > 1 && (
          <div className="p-4 border-t border-neutral-800 flex items-center justify-between text-neutral-400">
            <span>Page {meta.page} of {meta.totalPages}</span>
            <div className="space-x-2">
              <button
                disabled={page <= 1}
                onClick={() => setPage((p) => p - 1)}
                className="px-3 py-1 bg-neutral-900 border border-neutral-800 rounded disabled:opacity-40"
              >
                Prev
              </button>
              <button
                disabled={page >= meta.totalPages}
                onClick={() => setPage((p) => p + 1)}
                className="px-3 py-1 bg-neutral-900 border border-neutral-800 rounded disabled:opacity-40"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminOrders;
