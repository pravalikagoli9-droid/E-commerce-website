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
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        onClick={handleCardClick}
        className="group relative flex flex-col bg-[#FFFDF8] border border-[#B7A397]/30 hover:border-[#5A3E36] hover:shadow-lg transition-all duration-300 cursor-pointer overflow-hidden rounded-sm"
      >
        {/* Product Image Frame */}
        <div className="relative aspect-[4/5] w-full bg-[#F8F4ED] overflow-hidden">
          <img
            src={product.images[0] || ''}
            alt={product.name}
            referrerPolicy="no-referrer"
            loading="lazy"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src = '/src/assets/images/category_apparel_1791824731775.jpg';
            }}
            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          />

          {/* Badges */}
          {product.isBestseller && (
            <span className="absolute top-3 left-3 text-[10px] tracking-[0.18em] uppercase text-[#30231F] bg-[#F8F4ED]/95 backdrop-blur-sm px-2.5 py-1 border border-[#D6B77A] font-medium shadow-xs">
              Best Seller
            </span>
          )}
          {!product.isBestseller && product.isNewArrival && (
            <span className="absolute top-3 left-3 text-[10px] tracking-[0.18em] uppercase text-[#5A3E36] bg-[#FFFDF8]/95 backdrop-blur-sm px-2.5 py-1 border border-[#B7A397]/40 font-medium shadow-xs">
              New Arrival
            </span>
          )}

          {/* Top Right Actions: Wishlist & Price Alert */}
          <div className="absolute top-3 right-3 flex flex-col gap-1.5 z-10">
            <button
              onClick={handleWishlistClick}
              aria-label="Save to Wishlist"
              title="Save to Wishlist"
              className="p-2 bg-[#FFFDF8]/90 hover:bg-white text-[#30231F] shadow-sm backdrop-blur-sm transition-all rounded-full cursor-pointer hover:scale-105 border border-[#B7A397]/20"
            >
              <Heart
                className={`w-3.5 h-3.5 transition-colors ${
                  inWishlist ? 'fill-[#5A3E36] text-[#5A3E36]' : 'text-[#B7A397]'
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
              className="p-2 bg-[#FFFDF8]/90 hover:bg-white text-[#B7A397] hover:text-[#5A3E36] shadow-sm backdrop-blur-sm transition-all rounded-full opacity-0 group-hover:opacity-100 cursor-pointer border border-[#B7A397]/20"
            >
              <Bell className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Floating Actions Strip on Desktop Hover */}
          <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-[#30231F]/90 via-[#30231F]/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 hidden sm:flex items-center gap-2">
            <button
              onClick={handleQuickAdd}
              className="flex-1 py-2.5 bg-[#5A3E36] text-white text-[11px] font-semibold tracking-[0.2em] uppercase hover:bg-[#48322B] transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
            >
              <ShoppingBag className="w-3.5 h-3.5 text-[#D6B77A]" />
              <span>Add to Cart</span>
            </button>

            <button
              onClick={handleQuickView}
              title="Quick View"
              className="p-2.5 bg-[#FFFDF8]/95 text-[#30231F] hover:bg-white hover:text-[#5A3E36] transition-colors cursor-pointer"
            >
              <Eye className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={handleCompare}
              title="Compare Specifications"
              className="p-2.5 bg-[#FFFDF8]/95 text-[#30231F] hover:bg-white hover:text-[#5A3E36] transition-colors cursor-pointer"
            >
              <Scale className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Product Metadata in Soft Cream */}
        <div className="p-5 flex flex-col flex-1 justify-between bg-[#FFFDF8]">
          <div>
            <div className="flex items-center justify-between text-xs text-[#B7A397] mb-1.5">
              <span className="tracking-[0.18em] uppercase text-[11px] font-medium text-[#B7A397]">
                {product.categoryName}
              </span>
              <div className="flex items-center gap-1 font-mono text-[11px] text-[#D6B77A] tabular-nums font-semibold">
                <Star className="w-3 h-3 fill-[#D6B77A]" />
                <span>{product.averageRating.toFixed(1)}</span>
              </div>
            </div>

            <h3 className="font-serif text-lg text-[#30231F] group-hover:text-[#5A3E36] transition-colors line-clamp-1">
              {product.name}
            </h3>

            {/* Note / Highlight kicker */}
            {product.notes && product.notes.length > 0 && (
              <p className="text-xs text-[#B7A397] mt-1 line-clamp-1 italic">
                {product.notes[0]}
              </p>
            )}
            {product.fabricComposition && !product.notes && (
              <p className="text-xs text-[#B7A397] mt-1 line-clamp-1">
                {product.fabricComposition.split('&')[0]}
              </p>
            )}
          </div>

          {/* Price & Mobile Actions */}
          <div className="mt-4 pt-3 border-t border-[#B7A397]/25 flex items-center justify-between">
            <div className="flex items-baseline gap-2 font-mono tabular-nums">
              <span className="text-sm font-semibold text-[#30231F]">
                ₹{product.price.toLocaleString('en-US')}
              </span>
              {product.compareAtPrice && (
                <span className="text-xs text-[#B7A397] line-through">
                  ₹{product.compareAtPrice.toLocaleString('en-US')}
                </span>
              )}
            </div>

            <div className="sm:hidden flex items-center gap-2">
              <button
                onClick={handleQuickView}
                className="text-xs text-[#5A3E36] p-1"
                aria-label="Quick View"
              >
                <Eye className="w-4 h-4" />
              </button>
              <button
                onClick={handleQuickAdd}
                className="text-xs uppercase tracking-wider text-[#5A3E36] font-semibold p-1 underline"
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
