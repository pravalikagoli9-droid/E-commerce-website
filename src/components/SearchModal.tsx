import React, { useState, useMemo, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { Search, X, ArrowUpRight, History, Sparkles } from 'lucide-react';

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

  const popularSearches = ['Nocturne Ambré', 'Obsidian Coat', 'Botanical Serum', 'Santal', 'Cashmere', 'Gua Sha', 'Extrait'];

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
    <div className="fixed inset-0 z-50 overflow-y-auto bg-[#1C1613]/70 backdrop-blur-sm flex items-start justify-center pt-16 sm:pt-20 px-4">
      <div className="w-full max-w-3xl bg-[#FAF8F5] border border-[#E7E0D6] shadow-2xl p-6 sm:p-8 animate-in fade-in zoom-in-95 duration-150 space-y-6">
        {/* Search Input Bar */}
        <div className="flex items-center justify-between border-b border-[#E7E0D6] pb-4">
          <div className="flex items-center gap-3 flex-1">
            <Search className="w-5 h-5 text-[#8C7A6B]" />
            <input
              type="text"
              autoFocus
              placeholder="Search by note (amber, rose), garment (coat, cashmere), or active (bakuchiol)..."
              value={query}
              onChange={e => setQuery(e.target.value)}
              className="w-full bg-transparent text-base sm:text-xl font-serif text-[#1E1714] placeholder-[#AAA] focus:outline-none"
            />
          </div>
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-xs text-[#8C7A6B] hover:text-[#1E1714] px-2 underline"
            >
              Clear
            </button>
          )}
          <button
            onClick={() => {
              setIsSearchOpen(false);
              setQuery('');
            }}
            className="p-1.5 text-[#8C7A6B] hover:text-[#1E1714] bg-[#F4EFEA] rounded-full transition-colors ml-2"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Recent & Popular Inquiries when query is empty */}
        {!query && (
          <div className="space-y-6 text-xs">
            {recentSearches.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-[#8C7A6B]">
                  <span className="flex items-center gap-1.5 uppercase tracking-wider text-[11px] font-medium">
                    <History className="w-3.5 h-3.5" />
                    <span>Recent Searches</span>
                  </span>
                  <button
                    onClick={() => setRecentSearches([])}
                    className="text-[11px] underline hover:text-[#1E1714]"
                  >
                    Clear History
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {recentSearches.map(term => (
                    <button
                      key={term}
                      onClick={() => setQuery(term)}
                      className="px-3 py-1.5 bg-white hover:bg-[#F4EFEA] border border-[#E7E0D6] text-[#1E1714] transition-colors cursor-pointer"
                    >
                      {term}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="space-y-2">
              <span className="flex items-center gap-1.5 uppercase tracking-wider text-[11px] font-medium text-[#8C7A6B]">
                <Sparkles className="w-3.5 h-3.5 text-[#BFA175]" />
                <span>Curated Inquiries</span>
              </span>
              <div className="flex flex-wrap gap-2">
                {popularSearches.map(term => (
                  <button
                    key={term}
                    onClick={() => setQuery(term)}
                    className="px-3 py-1.5 bg-white hover:bg-[#F4EFEA] border border-[#E7E0D6] text-[#1E1714] transition-colors cursor-pointer"
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
            <p className="text-xs tracking-[0.2em] uppercase text-[#8C7A6B]">
              {filteredProducts.length} {filteredProducts.length === 1 ? 'Creation Discovered' : 'Creations Discovered'}
            </p>

            {filteredProducts.length === 0 ? (
              <div className="text-center py-12 space-y-3 bg-white border border-[#E7E0D6] p-8">
                <p className="font-serif text-lg text-[#8C7A6B]">No creations correspond to "{query}"</p>
                <p className="text-xs text-[#6B5C50] max-w-sm mx-auto leading-relaxed">
                  We suggest searching for base notes such as <em>Amber</em>, <em>Sandalwood</em>, or garment materials like <em>Virgin Wool</em> and <em>Cashmere</em>.
                </p>
                <div className="pt-2 flex justify-center gap-2">
                  <button
                    onClick={() => setQuery('Amber')}
                    className="px-3 py-1 bg-[#F4EFEA] border border-[#DCD3C7] text-xs text-[#1E1714]"
                  >
                    Try "Amber"
                  </button>
                  <button
                    onClick={() => setQuery('Serum')}
                    className="px-3 py-1 bg-[#F4EFEA] border border-[#DCD3C7] text-xs text-[#1E1714]"
                  >
                    Try "Serum"
                  </button>
                </div>
              </div>
            ) : (
              <div className="divide-y divide-[#E7E0D6] bg-white border border-[#E7E0D6]">
                {filteredProducts.map(product => (
                  <div
                    key={product.id}
                    onClick={() => handleSelectProduct(product)}
                    className="py-3 px-4 flex items-center justify-between group hover:bg-[#F4EFEA] transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-14 bg-[#FAF8F5] border border-[#E7E0D6] overflow-hidden shrink-0">
                        <img
                          src={product.images[0] || ''}
                          alt={product.name}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                      </div>
                      <div>
                        <span className="text-[10px] tracking-[0.2em] uppercase text-[#BFA175] font-medium">
                          {product.categoryName}
                        </span>
                        <h4 className="font-serif text-base text-[#1E1714] group-hover:text-[#5C4F44] transition-colors">
                          {product.name}
                        </h4>
                        <p className="text-xs font-mono text-[#8C7A6B] tabular-nums mt-0.5">
                          ₹{product.price.toLocaleString('en-IN')}
                        </p>
                      </div>
                    </div>
                    <ArrowUpRight className="w-4 h-4 text-[#8C7A6B] group-hover:text-[#1E1714] transition-colors" />
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
