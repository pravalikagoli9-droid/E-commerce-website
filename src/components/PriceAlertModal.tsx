import React, { useState } from 'react';
import type { Product } from '../types';
import { useStore } from '../context/StoreContext';
import { X, Bell, TrendingDown, PackageCheck, CheckCircle2 } from 'lucide-react';

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
    <div className="fixed inset-0 z-50 overflow-y-auto bg-[#1C1613]/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative w-full max-w-md bg-[#FAF8F5] border border-[#E7E0D6] shadow-2xl p-6 sm:p-8 space-y-5 animate-in fade-in zoom-in-95 duration-150">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-[#8C7A6B] hover:text-[#1E1714] bg-[#F4EFEA] rounded-full transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-[#F4EFEA] border border-[#DCD3C7] text-[#1E1714]">
            {type === 'PRICE_DROP' ? (
              <TrendingDown className="w-5 h-5 text-[#8C7A6B]" />
            ) : (
              <PackageCheck className="w-5 h-5 text-[#8C7A6B]" />
            )}
          </div>
          <div>
            <span className="text-[10px] tracking-[0.2em] uppercase text-[#BFA175] font-medium block">
              Concierge Notification
            </span>
            <h3 className="font-serif text-xl text-[#1E1714]">
              {type === 'PRICE_DROP' ? 'Privilege Price Drop Alert' : 'Back-in-Stock Notification'}
            </h3>
          </div>
        </div>

        <div className="p-3 bg-[#F4EFEA] border border-[#E7E0D6] flex items-center gap-3 text-xs">
          <div className="w-12 h-14 bg-white border border-[#E7E0D6] overflow-hidden shrink-0">
            <img src={product.images[0] || ''} alt="" className="w-full h-full object-cover" />
          </div>
          <div>
            <p className="font-serif text-sm text-[#1E1714] line-clamp-1">{product.name}</p>
            <p className="font-mono text-xs text-[#8C7A6B] tabular-nums mt-0.5">
              Current: ₹{product.price.toLocaleString('en-IN')}
            </p>
          </div>
        </div>

        {submitted ? (
          <div className="p-4 bg-[#F0F6F2] border border-[#C6DEC9] text-[#2F5938] text-xs text-center space-y-1">
            <CheckCircle2 className="w-6 h-6 mx-auto text-[#3F6E50]" />
            <p className="font-serif text-base text-[#1E1714]">Notification Inscribed</p>
            <p>We will alert you at {email} the moment this event transpires.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block text-[#8C7A6B] mb-1 uppercase tracking-wider">
                Sanctuary Email Address
              </label>
              <input
                type="email"
                required
                placeholder="client@elixirnoir.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full bg-white border border-[#DCD3C7] px-3.5 py-2.5 text-[#1E1714] placeholder-[#AAA] focus:outline-none focus:border-[#8C7A6B]"
              />
            </div>

            {type === 'PRICE_DROP' && (
              <div>
                <label className="block text-[#8C7A6B] mb-1 uppercase tracking-wider">
                  Target Concession Ceiling (₹ INR)
                </label>
                <input
                  type="number"
                  required
                  value={targetPrice}
                  onChange={e => setTargetPrice(Number(e.target.value))}
                  className="w-full bg-white border border-[#DCD3C7] px-3.5 py-2.5 text-[#1E1714] font-mono focus:outline-none focus:border-[#8C7A6B]"
                />
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 bg-[#1E1714] hover:bg-[#342721] text-[#FAF8F5] text-xs font-semibold tracking-[0.2em] uppercase transition-colors cursor-pointer"
            >
              {isSubmitting ? 'Inscribing Alert...' : 'Register Concierge Alert'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
