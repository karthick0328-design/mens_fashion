import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { Header } from '../../components/layout/Header';
import { Footer } from '../../components/layout/Footer';
import { useAuthStore } from '../../store/useAuthStore';
import api from '../../services/api';
import { registerGroupSlides } from '../../constants/authImages';
import AuthInput from '../../components/auth/AuthInput';

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const { setAuth } = useAuthStore();

  const [title, setTitle] = useState<'MR' | 'MRS' | 'MS' | ''>('MR');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [newsletter, setNewsletter] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isPeekMode, setIsPeekMode] = useState(false);

  // Automatic slide rotation every 4 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlideIndex((prev) => (prev + 1) % registerGroupSlides.length);
    }, 4000);

    return () => clearInterval(timer);
  }, []);

  // Field validation errors
  const [firstNameError, setFirstNameError] = useState<string | null>(null);
  const [lastNameError, setLastNameError] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [confirmPasswordError, setConfirmPasswordError] = useState<string | null>(null);
  const [generalError, setGeneralError] = useState<string | null>(null);

  const validate = () => {
    let isValid = true;
    setFirstNameError(null);
    setLastNameError(null);
    setEmailError(null);
    setPasswordError(null);
    setConfirmPasswordError(null);
    setGeneralError(null);

    if (!firstName.trim()) {
      setFirstNameError('Please enter your first name.');
      isValid = false;
    }

    if (!lastName.trim()) {
      setLastNameError('Please enter your last name.');
      isValid = false;
    }

    if (!email.trim()) {
      setEmailError('Please enter your email address.');
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setEmailError('Please enter a valid email address.');
      isValid = false;
    }

    if (!password) {
      setPasswordError('Please create a password.');
      isValid = false;
    } else if (password.length < 6) {
      setPasswordError('Password must be at least 6 characters.');
      isValid = false;
    }

    if (!confirmPassword) {
      setConfirmPasswordError('Please confirm your password.');
      isValid = false;
    } else if (password !== confirmPassword) {
      setConfirmPasswordError('Passwords do not match.');
      isValid = false;
    }

    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      setIsLoading(true);
      setGeneralError(null);

      const fullName = `${title ? title + ' ' : ''}${firstName.trim()} ${lastName.trim()}`.trim();
      const res = await api.post('/auth/register', {
        name: fullName,
        email: email.trim().toLowerCase(),
        password,
      });

      if (res.data?.success) {
        const registeredUser = res.data.data.user;
        setAuth(registeredUser, res.data.data.token);
        const isAdminRole = ['ADMIN', 'SUPER_ADMIN', 'MANAGER', 'STAFF'].includes(registeredUser?.role);
        if (isAdminRole) {
          navigate('/admin/dashboard', { replace: true });
        } else {
          navigate('/user/dashboard', { replace: true });
        }
      }
    } catch (err: any) {
      const isStaticDeployError =
        err.response?.status === 405 ||
        err.response?.status === 404 ||
        err.code === 'ERR_NETWORK' ||
        !err.response;

      if (isStaticDeployError) {
        const fullName = `${title ? title + ' ' : ''}${firstName.trim()} ${lastName.trim()}`.trim();
        const demoUser = {
          _id: 'user-' + Date.now(),
          name: fullName,
          email: email.trim().toLowerCase(),
          role: 'CUSTOMER' as const,
          addresses: [],
        };
        setAuth(demoUser, 'demo-jwt-token-' + Date.now());
        navigate('/user/dashboard', { replace: true });
        return;
      }

      const msg = err.response?.data?.message || 'Registration could not be completed. Please try again.';
      setGeneralError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-100 flex flex-col antialiased selection:bg-neutral-900 selection:text-white">
      {/* Existing AURELIUS Global Header */}
      <Header />

      {/* Main Campaign Layout (Editorial Background + Clean White Form Area) */}
      <main className="flex-1 relative flex items-center justify-center py-10 sm:py-16 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Background Editorial Campaign Image Carousel */}
        <div className="absolute inset-0 z-0 bg-neutral-900 overflow-hidden select-none">
          {registerGroupSlides.map((slide, idx) => {
            const isActive = idx === currentSlideIndex;
            return (
              <div
                key={slide.image}
                className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                  isActive ? 'opacity-100' : 'opacity-0 pointer-events-none'
                }`}
              >
                <img
                  src={slide.image}
                  alt={slide.collection}
                  className={`w-full h-full object-cover object-center transition-transform duration-[5000ms] ease-out ${
                    isActive ? 'scale-105' : 'scale-100'
                  }`}
                />
              </div>
            );
          })}

          {/* Luxury Soft Overlay for Form Readability */}
          <div className="absolute inset-0 bg-black/30 backdrop-blur-[0.5px] pointer-events-none" />

          {/* Bottom Left Collection Info & Dot Indicators */}
          <div className="absolute bottom-6 left-6 sm:left-10 z-10 text-white hidden md:flex items-center space-x-3 bg-black/40 backdrop-blur-md px-4 py-2 rounded-full border border-white/10">
            <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-yellow-400 font-bold">
              {registerGroupSlides[currentSlideIndex].collection}
            </span>
            <span className="text-white/30">•</span>
            <span className="text-[11px] text-neutral-300 font-light">
              {registerGroupSlides[currentSlideIndex].tagline}
            </span>
            <div className="flex items-center space-x-1.5 pl-2">
              {registerGroupSlides.map((_, dotIdx) => (
                <button
                  key={dotIdx}
                  type="button"
                  onClick={() => setCurrentSlideIndex(dotIdx)}
                  className={`h-1 rounded-full transition-all duration-500 cursor-pointer ${
                    dotIdx === currentSlideIndex
                      ? 'w-5 bg-yellow-400'
                      : 'w-2 bg-white/40 hover:bg-white/80'
                  }`}
                  aria-label={`Look ${dotIdx + 1}`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Luxury Transparent Glassmorphism Registration Card */}
        <div
          className={`relative z-10 w-full max-w-[460px] bg-white/40 hover:bg-white/50 backdrop-blur-xl p-5 sm:p-8 lg:p-10 shadow-[0_20px_60px_rgba(0,0,0,0.25)] border border-white/60 ring-1 ring-white/40 rounded-xl space-y-6 transition-all duration-300 ${
            isPeekMode ? 'opacity-10 hover:opacity-100' : 'opacity-100'
          }`}
        >
          {/* Form Header: REGISTER / NEW CUSTOMER & PEEK TOGGLE */}
          <div className="flex items-start justify-between">
            <div className="text-left space-y-1">
              <span className="text-[11px] uppercase tracking-[0.20em] font-bold text-neutral-600 block">
                REGISTER
              </span>
              <h1 className="text-xl sm:text-2xl font-extrabold uppercase tracking-[0.05em] text-neutral-950 font-sans">
                NEW CUSTOMER
              </h1>
            </div>

            <button
              type="button"
              onClick={() => setIsPeekMode(!isPeekMode)}
              className="flex items-center space-x-1.5 px-3 py-1 rounded-full bg-white/60 hover:bg-white/90 border border-white/60 text-[10px] font-bold uppercase tracking-wider text-neutral-800 transition-all cursor-pointer shadow-sm"
              title={isPeekMode ? 'Restore form visibility' : 'Dim form to view full background photo'}
            >
              {isPeekMode ? <EyeOff className="w-3 h-3 text-neutral-900" /> : <Eye className="w-3 h-3 text-neutral-900" />}
              <span>{isPeekMode ? 'Show Form' : 'View Photo'}</span>
            </button>
          </div>

          {/* Error Message */}
          {generalError && (
            <div className="p-3 bg-red-50/90 backdrop-blur-sm border-l-2 border-red-600 text-[11px] text-red-700 font-medium leading-relaxed tracking-wide">
              {generalError}
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate className="space-y-5">
            {/* TITLE SELECTION */}
            <div className="space-y-1.5 border-b border-neutral-300 pb-2">
              <label className="block text-[11px] font-medium text-neutral-800 tracking-wide">
                Title
              </label>
              <div className="flex items-center space-x-6 text-xs text-neutral-600">
                {(['MR', 'MRS', 'MS'] as const).map((t) => (
                  <label key={t} className="flex items-center space-x-1.5 cursor-pointer">
                    <input
                      type="radio"
                      name="title"
                      checked={title === t}
                      onChange={() => setTitle(t)}
                      className="accent-black cursor-pointer"
                    />
                    <span className="text-[11px] font-normal uppercase">{t === 'MR' ? 'Mr' : t === 'MRS' ? 'Mrs' : 'Ms'}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* TWO-COLUMN NAME ROW: Name & Surname */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-4">
              <AuthInput
                label="Name"
                type="text"
                value={firstName}
                onChange={(e) => {
                  setFirstName(e.target.value);
                  if (firstNameError) setFirstNameError(null);
                }}
                error={firstNameError}
                required
                autoComplete="given-name"
                disabled={isLoading}
              />

              <AuthInput
                label="Surname"
                type="text"
                value={lastName}
                onChange={(e) => {
                  setLastName(e.target.value);
                  if (lastNameError) setLastNameError(null);
                }}
                error={lastNameError}
                required
                autoComplete="family-name"
                disabled={isLoading}
              />
            </div>

            {/* EMAIL ADDRESS */}
            <AuthInput
              label="Email address"
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (emailError) setEmailError(null);
              }}
              error={emailError}
              required
              autoComplete="email"
              disabled={isLoading}
            />

            {/* TWO-COLUMN PASSWORD ROW */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-4">
              <AuthInput
                label="Password"
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (passwordError) setPasswordError(null);
                }}
                error={passwordError}
                required
                autoComplete="new-password"
                disabled={isLoading}
              />

              <AuthInput
                label="Confirm Password"
                type="password"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  if (confirmPasswordError) setConfirmPasswordError(null);
                }}
                error={confirmPasswordError}
                required
                autoComplete="new-password"
                disabled={isLoading}
              />
            </div>

            {/* ACCOUNT AGREEMENT & PRIVACY */}
            <div className="pt-2 space-y-2.5 text-[11px] text-neutral-500 leading-relaxed">
              <p>
                By registering your details you agree to our{' '}
                <a href="#" className="underline text-neutral-800 hover:text-black font-normal">
                  Terms and Conditions
                </a>{' '}
                and{' '}
                <a href="#" className="underline text-neutral-800 hover:text-black font-normal">
                  privacy and cookie policy
                </a>.
              </p>

              {/* Newsletter Opt-in */}
              <label className="flex items-start space-x-2.5 cursor-pointer select-none pt-1">
                <input
                  type="checkbox"
                  checked={newsletter}
                  onChange={(e) => setNewsletter(e.target.checked)}
                  className="mt-0.5 w-3.5 h-3.5 rounded-none border-neutral-300 text-black focus:ring-0 focus:ring-offset-0 cursor-pointer"
                />
                <span className="text-[11px] text-neutral-700">
                  I want to receive newsletters and updates from Aurelius Paris
                </span>
              </label>
            </div>

            {/* REGISTER BUTTON (EXACT RECTANGULAR BLACK BUTTON ON LEFT) */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="bg-black hover:bg-neutral-800 text-white font-medium text-[11px] uppercase tracking-[0.14em] py-3.5 px-8 transition-colors rounded-none disabled:opacity-50"
              >
                {isLoading ? 'REGISTERING...' : 'REGISTER'}
              </button>
            </div>
          </form>

          {/* ALREADY HAVE AN ACCOUNT? LOG IN */}
          <div className="pt-6 border-t border-neutral-100 text-center text-xs text-neutral-600">
            Already have an account?{' '}
            <Link
              to="/login"
              className="text-black font-semibold uppercase tracking-wider underline underline-offset-4 ml-1 hover:text-neutral-700 transition-colors"
            >
              LOG IN
            </Link>
          </div>
        </div>
      </main>

      {/* Existing AURELIUS Global Footer */}
      <Footer />
    </div>
  );
};

export default RegisterPage;
