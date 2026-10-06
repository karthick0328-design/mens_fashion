import React from 'react';
import { TrendingUp, TrendingDown, LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string;
  change: string;
  isPositive: boolean;
  comparison?: string;
  icon: LucideIcon;
  sparklineData?: number[];
  accentColor?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  change,
  isPositive,
  comparison = 'vs last month',
  icon: Icon,
  sparklineData,
}) => {
  return (
    <div className="relative overflow-hidden rounded-xl bg-white border border-neutral-200 p-5 shadow-sm hover:shadow-md transition-all duration-200">
      {/* Subtle top yellow accent line */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-yellow-400 to-transparent" />

      <div className="flex items-start justify-between">
        <span className="text-[11px] font-semibold uppercase tracking-[0.15em] text-neutral-500 ">
          {title}
        </span>
        <div className="p-2 rounded-lg bg-yellow-50 border border-yellow-200 text-yellow-600 ">
          <Icon className="w-4 h-4" />
        </div>
      </div>

      <div className="mt-3 flex items-baseline justify-between">
        <div className="text-2xl font-bold font-serif-luxury text-neutral-900 tracking-tight">
          {value}
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between text-[11px] pt-3 border-t border-neutral-100 ">
        <div className="flex items-center space-x-1.5">
          <span
            className={`flex items-center font-semibold ${
              isPositive ? 'text-emerald-600 ' : 'text-rose-600 '
            }`}
          >
            {isPositive ? <TrendingUp className="w-3.5 h-3.5 mr-0.5" /> : <TrendingDown className="w-3.5 h-3.5 mr-0.5" />}
            {change}
          </span>
          <span className="text-neutral-400 text-[10px]">{comparison}</span>
        </div>

        {/* Mini SVG sparkline */}
        {sparklineData && sparklineData.length > 0 && (
          <div className="w-16 h-5">
            <svg viewBox="0 0 50 16" className="w-full h-full stroke-current overflow-visible">
              <polyline
                fill="none"
                stroke={isPositive ? '#10b981' : '#f43f5e'}
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                points={sparklineData
                  .map((d, i) => `${(i / (sparklineData.length - 1)) * 50},${16 - (d / 100) * 14}`)
                  .join(' ')}
              />
            </svg>
          </div>
        )}
      </div>
    </div>
  );
};
