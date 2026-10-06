import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, RefreshCw, Truck, Award, ArrowRight } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-neutral-950 text-white pt-16 pb-12 border-t border-neutral-900 mt-auto">
      {/* Brand Value Pillars */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 border-b border-neutral-800">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 text-center sm:text-left">
          <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-3 sm:space-y-0 sm:space-x-4">
            <div className="p-3 bg-neutral-900 text-amber-400 rounded-lg flex-shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs uppercase font-bold tracking-wider text-white">Free Express Delivery</h4>
              <p className="text-xs text-neutral-400 mt-1">Complimentary on orders above ₹999 across India</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-3 sm:space-y-0 sm:space-x-4">
            <div className="p-3 bg-neutral-900 text-amber-400 rounded-lg flex-shrink-0">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs uppercase font-bold tracking-wider text-white">100% Authentic Quality</h4>
              <p className="text-xs text-neutral-400 mt-1">Directly sourced luxury fabrics & Swiss precision</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-3 sm:space-y-0 sm:space-x-4">
            <div className="p-3 bg-neutral-900 text-amber-400 rounded-lg flex-shrink-0">
              <RefreshCw className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs uppercase font-bold tracking-wider text-white">Hassle-Free Returns</h4>
              <p className="text-xs text-neutral-400 mt-1">7-day doorstep pickup and instant refunds</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-3 sm:space-y-0 sm:space-x-4">
            <div className="p-3 bg-neutral-900 text-amber-400 rounded-lg flex-shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs uppercase font-bold tracking-wider text-white">Secure Encrypted Payments</h4>
              <p className="text-xs text-neutral-400 mt-1">UPI, Credit/Debit cards & Cash on Delivery</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 sm:gap-10">
          {/* Brand Intro & Newsletter */}
          <div className="md:col-span-2 space-y-4">
            <span className="text-2xl font-extrabold uppercase tracking-[0.25em] font-serif-luxury text-white">
              AURELIUS
            </span>
            <p className="text-xs text-neutral-400 leading-relaxed max-w-sm">
              A contemporary menswear atelier redefining wardrobe staples through meticulous tailoring, premium natural fibres, and enduring modern silhouettes.
            </p>
            <div className="pt-2">
              <p className="text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-2">
                Join the Aurelius Circle
              </p>
              <form onSubmit={(e) => { e.preventDefault(); alert('Subscribed to private newsletter!'); }} className="flex max-w-sm">
                <input
                  type="email"
                  placeholder="Enter your email address"
                  required
                  className="bg-neutral-900 border border-neutral-800 text-xs text-white placeholder:text-neutral-500 px-3.5 py-2.5 rounded-l focus:outline-none focus:border-amber-400 flex-1"
                />
                <button
                  type="submit"
                  className="bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold px-4 py-2.5 rounded-r transition-colors flex items-center"
                >
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            </div>
          </div>

          {/* Men's Categories */}
          <div>
            <h5 className="text-xs font-bold uppercase tracking-wider text-neutral-200 mb-4">
              Men's Wardrobe
            </h5>
            <ul className="space-y-2.5 text-xs text-neutral-400">
              <li><Link to="/products?category=t-shirts" className="hover:text-white transition-colors">Luxury T-Shirts</Link></li>
              <li><Link to="/products?category=shirts" className="hover:text-white transition-colors">Oxford & Linen Shirts</Link></li>
              <li><Link to="/products?category=jeans" className="hover:text-white transition-colors">Selvedge Denim</Link></li>
              <li><Link to="/products?category=trousers" className="hover:text-white transition-colors">Tailored Chinos</Link></li>
              <li><Link to="/products?category=watches" className="hover:text-white transition-colors">Horology & Watches</Link></li>
              <li><Link to="/products?category=footwear" className="hover:text-white transition-colors">Leather Footwear</Link></li>
            </ul>
          </div>

          {/* Customer Concierge */}
          <div>
            <h5 className="text-xs font-bold uppercase tracking-wider text-neutral-200 mb-4">
              Client Services
            </h5>
            <ul className="space-y-2.5 text-xs text-neutral-400">
              <li><Link to="/user/order" className="hover:text-white transition-colors">Track Your Order</Link></li>
              <li><Link to="/user/profile" className="hover:text-white transition-colors">Shipping & Delivery</Link></li>
              <li><Link to="/user/profile" className="hover:text-white transition-colors">Returns & Exchanges</Link></li>
              <li><span className="hover:text-white cursor-pointer transition-colors">Size Guide & Fit Matrix</span></li>
              <li><span className="hover:text-white cursor-pointer transition-colors">Care Instructions</span></li>
              <li><span className="hover:text-white cursor-pointer transition-colors">Contact Concierge</span></li>
            </ul>
          </div>

          {/* Company & Legal */}
          <div>
            <h5 className="text-xs font-bold uppercase tracking-wider text-neutral-200 mb-4">
              The Atelier
            </h5>
            <ul className="space-y-2.5 text-xs text-neutral-400">
              <li><span className="hover:text-white cursor-pointer transition-colors">Our Craft & Materials</span></li>
              <li><span className="hover:text-white cursor-pointer transition-colors">Sustainability Commitment</span></li>
              <li><span className="hover:text-white cursor-pointer transition-colors">Store Locator</span></li>
              <li><span className="hover:text-white cursor-pointer transition-colors">Privacy Policy</span></li>
              <li><span className="hover:text-white cursor-pointer transition-colors">Terms of Service</span></li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 border-t border-neutral-900 flex flex-col sm:flex-row items-center justify-between text-xs text-neutral-500">
        <p>&copy; {new Date().getFullYear()} AURELIUS Inc. All rights reserved. Crafted for the Modern Gentleman.</p>
        <div className="flex items-center space-x-6 mt-4 sm:mt-0">
          <span>100% Secure Checkout</span>
          <span>•</span>
          <span>Made in India</span>
        </div>
      </div>
    </footer>
  );
};
