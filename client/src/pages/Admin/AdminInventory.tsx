import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Search } from 'lucide-react';
import api from '../../services/api';

export const AdminInventory: React.FC = () => {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<'ALL' | 'LOW' | 'OUT'>('ALL');
  const [editingStocks, setEditingStocks] = useState<Record<string, number>>({});
  const [savingSku, setSavingSku] = useState<string | null>(null);

  const { data: inventory = [], isLoading } = useQuery<any[]>({
    queryKey: ['adminInventory'],
    queryFn: async () => {
      const res = await api.get('/admin/inventory');
      return res.data?.data || [];
    },
  });

  const updateStockMutation = useMutation({
    mutationFn: async ({ sku, stock }: { sku: string; stock: number }) => {
      setSavingSku(sku);
      const res = await api.patch(`/admin/inventory/${sku}`, { stock, reason: 'MANUAL_ADJUSTMENT' });
      return res.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['adminInventory'] });
      queryClient.invalidateQueries({ queryKey: ['adminAnalytics'] });
      setSavingSku(null);
      alert(`SKU ${variables.sku} stock updated to ${variables.stock}`);
    },
    onError: (err: any) => {
      setSavingSku(null);
      alert(err.response?.data?.message || 'Error updating stock');
    },
  });

  const handleStockInputChange = (sku: string, value: string) => {
    const parsed = parseInt(value, 10);
    setEditingStocks((prev) => ({
      ...prev,
      [sku]: isNaN(parsed) ? 0 : parsed,
    }));
  };

  const handleSaveStock = (sku: string, currentStock: number) => {
    const newStock = editingStocks[sku] !== undefined ? editingStocks[sku] : currentStock;
    updateStockMutation.mutate({ sku, stock: newStock });
  };

  // Filter inventory
  const filteredInventory = inventory.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(search.toLowerCase()) ||
      item.sku.toLowerCase().includes(search.toLowerCase()) ||
      item.brand.toLowerCase().includes(search.toLowerCase());

    if (!matchesSearch) return false;

    if (filterStatus === 'LOW') return item.stock > 0 && item.stock <= 5;
    if (filterStatus === 'OUT') return item.stock === 0;
    return true;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto text-xs">
      <div>
        <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-amber-400 block mb-1">
          Stock Operations
        </span>
        <h1 className="text-2xl font-extrabold uppercase tracking-tight font-serif-luxury text-white">
          SKU Inventory Control ({inventory.length} SKUs)
        </h1>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by SKU, product name, or brand..."
            className="w-full bg-neutral-950 border border-neutral-800 rounded-lg pl-9 pr-4 py-2 text-white placeholder:text-neutral-500 text-xs focus:outline-none focus:border-amber-400"
          />
          <Search className="w-4 h-4 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2" />
        </div>

        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <button
            onClick={() => setFilterStatus('ALL')}
            className={`px-3 py-1.5 rounded font-semibold transition-colors ${
              filterStatus === 'ALL' ? 'bg-amber-500 text-neutral-950' : 'bg-neutral-950 text-neutral-400 border border-neutral-800'
            }`}
          >
            All SKUs
          </button>
          <button
            onClick={() => setFilterStatus('LOW')}
            className={`px-3 py-1.5 rounded font-semibold transition-colors ${
              filterStatus === 'LOW' ? 'bg-amber-500 text-neutral-950' : 'bg-neutral-950 text-neutral-400 border border-neutral-800'
            }`}
          >
            Low Stock (≤5)
          </button>
          <button
            onClick={() => setFilterStatus('OUT')}
            className={`px-3 py-1.5 rounded font-semibold transition-colors ${
              filterStatus === 'OUT' ? 'bg-rose-500 text-white' : 'bg-neutral-950 text-neutral-400 border border-neutral-800'
            }`}
          >
            Out of Stock (0)
          </button>
        </div>
      </div>

      {/* Inventory Table */}
      <div className="bg-neutral-950 border border-neutral-800 rounded-xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-neutral-800 text-[10px] uppercase font-bold tracking-wider text-neutral-400 bg-neutral-900/60">
                <th className="py-3 px-4">SKU Code</th>
                <th className="py-3 px-4">Product</th>
                <th className="py-3 px-4">Variant (Color / Size)</th>
                <th className="py-3 px-4">Price</th>
                <th className="py-3 px-4">Current Stock</th>
                <th className="py-3 px-4">Quick Adjust Stock</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-900 text-neutral-300">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-neutral-500">
                    Loading inventory registry...
                  </td>
                </tr>
              ) : filteredInventory.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-neutral-500">
                    No matching SKUs.
                  </td>
                </tr>
              ) : (
                filteredInventory.slice(0, 50).map((item) => {
                  const currentValue =
                    editingStocks[item.sku] !== undefined
                      ? editingStocks[item.sku]
                      : item.stock;

                  return (
                    <tr key={item.sku} className="hover:bg-neutral-900/40 transition-colors">
                      <td className="py-3 px-4 font-mono font-bold text-amber-400 text-xs">{item.sku}</td>
                      <td className="py-3 px-4 flex items-center space-x-2.5">
                        <img src={item.image} alt={item.title} className="w-8 h-10 object-cover rounded bg-neutral-900 flex-shrink-0" />
                        <span className="font-semibold text-white line-clamp-1 max-w-[200px]">{item.title}</span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-neutral-300">{item.color}</span>
                        <span className="text-neutral-500 font-bold ml-1.5">• Size {item.size}</span>
                      </td>
                      <td className="py-3 px-4 font-bold text-white">₹{item.price.toLocaleString('en-IN')}</td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            item.stock === 0
                              ? 'bg-rose-950 text-rose-300 border border-rose-800'
                              : item.stock <= 5
                              ? 'bg-amber-950 text-amber-300 border border-amber-800'
                              : 'bg-emerald-950 text-emerald-300'
                          }`}
                        >
                          {item.stock} in stock
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <input
                          type="number"
                          min={0}
                          value={currentValue}
                          onChange={(e) => handleStockInputChange(item.sku, e.target.value)}
                          className="w-20 bg-neutral-900 border border-neutral-700 rounded px-2.5 py-1 text-white font-mono font-bold focus:outline-none focus:border-amber-400"
                        />
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => handleSaveStock(item.sku, item.stock)}
                          disabled={savingSku === item.sku}
                          className="px-3 py-1 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold uppercase tracking-wider rounded text-[10px] transition-colors disabled:opacity-50"
                        >
                          {savingSku === item.sku ? 'Saving...' : 'Update'}
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminInventory;
