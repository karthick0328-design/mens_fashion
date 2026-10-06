import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Watch, Award } from 'lucide-react';

export const WatchSpotlight: React.FC = () => {
  return (
    <section className="py-16 sm:py-20 bg-neutral-900 text-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-neutral-950 to-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 items-center">
            {/* Left Content */}
            <div className="p-6 sm:p-12 lg:p-16 space-y-5 sm:space-y-6">
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs tracking-wider uppercase font-semibold">
                <Watch className="w-4 h-4" />
                <span>Fine Horology Exhibition</span>
              </div>

              <h2 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight font-serif-luxury leading-tight text-white">
                PRECISION CHRONOGRAPHS & TIMEPIECES
              </h2>

              <p className="text-neutral-400 text-sm sm:text-base leading-relaxed">
                Engineered with aerospace-grade 316L stainless steel, scratch-resistant sapphire crystal lenses, and high-beat Japanese quartz movements. Every timepiece is water-tested to 50 meters and accompanied by an international warranty.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 py-2 border-y border-neutral-800 text-xs">
                <div className="flex items-center space-x-2 text-neutral-300">
                  <Award className="w-4 h-4 text-amber-400 flex-shrink-0" />
                  <span>2-Year International Warranty</span>
                </div>
                <div className="flex items-center space-x-2 text-neutral-300">
                  <Award className="w-4 h-4 text-amber-400 flex-shrink-0" />
                  <span>Sapphire Crystal Glass</span>
                </div>
              </div>

              <div className="pt-2">
                <Link
                  to="/products?category=watches"
                  className="inline-flex items-center space-x-2 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold uppercase tracking-wider text-xs px-8 py-3.5 rounded transition-all transform hover:-translate-y-0.5"
                >
                  <span>Explore All Watches</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* Right Watch Lifestyle Showcase */}
            <div className="relative h-80 sm:h-96 lg:h-full min-h-[420px] bg-neutral-950">
              <img
                src="https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=1000&auto=format&fit=crop&q=80"
                alt="Luxury Chronograph Watch"
                className="w-full h-full object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-neutral-950/70 via-transparent to-transparent" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
