import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Plus,
  Search,
  Trash2,
  Edit3,
  Copy,
  ExternalLink,
  Star,
} from 'lucide-react';
import adminApi from '../services/adminApi';
import { DataTable, Column } from '../components/DataTable';
import { StatusBadge } from '../components/StatusBadge';
import { ConfirmDialog } from '../components/ConfirmDialog';

export const ProductsListPage: React.FC = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Filters & Search state
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedStockStatus, setSelectedStockStatus] = useState('ALL');
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [sortBy, setSortBy] = useState('newest');
  const [page, setPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Dialog state
  const [deleteId, setDeleteId] = useState<string | null>(null);

  // Fetch Categories for filter dropdown
  const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const res = await adminApi.getCategories();
      return res.data?.data || [];
    },
  });

  // Fetch Products
  const { data: productResponse, isLoading } = useQuery({
    queryKey: ['adminProducts', search, selectedCategory, selectedStockStatus, selectedStatus, sortBy, page],
    queryFn: async () => {
      const res = await adminApi.getProducts({
        search,
        category: selectedCategory || undefined,
        stockStatus: selectedStockStatus,
        status: selectedStatus,
        sortBy,
        page,
        limit: 12,
      });
      return res.data;
    },
  });

  const products: any[] = productResponse?.data || [];
  const meta = productResponse?.meta || { total: 0, totalPages: 1 };

  // Delete Mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await adminApi.deleteProduct(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminProducts'] });
      queryClient.invalidateQueries({ queryKey: ['adminDashboard'] });
      setDeleteId(null);
    },
  });

  // Duplicate Mutation
  const duplicateMutation = useMutation({
    mutationFn: async (id: string) => {
      await adminApi.duplicateProduct(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminProducts'] });
      alert('Piece duplicated successfully.');
    },
  });

  // Bulk Actions Mutation
  const bulkMutation = useMutation({
    mutationFn: async (action: 'ACTIVATE' | 'DEACTIVATE' | 'DELETE') => {
      await adminApi.bulkProducts(selectedIds, action);
    },
    onSuccess: () => {
      setSelectedIds([]);
      queryClient.invalidateQueries({ queryKey: ['adminProducts'] });
    },
  });

  const columns: Column<any>[] = [
    {
      header: 'Fashion Piece',
      accessor: (p) => (
        <div className="flex items-center space-x-3">
          <img
            src={p.images?.[0] || 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800'}
            alt={p.title}
            className="w-10 h-12 object-cover rounded-md bg-neutral-100 border border-neutral-200 flex-shrink-0"
          />
          <div className="min-w-0">
            <span className="font-bold text-neutral-900 block truncate max-w-[220px]">
              {p.title}
            </span>
            <span className="text-[10px] text-neutral-400 font-mono block">
              {p.variants?.[0]?.sku || 'NO-SKU'}
            </span>
          </div>
        </div>
      ),
    },
    {
      header: 'Department',
      accessor: (p) => (
        <span className="text-neutral-600 font-medium">
          {typeof p.category === 'object' ? p.category.name : 'Ready-to-Wear'}
        </span>
      ),
    },
    {
      header: 'Brand / Label',
      accessor: (p) => (
        <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 font-mono">
          {p.brand}
        </span>
      ),
    },
    {
      header: 'Price Range',
      accessor: (p) => (
        <span className="font-serif-luxury font-bold text-neutral-900 ">
          ₹{p.minPrice?.toLocaleString('en-IN') || 0}
          {p.maxPrice && p.maxPrice > p.minPrice ? ` - ₹${p.maxPrice.toLocaleString('en-IN')}` : ''}
        </span>
      ),
    },
    {
      header: 'Variants & Stock',
      accessor: (p) => (
        <div className="space-y-0.5">
          <span className="font-mono text-xs font-semibold text-neutral-800 block">
            {p.totalStock} units
          </span>
          <span className="text-[10px] text-neutral-400">
            {p.skuCount || p.variants?.length || 0} SKUs
          </span>
        </div>
      ),
    },
    {
      header: 'Status',
      accessor: (p) => (
        <StatusBadge
          status={p.isActive ? (p.totalStock === 0 ? 'Out of Stock' : p.isLowStock ? 'Low Stock' : 'Active') : 'Draft'}
          type="stock"
        />
      ),
    },
    {
      header: 'Rating',
      accessor: (p) => (
        <div className="flex items-center space-x-1 text-yellow-600 ">
          <Star className="w-3.5 h-3.5 fill-current" />
          <span className="font-semibold text-neutral-800 ">
            {p.rating?.average?.toFixed(1) || '4.5'}
          </span>
          <span className="text-[10px] text-neutral-400">({p.rating?.count || 12})</span>
        </div>
      ),
    },
    {
      header: 'Actions',
      align: 'right',
      accessor: (p) => (
        <div className="flex items-center justify-end space-x-1">
          <a
            href={`/products/${p.slug}`}
            target="_blank"
            rel="noreferrer"
            className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-900 hover:bg-neutral-100 transition-colors"
            title="Preview on Storefront"
          >
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
          <button
            onClick={() => navigate(`/admin/products/edit/${p._id}`)}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-900 hover:bg-neutral-100 transition-colors"
            title="Edit Piece"
          >
            <Edit3 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => duplicateMutation.mutate(p._id)}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-900 hover:bg-neutral-100 transition-colors"
            title="Duplicate Piece"
          >
            <Copy className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setDeleteId(p._id)}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
            title="Delete Permanently"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-neutral-200 ">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-yellow-600 block mb-1">
            Atelier Catalog
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold font-serif-luxury text-neutral-900 uppercase tracking-tight">
            Products ({meta.total})
          </h1>
          <p className="text-xs text-neutral-500 mt-1">
            Maintain luxury garments, horology timepieces, accessories, specifications, and SKU matrices.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <Link
            to="/admin/products/create"
            className="bg-yellow-400 hover:bg-yellow-500 text-neutral-950 font-bold text-xs uppercase tracking-wider px-5 py-2.5 rounded-lg shadow-sm transition-colors flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Product</span>
          </Link>
        </div>
      </div>

      {/* FILTER & SEARCH CONTROLS */}
      <div className="p-4 rounded-xl bg-white border border-neutral-200 space-y-3 shadow-sm">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3">
          {/* Search */}
          <div className="relative lg:col-span-2">
            <input
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder="Search by title, SKU, or brand..."
              className="w-full bg-neutral-50 border border-neutral-300 rounded-lg pl-9 pr-4 py-2 text-neutral-900 placeholder:text-neutral-400 text-xs focus:outline-none focus:border-yellow-400"
            />
            <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
          </div>

          {/* Category Filter */}
          <div>
            <select
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value);
                setPage(1);
              }}
              className="w-full bg-neutral-50 border border-neutral-300 rounded-lg px-3 py-2 text-neutral-900 text-xs focus:outline-none focus:border-yellow-400"
            >
              <option value="">All Categories</option>
              {categories.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Stock Filter */}
          <div>
            <select
              value={selectedStockStatus}
              onChange={(e) => {
                setSelectedStockStatus(e.target.value);
                setPage(1);
              }}
              className="w-full bg-neutral-50 border border-neutral-300 rounded-lg px-3 py-2 text-neutral-900 text-xs focus:outline-none focus:border-yellow-400"
            >
              <option value="ALL">All Stock Levels</option>
              <option value="IN_STOCK">In Stock (&gt;15)</option>
              <option value="LOW_STOCK">Low Stock (≤15)</option>
              <option value="OUT_OF_STOCK">Out of Stock (0)</option>
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={selectedStatus}
              onChange={(e) => {
                setSelectedStatus(e.target.value);
                setPage(1);
              }}
              className="w-full bg-neutral-50 border border-neutral-300 rounded-lg px-3 py-2 text-neutral-900 text-xs focus:outline-none focus:border-yellow-400"
            >
              <option value="ALL">All Statuses</option>
              <option value="ACTIVE">Active (Published)</option>
              <option value="DRAFT">Draft</option>
            </select>
          </div>

          {/* Sort By */}
          <div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full bg-neutral-50 border border-neutral-300 rounded-lg px-3 py-2 text-neutral-900 text-xs focus:outline-none focus:border-yellow-400"
            >
              <option value="newest">Sort: Newest First</option>
              <option value="oldest">Sort: Oldest First</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="title_asc">Title: A to Z</option>
            </select>
          </div>
        </div>

        {/* Bulk Action Bar (when rows selected) */}
        {selectedIds.length > 0 && (
          <div className="flex items-center justify-between p-2.5 rounded-lg bg-yellow-400/15 border border-yellow-400/40 animate-in fade-in">
            <span className="text-xs font-semibold text-yellow-600 ">
              {selectedIds.length} fashion pieces selected
            </span>
            <div className="flex items-center space-x-2 text-xs">
              <button
                onClick={() => bulkMutation.mutate('ACTIVATE')}
                className="px-3 py-1 bg-white rounded font-semibold text-emerald-600 hover:shadow transition-all"
              >
                Publish All
              </button>
              <button
                onClick={() => bulkMutation.mutate('DEACTIVATE')}
                className="px-3 py-1 bg-white rounded font-semibold text-neutral-600 hover:shadow transition-all"
              >
                Archive to Draft
              </button>
              <button
                onClick={() => {
                  if (window.confirm(`Delete ${selectedIds.length} pieces permanently?`)) {
                    bulkMutation.mutate('DELETE');
                  }
                }}
                className="px-3 py-1 bg-rose-600 hover:bg-rose-500 text-white rounded font-bold uppercase text-[10px] transition-all"
              >
                Delete Selected
              </button>
            </div>
          </div>
        )}
      </div>

      {/* PRODUCTS TABLE */}
      <DataTable
        columns={columns}
        data={products}
        keyExtractor={(p) => p._id}
        isLoading={isLoading}
        emptyTitle="NO PRODUCTS FOUND"
        emptySubtitle="Try changing your filters or add your first piece to the AURELIUS atelier catalog."
        emptyAction={
          <Link
            to="/admin/products/create"
            className="inline-flex items-center space-x-2 bg-yellow-400 text-neutral-950 font-bold text-xs uppercase px-5 py-2.5 rounded-lg"
          >
            <Plus className="w-4 h-4" />
            <span>ADD PRODUCT</span>
          </Link>
        }
        selectable
        selectedIds={selectedIds}
        onSelectAll={(selected) => {
          setSelectedIds(selected ? products.map((p) => p._id) : []);
        }}
        onSelectItem={(id, selected) => {
          setSelectedIds((prev) =>
            selected ? [...prev, id] : prev.filter((i) => i !== id)
          );
        }}
        pagination={{
          currentPage: meta.page,
          totalPages: meta.totalPages,
          totalItems: meta.total,
          onPageChange: (p) => setPage(p),
        }}
      />

      {/* CONFIRM DELETE DIALOG */}
      <ConfirmDialog
        isOpen={Boolean(deleteId)}
        onClose={() => setDeleteId(null)}
        onConfirm={() => deleteId && deleteMutation.mutate(deleteId)}
        title="Delete Fashion Piece"
        message="Are you sure you wish to permanently remove this piece from the AURELIUS collection? This action cannot be reversed."
        confirmLabel="Delete Piece"
        isDestructive
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
};

export default ProductsListPage;
