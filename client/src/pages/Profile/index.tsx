import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { User as UserIcon } from 'lucide-react';
import { AnnouncementBar } from '../../components/layout/AnnouncementBar';
import { Header } from '../../components/layout/Header';
import { Footer } from '../../components/layout/Footer';
import { useAuthStore } from '../../store/useAuthStore';
import UserAccountSection from '../../components/user/UserAccountSection';

export const ProfilePage: React.FC = () => {
  const { user, isAuthenticated } = useAuthStore();
  const location = useLocation();
  const isAddressTab = location.pathname.includes('addresses');

  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen flex flex-col bg-neutral-50">
        <AnnouncementBar />
        <Header />
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
          <UserIcon className="w-12 h-12 text-neutral-400 mb-3" />
          <h2 className="text-xl font-bold font-serif-luxury text-neutral-900 mb-2">Member Sign In Required</h2>
          <p className="text-xs text-neutral-500 mb-6">Please log in to manage your addresses and profile.</p>
          <Link to="/login" className="bg-neutral-950 text-white font-bold text-xs uppercase tracking-wider px-6 py-2.5 rounded">
            Sign In
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-neutral-50">
      <AnnouncementBar />
      <Header />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="border-b border-neutral-200 pb-4 mb-8 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-amber-700 block mb-1">
              Account Management Center
            </span>
            <h1 className="text-2xl font-extrabold uppercase tracking-tight font-serif-luxury text-neutral-900">
              Account Settings
            </h1>
          </div>
          <Link
            to="/user/dashboard"
            className="text-xs font-bold uppercase tracking-wider text-amber-700 hover:text-neutral-950"
          >
            ← Back to Overview
          </Link>
        </div>

        <UserAccountSection initialTab={isAddressTab ? 'addresses' : 'profile'} />
      </main>

      <Footer />
    </div>
  );
};

export default ProfilePage;
