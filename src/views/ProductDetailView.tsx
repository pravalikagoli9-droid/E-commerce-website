import React, { useState, useEffect } from 'react';
import type { Review } from '../types';
import { useStore } from '../context/StoreContext';
import { ProductCard } from '../components/ProductCard';
import { PriceAlertModal } from '../components/PriceAlertModal';
import {
  Heart,
  ShoppingBag,
  Star,
  ShieldCheck,
  Truck,
  Minus,
  Plus,
  ArrowLeft,
  Scale,
  Bell,
  Flag
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { getProductImageUrl, handleImageError } from '../utils/imageUrl';

export const ProductDetailView: React.FC = () => {
  const {
    selectedProduct,
    setCurrentPage,
    addToCart,
    toggleWishlist,
    isInWishlist,
    addToCompare,
    products,
    user,
    showToast
  } = useStore();

  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState<string | undefined>(
    selectedProduct?.variants?.[0]?.name
  );
  const [quantity, setQuantity] = useState(1);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [reviewSort, setReviewSort] = useState<'recent' | 'rating'>('recent');
  const [isLoadingReviews, setIsLoadingReviews] = useState(true);

  // Review Form
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewAuthor, setReviewAuthor] = useState('');
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  // Price Drop / Back in stock Modal
  const [showAlertModal, setShowAlertModal] = useState(false);

  // Zoom magnifier effect state
  const [zoomStyle, setZoomStyle] = useState({ display: 'none', backgroundPosition: '0% 0%' });

  useEffect(() => {
    if (selectedProduct) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setActiveImageIdx(0);
      setSelectedVariant(selectedProduct.variants?.[0]?.name);
      setQuantity(1);

      // Fetch reviews
      setIsLoadingReviews(true);
      fetch(`/api/reviews/${selectedProduct.id}`)
        .then(res => res.json())
        .then(data => {
          setReviews(data.reviews || []);
        })
        .catch(console.error)
        .finally(() => setIsLoadingReviews(false));
    }
  }, [selectedProduct]);

  if (!selectedProduct) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center space-y-4">
        <p className="font-serif text-2xl text-[#7D6B67]">Product not found.</p>
        <button
          onClick={() => setCurrentPage('shop')}
          className="px-6 py-2.5 bg-[#C9878D] text-white text-xs uppercase tracking-[0.2em] font-semibold hover:bg-[#B56F75] transition-colors rounded-sm"
        >
          Back to Shop
        </button>
      </div>
    );
  }

  const inWishlist = isInWishlist(selectedProduct.id);

  let currentPrice = selectedProduct.price;
  if (selectedVariant && selectedProduct.variants) {
    const v = selectedProduct.variants.find(va => va.name === selectedVariant);
    if (v) currentPrice += v.priceDiff;
  }

  const handleAddToCart = () => {
    addToCart(selectedProduct, quantity, selectedVariant);
  };

  const handleBuyNow = () => {
    addToCart(selectedProduct, quantity, selectedVariant);
    setCurrentPage('checkout');
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewComment.trim()) return;
    setIsSubmittingReview(true);
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(user ? { Authorization: `Bearer ${localStorage.getItem('elixir_token')}` } : {})
        },
        body: JSON.stringify({
          productId: selectedProduct.id,
          rating: reviewRating,
          comment: reviewComment.trim(),
          userName: user ? user.name : (reviewAuthor.trim() || 'Verified Customer')
        })
      });
      if (res.ok) {
        const data = await res.json();
        setReviews(prev => [data.review, ...prev]);
        setReviewComment('');
        setReviewAuthor('');
        showToast('Thank you! Your customer review has been posted.', 'success');
      } else {
        showToast('Failed to submit review.', 'error');
      }
    } catch {
      showToast('Connection error. Please try again.', 'error');
    } finally {
      setIsSubmittingReview(false);
    }
  };

  const handleReportReview = async (reviewId: string) => {
    try {
      await fetch('/api/reviews/report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reviewId })
      });
      showToast('Review reported for administrative moderation.', 'info');
      setReviews(prev => prev.filter(r => r.id !== reviewId));
    } catch {
      showToast('Error reporting review.', 'error');
    }
  };

  const sortedReviews = [...reviews].sort((a, b) => {
    if (reviewSort === 'rating') return b.rating - a.rating;
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  const relatedProducts = products
    .filter(p => p.categoryId === selectedProduct.categoryId && p.id !== selectedProduct.id)
    .slice(0, 4);

  // Zoom handle
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.pageX - left - window.scrollX) / width) * 100;
    const y = ((e.pageY - top - window.scrollY) / height) * 100;
    setZoomStyle({
      display: 'block',
      backgroundPosition: `${x}% ${y}%`
    });
  };

  const handleMouseLeave = () => {
    setZoomStyle({ display: 'none', backgroundPosition: '0% 0%' });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-20">
      {/* Back button */}
      <div className="flex items-center justify-between border-b border-[#E8DED4] pb-4">
        <button
          onClick={() => setCurrentPage('shop')}
          className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-[#7D6B67] hover:text-[#C9878D] transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Shop</span>
        </button>

        <div className="flex items-center gap-5 text-xs">
          <button
            onClick={() => addToCompare(selectedProduct)}
            className="flex items-center gap-1.5 text-[#7D6B67] hover:text-[#C9878D] cursor-pointer"
          >
            <Scale className="w-4 h-4" />
            <span>Compare</span>
          </button>
          <button
            onClick={() => setShowAlertModal(true)}
            className="flex items-center gap-1.5 text-[#7D6B67] hover:text-[#C9878D] cursor-pointer"
          >
            <Bell className="w-4 h-4" />
            <span>Price Drop Alert</span>
          </button>
        </div>
      </div>

      {/* Main PDP Split (Gallery Left, Purchase Module Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
        {/* Left Column: Interactive Image Gallery with Zoom */}
        <div className="lg:col-span-7 space-y-4">
          {/* Main Image Frame with hover zoom */}
          <div
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className="aspect-[4/5] bg-[#FFFDF9] border border-[#E8DED4] overflow-hidden relative cursor-crosshair rounded-sm"
          >
            <AnimatePresence mode="wait">
              <motion.img
                key={activeImageIdx}
                src={getProductImageUrl(selectedProduct.images?.[activeImageIdx] || selectedProduct.images?.[0])}
                alt={selectedProduct.name}
                referrerPolicy="no-referrer"
                onError={handleImageError}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="w-full h-full object-cover"
              />
            </AnimatePresence>

            {/* Magnifier zoom overlay */}
            <div
              className="absolute inset-0 pointer-events-none transition-opacity duration-150"
              style={{
                display: zoomStyle.display,
                backgroundImage: `url(${getProductImageUrl(selectedProduct.images?.[activeImageIdx] || selectedProduct.images?.[0])})`,
                backgroundSize: '200%',
                backgroundPosition: zoomStyle.backgroundPosition
              }}
            />

            <button
              onClick={() => toggleWishlist(selectedProduct.id)}
              className="absolute top-4 right-4 p-3 bg-white/90 hover:bg-white text-[#392C2A] shadow-sm backdrop-blur-sm transition-colors rounded-full z-10 cursor-pointer"
              aria-label="Wishlist toggle"
            >
              <Heart
                className={`w-5 h-5 ${
                  inWishlist ? 'fill-[#C9878D] text-[#C9878D]' : 'text-[#7D6B67]'
                }`}
              />
            </button>
          </div>

          {/* Thumbnails */}
          {selectedProduct.images && selectedProduct.images.length > 1 && (
            <div className="flex gap-3">
              {selectedProduct.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIdx(idx)}
                  className={`w-20 h-24 border overflow-hidden cursor-pointer transition-all rounded-sm ${
                    activeImageIdx === idx ? 'border-[#C9878D] ring-1 ring-[#C9878D]' : 'border-[#E8DED4] opacity-70 hover:opacity-100'
                  }`}
                >
                  <img
                    src={getProductImageUrl(img)}
                    alt=""
                    onError={handleImageError}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Contiguous Purchase Module */}
        <div className="lg:col-span-5 space-y-8 sticky top-28 bg-[#FFFDF9] p-6 sm:p-8 border border-[#E8DED4] rounded-sm shadow-xs">
          <div className="space-y-3 pb-6 border-b border-[#E8DED4]">
            <div className="flex items-center justify-between text-xs text-[#7D6B67]">
              <span className="tracking-[0.2em] uppercase text-[#C9878D] font-semibold">
                {selectedProduct.categoryName}
              </span>
              <span className="font-mono text-[11px]">SKU: {selectedProduct.sku}</span>
            </div>

            <h1 className="font-serif text-3xl sm:text-4xl text-[#392C2A] leading-tight font-normal">
              {selectedProduct.name}
            </h1>

            {/* Ratings, Reviews & Stock */}
            <div className="flex items-center gap-3 text-xs text-[#7D6B67]">
              <div className="flex items-center gap-1 text-[#D6B77A] font-mono font-semibold">
                <Star className="w-3.5 h-3.5 fill-[#D6B77A]" />
                <span>{selectedProduct.averageRating.toFixed(1)}</span>
              </div>
              <span>·</span>
              <span>{reviews.length} Customer Reviews</span>
              <span>·</span>
              <span className={selectedProduct.stock > 0 ? 'text-[#3E7B54] font-medium' : 'text-[#D97979] font-medium'}>
                {selectedProduct.stock > 0 ? `In Stock (${selectedProduct.stock} left)` : 'Out of Stock'}
              </span>
            </div>

            {/* Pricing */}
            <div className="pt-2 flex items-baseline gap-3 font-mono tabular-nums">
              <span className="text-2xl font-bold text-[#392C2A]">
                ₹{currentPrice.toLocaleString('en-US')}
              </span>
              {selectedProduct.compareAtPrice && (
                <span className="text-sm text-[#7D6B67] line-through">
                  ₹{selectedProduct.compareAtPrice.toLocaleString('en-US')}
                </span>
              )}
              <span className="text-xs text-[#7D6B67] font-sans">
                (Taxes included)
              </span>
            </div>
          </div>

          {/* Description */}
          <p className="text-sm text-[#7D6B67] leading-relaxed">
            {selectedProduct.description}
          </p>

          {/* Category-Specific Highlight Box */}
          {selectedProduct.fragranceFamily && (
            <div className="p-3.5 bg-[#FAF7F2] border border-[#E8DED4] space-y-1 text-xs rounded-sm">
              <span className="uppercase text-[10px] tracking-wider text-[#C9878D] font-semibold block">
                Fragrance Family & Longevity
              </span>
              <p className="text-[#392C2A] font-medium">
                {selectedProduct.fragranceFamily} · {selectedProduct.sillage} Sillage ({selectedProduct.longevity})
              </p>
            </div>
          )}

          {/* Variant Selector */}
          {selectedProduct.variants && selectedProduct.variants.length > 0 && (
            <div className="space-y-2">
              <label className="text-xs tracking-[0.2em] uppercase text-[#7D6B67] block font-semibold">
                Select Option / Size
              </label>
              <div className="flex flex-wrap gap-2">
                {selectedProduct.variants.map(v => (
                  <button
                    key={v.id}
                    onClick={() => setSelectedVariant(v.name)}
                    className={`px-4 py-2 text-xs uppercase tracking-wider transition-colors border cursor-pointer rounded-sm ${
                      selectedVariant === v.name
                        ? 'bg-[#C9878D] text-white border-[#C9878D] font-semibold shadow-xs'
                        : 'bg-[#FFFDF9] text-[#7D6B67] border-[#E8DED4] hover:border-[#C9878D] hover:text-[#392C2A]'
                    }`}
                  >
                    {v.name}
                    {v.priceDiff !== 0 && (
                      <span className="ml-1 text-[11px] opacity-80">
                        ({v.priceDiff > 0 ? `+₹${v.priceDiff}` : `-₹${Math.abs(v.priceDiff)}`})
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity Stepper & CTAs */}
          <div className="space-y-4 pt-2">
            <div className="flex items-center gap-4">
              <div className="flex items-center border border-[#E8DED4] bg-[#FAF7F2] rounded-sm">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-3 text-[#7D6B67] hover:text-[#392C2A] cursor-pointer"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="px-4 text-sm font-mono text-[#392C2A] font-bold tabular-nums">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(Math.min(selectedProduct.stock, quantity + 1))}
                  className="p-3 text-[#7D6B67] hover:text-[#392C2A] cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>

              <button
                onClick={handleAddToCart}
                disabled={selectedProduct.stock <= 0}
                className="flex-1 py-3.5 bg-[#E8D8C8] hover:bg-[#DECABE] text-[#392C2A] border border-[#E8DED4] text-xs font-semibold tracking-[0.2em] uppercase transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs rounded-sm"
              >
                <ShoppingBag className="w-4 h-4 text-[#C9878D]" />
                <span>Add to Cart</span>
              </button>
            </div>

            <button
              onClick={handleBuyNow}
              disabled={selectedProduct.stock <= 0}
              className="w-full py-4 bg-[#C9878D] hover:bg-[#B56F75] text-white text-xs font-semibold tracking-[0.22em] uppercase transition-colors shadow-md cursor-pointer rounded-sm"
            >
              Buy Now · Instant Checkout
            </button>
          </div>

          {/* Trust Guarantees */}
          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-[#E8DED4] text-xs text-[#7D6B67]">
            <div className="flex items-start gap-2.5">
              <Truck className="w-4 h-4 text-[#C9878D] shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-[#392C2A]">Express Shipping</p>
                <p className="text-[11px] text-[#7D6B67]">Complimentary over ₹5,000</p>
              </div>
            </div>
            <div className="flex items-start gap-2.5">
              <ShieldCheck className="w-4 h-4 text-[#C9878D] shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-[#392C2A]">Authenticity Guaranteed</p>
                <p className="text-[11px] text-[#7D6B67]">Individually batch verified</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Specifications, Pyramids, Rituals, & Size Guides */}
      <div className="border-t border-[#E8DED4] pt-14 space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Notes or Actives */}
          {selectedProduct.notes && selectedProduct.notes.length > 0 && (
            <div className="space-y-4">
              <h3 className="font-serif text-2xl text-[#392C2A]">Fragrance Notes & Pyramid</h3>
              <ul className="space-y-2 text-xs text-[#7D6B67] divide-y divide-[#E8DED4]">
                {selectedProduct.notes.map((note, i) => (
                  <li key={i} className="py-2.5 flex items-center justify-between">
                    <span className="font-medium text-[#392C2A]">{note.split(':')[0]}</span>
                    <span>{note.split(':')[1]}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Apparel Size Guide */}
          {selectedProduct.sizeGuide && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-serif text-2xl text-[#392C2A]">Size & Fit Guide</h3>
                <div className="text-xs text-[#7D6B67] flex items-center gap-1">
                  <span>Unit: <strong>cm / inches</strong></span>
                </div>
              </div>

              <div className="overflow-x-auto border border-[#E8DED4] rounded-sm">
                <table className="w-full text-xs text-left">
                  <thead className="bg-[#FAF7F2] border-b border-[#E8DED4]">
                    <tr>
                      <th className="p-2.5 font-medium text-[#392C2A]">Size</th>
                      <th className="p-2.5 font-medium text-[#392C2A]">Chest</th>
                      <th className="p-2.5 font-medium text-[#392C2A]">Waist</th>
                      <th className="p-2.5 font-medium text-[#392C2A]">Length</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E8DED4] bg-[#FFFDF9] text-[#7D6B67]">
                    {selectedProduct.sizeGuide.map((row, i) => (
                      <tr key={i}>
                        <td className="p-2.5 font-medium text-[#392C2A]">{row.size}</td>
                        <td className="p-2.5">{row.chest}</td>
                        <td className="p-2.5">{row.waist}</td>
                        <td className="p-2.5">{row.length}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Skincare Ritual & Warnings */}
          {selectedProduct.usageRitual && (
            <div className="space-y-4">
              <h3 className="font-serif text-2xl text-[#392C2A]">Recommended Evening Routine</h3>
              <div className="p-5 bg-[#FFFDF9] border border-[#E8DED4] space-y-3 text-xs text-[#7D6B67] rounded-sm">
                <p className="leading-relaxed">{selectedProduct.usageRitual}</p>
                {selectedProduct.dermatologicalWarnings && (
                  <p className="text-[11px] text-[#C9878D] border-t border-[#E8DED4] pt-2 italic">
                    Note: {selectedProduct.dermatologicalWarnings}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Product Specifications */}
          {selectedProduct.details && (
            <div className="space-y-4">
              <h3 className="font-serif text-2xl text-[#392C2A]">Product Details & Specifications</h3>
              <ul className="space-y-2 text-xs text-[#7D6B67] divide-y divide-[#E8DED4]">
                {Object.entries(selectedProduct.details).map(([key, value]) => (
                  <li key={key} className="py-2.5 flex items-center justify-between">
                    <span className="font-medium text-[#392C2A]">{key}</span>
                    <span className="text-right max-w-xs">{value}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Ingredients if available */}
        {selectedProduct.ingredients && (
          <div className="p-6 bg-[#FFFDF9] border border-[#E8DED4] space-y-2 text-xs rounded-sm">
            <span className="tracking-[0.2em] uppercase text-[#C9878D] font-semibold">
              Full Ingredients List
            </span>
            <p className="text-[#7D6B67] leading-relaxed italic">
              {selectedProduct.ingredients}
            </p>
          </div>
        )}
      </div>

      {/* Customer Reviews Section */}
      <div className="border-t border-[#E8DED4] pt-14 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="text-xs tracking-[0.25em] uppercase text-[#C9878D] font-semibold">
              Customer Feedback
            </span>
            <h2 className="font-serif text-3xl text-[#392C2A]">Customer Ratings & Reviews</h2>
          </div>

          <div className="flex items-center gap-3 text-xs">
            <span className="text-[#7D6B67]">Sort Reviews:</span>
            <select
              value={reviewSort}
              onChange={e => setReviewSort(e.target.value as any)}
              className="bg-[#FFFDF9] border border-[#E8DED4] px-3 py-1.5 text-xs text-[#392C2A] cursor-pointer rounded-sm focus:border-[#C9878D]"
            >
              <option value="recent">Most Recent</option>
              <option value="rating">Highest Rating</option>
            </select>
          </div>
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {sortedReviews.length === 0 ? (
            <p className="text-xs text-[#7D6B67] italic py-8">
              Be the first customer to leave a review for this product.
            </p>
          ) : (
            sortedReviews.map(r => (
              <div key={r.id} className="p-6 bg-[#FFFDF9] border border-[#E8DED4] space-y-3 text-xs rounded-sm shadow-2xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-[#D6B77A]">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3.5 h-3.5 ${
                          i < r.rating ? 'fill-[#D6B77A]' : 'text-[#E8DED4]'
                        }`}
                      />
                    ))}
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-[11px] text-[#7D6B67] font-mono">
                      {new Date(r.createdAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </span>
                    <button
                      onClick={() => handleReportReview(r.id)}
                      className="text-[#7D6B67] hover:text-[#D97979] p-1 cursor-pointer"
                      title="Report inappropriate review"
                    >
                      <Flag className="w-3 h-3" />
                    </button>
                  </div>
                </div>

                <p className="text-[#392C2A] leading-relaxed font-serif text-sm">
                  "{r.comment}"
                </p>

                <div className="pt-2 border-t border-[#E8DED4] flex items-center justify-between text-[11px] text-[#7D6B67]">
                  <span className="font-semibold text-[#392C2A]">{r.userName}</span>
                  {r.verifiedPurchase && (
                    <span className="text-[#3E7B54] font-medium">Verified Buyer</span>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Write a Review Form */}
        <div className="p-6 sm:p-8 bg-[#FFFDF9] border border-[#E8DED4] max-w-2xl space-y-4 rounded-sm shadow-xs">
          <h3 className="font-serif text-xl text-[#392C2A]">Write a Customer Review</h3>
          <form onSubmit={handleReviewSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block text-[#7D6B67] mb-1 uppercase tracking-wider font-semibold">
                Rating
              </label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map(star => (
                  <button
                    type="button"
                    key={star}
                    onClick={() => setReviewRating(star)}
                    className="p-1 cursor-pointer"
                  >
                    <Star
                      className={`w-5 h-5 ${
                        star <= reviewRating
                          ? 'fill-[#D6B77A] text-[#D6B77A]'
                          : 'text-[#E8DED4]'
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            {!user && (
              <div>
                <label className="block text-[#7D6B67] mb-1 uppercase tracking-wider font-semibold">
                  Your Full Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Clara Vance"
                  value={reviewAuthor}
                  onChange={e => setReviewAuthor(e.target.value)}
                  className="w-full bg-[#FAF7F2] border border-[#E8DED4] px-3 py-2 text-[#392C2A] placeholder-[#998] focus:outline-none focus:border-[#C9878D] rounded-sm"
                />
              </div>
            )}

            <div>
              <label className="block text-[#7D6B67] mb-1 uppercase tracking-wider font-semibold">
                Review & Impressions
              </label>
              <textarea
                rows={3}
                required
                placeholder="Share your thoughts on the scent longevity, fabric fit, or skincare texture..."
                value={reviewComment}
                onChange={e => setReviewComment(e.target.value)}
                className="w-full bg-[#FAF7F2] border border-[#E8DED4] px-3 py-2 text-[#392C2A] placeholder-[#998] focus:outline-none focus:border-[#C9878D] rounded-sm"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmittingReview}
              className="px-6 py-2.5 bg-[#C9878D] hover:bg-[#B56F75] text-white uppercase tracking-[0.2em] font-semibold transition-colors cursor-pointer rounded-sm shadow-xs"
            >
              Submit Review
            </button>
          </form>
        </div>
      </div>

      {/* You May Also Like */}
      {relatedProducts.length > 0 && (
        <div className="border-t border-[#E8DED4] pt-14 space-y-6">
          <div className="space-y-1">
            <span className="text-xs tracking-[0.25em] uppercase text-[#C9878D] font-semibold">
              Recommendations
            </span>
            <h2 className="font-serif text-3xl text-[#392C2A]">You May Also Like</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map(p => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}

      {showAlertModal && (
        <PriceAlertModal
          product={selectedProduct}
          type="PRICE_DROP"
          onClose={() => setShowAlertModal(false)}
        />
      )}
    </div>
  );
};
