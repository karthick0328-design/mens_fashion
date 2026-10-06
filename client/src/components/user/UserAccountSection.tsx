import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  User as UserIcon,
  MapPin,
  CreditCard,
  Tag,
  Star,
  Heart,
  ShoppingBag,
  LogOut,
  ChevronRight,
  Plus,
  Trash2,
  Edit2,
  CheckCircle2,
  Shield,
  Copy,
  Check,
} from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';
import api from '../../services/api';
import { IAddress } from '../../types';
import GiftCardShowcase from '../giftcard/GiftCardShowcase';

export type AccountTab =
  | 'profile'
  | 'addresses'
  | 'pan'
  | 'giftcards'
  | 'upi'
  | 'cards'
  | 'coupons'
  | 'reviews'
  | 'notifications';

interface UserAccountSectionProps {
  initialTab?: AccountTab;
}

export const UserAccountSection: React.FC<UserAccountSectionProps> = ({
  initialTab = 'profile',
}) => {
  const navigate = useNavigate();
  const { user, setUser, logout, isAdmin } = useAuthStore();
  const [activeTab, setActiveTab] = useState<AccountTab>(initialTab);

  // Edit Personal Information state
  const [isEditingPersonal, setIsEditingPersonal] = useState(false);
  const [firstName, setFirstName] = useState(user?.name ? user.name.split(' ')[0] : '');
  const [lastName, setLastName] = useState(user?.name ? user.name.split(' ').slice(1).join(' ') : '');
  const [gender, setGender] = useState<'Male' | 'Female'>('Male');

  // Edit Email state
  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const [emailValue, setEmailValue] = useState(user?.email || '');

  // Edit Mobile state
  const [isEditingMobile, setIsEditingMobile] = useState(false);
  const [mobileValue, setMobileValue] = useState(user?.phone || '+91 97874 21490');

  // Address Modal/Form State
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState<string | null>(null);
  const [addressForm, setAddressForm] = useState<Partial<IAddress>>({
    name: user?.name || '',
    phone: user?.phone || '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'India',
    isDefault: false,
  });

  // PAN Card State
  const [panNumber, setPanNumber] = useState('ABCDE1234F');
  const [panName, setPanName] = useState(user?.name || '');
  const [panSaved, setPanSaved] = useState(false);

  // Gift Card State
  const [giftCardCode, setGiftCardCode] = useState('');
  const [giftCardPin, setGiftCardPin] = useState('');
  const [giftCardBalance, setGiftCardBalance] = useState(0);
  const [giftCardSuccess, setGiftCardSuccess] = useState<string | null>(null);

  // UPI State
  const [savedUpiList, setSavedUpiList] = useState<string[]>([
    'aurelius.vip@okhdfcbank',
    '9787421490@paytm',
  ]);
  const [newUpiId, setNewUpiId] = useState('');
  const [showAddUpi, setShowAddUpi] = useState(false);

  // Saved Cards State
  const [savedCards, setSavedCards] = useState([
    { id: '1', bank: 'HDFC Bank', type: 'VISA', last4: '4242', holder: user?.name || 'Aurelius Gentleman', exp: '08/28' },
    { id: '2', bank: 'ICICI Bank', type: 'Mastercard', last4: '8819', holder: user?.name || 'Aurelius Gentleman', exp: '11/27' },
  ]);

  // Notifications State
  const [notifications] = useState([
    {
      id: '1',
      title: 'Order AUR-ORD-9421 Dispatched',
      desc: 'Your bespoke wool blazer has been dispatched from our Mumbai atelier.',
      time: '2 hours ago',
      unread: true,
    },
    {
      id: '2',
      title: 'Exclusive Atelier VIP Access',
      desc: 'Autumn/Winter Sartorial capsule collection is now live for private viewing.',
      time: 'Yesterday',
      unread: false,
    },
    {
      id: '3',
      title: 'Welcome to AURELIUS Privé',
      desc: 'Your customer membership has been upgraded to executive privilege status.',
      time: '3 days ago',
      unread: false,
    },
  ]);

  // Coupons State
  const [copiedCoupon, setCopiedCoupon] = useState<string | null>(null);
  const coupons = [
    { code: 'WELCOME10', discount: '10% OFF', desc: 'Flat 10% discount on orders above ₹1,999', expiry: '31 Dec 2026' },
    { code: 'AURELIUS500', discount: '₹500 OFF', desc: 'Flat ₹500 off on pure cashmere and leather footwear', expiry: '15 Nov 2026' },
    { code: 'PRIVELUXE', discount: '15% OFF', desc: 'VIP 15% discount for verified atelier members', expiry: '28 Feb 2027' },
  ];

  const handleCopyCoupon = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCoupon(code);
    setTimeout(() => setCopiedCoupon(null), 2500);
  };

  const handleSavePersonalInfo = async () => {
    try {
      const updatedName = `${firstName.trim()} ${lastName.trim()}`.trim();
      const res = await api.put('/users/profile', { name: updatedName, phone: mobileValue });
      if (res.data?.success && user) {
        setUser({ ...user, name: updatedName, phone: mobileValue });
      }
      setIsEditingPersonal(false);
    } catch (err: any) {
      alert(err.response?.data?.message || 'Could not update profile');
    }
  };

  const handleSaveMobile = async () => {
    try {
      const res = await api.put('/users/profile', { phone: mobileValue });
      if (res.data?.success && user) {
        setUser({ ...user, phone: mobileValue });
      }
      setIsEditingMobile(false);
    } catch (err: any) {
      alert(err.response?.data?.message || 'Could not update mobile number');
    }
  };

  const handleSaveAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    try {
      if (editingAddressId) {
        const res = await api.put(`/users/addresses/${editingAddressId}`, addressForm);
        if (res.data?.success) {
          setUser({ ...user, addresses: res.data.data });
        }
      } else {
        const res = await api.post('/users/addresses', addressForm);
        if (res.data?.success) {
          setUser({ ...user, addresses: res.data.data });
        }
      }
      setShowAddressModal(false);
      setEditingAddressId(null);
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to save address');
    }
  };

  const handleDeleteAddress = async (id?: string) => {
    if (!id || !user || !window.confirm('Are you sure you want to remove this address?')) return;
    try {
      const res = await api.delete(`/users/addresses/${id}`);
      if (res.data?.success) {
        setUser({ ...user, addresses: res.data.data });
      }
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to delete address');
    }
  };

  const handleSetDefaultAddress = async (id?: string) => {
    if (!id || !user) return;
    try {
      const res = await api.patch(`/users/addresses/${id}/default`);
      if (res.data?.success) {
        setUser({ ...user, addresses: res.data.data });
      }
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to set default address');
    }
  };

  const handleAddGiftCard = (e: React.FormEvent) => {
    e.preventDefault();
    if (giftCardCode.trim().length >= 4) {
      setGiftCardBalance((prev) => prev + 1000);
      setGiftCardSuccess('₹1,000 Gift voucher successfully credited to your account balance!');
      setGiftCardCode('');
      setGiftCardPin('');
      setTimeout(() => setGiftCardSuccess(null), 4000);
    }
  };

  const handleAddUpi = (e: React.FormEvent) => {
    e.preventDefault();
    if (newUpiId.trim() && newUpiId.includes('@')) {
      setSavedUpiList([...savedUpiList, newUpiId.trim()]);
      setNewUpiId('');
      setShowAddUpi(false);
    }
  };

  if (!user) return null;

  return (
    <div className="w-full">
      {/* Mobile & Tablet Quick Nav Tabs */}
      <div className="lg:hidden w-full bg-white border border-neutral-200 rounded-xl p-2.5 shadow-sm overflow-x-auto no-scrollbar flex items-center space-x-2 text-xs mb-4">
        {[
          { id: 'profile', label: 'Profile' },
          { id: 'addresses', label: 'Addresses' },
          { id: 'pan', label: 'PAN Card' },
          { id: 'giftcards', label: 'Gift Cards' },
          { id: 'upi', label: 'Saved UPI' },
          { id: 'cards', label: 'Cards' },
          { id: 'coupons', label: 'Coupons' },
          { id: 'notifications', label: 'Notifications' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as AccountTab)}
            className={`px-3.5 py-1.5 rounded-lg font-semibold whitespace-nowrap transition-all ${
              activeTab === tab.id
                ? 'bg-neutral-900 text-white shadow-sm'
                : 'text-neutral-600 hover:text-neutral-900 bg-neutral-100'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* ======================================================== */}
        {/* LEFT NAVIGATION SIDEBAR (Desktop)                        */}
        {/* ======================================================== */}
        <aside className="hidden lg:block lg:col-span-4 xl:col-span-3 space-y-4">
          {/* User Card: Hello, {Name} */}
          <div className="bg-white border border-neutral-200 rounded-lg p-4 shadow-sm flex items-center space-x-4">
            <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-amber-600 to-amber-400 text-neutral-950 flex items-center justify-center font-bold text-lg font-serif-luxury shadow-md flex-shrink-0">
            {(user?.name || 'A').charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0">
            <span className="text-[11px] text-neutral-500 block leading-tight">Hello,</span>
            <h3 className="text-sm font-bold text-neutral-900 truncate">{user?.name || 'Aurelius Member'}</h3>
            {isAdmin && (
              <span className="inline-block mt-0.5 bg-amber-100 text-amber-800 text-[9px] font-bold px-1.5 py-0.2 rounded">
                EXECUTIVE ADMIN
              </span>
            )}
          </div>
        </div>

        {/* Menu Navigation Card */}
        <div className="bg-white border border-neutral-200 rounded-lg shadow-sm overflow-hidden text-xs">
          {/* SECTION: MY ORDERS */}
          <Link
            to="/user/order"
            className="w-full flex items-center justify-between p-4 border-b border-neutral-100 hover:bg-neutral-50 transition-colors group"
          >
            <div className="flex items-center space-x-3">
              <ShoppingBag className="w-4 h-4 text-amber-600" />
              <span className="font-bold text-neutral-800 uppercase tracking-wide">
                MY ORDERS
              </span>
            </div>
            <ChevronRight className="w-4 h-4 text-neutral-400 group-hover:translate-x-0.5 transition-transform" />
          </Link>

          {/* SECTION: ACCOUNT SETTINGS */}
          <div className="border-b border-neutral-100">
            <div className="flex items-center space-x-3 px-4 pt-3.5 pb-2 text-neutral-400 font-bold uppercase text-[11px] tracking-wider">
              <UserIcon className="w-4 h-4 text-amber-600" />
              <span>ACCOUNT SETTINGS</span>
            </div>

            <div className="space-y-0.5 pb-2">
              <button
                type="button"
                onClick={() => setActiveTab('profile')}
                className={`w-full text-left px-11 py-2 text-xs transition-colors flex items-center justify-between ${
                  activeTab === 'profile'
                    ? 'bg-amber-50 text-amber-900 font-bold border-l-4 border-amber-600'
                    : 'text-neutral-700 hover:bg-neutral-50'
                }`}
              >
                <span>Profile Information</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('addresses')}
                className={`w-full text-left px-11 py-2 text-xs transition-colors flex items-center justify-between ${
                  activeTab === 'addresses'
                    ? 'bg-amber-50 text-amber-900 font-bold border-l-4 border-amber-600'
                    : 'text-neutral-700 hover:bg-neutral-50'
                }`}
              >
                <span>Manage Addresses</span>
                {user.addresses && user.addresses.length > 0 && (
                  <span className="text-[10px] text-neutral-500 font-normal">
                    ({user.addresses.length})
                  </span>
                )}
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('pan')}
                className={`w-full text-left px-11 py-2 text-xs transition-colors ${
                  activeTab === 'pan'
                    ? 'bg-amber-50 text-amber-900 font-bold border-l-4 border-amber-600'
                    : 'text-neutral-700 hover:bg-neutral-50'
                }`}
              >
                <span>PAN Card Information</span>
              </button>
            </div>
          </div>

          {/* SECTION: PAYMENTS */}
          <div className="border-b border-neutral-100">
            <div className="flex items-center space-x-3 px-4 pt-3.5 pb-2 text-neutral-400 font-bold uppercase text-[11px] tracking-wider">
              <CreditCard className="w-4 h-4 text-amber-600" />
              <span>PAYMENTS</span>
            </div>

            <div className="space-y-0.5 pb-2">
              <button
                type="button"
                onClick={() => setActiveTab('giftcards')}
                className={`w-full text-left px-11 py-2 text-xs transition-colors flex items-center justify-between ${
                  activeTab === 'giftcards'
                    ? 'bg-amber-50 text-amber-900 font-bold border-l-4 border-amber-600'
                    : 'text-neutral-700 hover:bg-neutral-50'
                }`}
              >
                <span>Gift Cards</span>
                <span className="text-emerald-700 font-bold text-[11px]">₹{giftCardBalance}</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('upi')}
                className={`w-full text-left px-11 py-2 text-xs transition-colors ${
                  activeTab === 'upi'
                    ? 'bg-amber-50 text-amber-900 font-bold border-l-4 border-amber-600'
                    : 'text-neutral-700 hover:bg-neutral-50'
                }`}
              >
                <span>Saved UPI</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('cards')}
                className={`w-full text-left px-11 py-2 text-xs transition-colors ${
                  activeTab === 'cards'
                    ? 'bg-amber-50 text-amber-900 font-bold border-l-4 border-amber-600'
                    : 'text-neutral-700 hover:bg-neutral-50'
                }`}
              >
                <span>Saved Cards</span>
              </button>
            </div>
          </div>

          {/* SECTION: MY STUFF */}
          <div className="border-b border-neutral-100">
            <div className="flex items-center space-x-3 px-4 pt-3.5 pb-2 text-neutral-400 font-bold uppercase text-[11px] tracking-wider">
              <Tag className="w-4 h-4 text-amber-600" />
              <span>MY STUFF</span>
            </div>

            <div className="space-y-0.5 pb-2">
              <button
                type="button"
                onClick={() => setActiveTab('coupons')}
                className={`w-full text-left px-11 py-2 text-xs transition-colors flex items-center justify-between ${
                  activeTab === 'coupons'
                    ? 'bg-amber-50 text-amber-900 font-bold border-l-4 border-amber-600'
                    : 'text-neutral-700 hover:bg-neutral-50'
                }`}
              >
                <span>My Coupons</span>
                <span className="bg-amber-100 text-amber-900 text-[10px] font-bold px-1.5 py-0.5 rounded">
                  {coupons.length}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('reviews')}
                className={`w-full text-left px-11 py-2 text-xs transition-colors ${
                  activeTab === 'reviews'
                    ? 'bg-amber-50 text-amber-900 font-bold border-l-4 border-amber-600'
                    : 'text-neutral-700 hover:bg-neutral-50'
                }`}
              >
                <span>My Reviews & Ratings</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('notifications')}
                className={`w-full text-left px-11 py-2 text-xs transition-colors flex items-center justify-between ${
                  activeTab === 'notifications'
                    ? 'bg-amber-50 text-amber-900 font-bold border-l-4 border-amber-600'
                    : 'text-neutral-700 hover:bg-neutral-50'
                }`}
              >
                <span>All Notifications</span>
                <span className="w-2 h-2 rounded-full bg-rose-600" />
              </button>

              <Link
                to="/user/mywhishlist"
                className="w-full text-left px-11 py-2 text-xs text-neutral-700 hover:bg-neutral-50 transition-colors flex items-center justify-between"
              >
                <span>My Wishlist</span>
                <Heart className="w-3.5 h-3.5 text-neutral-400" />
              </Link>
            </div>
          </div>

          {/* ADMIN PORTAL LINK (IF EXECUTIVE) */}
          {isAdmin && (
            <Link
              to="/admin/dashboard"
              className="w-full flex items-center space-x-3 p-4 bg-amber-50 text-amber-950 font-bold border-b border-neutral-100 hover:bg-amber-100 transition-colors"
            >
              <Shield className="w-4 h-4 text-amber-700" />
              <span>Admin Management Center</span>
            </Link>
          )}

          {/* LOGOUT */}
          <button
            type="button"
            onClick={() => {
              logout();
              navigate('/login');
            }}
            className="w-full flex items-center space-x-3 p-4 text-neutral-700 hover:bg-rose-50 hover:text-rose-600 transition-colors font-medium text-xs"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* ======================================================== */}
      {/* RIGHT CONTENT AREA                                       */}
      {/* ======================================================== */}
      <section className="lg:col-span-8 xl:col-span-9 bg-white border border-neutral-200 rounded-lg p-6 sm:p-8 shadow-sm">
        {/* ==================================================== */}
        {/* TAB 1: PROFILE INFORMATION (FLIPKART REFERENCE EXACT) */}
        {/* ==================================================== */}
        {activeTab === 'profile' && (
          <div className="space-y-8 max-w-2xl">
            {/* 1. Personal Information */}
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <h3 className="text-base font-bold text-neutral-900">Personal Information</h3>
                <button
                  type="button"
                  onClick={() => setIsEditingPersonal(!isEditingPersonal)}
                  className="text-xs font-semibold text-amber-700 hover:underline"
                >
                  {isEditingPersonal ? 'Cancel' : 'Edit'}
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <input
                    type="text"
                    value={firstName}
                    disabled={!isEditingPersonal}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="First Name"
                    className={`w-full px-3.5 py-2.5 text-xs border rounded transition-colors ${
                      isEditingPersonal
                        ? 'border-neutral-400 bg-white focus:outline-none focus:border-neutral-900'
                        : 'border-neutral-200 bg-neutral-50 text-neutral-700 cursor-not-allowed'
                    }`}
                  />
                </div>
                <div>
                  <input
                    type="text"
                    value={lastName}
                    disabled={!isEditingPersonal}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Last Name"
                    className={`w-full px-3.5 py-2.5 text-xs border rounded transition-colors ${
                      isEditingPersonal
                        ? 'border-neutral-400 bg-white focus:outline-none focus:border-neutral-900'
                        : 'border-neutral-200 bg-neutral-50 text-neutral-700 cursor-not-allowed'
                    }`}
                  />
                </div>
              </div>

              {isEditingPersonal && (
                <button
                  type="button"
                  onClick={handleSavePersonalInfo}
                  className="bg-neutral-950 text-white font-bold text-xs uppercase tracking-wider px-6 py-2.5 rounded transition-colors hover:bg-neutral-800"
                >
                  SAVE
                </button>
              )}

              {/* Your Gender */}
              <div className="pt-2">
                <span className="block text-xs text-neutral-600 font-medium mb-2">Your Gender</span>
                <div className="flex items-center space-x-6 text-xs text-neutral-800">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="radio"
                      name="gender"
                      value="Male"
                      checked={gender === 'Male'}
                      onChange={() => setGender('Male')}
                      disabled={!isEditingPersonal}
                      className="text-neutral-950 focus:ring-0"
                    />
                    <span>Male</span>
                  </label>
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="radio"
                      name="gender"
                      value="Female"
                      checked={gender === 'Female'}
                      onChange={() => setGender('Female')}
                      disabled={!isEditingPersonal}
                      className="text-neutral-950 focus:ring-0"
                    />
                    <span>Female</span>
                  </label>
                </div>
              </div>
            </div>

            {/* 2. Email Address */}
            <div className="space-y-3 pt-4 border-t border-neutral-100">
              <div className="flex items-center space-x-4">
                <h3 className="text-base font-bold text-neutral-900">Email Address</h3>
                <button
                  type="button"
                  onClick={() => setIsEditingEmail(!isEditingEmail)}
                  className="text-xs font-semibold text-amber-700 hover:underline"
                >
                  {isEditingEmail ? 'Cancel' : 'Edit'}
                </button>
              </div>

              <div className="max-w-md flex space-x-2">
                <input
                  type="email"
                  value={emailValue}
                  disabled={!isEditingEmail}
                  onChange={(e) => setEmailValue(e.target.value)}
                  className={`w-full px-3.5 py-2.5 text-xs border rounded transition-colors ${
                    isEditingEmail
                      ? 'border-neutral-400 bg-white focus:outline-none focus:border-neutral-900'
                      : 'border-neutral-200 bg-neutral-50 text-neutral-600 cursor-not-allowed'
                  }`}
                />
                {isEditingEmail && (
                  <button
                    type="button"
                    onClick={() => {
                      alert('A verification link has been sent to your updated email address.');
                      setIsEditingEmail(false);
                    }}
                    className="bg-neutral-950 text-white font-bold text-xs uppercase px-4 py-2 rounded flex-shrink-0"
                  >
                    SAVE
                  </button>
                )}
              </div>
            </div>

            {/* 3. Mobile Number */}
            <div className="space-y-3 pt-4 border-t border-neutral-100">
              <div className="flex items-center space-x-4">
                <h3 className="text-base font-bold text-neutral-900">Mobile Number</h3>
                <button
                  type="button"
                  onClick={() => setIsEditingMobile(!isEditingMobile)}
                  className="text-xs font-semibold text-amber-700 hover:underline"
                >
                  {isEditingMobile ? 'Cancel' : 'Edit'}
                </button>
              </div>

              <div className="max-w-md flex space-x-2">
                <input
                  type="text"
                  value={mobileValue}
                  disabled={!isEditingMobile}
                  onChange={(e) => setMobileValue(e.target.value)}
                  className={`w-full px-3.5 py-2.5 text-xs border rounded transition-colors ${
                    isEditingMobile
                      ? 'border-neutral-400 bg-white focus:outline-none focus:border-neutral-900'
                      : 'border-neutral-200 bg-neutral-50 text-neutral-600 cursor-not-allowed'
                  }`}
                />
                {isEditingMobile && (
                  <button
                    type="button"
                    onClick={handleSaveMobile}
                    className="bg-neutral-950 text-white font-bold text-xs uppercase px-4 py-2 rounded flex-shrink-0"
                  >
                    SAVE
                  </button>
                )}
              </div>
            </div>

            {/* 4. FAQs (Flipkart Reference Exact Text) */}
            <div className="space-y-4 pt-6 border-t border-neutral-100">
              <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-900">FAQs</h3>

              <div className="space-y-4 text-xs">
                <div>
                  <h4 className="font-bold text-neutral-800 mb-1">
                    What happens when I update my email address (or mobile number)?
                  </h4>
                  <p className="text-neutral-600 leading-relaxed">
                    Your login email id (or mobile number) changes, likewise. You'll receive all your account related communication on your updated email address (or mobile number).
                  </p>
                </div>

                <div>
                  <h4 className="font-bold text-neutral-800 mb-1">
                    When will my AURELIUS account be updated with the new email address (or mobile number)?
                  </h4>
                  <p className="text-neutral-600 leading-relaxed">
                    It happens as soon as you confirm the verification code sent to your email (or mobile) and save the changes.
                  </p>
                </div>

                <div>
                  <h4 className="font-bold text-neutral-800 mb-1">
                    What happens to my existing account when I update my email address (or mobile number)?
                  </h4>
                  <p className="text-neutral-600 leading-relaxed">
                    Updating your email address/mobile number doesn't invalidate your account. Your account remains fully operational.
                  </p>
                </div>
              </div>

              {/* Account Security & Deactivation */}
              <div className="pt-6 border-t border-neutral-100 flex items-center justify-between text-xs">
                <button
                  type="button"
                  onClick={() => {
                    if (window.confirm('Are you sure you want to deactivate your account? All active sessions will be terminated.')) {
                      logout();
                      navigate('/');
                    }
                  }}
                  className="font-bold text-rose-600 hover:underline"
                >
                  Deactivate Account
                </button>

                <span className="text-[11px] text-neutral-400">
                  Account Member ID: <strong className="font-mono text-neutral-700">{(user?._id || user?.id || 'AUR-USER').slice(-8).toUpperCase()}</strong>
                </span>
              </div>
            </div>
          </div>
        )}

        {/* ==================================================== */}
        {/* TAB 2: MANAGE ADDRESSES                              */}
        {/* ==================================================== */}
        {activeTab === 'addresses' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-neutral-100">
              <div>
                <h3 className="text-base font-bold text-neutral-900">Manage Addresses</h3>
                <p className="text-xs text-neutral-500">Saved shipping locations for expedited atelier checkout</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setEditingAddressId(null);
                  setAddressForm({
                    name: user.name,
                    phone: user.phone || '',
                    addressLine1: '',
                    addressLine2: '',
                    city: '',
                    state: '',
                    postalCode: '',
                    country: 'India',
                    isDefault: false,
                  });
                  setShowAddressModal(true);
                }}
                className="bg-neutral-950 hover:bg-neutral-800 text-white text-xs font-bold uppercase tracking-wider px-4 py-2.5 rounded flex items-center space-x-1.5 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+ ADD A NEW ADDRESS</span>
              </button>
            </div>

            {user.addresses && user.addresses.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {user.addresses.map((addr) => (
                  <div
                    key={addr._id}
                    className={`p-4 border rounded-xl flex flex-col justify-between text-xs space-y-3 ${
                      addr.isDefault ? 'border-neutral-900 bg-neutral-50/60 shadow-sm' : 'border-neutral-200'
                    }`}
                  >
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-neutral-900 text-sm">{addr.name}</span>
                        {addr.isDefault && (
                          <span className="bg-neutral-900 text-white text-[10px] font-bold px-2 py-0.5 rounded">
                            DEFAULT
                          </span>
                        )}
                      </div>
                      <p className="text-neutral-600 leading-relaxed">
                        {addr.addressLine1}, {addr.addressLine2 ? `${addr.addressLine2}, ` : ''}
                        {addr.city}, {addr.state} - {addr.postalCode}
                      </p>
                      <p className="text-neutral-500 font-medium">Contact: {addr.phone}</p>
                    </div>

                    <div className="pt-2 border-t border-neutral-100 flex items-center justify-between text-xs">
                      {!addr.isDefault && (
                        <button
                          type="button"
                          onClick={() => handleSetDefaultAddress(addr._id)}
                          className="text-amber-800 hover:underline font-semibold"
                        >
                          Set as Default
                        </button>
                      )}
                      <div className="flex items-center space-x-3 ml-auto">
                        <button
                          type="button"
                          onClick={() => {
                            setEditingAddressId(addr._id || null);
                            setAddressForm(addr);
                            setShowAddressModal(true);
                          }}
                          className="text-neutral-600 hover:text-neutral-900"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteAddress(addr._id)}
                          className="text-neutral-400 hover:text-rose-600"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-neutral-400 space-y-3">
                <MapPin className="w-10 h-10 mx-auto text-neutral-300" />
                <p className="text-xs text-neutral-500">No addresses saved yet.</p>
              </div>
            )}
          </div>
        )}

        {/* ==================================================== */}
        {/* TAB 3: PAN CARD INFORMATION                          */}
        {/* ==================================================== */}
        {activeTab === 'pan' && (
          <div className="space-y-6 max-w-xl">
            <div className="pb-4 border-b border-neutral-100">
              <h3 className="text-base font-bold text-neutral-900">PAN Card Information</h3>
              <p className="text-xs text-neutral-500">Required as per Government of India regulations for luxury transactions exceeding ₹2,00,000</p>
            </div>

            {panSaved ? (
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-lg text-xs text-emerald-800 flex items-center space-x-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                <div>
                  <span className="font-bold">PAN Card Verified: {panNumber}</span>
                  <p className="text-[11px] text-emerald-700">Verified under name: {panName}</p>
                </div>
              </div>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setPanSaved(true);
                }}
                className="space-y-4 text-xs"
              >
                <div>
                  <label className="block font-semibold mb-1">PAN Number*</label>
                  <input
                    type="text"
                    required
                    maxLength={10}
                    value={panNumber}
                    onChange={(e) => setPanNumber(e.target.value.toUpperCase())}
                    placeholder="e.g. ABCDE1234F"
                    className="w-full px-3 py-2 border rounded uppercase focus:outline-none focus:border-neutral-900"
                  />
                </div>

                <div>
                  <label className="block font-semibold mb-1">Full Name as per PAN Card*</label>
                  <input
                    type="text"
                    required
                    value={panName}
                    onChange={(e) => setPanName(e.target.value)}
                    className="w-full px-3 py-2 border rounded focus:outline-none focus:border-neutral-900"
                  />
                </div>

                <div className="pt-2">
                  <label className="flex items-start space-x-2 text-[11px] text-neutral-600 cursor-pointer">
                    <input type="checkbox" required className="mt-0.5 rounded text-neutral-900" />
                    <span>I declare that the PAN details provided above belong to me and are authentic.</span>
                  </label>
                </div>

                <button
                  type="submit"
                  className="bg-neutral-950 text-white font-bold text-xs uppercase px-6 py-2.5 rounded hover:bg-neutral-800 transition-colors"
                >
                  UPLOAD & SAVE PAN
                </button>
              </form>
            )}
          </div>
        )}

        {/* ==================================================== */}
        {/* TAB 4: GIFT CARDS                                    */}
        {/* ==================================================== */}
        {activeTab === 'giftcards' && (
          <div className="space-y-8">
            <div className="pb-4 border-b border-neutral-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-base font-bold text-neutral-900">AURELIUS Gift Cards</h3>
                <p className="text-xs text-neutral-500">Redeem, check balances, or gift atelier vouchers to someone special</p>
              </div>
              <div className="flex items-center space-x-6 sm:text-right">
                <div>
                  <span className="text-[10px] text-neutral-400 block uppercase tracking-wider">Available Balance</span>
                  <span className="text-2xl font-extrabold text-neutral-950 font-serif-luxury">
                    ₹{giftCardBalance.toLocaleString('en-IN')}
                  </span>
                </div>
                <Link
                  to="/gift-cards"
                  className="bg-neutral-950 text-white font-bold text-[11px] uppercase tracking-wider px-4 py-2 rounded-lg hover:bg-neutral-800 transition-colors"
                >
                  Full Catalog
                </Link>
              </div>
            </div>

            {/* EMBEDDED LUXURY CARDS SHOWCASE */}
            <div className="-mx-4 sm:mx-0">
              <GiftCardShowcase
                showHeroBanner={false}
                onCardPurchased={() => {
                  setGiftCardSuccess('Gift card added to your shopping bag.');
                }}
              />
            </div>

            {/* REDEEM EXISTING GIFT CARD FORM */}
            <div className="max-w-xl bg-neutral-50 p-6 rounded-xl border border-neutral-200/90 space-y-4">
              <div className="border-b border-neutral-200/60 pb-3">
                <h4 className="font-bold uppercase tracking-wider text-neutral-800 text-xs">
                  Redeem A Gift Card
                </h4>
                <p className="text-[11px] text-neutral-500">
                  Have a physical or digital gift card? Enter the 16-digit code and 6-digit PIN to credit your balance.
                </p>
              </div>

              {giftCardSuccess && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 rounded flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>{giftCardSuccess}</span>
                </div>
              )}

              <form onSubmit={handleAddGiftCard} className="space-y-3 text-xs">
                <div>
                  <label className="block font-semibold mb-1 text-neutral-700">Gift Card Number (16 Digits)</label>
                  <input
                    type="text"
                    required
                    value={giftCardCode}
                    onChange={(e) => setGiftCardCode(e.target.value.toUpperCase())}
                    placeholder="e.g. AUR-GIFT-8921-9921"
                    className="w-full px-3 py-2 border rounded uppercase bg-white focus:outline-none focus:border-neutral-900 text-xs"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1 text-neutral-700">Gift Card PIN (6 Digits)</label>
                  <input
                    type="password"
                    required
                    maxLength={6}
                    value={giftCardPin}
                    onChange={(e) => setGiftCardPin(e.target.value)}
                    placeholder="••••••"
                    className="w-full px-3 py-2 border rounded bg-white focus:outline-none focus:border-neutral-900 text-xs"
                  />
                </div>
                <button
                  type="submit"
                  className="bg-neutral-950 text-white font-bold text-xs uppercase tracking-wider px-5 py-2.5 rounded hover:bg-neutral-800 transition-colors"
                >
                  APPLY & ADD BALANCE
                </button>
              </form>
            </div>
          </div>
        )}

        {/* ==================================================== */}
        {/* TAB 5: SAVED UPI                                     */}
        {/* ==================================================== */}
        {activeTab === 'upi' && (
          <div className="space-y-6 max-w-xl">
            <div className="pb-4 border-b border-neutral-100 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-neutral-900">Saved UPI IDs</h3>
                <p className="text-xs text-neutral-500">Expedited 1-click UPI checkout</p>
              </div>
              <button
                type="button"
                onClick={() => setShowAddUpi(!showAddUpi)}
                className="text-xs font-bold uppercase text-amber-700 hover:underline"
              >
                {showAddUpi ? 'Cancel' : '+ Add UPI ID'}
              </button>
            </div>

            {showAddUpi && (
              <form onSubmit={handleAddUpi} className="p-4 bg-neutral-50 border rounded-lg flex space-x-2 text-xs">
                <input
                  type="text"
                  required
                  value={newUpiId}
                  onChange={(e) => setNewUpiId(e.target.value)}
                  placeholder="e.g. yourname@okaxis"
                  className="flex-1 px-3 py-2 border rounded bg-white focus:outline-none focus:border-neutral-900"
                />
                <button
                  type="submit"
                  className="bg-neutral-950 text-white font-bold text-xs uppercase px-4 py-2 rounded hover:bg-neutral-800"
                >
                  SAVE
                </button>
              </form>
            )}

            <div className="space-y-2">
              {savedUpiList.map((upi, idx) => (
                <div key={idx} className="p-3 border rounded-lg flex items-center justify-between text-xs bg-white">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded bg-neutral-100 flex items-center justify-center font-bold text-neutral-600">
                      UPI
                    </div>
                    <span className="font-semibold text-neutral-800 font-mono">{upi}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSavedUpiList(savedUpiList.filter((_, i) => i !== idx))}
                    className="text-neutral-400 hover:text-rose-600"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ==================================================== */}
        {/* TAB 6: SAVED CARDS                                   */}
        {/* ==================================================== */}
        {activeTab === 'cards' && (
          <div className="space-y-6 max-w-xl">
            <div className="pb-4 border-b border-neutral-100">
              <h3 className="text-base font-bold text-neutral-900">Saved Cards</h3>
              <p className="text-xs text-neutral-500">256-Bit SSL tokenized credit and debit cards</p>
            </div>

            <div className="space-y-3">
              {savedCards.map((card) => (
                <div key={card.id} className="p-4 border rounded-xl flex items-center justify-between text-xs bg-white">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-8 rounded bg-neutral-900 text-white flex items-center justify-center font-bold text-[10px]">
                      {card.type}
                    </div>
                    <div>
                      <span className="font-bold text-neutral-900 block">
                        {card.bank} •••• {card.last4}
                      </span>
                      <span className="text-neutral-500 text-[11px]">
                        Expires {card.exp} • {card.holder}
                      </span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSavedCards(savedCards.filter((c) => c.id !== card.id))}
                    className="text-neutral-400 hover:text-rose-600"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ==================================================== */}
        {/* TAB 7: MY COUPONS                                    */}
        {/* ==================================================== */}
        {activeTab === 'coupons' && (
          <div className="space-y-6">
            <div className="pb-4 border-b border-neutral-100">
              <h3 className="text-base font-bold text-neutral-900">My Available Coupons</h3>
              <p className="text-xs text-neutral-500">Promotional vouchers applicable during checkout</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {coupons.map((c) => (
                <div key={c.code} className="p-4 border-2 border-dashed border-amber-300 bg-amber-50/50 rounded-xl space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-extrabold text-sm text-neutral-900 bg-white px-2 py-0.5 rounded border border-neutral-200">
                      {c.code}
                    </span>
                    <span className="font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded text-[10px]">
                      {c.discount}
                    </span>
                  </div>
                  <p className="text-neutral-700 leading-relaxed">{c.desc}</p>
                  <div className="pt-2 flex items-center justify-between text-[11px] text-neutral-500 border-t border-amber-200/50">
                    <span>Valid until {c.expiry}</span>
                    <button
                      type="button"
                      onClick={() => handleCopyCoupon(c.code)}
                      className="text-amber-800 hover:text-black font-bold flex items-center space-x-1"
                    >
                      {copiedCoupon === c.code ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                          <span className="text-emerald-700">Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy Code</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ==================================================== */}
        {/* TAB 8: MY REVIEWS & RATINGS                          */}
        {/* ==================================================== */}
        {activeTab === 'reviews' && (
          <div className="space-y-6">
            <div className="pb-4 border-b border-neutral-100">
              <h3 className="text-base font-bold text-neutral-900">My Reviews & Ratings</h3>
              <p className="text-xs text-neutral-500">Verified feedback submitted for purchased pieces</p>
            </div>

            <div className="p-8 text-center text-neutral-400 space-y-2">
              <Star className="w-10 h-10 text-neutral-300 mx-auto" />
              <p className="text-xs text-neutral-500">No reviews submitted yet.</p>
              <Link to="/user/order" className="text-xs text-amber-700 hover:underline font-bold inline-block pt-1">
                View delivered orders to write a review
              </Link>
            </div>
          </div>
        )}

        {/* ==================================================== */}
        {/* TAB 9: ALL NOTIFICATIONS                             */}
        {/* ==================================================== */}
        {activeTab === 'notifications' && (
          <div className="space-y-6">
            <div className="pb-4 border-b border-neutral-100 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-neutral-900">All Notifications</h3>
                <p className="text-xs text-neutral-500">Order timeline milestones, price drops, and atelier announcements</p>
              </div>
              <span className="text-[11px] text-neutral-400">{notifications.length} updates</span>
            </div>

            <div className="divide-y divide-neutral-100">
              {notifications.map((n) => (
                <div key={n.id} className="py-3.5 flex items-start space-x-3 text-xs">
                  <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${n.unread ? 'bg-amber-600' : 'bg-transparent'}`} />
                  <div className="flex-1 space-y-0.5">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-neutral-900">{n.title}</h4>
                      <span className="text-[10px] text-neutral-400">{n.time}</span>
                    </div>
                    <p className="text-neutral-600">{n.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* Address Edit/Add Modal */}
      {showAddressModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/60 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full p-6 text-xs space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-900">
              {editingAddressId ? 'Edit Address' : 'Add New Address'}
            </h3>
            <form onSubmit={handleSaveAddress} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Full Name*</label>
                  <input
                    type="text"
                    required
                    value={addressForm.name}
                    onChange={(e) => setAddressForm({ ...addressForm, name: e.target.value })}
                    className="w-full px-2.5 py-1.5 border rounded focus:outline-none focus:border-neutral-900"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Phone*</label>
                  <input
                    type="text"
                    required
                    value={addressForm.phone}
                    onChange={(e) => setAddressForm({ ...addressForm, phone: e.target.value })}
                    className="w-full px-2.5 py-1.5 border rounded focus:outline-none focus:border-neutral-900"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1">Address Line 1*</label>
                <input
                  type="text"
                  required
                  value={addressForm.addressLine1}
                  onChange={(e) => setAddressForm({ ...addressForm, addressLine1: e.target.value })}
                  className="w-full px-2.5 py-1.5 border rounded focus:outline-none focus:border-neutral-900"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Address Line 2 (Optional)</label>
                <input
                  type="text"
                  value={addressForm.addressLine2 || ''}
                  onChange={(e) => setAddressForm({ ...addressForm, addressLine2: e.target.value })}
                  className="w-full px-2.5 py-1.5 border rounded focus:outline-none focus:border-neutral-900"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold mb-1">City*</label>
                  <input
                    type="text"
                    required
                    value={addressForm.city}
                    onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })}
                    className="w-full px-2.5 py-1.5 border rounded focus:outline-none focus:border-neutral-900"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">State*</label>
                  <input
                    type="text"
                    required
                    value={addressForm.state}
                    onChange={(e) => setAddressForm({ ...addressForm, state: e.target.value })}
                    className="w-full px-2.5 py-1.5 border rounded focus:outline-none focus:border-neutral-900"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">PIN Code*</label>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    value={addressForm.postalCode}
                    onChange={(e) => setAddressForm({ ...addressForm, postalCode: e.target.value })}
                    className="w-full px-2.5 py-1.5 border rounded focus:outline-none focus:border-neutral-900"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowAddressModal(false)}
                  className="px-4 py-2 border rounded font-semibold text-neutral-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-neutral-950 text-white rounded font-bold uppercase tracking-wider"
                >
                  Save Address
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      </div>
    </div>
  );
};

export default UserAccountSection;
