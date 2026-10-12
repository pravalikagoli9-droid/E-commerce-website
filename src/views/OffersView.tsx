import React, { useState, useEffect } from 'react';
import type { Coupon } from '../types';
import { useStore } from '../context/StoreContext';
import { Tag, Sparkles, Copy, Check, ArrowRight, ShieldCheck, Clock } from 'lucide-react';

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
    showToast(`Privilege code "${code}" copied to clipboard.`, 'success');
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
      <div className="text-center space-y-4 max-w-2xl mx-auto border-b border-[#E7E0D6] pb-8">
        <div className="w-12 h-12 bg-[#F4EFEA] border border-[#DCD3C7] rounded-full flex items-center justify-center mx-auto text-[#1E1714]">
          <Tag className="w-6 h-6 text-[#8C7A6B]" />
        </div>
        <span className="text-xs tracking-[0.3em] uppercase text-[#8C7A6B] font-semibold block">
          Patron Privileges
        </span>
        <h1 className="font-serif text-3xl sm:text-5xl text-[#1E1714] font-normal">
          Active Concessions & Codes
        </h1>
        <p className="text-xs sm:text-sm text-[#5C4F44] leading-relaxed">
          Authentic atelier privileges for esteemed collectors, maiden acquisitions, and festive seasonal edits. Apply directly to your bag or enter at checkout.
        </p>
      </div>

      {/* Coupons List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {coupons.map(coupon => (
          <div
            key={coupon.id}
            className="p-6 bg-white border border-[#E7E0D6] shadow-sm hover:border-[#8C7A6B] transition-all space-y-4 flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs uppercase px-2.5 py-1 bg-[#F4EFEA] border border-[#DCD3C7] text-[#1E1714] font-semibold tracking-wider">
                  {coupon.code}
                </span>
                <span className="text-xs font-mono text-[#8C7A6B]">
                  Valid until {coupon.expiryDate}
                </span>
              </div>

              <h3 className="font-serif text-2xl text-[#1E1714]">
                {coupon.discountType === 'PERCENT'
                  ? `${coupon.discountValue}% Concession`
                  : `₹${coupon.discountValue.toLocaleString('en-IN')} Off`}
              </h3>

              <p className="text-xs text-[#5C4F44] leading-relaxed">
                {coupon.description || 'Special boutique patronage concession code.'}
              </p>

              <div className="text-[11px] text-[#8C7A6B] space-y-1 pt-1 border-t border-[#F3EFEA]">
                <p>• Minimum acquisition threshold: <strong>₹{coupon.minOrder.toLocaleString('en-IN')}</strong></p>
                {coupon.maxDiscount && (
                  <p>• Maximum concession cap: <strong>₹{coupon.maxDiscount.toLocaleString('en-IN')}</strong></p>
                )}
                <p>• Applicable across all Haute Parfumerie, Sartorial, and Botanical creations.</p>
              </div>
            </div>

            <div className="pt-4 flex items-center gap-3">
              <button
                onClick={() => handleCopy(coupon.code)}
                className="flex-1 py-2 border border-[#DCD3C7] hover:border-[#1E1714] text-xs uppercase tracking-wider text-[#1E1714] flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                {copiedCode === coupon.code ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-[#3F6E50]" />
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
                className="py-2 px-4 bg-[#1E1714] hover:bg-[#342721] text-[#FAF8F5] text-xs uppercase tracking-wider font-semibold transition-colors cursor-pointer"
              >
                Apply & Shop
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Free Shipping & Policy Note */}
      <div className="p-6 bg-[#F4EFEA] border border-[#E7E0D6] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#5C4F44]">
        <div className="flex items-center gap-3">
          <ShieldCheck className="w-5 h-5 text-[#8C7A6B] shrink-0" />
          <div>
            <p className="font-serif text-sm text-[#1E1714] font-medium">Automatic Complimentary Delivery</p>
            <p>Orders exceeding ₹5,000 receive complimentary White Glove Courier transit without requiring a code.</p>
          </div>
        </div>

        <button
          onClick={() => setCurrentPage('shop')}
          className="px-5 py-2.5 bg-white border border-[#DCD3C7] hover:border-[#1E1714] text-[#1E1714] uppercase tracking-wider text-xs transition-colors shrink-0 cursor-pointer"
        >
          Explore Catalog
        </button>
      </div>
    </div>
  );
};
