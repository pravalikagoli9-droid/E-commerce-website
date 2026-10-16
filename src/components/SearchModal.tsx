import React, { useState, useMemo, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { Search, X, ArrowUpRight, History, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { getProductImageUrl, handleImageError } from '../utils/imageUrl';

export const SearchModal: React.FC = () => {
  const {
    isSearchOpen,
    setIsSearchOpen,
    products,
    setSelectedProduct,
    setCurrentPage
  } = useStore();

  const [query, setQuery] = useState('');
  const [recentSearches, setRecentSearches] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('elixir_recent_searches');
      return saved ? JSON.parse(saved) : ['Nocturne Ambré', 'Obsidian Coat', 'Botanical Serum'];
    } catch {
      return ['Nocturne Ambré', 'Obsidian Coat', 'Botanical Serum'];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('elixir_recent_searches', JSON.stringify(recentSearches));
    } catch {}
  }, [recentSearches]);

  const filteredProducts = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase().trim();
    return products.filter(
      p =>
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.categoryName.toLowerCase().includes(q) ||
        (p.fragranceFamily && p.fragranceFamily.toLowerCase().includes(q)) ||
        (p.notes && p.notes.some(n => n.toLowerCase().includes(q))) ||
        (p.ingredients && p.ingredients.toLowerCase().includes(q))
    );
  }, [products, query]);

  if (!isSearchOpen) return null;

  const popularSearches = ['Nocturne Ambré', 'Obsidian Coat', 'Botanical Serum', 'Sandalwood', 'Cashmere', 'Gua Sha', 'Extrait'];

  const handleSelectProduct = (product: any) => {
    if (query.trim()) {
      setRecentSearches(prev => [query.trim(), ...prev.filter(s => s !== query.trim())].slice(0, 6));
    }
    setSelectedProduct(product);
    setCurrentPage('product-detail');
    setIsSearchOpen(false);
    setQuery('');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-[#392C2A]/70 backdrop-blur-xs flex items-start justify-center pt-16 sm:pt-20 px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: -10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96 }}
        transition={{ duration: 0.2 }}
        className="w-full max-w-3xl bg-[#FAF7F2] border border-[#E8DED4] shadow-2xl p-6 sm:p-8 space-y-6 rounded-sm"
      >
        {/* Search Input Bar */}
        <div className="flex items-center justify-between border-b border-[#E8DED4] pb-4">
          <div className="flex items-center gap-3 flex-1">
            <Search className="w-5 h-5 text-[#C9878D]" />
            <input
              type="text"
              autoFocus
              placeholder="Search by fragrance note, skincare formula, or material..."
              value={query}
              onChange={e => setQuery(e.target.value)}
              className="w-full bg-transparent text-base sm:text-xl font-serif text-[#392C2A] placeholder-[#998] focus:outline-none"
            />
          </div>
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-xs text-[#C9878D] hover:text-[#B56F75] px-2 underline cursor-pointer"
            >
              Clear
            </button>
          )}
          <button
            onClick={() => {
              setIsSearchOpen(false);
              setQuery('');
            }}
            className="p-1.5 text-[#7D6B67] hover:text-[#392C2A] bg-[#FFFDF9] rounded-full transition-colors ml-2 cursor-pointer border border-[#E8DED4]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Recent & Popular Searches when query is empty */}
        {!query && (
          <div className="space-y-6 text-xs">
            {recentSearches.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-[#7D6B67]">
                  <span className="flex items-center gap-1.5 uppercase tracking-wider text-[11px] font-semibold">
                    <History className="w-3.5 h-3.5 text-[#C9878D]" />
                    <span>Recent Searches</span>
                  </span>
                  <button
                    onClick={() => setRecentSearches([])}
                    className="text-[11px] underline hover:text-[#C9878D] cursor-pointer"
                  >
                    Clear History
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {recentSearches.map(term => (
                    <button
                      key={term}
                      onClick={() => setQuery(term)}
                      className="px-3 py-1.5 bg-[#FFFDF9] hover:bg-[#E8D8C8]/60 border border-[#E8DED4] text-[#392C2A] transition-colors cursor-pointer rounded-xs"
                    >
                      {term}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="space-y-2">
              <span className="flex items-center gap-1.5 uppercase tracking-wider text-[11px] font-semibold text-[#7D6B67]">
                <Sparkles className="w-3.5 h-3.5 text-[#D6B77A]" />
                <span>Popular Searches</span>
              </span>
              <div className="flex flex-wrap gap-2">
                {popularSearches.map(term => (
                  <button
                    key={term}
                    onClick={() => setQuery(term)}
                    className="px-3 py-1.5 bg-[#FFFDF9] hover:bg-[#E8D8C8]/60 border border-[#E8DED4] text-[#392C2A] transition-colors cursor-pointer rounded-xs"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Live Search Results */}
        {query && (
          <div className="max-h-[60vh] overflow-y-auto space-y-4">
            <p className="text-xs tracking-[0.2em] uppercase text-[#7D6B67] font-semibold">
              {filteredProducts.length} {filteredProducts.length === 1 ? 'Result Found' : 'Results Found'}
            </p>

            {filteredProducts.length === 0 ? (
              <div className="text-center py-12 space-y-3 bg-[#FFFDF9] border border-[#E8DED4] p-8 rounded-sm">
                <p className="font-serif text-lg text-[#7D6B67]">No products found matching "{query}"</p>
                <p className="text-xs text-[#7D6B67] max-w-sm mx-auto leading-relaxed">
                  Try searching for notes such as <em>Amber</em> or <em>Sandalwood</em>, or materials like <em>Silk</em> and <em>Cashmere</em>.
                </p>
                <div className="pt-2 flex justify-center gap-2">
                  <button
                    onClick={() => setQuery('Amber')}
                    className="px-3 py-1 bg-[#FAF7F2] border border-[#E8DED4] text-xs text-[#392C2A] cursor-pointer hover:border-[#C9878D]"
                  >
                    Try "Amber"
                  </button>
                  <button
                    onClick={() => setQuery('Serum')}
                    className="px-3 py-1 bg-[#FAF7F2] border border-[#E8DED4] text-xs text-[#392C2A] cursor-pointer hover:border-[#C9878D]"
                  >
                    Try "Serum"
                  </button>
                </div>
              </div>
            ) : (
              <div className="divide-y divide-[#E8DED4] bg-[#FFFDF9] border border-[#E8DED4] rounded-sm overflow-hidden">
                {filteredProducts.map(product => (
                  <div
                    key={product.id}
                    onClick={() => handleSelectProduct(product)}
                    className="py-3 px-4 flex items-center justify-between group hover:bg-[#FAF7F2] transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-14 bg-[#FAF7F2] border border-[#E8DED4] overflow-hidden shrink-0 rounded-xs">
                        <img
                          src={getProductImageUrl(product.images?.[0])}
                          alt={product.name}
                          referrerPolicy="no-referrer"
                          onError={handleImageError}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                      </div>
                      <div>
                        <span className="text-[10px] tracking-[0.2em] uppercase text-[#C9878D] font-semibold">
                          {product.categoryName}
                        </span>
                        <h4 className="font-serif text-base text-[#392C2A] group-hover:text-[#C9878D] transition-colors">
                          {product.name}
                        </h4>
                        <p className="text-xs font-mono text-[#7D6B67] tabular-nums mt-0.5">
                          ₹{product.price.toLocaleString('en-US')}
                        </p>
                      </div>
                    </div>
                    <ArrowUpRight className="w-4 h-4 text-[#7D6B67] group-hover:text-[#C9878D] transition-colors" />
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </motion.div>
    </div>
  );
};
