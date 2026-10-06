import React from 'react';
import { ChevronLeft, ChevronRight, Inbox } from 'lucide-react';

export interface Column<T> {
  header: string;
  accessor?: keyof T | ((item: T) => React.ReactNode);
  className?: string;
  align?: 'left' | 'center' | 'right';
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  keyExtractor: (item: T) => string;
  isLoading?: boolean;
  emptyTitle?: string;
  emptySubtitle?: string;
  emptyAction?: React.ReactNode;
  pagination?: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    onPageChange: (page: number) => void;
  };
  selectable?: boolean;
  selectedIds?: string[];
  onSelectAll?: (selected: boolean) => void;
  onSelectItem?: (id: string, selected: boolean) => void;
}

export function DataTable<T>({
  columns,
  data,
  keyExtractor,
  isLoading,
  emptyTitle = 'No records found',
  emptySubtitle = 'Try adjusting your filters or search query to find what you are looking for.',
  emptyAction,
  pagination,
  selectable,
  selectedIds = [],
  onSelectAll,
  onSelectItem,
}: DataTableProps<T>) {
  const isAllSelected = data.length > 0 && data.every((item) => selectedIds.includes(keyExtractor(item)));

  return (
    <div className="bg-white border border-neutral-200 rounded-xl overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-neutral-200 bg-neutral-50/80 text-neutral-500 font-bold uppercase tracking-wider text-[10px]">
              {selectable && (
                <th className="py-3 px-4 w-10 text-center">
                  <input
                    type="checkbox"
                    checked={isAllSelected}
                    onChange={(e) => onSelectAll && onSelectAll(e.target.checked)}
                    className="rounded border-neutral-300 text-yellow-500 focus:ring-yellow-400 cursor-pointer"
                  />
                </th>
              )}
              {columns.map((col, index) => (
                <th
                  key={index}
                  className={`py-3.5 px-4 font-semibold ${
                    col.align === 'right' ? 'text-right' : col.align === 'center' ? 'text-center' : 'text-left'
                  } ${col.className || ''}`}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100 text-neutral-700 ">
            {isLoading ? (
              <tr>
                <td colSpan={columns.length + (selectable ? 1 : 0)} className="py-16 text-center">
                  <div className="inline-flex items-center space-x-2 text-neutral-400">
                    <div className="w-4 h-4 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin" />
                    <span className="text-xs tracking-wider uppercase font-medium">Loading records...</span>
                  </div>
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={columns.length + (selectable ? 1 : 0)} className="py-16 text-center">
                  <div className="max-w-xs mx-auto space-y-3">
                    <div className="w-12 h-12 rounded-full bg-neutral-100 flex items-center justify-center mx-auto text-neutral-400">
                      <Inbox className="w-6 h-6 stroke-1 text-yellow-500" />
                    </div>
                    <h4 className="text-sm font-bold uppercase tracking-wider text-neutral-900 font-serif-luxury">
                      {emptyTitle}
                    </h4>
                    <p className="text-xs text-neutral-500 ">
                      {emptySubtitle}
                    </p>
                    {emptyAction && <div className="pt-2">{emptyAction}</div>}
                  </div>
                </td>
              </tr>
            ) : (
              data.map((item) => {
                const id = keyExtractor(item);
                const isSelected = selectedIds.includes(id);

                return (
                  <tr
                    key={id}
                    className={`hover:bg-neutral-50/70 transition-colors ${
                      isSelected ? 'bg-yellow-50/60 ' : ''
                    }`}
                  >
                    {selectable && (
                      <td className="py-3 px-4 text-center">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={(e) => onSelectItem && onSelectItem(id, e.target.checked)}
                          className="rounded border-neutral-300 text-yellow-500 focus:ring-yellow-400 cursor-pointer"
                        />
                      </td>
                    )}
                    {columns.map((col, index) => {
                      const content =
                        typeof col.accessor === 'function'
                          ? col.accessor(item)
                          : col.accessor
                          ? (item[col.accessor] as any)
                          : null;

                      return (
                        <td
                          key={index}
                          className={`py-3.5 px-4 ${
                            col.align === 'right'
                              ? 'text-right'
                              : col.align === 'center'
                              ? 'text-center'
                              : 'text-left'
                          } ${col.className || ''}`}
                        >
                          {content}
                        </td>
                      );
                    })}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      {pagination && pagination.totalPages > 1 && (
        <div className="px-4 sm:px-6 py-4 border-t border-neutral-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-neutral-500 bg-neutral-50/50 text-center sm:text-left">
          <span>
            Showing page <strong className="text-neutral-900 ">{pagination.currentPage}</strong> of{' '}
            <strong className="text-neutral-900 ">{pagination.totalPages}</strong> (
            {pagination.totalItems} entries)
          </span>

          <div className="flex items-center space-x-2">
            <button
              disabled={pagination.currentPage <= 1}
              onClick={() => pagination.onPageChange(pagination.currentPage - 1)}
              className="p-1.5 rounded-lg border border-neutral-200 hover:bg-neutral-100 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              disabled={pagination.currentPage >= pagination.totalPages}
              onClick={() => pagination.onPageChange(pagination.currentPage + 1)}
              className="p-1.5 rounded-lg border border-neutral-200 hover:bg-neutral-100 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
