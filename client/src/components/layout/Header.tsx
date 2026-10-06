import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Search,
  Heart,
  ShoppingBag,
  User as UserIcon,
  Menu,
  X,
  ChevronDown,
  Shield,
  Package,
  LogOut,
  LayoutDashboard,
} from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';
import { useCartStore } from '../../store/useCartStore';
import { useWishlistStore } from '../../store/useWishlistStore';

export const Header: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated, isAdmin, logout } = useAuthStore();
  const { cart, toggleCart, fetchCart } = useCartStore();
  const { wishlistIds } = useWishlistStore();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Sync user cart on initial mount
  useEffect(() => {
    if (isAuthenticated) {
      fetchCart();
    }
  }, [isAuthenticated, fetchCart]);

  // Close dropdowns on route or search change
  useEffect(() => {
    setMobileMenuOpen(false);
    setUserDropdownOpen(false);
  }, [location.pathname, location.search]);

  // Click outside to close user menu
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setUserDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const navLinks = [
    { name: 'Collection', path: '/products' },
    { name: 'Clothing', path: '/products?category=mens-clothing' },
    { name: 'Watches', path: '/products?category=watches' },
    { name: 'Footwear', path: '/products?category=footwear' },
    { name: 'Accessories', path: '/products?category=accessories' },
    { name: 'Gift Cards', path: '/gift-cards' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-neutral-100 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">
          {/* Mobile Menu Button */}
          <div className="flex items-center lg:hidden">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="p-2 -ml-2 text-neutral-700 hover:text-neutral-900 rounded-md focus:outline-none"
              aria-label="Open navigation menu"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>

          {/* Brand Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="group flex flex-col items-center">
              <span className="text-xl sm:text-2xl lg:text-3xl font-extrabold tracking-[0.15em] sm:tracking-[0.2em] uppercase font-serif-luxury text-neutral-950 group-hover:text-neutral-700 transition-colors">
                AURELIUS
              </span>
              <span className="text-[8px] sm:text-[9px] tracking-[0.25em] sm:tracking-[0.3em] uppercase text-neutral-500 font-medium -mt-0.5 sm:-mt-1">
                Atelier Homme
              </span>
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className="text-xs uppercase tracking-[0.15em] font-semibold text-neutral-700 hover:text-neutral-950 transition-colors relative py-1 after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1.5px] after:bg-neutral-900 hover:after:w-full after:transition-all"
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Search Bar */}
          <div className="hidden md:flex flex-1 max-w-xs lg:max-w-sm">
            <form onSubmit={handleSearchSubmit} className="relative w-full">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search premium apparel, watches, shoes..."
                className="w-full bg-neutral-50 border border-neutral-200 rounded-full pl-10 pr-4 py-2 text-xs text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-neutral-900 focus:bg-white transition-all shadow-inner"
              />
              <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </form>
          </div>

          {/* Right Action Icons */}
          <div className="flex items-center space-x-4 sm:space-x-6">
            {/* Wishlist */}
            <Link
              to="/user/mywhishlist"
              className="relative p-1 text-neutral-700 hover:text-neutral-950 transition-colors"
              title="Saved Wishlist"
            >
              <Heart className="w-5 h-5" />
              {wishlistIds.length > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-rose-600 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {wishlistIds.length}
                </span>
              )}
            </Link>

            {/* Shopping Bag / Cart */}
            <button
              onClick={toggleCart}
              className="relative p-1 text-neutral-700 hover:text-neutral-950 transition-colors focus:outline-none"
              title="Shopping Bag"
            >
              <ShoppingBag className="w-5 h-5" />
              {cart && cart.itemCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-neutral-900 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {cart.itemCount}
                </span>
              )}
            </button>

            {/* User Account Menu */}
            <div className="relative" ref={userMenuRef}>
              {isAuthenticated && user ? (
                <div>
                  <button
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    className="flex items-center space-x-2 text-xs font-semibold text-neutral-800 hover:text-neutral-950 focus:outline-none p-1"
                  >
                    <div className="w-7 h-7 rounded-full bg-neutral-900 text-white flex items-center justify-center font-bold text-xs uppercase">
                      {user.name.charAt(0)}
                    </div>
                    <span className="hidden sm:inline-block max-w-[100px] truncate">{user.name.split(' ')[0]}</span>
                    <ChevronDown className="w-3.5 h-3.5 text-neutral-400" />
                  </button>

                  {/* Dropdown Menu */}
                  {userDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl border border-neutral-100 py-1.5 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                      <div className="px-4 py-2 border-b border-neutral-100">
                        <p className="text-xs font-bold text-neutral-900 truncate">{user.name}</p>
                        <p className="text-[11px] text-neutral-500 truncate">{user.email}</p>
                      </div>

                      {isAdmin && (
                        <Link
                          to="/admin/dashboard"
                          className="flex items-center space-x-2.5 px-4 py-2.5 text-xs text-amber-700 hover:bg-amber-50 font-bold transition-colors"
                        >
                          <Shield className="w-3.5 h-3.5 text-amber-600" />
                          <span>Admin Portal</span>
                        </Link>
                      )}

                      <Link
                        to="/user/dashboard"
                        className="flex items-center space-x-2.5 px-4 py-2 text-xs text-neutral-800 hover:bg-neutral-50 font-semibold transition-colors"
                      >
                        <LayoutDashboard className="w-3.5 h-3.5 text-amber-600" />
                        <span>User Dashboard</span>
                      </Link>

                      <Link
                        to="/user/profile"
                        className="flex items-center space-x-2.5 px-4 py-2 text-xs text-neutral-700 hover:bg-neutral-50 transition-colors"
                      >
                        <UserIcon className="w-3.5 h-3.5 text-neutral-400" />
                        <span>My Profile</span>
                      </Link>

                      <Link
                        to="/user/order"
                        className="flex items-center space-x-2.5 px-4 py-2 text-xs text-neutral-700 hover:bg-neutral-50 transition-colors"
                      >
                        <Package className="w-3.5 h-3.5 text-neutral-400" />
                        <span>My Orders</span>
                      </Link>

                      <Link
                        to="/user/mywhishlist"
                        className="flex items-center space-x-2.5 px-4 py-2 text-xs text-neutral-700 hover:bg-neutral-50 transition-colors"
                      >
                        <Heart className="w-3.5 h-3.5 text-neutral-400" />
                        <span>My Wishlist</span>
                      </Link>

                      <Link
                        to="/user/mycart"
                        className="flex items-center space-x-2.5 px-4 py-2 text-xs text-neutral-700 hover:bg-neutral-50 transition-colors"
                      >
                        <ShoppingBag className="w-3.5 h-3.5 text-neutral-400" />
                        <span>My Shopping Bag</span>
                      </Link>

                      <div className="border-t border-neutral-100 my-1"></div>

                      <button
                        onClick={logout}
                        className="w-full flex items-center space-x-2.5 px-4 py-2 text-xs text-red-600 hover:bg-red-50 text-left transition-colors font-medium"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Link
                    to="/login"
                    className="text-xs uppercase tracking-wider font-semibold text-neutral-700 hover:text-neutral-900 px-3 py-1.5 rounded transition-colors"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/register"
                    className="hidden sm:inline-block bg-neutral-950 hover:bg-neutral-800 text-white text-xs uppercase tracking-wider font-bold px-3.5 py-1.5 rounded transition-colors"
                  >
                    Join
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Search Bar (underneath logo on small screens) */}
        <div className="pb-3 md:hidden">
          <form onSubmit={handleSearchSubmit} className="relative w-full">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products..."
              className="w-full bg-neutral-50 border border-neutral-200 rounded-full pl-9 pr-4 py-2 text-xs text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-neutral-900"
            />
            <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </form>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div
            className="fixed inset-0 bg-neutral-950/60 backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="relative w-4/5 max-w-xs bg-white h-full shadow-2xl p-6 flex flex-col justify-between overflow-y-auto">
            <div>
              <div className="flex items-center justify-between pb-6 border-b border-neutral-100">
                <span className="text-xl font-extrabold uppercase font-serif-luxury tracking-widest text-neutral-900">
                  AURELIUS
                </span>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1 rounded text-neutral-400 hover:text-neutral-900"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="py-6 space-y-4">
                <p className="text-[10px] uppercase font-bold text-neutral-400 tracking-widest">
                  Categories
                </p>
                {navLinks.map((link) => (
                  <Link
                    key={link.name}
                    to={link.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className="block text-sm font-semibold uppercase tracking-wider text-neutral-800 hover:text-neutral-950 py-1"
                  >
                    {link.name}
                  </Link>
                ))}
              </div>
            </div>

            <div className="pt-6 border-t border-neutral-100 space-y-3">
              {isAuthenticated ? (
                <>
                  <Link
                    to="/user/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block text-sm font-bold text-neutral-900 hover:text-amber-800 py-1"
                  >
                    User Dashboard
                  </Link>
                  <Link
                    to="/user/profile"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block text-sm font-medium text-neutral-800 hover:text-neutral-950 py-1"
                  >
                    My Profile
                  </Link>
                  <Link
                    to="/user/order"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block text-sm font-medium text-neutral-800 hover:text-neutral-950 py-1"
                  >
                    My Orders
                  </Link>
                  <Link
                    to="/user/mywhishlist"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block text-sm font-medium text-neutral-800 hover:text-neutral-950 py-1"
                  >
                    My Wishlist
                  </Link>
                  <Link
                    to="/user/mycart"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block text-sm font-medium text-neutral-800 hover:text-neutral-950 py-1"
                  >
                    My Shopping Bag
                  </Link>
                  {isAdmin && (
                    <Link
                      to="/admin/dashboard"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block text-sm font-bold text-amber-700 hover:text-amber-800 py-1"
                    >
                      Admin Dashboard
                    </Link>
                  )}
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      logout();
                    }}
                    className="w-full text-left text-sm font-semibold text-red-600 pt-2"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  <Link
                    to="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-center border border-neutral-300 py-2.5 rounded text-xs font-bold uppercase tracking-wider text-neutral-800"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-center bg-neutral-950 text-white py-2.5 rounded text-xs font-bold uppercase tracking-wider"
                  >
                    Join
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
