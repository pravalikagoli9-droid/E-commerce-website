import React, { useState } from 'react';
import type { Product } from '../types';
import { useStore } from '../context/StoreContext';
import { Heart, ShoppingBag, Star, Eye, Scale, Bell } from 'lucide-react';
import { PriceAlertModal } from './PriceAlertModal';
import { motion } from 'motion/react';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const {
    setSelectedProduct,
    setCurrentPage,
    addToCart,
    toggleWishlist,
    isInWishlist,
    setQuickViewProduct,
    addToCompare,
    addRecentlyViewed
  } = useStore();

  const [showAlertModal, setShowAlertModal] = useState(false);
  const inWishlist = isInWishlist(product.id);

  const handleCardClick = () => {
    addRecentlyViewed(product.id);
    setSelectedProduct(product);
    setCurrentPage('product-detail');
  };

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product, 1, product.variants?.[0]?.name);
  };

  const handleQuickView = (e: React.MouseEvent) => {
    e.stopPropagation();
    addRecentlyViewed(product.id);
    setQuickViewProduct(product);
  };

  const handleCompare = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCompare(product);
  };

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleWishlist(product.id);
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-20px' }}
        transition={{ duration: 0.4 }}
        onClick={handleCardClick}
        className="group relative flex flex-col bg-[#FFFDF9] border border-[#E8DED4] hover:border-[#C9878D] hover:shadow-lg transition-all duration-300 cursor-pointer overflow-hidden rounded-sm"
      >
        {/* Product Image Frame */}
        <div className="relative aspect-[4/5] w-full bg-[#FAF7F2] overflow-hidden">
          <img
            src={product.images[0] || ''}
            alt={product.name}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          />

          {/* Badges */}
          {product.isBestseller && (
            <span className="absolute top-3 left-3 text-[10px] tracking-[0.18em] uppercase text-[#392C2A] bg-[#E8D8C8]/95 backdrop-blur-sm px-2.5 py-1 border border-[#E8DED4] font-medium shadow-xs">
              Best Seller
            </span>
          )}
          {!product.isBestseller && product.isNewArrival && (
            <span className="absolute top-3 left-3 text-[10px] tracking-[0.18em] uppercase text-[#C9878D] bg-[#FFFDF9]/95 backdrop-blur-sm px-2.5 py-1 border border-[#E8DED4] font-medium shadow-xs">
              New Arrival
            </span>
          )}

          {/* Top Right Actions: Wishlist & Price Alert */}
          <div className="absolute top-3 right-3 flex flex-col gap-1.5 z-10">
            <button
              onClick={handleWishlistClick}
              aria-label="Save to Wishlist"
              title="Save to Wishlist"
              className="p-2 bg-[#FFFDF9]/90 hover:bg-white text-[#392C2A] shadow-sm backdrop-blur-sm transition-all rounded-full cursor-pointer hover:scale-105"
            >
              <Heart
                className={`w-3.5 h-3.5 transition-colors ${
                  inWishlist ? 'fill-[#C9878D] text-[#C9878D]' : 'text-[#7D6B67]'
                }`}
              />
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowAlertModal(true);
              }}
              title="Set price drop alert"
              aria-label="Set price drop alert"
              className="p-2 bg-[#FFFDF9]/90 hover:bg-white text-[#7D6B67] hover:text-[#C9878D] shadow-sm backdrop-blur-sm transition-all rounded-full opacity-0 group-hover:opacity-100 cursor-pointer"
            >
              <Bell className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Floating Actions Strip on Desktop Hover */}
          <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-[#392C2A]/85 via-[#392C2A]/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 hidden sm:flex items-center gap-2">
            <button
              onClick={handleQuickAdd}
              className="flex-1 py-2.5 bg-[#C9878D] text-white text-[11px] font-semibold tracking-[0.2em] uppercase hover:bg-[#B56F75] transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Add to Cart</span>
            </button>

            <button
              onClick={handleQuickView}
              title="Quick View"
              className="p-2.5 bg-[#FFFDF9]/95 text-[#392C2A] hover:bg-white hover:text-[#C9878D] transition-colors cursor-pointer"
            >
              <Eye className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={handleCompare}
              title="Compare Specifications"
              className="p-2.5 bg-[#FFFDF9]/95 text-[#392C2A] hover:bg-white hover:text-[#C9878D] transition-colors cursor-pointer"
            >
              <Scale className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Product Metadata in Soft Cream */}
        <div className="p-5 flex flex-col flex-1 justify-between bg-[#FFFDF9]">
          <div>
            <div className="flex items-center justify-between text-xs text-[#7D6B67] mb-1.5">
              <span className="tracking-[0.18em] uppercase text-[11px] font-medium text-[#7D6B67]">
                {product.categoryName}
              </span>
              <div className="flex items-center gap-1 font-mono text-[11px] text-[#D6B77A] tabular-nums font-semibold">
                <Star className="w-3 h-3 fill-[#D6B77A]" />
                <span>{product.averageRating.toFixed(1)}</span>
              </div>
            </div>

            <h3 className="font-serif text-lg text-[#392C2A] group-hover:text-[#C9878D] transition-colors line-clamp-1">
              {product.name}
            </h3>

            {/* Note / Highlight kicker */}
            {product.notes && product.notes.length > 0 && (
              <p className="text-xs text-[#7D6B67] mt-1 line-clamp-1 italic">
                {product.notes[0]}
              </p>
            )}
            {product.fabricComposition && !product.notes && (
              <p className="text-xs text-[#7D6B67] mt-1 line-clamp-1">
                {product.fabricComposition.split('&')[0]}
              </p>
            )}
          </div>

          {/* Price & Mobile Actions */}
          <div className="mt-4 pt-3 border-t border-[#E8DED4] flex items-center justify-between">
            <div className="flex items-baseline gap-2 font-mono tabular-nums">
              <span className="text-sm font-semibold text-[#392C2A]">
                ₹{product.price.toLocaleString('en-US')}
              </span>
              {product.compareAtPrice && (
                <span className="text-xs text-[#7D6B67] line-through">
                  ₹{product.compareAtPrice.toLocaleString('en-US')}
                </span>
              )}
            </div>

            <div className="sm:hidden flex items-center gap-2">
              <button
                onClick={handleQuickView}
                className="text-xs text-[#7D6B67] p-1"
                aria-label="Quick View"
              >
                <Eye className="w-4 h-4" />
              </button>
              <button
                onClick={handleQuickAdd}
                className="text-xs uppercase tracking-wider text-[#C9878D] font-semibold p-1 underline"
              >
                Add
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      {showAlertModal && (
        <PriceAlertModal
          product={product}
          type="PRICE_DROP"
          onClose={() => setShowAlertModal(false)}
        />
      )}
    </>
  );
};
