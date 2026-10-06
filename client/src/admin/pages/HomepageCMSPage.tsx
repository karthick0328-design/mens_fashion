import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Edit2, Trash2, Eye, ExternalLink } from 'lucide-react';
import adminApi from '../services/adminApi';
import { Modal } from '../components/Modal';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { ICMSBanner } from '../types/admin';

export const HomepageCMSPage: React.FC = () => {
  const queryClient = useQueryClient();
  const [selectedSectionType, setSelectedSectionType] = useState<string>('ALL');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState<ICMSBanner | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [previewBanner, setPreviewBanner] = useState<ICMSBanner | null>(null);

  // Form states
  const [sectionType, setSectionType] = useState<any>('HERO');
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [description, setDescription] = useState('');
  const [desktopImage, setDesktopImage] = useState('');
  const [mobileImage, setMobileImage] = useState('');
  const [ctaText, setCtaText] = useState('EXPLORE COLLECTION');
  const [ctaLink, setCtaLink] = useState('/products');
  const [badgeText, setBadgeText] = useState('');
  const [sortOrder, setSortOrder] = useState('1');

  const { data: banners = [], isLoading } = useQuery<ICMSBanner[]>({
    queryKey: ['adminCMSBanners'],
    queryFn: async () => {
      const res = await adminApi.getCMSBanners();
      return res.data?.data || [];
    },
  });

  const saveMutation = useMutation({
    mutationFn: async () => {
      const payload = {
        sectionType,
        title,
        subtitle,
        description,
        desktopImage,
        mobileImage: mobileImage || desktopImage,
        ctaText,
        ctaLink,
        badgeText,
        sortOrder: parseInt(sortOrder, 10) || 0,
        isActive: true,
      };

      if (editingBanner) {
        return adminApi.updateCMSBanner(editingBanner._id, payload);
      } else {
        return adminApi.createCMSBanner(payload);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminCMSBanners'] });
      setIsModalOpen(false);
      setEditingBanner(null);
    },
    onError: (err: any) => {
      alert(err.response?.data?.message || 'Error saving CMS banner');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return adminApi.deleteCMSBanner(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminCMSBanners'] });
      setDeleteId(null);
    },
  });

  const toggleActiveMutation = useMutation({
    mutationFn: async ({ id, isActive }: { id: string; isActive: boolean }) => {
      return adminApi.updateCMSBanner(id, { isActive });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminCMSBanners'] });
    },
  });

  const handleOpenCreate = () => {
    setEditingBanner(null);
    setSectionType('HERO');
    setTitle('AUTUMN / WINTER 2026');
    setSubtitle('DEFINE YOUR STYLE WITH BESPOKE EXCELLENCE');
    setDescription('Hand-tailored cashmere overcoats and Italian superfine wool suiting.');
    setDesktopImage('https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?w=1600');
    setMobileImage('https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?w=800');
    setCtaText('SHOP COLLECTION');
    setCtaLink('/products');
    setBadgeText('RUNWAY EDITORIAL');
    setSortOrder(String(banners.length + 1));
    setIsModalOpen(true);
  };

  const handleOpenEdit = (b: ICMSBanner) => {
    setEditingBanner(b);
    setSectionType(b.sectionType);
    setTitle(b.title);
    setSubtitle(b.subtitle || '');
    setDescription(b.description || '');
    setDesktopImage(b.desktopImage);
    setMobileImage(b.mobileImage || b.desktopImage);
    setCtaText(b.ctaText || 'SHOP COLLECTION');
    setCtaLink(b.ctaLink || '/products');
    setBadgeText(b.badgeText || '');
    setSortOrder(String(b.sortOrder || 1));
    setIsModalOpen(true);
  };

  const filteredBanners = selectedSectionType === 'ALL'
    ? banners
    : banners.filter((b) => b.sectionType === selectedSectionType);

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-neutral-200 ">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-yellow-600 block mb-1">
            Visual Merchandising & CMS
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold font-serif-luxury text-neutral-900 uppercase tracking-tight">
            Homepage / CMS Management
          </h1>
          <p className="text-xs text-neutral-500 mt-1">
            Dynamically customize storefront hero banners, promotional carousels, and editorial sections without altering codebase.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <a
            href="/"
            target="_blank"
            rel="noreferrer"
            className="px-4 py-2.5 rounded-lg border border-neutral-300 text-xs font-semibold text-neutral-700 hover:bg-neutral-100 transition-colors flex items-center space-x-1.5"
          >
            <span>Live Storefront</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
          <button
            onClick={handleOpenCreate}
            className="bg-yellow-400 hover:bg-yellow-500 text-neutral-950 font-bold text-xs uppercase tracking-wider px-5 py-2.5 rounded-lg shadow-sm transition-colors flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>New Banner Section</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center space-x-2 overflow-x-auto no-scrollbar border-b border-neutral-200 pb-1 text-xs">
        {['ALL', 'HERO', 'PROMOTIONAL', 'FEATURED_COLLECTION', 'EDITORIAL'].map((type) => (
          <button
            key={type}
            onClick={() => setSelectedSectionType(type)}
            className={`px-3.5 py-1.5 rounded-lg font-semibold whitespace-nowrap transition-all ${
              selectedSectionType === type
                ? 'bg-neutral-900 text-white shadow-sm'
                : 'text-neutral-500 hover:text-neutral-900 '
            }`}
          >
            {type.replace(/_/g, ' ')}
          </button>
        ))}
      </div>

      {/* Banner Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {isLoading ? (
          <div className="col-span-full py-16 text-center text-neutral-400 text-xs">
            Loading storefront banners...
          </div>
        ) : filteredBanners.length === 0 ? (
          <div className="col-span-full py-16 text-center text-neutral-400 text-xs">
            No banners configured in this section.
          </div>
        ) : (
          filteredBanners.map((banner) => (
            <div
              key={banner._id}
              className="bg-white border border-neutral-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
            >
              {/* Image Preview Window */}
              <div className="relative h-56 bg-neutral-950 overflow-hidden group">
                <img
                  src={banner.desktopImage}
                  alt={banner.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex flex-col justify-end p-5 text-white">
                  {banner.badgeText && (
                    <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-yellow-600 mb-1">
                      {banner.badgeText}
                    </span>
                  )}
                  <h3 className="text-lg font-bold font-serif-luxury tracking-wide">
                    {banner.title}
                  </h3>
                  {banner.subtitle && (
                    <p className="text-xs text-neutral-300 font-mono tracking-wider -mt-0.5">
                      {banner.subtitle}
                    </p>
                  )}
                </div>

                {/* Section Badge */}
                <div className="absolute top-3 left-3 px-2 py-0.5 rounded bg-black/70 backdrop-blur-sm text-[9px] font-bold uppercase tracking-wider text-white border border-neutral-700">
                  {banner.sectionType}
                </div>

                {/* Active indicator */}
                <div className="absolute top-3 right-3 flex items-center space-x-1 bg-black/70 backdrop-blur-sm px-2.5 py-1 rounded text-[10px] font-bold">
                  <span
                    className={`w-2 h-2 rounded-full ${
                      banner.isActive ? 'bg-emerald-500' : 'bg-neutral-500'
                    }`}
                  />
                  <span className={banner.isActive ? 'text-emerald-400' : 'text-neutral-400'}>
                    {banner.isActive ? 'LIVE' : 'DISABLED'}
                  </span>
                </div>
              </div>

              {/* Details & CTA */}
              <div className="p-5 space-y-3 text-xs">
                {banner.description && (
                  <p className="text-neutral-600 line-clamp-2 leading-relaxed">
                    {banner.description}
                  </p>
                )}

                <div className="flex items-center justify-between p-2.5 rounded-lg bg-neutral-50 border border-neutral-100 text-[11px]">
                  <span className="font-semibold text-neutral-700 ">
                    CTA Button: <strong>{banner.ctaText}</strong>
                  </span>
                  <span className="font-mono text-neutral-400 truncate max-w-[140px]">
                    {banner.ctaLink}
                  </span>
                </div>
              </div>

              {/* Footer controls */}
              <div className="px-5 py-3 border-t border-neutral-100 flex items-center justify-between bg-neutral-50/50 text-xs">
                <span className="text-[10px] font-mono text-neutral-400">
                  Display Order: #{banner.sortOrder || 1}
                </span>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() =>
                      toggleActiveMutation.mutate({
                        id: banner._id,
                        isActive: !banner.isActive,
                      })
                    }
                    className="px-2.5 py-1 rounded border border-neutral-300 font-semibold text-[10px] hover:bg-neutral-100 transition-colors uppercase tracking-wider"
                  >
                    {banner.isActive ? 'Disable' : 'Enable'}
                  </button>
                  <button
                    onClick={() => setPreviewBanner(banner)}
                    className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-900 transition-colors"
                    title="Live Preview Fullscreen"
                  >
                    <Eye className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleOpenEdit(banner)}
                    className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-900 transition-colors"
                    title="Edit Banner Content"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setDeleteId(banner._id)}
                    className="p-1.5 rounded-lg text-neutral-400 hover:text-rose-600 transition-colors"
                    title="Delete Banner"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* CREATE / EDIT CMS BANNER MODAL */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingBanner ? 'Edit Visual Banner' : 'Create Banner Section'}
        subtitle="Manage hero typography, background photography, and call-to-actions."
        maxWidth="3xl"
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            saveMutation.mutate();
          }}
          className="space-y-4 text-xs"
        >
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-neutral-700 font-semibold mb-1">
                Section Type
              </label>
              <select
                value={sectionType}
                onChange={(e) => setSectionType(e.target.value)}
                className="w-full bg-neutral-50 border border-neutral-300 rounded-lg p-2.5 text-neutral-900 focus:outline-none focus:border-yellow-400"
              >
                <option value="HERO">Hero Banner (Storefront Top)</option>
                <option value="PROMOTIONAL">Promotional Showcase</option>
                <option value="FEATURED_COLLECTION">Featured Runway Collection</option>
                <option value="EDITORIAL">Editorial & Craft Philosophy</option>
              </select>
            </div>

            <div>
              <label className="block text-neutral-700 font-semibold mb-1">
                Display Sort Order
              </label>
              <input
                type="number"
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
                className="w-full bg-neutral-50 border border-neutral-300 rounded-lg p-2.5 text-neutral-900 font-mono focus:outline-none focus:border-yellow-400"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-neutral-700 font-semibold mb-1">
                Main Headline Title <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. AUTUMN / WINTER 2026"
                className="w-full bg-neutral-50 border border-neutral-300 rounded-lg p-2.5 text-neutral-900 uppercase font-bold focus:outline-none focus:border-yellow-400"
              />
            </div>

            <div>
              <label className="block text-neutral-700 font-semibold mb-1">
                Editorial Subtitle
              </label>
              <input
                type="text"
                value={subtitle}
                onChange={(e) => setSubtitle(e.target.value)}
                placeholder="DEFINE YOUR STYLE."
                className="w-full bg-neutral-50 border border-neutral-300 rounded-lg p-2.5 text-neutral-900 focus:outline-none focus:border-yellow-400"
              />
            </div>
          </div>

          <div>
            <label className="block text-neutral-700 font-semibold mb-1">
              Section Editorial Narrative
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Sophisticated high-fashion narrative introducing the seasonal pieces..."
              className="w-full bg-neutral-50 border border-neutral-300 rounded-lg p-2.5 text-neutral-900 focus:outline-none focus:border-yellow-400"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-neutral-700 font-semibold mb-1">
                Desktop High-Res Image URL <span className="text-rose-500">*</span>
              </label>
              <input
                type="url"
                required
                value={desktopImage}
                onChange={(e) => setDesktopImage(e.target.value)}
                placeholder="https://images.unsplash.com/..."
                className="w-full bg-neutral-50 border border-neutral-300 rounded-lg p-2.5 text-neutral-900 font-mono text-[11px] focus:outline-none focus:border-yellow-400"
              />
            </div>

            <div>
              <label className="block text-neutral-700 font-semibold mb-1">
                Mobile Vertical Image URL
              </label>
              <input
                type="url"
                value={mobileImage}
                onChange={(e) => setMobileImage(e.target.value)}
                placeholder="Optional vertical crop..."
                className="w-full bg-neutral-50 border border-neutral-300 rounded-lg p-2.5 text-neutral-900 font-mono text-[11px] focus:outline-none focus:border-yellow-400"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-neutral-700 font-semibold mb-1">
                CTA Button Text
              </label>
              <input
                type="text"
                value={ctaText}
                onChange={(e) => setCtaText(e.target.value)}
                placeholder="SHOP COLLECTION"
                className="w-full bg-neutral-50 border border-neutral-300 rounded-lg p-2.5 text-neutral-900 uppercase font-bold focus:outline-none focus:border-yellow-400"
              />
            </div>

            <div>
              <label className="block text-neutral-700 font-semibold mb-1">
                CTA Route Link
              </label>
              <input
                type="text"
                value={ctaLink}
                onChange={(e) => setCtaLink(e.target.value)}
                placeholder="/products"
                className="w-full bg-neutral-50 border border-neutral-300 rounded-lg p-2.5 text-neutral-900 font-mono focus:outline-none focus:border-yellow-400"
              />
            </div>

            <div>
              <label className="block text-neutral-700 font-semibold mb-1">
                Badge Callout
              </label>
              <input
                type="text"
                value={badgeText}
                onChange={(e) => setBadgeText(e.target.value)}
                placeholder="LIMITED EDITION"
                className="w-full bg-neutral-50 border border-neutral-300 rounded-lg p-2.5 text-neutral-900 focus:outline-none focus:border-yellow-400"
              />
            </div>
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
              className="px-6 py-2 bg-yellow-400 text-neutral-950 rounded-lg font-bold uppercase tracking-wider"
            >
              {saveMutation.isPending ? 'Saving...' : 'Save Banner Section'}
            </button>
          </div>
        </form>
      </Modal>

      {/* LIVE FULLSCREEN PREVIEW MODAL */}
      <Modal
        isOpen={Boolean(previewBanner)}
        onClose={() => setPreviewBanner(null)}
        title="Live Storefront Banner Simulation"
        maxWidth="4xl"
      >
        {previewBanner && (
          <div className="relative rounded-2xl overflow-hidden aspect-[16/9] bg-neutral-950 text-white flex flex-col justify-end p-8 sm:p-12 shadow-2xl">
            <img
              src={previewBanner.desktopImage}
              alt={previewBanner.title}
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

            <div className="relative z-10 max-w-xl space-y-3">
              {previewBanner.badgeText && (
                <span className="inline-block px-3 py-1 rounded bg-yellow-400 text-neutral-950 font-bold uppercase tracking-widest text-[10px]">
                  {previewBanner.badgeText}
                </span>
              )}
              <h2 className="text-2xl sm:text-4xl font-extrabold uppercase font-serif-luxury tracking-wider">
                {previewBanner.title}
              </h2>
              {previewBanner.subtitle && (
                <p className="text-sm font-mono tracking-widest text-amber-300">
                  {previewBanner.subtitle}
                </p>
              )}
              {previewBanner.description && (
                <p className="text-xs text-neutral-300 leading-relaxed max-w-md">
                  {previewBanner.description}
                </p>
              )}
              <div className="pt-2">
                <button
                  type="button"
                  className="px-6 py-3 bg-yellow-400 text-neutral-950 font-bold text-xs uppercase tracking-widest rounded-lg shadow-lg"
                >
                  {previewBanner.ctaText}
                </button>
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* CONFIRM DELETE DIALOG */}
      <ConfirmDialog
        isOpen={Boolean(deleteId)}
        onClose={() => setDeleteId(null)}
        onConfirm={() => deleteId && deleteMutation.mutate(deleteId)}
        title="Remove Visual Banner"
        message="Are you sure you wish to delete this section from the homepage CMS? The storefront will automatically re-index."
        confirmLabel="Remove Section"
        isDestructive
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
};

export default HomepageCMSPage;
