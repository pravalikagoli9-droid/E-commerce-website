import React, { useState, useEffect } from 'react';
import type { Coupon } from '../types';
import { useStore } from '../context/StoreContext';
import { Tag, Copy, Check, ShieldCheck } from 'lucide-react';

export const OffersView: React.FC = () => {
  const { applyCoupon, setCurrentPage, showToast } = useStore();
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/coupons')
      .then(res => res.json())
      .then(data => setCoupons(data.coupons || []))
      .catch(console.error);
  }, []);

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    showToast(`Promo code "${code}" copied to clipboard.`, 'success');
    setTimeout(() => setCopiedCode(null), 3000);
  };

  const handleApplyDirect = async (code: string) => {
    const res = await applyCoupon(code);
    if (res.success) {
      setCurrentPage('shop');
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Editorial Header */}
      <div className="text-center space-y-4 max-w-2xl mx-auto border-b border-[#E8DED4] pb-8">
        <div className="w-12 h-12 bg-[#E8D8C8] border border-[#E8DED4] rounded-full flex items-center justify-center mx-auto text-[#392C2A]">
          <Tag className="w-6 h-6 text-[#C9878D]" />
        </div>
        <span className="text-xs tracking-[0.3em] uppercase text-[#C9878D] font-semibold block">
          Special Offers & Rewards
        </span>
        <h1 className="font-serif text-3xl sm:text-5xl text-[#392C2A] font-normal">
          Active Promo Codes & Discounts
        </h1>
        <p className="text-xs sm:text-sm text-[#7D6B67] leading-relaxed">
          Authentic promotional offers for first-time shoppers and seasonal collections. Apply directly to your cart or copy and paste at checkout.
        </p>
      </div>

      {/* Coupons List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {coupons.map(coupon => (
          <div
            key={coupon.id}
            className="p-6 bg-[#FFFDF9] border border-[#E8DED4] shadow-xs hover:border-[#C9878D] transition-all space-y-4 flex flex-col justify-between rounded-sm"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs uppercase px-2.5 py-1 bg-[#FAF7F2] border border-[#E8DED4] text-[#392C2A] font-semibold tracking-wider rounded-xs">
                  {coupon.code}
                </span>
                <span className="text-xs font-mono text-[#7D6B67]">
                  Valid until {coupon.expiryDate}
                </span>
              </div>

              <h3 className="font-serif text-2xl text-[#392C2A] font-medium">
                {coupon.discountType === 'PERCENT'
                  ? `${coupon.discountValue}% Off`
                  : `₹${coupon.discountValue.toLocaleString('en-US')} Off`}
              </h3>

              <p className="text-xs text-[#7D6B67] leading-relaxed">
                {coupon.description || 'Special boutique promotional code.'}
              </p>

              <div className="text-[11px] text-[#7D6B67] space-y-1 pt-2 border-t border-[#E8DED4]">
                <p>• Minimum order amount: <strong>₹{coupon.minOrder.toLocaleString('en-US')}</strong></p>
                {coupon.maxDiscount && (
                  <p>• Maximum discount: <strong>₹{coupon.maxDiscount.toLocaleString('en-US')}</strong></p>
                )}
                <p>• Valid across all fragrances, skincare, and lifestyle essentials.</p>
              </div>
            </div>

            <div className="pt-4 flex items-center gap-3">
              <button
                onClick={() => handleCopy(coupon.code)}
                className="flex-1 py-2 border border-[#E8DED4] hover:border-[#C9878D] text-xs uppercase tracking-wider text-[#392C2A] flex items-center justify-center gap-1.5 transition-colors cursor-pointer rounded-xs"
              >
                {copiedCode === coupon.code ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-[#3E7B54]" />
                    <span>Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Code</span>
                  </>
                )}
              </button>

              <button
                onClick={() => handleApplyDirect(coupon.code)}
                className="py-2 px-4 bg-[#C9878D] hover:bg-[#B56F75] text-white text-xs uppercase tracking-wider font-semibold transition-colors cursor-pointer rounded-xs shadow-xs"
              >
                Apply & Shop
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Free Shipping & Policy Note */}
      <div className="p-6 bg-[#E8D8C8]/40 border border-[#E8DED4] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#7D6B67] rounded-sm">
        <div className="flex items-center gap-3">
          <ShieldCheck className="w-5 h-5 text-[#C9878D] shrink-0" />
          <div>
            <p className="font-serif text-sm text-[#392C2A] font-semibold">Automatic Complimentary Delivery</p>
            <p>All orders over ₹5,000 receive complimentary express shipping automatically at checkout without requiring a code.</p>
          </div>
        </div>

        <button
          onClick={() => setCurrentPage('shop')}
          className="px-5 py-2.5 bg-[#FFFDF9] border border-[#E8DED4] hover:border-[#C9878D] text-[#392C2A] uppercase tracking-wider text-xs font-semibold transition-colors shrink-0 cursor-pointer rounded-xs"
        >
          Shop Now
        </button>
      </div>
    </div>
  );
};
