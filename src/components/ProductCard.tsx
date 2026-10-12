import React, { useState } from 'react';
import type { Product } from '../types';
import { useStore } from '../context/StoreContext';
import { Heart, ShoppingBag, Star, Eye, Scale, Bell } from 'lucide-react';
import { PriceAlertModal } from './PriceAlertModal';

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
      <div
        onClick={handleCardClick}
        className="group relative flex flex-col bg-white border border-[#E7E0D6] hover:border-[#8C7A6B] hover:shadow-lg transition-all duration-300 cursor-pointer overflow-hidden"
      >
        {/* Product Image Frame */}
        <div className="relative aspect-[4/5] w-full bg-[#F4EFEA] overflow-hidden">
          <img
            src={product.images[0] || ''}
            alt={product.name}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          />

          {/* Subtle Editorial Status Marker (Zero pill) */}
          {product.isBestseller && (
            <span className="absolute top-3 left-3 text-[10px] tracking-[0.2em] uppercase text-[#1E1714] bg-[#FAF8F5]/90 backdrop-blur-sm px-2 py-0.5 border border-[#DCD3C7]">
              Atelier Bestseller
            </span>
          )}
          {!product.isBestseller && product.isNewArrival && (
            <span className="absolute top-3 left-3 text-[10px] tracking-[0.2em] uppercase text-[#8C7A6B] bg-[#FAF8F5]/90 backdrop-blur-sm px-2 py-0.5 border border-[#DCD3C7]">
              New Formulation
            </span>
          )}

          {/* Top Right Actions: Wishlist & Price Alert */}
          <div className="absolute top-3 right-3 flex flex-col gap-1.5 z-10">
            <button
              onClick={handleWishlistClick}
              aria-label="Save to Curated Wishlist"
              className="p-2 bg-[#FAF8F5]/80 hover:bg-white text-[#1E1714] shadow-sm backdrop-blur-sm transition-all rounded-full cursor-pointer"
            >
              <Heart
                className={`w-3.5 h-3.5 transition-colors ${
                  inWishlist ? 'fill-[#C8A29A] text-[#C8A29A]' : 'text-[#8C7A6B]'
                }`}
              />
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowAlertModal(true);
              }}
              title="Price drop alert"
              aria-label="Set price drop alert"
              className="p-2 bg-[#FAF8F5]/80 hover:bg-white text-[#8C7A6B] hover:text-[#1E1714] shadow-sm backdrop-blur-sm transition-all rounded-full opacity-0 group-hover:opacity-100 cursor-pointer"
            >
              <Bell className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Floating Actions Strip on Desktop Hover */}
          <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-[#1C1613]/85 via-[#1C1613]/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 hidden sm:flex items-center gap-2">
            <button
              onClick={handleQuickAdd}
              className="flex-1 py-2 bg-[#FAF8F5] text-[#1E1714] text-[11px] font-semibold tracking-[0.2em] uppercase hover:bg-white transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Acquire</span>
            </button>

            <button
              onClick={handleQuickView}
              title="Quick Preview"
              className="p-2 bg-[#FAF8F5]/90 text-[#1E1714] hover:bg-white transition-colors cursor-pointer"
            >
              <Eye className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={handleCompare}
              title="Compare Specifications"
              className="p-2 bg-[#FAF8F5]/90 text-[#1E1714] hover:bg-white transition-colors cursor-pointer"
            >
              <Scale className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Product Metadata (Zero-Pill Discipline, Warm Espresso & Mocha Tones) */}
        <div className="p-5 flex flex-col flex-1 justify-between bg-white">
          <div>
            <div className="flex items-center justify-between text-xs text-[#8C7A6B] mb-1.5">
              <span className="tracking-[0.18em] uppercase text-[11px] font-medium text-[#8C7A6B]">
                {product.categoryName}
              </span>
              <div className="flex items-center gap-1 font-mono text-[11px] text-[#BFA175] tabular-nums font-semibold">
                <Star className="w-3 h-3 fill-[#BFA175]" />
                <span>{product.averageRating.toFixed(1)}</span>
              </div>
            </div>

            <h3 className="font-serif text-lg text-[#1E1714] group-hover:text-[#5C4F44] transition-colors line-clamp-1">
              {product.name}
            </h3>

            {/* Note / Attribute kicker */}
            {product.notes && product.notes.length > 0 && (
              <p className="text-xs text-[#8C7A6B] mt-1 line-clamp-1 italic">
                {product.notes[0]}
              </p>
            )}
            {product.fabricComposition && !product.notes && (
              <p className="text-xs text-[#8C7A6B] mt-1 line-clamp-1">
                {product.fabricComposition.split('&')[0]}
              </p>
            )}
          </div>

          {/* Price & Mobile Actions */}
          <div className="mt-4 pt-3 border-t border-[#F3EFEA] flex items-center justify-between">
            <div className="flex items-baseline gap-2 font-mono tabular-nums">
              <span className="text-sm font-semibold text-[#1E1714]">
                ₹{product.price.toLocaleString('en-IN')}
              </span>
              {product.compareAtPrice && (
                <span className="text-xs text-[#8C7A6B] line-through">
                  ₹{product.compareAtPrice.toLocaleString('en-IN')}
                </span>
              )}
            </div>

            <div className="sm:hidden flex items-center gap-2">
              <button
                onClick={handleQuickView}
                className="text-xs text-[#8C7A6B] p-1"
                aria-label="Quick View"
              >
                <Eye className="w-4 h-4" />
              </button>
              <button
                onClick={handleQuickAdd}
                className="text-xs uppercase tracking-wider text-[#1E1714] font-medium p-1 underline"
              >
                Add
              </button>
            </div>
          </div>
        </div>
      </div>

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
