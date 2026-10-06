import React from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '../../services/api';

export const AdminCustomers: React.FC = () => {
  const { data: customers = [], isLoading } = useQuery<any[]>({
    queryKey: ['adminCustomers'],
    queryFn: async () => {
      const res = await api.get('/admin/customers');
      return res.data?.data || [];
    },
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto text-xs">
      <div>
        <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-amber-400 block mb-1">
          Client Relations
        </span>
        <h1 className="text-2xl font-extrabold uppercase tracking-tight font-serif-luxury text-white">
          Customer Directory ({customers.length})
        </h1>
      </div>

      <div className="bg-neutral-950 border border-neutral-800 rounded-xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-neutral-800 text-[10px] uppercase font-bold tracking-wider text-neutral-400 bg-neutral-900/60">
                <th className="py-3 px-4">Client Name</th>
                <th className="py-3 px-4">Email</th>
                <th className="py-3 px-4">Phone</th>
                <th className="py-3 px-4">Saved Addresses</th>
                <th className="py-3 px-4">Lifetime Orders</th>
                <th className="py-3 px-4">Lifetime Spend</th>
                <th className="py-3 px-4">Member Since</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-900 text-neutral-300">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-neutral-500">
                    Loading customer accounts...
                  </td>
                </tr>
              ) : customers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-neutral-500">
                    No customers registered yet.
                  </td>
                </tr>
              ) : (
                customers.map((c) => (
                  <tr key={c._id} className="hover:bg-neutral-900/40 transition-colors">
                    <td className="py-3 px-4 font-bold text-white flex items-center space-x-2">
                      <div className="w-7 h-7 rounded-full bg-neutral-900 text-amber-400 font-bold flex items-center justify-center text-xs">
                        {c.name.charAt(0)}
                      </div>
                      <span>{c.name}</span>
                    </td>
                    <td className="py-3 px-4 text-neutral-400">{c.email}</td>
                    <td className="py-3 px-4 text-neutral-400">{c.phone || '—'}</td>
                    <td className="py-3 px-4 text-neutral-300">{c.addresses?.length || 0} addresses</td>
                    <td className="py-3 px-4 font-bold text-neutral-200">{c.orderCount || 0} orders</td>
                    <td className="py-3 px-4 font-bold text-amber-400">
                      ₹{(c.totalSpent || 0).toLocaleString('en-IN')}
                    </td>
                    <td className="py-3 px-4 text-neutral-500">
                      {new Date(c.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminCustomers;
