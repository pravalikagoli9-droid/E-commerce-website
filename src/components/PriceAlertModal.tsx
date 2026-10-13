import React, { useState } from 'react';
import type { Product } from '../types';
import { useStore } from '../context/StoreContext';
import { X, TrendingDown, PackageCheck, CheckCircle2 } from 'lucide-react';

interface PriceAlertModalProps {
  product: Product;
  type: 'PRICE_DROP' | 'BACK_IN_STOCK';
  onClose: () => void;
}

export const PriceAlertModal: React.FC<PriceAlertModalProps> = ({ product, type, onClose }) => {
  const { user, subscribeAlert } = useStore();
  const [email, setEmail] = useState(user?.email || '');
  const [targetPrice, setTargetPrice] = useState(
    type === 'PRICE_DROP' ? Math.round(product.price * 0.9) : product.price
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) return;
    setIsSubmitting(true);
    const success = await subscribeAlert(
      product.id,
      product.name,
      email,
      type,
      type === 'PRICE_DROP' ? targetPrice : undefined
    );
    setIsSubmitting(false);
    if (success) {
      setSubmitted(true);
      setTimeout(() => {
        onClose();
      }, 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-[#392C2A]/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="relative w-full max-w-md bg-[#FAF7F2] border border-[#E8DED4] shadow-2xl p-6 sm:p-8 space-y-5 rounded-sm animate-in fade-in zoom-in-95 duration-150">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-[#7D6B67] hover:text-[#392C2A] bg-[#FFFDF9] border border-[#E8DED4] rounded-full transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-[#E8D8C8] border border-[#E8DED4] text-[#392C2A] rounded-xs">
            {type === 'PRICE_DROP' ? (
              <TrendingDown className="w-5 h-5 text-[#C9878D]" />
            ) : (
              <PackageCheck className="w-5 h-5 text-[#C9878D]" />
            )}
          </div>
          <div>
            <span className="text-[10px] tracking-[0.2em] uppercase text-[#C9878D] font-semibold block">
              Notifications
            </span>
            <h3 className="font-serif text-xl text-[#392C2A]">
              {type === 'PRICE_DROP' ? 'Price Drop Alert' : 'Back-in-Stock Notification'}
            </h3>
          </div>
        </div>

        <div className="p-3 bg-[#FFFDF9] border border-[#E8DED4] flex items-center gap-3 text-xs rounded-sm">
          <div className="w-12 h-14 bg-[#FAF7F2] border border-[#E8DED4] overflow-hidden shrink-0 rounded-xs">
            <img src={product.images[0] || ''} alt="" className="w-full h-full object-cover" />
          </div>
          <div>
            <p className="font-serif text-sm text-[#392C2A] font-medium line-clamp-1">{product.name}</p>
            <p className="font-mono text-xs text-[#7D6B67] tabular-nums mt-0.5">
              Current: ₹{product.price.toLocaleString('en-US')}
            </p>
          </div>
        </div>

        {submitted ? (
          <div className="p-4 bg-[#FAF7F2] border border-[#3E7B54] text-[#3E7B54] text-xs text-center space-y-1 rounded-sm">
            <CheckCircle2 className="w-6 h-6 mx-auto text-[#3E7B54]" />
            <p className="font-serif text-base text-[#392C2A] font-medium">Alert Created</p>
            <p className="text-[#7D6B67]">We will notify you at {email} as soon as this item reaches your price.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block text-[#7D6B67] mb-1 font-semibold uppercase">
                Email Address
              </label>
              <input
                type="email"
                required
                placeholder="name@example.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full bg-[#FFFDF9] border border-[#E8DED4] px-3.5 py-2.5 text-[#392C2A] placeholder-[#998] focus:outline-none focus:border-[#C9878D] rounded-sm"
              />
            </div>

            {type === 'PRICE_DROP' && (
              <div>
                <label className="block text-[#7D6B67] mb-1 font-semibold uppercase">
                  Target Price (₹ INR)
                </label>
                <input
                  type="number"
                  required
                  value={targetPrice}
                  onChange={e => setTargetPrice(Number(e.target.value))}
                  className="w-full bg-[#FFFDF9] border border-[#E8DED4] px-3.5 py-2.5 text-[#392C2A] font-mono focus:outline-none focus:border-[#C9878D] rounded-sm"
                />
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 bg-[#C9878D] hover:bg-[#B56F75] text-white text-xs font-semibold tracking-[0.2em] uppercase transition-colors cursor-pointer rounded-sm shadow-xs"
            >
              {isSubmitting ? 'Creating Alert...' : 'Set Notification Alert'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
