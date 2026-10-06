import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ArrowLeft, Plus, Trash2, Save } from 'lucide-react';
import adminApi from '../services/adminApi';
import { ProductSize, PRODUCT_SIZES } from '../../types';

export const ProductFormPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const isEditing = Boolean(id);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Tab section state
  const [activeTab, setActiveTab] = useState<
    'basic' | 'media' | 'pricing' | 'variants' | 'inventory' | 'seo' | 'publishing'
  >('basic');

  // Form states
  const [title, setTitle] = useState('');
  const [brand, setBrand] = useState('AURELIUS');
  const [category, setCategory] = useState('');
  const [subCategory, setSubCategory] = useState('');
  const [shortDescription, setShortDescription] = useState('');
  const [description, setDescription] = useState('');

  // Media
  const [mainImage, setMainImage] = useState('https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800');
  const [galleryImages, setGalleryImages] = useState<string[]>([
    'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800',
    'https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?w=800',
  ]);
  const [newImageUrl, setNewImageUrl] = useState('');

  // Pricing
  const [sellingPrice, setSellingPrice] = useState('2499');
  const [originalPrice, setOriginalPrice] = useState('4999');
  const [costPrice, setCostPrice] = useState('1100');
  const [taxRate, setTaxRate] = useState('12');

  // Variants
  const [variants, setVariants] = useState<
    Array<{
      size: ProductSize;
      colorName: string;
      colorHex: string;
      sku: string;
      price: number;
      stock: number;
      material: string;
    }>
  >([
    { size: 'S', colorName: 'Midnight Black', colorHex: '#111827', sku: 'AUR-S-BLK', price: 2499, stock: 20, material: 'Egyptian Cotton' },
    { size: 'M', colorName: 'Midnight Black', colorHex: '#111827', sku: 'AUR-M-BLK', price: 2499, stock: 15, material: 'Egyptian Cotton' },
    { size: 'L', colorName: 'Midnight Black', colorHex: '#111827', sku: 'AUR-L-BLK', price: 2499, stock: 8, material: 'Egyptian Cotton' },
  ]);

  // Inventory & Warehouse
  const [lowStockThreshold, setLowStockThreshold] = useState('5');
  const [warehouse, setWarehouse] = useState('Mumbai Atelier Central');

  // SEO
  const [seoTitle, setSeoTitle] = useState('');
  const [metaDescription, setMetaDescription] = useState('');
  const [keywords, setKeywords] = useState('menswear, luxury, atelier, tailored, aurelius');

  // Publishing
  const [publishingStatus, setPublishingStatus] = useState<'PUBLISHED' | 'DRAFT' | 'ARCHIVED'>('PUBLISHED');
  const [isFeatured, setIsFeatured] = useState(false);

  // Fetch Categories
  const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const res = await adminApi.getCategories();
      return res.data?.data || [];
    },
  });

  // Fetch Product if editing
  const { data: existingProduct } = useQuery({
    queryKey: ['adminProductDetail', id],
    queryFn: async () => {
      if (!id) return null;
      const res = await adminApi.getProductById(id);
      return res.data?.data;
    },
    enabled: isEditing,
  });

  useEffect(() => {
    if (existingProduct) {
      setTitle(existingProduct.title || '');
      setBrand(existingProduct.brand || 'AURELIUS');
      setCategory(typeof existingProduct.category === 'object' ? existingProduct.category._id : existingProduct.category || '');
      setSubCategory(typeof existingProduct.subCategory === 'object' ? existingProduct.subCategory._id : existingProduct.subCategory || '');
      setDescription(existingProduct.description || '');
      if (existingProduct.images && existingProduct.images.length > 0) {
        setMainImage(existingProduct.images[0]);
        setGalleryImages(existingProduct.images);
      }
      if (existingProduct.variants && existingProduct.variants.length > 0) {
        const first = existingProduct.variants[0];
        setSellingPrice(String(first.price || '2499'));
        setOriginalPrice(String(first.mrp || '4999'));
        setVariants(
          existingProduct.variants.map((v: any) => ({
            size: v.size,
            colorName: v.color?.name || 'Default',
            colorHex: v.color?.hex || '#111827',
            sku: v.sku,
            price: v.price,
            stock: v.stock,
            material: 'Pima Cotton & Silk Blend',
          }))
        );
      }
      setPublishingStatus(existingProduct.isActive ? 'PUBLISHED' : 'DRAFT');
      setIsFeatured(Boolean(existingProduct.isFeatured));
      setSeoTitle(existingProduct.title);
      setMetaDescription(existingProduct.description.slice(0, 150));
    } else if (categories.length > 0 && !category) {
      setCategory(categories[0]._id);
    }
  }, [existingProduct, categories]);

  // Mutations
  const saveMutation = useMutation({
    mutationFn: async (publishOverride?: boolean) => {
      const numSelling = parseFloat(sellingPrice) || 2499;
      const numOriginal = parseFloat(originalPrice) || 4999;
      const discountPercentage = Math.max(0, Math.round(((numOriginal - numSelling) / numOriginal) * 100));

      const processedVariants = variants.map((v) => ({
        sku: v.sku,
        color: {
          name: v.colorName,
          hex: v.colorHex,
          images: [mainImage],
        },
        size: v.size,
        price: v.price || numSelling,
        mrp: numOriginal,
        discountPercentage,
        stock: v.stock || 0,
        isAvailable: (v.stock || 0) > 0,
      }));

      const payload = {
        title: title || 'AURELIUS Atelier Piece',
        brand,
        category: category || categories[0]?._id,
        subCategory: subCategory || null,
        description: description || 'Meticulously tailored garment from the AURELIUS atelier.',
        images: galleryImages.length > 0 ? galleryImages : [mainImage],
        colors: [
          {
            name: variants[0]?.colorName || 'Midnight Black',
            hex: variants[0]?.colorHex || '#111827',
            images: galleryImages,
          },
        ],
        sizes: Array.from(new Set(variants.map((v) => v.size))),
        variants: processedVariants,
        specifications: {
          Fabric: '100% Superfine Cotton / Silk Weave',
          Fit: 'Sartorial Tailored Fit',
          Origin: 'Handcrafted in Atelier',
        },
        tags: keywords.split(',').map((k) => k.trim()).filter(Boolean),
        isFeatured,
        isActive: publishOverride !== undefined ? publishOverride : publishingStatus === 'PUBLISHED',
      };

      if (isEditing && id) {
        return adminApi.updateProduct(id, payload);
      } else {
        return adminApi.createProduct(payload);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminProducts'] });
      queryClient.invalidateQueries({ queryKey: ['adminDashboard'] });
      navigate('/admin/products');
    },
    onError: (err: any) => {
      alert(err.response?.data?.message || 'Error saving piece');
    },
  });

  const handleAddGalleryImage = () => {
    if (newImageUrl.trim()) {
      setGalleryImages((prev) => [...prev, newImageUrl.trim()]);
      setNewImageUrl('');
    }
  };

  const handleRemoveGalleryImage = (index: number) => {
    setGalleryImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleAddVariantRow = () => {
    const nextSize: ProductSize = 'XL';
    setVariants((prev) => [
      ...prev,
      {
        size: nextSize,
        colorName: 'Midnight Black',
        colorHex: '#111827',
        sku: `AUR-${nextSize}-${Date.now().toString().slice(-4)}`,
        price: parseFloat(sellingPrice) || 2499,
        stock: 10,
        material: '100% Superfine Cotton',
      },
    ]);
  };

  const handleRemoveVariantRow = (index: number) => {
    setVariants((prev) => prev.filter((_, i) => i !== index));
  };

  const tabs = [
    { id: 'basic', label: '1. Basic Info' },
    { id: 'media', label: '2. Media & Visuals' },
    { id: 'pricing', label: '3. Pricing' },
    { id: 'variants', label: '4. Variants Matrix' },
    { id: 'inventory', label: '5. Inventory & Stocks' },
    { id: 'seo', label: '6. SEO & Meta' },
    { id: 'publishing', label: '7. Publishing' },
  ] as const;

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-16">
      {/* Back button and page title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-neutral-200 ">
        <div className="flex items-center space-x-3">
          <button
            onClick={() => navigate('/admin/products')}
            className="p-2 rounded-lg border border-neutral-200 text-neutral-400 hover:text-neutral-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-yellow-600 block">
              Atelier Product Architect
            </span>
            <h1 className="text-2xl font-bold font-serif-luxury text-neutral-900 uppercase tracking-tight">
              {isEditing ? `Edit Piece: ${title || 'Fashion Item'}` : 'Craft New Fashion Piece'}
            </h1>
          </div>
        </div>

        {/* Global Save Buttons */}
        <div className="flex items-center space-x-3">
          <button
            type="button"
            disabled={saveMutation.isPending}
            onClick={() => saveMutation.mutate(false)}
            className="px-4 py-2.5 rounded-lg border border-neutral-300 font-semibold text-xs text-neutral-700 hover:bg-neutral-100 transition-colors uppercase tracking-wider"
          >
            Save Draft
          </button>
          <button
            type="button"
            disabled={saveMutation.isPending}
            onClick={() => saveMutation.mutate(true)}
            className="px-6 py-2.5 rounded-lg bg-yellow-400 hover:bg-yellow-500 text-neutral-950 font-bold text-xs uppercase tracking-wider shadow-sm transition-colors flex items-center space-x-2"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{saveMutation.isPending ? 'Publishing...' : 'Publish Piece'}</span>
          </button>
        </div>
      </div>

      {/* TABS NAVIGATION */}
      <div className="flex items-center space-x-2 overflow-x-auto no-scrollbar border-b border-neutral-200 pb-1">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-3.5 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
              activeTab === tab.id
                ? 'bg-neutral-900 text-white font-bold shadow-sm'
                : 'text-neutral-500 hover:text-neutral-900 '
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* TAB 1: BASIC INFORMATION */}
      {activeTab === 'basic' && (
        <div className="bg-white border border-neutral-200 rounded-xl p-6 space-y-4 shadow-sm">
          <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-900 font-serif-luxury pb-2 border-b border-neutral-100 ">
            Section 1: Basic Information
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="sm:col-span-2">
              <label className="block text-neutral-700 font-semibold mb-1">
                Product Title <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. AURELIUS Double-Breasted Cashmere Peacoat"
                className="w-full bg-neutral-50 border border-neutral-300 rounded-lg p-2.5 text-neutral-900 focus:outline-none focus:border-yellow-400"
              />
            </div>

            <div>
              <label className="block text-neutral-700 font-semibold mb-1">
                Brand / Atelier Label
              </label>
              <input
                type="text"
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                className="w-full bg-neutral-50 border border-neutral-300 rounded-lg p-2.5 text-neutral-900 focus:outline-none focus:border-yellow-400"
              />
            </div>

            <div>
              <label className="block text-neutral-700 font-semibold mb-1">
                Department Category <span className="text-rose-500">*</span>
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-neutral-50 border border-neutral-300 rounded-lg p-2.5 text-neutral-900 focus:outline-none focus:border-yellow-400"
              >
                {categories.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-neutral-700 font-semibold mb-1">
                Short Atelier Synopsis
              </label>
              <input
                type="text"
                value={shortDescription}
                onChange={(e) => setShortDescription(e.target.value)}
                placeholder="Brief high-fashion one-liner summarizing the silhouette and drape..."
                className="w-full bg-neutral-50 border border-neutral-300 rounded-lg p-2.5 text-neutral-900 focus:outline-none focus:border-yellow-400"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-neutral-700 font-semibold mb-1">
                Full Sartorial Description & Craftsmanship Details
              </label>
              <textarea
                rows={5}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe the fabric provenance, button construction, shoulder padding, and tailored fit..."
                className="w-full bg-neutral-50 border border-neutral-300 rounded-lg p-2.5 text-neutral-900 focus:outline-none focus:border-yellow-400 leading-relaxed"
              />
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: PRODUCT MEDIA */}
      {activeTab === 'media' && (
        <div className="bg-white border border-neutral-200 rounded-xl p-6 space-y-5 shadow-sm">
          <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-900 font-serif-luxury pb-2 border-b border-neutral-100 ">
            Section 2: High-Resolution Visuals
          </h3>

          <div className="space-y-4 text-xs">
            <div>
              <label className="block text-neutral-700 font-semibold mb-1">
                Primary Hero Image URL
              </label>
              <input
                type="url"
                value={mainImage}
                onChange={(e) => setMainImage(e.target.value)}
                className="w-full bg-neutral-50 border border-neutral-300 rounded-lg p-2.5 text-neutral-900 font-mono text-[11px] focus:outline-none focus:border-yellow-400"
              />
            </div>

            <div>
              <label className="block text-neutral-700 font-semibold mb-1">
                Add Image to Gallery URL
              </label>
              <div className="flex gap-2">
                <input
                  type="url"
                  value={newImageUrl}
                  onChange={(e) => setNewImageUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="flex-1 bg-neutral-50 border border-neutral-300 rounded-lg p-2.5 text-neutral-900 font-mono text-[11px] focus:outline-none focus:border-yellow-400"
                />
                <button
                  type="button"
                  onClick={handleAddGalleryImage}
                  className="px-4 py-2 bg-neutral-900 text-white font-bold uppercase text-[10px] rounded-lg tracking-wider"
                >
                  Add Image
                </button>
              </div>
            </div>

            {/* Gallery Grid */}
            <div className="pt-2">
              <span className="block text-neutral-500 font-semibold mb-2">
                Gallery Previews ({galleryImages.length} images)
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {galleryImages.map((img, idx) => (
                  <div
                    key={idx}
                    className="relative group rounded-xl overflow-hidden border border-neutral-200 aspect-[3/4] bg-neutral-100 shadow-sm"
                  >
                    <img src={img} alt="Gallery" className="w-full h-full object-cover" />
                    {idx === 0 && (
                      <span className="absolute top-2 left-2 bg-yellow-400 text-neutral-950 font-bold text-[9px] uppercase px-2 py-0.5 rounded shadow">
                        Cover Image
                      </span>
                    )}
                    <button
                      type="button"
                      onClick={() => handleRemoveGalleryImage(idx)}
                      className="absolute top-2 right-2 p-1.5 bg-black/70 hover:bg-rose-600 text-white rounded-md opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: PRICING */}
      {activeTab === 'pricing' && (
        <div className="bg-white border border-neutral-200 rounded-xl p-6 space-y-4 shadow-sm">
          <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-900 font-serif-luxury pb-2 border-b border-neutral-100 ">
            Section 3: Sartorial Pricing & Tax
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block text-neutral-700 font-semibold mb-1">
                Selling Price (₹) <span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                value={sellingPrice}
                onChange={(e) => setSellingPrice(e.target.value)}
                className="w-full bg-neutral-50 border border-neutral-300 rounded-lg p-2.5 text-neutral-900 font-mono font-bold focus:outline-none focus:border-yellow-400"
              />
            </div>

            <div>
              <label className="block text-neutral-700 font-semibold mb-1">
                Original MRP (₹)
              </label>
              <input
                type="number"
                value={originalPrice}
                onChange={(e) => setOriginalPrice(e.target.value)}
                className="w-full bg-neutral-50 border border-neutral-300 rounded-lg p-2.5 text-neutral-900 font-mono focus:outline-none focus:border-yellow-400"
              />
            </div>

            <div>
              <label className="block text-neutral-700 font-semibold mb-1">
                Cost Price (₹) (Confidential)
              </label>
              <input
                type="number"
                value={costPrice}
                onChange={(e) => setCostPrice(e.target.value)}
                className="w-full bg-neutral-50 border border-neutral-300 rounded-lg p-2.5 text-neutral-900 font-mono focus:outline-none focus:border-yellow-400"
              />
            </div>

            <div>
              <label className="block text-neutral-700 font-semibold mb-1">
                GST / Tax Percentage (%)
              </label>
              <input
                type="number"
                value={taxRate}
                onChange={(e) => setTaxRate(e.target.value)}
                className="w-full bg-neutral-50 border border-neutral-300 rounded-lg p-2.5 text-neutral-900 font-mono focus:outline-none focus:border-yellow-400"
              />
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: VARIANTS MATRIX */}
      {activeTab === 'variants' && (
        <div className="bg-white border border-neutral-200 rounded-xl p-6 space-y-4 shadow-sm">
          <div className="flex items-center justify-between pb-2 border-b border-neutral-100 ">
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-900 font-serif-luxury">
                Section 4: Variants Matrix
              </h3>
              <p className="text-xs text-neutral-500 ">
                Configure size, color, individual SKU codes, and variant stocks.
              </p>
            </div>
            <button
              type="button"
              onClick={handleAddVariantRow}
              className="px-3 py-1.5 bg-yellow-400 text-neutral-950 font-bold uppercase text-[10px] rounded-lg tracking-wider flex items-center space-x-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Variant SKU</span>
            </button>
          </div>

          <div className="overflow-x-auto text-xs">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-neutral-200 text-[10px] uppercase font-bold text-neutral-400">
                  <th className="py-2 px-3 text-left">Size</th>
                  <th className="py-2 px-3 text-left">Color</th>
                  <th className="py-2 px-3 text-left">SKU Code</th>
                  <th className="py-2 px-3 text-left">Price (₹)</th>
                  <th className="py-2 px-3 text-left">Stock</th>
                  <th className="py-2 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 ">
                {variants.map((v, idx) => (
                  <tr key={idx}>
                    <td className="py-2.5 px-3">
                      <select
                        value={v.size}
                        onChange={(e) => {
                          const val = e.target.value as ProductSize;
                          setVariants((prev) =>
                            prev.map((item, i) => (i === idx ? { ...item, size: val } : item))
                          );
                        }}
                        className="bg-neutral-50 border border-neutral-300 rounded px-2 py-1 text-neutral-900 font-bold"
                      >
                        {PRODUCT_SIZES.map((sz) => (
                          <option key={sz} value={sz}>{sz}</option>
                        ))}
                      </select>
                    </td>

                    <td className="py-2.5 px-3">
                      <input
                        type="text"
                        value={v.colorName}
                        onChange={(e) => {
                          const val = e.target.value;
                          setVariants((prev) =>
                            prev.map((item, i) => (i === idx ? { ...item, colorName: val } : item))
                          );
                        }}
                        className="w-28 bg-neutral-50 border border-neutral-300 rounded px-2 py-1 text-neutral-900 font-medium"
                      />
                    </td>

                    <td className="py-2.5 px-3">
                      <input
                        type="text"
                        value={v.sku}
                        onChange={(e) => {
                          const val = e.target.value;
                          setVariants((prev) =>
                            prev.map((item, i) => (i === idx ? { ...item, sku: val } : item))
                          );
                        }}
                        className="w-32 bg-neutral-50 border border-neutral-300 rounded px-2 py-1 text-neutral-900 font-mono font-bold"
                      />
                    </td>

                    <td className="py-2.5 px-3">
                      <input
                        type="number"
                        value={v.price}
                        onChange={(e) => {
                          const val = parseFloat(e.target.value) || 0;
                          setVariants((prev) =>
                            prev.map((item, i) => (i === idx ? { ...item, price: val } : item))
                          );
                        }}
                        className="w-24 bg-neutral-50 border border-neutral-300 rounded px-2 py-1 text-neutral-900 font-mono"
                      />
                    </td>

                    <td className="py-2.5 px-3">
                      <input
                        type="number"
                        value={v.stock}
                        onChange={(e) => {
                          const val = parseInt(e.target.value, 10) || 0;
                          setVariants((prev) =>
                            prev.map((item, i) => (i === idx ? { ...item, stock: val } : item))
                          );
                        }}
                        className="w-20 bg-neutral-50 border border-neutral-300 rounded px-2 py-1 text-neutral-900 font-mono font-bold"
                      />
                    </td>

                    <td className="py-2.5 px-3 text-right">
                      <button
                        type="button"
                        onClick={() => handleRemoveVariantRow(idx)}
                        disabled={variants.length <= 1}
                        className="p-1 text-neutral-400 hover:text-rose-500 disabled:opacity-20"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 5: INVENTORY & WAREHOUSE */}
      {activeTab === 'inventory' && (
        <div className="bg-white border border-neutral-200 rounded-xl p-6 space-y-4 shadow-sm">
          <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-900 font-serif-luxury pb-2 border-b border-neutral-100 ">
            Section 5: Inventory & Warehouse Configuration
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-neutral-700 font-semibold mb-1">
                Low Stock Threshold (Alert triggered when stock ≤ this number)
              </label>
              <input
                type="number"
                value={lowStockThreshold}
                onChange={(e) => setLowStockThreshold(e.target.value)}
                className="w-full bg-neutral-50 border border-neutral-300 rounded-lg p-2.5 text-neutral-900 font-mono focus:outline-none focus:border-yellow-400"
              />
            </div>

            <div>
              <label className="block text-neutral-700 font-semibold mb-1">
                Fulfillment Hub / Warehouse
              </label>
              <select
                value={warehouse}
                onChange={(e) => setWarehouse(e.target.value)}
                className="w-full bg-neutral-50 border border-neutral-300 rounded-lg p-2.5 text-neutral-900 focus:outline-none focus:border-yellow-400"
              >
                <option value="Mumbai Atelier Central">Mumbai Atelier Central</option>
                <option value="Bengaluru Sartorial Warehouse">Bengaluru Sartorial Warehouse</option>
                <option value="Delhi NCR Luxury Vault">Delhi NCR Luxury Vault</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* TAB 6: SEO */}
      {activeTab === 'seo' && (
        <div className="bg-white border border-neutral-200 rounded-xl p-6 space-y-4 shadow-sm">
          <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-900 font-serif-luxury pb-2 border-b border-neutral-100 ">
            Section 6: Search Engine Optimization & Social Sharing
          </h3>

          <div className="space-y-4 text-xs">
            <div>
              <label className="block text-neutral-700 font-semibold mb-1">
                SEO Meta Title
              </label>
              <input
                type="text"
                value={seoTitle}
                onChange={(e) => setSeoTitle(e.target.value)}
                placeholder="AURELIUS | Handcrafted Luxury Menswear"
                className="w-full bg-neutral-50 border border-neutral-300 rounded-lg p-2.5 text-neutral-900 focus:outline-none focus:border-yellow-400"
              />
            </div>

            <div>
              <label className="block text-neutral-700 font-semibold mb-1">
                Meta Description
              </label>
              <textarea
                rows={3}
                value={metaDescription}
                onChange={(e) => setMetaDescription(e.target.value)}
                placeholder="High-conversion editorial summary displayed on Google search results..."
                className="w-full bg-neutral-50 border border-neutral-300 rounded-lg p-2.5 text-neutral-900 focus:outline-none focus:border-yellow-400"
              />
            </div>

            <div>
              <label className="block text-neutral-700 font-semibold mb-1">
                Catalog Keywords / Tags (comma separated)
              </label>
              <input
                type="text"
                value={keywords}
                onChange={(e) => setKeywords(e.target.value)}
                className="w-full bg-neutral-50 border border-neutral-300 rounded-lg p-2.5 text-neutral-900 focus:outline-none focus:border-yellow-400"
              />
            </div>
          </div>
        </div>
      )}

      {/* TAB 7: PUBLISHING */}
      {activeTab === 'publishing' && (
        <div className="bg-white border border-neutral-200 rounded-xl p-6 space-y-4 shadow-sm">
          <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-900 font-serif-luxury pb-2 border-b border-neutral-100 ">
            Section 7: Publishing & Status Controls
          </h3>

          <div className="space-y-4 text-xs">
            <div>
              <label className="block text-neutral-700 font-semibold mb-2">
                Visibility State
              </label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { id: 'PUBLISHED', label: 'Published (Live on Atelier)' },
                  { id: 'DRAFT', label: 'Draft (Personnel Only)' },
                  { id: 'ARCHIVED', label: 'Archived (Hidden)' },
                ].map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => setPublishingStatus(s.id as any)}
                    className={`p-3 rounded-lg border text-left font-semibold transition-all ${
                      publishingStatus === s.id
                        ? 'border-yellow-400 bg-yellow-400/15 text-yellow-600 '
                        : 'border-neutral-200 text-neutral-600 '
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center space-x-3 pt-3">
              <input
                type="checkbox"
                id="isFeatured"
                checked={isFeatured}
                onChange={(e) => setIsFeatured(e.target.checked)}
                className="rounded border-neutral-300 text-yellow-600 focus:ring-yellow-400 cursor-pointer"
              />
              <label htmlFor="isFeatured" className="text-xs font-semibold text-neutral-800 cursor-pointer">
                Feature in Homepage Atelier Spotlight collection
              </label>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductFormPage;
