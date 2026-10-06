import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Edit2, Trash2, MapPin, Clock } from 'lucide-react';
import adminApi from '../services/adminApi';
import { Modal } from '../components/Modal';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { IShippingMethod } from '../types/admin';

export const ShippingPage: React.FC = () => {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMethod, setEditingMethod] = useState<IShippingMethod | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  // Form states
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('99');
  const [estimatedDelivery, setEstimatedDelivery] = useState('3–5 Business Days');
  const [zones, setZones] = useState('Pan-India Metros, Tier 1 & 2 Cities');
  const [freeAboveAmount, setFreeAboveAmount] = useState('1999');

  const { data: methods = [], isLoading } = useQuery<IShippingMethod[]>({
    queryKey: ['adminShippingMethods'],
    queryFn: async () => {
      const res = await adminApi.getShippingMethods();
      return res.data?.data || [];
    },
  });

  const saveMutation = useMutation({
    mutationFn: async () => {
      const payload = {
        name,
        description,
        price: parseFloat(price) || 0,
        estimatedDelivery,
        zones: zones.split(',').map((z) => z.trim()).filter(Boolean),
        freeAboveAmount: parseFloat(freeAboveAmount) || 0,
        isActive: true,
      };

      if (editingMethod) {
        return adminApi.updateShippingMethod(editingMethod._id, payload);
      } else {
        return adminApi.createShippingMethod(payload);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminShippingMethods'] });
      setIsModalOpen(false);
      setEditingMethod(null);
    },
    onError: (err: any) => {
      alert(err.response?.data?.message || 'Error saving shipping method');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return adminApi.deleteShippingMethod(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminShippingMethods'] });
      setDeleteId(null);
    },
  });

  const toggleActiveMutation = useMutation({
    mutationFn: async ({ id, isActive }: { id: string; isActive: boolean }) => {
      return adminApi.updateShippingMethod(id, { isActive });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminShippingMethods'] });
    },
  });

  const handleOpenCreate = () => {
    setEditingMethod(null);
    setName('');
    setDescription('Exclusive garment delivery in signature protective packaging.');
    setPrice('99');
    setEstimatedDelivery('3–5 Business Days');
    setZones('Pan-India Metros, Tier 1 & 2 Cities');
    setFreeAboveAmount('1999');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (m: IShippingMethod) => {
    setEditingMethod(m);
    setName(m.name);
    setDescription(m.description || '');
    setPrice(String(m.price));
    setEstimatedDelivery(m.estimatedDelivery);
    setZones(m.zones ? m.zones.join(', ') : 'All Regions');
    setFreeAboveAmount(String(m.freeAboveAmount || 0));
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-neutral-200 ">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-yellow-600 block mb-1">
            Carrier & Fulfillment Logistics
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold font-serif-luxury text-neutral-900 uppercase tracking-tight">
            Shipping Rates & Delivery Zones
          </h1>
          <p className="text-xs text-neutral-500 mt-1">
            Configure delivery methods, complimentary shipping thresholds, delivery zone schedules, and white-glove courier tiers.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="bg-yellow-400 hover:bg-yellow-500 text-neutral-950 font-bold text-xs uppercase tracking-wider px-5 py-2.5 rounded-lg shadow-sm transition-colors flex items-center space-x-2 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>New Delivery Method</span>
        </button>
      </div>

      {/* Methods Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {isLoading ? (
          <div className="col-span-full py-16 text-center text-neutral-400 text-xs">
            Loading shipping rate schedules...
          </div>
        ) : (
          methods.map((method) => (
            <div
              key={method._id}
              className="bg-white border border-neutral-200 rounded-xl p-6 shadow-sm space-y-4 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between pb-2 border-b border-neutral-100 ">
                  <span className="text-[10px] font-bold font-mono uppercase tracking-wider text-yellow-600 ">
                    CARRIER TIER
                  </span>
                  <button
                    onClick={() =>
                      toggleActiveMutation.mutate({
                        id: method._id,
                        isActive: !method.isActive,
                      })
                    }
                    className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                      method.isActive
                        ? 'bg-emerald-500/10 text-emerald-500'
                        : 'bg-neutral-800 text-neutral-400'
                    }`}
                  >
                    {method.isActive ? 'ACTIVE' : 'INACTIVE'}
                  </button>
                </div>

                <h3 className="text-base font-bold font-serif-luxury text-neutral-900 mt-3">
                  {method.name}
                </h3>
                <div className="text-2xl font-bold font-serif-luxury text-neutral-900 mt-1">
                  ₹{method.price}
                  <span className="text-xs text-neutral-400 font-sans font-normal ml-1">/ order</span>
                </div>
                <p className="text-xs text-neutral-500 mt-2 leading-relaxed">
                  {method.description}
                </p>

                <div className="space-y-1.5 pt-4 text-xs text-neutral-600 ">
                  <div className="flex items-center space-x-2">
                    <Clock className="w-3.5 h-3.5 text-yellow-600 " />
                    <span>Estimated: <strong>{method.estimatedDelivery}</strong></span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <MapPin className="w-3.5 h-3.5 text-yellow-600 mt-0.5 flex-shrink-0" />
                    <span className="line-clamp-2">
                      Zones: {method.zones ? method.zones.join(', ') : 'Pan-India'}
                    </span>
                  </div>
                  {method.freeAboveAmount > 0 && (
                    <div className="pt-1 text-[11px] text-emerald-600 font-semibold">
                      ✓ Complimentary on orders above ₹{method.freeAboveAmount.toLocaleString('en-IN')}
                    </div>
                  )}
                </div>
              </div>

              <div className="pt-4 border-t border-neutral-100 flex items-center justify-end space-x-2">
                <button
                  onClick={() => handleOpenEdit(method)}
                  className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-900 transition-colors"
                  title="Edit Rate"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setDeleteId(method._id)}
                  className="p-1.5 rounded-lg text-neutral-400 hover:text-rose-600 transition-colors"
                  title="Delete Rate"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* CREATE / EDIT SHIPPING METHOD MODAL */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingMethod ? 'Edit Shipping Method' : 'Create Delivery Rate'}
        subtitle="Configure pricing, transit expectations, and delivery zones."
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
              Method Name <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Standard Delivery, White Glove Courier"
              className="w-full bg-neutral-50 border border-neutral-300 rounded-lg p-2.5 text-neutral-900 focus:outline-none focus:border-yellow-400"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-neutral-700 font-semibold mb-1">
                Charge Price (₹) <span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                required
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full bg-neutral-50 border border-neutral-300 rounded-lg p-2.5 text-neutral-900 font-mono focus:outline-none focus:border-yellow-400"
              />
            </div>

            <div>
              <label className="block text-neutral-700 font-semibold mb-1">
                Estimated Transit Window <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={estimatedDelivery}
                onChange={(e) => setEstimatedDelivery(e.target.value)}
                placeholder="3–5 Business Days"
                className="w-full bg-neutral-50 border border-neutral-300 rounded-lg p-2.5 text-neutral-900 focus:outline-none focus:border-yellow-400"
              />
            </div>
          </div>

          <div>
            <label className="block text-neutral-700 font-semibold mb-1">
              Free Shipping Threshold (₹) (0 for no complimentary threshold)
            </label>
            <input
              type="number"
              value={freeAboveAmount}
              onChange={(e) => setFreeAboveAmount(e.target.value)}
              className="w-full bg-neutral-50 border border-neutral-300 rounded-lg p-2.5 text-neutral-900 font-mono focus:outline-none focus:border-yellow-400"
            />
          </div>

          <div>
            <label className="block text-neutral-700 font-semibold mb-1">
              Service Delivery Zones (comma separated)
            </label>
            <input
              type="text"
              value={zones}
              onChange={(e) => setZones(e.target.value)}
              className="w-full bg-neutral-50 border border-neutral-300 rounded-lg p-2.5 text-neutral-900 focus:outline-none focus:border-yellow-400"
            />
          </div>

          <div>
            <label className="block text-neutral-700 font-semibold mb-1">
              Service Description
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-neutral-50 border border-neutral-300 rounded-lg p-2.5 text-neutral-900 focus:outline-none focus:border-yellow-400"
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
              className="px-6 py-2 bg-yellow-400 text-neutral-950 rounded-lg font-bold uppercase tracking-wider"
            >
              Save Shipping Rate
            </button>
          </div>
        </form>
      </Modal>

      {/* CONFIRM DELETE DIALOG */}
      <ConfirmDialog
        isOpen={Boolean(deleteId)}
        onClose={() => setDeleteId(null)}
        onConfirm={() => deleteId && deleteMutation.mutate(deleteId)}
        title="Remove Shipping Method"
        message="Are you sure you wish to delete this delivery rate? Storefront customers will no longer be able to select this courier option at checkout."
        confirmLabel="Remove Method"
        isDestructive
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
};

export default ShippingPage;
