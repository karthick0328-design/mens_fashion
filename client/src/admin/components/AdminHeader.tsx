import React, { useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import {
  Menu,
  Search,
  Bell,
  ChevronDown,
  LogOut,
  User,
  Shield,
  Settings,
  PackageCheck,
  AlertTriangle,
  MessageSquare,
  CreditCard,
  RotateCcw,
} from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';

interface AdminHeaderProps {
  onToggleMobileSidebar: () => void;
  onOpenGlobalSearch: () => void;
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({
  onToggleMobileSidebar,
  onOpenGlobalSearch,
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);

  const profileRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setIsProfileOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setIsNotifOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Format breadcrumb based on current path
  const pathSegments = location.pathname.split('/').filter(Boolean);
  const breadcrumbTitle = pathSegments.length > 1
    ? pathSegments[1].replace(/-/g, ' ').toUpperCase()
    : 'DASHBOARD';

  const notifications = [
    {
      id: 1,
      title: 'New Haute Order #AUR-82910',
      description: 'Customer Karthick R. placed order for ₹18,450',
      time: '12m ago',
      icon: PackageCheck,
      color: 'text-emerald-500 bg-emerald-500/10',
      link: '/admin/orders',
    },
    {
      id: 2,
      title: 'Low Stock Alert (SKU: AUR-S-BLK)',
      description: 'Pima Cotton Crew Neck has 2 pieces remaining',
      time: '45m ago',
      icon: AlertTriangle,
      color: 'text-amber-500 bg-yellow-400/15',
      link: '/admin/inventory',
    },
    {
      id: 3,
      title: 'New Atelier Review Submitted',
      description: '5-star review on Cashmere Overcoat awaiting moderation',
      time: '2h ago',
      icon: MessageSquare,
      color: 'text-sky-500 bg-sky-500/10',
      link: '/admin/reviews',
    },
    {
      id: 4,
      title: 'UPI Payment Settlement Verified',
      description: '₹24,900 cleared for Order #AUR-82894',
      time: '4h ago',
      icon: CreditCard,
      color: 'text-yellow-600 bg-yellow-400/15',
      link: '/admin/payments',
    },
    {
      id: 5,
      title: 'Sartorial Exchange Requested',
      description: 'Customer requested size swap for Velvet Evening Jacket',
      time: '6h ago',
      icon: RotateCcw,
      color: 'text-purple-500 bg-purple-500/10',
      link: '/admin/orders',
    },
  ];

  return (
    <header className="sticky top-0 z-20 h-16 bg-white border-b border-neutral-200 px-4 sm:px-6 flex items-center justify-between transition-colors">
      {/* Left: Mobile Toggle & Breadcrumb */}
      <div className="flex items-center space-x-3 sm:space-x-4">
        <button
          onClick={onToggleMobileSidebar}
          className="md:hidden p-2 rounded-lg text-neutral-500 hover:bg-neutral-100 transition-colors"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-2 text-xs">
          <Link
            to="/admin/dashboard"
            className="text-neutral-400 hover:text-neutral-700 uppercase font-semibold tracking-wider text-[11px]"
          >
            AURELIUS
          </Link>
          <span className="text-neutral-300 ">/</span>
          <span className="font-bold font-serif-luxury tracking-widest text-yellow-600 text-[11px] truncate max-w-[110px] sm:max-w-none">
            {breadcrumbTitle}
          </span>
        </div>
      </div>

      {/* Center: Global Search quick trigger */}
      <div className="hidden lg:flex items-center flex-1 max-w-md mx-8">
        <button
          onClick={onOpenGlobalSearch}
          className="w-full flex items-center justify-between px-3.5 py-2 rounded-lg bg-neutral-50 hover:bg-white border border-neutral-200 text-neutral-400 text-xs hover:border-yellow-400 transition-all shadow-none"
        >
          <div className="flex items-center space-x-2">
            <Search className="w-3.5 h-3.5 text-yellow-600" />
            <span className="text-[11px] text-neutral-500 font-medium">Search products, clients, orders, SKUs...</span>
          </div>
          <kbd className="px-1.5 py-0.5 text-[9px] font-mono font-semibold rounded bg-white text-neutral-600 border border-neutral-200 shadow-sm">
            Ctrl+K
          </kbd>
        </button>
      </div>

      {/* Right Actions */}
      <div className="flex items-center space-x-2 sm:space-x-3">
        {/* Search button on smaller screens */}
        <button
          onClick={onOpenGlobalSearch}
          className="lg:hidden p-2 rounded-lg text-neutral-500 hover:text-neutral-900 hover:bg-yellow-50 transition-colors"
        >
          <Search className="w-4 h-4 text-yellow-600" />
        </button>

        {/* Live Studio Status Pill */}
        <div className="hidden sm:flex items-center space-x-1.5 px-3 py-1 rounded-full bg-yellow-50 border border-yellow-200 text-yellow-800 text-[10px] font-bold tracking-wider uppercase">
          <span className="w-1.5 h-1.5 rounded-full bg-yellow-500 animate-pulse" />
          <span>Atelier Live</span>
        </div>

        {/* Notifications Popover */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setIsNotifOpen((v) => !v)}
            className="relative p-2 rounded-lg text-neutral-500 hover:bg-neutral-100 transition-colors"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-yellow-400" />
          </button>

          {isNotifOpen && (
            <div className="absolute right-0 mt-2 w-[calc(100vw-2rem)] max-w-sm sm:w-96 rounded-xl bg-white border border-neutral-200 shadow-2xl py-2 z-50 animate-in fade-in zoom-in-95 duration-100">
              <div className="px-4 py-2.5 border-b border-neutral-100 flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-neutral-900 font-serif-luxury">
                  Notifications
                </span>
                <span className="text-[10px] font-bold text-yellow-700 bg-yellow-50 px-2 py-0.5 rounded">5 unread</span>
              </div>

              <div className="divide-y divide-neutral-100 max-h-72 overflow-y-auto custom-scrollbar">
                {notifications.map((n) => {
                  const Icon = n.icon;
                  return (
                    <Link
                      key={n.id}
                      to={n.link}
                      onClick={() => setIsNotifOpen(false)}
                      className="p-3 flex items-start space-x-3 hover:bg-neutral-50 transition-colors"
                    >
                      <div className={`p-2 rounded-lg flex-shrink-0 ${n.color}`}>
                        <Icon className="w-3.5 h-3.5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-neutral-900 truncate">
                          {n.title}
                        </p>
                        <p className="text-[11px] text-neutral-500 line-clamp-1">
                          {n.description}
                        </p>
                        <span className="text-[10px] text-neutral-400 mt-0.5 block">
                          {n.time}
                        </span>
                      </div>
                    </Link>
                  );
                })}
              </div>

              <div className="px-4 py-2 border-t border-neutral-100 text-center">
                <Link
                  to="/admin/notifications"
                  onClick={() => setIsNotifOpen(false)}
                  className="text-[11px] font-semibold text-yellow-600 hover:underline uppercase tracking-wider"
                >
                  Manage System Templates & Logs
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Profile Avatar & Dropdown */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => setIsProfileOpen((v) => !v)}
            className="flex items-center space-x-2.5 p-1 rounded-lg hover:bg-neutral-100 transition-colors"
          >
            <div className="w-8 h-8 rounded-lg bg-yellow-400 text-neutral-950 border border-yellow-500 flex items-center justify-center font-serif-luxury font-bold text-xs shadow-sm">
              {user?.name ? user.name.charAt(0).toUpperCase() : 'A'}
            </div>
            <div className="hidden sm:flex flex-col text-left">
              <span className="text-xs font-bold text-neutral-900 line-clamp-1 max-w-[110px]">
                {user?.name || 'Aurelius Admin'}
              </span>
              <span className="text-[9px] font-mono tracking-wider font-semibold text-yellow-600 uppercase">
                {user?.role || 'SUPER ADMIN'}
              </span>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-neutral-400" />
          </button>

          {isProfileOpen && (
            <div className="absolute right-0 mt-2 w-56 max-w-[calc(100vw-2rem)] rounded-xl bg-white border border-neutral-200 shadow-2xl py-1.5 z-50 animate-in fade-in zoom-in-95 duration-100 text-xs">
              <div className="px-4 py-3 border-b border-neutral-100 ">
                <p className="font-bold text-neutral-900 ">{user?.name || 'Executive Admin'}</p>
                <p className="text-[11px] text-neutral-500 truncate">{user?.email || 'admin@example.com'}</p>
                <span className="inline-block mt-1 px-2 py-0.5 rounded text-[9px] font-mono font-bold bg-yellow-400/20 text-yellow-800 border border-yellow-400/40">
                  {user?.role || 'SUPER_ADMIN'}
                </span>
              </div>

              <div className="py-1">
                <Link
                  to="/admin/settings?tab=profile"
                  onClick={() => setIsProfileOpen(false)}
                  className="flex items-center space-x-2.5 px-4 py-2 text-neutral-700 hover:bg-neutral-100 transition-colors"
                >
                  <User className="w-4 h-4 text-neutral-400" />
                  <span>My Profile</span>
                </Link>
                <Link
                  to="/admin/settings?tab=store"
                  onClick={() => setIsProfileOpen(false)}
                  className="flex items-center space-x-2.5 px-4 py-2 text-neutral-700 hover:bg-neutral-100 transition-colors"
                >
                  <Settings className="w-4 h-4 text-neutral-400" />
                  <span>Account Settings</span>
                </Link>
                <Link
                  to="/admin/settings?tab=security"
                  onClick={() => setIsProfileOpen(false)}
                  className="flex items-center space-x-2.5 px-4 py-2 text-neutral-700 hover:bg-neutral-100 transition-colors"
                >
                  <Shield className="w-4 h-4 text-neutral-400" />
                  <span>Security & 2FA</span>
                </Link>
              </div>

              <div className="pt-1 border-t border-neutral-100 ">
                <button
                  onClick={() => {
                    setIsProfileOpen(false);
                    logout();
                    navigate('/login');
                  }}
                  className="w-full flex items-center space-x-2.5 px-4 py-2 text-rose-600 hover:bg-rose-50 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
