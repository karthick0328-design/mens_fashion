import React, { useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { SlidersHorizontal, ChevronRight, X, ArrowUpDown } from 'lucide-react';
import api from '../../services/api';
import { IProduct, ICategory, ProductSize } from '../../types';
import { AnnouncementBar } from '../../components/layout/AnnouncementBar';
import { Header } from '../../components/layout/Header';
import { Footer } from '../../components/layout/Footer';
import { CartDrawer } from '../../components/cart/CartDrawer';
import { ProductCard } from '../../components/product/ProductCard';
import { FilterSidebar } from '../../components/product/FilterSidebar';

export const ProductsPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Read filter state directly from URL query parameters
  const search = searchParams.get('search') || '';
  const category = searchParams.get('category') || '';
  const brandParam = searchParams.get('brand') || '';
  const colorParam = searchParams.get('color') || '';
  const sizeParam = searchParams.get('size') || '';
  const minPrice = searchParams.get('minPrice') || '';
  const maxPrice = searchParams.get('maxPrice') || '';
  const rating = searchParams.get('rating') ? Number(searchParams.get('rating')) : null;
  const discount = searchParams.get('discount') ? Number(searchParams.get('discount')) : null;
  const sort = searchParams.get('sort') || 'relevance';
  const page = parseInt(searchParams.get('page') || '1', 10);
  const includeOutOfStock = searchParams.get('availability') === 'false';

  const selectedBrands = brandParam ? brandParam.split(',') : [];
  const selectedColors = colorParam ? colorParam.split(',') : [];
  const selectedSizes = (sizeParam ? sizeParam.split(',') : []) as ProductSize[];

  // Update URL search parameters helper
  const updateParams = (newParams: Record<string, string | null>) => {
    const updated = new URLSearchParams(searchParams);
    Object.entries(newParams).forEach(([key, value]) => {
      if (value === null || value === '' || (Array.isArray(value) && value.length === 0)) {
        updated.delete(key);
      } else {
        updated.set(key, value);
      }
    });
    // Reset to page 1 on filter changes unless changing page directly
    if (!('page' in newParams)) {
      updated.set('page', '1');
    }
    setSearchParams(updated);
  };

  // 1. Fetch Categories tree
  const { data: categories = [] } = useQuery<ICategory[]>({
    queryKey: ['categories'],
    queryFn: async () => {
      const res = await api.get('/categories');
      return res.data?.data || [];
    },
  });

  // 2. Fetch Facets (available brands, colors, sizes for current category)
  const { data: facets = { brands: [], colors: [], sizes: [] } } = useQuery({
    queryKey: ['facets', category, search],
    queryFn: async () => {
      const res = await api.get('/products/facets', {
        params: { category, search },
      });
      return res.data?.data || { brands: [], colors: [], sizes: [] };
    },
  });

  // 3. Fetch Filtered Products from Backend
  const { data: productResponse, isLoading } = useQuery({
    queryKey: ['products', searchParams.toString()],
    queryFn: async () => {
      const res = await api.get('/products', {
        params: {
          search: search || undefined,
          category: category || undefined,
          brand: brandParam || undefined,
          color: colorParam || undefined,
          size: sizeParam || undefined,
          minPrice: minPrice || undefined,
          maxPrice: maxPrice || undefined,
          rating: rating || undefined,
          discount: discount || undefined,
          sort,
          page,
          limit: 16,
          availability: includeOutOfStock ? undefined : true,
        },
      });
      return res.data;
    },
  });

  const products: IProduct[] = productResponse?.data || [];
  const meta = productResponse?.meta || { total: 0, totalPages: 1, page: 1, limit: 16 };

  // Filter Handler Actions
  const handleCategoryChange = (slug: string) => {
    updateParams({ category: slug || null });
  };

  const handleBrandToggle = (brandName: string) => {
    const next = selectedBrands.includes(brandName)
      ? selectedBrands.filter((b) => b !== brandName)
      : [...selectedBrands, brandName];
    updateParams({ brand: next.length > 0 ? next.join(',') : null });
  };

  const handleColorToggle = (colorName: string) => {
    const next = selectedColors.includes(colorName)
      ? selectedColors.filter((c) => c !== colorName)
      : [...selectedColors, colorName];
    updateParams({ color: next.length > 0 ? next.join(',') : null });
  };

  const handleSizeToggle = (sizeName: ProductSize) => {
    const next = selectedSizes.includes(sizeName)
      ? selectedSizes.filter((s) => s !== sizeName)
      : [...selectedSizes, sizeName];
    updateParams({ size: next.length > 0 ? next.join(',') : null });
  };

  const handleRatingChange = (newRating: number | null) => {
    updateParams({ rating: newRating ? String(newRating) : null });
  };

  const handleDiscountChange = (newDiscount: number | null) => {
    updateParams({ discount: newDiscount ? String(newDiscount) : null });
  };

  const handlePriceChange = (min: string, max: string) => {
    updateParams({ minPrice: min || null, maxPrice: max || null });
  };

  const handleStockChange = (inStock: boolean) => {
    updateParams({ availability: inStock ? 'false' : null });
  };

  const handleSortChange = (newSort: string) => {
    updateParams({ sort: newSort });
  };

  const handleClearAll = () => {
    setSearchParams(new URLSearchParams());
  };

  // Determine active breadcrumb label
  const activeCategoryName = categories.find((c) => c.slug === category)?.name || 'All Men';

  return (
    <div className="min-h-screen flex flex-col bg-neutral-50">
      <AnnouncementBar />
      <Header />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center space-x-2 text-xs text-neutral-500 mb-4">
          <Link to="/" className="hover:text-neutral-900 transition-colors">Home</Link>
          <ChevronRight className="w-3 h-3 text-neutral-400" />
          <Link to="/products" className="hover:text-neutral-900 transition-colors">Men's Catalog</Link>
          {category && (
            <>
              <ChevronRight className="w-3 h-3 text-neutral-400" />
              <span className="font-semibold text-neutral-900 capitalize">{activeCategoryName}</span>
            </>
          )}
          {search && (
            <>
              <ChevronRight className="w-3 h-3 text-neutral-400" />
              <span className="font-semibold text-neutral-900">Search: "{search}"</span>
            </>
          )}
        </nav>

        {/* Listing Title & Sort Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-6 border-b border-neutral-200 gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold uppercase tracking-tight font-serif-luxury text-neutral-900">
              {search ? `Search Results for "${search}"` : activeCategoryName}
            </h1>
            <p className="text-xs text-neutral-500 mt-1">
              Showing {meta.total > 0 ? (meta.page - 1) * meta.limit + 1 : 0}–
              {Math.min(meta.page * meta.limit, meta.total)} of {meta.total.toLocaleString()} products
            </p>
          </div>

          <div className="flex items-center space-x-3">
            {/* Mobile Filter Button */}
            <button
              onClick={() => setMobileFilterOpen(true)}
              className="lg:hidden flex items-center space-x-1.5 px-3 py-2 border border-neutral-300 rounded text-xs font-semibold text-neutral-800 bg-white"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Filters</span>
            </button>

            {/* Sort Dropdown */}
            <div className="flex items-center space-x-2 text-xs bg-white border border-neutral-300 rounded px-3 py-1.5 shadow-sm">
              <ArrowUpDown className="w-3.5 h-3.5 text-neutral-500" />
              <span className="text-neutral-500 hidden sm:inline">Sort By:</span>
              <select
                value={sort}
                onChange={(e) => handleSortChange(e.target.value)}
                className="bg-transparent font-semibold text-neutral-900 focus:outline-none cursor-pointer"
              >
                <option value="relevance">Relevance</option>
                <option value="popularity">Popularity / Customer Rating</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="newest">Newest Arrivals</option>
                <option value="discount">Biggest Discount</option>
              </select>
            </div>
          </div>
        </div>

        {/* Active Filter Chips */}
        {(selectedBrands.length > 0 ||
          selectedColors.length > 0 ||
          selectedSizes.length > 0 ||
          minPrice ||
          maxPrice ||
          rating ||
          discount) && (
          <div className="flex flex-wrap items-center gap-2 mb-6 text-xs">
            <span className="text-neutral-500 font-medium">Applied:</span>
            {selectedBrands.map((b) => (
              <span key={b} className="inline-flex items-center space-x-1 bg-white border border-neutral-200 px-2.5 py-1 rounded-full text-neutral-800">
                <span>{b}</span>
                <X className="w-3 h-3 cursor-pointer hover:text-red-600" onClick={() => handleBrandToggle(b)} />
              </span>
            ))}
            {selectedColors.map((c) => (
              <span key={c} className="inline-flex items-center space-x-1 bg-white border border-neutral-200 px-2.5 py-1 rounded-full text-neutral-800">
                <span>{c}</span>
                <X className="w-3 h-3 cursor-pointer hover:text-red-600" onClick={() => handleColorToggle(c)} />
              </span>
            ))}
            {selectedSizes.map((s) => (
              <span key={s} className="inline-flex items-center space-x-1 bg-white border border-neutral-200 px-2.5 py-1 rounded-full text-neutral-800">
                <span>Size: {s}</span>
                <X className="w-3 h-3 cursor-pointer hover:text-red-600" onClick={() => handleSizeToggle(s)} />
              </span>
            ))}
            {rating && (
              <span className="inline-flex items-center space-x-1 bg-white border border-neutral-200 px-2.5 py-1 rounded-full text-neutral-800">
                <span>{rating}★ & Above</span>
                <X className="w-3 h-3 cursor-pointer hover:text-red-600" onClick={() => handleRatingChange(null)} />
              </span>
            )}
            {discount && (
              <span className="inline-flex items-center space-x-1 bg-white border border-neutral-200 px-2.5 py-1 rounded-full text-neutral-800">
                <span>{discount}%+ Off</span>
                <X className="w-3 h-3 cursor-pointer hover:text-red-600" onClick={() => handleDiscountChange(null)} />
              </span>
            )}
            <button
              onClick={handleClearAll}
              className="text-amber-800 font-bold hover:underline pl-2 uppercase text-[11px]"
            >
              Clear All
            </button>
          </div>
        )}

        {/* 2-Column Marketplace Layout (Sidebar Left, Products Right) */}
        <div className="flex gap-8 items-start">
          {/* Desktop Left Sidebar (260px) */}
          <div className="hidden lg:block w-64 flex-shrink-0 sticky top-28">
            <FilterSidebar
              categories={categories}
              facets={facets}
              selectedCategory={category}
              selectedBrands={selectedBrands}
              selectedColors={selectedColors}
              selectedSizes={selectedSizes}
              selectedRating={rating}
              selectedDiscount={discount}
              minPrice={minPrice}
              maxPrice={maxPrice}
              inStockOnly={includeOutOfStock}
              onCategoryChange={handleCategoryChange}
              onBrandToggle={handleBrandToggle}
              onColorToggle={handleColorToggle}
              onSizeToggle={handleSizeToggle}
              onRatingChange={handleRatingChange}
              onDiscountChange={handleDiscountChange}
              onPriceChange={handlePriceChange}
              onStockChange={handleStockChange}
              onClearAll={handleClearAll}
            />
          </div>

          {/* Right Product Grid */}
          <div className="flex-1 min-w-0">
            {isLoading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 lg:gap-5">
                {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                  <div key={n} className="bg-white border border-neutral-200 rounded-lg overflow-hidden animate-pulse">
                    <div className="aspect-[3/4] bg-neutral-200" />
                    <div className="p-3.5 space-y-2">
                      <div className="h-3 bg-neutral-200 rounded w-1/3" />
                      <div className="h-4 bg-neutral-200 rounded w-full" />
                      <div className="h-4 bg-neutral-200 rounded w-1/2" />
                    </div>
                  </div>
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="bg-white border border-neutral-200 rounded-lg p-12 text-center">
                <SlidersHorizontal className="w-12 h-12 text-neutral-300 mx-auto mb-3" />
                <h3 className="text-base font-bold text-neutral-800">No products match your filters</h3>
                <p className="text-xs text-neutral-500 mt-1 max-w-sm mx-auto">
                  Try clearing some of your selected filters or search terms to see available inventory.
                </p>
                <button
                  onClick={handleClearAll}
                  className="mt-5 bg-neutral-950 text-white text-xs font-bold uppercase tracking-wider px-6 py-2.5 rounded hover:bg-neutral-800 transition-colors"
                >
                  Clear All Filters
                </button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 lg:gap-5">
                  {products.map((product) => (
                    <ProductCard key={product._id} product={product} />
                  ))}
                </div>

                {/* Pagination */}
                {meta.totalPages > 1 && (
                  <div className="mt-12 flex items-center justify-center space-x-2">
                    <button
                      onClick={() => updateParams({ page: String(meta.page - 1) })}
                      disabled={!meta.hasPrevPage}
                      className="px-3.5 py-2 border border-neutral-200 rounded bg-white text-xs font-semibold text-neutral-700 hover:bg-neutral-50 disabled:opacity-40"
                    >
                      Previous
                    </button>
                    {Array.from({ length: meta.totalPages }).map((_, i) => {
                      const p = i + 1;
                      return (
                        <button
                          key={p}
                          onClick={() => updateParams({ page: String(p) })}
                          className={`w-9 h-9 rounded text-xs font-bold transition-all ${
                            meta.page === p
                              ? 'bg-neutral-950 text-white shadow'
                              : 'bg-white border border-neutral-200 text-neutral-700 hover:bg-neutral-50'
                          }`}
                        >
                          {p}
                        </button>
                      );
                    })}
                    <button
                      onClick={() => updateParams({ page: String(meta.page + 1) })}
                      disabled={!meta.hasNextPage}
                      className="px-3.5 py-2 border border-neutral-200 rounded bg-white text-xs font-semibold text-neutral-700 hover:bg-neutral-50 disabled:opacity-40"
                    >
                      Next
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </main>

      {/* Mobile Filters Slide-in Bottom Sheet / Drawer */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div
            className="fixed inset-0 bg-neutral-950/60 backdrop-blur-sm"
            onClick={() => setMobileFilterOpen(false)}
          />
          <div className="relative w-4/5 max-w-sm bg-white h-full shadow-2xl flex flex-col justify-between overflow-y-auto ml-auto p-4">
            <div className="flex items-center justify-between pb-4 border-b border-neutral-200">
              <span className="font-bold text-neutral-900 uppercase tracking-wider text-sm">
                Filter Catalog
              </span>
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="p-1 rounded text-neutral-500 hover:text-neutral-900"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="py-4 flex-1 overflow-y-auto">
              <FilterSidebar
                categories={categories}
                facets={facets}
                selectedCategory={category}
                selectedBrands={selectedBrands}
                selectedColors={selectedColors}
                selectedSizes={selectedSizes}
                selectedRating={rating}
                selectedDiscount={discount}
                minPrice={minPrice}
                maxPrice={maxPrice}
                inStockOnly={includeOutOfStock}
                onCategoryChange={(slug) => { handleCategoryChange(slug); }}
                onBrandToggle={handleBrandToggle}
                onColorToggle={handleColorToggle}
                onSizeToggle={handleSizeToggle}
                onRatingChange={handleRatingChange}
                onDiscountChange={handleDiscountChange}
                onPriceChange={handlePriceChange}
                onStockChange={handleStockChange}
                onClearAll={handleClearAll}
              />
            </div>
            <div className="pt-4 border-t border-neutral-200">
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="w-full bg-neutral-950 text-white font-bold text-xs uppercase tracking-wider py-3 rounded"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
      <CartDrawer />
    </div>
  );
};

export default ProductsPage;
