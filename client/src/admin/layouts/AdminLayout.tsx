import React, { useState, useEffect } from 'react';
import { Outlet, Link } from 'react-router-dom';
import { Shield } from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';
import { AdminSidebar } from '../components/AdminSidebar';
import { AdminHeader } from '../components/AdminHeader';
import { GlobalSearchModal } from '../components/GlobalSearchModal';
import { AdminThemeProvider } from '../context/AdminThemeContext';

export const AdminLayoutContent: React.FC = () => {
  const { isAdmin } = useAuthStore();
  const [isCollapsed, setIsCollapsed] = useState(() => {
    return localStorage.getItem('aurelius_sidebar_collapsed') === 'true';
  });
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Keyboard shortcut Ctrl+K / Cmd+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleToggleCollapse = () => {
    setIsCollapsed((prev) => {
      const next = !prev;
      localStorage.setItem('aurelius_sidebar_collapsed', String(next));
      return next;
    });
  };

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-white text-neutral-900 flex flex-col items-center justify-center p-6 text-center select-none">
        <div className="w-16 h-16 rounded-2xl bg-yellow-50 border border-yellow-200 flex items-center justify-center text-yellow-600 mb-5 shadow-sm">
          <Shield className="w-8 h-8" />
        </div>
        <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-yellow-600 mb-2 block">
          AURELIUS ATELIER HOMME
        </span>
        <h1 className="text-3xl font-extrabold uppercase tracking-tight font-serif-luxury mb-3 text-neutral-900">
          Executive Portal Restricted
        </h1>
        <p className="text-xs text-neutral-500 max-w-sm mb-8 leading-relaxed">
          Access to the administrative control suite requires authorized executive credentials. Please authenticate using your atelier personnel account.
        </p>
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <Link
            to="/login"
            className="w-full sm:w-auto bg-yellow-400 hover:bg-yellow-500 text-neutral-950 font-bold text-xs uppercase tracking-wider px-8 py-3 rounded-lg shadow-sm transition-colors"
          >
            Sign In as Administrator
          </Link>
          <a
            href="/"
            className="w-full sm:w-auto bg-neutral-100 hover:bg-neutral-200 text-neutral-800 font-semibold text-xs px-6 py-3 rounded-lg border border-neutral-200 transition-colors"
          >
            Return to Storefront
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-neutral-900 flex flex-col">
      {/* Sidebar */}
      <AdminSidebar
        isCollapsed={isCollapsed}
        onToggleCollapse={handleToggleCollapse}
        isMobileOpen={isMobileOpen}
        onCloseMobile={() => setIsMobileOpen(false)}
      />

      {/* Main Column */}
      <div
        className={`flex-1 flex flex-col bg-white transition-all duration-300 ${
          isCollapsed ? 'md:pl-18' : 'md:pl-64'
        }`}
      >
        <AdminHeader
          onToggleMobileSidebar={() => setIsMobileOpen((v) => !v)}
          onOpenGlobalSearch={() => setIsSearchOpen(true)}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-[1600px] w-full mx-auto bg-white">
          <Outlet />
        </main>
      </div>

      {/* Spotlight Command Modal */}
      <GlobalSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />
    </div>
  );
};

export const AdminLayout: React.FC = () => {
  return (
    <AdminThemeProvider>
      <AdminLayoutContent />
    </AdminThemeProvider>
  );
};

export default AdminLayout;
