import React, { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { CheckCircle2 } from 'lucide-react';
import adminApi from '../services/adminApi';
import { DataTable, Column } from '../components/DataTable';
import { Modal } from '../components/Modal';
import { INotificationTemplate } from '../types/admin';

export const NotificationsPage: React.FC = () => {
  const [testModalEvent, setTestModalEvent] = useState<string | null>(null);
  const [recipientEmail, setRecipientEmail] = useState('concierge@aurelius.com');
  const [testSuccess, setTestSuccess] = useState(false);

  const { data: templates = [], isLoading } = useQuery<INotificationTemplate[]>({
    queryKey: ['adminNotifications'],
    queryFn: async () => {
      const res = await adminApi.getNotifications();
      return res.data?.data || [];
    },
  });

  const sendTestMutation = useMutation({
    mutationFn: async () => {
      if (!testModalEvent) return;
      return adminApi.sendTestNotification(testModalEvent, recipientEmail);
    },
    onSuccess: () => {
      setTestSuccess(true);
      setTimeout(() => {
        setTestSuccess(false);
        setTestModalEvent(null);
      }, 2000);
    },
  });

  const columns: Column<INotificationTemplate>[] = [
    {
      header: 'Event Trigger',
      accessor: (t) => (
        <span className="font-bold text-neutral-900 text-xs">
          {t.event}
        </span>
      ),
    },
    {
      header: 'Email / Message Subject',
      accessor: (t) => (
        <span className="text-neutral-700 font-mono text-[11px] block truncate max-w-md">
          {t.subject}
        </span>
      ),
    },
    {
      header: 'Channel Delivery',
      accessor: (t) => (
        <span className="text-xs text-neutral-500 font-medium">{t.channel}</span>
      ),
    },
    {
      header: 'Status',
      accessor: () => (
        <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-500">
          AUTOMATED LIVE
        </span>
      ),
    },
    {
      header: 'Action',
      align: 'right',
      accessor: (t) => (
        <button
          onClick={() => {
            setTestModalEvent(t.event);
            setTestSuccess(false);
          }}
          className="px-3 py-1 rounded-lg border border-neutral-300 text-[11px] font-semibold text-neutral-700 hover:bg-neutral-100 transition-colors"
        >
          Dispatch Test
        </button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-neutral-200 ">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-yellow-600 block mb-1">
            Transactional Communications
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold font-serif-luxury text-neutral-900 uppercase tracking-tight">
            Client Notifications & Alerts
          </h1>
          <p className="text-xs text-neutral-500 mt-1">
            Automated event-triggered email and SMS templates for order placement, payment, courier tracking, and gift cards.
          </p>
        </div>
      </div>

      {/* Table */}
      <DataTable
        columns={columns}
        data={templates}
        keyExtractor={(t) => t.id}
        isLoading={isLoading}
        emptyTitle="NO NOTIFICATION TEMPLATES"
        emptySubtitle="System notification templates will populate here."
      />

      {/* TEST DISPATCH MODAL */}
      <Modal
        isOpen={Boolean(testModalEvent)}
        onClose={() => setTestModalEvent(null)}
        title={`Test Trigger: ${testModalEvent}`}
        subtitle="Simulate real customer email delivery with dummy payload."
      >
        <div className="space-y-4 text-xs">
          {testSuccess ? (
            <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-500 flex items-center space-x-2">
              <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
              <span>Test email dispatched successfully to {recipientEmail}.</span>
            </div>
          ) : (
            <>
              <div>
                <label className="block text-neutral-700 font-semibold mb-1">
                  Recipient Test Email Address
                </label>
                <input
                  type="email"
                  value={recipientEmail}
                  onChange={(e) => setRecipientEmail(e.target.value)}
                  className="w-full bg-neutral-50 border border-neutral-300 rounded-lg p-2.5 text-neutral-900 focus:outline-none focus:border-yellow-400"
                />
              </div>

              <div className="pt-3 border-t border-neutral-200 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setTestModalEvent(null)}
                  className="px-4 py-2 border border-neutral-300 rounded-lg text-neutral-600 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={sendTestMutation.isPending}
                  onClick={() => sendTestMutation.mutate()}
                  className="px-6 py-2 bg-yellow-400 text-neutral-950 rounded-lg font-bold uppercase tracking-wider"
                >
                  {sendTestMutation.isPending ? 'Sending...' : 'Send Test Notification'}
                </button>
              </div>
            </>
          )}
        </div>
      </Modal>
    </div>
  );
};

export default NotificationsPage;
