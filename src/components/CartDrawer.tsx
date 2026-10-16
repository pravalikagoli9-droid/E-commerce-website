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
  Coins
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { getProductImageUrl, handleImageError } from '../utils/imageUrl';

export const CartDrawer: React.FC = () => {
  const {
    isCartDrawerOpen,
    setIsCartDrawerOpen,
    cartItems,
    updateCartQuantity,
    removeFromCart,
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
      setCouponError(res.error || 'Invalid promo code');
    } else {
      setCouponCodeInput('');
    }
  };

  const freeShippingThreshold = 5000;
  const progressPercent = Math.min(100, Math.round((cartSubtotal / freeShippingThreshold) * 100));
  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - cartSubtotal);

  // Suggested complementary creations not already in cart
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
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-[#392C2A]/60 backdrop-blur-xs transition-opacity"
        onClick={() => setIsCartDrawerOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 28, stiffness: 300 }}
          className="w-screen max-w-md bg-[#FAF7F2] border-l border-[#E8DED4] text-[#392C2A] flex flex-col shadow-2xl"
        >
          {/* Header */}
          <div className="p-6 border-b border-[#E8DED4] flex items-center justify-between bg-[#FFFDF9]">
            <div>
              <h2 className="font-serif text-2xl tracking-wide text-[#392C2A]">Shopping Cart</h2>
              <p className="text-xs text-[#7D6B67] tracking-wider uppercase mt-0.5">
                {cartItems.length} {cartItems.length === 1 ? 'Item' : 'Items'} Selected
              </p>
            </div>
            <button
              onClick={() => setIsCartDrawerOpen(false)}
              className="p-2 text-[#7D6B67] hover:text-[#392C2A] bg-[#FAF7F2] rounded-full transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Complimentary Shipping Progress */}
          <div className="bg-[#FFFDF9] px-6 py-3.5 border-b border-[#E8DED4]">
            <div className="flex justify-between text-xs tracking-wider uppercase mb-1.5 text-[#392C2A]">
              <span className="font-medium">
                {remainingForFreeShipping === 0
                  ? 'Free Shipping Unlocked!'
                  : `Add ₹${remainingForFreeShipping.toLocaleString('en-US')} for Free Shipping`}
              </span>
              <span className="font-mono text-[#C9878D] font-semibold">{progressPercent}%</span>
            </div>
            <div className="w-full bg-[#E8DED4] h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-[#C9878D] h-full transition-all duration-300 rounded-full"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6 divide-y divide-[#E8DED4]">
            {cartItems.length === 0 ? (
              <div className="text-center py-16 space-y-4">
                <p className="font-serif text-xl text-[#7D6B67]">Your cart is currently empty.</p>
                <p className="text-xs text-[#7D6B67] max-w-xs mx-auto leading-relaxed">
                  Discover our luxury fragrances, botanical skincare, and lifestyle essentials.
                </p>
                <button
                  onClick={() => {
                    setIsCartDrawerOpen(false);
                    setCurrentPage('shop');
                  }}
                  className="mt-4 px-6 py-2.5 bg-[#C9878D] hover:bg-[#B56F75] text-xs uppercase tracking-[0.2em] text-white transition-colors cursor-pointer rounded-sm shadow-xs font-semibold"
                >
                  Shop Now
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
                      className="w-20 h-24 bg-[#FFFDF9] border border-[#E8DED4] overflow-hidden shrink-0 cursor-pointer rounded-sm"
                    >
                      <img
                        src={getProductImageUrl(item.product.images?.[0])}
                        alt={item.product.name}
                        referrerPolicy="no-referrer"
                        onError={handleImageError}
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
                            className="font-serif text-base text-[#392C2A] hover:text-[#C9878D] cursor-pointer line-clamp-1 font-medium"
                          >
                            {item.product.name}
                          </h3>
                          <button
                            onClick={() => removeFromCart(item.productId, item.selectedVariant)}
                            className="text-[#7D6B67] hover:text-[#D97979] p-1 transition-colors cursor-pointer"
                            title="Remove item"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {item.selectedVariant && (
                          <p className="text-xs text-[#7D6B67] tracking-wider uppercase mt-0.5">
                            {item.selectedVariant}
                          </p>
                        )}

                        <p className="text-xs text-[#392C2A] mt-1 font-mono tabular-nums font-semibold">
                          ₹{item.product.price.toLocaleString('en-US')}
                        </p>
                      </div>

                      {/* Quantity Stepper */}
                      <div className="flex items-center justify-between mt-3 pt-2 border-t border-[#E8DED4]">
                        <div className="flex items-center border border-[#E8DED4] bg-[#FFFDF9] rounded-sm">
                          <button
                            onClick={() =>
                              updateCartQuantity(item.productId, item.quantity - 1, item.selectedVariant)
                            }
                            className="p-1.5 text-[#7D6B67] hover:text-[#392C2A] cursor-pointer"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="px-3 text-xs font-mono tabular-nums text-[#392C2A] font-semibold">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              updateCartQuantity(item.productId, item.quantity + 1, item.selectedVariant)
                            }
                            className="p-1.5 text-[#7D6B67] hover:text-[#392C2A] cursor-pointer"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        <span className="font-mono text-sm text-[#392C2A] font-semibold tabular-nums">
                          ₹{(item.product.price * item.quantity).toLocaleString('en-US')}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Gifting Options */}
                <div className="pt-4 border-t border-[#E8DED4]">
                  <button
                    onClick={() => setShowGiftOptions(!showGiftOptions)}
                    className="w-full flex items-center justify-between text-xs text-[#392C2A] py-1 cursor-pointer font-medium"
                  >
                    <span className="flex items-center gap-1.5">
                      <Gift className="w-4 h-4 text-[#C9878D]" />
                      <span>Gift Options & Gift Wrapping</span>
                    </span>
                    <span className="text-[#C9878D] text-[11px] underline">
                      {showGiftOptions ? 'Hide' : 'Add Gift Options'}
                    </span>
                  </button>

                  {showGiftOptions && (
                    <div className="mt-3 p-4 bg-[#FFFDF9] border border-[#E8DED4] space-y-3 text-xs rounded-sm">
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
                          className="accent-[#C9878D]"
                        />
                        <span className="text-[#392C2A] font-medium">
                          Signature Gift Box & Ribbon Wrapping (+₹350)
                        </span>
                      </label>

                      <div>
                        <label className="block text-[#7D6B67] text-[11px] uppercase mb-0.5">
                          Recipient Name
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. Clara Vance"
                          value={giftOptions.recipientName}
                          onChange={e =>
                            setGiftOptions(prev => ({ ...prev, recipientName: e.target.value, isGift: true }))
                          }
                          className="w-full bg-[#FAF7F2] border border-[#E8DED4] px-2.5 py-1.5 text-xs text-[#392C2A] rounded-sm focus:border-[#C9878D]"
                        />
                      </div>

                      <div>
                        <label className="block text-[#7D6B67] text-[11px] uppercase mb-0.5">
                          Personalized Gift Message
                        </label>
                        <textarea
                          rows={2}
                          placeholder="Write your personal gift message..."
                          value={giftOptions.giftMessage}
                          onChange={e =>
                            setGiftOptions(prev => ({ ...prev, giftMessage: e.target.value, isGift: true }))
                          }
                          className="w-full bg-[#FAF7F2] border border-[#E8DED4] px-2.5 py-1.5 text-xs text-[#392C2A] rounded-sm focus:border-[#C9878D]"
                        />
                      </div>

                      <label className="flex items-center gap-2 cursor-pointer text-[#7D6B67] text-[11px]">
                        <input
                          type="checkbox"
                          checked={giftOptions.hidePriceOnReceipt}
                          onChange={e =>
                            setGiftOptions(prev => ({ ...prev, hidePriceOnReceipt: e.target.checked }))
                          }
                          className="accent-[#C9878D]"
                        />
                        <span>Hide prices on the gift receipt</span>
                      </label>
                    </div>
                  )}
                </div>

                {/* Loyalty Points Redemption */}
                {user && user.loyaltyPoints > 0 && (
                  <div className="pt-3 border-t border-[#E8DED4]">
                    <div className="p-3 bg-[#FFFDF9] border border-[#E8DED4] space-y-2 text-xs rounded-sm">
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-1.5 font-medium text-[#392C2A]">
                          <Coins className="w-4 h-4 text-[#D6B77A]" />
                          <span>Member Reward Points</span>
                        </span>
                        <span className="font-mono text-[#7D6B67]">
                          {user.loyaltyPoints} available
                        </span>
                      </div>

                      {pointsToRedeem > 0 ? (
                        <div className="flex items-center justify-between text-[#3E7B54] font-medium pt-1">
                          <span>Redeeming {pointsToRedeem} points:</span>
                          <span className="font-mono">-₹{pointsDiscount.toLocaleString('en-US')}</span>
                          <button
                            onClick={() => setPointsToRedeem(0)}
                            className="text-[11px] text-[#7D6B67] underline ml-2 cursor-pointer"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setPointsToRedeem(maxRedeemablePoints)}
                          disabled={maxRedeemablePoints === 0}
                          className="w-full py-1.5 bg-[#FAF7F2] border border-[#E8DED4] hover:border-[#C9878D] text-[#392C2A] text-[11px] uppercase tracking-wider transition-colors cursor-pointer rounded-sm"
                        >
                          Redeem {maxRedeemablePoints} Points (-₹{maxRedeemablePoints})
                        </button>
                      )}
                    </div>
                  </div>
                )}

                {/* You May Also Like */}
                {complementaryProducts.length > 0 && (
                  <div className="pt-4 border-t border-[#E8DED4] space-y-3">
                    <p className="text-[11px] tracking-wider uppercase text-[#7D6B67] font-semibold">
                      You May Also Like
                    </p>
                    <div className="space-y-2">
                      {complementaryProducts.map(p => (
                        <div key={p.id} className="p-2.5 bg-[#FFFDF9] border border-[#E8DED4] flex items-center justify-between text-xs rounded-sm">
                          <div className="flex items-center gap-2.5">
                            <img
                              src={getProductImageUrl(p.images?.[0])}
                              alt={p.name}
                              onError={handleImageError}
                              className="w-10 h-12 object-cover border border-[#E8DED4] rounded-xs"
                            />
                            <div>
                              <p className="font-serif text-sm text-[#392C2A] line-clamp-1">{p.name}</p>
                              <p className="font-mono text-[#7D6B67]">₹{p.price.toLocaleString('en-US')}</p>
                            </div>
                          </div>
                          <button
                            onClick={() => addToCart(p, 1)}
                            className="px-3 py-1 bg-[#E8D8C8] hover:bg-[#DECABE] text-[#392C2A] text-[11px] uppercase tracking-wider transition-colors border border-[#E8DED4] rounded-xs font-semibold cursor-pointer"
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
            <div className="p-6 bg-[#FFFDF9] border-t border-[#E8DED4] space-y-4">
              {/* Promo Code Form */}
              {appliedCoupon ? (
                <div className="flex items-center justify-between p-2.5 bg-[#FAF7F2] border border-[#E8DED4] text-xs rounded-sm">
                  <div className="flex items-center gap-2 text-[#392C2A]">
                    <Tag className="w-3.5 h-3.5 text-[#C9878D]" />
                    <span className="font-mono tracking-wider font-semibold">{appliedCoupon.code}</span>
                    <span className="text-[#C9878D] font-medium">(-₹{cartDiscount.toLocaleString('en-US')})</span>
                  </div>
                  <button
                    onClick={removeCoupon}
                    className="text-[#7D6B67] hover:text-[#392C2A] text-[11px] underline cursor-pointer"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} className="space-y-1">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Promo Code (e.g. WELCOME10)"
                      value={couponCodeInput}
                      onChange={e => setCouponCodeInput(e.target.value)}
                      className="flex-1 bg-[#FAF7F2] border border-[#E8DED4] px-3 py-2 text-xs text-[#392C2A] placeholder-[#998] uppercase font-mono focus:outline-none focus:border-[#C9878D] rounded-sm"
                    />
                    <button
                      type="submit"
                      disabled={isApplyingCoupon}
                      className="px-4 py-2 border border-[#E8DED4] bg-[#E8D8C8] hover:bg-[#DECABE] text-xs uppercase tracking-wider text-[#392C2A] transition-colors cursor-pointer rounded-sm font-semibold"
                    >
                      Apply
                    </button>
                  </div>
                  {couponError && <p className="text-[11px] text-[#D97979]">{couponError}</p>}
                </form>
              )}

              {/* Subtotal & Taxes */}
              <div className="space-y-1.5 text-xs text-[#7D6B67] pt-2">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-mono text-[#392C2A] tabular-nums font-medium">
                    ₹{cartSubtotal.toLocaleString('en-US')}
                  </span>
                </div>
                {cartDiscount > 0 && (
                  <div className="flex justify-between text-[#C9878D]">
                    <span>Promo Discount</span>
                    <span className="font-mono tabular-nums font-semibold">
                      -₹{cartDiscount.toLocaleString('en-US')}
                    </span>
                  </div>
                )}
                {pointsDiscount > 0 && (
                  <div className="flex justify-between text-[#3E7B54]">
                    <span>Points Redeemed</span>
                    <span className="font-mono tabular-nums font-semibold">
                      -₹{pointsDiscount.toLocaleString('en-US')}
                    </span>
                  </div>
                )}
                {giftWrapFee > 0 && (
                  <div className="flex justify-between text-[#392C2A]">
                    <span>Gift Packaging</span>
                    <span className="font-mono tabular-nums">
                      +₹{giftWrapFee.toLocaleString('en-US')}
                    </span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span className="font-mono text-[#392C2A] tabular-nums">
                    {cartShippingFee === 0 ? 'Free' : `₹${cartShippingFee.toLocaleString('en-US')}`}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Estimated Tax (3%)</span>
                  <span className="font-mono text-[#392C2A] tabular-nums">
                    ₹{cartTax.toLocaleString('en-US')}
                  </span>
                </div>
                <div className="flex justify-between text-sm text-[#392C2A] font-serif pt-2 border-t border-[#E8DED4]">
                  <span className="font-normal text-base">Estimated Total</span>
                  <span className="font-mono text-[#392C2A] tabular-nums text-lg font-bold">
                    ₹{cartTotal.toLocaleString('en-US')}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <button
                onClick={() => {
                  setIsCartDrawerOpen(false);
                  setCurrentPage('checkout');
                }}
                className="w-full py-3.5 bg-[#C9878D] hover:bg-[#B56F75] text-white text-xs font-semibold tracking-[0.2em] uppercase transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-md rounded-sm"
              >
                <span>Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="flex items-center justify-center gap-2 text-[11px] text-[#7D6B67] pt-1">
                <ShieldCheck className="w-3.5 h-3.5 text-[#C9878D]" />
                <span>Secure 256-Bit SSL Checkout</span>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};
