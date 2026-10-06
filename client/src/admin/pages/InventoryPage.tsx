import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Search, History, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import adminApi from '../services/adminApi';
import { DataTable, Column } from '../components/DataTable';
import { StatusBadge } from '../components/StatusBadge';
import { Modal } from '../components/Modal';
import { IAdminInventoryItem, IInventoryLog } from '../types/admin';

export const InventoryPage: React.FC = () => {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'LOW' | 'OUT'>('ALL');
  const [editingStocks, setEditingStocks] = useState<Record<string, number>>({});
  const [savingSku, setSavingSku] = useState<string | null>(null);

  // History Log Modal
  const [isLogModalOpen, setIsLogModalOpen] = useState(false);

  // Fetch Inventory
  const { data: inventoryRes, isLoading } = useQuery({
    queryKey: ['adminInventory'],
    queryFn: async () => {
      const res = await adminApi.getInventory();
      return res.data?.data || [];
    },
  });

  const inventory: IAdminInventoryItem[] = inventoryRes || [];

  // Fetch Inventory Logs
  const { data: logsRes, isLoading: isLogsLoading } = useQuery({
    queryKey: ['inventoryLogs'],
    queryFn: async () => {
      const res = await adminApi.getInventoryLogs();
      return res.data?.data || [];
    },
    enabled: isLogModalOpen,
  });

  const logs: IInventoryLog[] = logsRes || [];

  const updateMutation = useMutation({
    mutationFn: async ({ sku, stock }: { sku: string; stock: number }) => {
      setSavingSku(sku);
      return adminApi.updateStock(sku, stock, 'MANUAL_EXECUTIVE_ADJUSTMENT');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminInventory'] });
      queryClient.invalidateQueries({ queryKey: ['adminDashboard'] });
      setSavingSku(null);
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
    updateMutation.mutate({ sku, stock: newStock });
  };

  const filtered = inventory.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(search.toLowerCase()) ||
      item.sku.toLowerCase().includes(search.toLowerCase()) ||
      item.brand.toLowerCase().includes(search.toLowerCase());

    if (!matchesSearch) return false;

    if (statusFilter === 'LOW') return item.stock > 0 && item.stock <= item.threshold;
    if (statusFilter === 'OUT') return item.stock === 0;
    return true;
  });

  const columns: Column<IAdminInventoryItem>[] = [
    {
      header: 'SKU Code',
      accessor: (i) => (
        <span className="font-mono font-bold text-neutral-900 text-xs">
          {i.sku}
        </span>
      ),
    },
    {
      header: 'Product & Department',
      accessor: (i) => (
        <div className="flex items-center space-x-3">
          <img
            src={i.image}
            alt={i.title}
            className="w-9 h-11 object-cover rounded bg-neutral-100 border border-neutral-200 flex-shrink-0"
          />
          <div className="min-w-0">
            <span className="font-bold text-neutral-900 block truncate max-w-[200px]">
              {i.title}
            </span>
            <span className="text-[10px] text-neutral-400">
              {i.categoryName} • {i.brand}
            </span>
          </div>
        </div>
      ),
    },
    {
      header: 'Variant Spec',
      accessor: (i) => (
        <div className="text-xs">
          <span className="text-neutral-800 font-medium block">
            {i.color}
          </span>
          <span className="text-[10px] text-neutral-400 font-mono">
            Size: {i.size}
          </span>
        </div>
      ),
    },
    {
      header: 'Total Stock',
      accessor: (i) => (
        <span className="font-mono font-bold text-neutral-900 ">
          {i.stock} units
        </span>
      ),
    },
    {
      header: 'Reserved / Available',
      accessor: (i) => (
        <div className="text-xs space-y-0.5">
          <span className="text-neutral-500 block text-[10px]">
            Reserved: {i.reserved}
          </span>
          <span className="font-semibold text-emerald-600 block">
            Available: {i.available}
          </span>
        </div>
      ),
    },
    {
      header: 'Threshold & Status',
      accessor: (i) => (
        <div className="space-y-1">
          <StatusBadge status={i.status} type="stock" />
          <span className="text-[10px] text-neutral-400 block font-mono">
            Alert at ≤ {i.threshold}
          </span>
        </div>
      ),
    },
    {
      header: 'Quick Adjustment',
      align: 'right',
      accessor: (i) => {
        const currentValue =
          editingStocks[i.sku] !== undefined ? editingStocks[i.sku] : i.stock;

        return (
          <div className="flex items-center justify-end space-x-2">
            <input
              type="number"
              min={0}
              value={currentValue}
              onChange={(e) => handleStockInputChange(i.sku, e.target.value)}
              className="w-18 bg-neutral-50 border border-neutral-300 rounded px-2.5 py-1 text-neutral-900 font-mono font-bold text-xs focus:outline-none focus:border-yellow-400"
            />
            <button
              onClick={() => handleSaveStock(i.sku, i.stock)}
              disabled={savingSku === i.sku}
              className="px-3 py-1 bg-yellow-400 hover:bg-yellow-500 text-neutral-950 font-bold uppercase tracking-wider text-[10px] rounded transition-colors disabled:opacity-50"
            >
              {savingSku === i.sku ? '...' : 'Update'}
            </button>
          </div>
        );
      },
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-neutral-200 ">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-yellow-600 block mb-1">
            Real-Time Logistics
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold font-serif-luxury text-neutral-900 uppercase tracking-tight">
            Inventory & Stock Control
          </h1>
          <p className="text-xs text-neutral-500 mt-1">
            Live SKU availability, reserved allocations, reorder thresholds, and warehouse audit history.
          </p>
        </div>

        <button
          onClick={() => setIsLogModalOpen(true)}
          className="bg-neutral-100 border border-neutral-200 hover:border-yellow-400/60 text-neutral-700 font-semibold text-xs px-4 py-2.5 rounded-lg shadow-sm transition-colors flex items-center space-x-2 self-start sm:self-auto"
        >
          <History className="w-4 h-4 text-yellow-600 " />
          <span>Audit History Log</span>
        </button>
      </div>

      {/* SEARCH AND FILTERS */}
      <div className="p-4 rounded-xl bg-white border border-neutral-200 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-sm">
        <div className="relative w-full sm:w-80">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by SKU, title, or brand..."
            className="w-full bg-neutral-50 border border-neutral-300 rounded-lg pl-9 pr-4 py-2 text-neutral-900 placeholder:text-neutral-400 text-xs focus:outline-none focus:border-yellow-400"
          />
          <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
        </div>

        <div className="flex items-center space-x-1.5 w-full sm:w-auto overflow-x-auto no-scrollbar pb-1 sm:pb-0 text-xs">
          {(
            [
              { key: 'ALL', label: 'All SKUs' },
              { key: 'LOW', label: 'Low Stock (≤5)' },
              { key: 'OUT', label: 'Out of Stock (0)' },
            ] as const
          ).map((filter) => (
            <button
              key={filter.key}
              onClick={() => setStatusFilter(filter.key)}
              className={`px-3 py-1.5 rounded-lg font-semibold whitespace-nowrap transition-all ${
                statusFilter === filter.key
                  ? 'bg-neutral-900 text-white shadow-sm'
                  : 'text-neutral-500 hover:text-neutral-900 bg-neutral-100 '
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      {/* TABLE */}
      <DataTable
        columns={columns}
        data={filtered}
        keyExtractor={(i) => i.sku}
        isLoading={isLoading}
        emptyTitle="NO SKUS MATCHING FILTER"
        emptySubtitle="Check your search spelling or reset stock availability filters."
      />

      {/* AUDIT HISTORY LOG MODAL */}
      <Modal
        isOpen={isLogModalOpen}
        onClose={() => setIsLogModalOpen(false)}
        title="Inventory Audit History Ledger"
        subtitle="Chronological record of stock adjustments, reason codes, and personnel actions."
        maxWidth="3xl"
      >
        <div className="divide-y divide-neutral-100 text-xs max-h-96 overflow-y-auto custom-scrollbar">
          {isLogsLoading ? (
            <div className="py-12 text-center text-neutral-400">Loading audit log records...</div>
          ) : logs.length === 0 ? (
            <div className="py-12 text-center text-neutral-400">
              No manual inventory adjustments recorded yet.
            </div>
          ) : (
            logs.map((log) => {
              const isIncrease = log.change > 0;
              return (
                <div key={log._id} className="py-3.5 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div
                      className={`p-2 rounded-lg ${
                        isIncrease
                          ? 'bg-emerald-500/10 text-emerald-500'
                          : 'bg-rose-500/10 text-rose-500'
                      }`}
                    >
                      {isIncrease ? (
                        <ArrowUpRight className="w-4 h-4" />
                      ) : (
                        <ArrowDownRight className="w-4 h-4" />
                      )}
                    </div>
                    <div>
                      <span className="font-mono font-bold text-neutral-900 block">
                        {log.sku}
                      </span>
                      <span className="text-[11px] text-neutral-500 ">
                        {log.reason || 'MANUAL_ADJUSTMENT'} • By {log.adminId?.name || 'Administrator'}
                      </span>
                    </div>
                  </div>

                  <div className="text-right">
                    <span
                      className={`font-mono font-bold block ${
                        isIncrease ? 'text-emerald-500' : 'text-rose-500'
                      }`}
                    >
                      {isIncrease ? `+${log.change}` : log.change} units
                    </span>
                    <span className="text-[10px] text-neutral-400 font-mono block">
                      {log.previousStock} → {log.newStock} units
                    </span>
                    <span className="text-[9px] text-neutral-500">
                      {new Date(log.createdAt).toLocaleString()}
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </Modal>
    </div>
  );
};

export default InventoryPage;
