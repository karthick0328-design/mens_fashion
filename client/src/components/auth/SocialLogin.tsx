import React from 'react';

interface SocialLoginProps {
  onGoogleLogin?: () => void;
  onAppleLogin?: () => void;
  disabled?: boolean;
}

export const SocialLogin: React.FC<SocialLoginProps> = ({
  onGoogleLogin,
  onAppleLogin,
  disabled = false,
}) => {
  return (
    <div className="space-y-4 pt-4">
      {/* Section Header */}
      <div className="text-center space-y-2">
        <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.08em] font-medium text-neutral-500 block">
          YOU CAN ALSO ACCESS WITH
        </span>
        <p className="text-[10px] text-neutral-400 leading-relaxed max-w-sm mx-auto">
          By logging/signing in with my social login, I agree to connect my account in accordance with the{' '}
          <a href="#" className="underline hover:text-neutral-700">Privacy Policy</a>.
        </p>
      </div>

      {/* Buttons */}
      <div className="space-y-2.5">
        {/* Google Button */}
        <button
          type="button"
          disabled={disabled}
          onClick={onGoogleLogin}
          className="w-full flex items-center justify-center space-x-3 bg-white border border-neutral-300 hover:border-black text-neutral-900 py-2.5 px-4 text-xs tracking-wider transition-colors rounded-none disabled:opacity-50"
        >
          {/* Subtle Google 'G' icon */}
          <svg className="w-3.5 h-3.5 flex-shrink-0" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
            />
            <path
              fill="#34A853"
              d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
            />
            <path
              fill="#FBBC05"
              d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 10.03 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
            />
            <path
              fill="#EA4335"
              d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
            />
          </svg>
          <span className="font-normal text-[11px] sm:text-xs">Continue with Google</span>
        </button>

        {/* Apple Button */}
        <button
          type="button"
          disabled={disabled}
          onClick={onAppleLogin}
          className="w-full flex items-center justify-center space-x-3 bg-white border border-neutral-300 hover:border-black text-neutral-900 py-2.5 px-4 text-xs tracking-wider transition-colors rounded-none disabled:opacity-50"
        >
          {/* Subtle Apple icon */}
          <svg className="w-3.5 h-3.5 flex-shrink-0 fill-current" viewBox="0 0 170 170">
            <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.35.13-9.16-1.9-14.42-6.08-3.7-3.08-7.7-7.85-12.01-14.31-6.19-9.24-11.12-19.78-14.78-31.62-3.67-11.83-5.5-22.99-5.5-33.48 0-14.65 3.69-26.69 11.07-36.12 7.38-9.43 16.63-14.28 27.76-14.56 5.01 0 10.38 1.34 16.12 4.02 5.73 2.68 9.4 4.07 11 4.17 1.83 0 5.76-1.48 11.78-4.44 6.02-2.96 11.37-4.27 16.05-3.92 12.39.73 22.38 5.25 29.98 13.56-10.87 6.53-16.19 15.54-15.96 27.02.24 9.13 3.73 16.74 10.47 22.84 6.74 6.1 14.77 9.87 24.08 11.31-2.28 6.94-5.06 14.12-8.34 21.55zM119.22 33.64c0-7.39 2.67-14.36 8.01-20.91 5.34-6.55 11.96-10.8 19.86-12.73.5 2.12.75 4.31.75 6.57 0 7.39-2.73 14.48-8.19 21.28-5.46 6.8-12.07 11.05-19.83 12.73-.24-2.12-.6-4.44-.6-6.94z" />
          </svg>
          <span className="font-normal text-[11px] sm:text-xs">Continue with Apple</span>
        </button>
      </div>
    </div>
  );
};

export default SocialLogin;
