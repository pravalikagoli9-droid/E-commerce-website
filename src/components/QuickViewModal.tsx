import React, { useState, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { X, Star, ShoppingBag, ArrowRight, Minus, Plus, Scale } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

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
      className="fixed inset-0 z-50 overflow-y-auto bg-[#392C2A]/70 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-label={`Quick view of ${quickViewProduct.name}`}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.2 }}
        className="relative w-full max-w-4xl bg-[#FAF7F2] border border-[#E8DED4] shadow-2xl overflow-hidden rounded-sm"
      >
        {/* Close Button */}
        <button
          onClick={() => setQuickViewProduct(null)}
          aria-label="Close modal"
          className="absolute top-4 right-4 z-10 p-2 text-[#7D6B67] hover:text-[#392C2A] bg-[#FFFDF9] hover:bg-[#FAF7F2] border border-[#E8DED4] rounded-full transition-colors cursor-pointer shadow-xs"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Left: Product Imagery with thumbnails */}
          <div className="p-6 sm:p-8 bg-[#FAF7F2] border-b md:border-b-0 md:border-r border-[#E8DED4] flex flex-col justify-between">
            <div className="relative aspect-[4/5] bg-[#FFFDF9] border border-[#E8DED4] overflow-hidden rounded-sm">
              <img
                src={quickViewProduct.images[activeImgIdx] || quickViewProduct.images[0]}
                alt={quickViewProduct.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              {quickViewProduct.isBestseller && (
                <span className="absolute top-3 left-3 text-[10px] tracking-[0.18em] uppercase text-[#392C2A] bg-[#E8D8C8]/95 px-2.5 py-1 border border-[#E8DED4] font-semibold">
                  Best Seller
                </span>
              )}
            </div>

            {quickViewProduct.images.length > 1 && (
              <div className="flex gap-2.5 pt-4">
                {quickViewProduct.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImgIdx(i)}
                    className={`w-14 h-16 border overflow-hidden cursor-pointer rounded-xs transition-all ${
                      activeImgIdx === i ? 'border-[#C9878D] ring-1 ring-[#C9878D]' : 'border-[#E8DED4] opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right: Product Purchase Details */}
          <div className="p-6 sm:p-8 bg-[#FFFDF9] flex flex-col justify-between space-y-6">
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs text-[#7D6B67]">
                <span className="tracking-[0.2em] uppercase text-[#C9878D] font-semibold">
                  {quickViewProduct.categoryName}
                </span>
                <span className="font-mono text-[11px]">SKU: {quickViewProduct.sku}</span>
              </div>

              <h2 className="font-serif text-2xl sm:text-3xl text-[#392C2A] font-normal leading-tight">
                {quickViewProduct.name}
              </h2>

              <div className="flex items-center gap-3 text-xs text-[#7D6B67]">
                <div className="flex items-center gap-1 text-[#D6B77A] font-mono font-semibold">
                  <Star className="w-3.5 h-3.5 fill-[#D6B77A]" />
                  <span>{quickViewProduct.averageRating.toFixed(1)}</span>
                </div>
                <span>·</span>
                <span>{quickViewProduct.reviewCount} Customer Reviews</span>
                <span>·</span>
                <span className={quickViewProduct.stock > 0 ? 'text-[#3E7B54] font-medium' : 'text-[#D97979] font-medium'}>
                  {quickViewProduct.stock > 0 ? `In Stock (${quickViewProduct.stock} left)` : 'Out of Stock'}
                </span>
              </div>

              {/* Price */}
              <div className="flex items-baseline gap-3 font-mono pt-1">
                <span className="text-2xl font-bold text-[#392C2A] tabular-nums">
                  ₹{currentPrice.toLocaleString('en-US')}
                </span>
                {quickViewProduct.compareAtPrice && (
                  <span className="text-xs text-[#7D6B67] line-through tabular-nums">
                    ₹{quickViewProduct.compareAtPrice.toLocaleString('en-US')}
                  </span>
                )}
              </div>

              {/* Short Description */}
              <p className="text-xs sm:text-sm text-[#7D6B67] leading-relaxed line-clamp-3">
                {quickViewProduct.description}
              </p>

              {/* Highlights */}
              {quickViewProduct.notes && quickViewProduct.notes.length > 0 && (
                <div className="p-2.5 bg-[#FAF7F2] border border-[#E8DED4] text-[11px] text-[#7D6B67] italic rounded-xs">
                  {quickViewProduct.notes[0]}
                </div>
              )}

              {/* Variants */}
              {quickViewProduct.variants && quickViewProduct.variants.length > 0 && (
                <div className="space-y-1.5 pt-2">
                  <label className="text-[11px] tracking-[0.2em] uppercase text-[#7D6B67] block font-semibold">
                    Select Option
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {quickViewProduct.variants.map(v => (
                      <button
                        key={v.id}
                        onClick={() => setSelectedVariant(v.name)}
                        className={`px-3 py-1.5 text-xs uppercase tracking-wider transition-colors border cursor-pointer rounded-xs ${
                          selectedVariant === v.name
                            ? 'bg-[#C9878D] text-white border-[#C9878D] font-semibold shadow-xs'
                            : 'bg-[#FFFDF9] text-[#7D6B67] border-[#E8DED4] hover:border-[#C9878D] hover:text-[#392C2A]'
                        }`}
                      >
                        {v.name}
                        {v.priceDiff !== 0 && (
                          <span className="ml-1 opacity-80">
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
            <div className="space-y-3 pt-4 border-t border-[#E8DED4]">
              <div className="flex items-center gap-3">
                {/* Stepper */}
                <div className="flex items-center border border-[#E8DED4] bg-[#FAF7F2] rounded-xs">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-2 text-[#7D6B67] hover:text-[#392C2A] cursor-pointer"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="px-3 text-xs font-mono text-[#392C2A] tabular-nums font-semibold">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(Math.min(quickViewProduct.stock, quantity + 1))}
                    className="p-2 text-[#7D6B67] hover:text-[#392C2A] cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Add to Cart */}
                <button
                  onClick={handleAddToCart}
                  disabled={quickViewProduct.stock <= 0}
                  className="flex-1 py-2.5 bg-[#C9878D] hover:bg-[#B56F75] text-white text-xs font-semibold tracking-[0.2em] uppercase transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-md rounded-xs"
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>Add to Cart</span>
                </button>
              </div>

              {/* View Full Details & Compare Links */}
              <div className="flex items-center justify-between pt-2 text-xs">
                <button
                  onClick={handleViewFullDetails}
                  className="text-[#C9878D] hover:text-[#B56F75] underline flex items-center gap-1 font-medium cursor-pointer"
                >
                  <span>View Full Product Details</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={() => addToCompare(quickViewProduct)}
                  className="text-[#7D6B67] hover:text-[#392C2A] flex items-center gap-1 cursor-pointer"
                >
                  <Scale className="w-3.5 h-3.5" />
                  <span>Compare</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
