import React, { useState, useMemo } from 'react';
import { useStore } from '../context/StoreContext';
import { ProductCard } from '../components/ProductCard';
import { Search, SlidersHorizontal, RotateCcw } from 'lucide-react';

export const ShopView: React.FC = () => {
  const { products, selectedCategorySlug, setSelectedCategorySlug } = useStore();

  const [search, setSearch] = useState('');
  const [selectedSort, setSelectedSort] = useState<'featured' | 'price_asc' | 'price_desc' | 'rating' | 'newest'>('featured');
  const [priceMax, setPriceMax] = useState<number>(75000);
  const [inStockOnly, setInStockOnly] = useState(false);
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
          (p.notes && p.notes.some(n => n.toLowerCase().includes(q)))
      );
    }

    // Price max filter
    result = result.filter(p => p.price <= priceMax);

    // In-stock filter
    if (inStockOnly) {
      result = result.filter(p => p.stock > 0);
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
    }

    return result;
  }, [products, selectedCategorySlug, search, priceMax, inStockOnly, selectedSort]);

  const resetFilters = () => {
    setSelectedCategorySlug(null);
    setSearch('');
    setPriceMax(75000);
    setInStockOnly(false);
    setSelectedSort('featured');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Editorial Header */}
      <div className="border-b border-[#1C1C1C] pb-8 space-y-3">
        <span className="text-xs tracking-[0.25em] uppercase text-[#C5A880]">
          The Complete Archive
        </span>
        <h1 className="font-serif text-3xl sm:text-5xl text-[#FFFFFF]">
          {selectedCategorySlug === 'fragrances'
            ? 'Haute Parfumerie'
            : selectedCategorySlug === 'apparel'
            ? 'Sartorial Wardrobe'
            : selectedCategorySlug === 'skincare'
            ? 'Botanical Skincare'
            : 'Artisanal Creations'}
        </h1>
        <p className="text-xs sm:text-sm text-[#8C867E] max-w-2xl leading-relaxed">
          Explore our limited edition formulations and garments, handcrafted in numbered atelier runs.
        </p>
      </div>

      {/* Category Segmented Tabs (Interactive Buttons, NO pill capsules) */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#1C1C1C] pb-4">
        <div className="flex flex-wrap gap-2">
          {categories.map(c => (
            <button
              key={c.name}
              onClick={() => setSelectedCategorySlug(c.slug)}
              className={`px-4 py-2 text-xs uppercase tracking-[0.16em] transition-colors cursor-pointer border ${
                selectedCategorySlug === c.slug
                  ? 'bg-[#F0ECE8] text-[#000000] border-[#F0ECE8] font-medium'
                  : 'bg-[#0D0D0D] text-[#888] border-[#222] hover:text-white hover:border-[#444]'
              }`}
            >
              {c.name}
            </button>
          ))}
        </div>

        {/* Search & Sort Controls */}
        <div className="flex items-center gap-3 w-full sm:w-auto">
          {/* In-catalog Search */}
          <div className="relative flex-1 sm:w-60">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#666]" />
            <input
              type="text"
              placeholder="Search catalog..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full bg-[#0D0D0D] border border-[#222] pl-8 pr-3 py-1.5 text-xs text-white placeholder-[#555] focus:outline-none focus:border-[#C5A880]"
            />
          </div>

          {/* Sort Selector */}
          <select
            value={selectedSort}
            onChange={e => setSelectedSort(e.target.value as any)}
            className="bg-[#0D0D0D] border border-[#222] px-3 py-1.5 text-xs text-[#DDD] focus:outline-none focus:border-[#C5A880] uppercase tracking-wider cursor-pointer"
          >
            <option value="featured">Featured Curations</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
            <option value="rating">Connoisseur Rating</option>
            <option value="newest">New Arrivals</option>
          </select>

          {/* Mobile Filter Toggle */}
          <button
            onClick={() => setIsFilterDrawerOpen(!isFilterDrawerOpen)}
            className="sm:hidden p-2 border border-[#222] text-[#AAA] hover:text-white"
          >
            <SlidersHorizontal className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Filter Bar (Price slider & Stock filter) */}
      <div className={`p-4 bg-[#0A0A0A] border border-[#1A1A1A] flex flex-wrap items-center justify-between gap-6 text-xs text-[#999] ${isFilterDrawerOpen ? 'block' : 'hidden sm:flex'}`}>
        <div className="flex items-center gap-4 flex-1 max-w-sm">
          <span>Max Price:</span>
          <input
            type="range"
            min="4000"
            max="75000"
            step="1000"
            value={priceMax}
            onChange={e => setPriceMax(Number(e.target.value))}
            className="flex-1 accent-[#C5A880] cursor-pointer"
          />
          <span className="font-mono text-white tabular-nums">
            ₹{priceMax.toLocaleString('en-IN')}
          </span>
        </div>

        <div className="flex items-center gap-6">
          <label className="flex items-center gap-2 cursor-pointer text-[#CCC]">
            <input
              type="checkbox"
              checked={inStockOnly}
              onChange={e => setInStockOnly(e.target.checked)}
              className="accent-[#C5A880]"
            />
            <span>In Atelier Stock Only</span>
          </label>

          {(selectedCategorySlug || search || priceMax < 75000 || inStockOnly) && (
            <button
              onClick={resetFilters}
              className="flex items-center gap-1.5 text-xs text-[#C5A880] hover:underline cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset Filters</span>
            </button>
          )}
        </div>
      </div>

      {/* Product Grid */}
      {filteredProducts.length === 0 ? (
        <div className="text-center py-24 space-y-4 border border-[#1C1C1C] bg-[#0A0A0A]">
          <p className="font-serif text-2xl text-[#888]">No creations match your current criteria.</p>
          <p className="text-xs text-[#555] max-w-sm mx-auto">
            Try adjusting your price ceiling or removing category restrictions.
          </p>
          <button
            onClick={resetFilters}
            className="mt-4 px-6 py-2.5 bg-[#F0ECE8] text-[#000000] text-xs uppercase tracking-[0.2em] font-medium hover:bg-white transition-colors"
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
