import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import {
  X,
  Plus,
  Minus,
  Trash2,
  ArrowRight,
  ShieldCheck,
  Tag,
  Gift,
  Sparkles,
  Coins,
  CheckCircle2
} from 'lucide-react';

export const CartDrawer: React.FC = () => {
  const {
    isCartDrawerOpen,
    setIsCartDrawerOpen,
    cartItems,
    updateCartQuantity,
    removeFromCart,
    clearCart,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    giftOptions,
    setGiftOptions,
    giftWrapFee,
    user,
    pointsToRedeem,
    setPointsToRedeem,
    pointsDiscount,
    cartSubtotal,
    cartDiscount,
    cartShippingFee,
    cartTax,
    cartTotal,
    products,
    addToCart,
    setCurrentPage,
    setSelectedProduct
  } = useStore();

  const [couponCodeInput, setCouponCodeInput] = useState('');
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);
  const [couponError, setCouponError] = useState<string | null>(null);
  const [showGiftOptions, setShowGiftOptions] = useState(false);

  if (!isCartDrawerOpen) return null;

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCodeInput.trim()) return;
    setIsApplyingCoupon(true);
    setCouponError(null);
    const res = await applyCoupon(couponCodeInput.trim());
    setIsApplyingCoupon(false);
    if (!res.success) {
      setCouponError(res.error || 'Invalid privilege code');
    } else {
      setCouponCodeInput('');
    }
  };

  const freeShippingThreshold = 5000;
  const progressPercent = Math.min(100, Math.round((cartSubtotal / freeShippingThreshold) * 100));
  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - cartSubtotal);

  // Suggested complementary creations not already in bag
  const currentItemIds = cartItems.map(i => i.productId);
  const complementaryProducts = products
    .filter(p => !currentItemIds.includes(p.id))
    .slice(0, 2);

  const maxRedeemablePoints = user
    ? Math.min(user.loyaltyPoints || 0, Math.floor(cartSubtotal * 0.3))
    : 0;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-[#1C1613]/70 backdrop-blur-sm transition-opacity"
        onClick={() => setIsCartDrawerOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#FAF8F5] border-l border-[#E7E0D6] text-[#1E1714] flex flex-col shadow-2xl">
          {/* Header */}
          <div className="p-6 border-b border-[#E7E0D6] flex items-center justify-between bg-white">
            <div>
              <h2 className="font-serif text-2xl tracking-wide text-[#1E1714]">Shopping Bag</h2>
              <p className="text-xs text-[#8C7A6B] tracking-wider uppercase mt-0.5">
                {cartItems.length} {cartItems.length === 1 ? 'Creation' : 'Creations'} Selected
              </p>
            </div>
            <button
              onClick={() => setIsCartDrawerOpen(false)}
              className="p-2 text-[#8C7A6B] hover:text-[#1E1714] bg-[#F4EFEA] rounded-full transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Complimentary Courier Progress */}
          <div className="bg-[#F4EFEA] px-6 py-3 border-b border-[#E7E0D6]">
            <div className="flex justify-between text-xs tracking-wider uppercase mb-1.5 text-[#5C4F44]">
              <span>
                {remainingForFreeShipping === 0
                  ? 'Complimentary White Glove Courier Unlocked'
                  : `Add ₹${remainingForFreeShipping.toLocaleString('en-IN')} for complimentary courier`}
              </span>
              <span className="font-mono text-[#8C7A6B] font-semibold">{progressPercent}%</span>
            </div>
            <div className="w-full bg-[#E5DDD3] h-1.5 overflow-hidden">
              <div
                className="bg-[#1E1714] h-full transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6 divide-y divide-[#E7E0D6]">
            {cartItems.length === 0 ? (
              <div className="text-center py-16 space-y-4">
                <p className="font-serif text-xl text-[#8C7A6B]">Your shopping bag is presently empty.</p>
                <p className="text-xs text-[#6B5C50] max-w-xs mx-auto leading-relaxed">
                  Explore our curated creations in Haute Parfumerie, Sartorial Wardrobe, and Botanical Skincare.
                </p>
                <button
                  onClick={() => {
                    setIsCartDrawerOpen(false);
                    setCurrentPage('shop');
                  }}
                  className="mt-4 px-6 py-2.5 bg-[#1E1714] hover:bg-[#342721] text-xs uppercase tracking-[0.2em] text-[#FAF8F5] transition-colors cursor-pointer"
                >
                  Explore Catalog
                </button>
              </div>
            ) : (
              <>
                {cartItems.map((item, idx) => (
                  <div key={`${item.productId}_${item.selectedVariant || ''}_${idx}`} className="pt-6 first:pt-0 flex gap-4">
                    {/* Thumbnail */}
                    <div
                      onClick={() => {
                        setSelectedProduct(item.product);
                        setCurrentPage('product-detail');
                        setIsCartDrawerOpen(false);
                      }}
                      className="w-20 h-24 bg-white border border-[#E7E0D6] overflow-hidden shrink-0 cursor-pointer"
                    >
                      <img
                        src={item.product.images[0] || ''}
                        alt={item.product.name}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      />
                    </div>

                    {/* Details */}
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start gap-2">
                          <h3
                            onClick={() => {
                              setSelectedProduct(item.product);
                              setCurrentPage('product-detail');
                              setIsCartDrawerOpen(false);
                            }}
                            className="font-serif text-base text-[#1E1714] hover:text-[#5C4F44] cursor-pointer line-clamp-1 font-medium"
                          >
                            {item.product.name}
                          </h3>
                          <button
                            onClick={() => removeFromCart(item.productId, item.selectedVariant)}
                            className="text-[#8C7A6B] hover:text-[#A86464] p-1 transition-colors"
                            title="Remove creation"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {item.selectedVariant && (
                          <p className="text-xs text-[#8C7A6B] tracking-wider uppercase mt-0.5">
                            {item.selectedVariant}
                          </p>
                        )}

                        <p className="text-xs text-[#8C7A6B] mt-1 font-mono tabular-nums font-semibold">
                          ₹{item.product.price.toLocaleString('en-IN')}
                        </p>
                      </div>

                      {/* Quantity Stepper */}
                      <div className="flex items-center justify-between mt-3 pt-2 border-t border-[#F3EFEA]">
                        <div className="flex items-center border border-[#DCD3C7] bg-white">
                          <button
                            onClick={() =>
                              updateCartQuantity(item.productId, item.quantity - 1, item.selectedVariant)
                            }
                            className="p-1.5 text-[#8C7A6B] hover:text-[#1E1714]"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="px-3 text-xs font-mono tabular-nums text-[#1E1714] font-medium">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              updateCartQuantity(item.productId, item.quantity + 1, item.selectedVariant)
                            }
                            className="p-1.5 text-[#8C7A6B] hover:text-[#1E1714]"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        <span className="font-mono text-sm text-[#1E1714] font-semibold tabular-nums">
                          ₹{(item.product.price * item.quantity).toLocaleString('en-IN')}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Gifting Experience Accordion */}
                <div className="pt-4 border-t border-[#E7E0D6]">
                  <button
                    onClick={() => setShowGiftOptions(!showGiftOptions)}
                    className="w-full flex items-center justify-between text-xs text-[#1E1714] py-1 cursor-pointer font-medium"
                  >
                    <span className="flex items-center gap-1.5">
                      <Gift className="w-4 h-4 text-[#BFA175]" />
                      <span>Bespoke Gifting Service</span>
                    </span>
                    <span className="text-[#8C7A6B] text-[11px] underline">
                      {showGiftOptions ? 'Collapse' : 'Customize'}
                    </span>
                  </button>

                  {showGiftOptions && (
                    <div className="mt-3 p-4 bg-white border border-[#E7E0D6] space-y-3 text-xs animate-in fade-in duration-150">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={giftOptions.giftWrap}
                          onChange={e =>
                            setGiftOptions(prev => ({
                              ...prev,
                              giftWrap: e.target.checked,
                              isGift: e.target.checked || prev.isGift
                            }))
                          }
                          className="accent-[#1E1714]"
                        />
                        <span className="text-[#1E1714]">
                          Luxury Hand-Waxed Presentation Box (+₹350)
                        </span>
                      </label>

                      <div>
                        <label className="block text-[#8C7A6B] text-[11px] uppercase mb-0.5">
                          Recipient Name
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. Lady Clara"
                          value={giftOptions.recipientName}
                          onChange={e =>
                            setGiftOptions(prev => ({ ...prev, recipientName: e.target.value, isGift: true }))
                          }
                          className="w-full bg-[#FAF8F5] border border-[#DCD3C7] px-2.5 py-1.5 text-xs text-[#1E1714]"
                        />
                      </div>

                      <div>
                        <label className="block text-[#8C7A6B] text-[11px] uppercase mb-0.5">
                          Handwritten Calligraphy Card Message
                        </label>
                        <textarea
                          rows={2}
                          placeholder="Compose your personalized wishes..."
                          value={giftOptions.giftMessage}
                          onChange={e =>
                            setGiftOptions(prev => ({ ...prev, giftMessage: e.target.value, isGift: true }))
                          }
                          className="w-full bg-[#FAF8F5] border border-[#DCD3C7] px-2.5 py-1.5 text-xs text-[#1E1714]"
                        />
                      </div>

                      <label className="flex items-center gap-2 cursor-pointer text-[#8C7A6B] text-[11px]">
                        <input
                          type="checkbox"
                          checked={giftOptions.hidePriceOnReceipt}
                          onChange={e =>
                            setGiftOptions(prev => ({ ...prev, hidePriceOnReceipt: e.target.checked }))
                          }
                          className="accent-[#1E1714]"
                        />
                        <span>Conceal acquisition prices on delivery receipt</span>
                      </label>
                    </div>
                  )}
                </div>

                {/* Loyalty Points Redemption (if client logged in) */}
                {user && user.loyaltyPoints > 0 && (
                  <div className="pt-3 border-t border-[#E7E0D6]">
                    <div className="p-3 bg-[#F4EFEA] border border-[#E7E0D6] space-y-2 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-1.5 font-medium text-[#1E1714]">
                          <Coins className="w-4 h-4 text-[#BFA175]" />
                          <span>Nocturne Privilège Points</span>
                        </span>
                        <span className="font-mono text-[#8C7A6B]">
                          {user.loyaltyPoints} available
                        </span>
                      </div>

                      {pointsToRedeem > 0 ? (
                        <div className="flex items-center justify-between text-[#3F6E50] font-medium pt-1">
                          <span>Redeeming {pointsToRedeem} points:</span>
                          <span className="font-mono">-₹{pointsDiscount.toLocaleString('en-IN')}</span>
                          <button
                            onClick={() => setPointsToRedeem(0)}
                            className="text-[11px] text-[#8C7A6B] underline ml-2 cursor-pointer"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setPointsToRedeem(maxRedeemablePoints)}
                          disabled={maxRedeemablePoints === 0}
                          className="w-full py-1.5 bg-white border border-[#DCD3C7] hover:border-[#1E1714] text-[#1E1714] text-[11px] uppercase tracking-wider transition-colors cursor-pointer"
                        >
                          Redeem {maxRedeemablePoints} Points (-₹{maxRedeemablePoints})
                        </button>
                      )}
                    </div>
                  </div>
                )}

                {/* Complementary Creations */}
                {complementaryProducts.length > 0 && (
                  <div className="pt-4 border-t border-[#E7E0D6] space-y-3">
                    <p className="text-[11px] tracking-wider uppercase text-[#8C7A6B] font-medium">
                      Complementary Atelier Pairings
                    </p>
                    <div className="space-y-2">
                      {complementaryProducts.map(p => (
                        <div key={p.id} className="p-2.5 bg-white border border-[#E7E0D6] flex items-center justify-between text-xs">
                          <div className="flex items-center gap-2.5">
                            <img src={p.images[0] || ''} alt="" className="w-10 h-12 object-cover border border-[#E7E0D6]" />
                            <div>
                              <p className="font-serif text-sm text-[#1E1714] line-clamp-1">{p.name}</p>
                              <p className="font-mono text-[#8C7A6B]">₹{p.price.toLocaleString('en-IN')}</p>
                            </div>
                          </div>
                          <button
                            onClick={() => addToCart(p, 1)}
                            className="px-2.5 py-1 bg-[#F4EFEA] hover:bg-[#1E1714] hover:text-white text-[#1E1714] text-[11px] uppercase tracking-wider transition-colors border border-[#DCD3C7]"
                          >
                            + Add
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Footer Checkout Summary */}
          {cartItems.length > 0 && (
            <div className="p-6 bg-white border-t border-[#E7E0D6] space-y-4">
              {/* Coupon Form */}
              {appliedCoupon ? (
                <div className="flex items-center justify-between p-2.5 bg-[#F4EFEA] border border-[#E7E0D6] text-xs">
                  <div className="flex items-center gap-2 text-[#1E1714]">
                    <Tag className="w-3.5 h-3.5 text-[#BFA175]" />
                    <span className="font-mono tracking-wider font-semibold">{appliedCoupon.code}</span>
                    <span className="text-[#8C7A6B]">(-₹{cartDiscount.toLocaleString('en-IN')})</span>
                  </div>
                  <button
                    onClick={removeCoupon}
                    className="text-[#8C7A6B] hover:text-[#1E1714] text-[11px] underline cursor-pointer"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} className="space-y-1">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Privilege Code (e.g. WELCOME10)"
                      value={couponCodeInput}
                      onChange={e => setCouponCodeInput(e.target.value)}
                      className="flex-1 bg-[#FAF8F5] border border-[#DCD3C7] px-3 py-2 text-xs text-[#1E1714] placeholder-[#AAA] uppercase font-mono focus:outline-none focus:border-[#8C7A6B]"
                    />
                    <button
                      type="submit"
                      disabled={isApplyingCoupon}
                      className="px-4 py-2 border border-[#DCD3C7] hover:border-[#1E1714] text-xs uppercase tracking-wider text-[#1E1714] hover:bg-[#FAF8F5] transition-colors cursor-pointer"
                    >
                      Apply
                    </button>
                  </div>
                  {couponError && <p className="text-[11px] text-[#A86464]">{couponError}</p>}
                </form>
              )}

              {/* Subtotal & Taxes */}
              <div className="space-y-1.5 text-xs text-[#8C7A6B] pt-2">
                <div className="flex justify-between">
                  <span>Acquisitions Subtotal</span>
                  <span className="font-mono text-[#1E1714] tabular-nums font-medium">
                    ₹{cartSubtotal.toLocaleString('en-IN')}
                  </span>
                </div>
                {cartDiscount > 0 && (
                  <div className="flex justify-between text-[#8C7A6B]">
                    <span>Privilege Concession</span>
                    <span className="font-mono tabular-nums font-semibold">
                      -₹{cartDiscount.toLocaleString('en-IN')}
                    </span>
                  </div>
                )}
                {pointsDiscount > 0 && (
                  <div className="flex justify-between text-[#3F6E50]">
                    <span>Points Concession</span>
                    <span className="font-mono tabular-nums font-semibold">
                      -₹{pointsDiscount.toLocaleString('en-IN')}
                    </span>
                  </div>
                )}
                {giftWrapFee > 0 && (
                  <div className="flex justify-between text-[#1E1714]">
                    <span>Wax-Sealed Gift Packaging</span>
                    <span className="font-mono tabular-nums">
                      +₹{giftWrapFee.toLocaleString('en-IN')}
                    </span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>White Glove Courier</span>
                  <span className="font-mono text-[#1E1714] tabular-nums">
                    {cartShippingFee === 0 ? 'Complimentary' : `₹${cartShippingFee.toLocaleString('en-IN')}`}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Applicable GST (3%)</span>
                  <span className="font-mono text-[#1E1714] tabular-nums">
                    ₹{cartTax.toLocaleString('en-IN')}
                  </span>
                </div>
                <div className="flex justify-between text-sm text-[#1E1714] font-serif pt-2 border-t border-[#E7E0D6]">
                  <span className="font-normal text-base">Total Amount</span>
                  <span className="font-mono text-[#1E1714] tabular-nums text-lg font-semibold">
                    ₹{cartTotal.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <button
                onClick={() => {
                  setIsCartDrawerOpen(false);
                  setCurrentPage('checkout');
                }}
                className="w-full py-3.5 bg-[#1E1714] text-[#FAF8F5] text-xs font-semibold tracking-[0.2em] uppercase hover:bg-[#342721] transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-lg"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="flex items-center justify-center gap-2 text-[11px] text-[#8C7A6B] pt-1">
                <ShieldCheck className="w-3.5 h-3.5 text-[#BFA175]" />
                <span>Protected with 256-Bit SSL Atelier Encryption</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
