import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

interface AuthInputProps {
  id?: string;
  label: string;
  type?: 'text' | 'email' | 'password' | 'tel';
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  error?: string | null;
  required?: boolean;
  autoComplete?: string;
  disabled?: boolean;
  className?: string;
}

export const AuthInput: React.FC<AuthInputProps> = ({
  id,
  label,
  type = 'text',
  value,
  onChange,
  placeholder = '',
  error,
  required = false,
  autoComplete,
  disabled = false,
  className = '',
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === 'password';
  const inputType = isPassword ? (showPassword ? 'text' : 'password') : type;
  const inputId = id || label.toLowerCase().replace(/[^a-z0-9]/g, '-');

  return (
    <div className={`space-y-1 ${className}`}>
      <label
        htmlFor={inputId}
        className="block text-[10px] sm:text-[11px] tracking-[0.04em] font-medium text-neutral-800"
      >
        {label}
      </label>

      <div className="relative flex items-center">
        <input
          id={inputId}
          type={inputType}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          autoComplete={autoComplete}
          disabled={disabled}
          className={`w-full bg-transparent border-0 border-b ${
            error ? 'border-red-600' : 'border-neutral-300 focus:border-black'
          } py-2 text-xs sm:text-[13px] text-neutral-900 placeholder:text-neutral-400 placeholder:font-light focus:outline-none transition-colors rounded-none pr-8 disabled:opacity-50`}
        />

        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            tabIndex={-1}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
            className="absolute right-0 p-1 text-neutral-400 hover:text-neutral-900 transition-colors focus:outline-none"
          >
            {showPassword ? (
              <EyeOff className="w-3.5 h-3.5 stroke-[1.5]" />
            ) : (
              <Eye className="w-3.5 h-3.5 stroke-[1.5]" />
            )}
          </button>
        )}
      </div>

      {error && (
        <p className="text-[11px] text-red-600 tracking-wide font-normal pt-0.5">
          {error}
        </p>
      )}
    </div>
  );
};

export default AuthInput;
