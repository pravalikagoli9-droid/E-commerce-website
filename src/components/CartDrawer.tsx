import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { X, Plus, Minus, Trash2, ArrowRight, ShieldCheck, Tag } from 'lucide-react';

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
    cartSubtotal,
    cartDiscount,
    cartShippingFee,
    cartTax,
    cartTotal,
    setCurrentPage,
    setSelectedProduct
  } = useStore();

  const [couponCodeInput, setCouponCodeInput] = useState('');
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);
  const [couponError, setCouponError] = useState<string | null>(null);

  if (!isCartDrawerOpen) return null;

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCodeInput.trim()) return;
    setIsApplyingCoupon(true);
    setCouponError(null);
    const res = await applyCoupon(couponCodeInput.trim());
    setIsApplyingCoupon(false);
    if (!res.success) {
      setCouponError(res.error || 'Invalid code');
    } else {
      setCouponCodeInput('');
    }
  };

  const freeShippingThreshold = 5000;
  const progressPercent = Math.min(100, Math.round((cartSubtotal / freeShippingThreshold) * 100));
  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - cartSubtotal);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
        onClick={() => setIsCartDrawerOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#0A0A0A] border-l border-[#222222] text-[#F0ECE8] flex flex-col shadow-2xl">
          {/* Header */}
          <div className="p-6 border-b border-[#1F1F1F] flex items-center justify-between">
            <div>
              <h2 className="font-serif text-2xl tracking-wide text-[#FFFFFF]">Shopping Bag</h2>
              <p className="text-xs text-[#8A857D] tracking-wider uppercase mt-0.5">
                {cartItems.length} {cartItems.length === 1 ? 'Creation' : 'Creations'} Selected
              </p>
            </div>
            <button
              onClick={() => setIsCartDrawerOpen(false)}
              className="p-2 text-[#8A857D] hover:text-[#FFFFFF] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Complimentary Shipping Progress */}
          <div className="bg-[#121212] px-6 py-3 border-b border-[#1F1F1F]">
            <div className="flex justify-between text-xs tracking-wider uppercase mb-1.5 text-[#B5B0A8]">
              <span>
                {remainingForFreeShipping === 0
                  ? 'Complimentary White Glove Delivery Unlocked'
                  : `Add ₹${remainingForFreeShipping.toLocaleString('en-IN')} for complimentary delivery`}
              </span>
              <span className="font-mono text-[#C5A880]">{progressPercent}%</span>
            </div>
            <div className="w-full bg-[#222] h-1 rounded-full overflow-hidden">
              <div
                className="bg-[#C5A880] h-full transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6 divide-y divide-[#1A1A1A]">
            {cartItems.length === 0 ? (
              <div className="text-center py-16 space-y-4">
                <p className="font-serif text-xl text-[#7A756D]">Your bag is presently empty.</p>
                <p className="text-xs text-[#5A5650] max-w-xs mx-auto leading-relaxed">
                  Explore our curated creations in Haute Parfumerie, Sartorial Wardrobe, and Botanical Skincare.
                </p>
                <button
                  onClick={() => {
                    setIsCartDrawerOpen(false);
                    setCurrentPage('shop');
                  }}
                  className="mt-4 px-6 py-2.5 border border-[#333] hover:border-[#666] text-xs uppercase tracking-[0.2em] text-[#CCC] hover:text-white transition-colors"
                >
                  Explore Catalog
                </button>
              </div>
            ) : (
              cartItems.map((item, idx) => (
                <div key={`${item.productId}_${item.selectedVariant || ''}_${idx}`} className="pt-6 first:pt-0 flex gap-4">
                  {/* Thumbnail */}
                  <div
                    onClick={() => {
                      setSelectedProduct(item.product);
                      setCurrentPage('product-detail');
                      setIsCartDrawerOpen(false);
                    }}
                    className="w-20 h-24 bg-[#141414] border border-[#242424] overflow-hidden shrink-0 cursor-pointer"
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
                          className="font-serif text-base text-[#F0ECE8] hover:text-[#FFFFFF] cursor-pointer line-clamp-1"
                        >
                          {item.product.name}
                        </h3>
                        <button
                          onClick={() => removeFromCart(item.productId, item.selectedVariant)}
                          className="text-[#666] hover:text-[#A86464] p-1 transition-colors"
                          title="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {item.selectedVariant && (
                        <p className="text-xs text-[#8A857D] tracking-wider uppercase mt-0.5">
                          {item.selectedVariant}
                        </p>
                      )}

                      <p className="text-xs text-[#C5A880] mt-1 font-mono tabular-nums">
                        ₹{item.product.price.toLocaleString('en-IN')}
                      </p>
                    </div>

                    {/* Quantity Stepper */}
                    <div className="flex items-center justify-between mt-3 pt-2 border-t border-[#181818]">
                      <div className="flex items-center border border-[#262626] bg-[#0F0F0F]">
                        <button
                          onClick={() =>
                            updateCartQuantity(item.productId, item.quantity - 1, item.selectedVariant)
                          }
                          className="p-1.5 text-[#888] hover:text-white transition-colors"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-3 text-xs font-mono tabular-nums text-[#D1CCC4]">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateCartQuantity(item.productId, item.quantity + 1, item.selectedVariant)
                          }
                          className="p-1.5 text-[#888] hover:text-white transition-colors"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <span className="font-mono text-sm text-[#F0ECE8] tabular-nums">
                        ₹{(item.product.price * item.quantity).toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer Checkout Summary */}
          {cartItems.length > 0 && (
            <div className="p-6 bg-[#0E0E0E] border-t border-[#1F1F1F] space-y-4">
              {/* Coupon Form */}
              {appliedCoupon ? (
                <div className="flex items-center justify-between p-2.5 bg-[#171717] border border-[#2B2B2B] text-xs">
                  <div className="flex items-center gap-2 text-[#C5A880]">
                    <Tag className="w-3.5 h-3.5" />
                    <span className="font-mono tracking-wider">{appliedCoupon.code}</span>
                    <span className="text-[#999]">(-₹{cartDiscount.toLocaleString('en-IN')})</span>
                  </div>
                  <button
                    onClick={removeCoupon}
                    className="text-[#888] hover:text-white text-[11px] underline"
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
                      className="flex-1 bg-[#141414] border border-[#2B2B2B] px-3 py-2 text-xs text-white placeholder-[#555] uppercase font-mono focus:outline-none focus:border-[#C5A880]"
                    />
                    <button
                      type="submit"
                      disabled={isApplyingCoupon}
                      className="px-4 py-2 border border-[#333] hover:border-[#666] text-xs uppercase tracking-wider text-[#CCC] hover:text-white transition-colors"
                    >
                      Apply
                    </button>
                  </div>
                  {couponError && <p className="text-[11px] text-[#A86464]">{couponError}</p>}
                </form>
              )}

              {/* Subtotal & Taxes */}
              <div className="space-y-1.5 text-xs text-[#8A857D] pt-2">
                <div className="flex justify-between">
                  <span>Acquisitions Subtotal</span>
                  <span className="font-mono text-[#CCC] tabular-nums">
                    ₹{cartSubtotal.toLocaleString('en-IN')}
                  </span>
                </div>
                {cartDiscount > 0 && (
                  <div className="flex justify-between text-[#C5A880]">
                    <span>Boutique Privilege</span>
                    <span className="font-mono tabular-nums">
                      -₹{cartDiscount.toLocaleString('en-IN')}
                    </span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>White Glove Shipping</span>
                  <span className="font-mono text-[#CCC] tabular-nums">
                    {cartShippingFee === 0 ? 'Complimentary' : `₹${cartShippingFee.toLocaleString('en-IN')}`}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Applicable GST (3%)</span>
                  <span className="font-mono text-[#CCC] tabular-nums">
                    ₹{cartTax.toLocaleString('en-IN')}
                  </span>
                </div>
                <div className="flex justify-between text-sm text-[#FFFFFF] font-serif pt-2 border-t border-[#1C1C1C]">
                  <span>Total Amount</span>
                  <span className="font-mono text-[#C5A880] tabular-nums text-base">
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
                className="w-full py-3.5 bg-[#F0ECE8] text-[#000000] text-xs font-semibold tracking-[0.2em] uppercase hover:bg-white transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-lg"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="flex items-center justify-center gap-2 text-[11px] text-[#666] pt-1">
                <ShieldCheck className="w-3.5 h-3.5 text-[#C5A880]" />
                <span>Protected with 256-Bit SSL Atelier Encryption</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
