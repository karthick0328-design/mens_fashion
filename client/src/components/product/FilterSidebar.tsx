import React, { useState } from 'react';
import { ChevronDown, ChevronUp, RotateCcw, Star } from 'lucide-react';
import { PRODUCT_SIZES, ProductSize } from '../../types';

interface FilterSidebarProps {
  categories: any[];
  facets: {
    brands: string[];
    colors: string[];
    sizes: string[];
  };
  selectedCategory: string;
  selectedBrands: string[];
  selectedColors: string[];
  selectedSizes: ProductSize[];
  selectedRating: number | null;
  selectedDiscount: number | null;
  minPrice: string;
  maxPrice: string;
  inStockOnly: boolean;
  onCategoryChange: (slug: string) => void;
  onBrandToggle: (brand: string) => void;
  onColorToggle: (color: string) => void;
  onSizeToggle: (size: ProductSize) => void;
  onRatingChange: (rating: number | null) => void;
  onDiscountChange: (discount: number | null) => void;
  onPriceChange: (min: string, max: string) => void;
  onStockChange: (inStock: boolean) => void;
  onClearAll: () => void;
}

export const FilterSidebar: React.FC<FilterSidebarProps> = ({
  categories,
  facets,
  selectedCategory,
  selectedBrands,
  selectedColors,
  selectedSizes,
  selectedRating,
  selectedDiscount,
  minPrice,
  maxPrice,
  inStockOnly,
  onCategoryChange,
  onBrandToggle,
  onColorToggle,
  onSizeToggle,
  onRatingChange,
  onDiscountChange,
  onPriceChange,
  onStockChange,
  onClearAll,
}) => {
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    categories: true,
    brands: true,
    price: true,
    sizes: true,
    colors: true,
    rating: true,
    discount: true,
  });

  const [brandSearch, setBrandSearch] = useState('');

  const toggleSection = (section: string) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const filteredBrands = facets.brands.filter((b) =>
    b.toLowerCase().includes(brandSearch.toLowerCase())
  );

  return (
    <aside className="w-full bg-white border border-neutral-200 rounded-lg divide-y divide-neutral-200 text-xs shadow-sm">
      {/* Filters Header */}
      <div className="p-4 flex items-center justify-between">
        <span className="font-bold text-neutral-900 uppercase tracking-wider text-xs">
          Filters
        </span>
        <button
          onClick={onClearAll}
          className="text-amber-700 hover:text-amber-900 font-semibold flex items-center space-x-1 uppercase text-[11px]"
        >
          <RotateCcw className="w-3 h-3" />
          <span>Clear All</span>
        </button>
      </div>

      {/* 1. Categories */}
      <div className="p-4">
        <button
          onClick={() => toggleSection('categories')}
          className="w-full flex justify-between items-center font-bold text-neutral-800 uppercase tracking-wider mb-2"
        >
          <span>Categories</span>
          {openSections.categories ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
        {openSections.categories && (
          <div className="space-y-1.5 pt-1">
            <button
              onClick={() => onCategoryChange('')}
              className={`block w-full text-left py-1 px-2 rounded transition-colors ${
                !selectedCategory ? 'bg-neutral-900 text-white font-bold' : 'text-neutral-600 hover:bg-neutral-50'
              }`}
            >
              All Categories
            </button>
            {categories.map((cat) => (
              <div key={cat.slug} className="space-y-1">
                <button
                  onClick={() => onCategoryChange(cat.slug)}
                  className={`block w-full text-left py-1 px-2 rounded font-medium transition-colors ${
                    selectedCategory === cat.slug ? 'bg-neutral-900 text-white font-bold' : 'text-neutral-800 hover:bg-neutral-50'
                  }`}
                >
                  {cat.name}
                </button>
                {/* Child Categories if any */}
                {cat.children && cat.children.length > 0 && (
                  <div className="pl-3 space-y-0.5">
                    {cat.children.map((child: any) => (
                      <button
                        key={child.slug}
                        onClick={() => onCategoryChange(child.slug)}
                        className={`block w-full text-left py-0.5 px-2 rounded text-[11px] transition-colors ${
                          selectedCategory === child.slug
                            ? 'text-amber-700 font-bold bg-amber-50'
                            : 'text-neutral-500 hover:text-neutral-900'
                        }`}
                      >
                        • {child.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 2. Brand */}
      <div className="p-4">
        <button
          onClick={() => toggleSection('brands')}
          className="w-full flex justify-between items-center font-bold text-neutral-800 uppercase tracking-wider mb-2"
        >
          <span>Brand ({facets.brands.length})</span>
          {openSections.brands ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
        {openSections.brands && (
          <div className="space-y-2 pt-1">
            {facets.brands.length > 5 && (
              <input
                type="text"
                value={brandSearch}
                onChange={(e) => setBrandSearch(e.target.value)}
                placeholder="Search brands..."
                className="w-full px-2 py-1 border border-neutral-200 rounded text-xs focus:outline-none focus:border-neutral-900"
              />
            )}
            <div className="max-h-40 overflow-y-auto space-y-1.5 pr-1">
              {filteredBrands.map((b) => (
                <label key={b} className="flex items-center space-x-2 text-neutral-700 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={selectedBrands.includes(b)}
                    onChange={() => onBrandToggle(b)}
                    className="rounded border-neutral-300 text-neutral-900 focus:ring-0 w-3.5 h-3.5"
                  />
                  <span>{b}</span>
                </label>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 3. Price Range */}
      <div className="p-4">
        <button
          onClick={() => toggleSection('price')}
          className="w-full flex justify-between items-center font-bold text-neutral-800 uppercase tracking-wider mb-2"
        >
          <span>Price (₹)</span>
          {openSections.price ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
        {openSections.price && (
          <div className="space-y-3 pt-1">
            <div className="flex items-center space-x-2">
              <input
                type="number"
                value={minPrice}
                onChange={(e) => onPriceChange(e.target.value, maxPrice)}
                placeholder="Min ₹"
                className="w-full px-2 py-1.5 border border-neutral-200 rounded text-xs focus:outline-none focus:border-neutral-900"
              />
              <span className="text-neutral-400">to</span>
              <input
                type="number"
                value={maxPrice}
                onChange={(e) => onPriceChange(minPrice, e.target.value)}
                placeholder="Max ₹"
                className="w-full px-2 py-1.5 border border-neutral-200 rounded text-xs focus:outline-none focus:border-neutral-900"
              />
            </div>
            <div className="space-y-1 text-[11px] text-neutral-600">
              <button
                onClick={() => onPriceChange('0', '999')}
                className="block hover:text-neutral-950 font-medium"
              >
                Under ₹999
              </button>
              <button
                onClick={() => onPriceChange('1000', '1999')}
                className="block hover:text-neutral-950 font-medium"
              >
                ₹1,000 - ₹1,999
              </button>
              <button
                onClick={() => onPriceChange('2000', '4999')}
                className="block hover:text-neutral-950 font-medium"
              >
                ₹2,000 - ₹4,999
              </button>
              <button
                onClick={() => onPriceChange('5000', '')}
                className="block hover:text-neutral-950 font-medium"
              >
                ₹5,000 & Above
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 4. Sizes */}
      <div className="p-4">
        <button
          onClick={() => toggleSection('sizes')}
          className="w-full flex justify-between items-center font-bold text-neutral-800 uppercase tracking-wider mb-2"
        >
          <span>Size</span>
          {openSections.sizes ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
        {openSections.sizes && (
          <div className="grid grid-cols-4 gap-1.5 pt-1">
            {PRODUCT_SIZES.slice(0, 10).map((sz: ProductSize) => {
              const active = selectedSizes.includes(sz);
              return (
                <button
                  key={sz}
                  onClick={() => onSizeToggle(sz)}
                  className={`py-1.5 text-center rounded border font-semibold text-[11px] transition-all ${
                    active
                      ? 'bg-neutral-900 border-neutral-900 text-white'
                      : 'border-neutral-200 hover:border-neutral-400 text-neutral-700 bg-white'
                  }`}
                >
                  {sz}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* 5. Colors */}
      <div className="p-4">
        <button
          onClick={() => toggleSection('colors')}
          className="w-full flex justify-between items-center font-bold text-neutral-800 uppercase tracking-wider mb-2"
        >
          <span>Color</span>
          {openSections.colors ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
        {openSections.colors && (
          <div className="space-y-1.5 pt-1 max-h-36 overflow-y-auto">
            {facets.colors.map((c) => (
              <label key={c} className="flex items-center space-x-2 text-neutral-700 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={selectedColors.includes(c)}
                  onChange={() => onColorToggle(c)}
                  className="rounded border-neutral-300 text-neutral-900 focus:ring-0 w-3.5 h-3.5"
                />
                <span>{c}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* 6. Customer Rating */}
      <div className="p-4">
        <button
          onClick={() => toggleSection('rating')}
          className="w-full flex justify-between items-center font-bold text-neutral-800 uppercase tracking-wider mb-2"
        >
          <span>Customer Ratings</span>
          {openSections.rating ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
        {openSections.rating && (
          <div className="space-y-1.5 pt-1">
            {[4, 3, 2].map((stars) => (
              <button
                key={stars}
                onClick={() => onRatingChange(selectedRating === stars ? null : stars)}
                className={`w-full flex items-center space-x-2 py-1 px-2 rounded text-left transition-colors ${
                  selectedRating === stars ? 'bg-amber-50 text-amber-900 font-bold' : 'hover:bg-neutral-50 text-neutral-700'
                }`}
              >
                <div className="flex items-center space-x-0.5 text-amber-500">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`w-3 h-3 ${i < stars ? 'fill-amber-400 text-amber-400' : 'text-neutral-200'}`}
                    />
                  ))}
                </div>
                <span>{stars}★ & above</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* 7. Discount */}
      <div className="p-4">
        <button
          onClick={() => toggleSection('discount')}
          className="w-full flex justify-between items-center font-bold text-neutral-800 uppercase tracking-wider mb-2"
        >
          <span>Discount</span>
          {openSections.discount ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
        {openSections.discount && (
          <div className="space-y-1.5 pt-1">
            {[50, 40, 30, 20].map((d) => (
              <label key={d} className="flex items-center space-x-2 text-neutral-700 cursor-pointer select-none">
                <input
                  type="radio"
                  name="discount"
                  checked={selectedDiscount === d}
                  onChange={() => onDiscountChange(selectedDiscount === d ? null : d)}
                  className="border-neutral-300 text-neutral-900 focus:ring-0 w-3.5 h-3.5"
                />
                <span>{d}% and above</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* 8. Availability */}
      <div className="p-4">
        <label className="flex items-center space-x-2 text-neutral-800 font-semibold cursor-pointer select-none">
          <input
            type="checkbox"
            checked={inStockOnly}
            onChange={(e) => onStockChange(e.target.checked)}
            className="rounded border-neutral-300 text-neutral-900 focus:ring-0 w-4 h-4"
          />
          <span>Include Out of Stock</span>
        </label>
      </div>
    </aside>
  );
};
