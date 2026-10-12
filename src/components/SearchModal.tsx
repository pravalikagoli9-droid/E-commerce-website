import React, { useState, useMemo } from 'react';
import { useStore } from '../context/StoreContext';
import { Search, X, ArrowUpRight } from 'lucide-react';

export const SearchModal: React.FC = () => {
  const {
    isSearchOpen,
    setIsSearchOpen,
    products,
    setSelectedProduct,
    setCurrentPage
  } = useStore();

  const [query, setQuery] = useState('');

  const filteredProducts = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase().trim();
    return products.filter(
      p =>
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.categoryName.toLowerCase().includes(q) ||
        (p.notes && p.notes.some(n => n.toLowerCase().includes(q)))
    );
  }, [products, query]);

  if (!isSearchOpen) return null;

  const popularSearches = ['Nocturne Ambré', 'Obsidian Coat', 'Botanical Serum', 'Santal', 'Cashmere'];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-start justify-center pt-20 px-4">
      <div className="w-full max-w-3xl bg-[#0D0D0D] border border-[#2B2B2B] shadow-2xl p-6 sm:p-8 animate-in fade-in zoom-in-95 duration-150">
        {/* Search Header */}
        <div className="flex items-center justify-between border-b border-[#242424] pb-4">
          <div className="flex items-center gap-3 flex-1">
            <Search className="w-5 h-5 text-[#C5A880]" />
            <input
              type="text"
              autoFocus
              placeholder="Search formulations, notes, garments, or ingredients..."
              value={query}
              onChange={e => setQuery(e.target.value)}
              className="w-full bg-transparent text-lg sm:text-xl font-serif text-[#F0ECE8] placeholder-[#555] focus:outline-none"
            />
          </div>
          <button
            onClick={() => {
              setIsSearchOpen(false);
              setQuery('');
            }}
            className="p-2 text-[#888] hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Suggestion Chips */}
        {!query && (
          <div className="pt-6 space-y-3">
            <p className="text-xs tracking-[0.2em] uppercase text-[#777]">Popular Inquiries</p>
            <div className="flex flex-wrap gap-2">
              {popularSearches.map(term => (
                <button
                  key={term}
                  onClick={() => setQuery(term)}
                  className="px-3 py-1.5 bg-[#171717] hover:bg-[#222] border border-[#262626] text-xs text-[#CCC] hover:text-white transition-colors cursor-pointer"
                >
                  {term}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Search Results */}
        {query && (
          <div className="pt-6 max-h-[60vh] overflow-y-auto space-y-4">
            <p className="text-xs tracking-[0.2em] uppercase text-[#777]">
              {filteredProducts.length} {filteredProducts.length === 1 ? 'Creation Found' : 'Creations Found'}
            </p>

            {filteredProducts.length === 0 ? (
              <div className="text-center py-12 space-y-2">
                <p className="font-serif text-lg text-[#888]">No creations match "{query}"</p>
                <p className="text-xs text-[#555]">
                  Try searching for ingredients like "Amber", "Cashmere", "Serum", or "Rose".
                </p>
              </div>
            ) : (
              <div className="divide-y divide-[#1A1A1A]">
                {filteredProducts.map(product => (
                  <div
                    key={product.id}
                    onClick={() => {
                      setSelectedProduct(product);
                      setCurrentPage('product-detail');
                      setIsSearchOpen(false);
                      setQuery('');
                    }}
                    className="py-3.5 flex items-center justify-between group hover:bg-[#141414] px-3 -mx-3 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-16 bg-[#1A1A1A] border border-[#2B2B2B] overflow-hidden shrink-0">
                        <img
                          src={product.images[0] || ''}
                          alt={product.name}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                      </div>
                      <div>
                        <span className="text-[11px] tracking-[0.2em] uppercase text-[#C5A880]">
                          {product.categoryName}
                        </span>
                        <h4 className="font-serif text-base text-[#F0ECE8] group-hover:text-white transition-colors">
                          {product.name}
                        </h4>
                        <p className="text-xs font-mono text-[#888] tabular-nums mt-0.5">
                          ₹{product.price.toLocaleString('en-IN')}
                        </p>
                      </div>
                    </div>
                    <ArrowUpRight className="w-4 h-4 text-[#555] group-hover:text-[#C5A880] transition-colors" />
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
