import React, { useState, useMemo } from 'react';
import { useStore } from '../context/StoreContext';
import { ProductCard } from '../components/ProductCard';
import { Search, SlidersHorizontal, RotateCcw, Sparkles } from 'lucide-react';

export const ShopView: React.FC = () => {
  const { products, selectedCategorySlug, setSelectedCategorySlug } = useStore();

  const [search, setSearch] = useState('');
  const [selectedSort, setSelectedSort] = useState<'featured' | 'price_asc' | 'price_desc' | 'rating' | 'newest' | 'popularity'>('featured');
  const [priceMax, setPriceMax] = useState<number>(75000);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [minRating, setMinRating] = useState<number>(0);
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);

  const categories = [
    { name: 'All Archive', slug: null },
    { name: 'Haute Parfumerie', slug: 'fragrances' },
    { name: 'Sartorial Wardrobe', slug: 'apparel' },
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
      <div className="border-b border-[#E7E0D6] pb-8 space-y-3">
        <span className="text-xs tracking-[0.25em] uppercase text-[#8C7A6B] font-semibold">
          The Complete Archive
        </span>
        <h1 className="font-serif text-3xl sm:text-5xl text-[#1E1714]">
          {selectedCategorySlug === 'fragrances'
            ? 'Haute Parfumerie'
            : selectedCategorySlug === 'apparel'
            ? 'Sartorial Wardrobe'
            : selectedCategorySlug === 'skincare'
            ? 'Botanical Skincare'
            : 'Artisanal Creations'}
        </h1>
        <p className="text-xs sm:text-sm text-[#5C4F44] max-w-2xl leading-relaxed">
          Explore our limited edition formulations and garments, handcrafted in numbered atelier runs.
        </p>
      </div>

      {/* Category Tabs & Search Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#E7E0D6] pb-4">
        <div className="flex flex-wrap gap-2">
          {categories.map(c => (
            <button
              key={c.name}
              onClick={() => setSelectedCategorySlug(c.slug)}
              className={`px-4 py-2 text-xs uppercase tracking-[0.16em] transition-colors cursor-pointer border ${
                selectedCategorySlug === c.slug
                  ? 'bg-[#1E1714] text-[#FAF8F5] border-[#1E1714] font-medium'
                  : 'bg-white text-[#6B5C50] border-[#E7E0D6] hover:border-[#8C7A6B]'
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
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#8C7A6B]" />
            <input
              type="text"
              placeholder="Search catalog by note or fabric..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full bg-white border border-[#DCD3C7] pl-8 pr-3 py-1.5 text-xs text-[#1E1714] placeholder-[#AAA] focus:outline-none focus:border-[#1E1714]"
            />
          </div>

          {/* Sort Selector */}
          <select
            value={selectedSort}
            onChange={e => setSelectedSort(e.target.value as any)}
            className="bg-white border border-[#DCD3C7] px-3 py-1.5 text-xs text-[#1E1714] focus:outline-none focus:border-[#1E1714] uppercase tracking-wider cursor-pointer"
          >
            <option value="featured">Featured Curations</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
            <option value="popularity">Popularity / Endorsements</option>
            <option value="rating">Connoisseur Rating</option>
            <option value="newest">New Arrivals</option>
          </select>

          {/* Mobile Filter Toggle */}
          <button
            onClick={() => setIsFilterDrawerOpen(!isFilterDrawerOpen)}
            className="sm:hidden p-2 border border-[#DCD3C7] text-[#1E1714] bg-white"
            aria-label="Filter"
          >
            <SlidersHorizontal className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Filter Bar (Price slider, In-stock filter, Rating filter) */}
      <div className={`p-4 bg-white border border-[#E7E0D6] flex flex-wrap items-center justify-between gap-6 text-xs text-[#5C4F44] ${isFilterDrawerOpen ? 'block' : 'hidden sm:flex'}`}>
        <div className="flex items-center gap-4 flex-1 max-w-sm">
          <span className="text-[#8C7A6B]">Price Ceiling:</span>
          <input
            type="range"
            min="4000"
            max="75000"
            step="1000"
            value={priceMax}
            onChange={e => setPriceMax(Number(e.target.value))}
            className="flex-1 accent-[#1E1714] cursor-pointer"
          />
          <span className="font-mono text-[#1E1714] font-semibold tabular-nums">
            ₹{priceMax.toLocaleString('en-IN')}
          </span>
        </div>

        <div className="flex items-center gap-6">
          <label className="flex items-center gap-2 cursor-pointer text-[#1E1714]">
            <input
              type="checkbox"
              checked={inStockOnly}
              onChange={e => setInStockOnly(e.target.checked)}
              className="accent-[#1E1714]"
            />
            <span>In Atelier Stock Only</span>
          </label>

          <div className="flex items-center gap-2">
            <span className="text-[#8C7A6B]">Min Rating:</span>
            <select
              value={minRating}
              onChange={e => setMinRating(Number(e.target.value))}
              className="bg-[#FAF8F5] border border-[#DCD3C7] px-2 py-1 text-xs text-[#1E1714]"
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
              className="flex items-center gap-1.5 text-xs text-[#8C7A6B] hover:text-[#1E1714] hover:underline cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset Filters</span>
            </button>
          )}
        </div>
      </div>

      {/* Product Grid */}
      {filteredProducts.length === 0 ? (
        <div className="text-center py-24 space-y-4 border border-[#E7E0D6] bg-white p-8">
          <p className="font-serif text-2xl text-[#8C7A6B]">No creations match your current criteria.</p>
          <p className="text-xs text-[#6B5C50] max-w-sm mx-auto leading-relaxed">
            Try expanding your price range, clearing specific note searches, or toggling off stock constraints.
          </p>
          <button
            onClick={resetFilters}
            className="mt-4 px-6 py-2.5 bg-[#1E1714] hover:bg-[#342721] text-[#FAF8F5] text-xs uppercase tracking-[0.2em] font-medium transition-colors cursor-pointer"
          >
            Reset All Filters
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
