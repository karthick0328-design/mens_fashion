import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Shield, User, Store, Lock, CheckCircle2, AlertCircle, Key } from 'lucide-react';
import adminApi from '../services/adminApi';
import { useAuthStore } from '../../store/useAuthStore';
import { IStoreSetting } from '../types/admin';

export const SettingsPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const queryClient = useQueryClient();
  const { user, setUser } = useAuthStore();
  const [activeTab, setActiveTab] = useState<'store' | 'profile' | 'roles' | 'security'>('store');
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [passwordError, setPasswordError] = useState('');

  // Read tab parameter from URL
  useEffect(() => {
    const tabParam = searchParams.get('tab');
    if (tabParam && ['store', 'profile', 'roles', 'security'].includes(tabParam)) {
      setActiveTab(tabParam as any);
    }
  }, [searchParams]);

  const handleTabChange = (tab: 'store' | 'profile' | 'roles' | 'security') => {
    setActiveTab(tab);
    setSearchParams({ tab });
  };

  // Store settings form state
  const [storeName, setStoreName] = useState('AURELIUS ATELIER HOMME');
  const [tagline, setTagline] = useState('High-End Luxury Menswear & Fine Accessories');
  const [contactEmail, setContactEmail] = useState('concierge@aurelius.com');
  const [phone, setPhone] = useState('+91 98765 43210');
  const [address, setAddress] = useState('402 High Street Phoenix, Lower Parel, Mumbai, Maharashtra 400013');
  const [currency, setCurrency] = useState('INR');
  const [timezone, setTimezone] = useState('Asia/Kolkata');
  const [taxPercentage, setTaxPercentage] = useState('12');
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [enable2FA, setEnable2FA] = useState(false);

  // Profile form state
  const [profileName, setProfileName] = useState(user?.name || 'Aurelius Executive');
  const [profileEmail, setProfileEmail] = useState(user?.email || 'admin@example.com');
  const [profilePhone, setProfilePhone] = useState(user?.phone || '+91 98765 43210');
  const [profileAvatar, setProfileAvatar] = useState(user?.avatar || '');

  // Password modification state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Fetch Settings
  const { data: settings } = useQuery<IStoreSetting>({
    queryKey: ['adminSettings'],
    queryFn: async () => {
      const res = await adminApi.getSettings();
      return res.data?.data;
    },
  });

  useEffect(() => {
    if (settings) {
      setStoreName(settings.storeName || 'AURELIUS ATELIER HOMME');
      setTagline(settings.tagline || '');
      setContactEmail(settings.contactEmail || '');
      setPhone(settings.phone || '');
      setAddress(settings.address || '');
      setCurrency(settings.currency || 'INR');
      setTimezone(settings.timezone || 'Asia/Kolkata');
      setTaxPercentage(String(settings.taxPercentage || 12));
      setMaintenanceMode(Boolean(settings.maintenanceMode));
      setEnable2FA(Boolean(settings.enable2FA));
    }
  }, [settings]);

  const saveSettingsMutation = useMutation({
    mutationFn: async () => {
      return adminApi.updateSettings({
        storeName,
        tagline,
        contactEmail,
        phone,
        address,
        currency,
        timezone,
        taxPercentage: parseFloat(taxPercentage) || 12,
        maintenanceMode,
        enable2FA,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminSettings'] });
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    },
  });

  const saveProfileMutation = useMutation({
    mutationFn: async () => {
      setPasswordError('');
      if (newPassword && newPassword !== confirmPassword) {
        throw new Error('New password and confirmation password do not match.');
      }
      return adminApi.updateProfile({
        name: profileName,
        email: profileEmail,
        phone: profilePhone,
        avatar: profileAvatar,
        currentPassword: currentPassword || undefined,
        newPassword: newPassword || undefined,
      });
    },
    onSuccess: (res) => {
      if (res.data?.data && user) {
        setUser({ ...user, ...res.data.data });
      }
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    },
    onError: (err: any) => {
      const msg = err?.response?.data?.message || err?.message || 'Failed to update admin profile credentials.';
      setPasswordError(msg);
    },
  });

  const roles = [
    {
      role: 'SUPER ADMIN',
      badge: 'Unconstrained Authority',
      description: 'Full unconstrained access to catalog, financial ledgers, settings, and staff permissions.',
      permissions: ['All System Modules', 'Store Settings', 'User Management', 'Financial Audits', 'CMS Editing'],
    },
    {
      role: 'ADMIN',
      badge: 'Executive Level',
      description: 'Complete operational management of garments, orders, patrons, and visual merchandising.',
      permissions: ['Products Catalog', 'Order Processing', 'Client Accounts', 'Coupons & CMS', 'Reports'],
    },
    {
      role: 'MANAGER',
      badge: 'Workshop & Logistics',
      description: 'Management of piece stock, fulfillment transitions, and warehouse logistics.',
      permissions: ['Catalog Inspection', 'Orders Dispatch', 'Live Inventory Stock Adjustment'],
    },
    {
      role: 'STAFF',
      badge: 'Concierge Support',
      description: 'Customer service desk personnel with read access to order statuses and client directories.',
      permissions: ['Orders View', 'Customer Lookup'],
    },
  ];

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-neutral-200 ">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-yellow-600 block mb-1">
            System Preferences
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold font-serif-luxury text-neutral-900 uppercase tracking-tight">
            Store & Security Settings
          </h1>
          <p className="text-xs text-neutral-500 mt-1">
            Maintain atelier contact profiles, role permissions, tax thresholds, and multi-factor security.
          </p>
        </div>

        {saveSuccess && (
          <div className="flex items-center space-x-2 text-emerald-600 text-xs font-semibold animate-in fade-in">
            <CheckCircle2 className="w-4 h-4" />
            <span>Preferences saved successfully!</span>
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="flex items-center space-x-2 overflow-x-auto no-scrollbar border-b border-neutral-200 pb-1 text-xs">
        {[
          { id: 'store', label: 'Storefront Settings', icon: Store },
          { id: 'profile', label: 'Executive Profile', icon: User },
          { id: 'roles', label: 'Roles & RBAC Matrix', icon: Shield },
          { id: 'security', label: 'Security & 2FA', icon: Lock },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id as any)}
              className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg font-semibold whitespace-nowrap transition-all ${
                activeTab === tab.id
                  ? 'bg-neutral-900 text-white font-bold shadow-sm'
                  : 'text-neutral-500 hover:text-neutral-900 '
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: STORE SETTINGS */}
      {activeTab === 'store' && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            saveSettingsMutation.mutate();
          }}
          className="bg-white border border-neutral-200 rounded-xl p-6 space-y-5 shadow-sm text-xs"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-neutral-700 font-semibold mb-1">
                Storefront Name
              </label>
              <input
                type="text"
                value={storeName}
                onChange={(e) => setStoreName(e.target.value)}
                className="w-full bg-neutral-50 border border-neutral-300 rounded-lg p-2.5 text-neutral-900 font-bold focus:outline-none focus:border-yellow-400"
              />
            </div>

            <div>
              <label className="block text-neutral-700 font-semibold mb-1">
                Atelier Brand Tagline
              </label>
              <input
                type="text"
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
                className="w-full bg-neutral-50 border border-neutral-300 rounded-lg p-2.5 text-neutral-900 focus:outline-none focus:border-yellow-400"
              />
            </div>

            <div>
              <label className="block text-neutral-700 font-semibold mb-1">
                Concierge Contact Email
              </label>
              <input
                type="email"
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                className="w-full bg-neutral-50 border border-neutral-300 rounded-lg p-2.5 text-neutral-900 focus:outline-none focus:border-yellow-400"
              />
            </div>

            <div>
              <label className="block text-neutral-700 font-semibold mb-1">
                Concierge Helpline Phone
              </label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-neutral-50 border border-neutral-300 rounded-lg p-2.5 text-neutral-900 focus:outline-none focus:border-yellow-400"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-neutral-700 font-semibold mb-1">
                Atelier Headquarters Address
              </label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full bg-neutral-50 border border-neutral-300 rounded-lg p-2.5 text-neutral-900 focus:outline-none focus:border-yellow-400"
              />
            </div>

            <div>
              <label className="block text-neutral-700 font-semibold mb-1">
                Storefront Currency
              </label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="w-full bg-neutral-50 border border-neutral-300 rounded-lg p-2.5 text-neutral-900 focus:outline-none focus:border-yellow-400"
              >
                <option value="INR">Indian Rupee (₹ INR)</option>
                <option value="USD">US Dollar ($ USD)</option>
                <option value="EUR">Euro (€ EUR)</option>
                <option value="GBP">British Pound (£ GBP)</option>
              </select>
            </div>

            <div>
              <label className="block text-neutral-700 font-semibold mb-1">
                Default GST Tax Rate (%)
              </label>
              <input
                type="number"
                value={taxPercentage}
                onChange={(e) => setTaxPercentage(e.target.value)}
                className="w-full bg-neutral-50 border border-neutral-300 rounded-lg p-2.5 text-neutral-900 font-mono focus:outline-none focus:border-yellow-400"
              />
            </div>
          </div>

          <div className="pt-3 border-t border-neutral-200 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="maintMode"
                checked={maintenanceMode}
                onChange={(e) => setMaintenanceMode(e.target.checked)}
                className="rounded border-neutral-300 text-yellow-600 focus:ring-yellow-400 cursor-pointer"
              />
              <label htmlFor="maintMode" className="text-xs font-semibold text-neutral-700 cursor-pointer">
                Enable Maintenance Mode (Customer Storefront Offline)
              </label>
            </div>

            <button
              type="submit"
              disabled={saveSettingsMutation.isPending}
              className="px-6 py-2.5 bg-yellow-400 hover:bg-yellow-500 text-neutral-950 rounded-lg font-bold uppercase tracking-wider text-xs shadow-sm transition-colors"
            >
              Save Store Preferences
            </button>
          </div>
        </form>
      )}

      {/* TAB 2: PROFILE */}
      {activeTab === 'profile' && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            saveProfileMutation.mutate();
          }}
          className="bg-white border border-neutral-200 rounded-xl p-6 space-y-5 shadow-sm text-xs"
        >
          {/* Executive All-Access Privilege Notice */}
          <div className="p-4 rounded-xl bg-yellow-500/10 border border-yellow-400/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-lg bg-yellow-400/20 flex items-center justify-center text-yellow-600 flex-shrink-0">
                <Shield className="w-5 h-5" />
              </div>
              <div>
                <p className="font-bold text-neutral-900 uppercase font-serif-luxury text-sm">
                  Executive Administrator Role: {user?.role || 'SUPER_ADMIN'}
                </p>
                <p className="text-[11px] text-neutral-500 mt-0.5">
                  Complete unconstrained operational access across all 17 administrative modules, products, orders, financial ledgers, and system settings.
                </p>
              </div>
            </div>
            <span className="self-start sm:self-auto px-3 py-1 rounded text-[10px] font-mono font-bold bg-yellow-400 text-neutral-950 uppercase tracking-wider whitespace-nowrap">
              ALL ACCESS ACTIVE
            </span>
          </div>

          {/* Form fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-neutral-700 font-semibold mb-1">
                Full Name
              </label>
              <input
                type="text"
                required
                value={profileName}
                onChange={(e) => setProfileName(e.target.value)}
                className="w-full bg-neutral-50 border border-neutral-300 rounded-lg p-2.5 text-neutral-900 focus:outline-none focus:border-yellow-400"
              />
            </div>

            <div>
              <label className="block text-neutral-700 font-semibold mb-1">
                Official Personnel Email (Login Username)
              </label>
              <input
                type="email"
                required
                value={profileEmail}
                onChange={(e) => setProfileEmail(e.target.value)}
                className="w-full bg-neutral-50 border border-neutral-300 rounded-lg p-2.5 text-neutral-900 focus:outline-none focus:border-yellow-400"
              />
            </div>

            <div>
              <label className="block text-neutral-700 font-semibold mb-1">
                Direct Contact Phone
              </label>
              <input
                type="text"
                value={profilePhone}
                onChange={(e) => setProfilePhone(e.target.value)}
                className="w-full bg-neutral-50 border border-neutral-300 rounded-lg p-2.5 text-neutral-900 focus:outline-none focus:border-yellow-400"
              />
            </div>

            <div>
              <label className="block text-neutral-700 font-semibold mb-1">
                Avatar Image URL (Optional)
              </label>
              <input
                type="text"
                placeholder="https://images.unsplash.com/..."
                value={profileAvatar}
                onChange={(e) => setProfileAvatar(e.target.value)}
                className="w-full bg-neutral-50 border border-neutral-300 rounded-lg p-2.5 text-neutral-900 focus:outline-none focus:border-yellow-400"
              />
            </div>
          </div>

          {/* Password Rotation Section */}
          <div className="pt-4 border-t border-neutral-200 space-y-3">
            <div className="flex items-center space-x-2">
              <Key className="w-4 h-4 text-yellow-600 " />
              <h3 className="font-bold text-neutral-900 uppercase font-serif-luxury text-xs">
                Update Administrator Password
              </h3>
            </div>
            <p className="text-neutral-500 text-[11px]">
              Leave password fields blank to only modify your personal contact information. Fill them in to change your login password.
            </p>

            {passwordError && (
              <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-500 text-[11px] flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{passwordError}</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-neutral-700 font-semibold mb-1">
                  Current Password
                </label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full bg-neutral-50 border border-neutral-300 rounded-lg p-2.5 text-neutral-900 focus:outline-none focus:border-yellow-400"
                />
              </div>
              <div>
                <label className="block text-neutral-700 font-semibold mb-1">
                  New Password
                </label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full bg-neutral-50 border border-neutral-300 rounded-lg p-2.5 text-neutral-900 focus:outline-none focus:border-yellow-400"
                />
              </div>
              <div>
                <label className="block text-neutral-700 font-semibold mb-1">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full bg-neutral-50 border border-neutral-300 rounded-lg p-2.5 text-neutral-900 focus:outline-none focus:border-yellow-400"
                />
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-neutral-200 flex justify-end">
            <button
              type="submit"
              disabled={saveProfileMutation.isPending}
              className="px-6 py-2.5 bg-yellow-400 text-neutral-950 rounded-lg font-bold uppercase tracking-wider text-xs shadow-sm hover:bg-yellow-500 transition-colors"
            >
              {saveProfileMutation.isPending ? 'Updating...' : 'Update Profile & Password'}
            </button>
          </div>
        </form>
      )}

      {/* TAB 3: ROLES MATRIX */}
      {activeTab === 'roles' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {roles.map((r) => (
            <div
              key={r.role}
              className="bg-white border border-neutral-200 rounded-xl p-5 shadow-sm space-y-3 text-xs"
            >
              <div className="flex items-center justify-between pb-2 border-b border-neutral-100 ">
                <span className="font-bold text-neutral-900 uppercase font-serif-luxury">
                  {r.role}
                </span>
                <span className="text-[10px] font-mono font-bold text-yellow-600 uppercase">
                  {r.badge}
                </span>
              </div>

              <p className="text-neutral-500 leading-relaxed">{r.description}</p>

              <div className="space-y-1 pt-2">
                <span className="text-[10px] uppercase font-bold text-neutral-400 block tracking-wider">
                  Permitted Modules:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {r.permissions.map((p, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 rounded text-[10px] font-medium bg-neutral-100 text-neutral-700 border border-neutral-200 "
                    >
                      {p}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 4: SECURITY & 2FA */}
      {activeTab === 'security' && (
        <div className="bg-white border border-neutral-200 rounded-xl p-6 space-y-6 shadow-sm text-xs">
          <div className="flex items-center justify-between pb-4 border-b border-neutral-100 ">
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-900 font-serif-luxury">
                Two-Factor Personnel Authentication (2FA)
              </h3>
              <p className="text-neutral-500 mt-0.5">
                Require biometric authentication or TOTP authenticator code upon signing into the atelier suite.
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                setEnable2FA((v) => !v);
                saveSettingsMutation.mutate();
              }}
              className={`px-4 py-2 rounded-lg font-bold uppercase tracking-wider text-[10px] transition-colors ${
                enable2FA
                  ? 'bg-emerald-600 text-white'
                  : 'bg-neutral-200 text-neutral-700 '
              }`}
            >
              {enable2FA ? '2FA ENABLED' : 'ENABLE 2FA'}
            </button>
          </div>

          <div className="space-y-2">
            <h4 className="font-bold text-neutral-900 uppercase font-serif-luxury text-xs">
              Active Session Audit
            </h4>
            <div className="p-3.5 rounded-lg border border-neutral-200 bg-neutral-50 flex items-center justify-between">
              <div>
                <span className="font-bold text-neutral-900 block">
                  Current Browser Session (Windows • Google Chrome)
                </span>
                <span className="text-[10px] text-neutral-400 font-mono">
                  IP: 127.0.0.1 • Authorized via JSON Web Token (Bearer)
                </span>
              </div>
              <span className="text-[10px] font-bold text-emerald-500 uppercase">ACTIVE NOW</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SettingsPage;
