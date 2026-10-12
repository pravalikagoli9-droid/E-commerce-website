import React from 'react';
import type { Product } from '../types';
import { useStore } from '../context/StoreContext';
import { Heart, ShoppingBag, Star } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const {
    setSelectedProduct,
    setCurrentPage,
    addToCart,
    toggleWishlist,
    isInWishlist
  } = useStore();

  const inWishlist = isInWishlist(product.id);

  const handleCardClick = () => {
    setSelectedProduct(product);
    setCurrentPage('product-detail');
  };

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product, 1, product.variants?.[0]?.name);
  };

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleWishlist(product.id);
  };

  return (
    <div
      onClick={handleCardClick}
      className="group relative flex flex-col bg-[#0A0A0A] border border-[#1F1F1F] hover:border-[#383838] transition-all duration-300 cursor-pointer overflow-hidden"
    >
      {/* Product Image Frame */}
      <div className="relative aspect-[4/5] w-full bg-[#121212] overflow-hidden">
        <img
          src={product.images[0] || ''}
          alt={product.name}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />

        {/* Subtle Editorial Status Marker (Max 1 quiet text tag, NO pill enclosure) */}
        {product.isBestseller && (
          <span className="absolute top-3 left-3 text-[10px] tracking-[0.2em] uppercase text-[#F0ECE8] bg-black/60 backdrop-blur-sm px-2 py-0.5 border border-white/10">
            Atelier Bestseller
          </span>
        )}
        {!product.isBestseller && product.isNewArrival && (
          <span className="absolute top-3 left-3 text-[10px] tracking-[0.2em] uppercase text-[#C5A880] bg-black/60 backdrop-blur-sm px-2 py-0.5 border border-[#C5A880]/20">
            New Formulation
          </span>
        )}

        {/* Wishlist Heart Affordance */}
        <button
          onClick={handleWishlistClick}
          aria-label="Save to Wishlist"
          className="absolute top-3 right-3 p-2 bg-black/50 hover:bg-black/80 backdrop-blur-sm transition-colors text-white"
        >
          <Heart
            className={`w-4 h-4 transition-colors ${
              inWishlist ? 'fill-[#C5A880] text-[#C5A880]' : 'text-[#DDD]'
            }`}
          />
        </button>

        {/* Quick Add Overlay on Desktop Hover */}
        <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/90 via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 hidden sm:flex justify-center">
          <button
            onClick={handleQuickAdd}
            className="w-full py-2 bg-[#F0ECE8] text-[#000000] text-[11px] font-medium tracking-[0.2em] uppercase hover:bg-white transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-md"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Quick Acquisition</span>
          </button>
        </div>
      </div>

      {/* Product Metadata (Zero-Pill Discipline) */}
      <div className="p-5 flex flex-col flex-1 justify-between bg-[#0A0A0A]">
        <div>
          {/* Category & Rating Bar */}
          <div className="flex items-center justify-between text-xs text-[#8A857D] mb-1.5">
            <span className="tracking-[0.18em] uppercase text-[11px] text-[#A6A097]">
              {product.categoryName}
            </span>
            <div className="flex items-center gap-1 font-mono text-[11px] text-[#C5A880] tabular-nums">
              <Star className="w-3 h-3 fill-[#C5A880] text-[#C5A880]" />
              <span>{product.averageRating.toFixed(1)}</span>
            </div>
          </div>

          {/* Title */}
          <h3 className="font-serif text-lg text-[#F0ECE8] group-hover:text-white transition-colors line-clamp-1">
            {product.name}
          </h3>

          {/* Quiet Note / Essence kicker */}
          {product.notes && product.notes.length > 0 && (
            <p className="text-xs text-[#6E6961] mt-1 line-clamp-1 italic">
              {product.notes[0]}
            </p>
          )}
        </div>

        {/* Price & Mobile Add Button */}
        <div className="mt-4 pt-3 border-t border-[#181818] flex items-center justify-between">
          <div className="flex items-baseline gap-2 font-mono tabular-nums">
            <span className="text-sm font-semibold text-[#F0ECE8]">
              ₹{product.price.toLocaleString('en-IN')}
            </span>
            {product.compareAtPrice && (
              <span className="text-xs text-[#666] line-through">
                ₹{product.compareAtPrice.toLocaleString('en-IN')}
              </span>
            )}
          </div>

          <button
            onClick={handleQuickAdd}
            className="sm:hidden text-xs uppercase tracking-wider text-[#C5A880] p-1 underline"
          >
            Add to Bag
          </button>
        </div>
      </div>
    </div>
  );
};
