import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';
import { useCartStore } from '../../store/useCartStore';
import api from '../../services/api';
import { authSlides } from '../../constants/authImages';
import AuthInput from '../../components/auth/AuthInput';
import SocialLogin from '../../components/auth/SocialLogin';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { setAuth } = useAuthStore();
  const { cart } = useCartStore();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [generalError, setGeneralError] = useState<string | null>(null);
  const [showDemoAccounts, setShowDemoAccounts] = useState(false);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

  // Automatic slide rotation every 4 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlideIndex((prev) => (prev + 1) % authSlides.length);
    }, 4000);

    return () => clearInterval(timer);
  }, []);

  const from = location.state?.from?.pathname || '/user/dashboard';

  const validate = () => {
    let isValid = true;
    setEmailError(null);
    setPasswordError(null);
    setGeneralError(null);

    if (!email.trim()) {
      setEmailError('Please enter your email address.');
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setEmailError('Please enter a valid email address.');
      isValid = false;
    }

    if (!password) {
      setPasswordError('Please enter your password.');
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
      const res = await api.post('/auth/login', {
        email: email.trim().toLowerCase(),
        password,
      });

      if (res.data?.success) {
        const loggedUser = res.data.data.user;
        const authToken = res.data.data.token;
        setAuth(loggedUser, authToken);

        const isAdminRole = ['ADMIN', 'SUPER_ADMIN', 'MANAGER', 'STAFF'].includes(loggedUser.role);
        if (isAdminRole) {
          navigate('/admin/dashboard', { replace: true });
        } else {
          const customerTarget = from.startsWith('/admin') ? '/user/dashboard' : from;
          navigate(customerTarget, { replace: true });
        }
      }
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Invalid email or password. Please try again.';
      setGeneralError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickDemo = (demoEmail: string, demoPass: string) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    setEmailError(null);
    setPasswordError(null);
    setGeneralError(null);
  };

  return (
    <div className="min-h-screen bg-white text-neutral-900 flex flex-col lg:flex-row antialiased selection:bg-neutral-900 selection:text-white">
      {/* ======================================================== */}
      {/* LEFT COLUMN: Editorial Fashion Image (50-55% Desktop)   */}
      {/* ======================================================== */}
      {/* ======================================================== */}
      {/* LEFT COLUMN: Editorial Fashion Image Carousel (50-55%)  */}
      {/* ======================================================== */}
      <div className="relative w-full lg:w-[52%] xl:w-[54%] h-[28vh] sm:h-[38vh] lg:h-screen lg:sticky lg:top-0 overflow-hidden bg-neutral-900 flex-shrink-0 select-none">
        {/* Slides Stack with Smooth Crossfade */}
        {authSlides.map((slide, idx) => {
          const isActive = idx === currentSlideIndex;
          return (
            <div
              key={slide.image}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                isActive ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
              }`}
            >
              <img
                src={slide.image}
                alt={slide.collection}
                className={`w-full h-full object-cover object-top transition-transform duration-[5000ms] ease-out ${
                  isActive ? 'scale-105' : 'scale-100'
                }`}
              />
            </div>
          );
        })}

        {/* Cinematic Gradient Overlays for Brand Contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/10 z-20 pointer-events-none" />

        {/* Editorial Branding & Slide Info: Lower-Left */}
        <div className="absolute bottom-6 sm:bottom-10 left-6 sm:left-10 z-30 text-white space-y-3 max-w-md">
          <Link to="/" className="inline-block group">
            <h2 className="text-2xl sm:text-3xl font-normal tracking-[0.22em] uppercase font-serif-luxury text-white">
              AURELIUS
            </h2>
            <p className="text-[10px] sm:text-[11px] tracking-[0.30em] uppercase text-yellow-400 font-bold mt-0.5">
              ATELIER HOMME
            </p>
          </Link>

          {/* Dynamic Collection Tagline */}
          <div className="pt-1 transition-all duration-700">
            <span className="text-[9px] font-mono uppercase tracking-[0.25em] text-yellow-300 font-semibold block">
              {authSlides[currentSlideIndex].collection}
            </span>
            <p className="text-xs text-neutral-300 font-light tracking-wide mt-0.5">
              {authSlides[currentSlideIndex].tagline}
            </p>
          </div>

          {/* Editorial Navigation Indicator Bars */}
          <div className="flex items-center space-x-2 pt-2">
            {authSlides.map((_, dotIdx) => (
              <button
                key={dotIdx}
                type="button"
                onClick={() => setCurrentSlideIndex(dotIdx)}
                className={`h-1 rounded-full transition-all duration-500 cursor-pointer ${
                  dotIdx === currentSlideIndex
                    ? 'w-8 bg-yellow-400 shadow-sm'
                    : 'w-2.5 bg-white/40 hover:bg-white/80'
                }`}
                title={`Look ${dotIdx + 1}`}
                aria-label={`Slide ${dotIdx + 1}`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* RIGHT COLUMN: Minimal White Login Form (45-50% Desktop) */}
      {/* ======================================================== */}
      <div className="w-full lg:w-[48%] xl:w-[46%] min-h-full flex flex-col justify-between p-6 sm:p-10 lg:p-14 xl:p-20 bg-white">
        {/* Top-Right Navigation: LOG IN | BAG (0) */}
        <div className="flex items-center justify-between lg:justify-end space-x-6 text-[11px] uppercase tracking-[0.15em] font-medium text-neutral-800 pb-8 lg:pb-0">
          <Link to="/" className="lg:hidden text-xs font-bold tracking-[0.20em] uppercase font-serif-luxury text-neutral-900">
            AURELIUS
          </Link>

          <div className="flex items-center space-x-6 text-[11px] uppercase tracking-[0.15em]">
            <span className="text-neutral-950 font-semibold border-b border-black pb-0.5">
              LOG IN
            </span>
            <Link
              to="/user/mycart"
              className="text-neutral-500 hover:text-black transition-colors"
            >
              BAG ({cart?.itemCount || 0})
            </Link>
          </div>
        </div>

        {/* Center: Login Form Container */}
        <div className="w-full max-w-[390px] mx-auto my-auto py-6 sm:py-10 space-y-7">
          {/* General Form Error Banner */}
          {generalError && (
            <div className="p-3 bg-neutral-50 border-l-2 border-red-600 text-[11px] text-red-600 leading-relaxed tracking-wide">
              {generalError}
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate className="space-y-6">
            {/* EMAIL Field */}
            <AuthInput
              label="EMAIL*"
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

            {/* PASSWORD Field */}
            <AuthInput
              label="PASSWORD*"
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (passwordError) setPasswordError(null);
              }}
              error={passwordError}
              required
              autoComplete="current-password"
              disabled={isLoading}
            />

            {/* Forgotten Password Link */}
            <div className="pt-1">
              <button
                type="button"
                onClick={() => alert('Password reset link sent to your registered email.')}
                className="text-[11px] text-neutral-500 hover:text-neutral-950 underline underline-offset-4 tracking-wide font-normal transition-colors"
              >
                Forgotten your password?
              </button>
            </div>

            {/* Action Buttons: LOG IN & SIGN UP */}
            <div className="space-y-3 pt-3">
              {/* LOG IN Button (Solid Black) */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-black hover:bg-neutral-800 text-white font-medium text-[11px] sm:text-xs uppercase tracking-[0.12em] py-3.5 px-6 transition-colors rounded-none disabled:opacity-50"
              >
                {isLoading ? 'LOGGING IN...' : 'LOG IN'}
              </button>

              {/* SIGN UP Button (Outlined White) */}
              <Link
                to="/register"
                className="w-full inline-block text-center bg-white hover:bg-neutral-50 border border-black text-black font-medium text-[11px] sm:text-xs uppercase tracking-[0.12em] py-3.5 px-6 transition-colors rounded-none"
              >
                SIGN UP
              </Link>
            </div>
          </form>

          {/* SOCIAL LOGIN SECTION */}
          <SocialLogin
            disabled={isLoading}
            onGoogleLogin={() => handleQuickDemo('customer@aurelius.com', 'Customer@123456')}
            onAppleLogin={() => handleQuickDemo('admin@example.com', 'Admin@123')}
          />

          {/* Quick Demo Test Access (Discreet Luxury Helper) */}
          <div className="pt-6 border-t border-neutral-100 text-center">
            <button
              type="button"
              onClick={() => setShowDemoAccounts(!showDemoAccounts)}
              className="text-[10px] uppercase tracking-[0.15em] text-neutral-400 hover:text-neutral-900 transition-colors"
            >
              {showDemoAccounts ? '− Hide Demo Logins' : '+ Quick Demo Credentials'}
            </button>

            {showDemoAccounts && (
              <div className="mt-3 grid grid-cols-2 gap-2 text-left animate-in fade-in duration-200">
                <button
                  type="button"
                  onClick={() => handleQuickDemo('admin@example.com', 'Admin@123')}
                  className="p-2 border border-neutral-200 hover:border-black text-[10px] text-neutral-700 transition-colors"
                >
                  <strong className="block text-black">ADMIN DEMO</strong>
                  <span>admin@example.com</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickDemo('customer@aurelius.com', 'Customer@123456')}
                  className="p-2 border border-neutral-200 hover:border-black text-[10px] text-neutral-700 transition-colors"
                >
                  <strong className="block text-black">CUSTOMER DEMO</strong>
                  <span>customer@aurelius.com</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Minimal Footer Notice */}
        <div className="pt-8 text-center text-[10px] text-neutral-400 tracking-wider uppercase">
          &copy; {new Date().getFullYear()} AURELIUS • ATELIER HOME
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
