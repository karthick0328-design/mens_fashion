import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Plus,
  Search,
  Trash2,
  X,
  ExternalLink,
} from 'lucide-react';
import api from '../../services/api';
import { IProduct, ICategory } from '../../types';

export const AdminProducts: React.FC = () => {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<IProduct | null>(null);

  // Form state
  const [formTitle, setFormTitle] = useState('');
  const [formBrand, setFormBrand] = useState('AURELIUS');
  const [formCategory, setFormCategory] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formImage, setFormImage] = useState('');
  const [formPrice, setFormPrice] = useState('999');
  const [formMrp, setFormMrp] = useState('1999');
  const [formStock, setFormStock] = useState('20');
  const [formColor, setFormColor] = useState('Midnight Black');
  const [formHex, setFormHex] = useState('#111827');

  // Fetch Categories
  const { data: categories = [] } = useQuery<ICategory[]>({
    queryKey: ['categories'],
    queryFn: async () => {
      const res = await api.get('/categories');
      return res.data?.data || [];
    },
  });

  // Fetch Admin Products
  const { data: productResponse, isLoading } = useQuery({
    queryKey: ['adminProducts', search, page],
    queryFn: async () => {
      const res = await api.get('/admin/products', {
        params: { search, page, limit: 10 },
      });
      return res.data;
    },
  });

  const products: IProduct[] = productResponse?.data || [];
  const meta = productResponse?.meta || { total: 0, totalPages: 1 };

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/admin/products/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminProducts'] });
      alert('Product deleted successfully');
    },
  });

  // Save product (create or update)
  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const priceNum = parseFloat(formPrice);
      const mrpNum = parseFloat(formMrp);
      const stockNum = parseInt(formStock, 10);
      const discountPercentage = Math.round(((mrpNum - priceNum) / mrpNum) * 100);

      const colorObj = {
        name: formColor,
        hex: formHex,
        images: [formImage],
      };

      const variants = ['S', 'M', 'L', 'XL'].map((sz) => ({
        sku: `${formBrand.slice(0, 3).toUpperCase()}-${Date.now().toString().slice(-4)}-${sz}`,
        color: colorObj,
        size: sz as any,
        price: priceNum,
        mrp: mrpNum,
        discountPercentage,
        stock: stockNum,
        isAvailable: stockNum > 0,
      }));

      const payload = {
        title: formTitle,
        brand: formBrand,
        category: formCategory || categories[0]?._id,
        description: formDescription,
        images: [formImage],
        colors: [colorObj],
        sizes: ['S', 'M', 'L', 'XL'],
        variants,
        specifications: {
          Fabric: '100% Premium Cotton',
          Fit: 'Tailored Slim Fit',
          Care: 'Dry Clean or Gentle Machine Wash',
        },
        isActive: true,
      };

      if (editingProduct) {
        await api.put(`/admin/products/${editingProduct._id}`, payload);
      } else {
        await api.post('/admin/products', payload);
      }

      setShowModal(false);
      setEditingProduct(null);
      queryClient.invalidateQueries({ queryKey: ['adminProducts'] });
      alert(editingProduct ? 'Product updated!' : 'New product created!');
    } catch (err: any) {
      alert(err.response?.data?.message || 'Error saving product');
    }
  };

  const openCreateModal = () => {
    setEditingProduct(null);
    setFormTitle('');
    setFormBrand('AURELIUS');
    setFormCategory(categories[0]?._id || '');
    setFormDescription('Contemporary luxury menswear piece tailored with meticulous precision.');
    setFormImage('https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800');
    setFormPrice('999');
    setFormMrp('1999');
    setFormStock('25');
    setFormColor('Midnight Black');
    setFormHex('#111827');
    setShowModal(true);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto text-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-amber-400 block mb-1">
            Catalog Management
          </span>
          <h1 className="text-2xl font-extrabold uppercase tracking-tight font-serif-luxury text-white">
            Products ({meta.total})
          </h1>
        </div>

        <button
          onClick={openCreateModal}
          className="bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold uppercase tracking-wider text-xs px-5 py-2.5 rounded-lg flex items-center space-x-2 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Product</span>
        </button>
      </div>

      {/* Search Input */}
      <div className="relative max-w-md">
        <input
          type="text"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          placeholder="Search by title, brand, or SKU..."
          className="w-full bg-neutral-950 border border-neutral-800 rounded-lg pl-9 pr-4 py-2 text-white placeholder:text-neutral-500 text-xs focus:outline-none focus:border-amber-400"
        />
        <Search className="w-4 h-4 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2" />
      </div>

      {/* Products Table */}
      <div className="bg-neutral-950 border border-neutral-800 rounded-xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-neutral-800 text-[10px] uppercase font-bold tracking-wider text-neutral-400 bg-neutral-900/60">
                <th className="py-3 px-4">Item</th>
                <th className="py-3 px-4">Brand</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Price</th>
                <th className="py-3 px-4">Variants & Stock</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-900 text-neutral-300">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-neutral-500">
                    Loading catalog...
                  </td>
                </tr>
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-neutral-500">
                    No products found.
                  </td>
                </tr>
              ) : (
                products.map((prod) => {
                  const totalStock = prod.variants?.reduce((sum, v) => sum + v.stock, 0) || 0;
                  const minPrice = prod.variants?.[0]?.price || 0;
                  return (
                    <tr key={prod._id} className="hover:bg-neutral-900/40 transition-colors">
                      <td className="py-3 px-4 flex items-center space-x-3">
                        <img
                          src={prod.images?.[0]}
                          alt={prod.title}
                          className="w-10 h-12 object-cover rounded bg-neutral-900 flex-shrink-0"
                        />
                        <span className="font-semibold text-white line-clamp-1 max-w-[200px]" title={prod.title}>
                          {prod.title}
                        </span>
                      </td>
                      <td className="py-3 px-4 uppercase font-bold text-neutral-400 text-[11px]">{prod.brand}</td>
                      <td className="py-3 px-4 text-neutral-400">
                        {typeof prod.category === 'object' ? prod.category.name : 'Category'}
                      </td>
                      <td className="py-3 px-4 font-bold text-white">₹{minPrice.toLocaleString('en-IN')}</td>
                      <td className="py-3 px-4">
                        <span className="font-mono text-neutral-200">
                          {prod.variants?.length || 0} SKUs ({totalStock} units)
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="bg-emerald-950 text-emerald-400 px-2 py-0.5 rounded text-[10px] font-bold">
                          ACTIVE
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right space-x-2">
                        <a
                          href={`/products/${prod.slug}`}
                          target="_blank"
                          rel="noreferrer"
                          className="p-1 text-neutral-400 hover:text-white inline-block"
                          title="View on store"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                        <button
                          onClick={() => {
                            if (window.confirm(`Delete "${prod.title}"?`)) {
                              deleteMutation.mutate(prod._id);
                            }
                          }}
                          className="p-1 text-neutral-400 hover:text-rose-500 inline-block"
                          title="Delete product"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {meta.totalPages > 1 && (
          <div className="p-4 border-t border-neutral-800 flex items-center justify-between text-neutral-400">
            <span>Page {meta.page} of {meta.totalPages}</span>
            <div className="space-x-2">
              <button
                disabled={page <= 1}
                onClick={() => setPage((p) => p - 1)}
                className="px-3 py-1 bg-neutral-900 border border-neutral-800 rounded text-neutral-300 disabled:opacity-40"
              >
                Prev
              </button>
              <button
                disabled={page >= meta.totalPages}
                onClick={() => setPage((p) => p + 1)}
                className="px-3 py-1 bg-neutral-900 border border-neutral-800 rounded text-neutral-300 disabled:opacity-40"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Add / Edit Product Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl max-w-2xl w-full p-6 text-white space-y-4 shadow-2xl my-8">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
              <h3 className="text-base font-bold uppercase tracking-wider font-serif-luxury text-amber-400">
                {editingProduct ? 'Edit Fashion Piece' : 'Create New Fashion Piece'}
              </h3>
              <button onClick={() => setShowModal(false)} className="text-neutral-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-300 font-semibold mb-1">Product Title</label>
                  <input
                    type="text"
                    required
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                    placeholder="e.g. AURELIUS Pima Cotton Crew Neck"
                    className="w-full bg-neutral-950 border border-neutral-800 rounded p-2 text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
                <div>
                  <label className="block text-neutral-300 font-semibold mb-1">Brand Name</label>
                  <input
                    type="text"
                    required
                    value={formBrand}
                    onChange={(e) => setFormBrand(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded p-2 text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-neutral-300 font-semibold mb-1">Category Department</label>
                <select
                  value={formCategory}
                  onChange={(e) => setFormCategory(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded p-2 text-white focus:outline-none focus:border-amber-400"
                >
                  {categories.map((c) => (
                    <option key={c._id} value={c._id}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-neutral-300 font-semibold mb-1">High-Res Image URL</label>
                <input
                  type="url"
                  required
                  value={formImage}
                  onChange={(e) => setFormImage(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full bg-neutral-950 border border-neutral-800 rounded p-2 text-white focus:outline-none focus:border-amber-400 font-mono text-[11px]"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-neutral-300 font-semibold mb-1">Price (₹)</label>
                  <input
                    type="number"
                    required
                    value={formPrice}
                    onChange={(e) => setFormPrice(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded p-2 text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
                <div>
                  <label className="block text-neutral-300 font-semibold mb-1">MRP (₹)</label>
                  <input
                    type="number"
                    required
                    value={formMrp}
                    onChange={(e) => setFormMrp(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded p-2 text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
                <div>
                  <label className="block text-neutral-300 font-semibold mb-1">Initial Stock per Size</label>
                  <input
                    type="number"
                    required
                    value={formStock}
                    onChange={(e) => setFormStock(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded p-2 text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-300 font-semibold mb-1">Color Name</label>
                  <input
                    type="text"
                    required
                    value={formColor}
                    onChange={(e) => setFormColor(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded p-2 text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
                <div>
                  <label className="block text-neutral-300 font-semibold mb-1">Color Hex</label>
                  <input
                    type="text"
                    required
                    value={formHex}
                    onChange={(e) => setFormHex(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded p-2 text-white focus:outline-none focus:border-amber-400 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-neutral-300 font-semibold mb-1">Description & Craft</label>
                <textarea
                  rows={3}
                  required
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded p-2 text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="pt-3 border-t border-neutral-800 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border border-neutral-800 rounded text-neutral-400 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-amber-500 text-neutral-950 rounded font-bold uppercase tracking-wider"
                >
                  Save Piece
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProducts;
