import React from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  Layers,
  ShoppingBag,
  Users,
  Store,
  LogOut,
  Shield,
} from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';

export const AdminLayout: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAdmin, logout } = useAuthStore();

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-neutral-950 text-white flex flex-col items-center justify-center p-6 text-center">
        <Shield className="w-16 h-16 text-rose-500 mb-4" />
        <h1 className="text-2xl font-bold font-serif-luxury mb-2">Access Restricted</h1>
        <p className="text-xs text-neutral-400 max-w-sm mb-6">
          Administrator privileges are required to access this portal. Please log in with an authorized executive account.
        </p>
        <Link
          to="/login"
          className="bg-amber-500 text-neutral-950 font-bold text-xs uppercase px-6 py-2.5 rounded"
        >
          Sign In as Admin
        </Link>
      </div>
    );
  }

  const navItems = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Products Catalog', path: '/admin/products', icon: Package },
    { name: 'Live Inventory', path: '/admin/inventory', icon: Layers },
    { name: 'Customer Orders', path: '/admin/orders', icon: ShoppingBag },
    { name: 'Customer Directory', path: '/admin/customers', icon: Users },
  ];

  return (
    <div className="min-h-screen bg-neutral-900 text-neutral-100 flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-neutral-950 border-r border-neutral-800 p-5 flex flex-col justify-between flex-shrink-0">
        <div className="space-y-6">
          {/* Brand & Portal Name */}
          <div className="flex items-center space-x-3 pb-4 border-b border-neutral-800">
            <span className="text-xl font-black uppercase tracking-[0.2em] font-serif-luxury text-amber-400">
              AURELIUS
            </span>
            <span className="bg-amber-500/10 border border-amber-500/30 text-amber-400 text-[10px] uppercase font-bold px-2 py-0.5 rounded">
              ADMIN
            </span>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1.5 text-xs font-semibold">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path || (item.path === '/admin/dashboard' && location.pathname === '/admin');
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`flex items-center space-x-3 px-3.5 py-3 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-amber-500 text-neutral-950 font-bold shadow-md'
                      : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* User Badge & Store Link */}
        <div className="pt-6 border-t border-neutral-800 space-y-2 text-xs">
          <Link
            to="/"
            className="flex items-center space-x-2 text-neutral-400 hover:text-white px-3 py-2 rounded hover:bg-neutral-900 transition-colors"
          >
            <Store className="w-4 h-4 text-amber-400" />
            <span>Back to Storefront</span>
          </Link>
          <button
            onClick={() => {
              logout();
              navigate('/login');
            }}
            className="w-full flex items-center space-x-2 text-red-400 hover:text-red-300 px-3 py-2 rounded hover:bg-neutral-900 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-6 md:p-8 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
