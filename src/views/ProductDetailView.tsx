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
  RotateCcw,
  Sparkles,
  Minus,
  Plus,
  ArrowLeft,
  Scale,
  Bell,
  Check,
  Info,
  Flag,
  Share2
} from 'lucide-react';

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

  // Apparel Size Guide Unit Toggle
  const [sizeUnit, setSizeUnit] = useState<'cm' | 'in'>('cm');

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
        <p className="font-serif text-2xl text-[#8C7A6B]">Creation not selected.</p>
        <button
          onClick={() => setCurrentPage('shop')}
          className="px-6 py-2.5 bg-[#1E1714] text-[#FAF8F5] text-xs uppercase tracking-[0.2em] font-medium"
        >
          Return to Catalog
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
          userName: user ? user.name : (reviewAuthor.trim() || 'Guest Connoisseur')
        })
      });
      if (res.ok) {
        const data = await res.json();
        setReviews(prev => [data.review, ...prev]);
        setReviewComment('');
        setReviewAuthor('');
        showToast('Your connoisseur endorsement has been inscribed.', 'success');
      } else {
        showToast('Failed to record endorsement.', 'error');
      }
    } catch {
      showToast('Connection error.', 'error');
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
      showToast('Endorsement flagged for curatorial review.', 'info');
      setReviews(prev => prev.filter(r => r.id !== reviewId));
    } catch {
      showToast('Error reporting endorsement.', 'error');
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
      <div className="flex items-center justify-between border-b border-[#E7E0D6] pb-4">
        <button
          onClick={() => setCurrentPage('shop')}
          className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-[#8C7A6B] hover:text-[#1E1714] transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Return to Catalog</span>
        </button>

        <div className="flex items-center gap-4 text-xs">
          <button
            onClick={() => addToCompare(selectedProduct)}
            className="flex items-center gap-1.5 text-[#8C7A6B] hover:text-[#1E1714] cursor-pointer"
          >
            <Scale className="w-4 h-4" />
            <span>Compare</span>
          </button>
          <button
            onClick={() => setShowAlertModal(true)}
            className="flex items-center gap-1.5 text-[#8C7A6B] hover:text-[#1E1714] cursor-pointer"
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
            className="aspect-[4/5] bg-white border border-[#E7E0D6] overflow-hidden relative cursor-crosshair"
          >
            <img
              src={selectedProduct.images[activeImageIdx] || selectedProduct.images[0]}
              alt={selectedProduct.name}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />

            {/* Magnifier zoom overlay */}
            <div
              className="absolute inset-0 pointer-events-none transition-opacity duration-150"
              style={{
                display: zoomStyle.display,
                backgroundImage: `url(${selectedProduct.images[activeImageIdx] || selectedProduct.images[0]})`,
                backgroundSize: '200%',
                backgroundPosition: zoomStyle.backgroundPosition
              }}
            />

            <button
              onClick={() => toggleWishlist(selectedProduct.id)}
              className="absolute top-4 right-4 p-3 bg-white/80 hover:bg-white text-[#1E1714] shadow-sm backdrop-blur-sm transition-colors rounded-full z-10"
              aria-label="Wishlist toggle"
            >
              <Heart
                className={`w-5 h-5 ${
                  inWishlist ? 'fill-[#C8A29A] text-[#C8A29A]' : 'text-[#8C7A6B]'
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
                    activeImageIdx === idx ? 'border-[#1E1714] ring-1 ring-[#1E1714]' : 'border-[#E7E0D6] opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Contiguous Purchase Module */}
        <div className="lg:col-span-5 space-y-8 sticky top-28">
          <div className="space-y-3 pb-6 border-b border-[#E7E0D6]">
            <div className="flex items-center justify-between text-xs text-[#8C7A6B]">
              <span className="tracking-[0.2em] uppercase text-[#BFA175] font-semibold">
                {selectedProduct.categoryName}
              </span>
              <span className="font-mono text-[11px]">SKU: {selectedProduct.sku}</span>
            </div>

            <h1 className="font-serif text-3xl sm:text-4xl text-[#1E1714] leading-tight font-normal">
              {selectedProduct.name}
            </h1>

            {/* Ratings, Reviews & Stock */}
            <div className="flex items-center gap-3 text-xs text-[#6B5C50]">
              <div className="flex items-center gap-1 text-[#BFA175] font-mono font-semibold">
                <Star className="w-3.5 h-3.5 fill-[#BFA175]" />
                <span>{selectedProduct.averageRating.toFixed(1)}</span>
              </div>
              <span>·</span>
              <span>{reviews.length} Connoisseur Endorsements</span>
              <span>·</span>
              <span className="text-[#3F6E50] font-medium">
                {selectedProduct.stock > 0 ? `In Stock (${selectedProduct.stock} bottles remaining)` : 'Exhausted'}
              </span>
            </div>

            {/* Pricing */}
            <div className="pt-2 flex items-baseline gap-3 font-mono tabular-nums">
              <span className="text-2xl font-bold text-[#1E1714]">
                ₹{currentPrice.toLocaleString('en-IN')}
              </span>
              {selectedProduct.compareAtPrice && (
                <span className="text-sm text-[#8C7A6B] line-through">
                  ₹{selectedProduct.compareAtPrice.toLocaleString('en-IN')}
                </span>
              )}
              <span className="text-xs text-[#8C7A6B] font-sans">
                (Inclusive of all luxury taxes & courier duties)
              </span>
            </div>
          </div>

          {/* Description */}
          <p className="text-sm text-[#5C4F44] leading-relaxed">
            {selectedProduct.description}
          </p>

          {/* Category-Specific Highlight Pill */}
          {selectedProduct.fragranceFamily && (
            <div className="p-3 bg-[#F4EFEA] border border-[#E7E0D6] space-y-1 text-xs">
              <span className="uppercase text-[10px] tracking-wider text-[#8C7A6B] font-semibold block">
                Olfactory Family & Longevity
              </span>
              <p className="text-[#1E1714] font-medium">
                {selectedProduct.fragranceFamily} · {selectedProduct.sillage} Sillage ({selectedProduct.longevity})
              </p>
            </div>
          )}

          {/* Variant Selector */}
          {selectedProduct.variants && selectedProduct.variants.length > 0 && (
            <div className="space-y-2">
              <label className="text-xs tracking-[0.2em] uppercase text-[#8C7A6B] block font-medium">
                Select Specification / Size
              </label>
              <div className="flex flex-wrap gap-2">
                {selectedProduct.variants.map(v => (
                  <button
                    key={v.id}
                    onClick={() => setSelectedVariant(v.name)}
                    className={`px-4 py-2 text-xs uppercase tracking-wider transition-colors border cursor-pointer ${
                      selectedVariant === v.name
                        ? 'bg-[#1E1714] text-[#FAF8F5] border-[#1E1714] font-medium'
                        : 'bg-white text-[#5C4F44] border-[#E7E0D6] hover:border-[#8C7A6B]'
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
              <div className="flex items-center border border-[#DCD3C7] bg-white">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-3 text-[#8C7A6B] hover:text-[#1E1714]"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="px-4 text-sm font-mono text-[#1E1714] font-bold tabular-nums">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(Math.min(selectedProduct.stock, quantity + 1))}
                  className="p-3 text-[#8C7A6B] hover:text-[#1E1714]"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>

              <button
                onClick={handleAddToCart}
                disabled={selectedProduct.stock <= 0}
                className="flex-1 py-3.5 bg-white border border-[#1E1714] hover:bg-[#FAF8F5] text-xs font-semibold tracking-[0.2em] uppercase text-[#1E1714] transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Add to Shopping Bag</span>
              </button>
            </div>

            <button
              onClick={handleBuyNow}
              disabled={selectedProduct.stock <= 0}
              className="w-full py-4 bg-[#1E1714] hover:bg-[#342721] text-[#FAF8F5] text-xs font-semibold tracking-[0.22em] uppercase transition-colors shadow-xl cursor-pointer"
            >
              Acquire Now · Instant Checkout
            </button>
          </div>

          {/* Trust Guarantees */}
          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-[#E7E0D6] text-xs text-[#6B5C50]">
            <div className="flex items-start gap-2.5">
              <Truck className="w-4 h-4 text-[#8C7A6B] shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-[#1E1714]">White Glove Courier</p>
                <p className="text-[11px] text-[#8C7A6B]">Complimentary over ₹5,000</p>
              </div>
            </div>
            <div className="flex items-start gap-2.5">
              <ShieldCheck className="w-4 h-4 text-[#8C7A6B] shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-[#1E1714]">Atelier Authenticity</p>
                <p className="text-[11px] text-[#8C7A6B]">Individually numbered wax seal</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Specifications, Pyramids, Rituals, & Size Guides */}
      <div className="border-t border-[#E7E0D6] pt-14 space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Notes or Actives */}
          {selectedProduct.notes && selectedProduct.notes.length > 0 && (
            <div className="space-y-4">
              <h3 className="font-serif text-2xl text-[#1E1714]">Olfactory Pyramid Structure</h3>
              <ul className="space-y-2 text-xs text-[#5C4F44] divide-y divide-[#E7E0D6]">
                {selectedProduct.notes.map((note, i) => (
                  <li key={i} className="py-2.5 flex items-center justify-between">
                    <span className="font-medium text-[#1E1714]">{note.split(':')[0]}</span>
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
                <h3 className="font-serif text-2xl text-[#1E1714]">Sartorial Sizing Guide</h3>
                <div className="text-xs text-[#8C7A6B] flex items-center gap-1">
                  <span>Metric: <strong>cm</strong></span>
                </div>
              </div>

              <div className="overflow-x-auto border border-[#E7E0D6]">
                <table className="w-full text-xs text-left">
                  <thead className="bg-[#F4EFEA] border-b border-[#E7E0D6]">
                    <tr>
                      <th className="p-2.5 font-medium text-[#1E1714]">Size</th>
                      <th className="p-2.5 font-medium text-[#1E1714]">Chest</th>
                      <th className="p-2.5 font-medium text-[#1E1714]">Waist</th>
                      <th className="p-2.5 font-medium text-[#1E1714]">Length</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E7E0D6] bg-white text-[#5C4F44]">
                    {selectedProduct.sizeGuide.map((row, i) => (
                      <tr key={i}>
                        <td className="p-2.5 font-medium text-[#1E1714]">{row.size}</td>
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
              <h3 className="font-serif text-2xl text-[#1E1714]">Nocturnal Application Ritual</h3>
              <div className="p-5 bg-white border border-[#E7E0D6] space-y-3 text-xs text-[#5C4F44]">
                <p className="leading-relaxed">{selectedProduct.usageRitual}</p>
                {selectedProduct.dermatologicalWarnings && (
                  <p className="text-[11px] text-[#8C7A6B] border-t border-[#F3EFEA] pt-2 italic">
                    Note: {selectedProduct.dermatologicalWarnings}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Atelier Specifications */}
          {selectedProduct.details && (
            <div className="space-y-4">
              <h3 className="font-serif text-2xl text-[#1E1714]">Atelier Craftsmanship Details</h3>
              <ul className="space-y-2 text-xs text-[#5C4F44] divide-y divide-[#E7E0D6]">
                {Object.entries(selectedProduct.details).map(([key, value]) => (
                  <li key={key} className="py-2.5 flex items-center justify-between">
                    <span className="font-medium text-[#1E1714]">{key}</span>
                    <span className="text-right max-w-xs">{value}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Ingredients if available */}
        {selectedProduct.ingredients && (
          <div className="p-6 bg-white border border-[#E7E0D6] space-y-2 text-xs">
            <span className="tracking-[0.2em] uppercase text-[#8C7A6B] font-semibold">
              Ingredient Transparency
            </span>
            <p className="text-[#6B5C50] leading-relaxed italic">
              {selectedProduct.ingredients}
            </p>
          </div>
        )}
      </div>

      {/* Customer Endorsements & Reviews Section */}
      <div className="border-t border-[#E7E0D6] pt-14 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="text-xs tracking-[0.25em] uppercase text-[#8C7A6B] font-semibold">
              Client Testimonials
            </span>
            <h2 className="font-serif text-3xl text-[#1E1714]">Connoisseur Endorsements</h2>
          </div>

          <div className="flex items-center gap-3 text-xs">
            <span className="text-[#8C7A6B]">Sort Reviews:</span>
            <select
              value={reviewSort}
              onChange={e => setReviewSort(e.target.value as any)}
              className="bg-white border border-[#DCD3C7] px-3 py-1 text-xs text-[#1E1714] cursor-pointer"
            >
              <option value="recent">Most Recent</option>
              <option value="rating">Highest Rating</option>
            </select>
          </div>
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {sortedReviews.length === 0 ? (
            <p className="text-xs text-[#8C7A6B] italic py-8">
              Be the first collector to provide an endorsement for this formulation.
            </p>
          ) : (
            sortedReviews.map(r => (
              <div key={r.id} className="p-6 bg-white border border-[#E7E0D6] space-y-3 text-xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-[#BFA175]">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3.5 h-3.5 ${
                          i < r.rating ? 'fill-[#BFA175]' : 'text-[#E7E0D6]'
                        }`}
                      />
                    ))}
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-[11px] text-[#8C7A6B] font-mono">
                      {new Date(r.createdAt).toLocaleDateString()}
                    </span>
                    <button
                      onClick={() => handleReportReview(r.id)}
                      className="text-[#8C7A6B] hover:text-[#A86464] p-1"
                      title="Report inappropriate review"
                    >
                      <Flag className="w-3 h-3" />
                    </button>
                  </div>
                </div>

                <p className="text-[#1E1714] leading-relaxed font-serif text-sm">
                  "{r.comment}"
                </p>

                <div className="pt-2 border-t border-[#F3EFEA] flex items-center justify-between text-[11px] text-[#8C7A6B]">
                  <span className="font-medium text-[#1E1714]">{r.userName}</span>
                  {r.verifiedPurchase && (
                    <span className="text-[#3F6E50] font-medium">Verified Acquisition</span>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Write a Review Form */}
        <div className="p-6 sm:p-8 bg-[#F4EFEA] border border-[#E7E0D6] max-w-2xl space-y-4">
          <h3 className="font-serif text-xl text-[#1E1714]">Inscribe Your Connoisseur Endorsement</h3>
          <form onSubmit={handleReviewSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block text-[#8C7A6B] mb-1 uppercase tracking-wider font-medium">
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
                          ? 'fill-[#BFA175] text-[#BFA175]'
                          : 'text-[#DCD3C7]'
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            {!user && (
              <div>
                <label className="block text-[#8C7A6B] mb-1 uppercase tracking-wider font-medium">
                  Your Full Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Lady Clara Ravenscroft"
                  value={reviewAuthor}
                  onChange={e => setReviewAuthor(e.target.value)}
                  className="w-full bg-white border border-[#DCD3C7] px-3 py-2 text-[#1E1714] placeholder-[#AAA] focus:outline-none focus:border-[#8C7A6B]"
                />
              </div>
            )}

            <div>
              <label className="block text-[#8C7A6B] mb-1 uppercase tracking-wider font-medium">
                Commentary & Sensory Impressions
              </label>
              <textarea
                rows={3}
                required
                placeholder="Detail the sillage, fabric drape, or cellular nourishment..."
                value={reviewComment}
                onChange={e => setReviewComment(e.target.value)}
                className="w-full bg-white border border-[#DCD3C7] px-3 py-2 text-[#1E1714] placeholder-[#AAA] focus:outline-none focus:border-[#8C7A6B]"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmittingReview}
              className="px-6 py-2.5 bg-[#1E1714] hover:bg-[#342721] text-[#FAF8F5] uppercase tracking-[0.2em] font-semibold transition-colors cursor-pointer"
            >
              Submit Endorsement
            </button>
          </form>
        </div>
      </div>

      {/* Related Creations */}
      {relatedProducts.length > 0 && (
        <div className="border-t border-[#E7E0D6] pt-14 space-y-6">
          <div className="space-y-1">
            <span className="text-xs tracking-[0.25em] uppercase text-[#8C7A6B] font-semibold">
              Complementary Atelier Works
            </span>
            <h2 className="font-serif text-3xl text-[#1E1714]">You May Also Appreciate</h2>
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
