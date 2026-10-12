import React from 'react';
import { useStore } from '../context/StoreContext';
import { X, Scale, ShoppingBag, Trash2, Check, Star, ArrowRight } from 'lucide-react';

export const ProductCompareModal: React.FC = () => {
  const {
    compareList,
    removeFromCompare,
    clearCompare,
    isCompareOpen,
    setIsCompareOpen,
    addToCart,
    setSelectedProduct,
    setCurrentPage
  } = useStore();

  if (!isCompareOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-[#1C1613]/70 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6">
      <div className="relative w-full max-w-5xl bg-[#FAF8F5] border border-[#E7E0D6] shadow-2xl p-6 sm:p-8 space-y-6 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#E7E0D6] pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#F4EFEA] border border-[#DCD3C7] text-[#1E1714]">
              <Scale className="w-5 h-5 text-[#8C7A6B]" />
            </div>
            <div>
              <h2 className="font-serif text-2xl text-[#1E1714]">Comparison Salon</h2>
              <p className="text-xs text-[#8C7A6B]">
                Analyze technical formulations, fabrics, and olfactory architectures side by side.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {compareList.length > 0 && (
              <button
                onClick={clearCompare}
                className="text-xs text-[#8C7A6B] hover:text-[#A86464] underline cursor-pointer"
              >
                Clear All
              </button>
            )}
            <button
              onClick={() => setIsCompareOpen(false)}
              className="p-1.5 text-[#8C7A6B] hover:text-[#1E1714] bg-[#F4EFEA] rounded-full transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {compareList.length === 0 ? (
          <div className="text-center py-16 space-y-3">
            <p className="font-serif text-xl text-[#8C7A6B]">No creations currently in comparison.</p>
            <p className="text-xs text-[#5C4F44] max-w-md mx-auto">
              Select "Compare" on any fragrance, garment, or skincare item across our catalog to examine differences in notes and formulations.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="border-b border-[#E7E0D6]">
                  <th className="p-3 w-40 font-serif text-sm text-[#8C7A6B] uppercase tracking-wider font-normal">
                    Creations
                  </th>
                  {compareList.map(prod => (
                    <th key={prod.id} className="p-3 w-64 min-w-[220px] align-top">
                      <div className="relative space-y-3">
                        <button
                          onClick={() => removeFromCompare(prod.id)}
                          className="absolute top-1 right-1 p-1 text-[#8C7A6B] hover:text-[#A86464] bg-white/80 rounded"
                          title="Remove from comparison"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                        <div
                          onClick={() => {
                            setSelectedProduct(prod);
                            setCurrentPage('product-detail');
                            setIsCompareOpen(false);
                          }}
                          className="aspect-[4/5] bg-white border border-[#E7E0D6] overflow-hidden cursor-pointer"
                        >
                          <img
                            src={prod.images[0] || ''}
                            alt={prod.name}
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover hover:scale-105 transition-transform"
                          />
                        </div>
                        <div>
                          <span className="text-[10px] tracking-wider uppercase text-[#BFA175] font-medium block">
                            {prod.categoryName}
                          </span>
                          <h3 className="font-serif text-base text-[#1E1714] font-medium line-clamp-1">
                            {prod.name}
                          </h3>
                          <p className="font-mono text-sm text-[#1E1714] font-semibold tabular-nums mt-0.5">
                            ₹{prod.price.toLocaleString('en-IN')}
                          </p>
                        </div>
                        <button
                          onClick={() => addToCart(prod, 1, prod.variants?.[0]?.name)}
                          className="w-full py-2 bg-[#1E1714] hover:bg-[#342721] text-[#FAF8F5] text-[11px] font-semibold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                        >
                          <ShoppingBag className="w-3.5 h-3.5" />
                          <span>Acquire</span>
                        </button>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E7E0D6] text-[#5C4F44]">
                <tr>
                  <td className="p-3 font-medium text-[#1E1714] bg-[#F4EFEA]/60">Connoisseur Rating</td>
                  {compareList.map(prod => (
                    <td key={prod.id} className="p-3">
                      <div className="flex items-center gap-1 text-[#BFA175] font-mono">
                        <Star className="w-3.5 h-3.5 fill-[#BFA175]" />
                        <span className="text-[#1E1714] font-medium">{prod.averageRating.toFixed(1)}</span>
                        <span className="text-[#8C7A6B]">({prod.reviewCount} reviews)</span>
                      </div>
                    </td>
                  ))}
                </tr>

                <tr>
                  <td className="p-3 font-medium text-[#1E1714] bg-[#F4EFEA]/60">Olfactory / Material Family</td>
                  {compareList.map(prod => (
                    <td key={prod.id} className="p-3">
                      {prod.fragranceFamily || prod.fabricComposition?.split('&')[0] || prod.skinType || 'Bespoke Atelier Formulation'}
                    </td>
                  ))}
                </tr>

                <tr>
                  <td className="p-3 font-medium text-[#1E1714] bg-[#F4EFEA]/60">Key Notes / Ingredients</td>
                  {compareList.map(prod => (
                    <td key={prod.id} className="p-3">
                      {prod.notes ? (
                        <ul className="space-y-0.5 text-[11px]">
                          {prod.notes.slice(0, 3).map((n, i) => (
                            <li key={i}>{n}</li>
                          ))}
                        </ul>
                      ) : (
                        prod.ingredients || 'Hand-finished pure textiles'
                      )}
                    </td>
                  ))}
                </tr>

                <tr>
                  <td className="p-3 font-medium text-[#1E1714] bg-[#F4EFEA]/60">Sillage / Wear Longevity</td>
                  {compareList.map(prod => (
                    <td key={prod.id} className="p-3">
                      {prod.sillage ? `${prod.sillage} Sillage · ${prod.longevity}` : prod.careInstructions || 'Extended Luxury Wear'}
                    </td>
                  ))}
                </tr>

                <tr>
                  <td className="p-3 font-medium text-[#1E1714] bg-[#F4EFEA]/60">Stock Availability</td>
                  {compareList.map(prod => (
                    <td key={prod.id} className="p-3">
                      <span className="text-[#3F6E50] font-medium">
                        {prod.stock > 0 ? `In Stock (${prod.stock} items remaining)` : 'Exhausted'}
                      </span>
                    </td>
                  ))}
                </tr>

                <tr>
                  <td className="p-3 font-medium text-[#1E1714] bg-[#F4EFEA]/60">Available Variants</td>
                  {compareList.map(prod => (
                    <td key={prod.id} className="p-3">
                      {prod.variants?.map(v => v.name).join(' · ') || 'Single Standard Edition'}
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
