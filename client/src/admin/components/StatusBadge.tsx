import React from 'react';

interface StatusBadgeProps {
  status: string;
  type?: 'order' | 'stock' | 'payment' | 'general' | 'giftcard';
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, type = 'general', className = '' }) => {
  const norm = (status || '').toUpperCase();

  let styles = 'bg-neutral-100 text-neutral-700 border-neutral-200 ';

  if (type === 'order') {
    switch (norm) {
      case 'DELIVERED':
        styles = 'bg-emerald-50 text-emerald-700 border-emerald-200 ';
        break;
      case 'SHIPPED':
        styles = 'bg-sky-50 text-sky-700 border-sky-200 ';
        break;
      case 'PROCESSING':
      case 'CONFIRMED':
        styles = 'bg-yellow-50 text-yellow-800 border-yellow-300 ';
        break;
      case 'PENDING':
        styles = 'bg-amber-50 text-amber-700 border-amber-200 ';
        break;
      case 'CANCELLED':
      case 'RETURNED':
        styles = 'bg-rose-50 text-rose-700 border-rose-200 ';
        break;
      case 'RETURN_REQUESTED':
        styles = 'bg-purple-50 text-purple-700 border-purple-200 ';
        break;
      default:
        styles = 'bg-neutral-100 text-neutral-700 border-neutral-200 ';
    }
  } else if (type === 'stock') {
    switch (norm) {
      case 'IN STOCK':
      case 'ACTIVE':
        styles = 'bg-emerald-50 text-emerald-700 border-emerald-200 ';
        break;
      case 'LOW STOCK':
        styles = 'bg-yellow-50 text-yellow-800 border-yellow-300 ';
        break;
      case 'OUT OF STOCK':
      case 'BLOCKED':
        styles = 'bg-rose-50 text-rose-700 border-rose-200 ';
        break;
      default:
        styles = 'bg-neutral-100 text-neutral-700 border-neutral-200 ';
    }
  } else if (type === 'payment') {
    switch (norm) {
      case 'PAID':
      case 'SUCCESSFUL':
        styles = 'bg-emerald-50 text-emerald-700 border-emerald-200 ';
        break;
      case 'PENDING':
        styles = 'bg-yellow-50 text-yellow-800 border-yellow-300 ';
        break;
      case 'REFUNDED':
        styles = 'bg-purple-50 text-purple-700 border-purple-200 ';
        break;
      case 'FAILED':
        styles = 'bg-rose-50 text-rose-700 border-rose-200 ';
        break;
      default:
        styles = 'bg-neutral-100 text-neutral-700 border-neutral-200 ';
    }
  } else if (type === 'giftcard') {
    switch (norm) {
      case 'ACTIVE':
        styles = 'bg-yellow-50 text-yellow-800 border-yellow-300 ';
        break;
      case 'REDEEMED':
        styles = 'bg-neutral-100 text-neutral-600 border-neutral-200 ';
        break;
      case 'EXPIRED':
      case 'DISABLED':
        styles = 'bg-rose-50 text-rose-700 border-rose-200 ';
        break;
      default:
        styles = 'bg-neutral-100 text-neutral-700 border-neutral-200 ';
    }
  }

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded text-[10px] font-mono font-medium tracking-wide border uppercase ${styles} ${className}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-70 mr-1.5" />
      {status}
    </span>
  );
};
