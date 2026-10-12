import React, { useState, useEffect } from 'react';
import type { Review } from '../types';
import { useStore } from '../context/StoreContext';
import { ProductCard } from '../components/ProductCard';
import {
  Heart,
  ShoppingBag,
  Star,
  ShieldCheck,
  Truck,
  RotateCcw,
  Sparkles,
  Minus,
  Plus,
  ArrowLeft
} from 'lucide-react';

export const ProductDetailView: React.FC = () => {
  const {
    selectedProduct,
    setCurrentPage,
    addToCart,
    toggleWishlist,
    isInWishlist,
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
  const [isLoadingReviews, setIsLoadingReviews] = useState(true);

  // Review Form
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewAuthor, setReviewAuthor] = useState('');
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

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
        <p className="font-serif text-2xl text-[#888]">Creation not selected.</p>
        <button
          onClick={() => setCurrentPage('shop')}
          className="px-6 py-2.5 bg-[#F0ECE8] text-[#000000] text-xs uppercase tracking-[0.2em] font-medium"
        >
          Return to Catalog
        </button>
      </div>
    );
  }

  const inWishlist = isInWishlist(selectedProduct.id);

  // Calculate price with variant diff
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
          userName: user ? user.name : (reviewAuthor.trim() || 'Guest Connoisseur')
        })
      });
      if (res.ok) {
        const data = await res.json();
        setReviews(prev => [data.review, ...prev]);
        setReviewComment('');
        setReviewAuthor('');
        showToast('Your connoisseur endorsement has been recorded.', 'success');
      } else {
        showToast('Failed to record review.', 'error');
      }
    } catch {
      showToast('Connection error.', 'error');
    } finally {
      setIsSubmittingReview(false);
    }
  };

  const relatedProducts = products
    .filter(p => p.categoryId === selectedProduct.categoryId && p.id !== selectedProduct.id)
    .slice(0, 3);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-20">
      {/* Back button */}
      <button
        onClick={() => setCurrentPage('shop')}
        className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-[#888] hover:text-white transition-colors cursor-pointer"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Return to Catalog</span>
      </button>

      {/* Main PDP Split (Sticky Gallery Left, Contiguous Purchase Module Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
        {/* Left Column: Gallery */}
        <div className="lg:col-span-7 space-y-4">
          {/* Hero Zoom Frame */}
          <div className="aspect-[4/5] bg-[#0A0A0A] border border-[#222] overflow-hidden relative">
            <img
              src={selectedProduct.images[activeImageIdx] || selectedProduct.images[0]}
              alt={selectedProduct.name}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover transition-all duration-500"
            />
            <button
              onClick={() => toggleWishlist(selectedProduct.id)}
              className="absolute top-4 right-4 p-3 bg-black/60 backdrop-blur-sm text-white hover:text-[#C5A880] transition-colors"
            >
              <Heart
                className={`w-5 h-5 ${
                  inWishlist ? 'fill-[#C5A880] text-[#C5A880]' : ''
                }`}
              />
            </button>
          </div>

          {/* Thumbnails */}
          {selectedProduct.images.length > 1 && (
            <div className="flex gap-3">
              {selectedProduct.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIdx(idx)}
                  className={`w-20 h-24 border overflow-hidden cursor-pointer transition-all ${
                    activeImageIdx === idx ? 'border-[#C5A880]' : 'border-[#222] opacity-60 hover:opacity-100'
                  }`}
                >
                  <img
                    src={img}
                    alt=""
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Contiguous Purchase Module */}
        <div className="lg:col-span-5 space-y-8 sticky top-28">
          <div className="space-y-3 pb-6 border-b border-[#1F1F1F]">
            <div className="flex items-center justify-between text-xs text-[#8A857D]">
              <span className="tracking-[0.2em] uppercase text-[#C5A880]">
                {selectedProduct.categoryName}
              </span>
              <span className="font-mono text-[11px] text-[#777]">SKU: {selectedProduct.sku}</span>
            </div>

            <h1 className="font-serif text-3xl sm:text-4xl text-[#FFFFFF] leading-tight">
              {selectedProduct.name}
            </h1>

            {/* Ratings & Reviews Counter */}
            <div className="flex items-center gap-3 text-xs text-[#999]">
              <div className="flex items-center gap-1 text-[#C5A880] font-mono">
                <Star className="w-3.5 h-3.5 fill-[#C5A880]" />
                <span>{selectedProduct.averageRating.toFixed(1)}</span>
              </div>
              <span>·</span>
              <span>{reviews.length} Connoisseur Reviews</span>
              <span>·</span>
              <span className="text-[#64B587]">
                {selectedProduct.stock > 0 ? `In Stock (${selectedProduct.stock} left)` : 'Exhausted'}
              </span>
            </div>

            {/* Pricing */}
            <div className="pt-2 flex items-baseline gap-3 font-mono tabular-nums">
              <span className="text-2xl font-medium text-[#F0ECE8]">
                ₹{currentPrice.toLocaleString('en-IN')}
              </span>
              {selectedProduct.compareAtPrice && (
                <span className="text-sm text-[#666] line-through">
                  ₹{selectedProduct.compareAtPrice.toLocaleString('en-IN')}
                </span>
              )}
              <span className="text-xs text-[#888] font-sans">
                (Inclusive of all luxury taxes & courier duties)
              </span>
            </div>
          </div>

          {/* Description */}
          <p className="text-sm text-[#A8A29A] leading-relaxed">
            {selectedProduct.description}
          </p>

          {/* Variant Selector */}
          {selectedProduct.variants && selectedProduct.variants.length > 0 && (
            <div className="space-y-2">
              <label className="text-xs tracking-[0.2em] uppercase text-[#AAA] block">
                Select Specification / Size
              </label>
              <div className="flex flex-wrap gap-2">
                {selectedProduct.variants.map(v => (
                  <button
                    key={v.id}
                    onClick={() => setSelectedVariant(v.name)}
                    className={`px-4 py-2 text-xs uppercase tracking-wider transition-colors cursor-pointer border ${
                      selectedVariant === v.name
                        ? 'bg-[#F0ECE8] text-[#000000] border-[#F0ECE8] font-medium'
                        : 'bg-[#0E0E0E] text-[#888] border-[#262626] hover:text-white hover:border-[#555]'
                    }`}
                  >
                    {v.name}
                    {v.priceDiff !== 0 && (
                      <span className="ml-1 text-[11px] opacity-75">
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
              <div className="flex items-center border border-[#2B2B2B] bg-[#0E0E0E]">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-3 text-[#888] hover:text-white transition-colors"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="px-4 text-sm font-mono text-[#FFF] tabular-nums">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(Math.min(selectedProduct.stock, quantity + 1))}
                  className="p-3 text-[#888] hover:text-white transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>

              <button
                onClick={handleAddToCart}
                disabled={selectedProduct.stock <= 0}
                className="flex-1 py-3.5 border border-[#444] hover:border-white text-xs font-semibold tracking-[0.2em] uppercase text-[#FFF] hover:text-white transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Add to Bag</span>
              </button>
            </div>

            <button
              onClick={handleBuyNow}
              disabled={selectedProduct.stock <= 0}
              className="w-full py-4 bg-[#F0ECE8] hover:bg-white text-[#000000] text-xs font-semibold tracking-[0.22em] uppercase transition-colors shadow-xl cursor-pointer"
            >
              Acquire Now · Instant Checkout
            </button>
          </div>

          {/* Trust Guarantees */}
          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-[#1C1C1C] text-xs text-[#8A857D]">
            <div className="flex items-start gap-2.5">
              <Truck className="w-4 h-4 text-[#C5A880] shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-[#D1CCC4]">White Glove Courier</p>
                <p className="text-[11px] text-[#666]">Complimentary delivery over ₹5,000</p>
              </div>
            </div>
            <div className="flex items-start gap-2.5">
              <ShieldCheck className="w-4 h-4 text-[#C5A880] shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-[#D1CCC4]">Atelier Authenticity</p>
                <p className="text-[11px] text-[#666]">Individually numbered wax-sealed batch</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Specifications & Olfactory / Sartorial Notes */}
      <div className="border-t border-[#1F1F1F] pt-14 space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Notes or Details */}
          {selectedProduct.notes && selectedProduct.notes.length > 0 && (
            <div className="space-y-4">
              <h3 className="font-serif text-2xl text-white">Olfactory Pyramidal Notes</h3>
              <ul className="space-y-2 text-xs text-[#AAA] divide-y divide-[#1A1A1A]">
                {selectedProduct.notes.map((note, i) => (
                  <li key={i} className="py-2.5 flex items-center justify-between">
                    <span>{note.split(':')[0]}</span>
                    <span className="font-medium text-[#E0DBD3]">{note.split(':')[1]}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Atelier Specifications */}
          {selectedProduct.details && (
            <div className="space-y-4">
              <h3 className="font-serif text-2xl text-white">Atelier Specifications</h3>
              <ul className="space-y-2 text-xs text-[#AAA] divide-y divide-[#1A1A1A]">
                {Object.entries(selectedProduct.details).map(([key, value]) => (
                  <li key={key} className="py-2.5 flex items-center justify-between">
                    <span>{key}</span>
                    <span className="font-medium text-[#E0DBD3] text-right max-w-xs">{value}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Ingredients if Skincare/Parfumerie */}
        {selectedProduct.ingredients && (
          <div className="p-6 bg-[#0A0A0A] border border-[#1A1A1A] space-y-2 text-xs">
            <span className="tracking-[0.2em] uppercase text-[#888] font-medium">
              Ingredient Transparency
            </span>
            <p className="text-[#6E6961] leading-relaxed italic">
              {selectedProduct.ingredients}
            </p>
          </div>
        )}
      </div>

      {/* Connoisseur Reviews Section */}
      <div className="border-t border-[#1F1F1F] pt-14 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="text-xs tracking-[0.25em] uppercase text-[#C5A880]">
              Endorsements & Testimonials
            </span>
            <h2 className="font-serif text-3xl text-white">Connoisseur Reviews</h2>
          </div>
          <span className="font-mono text-sm text-[#888]">
            {reviews.length} {reviews.length === 1 ? 'Review' : 'Reviews'}
          </span>
        </div>

        {/* Reviews List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {reviews.length === 0 ? (
            <p className="text-xs text-[#777] italic py-8">
              Be the first collector to provide an endorsement for this formulation.
            </p>
          ) : (
            reviews.map(r => (
              <div key={r.id} className="p-6 bg-[#0A0A0A] border border-[#1C1C1C] space-y-3 text-xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-[#C5A880]">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3 h-3 ${
                          i < r.rating ? 'fill-[#C5A880]' : 'text-[#333]'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-[11px] text-[#666] font-mono">
                    {new Date(r.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-[#C4BFB8] leading-relaxed font-serif text-sm">
                  "{r.comment}"
                </p>
                <div className="pt-2 border-t border-[#141414] flex items-center justify-between text-[11px] text-[#777]">
                  <span className="font-medium text-white">{r.userName}</span>
                  {r.verifiedPurchase && (
                    <span className="text-[#C5A880]">Verified Acquisition</span>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Write a Review Form */}
        <div className="p-6 sm:p-8 bg-[#0D0D0D] border border-[#222] max-w-2xl space-y-4">
          <h3 className="font-serif text-xl text-white">Record Your Connoisseur Review</h3>
          <form onSubmit={handleReviewSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block text-[#AAA] mb-1 uppercase tracking-wider">
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
                          ? 'fill-[#C5A880] text-[#C5A880]'
                          : 'text-[#333]'
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            {!user && (
              <div>
                <label className="block text-[#AAA] mb-1 uppercase tracking-wider">
                  Your Full Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Lady Clara Ravenscroft"
                  value={reviewAuthor}
                  onChange={e => setReviewAuthor(e.target.value)}
                  className="w-full bg-[#141414] border border-[#2B2B2B] px-3 py-2 text-white placeholder-[#555] focus:outline-none focus:border-[#C5A880]"
                />
              </div>
            )}

            <div>
              <label className="block text-[#AAA] mb-1 uppercase tracking-wider">
                Commentary & Impressions
              </label>
              <textarea
                rows={3}
                required
                placeholder="Detail the sillage, fabric drape, or cellular nourishment..."
                value={reviewComment}
                onChange={e => setReviewComment(e.target.value)}
                className="w-full bg-[#141414] border border-[#2B2B2B] px-3 py-2 text-white placeholder-[#555] focus:outline-none focus:border-[#C5A880]"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmittingReview}
              className="px-6 py-2.5 bg-[#F0ECE8] hover:bg-white text-[#000000] uppercase tracking-[0.2em] font-semibold transition-colors cursor-pointer"
            >
              Submit Endorsement
            </button>
          </form>
        </div>
      </div>

      {/* Related Creations */}
      {relatedProducts.length > 0 && (
        <div className="border-t border-[#1F1F1F] pt-14 space-y-6">
          <div className="space-y-1">
            <span className="text-xs tracking-[0.25em] uppercase text-[#C5A880]">
              Complementary Atelier Works
            </span>
            <h2 className="font-serif text-3xl text-white">Related Creations</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {relatedProducts.map(p => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
