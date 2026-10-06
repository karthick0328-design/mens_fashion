import React from 'react';
import { Sparkles, Truck } from 'lucide-react';

export const AnnouncementBar: React.FC = () => {
  return (
    <div className="bg-neutral-950 text-neutral-300 text-xs py-2 px-4 border-b border-neutral-800">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="hidden md:flex items-center space-x-2 text-neutral-400">
          <Truck className="w-3.5 h-3.5 text-amber-400" />
          <span>Complimentary Pan-India Delivery on orders above ₹999</span>
        </div>
        <div className="mx-auto md:mx-0 flex items-center space-x-2 font-medium">
          <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
          <span>
            Use code <strong className="text-amber-400 tracking-wider">WELCOME10</strong> for extra 10% off your first luxury order
          </span>
        </div>
        <div className="hidden lg:flex items-center space-x-4 text-neutral-400 text-[11px]">
          <span>100% Authentic Guarantee</span>
          <span>•</span>
          <span>7-Day Return Guarantee</span>
        </div>
      </div>
    </div>
  );
};
