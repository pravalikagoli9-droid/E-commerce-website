import React from 'react';
import { useStore } from '../context/StoreContext';
import { X, Scale, ShoppingBag, Trash2, Star } from 'lucide-react';
import { motion } from 'motion/react';
import { getProductImageUrl, handleImageError } from '../utils/imageUrl';

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
    <div className="fixed inset-0 z-50 overflow-y-auto bg-[#392C2A]/70 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.2 }}
        className="relative w-full max-w-5xl bg-[#FAF7F2] border border-[#E8DED4] shadow-2xl p-6 sm:p-8 space-y-6 rounded-sm"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#E8DED4] pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-[#E8D8C8] text-[#392C2A] rounded-sm">
              <Scale className="w-5 h-5 text-[#392C2A]" />
            </div>
            <div>
              <h2 className="font-serif text-2xl text-[#392C2A]">Product Comparison</h2>
              <p className="text-xs text-[#7D6B67]">
                Compare notes, formulas, fabrics, and pricing side by side.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {compareList.length > 0 && (
              <button
                onClick={clearCompare}
                className="text-xs text-[#C9878D] hover:text-[#B56F75] underline cursor-pointer"
              >
                Clear All
              </button>
            )}
            <button
              onClick={() => setIsCompareOpen(false)}
              className="p-1.5 text-[#7D6B67] hover:text-[#392C2A] bg-[#FFFDF9] border border-[#E8DED4] rounded-full transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {compareList.length === 0 ? (
          <div className="text-center py-16 space-y-3">
            <p className="font-serif text-xl text-[#7D6B67]">No products currently selected for comparison.</p>
            <p className="text-xs text-[#7D6B67] max-w-md mx-auto">
              Click the "Compare" button on any product card or details page to compare specifications side by side.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="border-b border-[#E8DED4]">
                  <th className="p-3 w-40 font-serif text-sm text-[#7D6B67] uppercase tracking-wider font-medium">
                    Products
                  </th>
                  {compareList.map(prod => (
                    <th key={prod.id} className="p-3 w-64 min-w-[220px] align-top">
                      <div className="relative space-y-3 bg-[#FFFDF9] p-3 border border-[#E8DED4] rounded-sm">
                        <button
                          onClick={() => removeFromCompare(prod.id)}
                          className="absolute top-2 right-2 p-1 text-[#7D6B67] hover:text-[#D97979] bg-white rounded cursor-pointer"
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
                          className="aspect-[4/5] bg-[#FAF7F2] border border-[#E8DED4] overflow-hidden cursor-pointer rounded-xs"
                        >
                          <img
                            src={getProductImageUrl(prod.images?.[0])}
                            alt={prod.name}
                            referrerPolicy="no-referrer"
                            onError={handleImageError}
                            className="w-full h-full object-cover hover:scale-105 transition-transform"
                          />
                        </div>
                        <div>
                          <span className="text-[10px] tracking-wider uppercase text-[#C9878D] font-semibold block">
                            {prod.categoryName}
                          </span>
                          <h3 className="font-serif text-base text-[#392C2A] font-medium line-clamp-1">
                            {prod.name}
                          </h3>
                          <p className="font-mono text-sm text-[#392C2A] font-bold tabular-nums mt-0.5">
                            ₹{prod.price.toLocaleString('en-US')}
                          </p>
                        </div>
                        <button
                          onClick={() => addToCart(prod, 1, prod.variants?.[0]?.name)}
                          className="w-full py-2 bg-[#C9878D] hover:bg-[#B56F75] text-white text-[11px] font-semibold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors cursor-pointer rounded-xs shadow-xs"
                        >
                          <ShoppingBag className="w-3.5 h-3.5" />
                          <span>Add to Cart</span>
                        </button>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E8DED4] text-[#7D6B67]">
                <tr>
                  <td className="p-3 font-medium text-[#392C2A] bg-[#FFFDF9]">Customer Rating</td>
                  {compareList.map(prod => (
                    <td key={prod.id} className="p-3">
                      <div className="flex items-center gap-1 text-[#D6B77A] font-mono">
                        <Star className="w-3.5 h-3.5 fill-[#D6B77A]" />
                        <span className="text-[#392C2A] font-semibold">{prod.averageRating.toFixed(1)}</span>
                        <span className="text-[#7D6B67]">({prod.reviewCount} reviews)</span>
                      </div>
                    </td>
                  ))}
                </tr>

                <tr>
                  <td className="p-3 font-medium text-[#392C2A] bg-[#FFFDF9]">Fragrance Family / Fabric</td>
                  {compareList.map(prod => (
                    <td key={prod.id} className="p-3">
                      {prod.fragranceFamily || prod.fabricComposition?.split('&')[0] || prod.skinType || 'Artisanal Blend'}
                    </td>
                  ))}
                </tr>

                <tr>
                  <td className="p-3 font-medium text-[#392C2A] bg-[#FFFDF9]">Key Notes / Actives</td>
                  {compareList.map(prod => (
                    <td key={prod.id} className="p-3">
                      {prod.notes ? (
                        <ul className="space-y-0.5 text-[11px]">
                          {prod.notes.slice(0, 3).map((n, i) => (
                            <li key={i}>{n}</li>
                          ))}
                        </ul>
                      ) : (
                        prod.ingredients || 'Natural fibers & fine fabrics'
                      )}
                    </td>
                  ))}
                </tr>

                <tr>
                  <td className="p-3 font-medium text-[#392C2A] bg-[#FFFDF9]">Longevity / Care</td>
                  {compareList.map(prod => (
                    <td key={prod.id} className="p-3">
                      {prod.sillage ? `${prod.sillage} Sillage · ${prod.longevity}` : prod.careInstructions || 'Dry clean recommended'}
                    </td>
                  ))}
                </tr>

                <tr>
                  <td className="p-3 font-medium text-[#392C2A] bg-[#FFFDF9]">Availability</td>
                  {compareList.map(prod => (
                    <td key={prod.id} className="p-3">
                      <span className={prod.stock > 0 ? 'text-[#3E7B54] font-medium' : 'text-[#D97979] font-medium'}>
                        {prod.stock > 0 ? `In Stock (${prod.stock} left)` : 'Out of Stock'}
                      </span>
                    </td>
                  ))}
                </tr>

                <tr>
                  <td className="p-3 font-medium text-[#392C2A] bg-[#FFFDF9]">Sizes & Options</td>
                  {compareList.map(prod => (
                    <td key={prod.id} className="p-3">
                      {prod.variants?.map(v => v.name).join(' · ') || 'Standard Size'}
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </motion.div>
    </div>
  );
};
