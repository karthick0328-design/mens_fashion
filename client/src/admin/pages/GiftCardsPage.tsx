import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Gift } from 'lucide-react';
import adminApi from '../services/adminApi';
import { DataTable, Column } from '../components/DataTable';
import { StatusBadge } from '../components/StatusBadge';
import { Modal } from '../components/Modal';
import { IGiftCard, IGiftCardTier } from '../types/admin';

export const GiftCardsPage: React.FC = () => {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<'issued' | 'tiers' | 'transactions'>('issued');
  const [isIssueModalOpen, setIsIssueModalOpen] = useState(false);

  // Issue Form State
  const [tier, setTier] = useState<'SILVER' | 'GOLD' | 'PLATINUM' | 'DIAMOND'>('GOLD');
  const [amount, setAmount] = useState('5000');
  const [senderName, setSenderName] = useState('AURELIUS Concierge');
  const [recipientName, setRecipientName] = useState('');
  const [recipientEmail, setRecipientEmail] = useState('');
  const [message, setMessage] = useState('Compliments of the AURELIUS Atelier Homme');

  // Fetch Gift Cards Data
  const { data: giftData, isLoading } = useQuery({
    queryKey: ['adminGiftCards'],
    queryFn: async () => {
      const res = await adminApi.getGiftCards();
      return res.data?.data;
    },
  });

  // Fetch Transactions
  const { data: transactions = [], isLoading: isTxnLoading } = useQuery({
    queryKey: ['adminGiftCardTransactions'],
    queryFn: async () => {
      const res = await adminApi.getGiftCardTransactions();
      return res.data?.data || [];
    },
    enabled: activeTab === 'transactions',
  });

  const tiers: IGiftCardTier[] = giftData?.tiers || [];
  const issuedCards: IGiftCard[] = giftData?.issuedGiftCards || [];

  const issueMutation = useMutation({
    mutationFn: async () => {
      return adminApi.createGiftCard({
        tier,
        amount: parseFloat(amount),
        senderName,
        recipientName,
        recipientEmail,
        message,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminGiftCards'] });
      setIsIssueModalOpen(false);
      setRecipientName('');
      setRecipientEmail('');
    },
    onError: (err: any) => {
      alert(err.response?.data?.message || 'Error issuing gift card');
    },
  });

  const columns: Column<IGiftCard>[] = [
    {
      header: 'Card Code',
      accessor: (c) => (
        <span className="font-mono font-bold text-neutral-900 text-xs">
          {c.code}
        </span>
      ),
    },
    {
      header: 'Tier Level',
      accessor: (c) => (
        <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-yellow-600 ">
          {c.tier}
        </span>
      ),
    },
    {
      header: 'Initial Value',
      accessor: (c) => (
        <span className="font-serif-luxury font-bold text-neutral-900 ">
          ₹{c.initialAmount.toLocaleString('en-IN')}
        </span>
      ),
    },
    {
      header: 'Remaining Balance',
      accessor: (c) => (
        <span className="font-serif-luxury font-bold text-emerald-600 ">
          ₹{c.balance.toLocaleString('en-IN')}
        </span>
      ),
    },
    {
      header: 'Recipient',
      accessor: (c) => (
        <div>
          <span className="font-bold text-neutral-900 block">
            {c.recipientName}
          </span>
          <span className="text-[10px] text-neutral-400 block">{c.recipientEmail}</span>
        </div>
      ),
    },
    {
      header: 'Validity Expiry',
      accessor: (c) => (
        <span className="text-[10px] text-neutral-500 font-mono">
          {new Date(c.expiryDate).toLocaleDateString()}
        </span>
      ),
    },
    {
      header: 'Status',
      accessor: (c) => <StatusBadge status={c.status} type="giftcard" />,
    },
  ];

  const txnColumns: Column<any>[] = [
    {
      header: 'Card Code',
      accessor: (t) => <span className="font-mono font-bold">{t.code}</span>,
    },
    {
      header: 'Transaction Type',
      accessor: (t) => (
        <span
          className={`font-mono text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
            t.type === 'ISSUED'
              ? 'bg-yellow-400/15 text-amber-500'
              : t.type === 'REDEEMED'
              ? 'bg-emerald-500/10 text-emerald-500'
              : 'bg-neutral-800 text-neutral-300'
          }`}
        >
          {t.type}
        </span>
      ),
    },
    {
      header: 'Amount',
      accessor: (t) => (
        <span className="font-serif-luxury font-bold">₹{t.amount?.toLocaleString('en-IN')}</span>
      ),
    },
    {
      header: 'Details / Note',
      accessor: (t) => <span className="text-neutral-500 text-xs">{t.note || 'Online checkout'}</span>,
    },
    {
      header: 'Date',
      accessor: (t) => (
        <span className="text-neutral-400 text-[10px] font-mono">
          {new Date(t.date).toLocaleString()}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-neutral-200 ">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-yellow-600 block mb-1">
            Luxury Gifting & Vouchers
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold font-serif-luxury text-neutral-900 uppercase tracking-tight">
            Gift Cards & Haute Tiers
          </h1>
          <p className="text-xs text-neutral-500 mt-1">
            Manage Silver, Gold, Platinum, and Diamond sartorial gifting cards and track redemption ledgers.
          </p>
        </div>

        <button
          onClick={() => setIsIssueModalOpen(true)}
          className="bg-yellow-400 hover:bg-yellow-500 text-neutral-950 font-bold text-xs uppercase tracking-wider px-5 py-2.5 rounded-lg shadow-sm transition-colors flex items-center space-x-2 self-start sm:self-auto"
        >
          <Gift className="w-4 h-4" />
          <span>Issue New Gift Card</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center space-x-2 overflow-x-auto no-scrollbar border-b border-neutral-200 pb-1 text-xs">
        <button
          onClick={() => setActiveTab('issued')}
          className={`px-4 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
            activeTab === 'issued'
              ? 'bg-neutral-900 text-white font-bold shadow-sm'
              : 'text-neutral-500 hover:text-neutral-900 '
          }`}
        >
          Issued Gift Cards ({issuedCards.length})
        </button>
        <button
          onClick={() => setActiveTab('tiers')}
          className={`px-4 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
            activeTab === 'tiers'
              ? 'bg-neutral-900 text-white font-bold shadow-sm'
              : 'text-neutral-500 hover:text-neutral-900 '
          }`}
        >
          Haute Tiers ({tiers.length})
        </button>
        <button
          onClick={() => setActiveTab('transactions')}
          className={`px-4 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
            activeTab === 'transactions'
              ? 'bg-neutral-900 text-white font-bold shadow-sm'
              : 'text-neutral-500 hover:text-neutral-900 '
          }`}
        >
          Redemption Transactions
        </button>
      </div>

      {/* ISSUED CARDS TAB */}
      {activeTab === 'issued' && (
        <DataTable
          columns={columns}
          data={issuedCards}
          keyExtractor={(c) => c._id}
          isLoading={isLoading}
          emptyTitle="NO GIFT CARDS ISSUED"
          emptySubtitle="Create and issue gift cards for VIP patrons or customer concierge courtesy."
        />
      )}

      {/* TIERS TAB */}
      {activeTab === 'tiers' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {tiers.map((t) => (
            <div
              key={t.id}
              className="bg-white border border-neutral-200 rounded-xl p-6 shadow-sm space-y-4 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between pb-2 border-b border-neutral-100 ">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-yellow-600 ">
                    {t.id} TIER
                  </span>
                  <span className="text-[10px] font-semibold text-emerald-600 ">
                    {t.status}
                  </span>
                </div>

                <h3 className="text-base font-bold font-serif-luxury text-neutral-900 mt-3">
                  {t.name}
                </h3>
                <div className="text-xl font-bold font-serif-luxury text-yellow-600 mt-1">
                  ₹{t.amount.toLocaleString('en-IN')}
                </div>
                <p className="text-xs text-neutral-500 mt-2 leading-relaxed">
                  {t.description}
                </p>
              </div>

              <div className="pt-3 border-t border-neutral-100 text-[11px] text-neutral-400 font-mono">
                Validity: {t.validity}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TRANSACTIONS TAB */}
      {activeTab === 'transactions' && (
        <DataTable
          columns={txnColumns}
          data={transactions}
          keyExtractor={(t: any) => t._id || t.id || `${t.code}-${t.date}`}
          isLoading={isTxnLoading}
          emptyTitle="NO GIFT CARD TRANSACTIONS"
          emptySubtitle="Transactions will appear here when gift cards are issued or redeemed at checkout."
        />
      )}

      {/* ISSUE NEW GIFT CARD MODAL */}
      <Modal
        isOpen={isIssueModalOpen}
        onClose={() => setIsIssueModalOpen(false)}
        title="Issue Exclusive Atelier Gift Card"
        subtitle="Generates an authenticated card code with recipient concierge notification."
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            issueMutation.mutate();
          }}
          className="space-y-4 text-xs"
        >
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-neutral-700 font-semibold mb-1">
                Card Tier Level
              </label>
              <select
                value={tier}
                onChange={(e) => {
                  const t = e.target.value as any;
                  setTier(t);
                  if (t === 'SILVER') setAmount('2500');
                  if (t === 'GOLD') setAmount('5000');
                  if (t === 'PLATINUM') setAmount('10000');
                  if (t === 'DIAMOND') setAmount('25000');
                }}
                className="w-full bg-neutral-50 border border-neutral-300 rounded-lg p-2.5 text-neutral-900 focus:outline-none focus:border-yellow-400"
              >
                <option value="SILVER">SILVER (₹2,500)</option>
                <option value="GOLD">GOLD (₹5,000)</option>
                <option value="PLATINUM">PLATINUM (₹10,000)</option>
                <option value="DIAMOND">DIAMOND (₹25,000)</option>
              </select>
            </div>

            <div>
              <label className="block text-neutral-700 font-semibold mb-1">
                Value Amount (₹)
              </label>
              <input
                type="number"
                required
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full bg-neutral-50 border border-neutral-300 rounded-lg p-2.5 text-neutral-900 font-mono font-bold focus:outline-none focus:border-yellow-400"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-neutral-700 font-semibold mb-1">
                Sender Name / Title
              </label>
              <input
                type="text"
                value={senderName}
                onChange={(e) => setSenderName(e.target.value)}
                className="w-full bg-neutral-50 border border-neutral-300 rounded-lg p-2.5 text-neutral-900 focus:outline-none focus:border-yellow-400"
              />
            </div>

            <div>
              <label className="block text-neutral-700 font-semibold mb-1">
                Recipient Full Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={recipientName}
                onChange={(e) => setRecipientName(e.target.value)}
                placeholder="Lord / Sir / Patron Name"
                className="w-full bg-neutral-50 border border-neutral-300 rounded-lg p-2.5 text-neutral-900 focus:outline-none focus:border-yellow-400"
              />
            </div>
          </div>

          <div>
            <label className="block text-neutral-700 font-semibold mb-1">
              Recipient Email Address <span className="text-rose-500">*</span>
            </label>
            <input
              type="email"
              required
              value={recipientEmail}
              onChange={(e) => setRecipientEmail(e.target.value)}
              placeholder="client@luxurymail.com"
              className="w-full bg-neutral-50 border border-neutral-300 rounded-lg p-2.5 text-neutral-900 focus:outline-none focus:border-yellow-400"
            />
          </div>

          <div>
            <label className="block text-neutral-700 font-semibold mb-1">
              Personalized Atelier Note
            </label>
            <textarea
              rows={3}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full bg-neutral-50 border border-neutral-300 rounded-lg p-2.5 text-neutral-900 focus:outline-none focus:border-yellow-400"
            />
          </div>

          <div className="pt-3 border-t border-neutral-200 flex justify-end space-x-2">
            <button
              type="button"
              onClick={() => setIsIssueModalOpen(false)}
              className="px-4 py-2 border border-neutral-300 rounded-lg text-neutral-600 font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={issueMutation.isPending}
              className="px-6 py-2 bg-yellow-400 text-neutral-950 rounded-lg font-bold uppercase tracking-wider"
            >
              {issueMutation.isPending ? 'Generating...' : 'Issue Card'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default GiftCardsPage;
