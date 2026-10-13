import React, { useState, useMemo } from 'react';
import { useStore } from '../context/StoreContext';
import { ProductCard } from '../components/ProductCard';
import { Search, SlidersHorizontal, RotateCcw } from 'lucide-react';

export const ShopView: React.FC = () => {
  const { products, selectedCategorySlug, setSelectedCategorySlug } = useStore();

  const [search, setSearch] = useState('');
  const [selectedSort, setSelectedSort] = useState<'featured' | 'price_asc' | 'price_desc' | 'rating' | 'newest' | 'popularity'>('featured');
  const [priceMax, setPriceMax] = useState<number>(75000);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [minRating, setMinRating] = useState<number>(0);
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);

  const categories = [
    { name: 'All Products', slug: null },
    { name: 'Luxury Fragrances', slug: 'fragrances' },
    { name: 'Lifestyle & Apparel', slug: 'apparel' },
    { name: 'Botanical Skincare', slug: 'skincare' }
  ];

  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Category filter
    if (selectedCategorySlug) {
      result = result.filter(p => {
        if (selectedCategorySlug === 'fragrances') return p.categoryId === 'cat_fragrances';
        if (selectedCategorySlug === 'apparel') return p.categoryId === 'cat_apparel';
        if (selectedCategorySlug === 'skincare') return p.categoryId === 'cat_skincare';
        return true;
      });
    }

    // Search query filter
    if (search.trim()) {
      const q = search.toLowerCase().trim();
      result = result.filter(
        p =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.categoryName.toLowerCase().includes(q) ||
          (p.fragranceFamily && p.fragranceFamily.toLowerCase().includes(q)) ||
          (p.notes && p.notes.some(n => n.toLowerCase().includes(q))) ||
          (p.ingredients && p.ingredients.toLowerCase().includes(q))
      );
    }

    // Price max filter
    result = result.filter(p => p.price <= priceMax);

    // In-stock filter
    if (inStockOnly) {
      result = result.filter(p => p.stock > 0);
    }

    // Min rating filter
    if (minRating > 0) {
      result = result.filter(p => p.averageRating >= minRating);
    }

    // Sorting
    if (selectedSort === 'price_asc') {
      result.sort((a, b) => a.price - b.price);
    } else if (selectedSort === 'price_desc') {
      result.sort((a, b) => b.price - a.price);
    } else if (selectedSort === 'rating') {
      result.sort((a, b) => b.averageRating - a.averageRating);
    } else if (selectedSort === 'newest') {
      result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } else if (selectedSort === 'popularity') {
      result.sort((a, b) => b.reviewCount - a.reviewCount);
    }

    return result;
  }, [products, selectedCategorySlug, search, priceMax, inStockOnly, minRating, selectedSort]);

  const resetFilters = () => {
    setSelectedCategorySlug(null);
    setSearch('');
    setPriceMax(75000);
    setInStockOnly(false);
    setMinRating(0);
    setSelectedSort('featured');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Editorial Header */}
      <div className="border-b border-[#E8DED4] pb-8 space-y-3">
        <span className="text-xs tracking-[0.25em] uppercase text-[#C9878D] font-semibold">
          Complete Collection
        </span>
        <h1 className="font-serif text-3xl sm:text-5xl text-[#392C2A]">
          {selectedCategorySlug === 'fragrances'
            ? 'Luxury Fragrances'
            : selectedCategorySlug === 'apparel'
            ? 'Lifestyle & Apparel'
            : selectedCategorySlug === 'skincare'
            ? 'Botanical Skincare'
            : 'All Products'}
        </h1>
        <p className="text-xs sm:text-sm text-[#7D6B67] max-w-2xl leading-relaxed">
          Discover artisanal perfumes, pure fabric garments, and restorative botanical skincare.
        </p>
      </div>

      {/* Category Tabs & Search Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#E8DED4] pb-4">
        <div className="flex flex-wrap gap-2">
          {categories.map(c => (
            <button
              key={c.name}
              onClick={() => setSelectedCategorySlug(c.slug)}
              className={`px-4 py-2 text-xs uppercase tracking-[0.16em] transition-colors cursor-pointer border rounded-sm ${
                selectedCategorySlug === c.slug
                  ? 'bg-[#C9878D] text-white border-[#C9878D] font-semibold shadow-xs'
                  : 'bg-[#FFFDF9] text-[#7D6B67] border-[#E8DED4] hover:border-[#C9878D] hover:text-[#392C2A]'
              }`}
            >
              {c.name}
            </button>
          ))}
        </div>

        {/* Search & Sort Controls */}
        <div className="flex items-center gap-3 w-full sm:w-auto">
          {/* In-catalog Search */}
          <div className="relative flex-1 sm:w-64">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#7D6B67]" />
            <input
              type="text"
              placeholder="Search by keyword, note, or material..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full bg-[#FFFDF9] border border-[#E8DED4] pl-8 pr-3 py-1.5 text-xs text-[#392C2A] placeholder-[#998] focus:outline-none focus:border-[#C9878D] rounded-sm"
            />
          </div>

          {/* Sort Selector */}
          <select
            value={selectedSort}
            onChange={e => setSelectedSort(e.target.value as any)}
            className="bg-[#FFFDF9] border border-[#E8DED4] px-3 py-1.5 text-xs text-[#392C2A] focus:outline-none focus:border-[#C9878D] uppercase tracking-wider cursor-pointer rounded-sm"
          >
            <option value="featured">Featured Products</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
            <option value="popularity">Most Popular</option>
            <option value="rating">Customer Rating</option>
            <option value="newest">New Arrivals</option>
          </select>

          {/* Mobile Filter Toggle */}
          <button
            onClick={() => setIsFilterDrawerOpen(!isFilterDrawerOpen)}
            className="sm:hidden p-2 border border-[#E8DED4] text-[#392C2A] bg-[#FFFDF9] rounded-sm cursor-pointer"
            aria-label="Filter"
          >
            <SlidersHorizontal className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Filter Bar (Price slider, In-stock filter, Rating filter) */}
      <div className={`p-4 bg-[#FFFDF9] border border-[#E8DED4] flex flex-wrap items-center justify-between gap-6 text-xs text-[#7D6B67] rounded-sm ${isFilterDrawerOpen ? 'block' : 'hidden sm:flex'}`}>
        <div className="flex items-center gap-4 flex-1 max-w-sm">
          <span className="text-[#392C2A] font-medium">Max Price:</span>
          <input
            type="range"
            min="4000"
            max="75000"
            step="1000"
            value={priceMax}
            onChange={e => setPriceMax(Number(e.target.value))}
            className="flex-1 accent-[#C9878D] cursor-pointer"
          />
          <span className="font-mono text-[#392C2A] font-semibold tabular-nums">
            ₹{priceMax.toLocaleString('en-US')}
          </span>
        </div>

        <div className="flex items-center gap-6">
          <label className="flex items-center gap-2 cursor-pointer text-[#392C2A]">
            <input
              type="checkbox"
              checked={inStockOnly}
              onChange={e => setInStockOnly(e.target.checked)}
              className="accent-[#C9878D]"
            />
            <span>In Stock Only</span>
          </label>

          <div className="flex items-center gap-2">
            <span className="text-[#392C2A] font-medium">Min Rating:</span>
            <select
              value={minRating}
              onChange={e => setMinRating(Number(e.target.value))}
              className="bg-[#FAF7F2] border border-[#E8DED4] px-2 py-1 text-xs text-[#392C2A] rounded-sm focus:border-[#C9878D]"
            >
              <option value="0">All Ratings</option>
              <option value="4.5">4.5+ Stars</option>
              <option value="4.8">4.8+ Stars</option>
              <option value="5.0">5.0 Stars</option>
            </select>
          </div>

          {(selectedCategorySlug || search || priceMax < 75000 || inStockOnly || minRating > 0) && (
            <button
              onClick={resetFilters}
              className="flex items-center gap-1.5 text-xs text-[#C9878D] hover:text-[#B56F75] hover:underline cursor-pointer font-medium"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset Filters</span>
            </button>
          )}
        </div>
      </div>

      {/* Product Grid */}
      {filteredProducts.length === 0 ? (
        <div className="text-center py-24 space-y-4 border border-[#E8DED4] bg-[#FFFDF9] p-8 rounded-sm">
          <p className="font-serif text-2xl text-[#7D6B67]">No products found matching your search.</p>
          <p className="text-xs text-[#7D6B67] max-w-sm mx-auto leading-relaxed">
            Try adjusting your price range, clearing specific keywords, or removing the in-stock filter.
          </p>
          <button
            onClick={resetFilters}
            className="mt-4 px-6 py-2.5 bg-[#C9878D] hover:bg-[#B56F75] text-white text-xs uppercase tracking-[0.2em] font-semibold transition-colors cursor-pointer shadow-sm rounded-sm"
          >
            Clear All Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};
