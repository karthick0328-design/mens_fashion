import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  Layers,
  Boxes,
  ShoppingBag,
  Users,
  CreditCard,
  Gift,
  Tag,
  Palette,
  Bell,
  Star,
  Heart,
  BarChart3,
  Truck,
  Settings,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Store,
} from 'lucide-react';

interface AdminSidebarProps {
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  isMobileOpen: boolean;
  onCloseMobile: () => void;
}

interface NavSection {
  title?: string;
  items: Array<{
    name: string;
    path: string;
    icon: React.ElementType;
    badge?: string;
  }>;
}

const navSections: NavSection[] = [
  {
    items: [
      { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    ],
  },
  {
    title: 'PRODUCT MANAGEMENT',
    items: [
      { name: 'Products', path: '/admin/products', icon: Package },
      { name: 'Categories & Collections', path: '/admin/categories', icon: Layers },
      { name: 'Inventory Control', path: '/admin/inventory', icon: Boxes },
    ],
  },
  {
    title: 'SALES & CLIENTELE',
    items: [
      { name: 'Orders', path: '/admin/orders', icon: ShoppingBag },
      { name: 'Customers', path: '/admin/customers', icon: Users },
      { name: 'Payments', path: '/admin/payments', icon: CreditCard },
      { name: 'Gift Cards', path: '/admin/gift-cards', icon: Gift },
    ],
  },
  {
    title: 'MARKETING & EDITORIAL',
    items: [
      { name: 'Coupons & Promotions', path: '/admin/coupons', icon: Tag },
      { name: 'Homepage / CMS', path: '/admin/cms', icon: Palette },
      { name: 'Notifications', path: '/admin/notifications', icon: Bell },
    ],
  },
  {
    title: 'CLIENT ENGAGEMENT',
    items: [
      { name: 'Reviews & Ratings', path: '/admin/reviews', icon: Star },
      { name: 'Wishlist & Activity', path: '/admin/wishlist-activity', icon: Heart },
    ],
  },
  {
    title: 'INTELLIGENCE',
    items: [
      { name: 'Reports & Analytics', path: '/admin/reports', icon: BarChart3 },
    ],
  },
  {
    title: 'SYSTEM CONFIGURATION',
    items: [
      { name: 'Shipping & Delivery', path: '/admin/shipping', icon: Truck },
      { name: 'Settings', path: '/admin/settings', icon: Settings },
    ],
  },
];

export const AdminSidebar: React.FC<AdminSidebarProps> = ({
  isCollapsed,
  onToggleCollapse,
  isMobileOpen,
  onCloseMobile,
}) => {
  const location = useLocation();

  const renderSidebarContent = (isMobileDrawer = false) => {
    const collapsed = isMobileDrawer ? false : isCollapsed;

    return (
      <div className="flex flex-col h-full bg-white text-neutral-800 border-r border-neutral-200 select-none">
        {/* Brand Header */}
        <div className="h-16 flex items-center justify-between px-5 border-b border-neutral-200 bg-white">
          {!collapsed ? (
            <div className="flex flex-col">
              <span className="text-base font-extrabold tracking-[0.25em] font-serif-luxury text-neutral-900">
                AURELIUS
              </span>
              <span className="text-[9px] tracking-[0.35em] text-yellow-600 uppercase font-bold -mt-0.5">
                ATELIER HOMME
              </span>
            </div>
          ) : (
            <div className="mx-auto w-8 h-8 rounded-lg bg-yellow-400 text-neutral-950 font-serif-luxury text-sm font-bold flex items-center justify-center shadow-sm">
              A
            </div>
          )}

          {/* Mobile Drawer Close Button */}
          {isMobileDrawer ? (
            <button
              onClick={onCloseMobile}
              className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-900 hover:bg-neutral-100 transition-colors"
              aria-label="Close sidebar"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
          ) : (
            /* Desktop Collapse Toggle */
            <button
              onClick={onToggleCollapse}
              className="hidden md:flex p-1.5 rounded-lg text-neutral-400 hover:text-neutral-900 hover:bg-neutral-100 transition-colors"
              title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
            >
              {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            </button>
          )}
        </div>

        {/* Navigation Sections */}
        <div className="flex-1 overflow-y-auto custom-scrollbar py-4 px-3 space-y-6">
          {navSections.map((section, sIndex) => (
            <div key={sIndex} className="space-y-1">
              {section.title && !collapsed && (
                <div className="px-3 pb-1 text-[9px] font-bold tracking-[0.2em] text-neutral-400 uppercase">
                  {section.title}
                </div>
              )}

              {section.items.map((item) => {
                const Icon = item.icon;
                const isActive =
                  item.path === '/admin/dashboard'
                    ? location.pathname === '/admin' || location.pathname === '/admin/dashboard'
                    : location.pathname.startsWith(item.path);

                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    onClick={onCloseMobile}
                    title={collapsed ? item.name : undefined}
                    className={`group relative flex items-center ${
                      collapsed ? 'justify-center px-2 py-2.5' : 'px-3 py-2'
                    } rounded-lg text-xs font-medium transition-all duration-150 ${
                      isActive
                        ? 'bg-yellow-50 text-neutral-900 font-bold border-l-4 border-yellow-500 shadow-sm'
                        : 'text-neutral-600 hover:text-neutral-950 hover:bg-yellow-50/60'
                    }`}
                  >
                    <Icon
                      className={`w-4 h-4 flex-shrink-0 transition-colors ${
                        isActive ? 'text-yellow-600' : 'text-neutral-400 group-hover:text-yellow-600'
                      }`}
                    />

                    {!collapsed && (
                      <span className="ml-3 truncate">{item.name}</span>
                    )}

                    {!collapsed && item.badge && (
                      <span className="ml-auto text-[9px] font-bold uppercase px-1.5 py-0.5 rounded bg-yellow-400 text-neutral-950">
                        {item.badge}
                      </span>
                    )}
                  </NavLink>
                );
              })}
            </div>
          ))}
        </div>

        {/* Footer Storefront Link */}
        <div className="p-3 border-t border-neutral-200 bg-white">
          <a
            href="/"
            target="_blank"
            rel="noreferrer"
            className={`flex items-center ${
              collapsed ? 'justify-center p-2' : 'px-3 py-2'
            } rounded-lg text-xs text-neutral-600 hover:text-neutral-950 hover:bg-yellow-100/60 transition-colors group`}
            title="Visit Customer Storefront"
          >
            <Store className="w-4 h-4 text-yellow-600 flex-shrink-0" />
            {!collapsed && (
              <>
                <span className="ml-3 font-semibold text-neutral-700 group-hover:text-neutral-950">
                  View Storefront
                </span>
                <ExternalLink className="w-3 h-3 ml-auto opacity-50 group-hover:opacity-100" />
              </>
            )}
          </a>
        </div>
      </div>
    );
  };

  return (
    <>
      {/* Desktop Fixed Sidebar */}
      <aside
        className={`hidden md:block fixed top-0 left-0 bottom-0 z-30 transition-all duration-300 ${
          isCollapsed ? 'w-18' : 'w-64'
        }`}
      >
        {renderSidebarContent(false)}
      </aside>

      {/* Mobile Drawer Overlay */}
      {isMobileOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-black/75 backdrop-blur-sm"
            onClick={onCloseMobile}
          />
          <div className="relative w-72 max-w-[85vw] h-full shadow-2xl z-10 animate-in slide-in-from-left duration-200">
            {renderSidebarContent(true)}
          </div>
        </div>
      )}
    </>
  );
};
