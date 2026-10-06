import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Edit2, Trash2, Image as ImageIcon } from 'lucide-react';
import adminApi from '../services/adminApi';
import { Modal } from '../components/Modal';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { ICategory } from '../../types';

export const CategoriesPage: React.FC = () => {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<'categories' | 'collections'>('categories');

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<ICategory | null>(null);
  const [deleteCatId, setDeleteCatId] = useState<string | null>(null);

  // Form states
  const [catName, setCatName] = useState('');
  const [catParent, setCatParent] = useState('');
  const [catImage, setCatImage] = useState('');
  const [catDescription, setCatDescription] = useState('');
  const [catSortOrder, setCatSortOrder] = useState('0');

  // Fetch Categories
  const { data: categories = [], isLoading } = useQuery<any[]>({
    queryKey: ['categoriesWithCount'],
    queryFn: async () => {
      const res = await adminApi.getCategories();
      return res.data?.data || [];
    },
  });

  // Fetch Collections
  const { data: collections = [] } = useQuery<any[]>({
    queryKey: ['collections'],
    queryFn: async () => {
      const res = await adminApi.getCollections();
      return res.data?.data || [];
    },
  });

  const parentCategories = categories.filter((c) => !c.parentCategory);

  const saveMutation = useMutation({
    mutationFn: async () => {
      const payload = {
        name: catName,
        parentCategory: catParent || null,
        image: catImage,
        description: catDescription,
        sortOrder: parseInt(catSortOrder, 10) || 0,
      };

      if (editingCategory) {
        return adminApi.updateCategory(editingCategory._id, payload);
      } else {
        return adminApi.createCategory(payload);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categoriesWithCount'] });
      setIsModalOpen(false);
      setEditingCategory(null);
    },
    onError: (err: any) => {
      alert(err.response?.data?.message || 'Error saving category');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await adminApi.deleteCategory(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categoriesWithCount'] });
      setDeleteCatId(null);
    },
    onError: (err: any) => {
      alert(err.response?.data?.message || 'Error deleting category');
    },
  });

  const handleOpenCreate = () => {
    setEditingCategory(null);
    setCatName('');
    setCatParent('');
    setCatImage('https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=800');
    setCatDescription('Curated sartorial department tailored for modern men.');
    setCatSortOrder('0');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (cat: any) => {
    setEditingCategory(cat);
    setCatName(cat.name);
    setCatParent(typeof cat.parentCategory === 'object' ? cat.parentCategory?._id : cat.parentCategory || '');
    setCatImage(cat.image || '');
    setCatDescription(cat.description || '');
    setCatSortOrder(String(cat.sortOrder || 0));
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-neutral-200 ">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-yellow-600 block mb-1">
            Department Architecture
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold font-serif-luxury text-neutral-900 uppercase tracking-tight">
            Categories & Collections
          </h1>
          <p className="text-xs text-neutral-500 mt-1">
            Organize main departments (Clothing, Watches, Footwear, Accessories) and seasonal runway collections.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="bg-yellow-400 hover:bg-yellow-500 text-neutral-950 font-bold text-xs uppercase tracking-wider px-5 py-2.5 rounded-lg shadow-sm transition-colors flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>New Department</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center space-x-2 overflow-x-auto no-scrollbar border-b border-neutral-200 pb-1 text-xs">
        <button
          onClick={() => setActiveTab('categories')}
          className={`px-4 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
            activeTab === 'categories'
              ? 'bg-neutral-900 text-white font-bold shadow-sm'
              : 'text-neutral-500 hover:text-neutral-900 '
          }`}
        >
          Store Departments ({categories.length})
        </button>
        <button
          onClick={() => setActiveTab('collections')}
          className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
            activeTab === 'collections'
              ? 'bg-neutral-900 text-white font-bold shadow-sm'
              : 'text-neutral-500 hover:text-neutral-900 '
          }`}
        >
          Curated Runway Collections ({collections.length})
        </button>
      </div>

      {/* CATEGORIES TAB */}
      {activeTab === 'categories' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {isLoading ? (
            <div className="col-span-full py-16 text-center text-neutral-400 text-xs">
              Loading department registry...
            </div>
          ) : (
            categories.map((cat) => (
              <div
                key={cat._id}
                className="bg-white border border-neutral-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all group flex flex-col justify-between"
              >
                <div>
                  <div className="relative h-40 bg-neutral-100 overflow-hidden">
                    {cat.image ? (
                      <img
                        src={cat.image}
                        alt={cat.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-neutral-400">
                        <ImageIcon className="w-8 h-8" />
                      </div>
                    )}
                    <span className="absolute top-2.5 right-2.5 px-2.5 py-1 rounded bg-black/75 backdrop-blur-sm text-white font-mono text-[10px] font-bold">
                      {cat.productCount || 0} Pieces
                    </span>
                  </div>

                  <div className="p-5 space-y-2">
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-yellow-600 block">
                          {cat.parentCategory ? 'Sub-Department' : 'Primary Department'}
                        </span>
                        <h3 className="text-base font-bold font-serif-luxury text-neutral-900 ">
                          {cat.name}
                        </h3>
                      </div>
                    </div>

                    <p className="text-xs text-neutral-500 line-clamp-2 leading-relaxed">
                      {cat.description || 'Exclusive menswear curation from the atelier.'}
                    </p>
                  </div>
                </div>

                <div className="px-5 py-3 border-t border-neutral-100 flex items-center justify-between bg-neutral-50/50 ">
                  <span className="text-[10px] font-mono text-neutral-400">
                    Sort #{cat.sortOrder || 0}
                  </span>
                  <div className="flex items-center space-x-1">
                    <button
                      onClick={() => handleOpenEdit(cat)}
                      className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-900 transition-colors"
                      title="Edit Department"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setDeleteCatId(cat._id)}
                      className="p-1.5 rounded-lg text-neutral-400 hover:text-rose-600 transition-colors"
                      title="Delete Department"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* COLLECTIONS TAB */}
      {activeTab === 'collections' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {collections.map((col: any) => (
            <div
              key={col.id}
              className="bg-white border border-neutral-200 rounded-xl p-6 shadow-sm space-y-4 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between pb-2 border-b border-neutral-100 ">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-yellow-600 ">
                    {col.tag}
                  </span>
                  <span className="text-[10px] font-semibold text-emerald-600 ">
                    {col.status}
                  </span>
                </div>

                <h3 className="text-base font-bold font-serif-luxury text-neutral-900 mt-3">
                  {col.name}
                </h3>
                <p className="text-xs text-neutral-500 mt-1 leading-relaxed">
                  {col.description}
                </p>
              </div>

              <div className="pt-4 border-t border-neutral-100 flex items-center justify-between text-xs font-semibold">
                <span className="text-neutral-400 font-mono">{col.curatedDate}</span>
                <span className="text-neutral-900 font-bold">{col.itemCount} Curated Pieces</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* CREATE / EDIT CATEGORY MODAL */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingCategory ? 'Edit Department' : 'Create Department'}
        subtitle="Maintain departmental hierarchy and editorial catalog display."
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            saveMutation.mutate();
          }}
          className="space-y-4 text-xs"
        >
          <div>
            <label className="block text-neutral-700 font-semibold mb-1">
              Department Name <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={catName}
              onChange={(e) => setCatName(e.target.value)}
              placeholder="e.g. Bespoke Tailoring, Horology, Silk Ties"
              className="w-full bg-neutral-50 border border-neutral-300 rounded-lg p-2.5 text-neutral-900 focus:outline-none focus:border-yellow-400"
            />
          </div>

          <div>
            <label className="block text-neutral-700 font-semibold mb-1">
              Parent Department (Leave blank for top-level department)
            </label>
            <select
              value={catParent}
              onChange={(e) => setCatParent(e.target.value)}
              className="w-full bg-neutral-50 border border-neutral-300 rounded-lg p-2.5 text-neutral-900 focus:outline-none focus:border-yellow-400"
            >
              <option value="">None (Top-Level Department)</option>
              {parentCategories
                .filter((p) => p._id !== editingCategory?._id)
                .map((p) => (
                  <option key={p._id} value={p._id}>
                    {p.name}
                  </option>
                ))}
            </select>
          </div>

          <div>
            <label className="block text-neutral-700 font-semibold mb-1">
              Cover Image URL
            </label>
            <input
              type="url"
              value={catImage}
              onChange={(e) => setCatImage(e.target.value)}
              placeholder="https://images.unsplash.com/..."
              className="w-full bg-neutral-50 border border-neutral-300 rounded-lg p-2.5 text-neutral-900 font-mono text-[11px] focus:outline-none focus:border-yellow-400"
            />
          </div>

          <div>
            <label className="block text-neutral-700 font-semibold mb-1">
              Description
            </label>
            <textarea
              rows={3}
              value={catDescription}
              onChange={(e) => setCatDescription(e.target.value)}
              className="w-full bg-neutral-50 border border-neutral-300 rounded-lg p-2.5 text-neutral-900 focus:outline-none focus:border-yellow-400"
            />
          </div>

          <div>
            <label className="block text-neutral-700 font-semibold mb-1">
              Sort Sequence Order
            </label>
            <input
              type="number"
              value={catSortOrder}
              onChange={(e) => setCatSortOrder(e.target.value)}
              className="w-full bg-neutral-50 border border-neutral-300 rounded-lg p-2.5 text-neutral-900 font-mono focus:outline-none focus:border-yellow-400"
            />
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
              className="px-6 py-2 bg-yellow-400 text-neutral-950 rounded-lg font-bold uppercase tracking-wider disabled:opacity-50"
            >
              {saveMutation.isPending ? 'Saving...' : 'Save Department'}
            </button>
          </div>
        </form>
      </Modal>

      {/* CONFIRM DELETE DIALOG */}
      <ConfirmDialog
        isOpen={Boolean(deleteCatId)}
        onClose={() => setDeleteCatId(null)}
        onConfirm={() => deleteCatId && deleteMutation.mutate(deleteCatId)}
        title="Delete Department"
        message="Are you sure you wish to delete this department? Any subcategories or linked products should be reassigned first."
        confirmLabel="Delete Department"
        isDestructive
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
};

export default CategoriesPage;
