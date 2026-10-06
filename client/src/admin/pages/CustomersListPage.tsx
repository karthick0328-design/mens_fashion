import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Search, Eye, Ban, CheckCircle, MapPin, ShoppingBag } from 'lucide-react';
import adminApi from '../services/adminApi';
import { DataTable, Column } from '../components/DataTable';
import { StatusBadge } from '../components/StatusBadge';
import { Drawer } from '../components/Drawer';
import { ConfirmDialog } from '../components/ConfirmDialog';

export const CustomersListPage: React.FC = () => {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null);
  const [blockActionTarget, setBlockActionTarget] = useState<{ id: string; name: string; isBlocked: boolean } | null>(null);

  // Fetch Customers list
  const { data: customersRes, isLoading } = useQuery({
    queryKey: ['adminCustomers', search, statusFilter],
    queryFn: async () => {
      const res = await adminApi.getCustomers({ search, status: statusFilter });
      return res.data?.data || [];
    },
  });

  const customers: any[] = customersRes || [];

  // Fetch Customer Details when drawer opened
  const { data: customerDetails, isLoading: isDetailsLoading } = useQuery({
    queryKey: ['adminCustomerDetail', selectedCustomerId],
    queryFn: async () => {
      if (!selectedCustomerId) return null;
      const res = await adminApi.getCustomerDetails(selectedCustomerId);
      return res.data?.data;
    },
    enabled: Boolean(selectedCustomerId),
  });

  // Block / Unblock Mutation
  const blockMutation = useMutation({
    mutationFn: async ({ id, isBlocked }: { id: string; isBlocked: boolean }) => {
      return adminApi.updateCustomerStatus(id, isBlocked);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminCustomers'] });
      queryClient.invalidateQueries({ queryKey: ['adminCustomerDetail', selectedCustomerId] });
      setBlockActionTarget(null);
    },
  });

  const columns: Column<any>[] = [
    {
      header: 'Clientele Name',
      accessor: (c) => (
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-full bg-neutral-100 border border-yellow-400/40 text-yellow-600 font-bold flex items-center justify-center font-serif-luxury text-xs flex-shrink-0">
            {c.name ? c.name.charAt(0).toUpperCase() : 'C'}
          </div>
          <div>
            <button
              onClick={() => setSelectedCustomerId(c._id)}
              className="font-bold text-neutral-900 hover:text-yellow-600 transition-colors block text-left truncate max-w-[170px]"
            >
              {c.name}
            </button>
            <span className="text-[10px] text-neutral-400 block truncate max-w-[170px]">
              {c.email}
            </span>
          </div>
        </div>
      ),
    },
    {
      header: 'Phone',
      accessor: (c) => (
        <span className="text-neutral-500 font-mono text-[11px]">
          {c.phone || 'Not provided'}
        </span>
      ),
    },
    {
      header: 'Saved Addresses',
      accessor: (c) => (
        <span className="text-xs text-neutral-600 ">
          {c.addresses?.length || 0} locations
        </span>
      ),
    },
    {
      header: 'Lifetime Orders',
      accessor: (c) => (
        <span className="font-mono font-bold text-neutral-900 text-xs">
          {c.orderCount || 0} orders
        </span>
      ),
    },
    {
      header: 'Lifetime Spend',
      accessor: (c) => (
        <span className="font-serif-luxury font-bold text-xs text-yellow-600 ">
          ₹{(c.totalSpent || 0).toLocaleString('en-IN')}
        </span>
      ),
    },
    {
      header: 'Status',
      accessor: (c) => (
        <StatusBadge status={c.isBlocked ? 'Blocked' : 'Active'} type="stock" />
      ),
    },
    {
      header: 'Member Since',
      accessor: (c) => (
        <span className="text-[10px] text-neutral-400 font-mono">
          {new Date(c.createdAt).toLocaleDateString()}
        </span>
      ),
    },
    {
      header: 'Actions',
      align: 'right',
      accessor: (c) => (
        <div className="flex items-center justify-end space-x-1">
          <button
            onClick={() => setSelectedCustomerId(c._id)}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-900 hover:bg-neutral-100 transition-colors"
            title="Inspect Client Portfolio"
          >
            <Eye className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() =>
              setBlockActionTarget({
                id: c._id,
                name: c.name,
                isBlocked: !c.isBlocked,
              })
            }
            className={`p-1.5 rounded-lg transition-colors ${
              c.isBlocked
                ? 'text-emerald-600 hover:bg-emerald-50 '
                : 'text-neutral-400 hover:text-rose-600 hover:bg-rose-50 '
            }`}
            title={c.isBlocked ? 'Unblock Client' : 'Block Client'}
          >
            {c.isBlocked ? <CheckCircle className="w-3.5 h-3.5" /> : <Ban className="w-3.5 h-3.5" />}
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-neutral-200 ">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-yellow-600 block mb-1">
            Client Relations
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold font-serif-luxury text-neutral-900 uppercase tracking-tight">
            Customer Directory ({customers.length})
          </h1>
          <p className="text-xs text-neutral-500 mt-1">
            Maintain customer relationship profiles, address vaults, order histories, and membership permissions.
          </p>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="p-4 rounded-xl bg-white border border-neutral-200 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-sm">
        <div className="relative w-full sm:w-80">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by client name, email, or phone..."
            className="w-full bg-neutral-50 border border-neutral-300 rounded-lg pl-9 pr-4 py-2 text-neutral-900 placeholder:text-neutral-400 text-xs focus:outline-none focus:border-yellow-400"
          />
          <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
        </div>

        <div className="flex items-center space-x-1.5 w-full sm:w-auto overflow-x-auto no-scrollbar pb-1 sm:pb-0 text-xs">
          {(
            [
              { key: 'ALL', label: 'All Accounts' },
              { key: 'ACTIVE', label: 'Active Patrons' },
              { key: 'BLOCKED', label: 'Blocked' },
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

      {/* Table */}
      <DataTable
        columns={columns}
        data={customers}
        keyExtractor={(c) => c._id}
        isLoading={isLoading}
        emptyTitle="NO CLIENTS REGISTERED"
        emptySubtitle="Customer profiles will appear automatically as clients place orders or register."
      />

      {/* CUSTOMER INSPECTION DRAWER */}
      <Drawer
        isOpen={Boolean(selectedCustomerId)}
        onClose={() => setSelectedCustomerId(null)}
        title={customerDetails?.profile?.name || 'Client Details'}
        subtitle={`Member since ${customerDetails?.profile?.createdAt ? new Date(customerDetails.profile.createdAt).toLocaleDateString() : ''}`}
        width="xl"
      >
        {isDetailsLoading || !customerDetails ? (
          <div className="py-20 text-center text-xs text-neutral-400">Loading client portfolio...</div>
        ) : (
          <div className="space-y-6 text-xs">
            {/* Quick Summary Card */}
            <div className="p-4 rounded-xl bg-neutral-50 border border-neutral-200 space-y-3">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-full bg-[#18191E] border border-yellow-400/50 flex items-center justify-center font-serif-luxury text-base font-bold text-yellow-600 ">
                  {customerDetails.profile.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-neutral-900 ">
                    {customerDetails.profile.name}
                  </h4>
                  <p className="text-neutral-500">{customerDetails.profile.email}</p>
                  <p className="text-neutral-400 font-mono text-[11px]">
                    {customerDetails.profile.phone || 'No phone registered'}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-3 border-t border-neutral-200 ">
                <div>
                  <span className="text-[10px] uppercase font-bold text-neutral-400 block">Lifetime Orders</span>
                  <span className="text-base font-bold text-neutral-900 font-mono">
                    {customerDetails.orders?.length || 0}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-neutral-400 block">Total Spend</span>
                  <span className="text-base font-bold text-yellow-600 font-serif-luxury">
                    ₹{customerDetails.totalSpent?.toLocaleString('en-IN') || 0}
                  </span>
                </div>
              </div>
            </div>

            {/* Saved Addresses */}
            <div className="space-y-2">
              <span className="font-bold uppercase tracking-wider text-neutral-900 text-xs flex items-center space-x-1.5 font-serif-luxury">
                <MapPin className="w-4 h-4 text-yellow-600 " />
                <span>Saved Atelier Addresses ({customerDetails.profile.addresses?.length || 0})</span>
              </span>

              {customerDetails.profile.addresses?.length === 0 ? (
                <p className="text-neutral-400 italic">No addresses saved.</p>
              ) : (
                <div className="space-y-2">
                  {customerDetails.profile.addresses?.map((addr: any, i: number) => (
                    <div
                      key={i}
                      className="p-3 rounded-lg border border-neutral-200 bg-white space-y-0.5 text-neutral-600 "
                    >
                      <div className="flex justify-between font-bold text-neutral-900 text-xs">
                        <span>{addr.name}</span>
                        {addr.isDefault && (
                          <span className="text-[9px] text-yellow-600 uppercase font-mono">Default</span>
                        )}
                      </div>
                      <p>{addr.addressLine1}</p>
                      {addr.addressLine2 && <p>{addr.addressLine2}</p>}
                      <p>
                        {addr.city}, {addr.state} - {addr.postalCode}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Past Orders */}
            <div className="space-y-2">
              <span className="font-bold uppercase tracking-wider text-neutral-900 text-xs flex items-center space-x-1.5 font-serif-luxury">
                <ShoppingBag className="w-4 h-4 text-yellow-600 " />
                <span>Past Orders ({customerDetails.orders?.length || 0})</span>
              </span>

              <div className="divide-y divide-neutral-100 border border-neutral-200 rounded-lg overflow-hidden">
                {customerDetails.orders?.slice(0, 5).map((ord: any) => (
                  <div key={ord._id} className="p-3 flex items-center justify-between bg-white ">
                    <div>
                      <span className="font-mono font-bold text-neutral-900 block">
                        {ord.orderNumber}
                      </span>
                      <span className="text-[10px] text-neutral-400">
                        {new Date(ord.createdAt).toLocaleDateString()} • {ord.items?.length || 1} items
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="font-bold text-neutral-900 font-serif-luxury block">
                        ₹{ord.pricing?.totalAmount?.toLocaleString('en-IN')}
                      </span>
                      <StatusBadge status={ord.orderStatus} type="order" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Note on security */}
            <div className="p-3 rounded-lg bg-neutral-100 text-neutral-500 text-[11px] leading-relaxed">
              🔒 Confidential Client Privacy: In compliance with PCI-DSS guidelines, sensitive customer payment credentials and full card numbers are never stored or exposed to personnel.
            </div>
          </div>
        )}
      </Drawer>

      {/* CONFIRM BLOCK/UNBLOCK DIALOG */}
      <ConfirmDialog
        isOpen={Boolean(blockActionTarget)}
        onClose={() => setBlockActionTarget(null)}
        onConfirm={() =>
          blockActionTarget &&
          blockMutation.mutate({
            id: blockActionTarget.id,
            isBlocked: blockActionTarget.isBlocked,
          })
        }
        title={blockActionTarget?.isBlocked ? 'Block Customer Account' : 'Unblock Customer Account'}
        message={
          blockActionTarget?.isBlocked
            ? `Are you sure you wish to restrict ${blockActionTarget.name} from placing new atelier orders?`
            : `Are you sure you wish to restore full checkout access for ${blockActionTarget?.name}?`
        }
        confirmLabel={blockActionTarget?.isBlocked ? 'Block Client' : 'Unblock Client'}
        isDestructive={blockActionTarget?.isBlocked}
        isLoading={blockMutation.isPending}
      />
    </div>
  );
};

export default CustomersListPage;
