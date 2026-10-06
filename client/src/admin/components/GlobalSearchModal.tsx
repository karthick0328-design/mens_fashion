import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Package, ShoppingBag, Users, Layers, Settings, X, ArrowRight } from 'lucide-react';
import { Modal } from './Modal';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const quickLinks = [
    { label: 'Products Catalog', path: '/admin/products', icon: Package, category: 'Navigation' },
    { label: 'Create New Fashion Piece', path: '/admin/products/create', icon: Package, category: 'Actions' },
    { label: 'Live Inventory Control', path: '/admin/inventory', icon: Layers, category: 'Navigation' },
    { label: 'Client Orders', path: '/admin/orders', icon: ShoppingBag, category: 'Navigation' },
    { label: 'Customer Accounts', path: '/admin/customers', icon: Users, category: 'Navigation' },
    { label: 'Gift Cards & Vouchers', path: '/admin/gift-cards', icon: ShoppingBag, category: 'Navigation' },
    { label: 'Store Settings & Policies', path: '/admin/settings', icon: Settings, category: 'System' },
  ];

  const filteredLinks = query.trim()
    ? quickLinks.filter((item) => item.label.toLowerCase().includes(query.toLowerCase()))
    : quickLinks;

  const handleSelect = (path: string) => {
    onClose();
    navigate(path);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Global Atelier Spotlight" maxWidth="xl">
      <div className="space-y-4">
        {/* Search Input */}
        <div className="relative">
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type a command, page name, SKU, or section..."
            className="w-full bg-neutral-100 border border-neutral-300 rounded-xl pl-10 pr-10 py-3 text-neutral-900 placeholder:text-neutral-500 text-sm focus:outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400"
          />
          <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Results List */}
        <div className="space-y-1 max-h-80 overflow-y-auto custom-scrollbar">
          <div className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-neutral-400">
            {query ? 'Search Results' : 'Suggested Destinations'}
          </div>

          {filteredLinks.length === 0 ? (
            <div className="py-8 text-center text-neutral-500 text-xs">
              No results found for "{query}". Press Enter to search catalog.
            </div>
          ) : (
            filteredLinks.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.path}
                  onClick={() => handleSelect(item.path)}
                  className="w-full flex items-center justify-between p-2.5 rounded-lg text-left text-xs text-neutral-700 hover:bg-neutral-100 hover:text-neutral-900 transition-colors group"
                >
                  <div className="flex items-center space-x-3">
                    <div className="p-1.5 rounded-md bg-neutral-200 text-neutral-500 group-hover:text-yellow-600 group-hover:bg-yellow-50 transition-colors">
                      <Icon className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <span className="font-semibold block">{item.label}</span>
                      <span className="text-[10px] text-neutral-400">{item.category}</span>
                    </div>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-neutral-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
              );
            })
          )}
        </div>
      </div>
    </Modal>
  );
};
