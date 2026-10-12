import React, { useState, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { X, Star, ShoppingBag, Eye, ArrowRight, Minus, Plus, Scale, Sparkles, Check, ShieldCheck } from 'lucide-react';

export const QuickViewModal: React.FC = () => {
  const {
    quickViewProduct,
    setQuickViewProduct,
    setSelectedProduct,
    setCurrentPage,
    addToCart,
    addToCompare,
    isInWishlist,
    toggleWishlist
  } = useStore();

  const [activeImgIdx, setActiveImgIdx] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState<string | undefined>();
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (quickViewProduct) {
      setActiveImgIdx(0);
      setSelectedVariant(quickViewProduct.variants?.[0]?.name);
      setQuantity(1);
    }
  }, [quickViewProduct]);

  // Handle ESC key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setQuickViewProduct(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setQuickViewProduct]);

  if (!quickViewProduct) return null;

  const inWishlist = isInWishlist(quickViewProduct.id);

  let currentPrice = quickViewProduct.price;
  if (selectedVariant && quickViewProduct.variants) {
    const v = quickViewProduct.variants.find(va => va.name === selectedVariant);
    if (v) currentPrice += v.priceDiff;
  }

  const handleAddToCart = () => {
    addToCart(quickViewProduct, quantity, selectedVariant);
  };

  const handleViewFullDetails = () => {
    setSelectedProduct(quickViewProduct);
    setCurrentPage('product-detail');
    setQuickViewProduct(null);
  };

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-[#1C1613]/70 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-label={`Quick view of ${quickViewProduct.name}`}
    >
      <div className="relative w-full max-w-4xl bg-[#FAF8F5] border border-[#E7E0D6] shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Close Button */}
        <button
          onClick={() => setQuickViewProduct(null)}
          aria-label="Close modal"
          className="absolute top-4 right-4 z-10 p-2 text-[#8C7A6B] hover:text-[#1E1714] bg-[#F4EFEA]/80 hover:bg-[#F4EFEA] rounded-full transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Left: Product Imagery with thumbnails */}
          <div className="p-6 sm:p-8 bg-[#F4EFEA] border-b md:border-b-0 md:border-r border-[#E7E0D6] flex flex-col justify-between">
            <div className="relative aspect-[4/5] bg-white border border-[#E7E0D6] overflow-hidden">
              <img
                src={quickViewProduct.images[activeImgIdx] || quickViewProduct.images[0]}
                alt={quickViewProduct.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              {quickViewProduct.isBestseller && (
                <span className="absolute top-3 left-3 text-[10px] tracking-[0.2em] uppercase text-[#1E1714] bg-[#FAF8F5]/90 px-2 py-0.5 border border-[#DCD3C7]">
                  Atelier Bestseller
                </span>
              )}
            </div>

            {quickViewProduct.images.length > 1 && (
              <div className="flex gap-2 pt-4">
                {quickViewProduct.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImgIdx(i)}
                    className={`w-14 h-16 border overflow-hidden cursor-pointer ${
                      activeImgIdx === i ? 'border-[#8C7A6B] ring-1 ring-[#8C7A6B]' : 'border-[#E7E0D6] opacity-70'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right: Product Purchase Details */}
          <div className="p-6 sm:p-8 flex flex-col justify-between space-y-6">
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs text-[#8C7A6B]">
                <span className="tracking-[0.2em] uppercase text-[#BFA175] font-medium">
                  {quickViewProduct.categoryName}
                </span>
                <span className="font-mono text-[11px]">SKU: {quickViewProduct.sku}</span>
              </div>

              <h2 className="font-serif text-2xl sm:text-3xl text-[#1E1714] font-normal leading-tight">
                {quickViewProduct.name}
              </h2>

              <div className="flex items-center gap-3 text-xs text-[#8C7A6B]">
                <div className="flex items-center gap-1 text-[#BFA175] font-mono">
                  <Star className="w-3.5 h-3.5 fill-[#BFA175]" />
                  <span>{quickViewProduct.averageRating.toFixed(1)}</span>
                </div>
                <span>·</span>
                <span>{quickViewProduct.reviewCount} Connoisseur Reviews</span>
                <span>·</span>
                <span className="text-[#3F6E50] font-medium">
                  {quickViewProduct.stock > 0 ? `In Stock (${quickViewProduct.stock})` : 'Exhausted'}
                </span>
              </div>

              {/* Price */}
              <div className="flex items-baseline gap-3 font-mono pt-1">
                <span className="text-2xl font-semibold text-[#1E1714] tabular-nums">
                  ₹{currentPrice.toLocaleString('en-IN')}
                </span>
                {quickViewProduct.compareAtPrice && (
                  <span className="text-xs text-[#8C7A6B] line-through tabular-nums">
                    ₹{quickViewProduct.compareAtPrice.toLocaleString('en-IN')}
                  </span>
                )}
              </div>

              {/* Short Description */}
              <p className="text-xs sm:text-sm text-[#5C4F44] leading-relaxed line-clamp-3">
                {quickViewProduct.description}
              </p>

              {/* Highlights */}
              {quickViewProduct.notes && quickViewProduct.notes.length > 0 && (
                <div className="p-2.5 bg-[#F4EFEA] border border-[#E7E0D6] text-[11px] text-[#5C4F44] italic">
                  {quickViewProduct.notes[0]}
                </div>
              )}

              {/* Variants */}
              {quickViewProduct.variants && quickViewProduct.variants.length > 0 && (
                <div className="space-y-1.5 pt-2">
                  <label className="text-[11px] tracking-[0.2em] uppercase text-[#8C7A6B] block">
                    Select Specification
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {quickViewProduct.variants.map(v => (
                      <button
                        key={v.id}
                        onClick={() => setSelectedVariant(v.name)}
                        className={`px-3 py-1.5 text-xs uppercase tracking-wider transition-colors border cursor-pointer ${
                          selectedVariant === v.name
                            ? 'bg-[#1E1714] text-[#FAF8F5] border-[#1E1714] font-medium'
                            : 'bg-white text-[#5C4F44] border-[#E7E0D6] hover:border-[#8C7A6B]'
                        }`}
                      >
                        {v.name}
                        {v.priceDiff !== 0 && (
                          <span className="ml-1 opacity-75">
                            ({v.priceDiff > 0 ? `+₹${v.priceDiff}` : `-₹${Math.abs(v.priceDiff)}`})
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Stepper & Actions */}
            <div className="space-y-3 pt-4 border-t border-[#E7E0D6]">
              <div className="flex items-center gap-3">
                {/* Stepper */}
                <div className="flex items-center border border-[#DCD3C7] bg-white">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-2 text-[#8C7A6B] hover:text-[#1E1714]"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="px-3 text-xs font-mono text-[#1E1714] tabular-nums font-semibold">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(Math.min(quickViewProduct.stock, quantity + 1))}
                    className="p-2 text-[#8C7A6B] hover:text-[#1E1714]"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Add to Cart */}
                <button
                  onClick={handleAddToCart}
                  disabled={quickViewProduct.stock <= 0}
                  className="flex-1 py-2.5 bg-[#1E1714] hover:bg-[#342721] text-[#FAF8F5] text-xs font-semibold tracking-[0.2em] uppercase transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-md"
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>Add to Shopping Bag</span>
                </button>
              </div>

              {/* View Full Details & Compare Links */}
              <div className="flex items-center justify-between pt-2 text-xs">
                <button
                  onClick={handleViewFullDetails}
                  className="text-[#8C7A6B] hover:text-[#1E1714] underline flex items-center gap-1 font-medium cursor-pointer"
                >
                  <span>View Full Olfactory & Sartorial Details</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={() => addToCompare(quickViewProduct)}
                  className="text-[#8C7A6B] hover:text-[#1E1714] flex items-center gap-1 cursor-pointer"
                >
                  <Scale className="w-3.5 h-3.5" />
                  <span>Compare</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
