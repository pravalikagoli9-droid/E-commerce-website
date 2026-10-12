import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { ProductCard } from '../components/ProductCard';
import { Gift, Sparkles, CheckCircle2, ArrowRight, Package, HeartHandshake, ShieldCheck } from 'lucide-react';

export const GiftingView: React.FC = () => {
  const { products, setCurrentPage, giftOptions, setGiftOptions, showToast } = useStore();
  const [selectedOccasion, setSelectedOccasion] = useState<string>('All Occasions');

  const occasions = [
    'All Occasions',
    'Weddings & Unions',
    'Executive Milestones',
    'Self-Care Sanctuaries',
    'Festive Soirées',
    'Anniversaries'
  ];

  const giftProducts = products.filter(p => {
    if (selectedOccasion === 'All Occasions') return p.isGiftPick;
    if (p.occasions) {
      return p.occasions.some(o => o.toLowerCase().includes(selectedOccasion.toLowerCase().split(' ')[0]));
    }
    return p.isGiftPick;
  });

  const handleEnableGifting = () => {
    setGiftOptions(prev => ({ ...prev, isGift: true, giftWrap: true }));
    showToast('Bespoke wax-sealed presentation box added to your gifting preferences.', 'success');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      {/* Editorial Header */}
      <div className="text-center space-y-4 max-w-3xl mx-auto border-b border-[#E7E0D6] pb-10">
        <div className="w-12 h-12 bg-[#F4EFEA] border border-[#DCD3C7] rounded-full flex items-center justify-center mx-auto text-[#1E1714]">
          <Gift className="w-6 h-6 text-[#8C7A6B]" />
        </div>
        <span className="text-xs tracking-[0.3em] uppercase text-[#8C7A6B] font-semibold block">
          The Gifting Salon
        </span>
        <h1 className="font-serif text-3xl sm:text-5xl text-[#1E1714] font-normal [text-wrap:balance]">
          Artisanal Gestures of Distinction
        </h1>
        <p className="text-xs sm:text-sm text-[#5C4F44] leading-relaxed">
          Curated formulations and sartorial treasures designed for profound moments. Every gift is hand-wrapped in noir paper, secured with gold-embossed wax seals, and accompanied by a custom calligraphy card.
        </p>
      </div>

      {/* 3 Brand Gifting Hallmarks */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 p-8 bg-white border border-[#E7E0D6] text-xs">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-[#1E1714] font-medium font-serif text-base">
            <Package className="w-4 h-4 text-[#8C7A6B]" />
            <span>Hand-Applied Wax Seals</span>
          </div>
          <p className="text-[#6B5C50] leading-relaxed">
            Sealed with our proprietary beeswax blend and cold-stamped with the ÉLIXIR & NOIR insignia.
          </p>
        </div>

        <div className="space-y-2 md:border-l md:border-[#E7E0D6] md:pl-8">
          <div className="flex items-center gap-2 text-[#1E1714] font-medium font-serif text-base">
            <HeartHandshake className="w-4 h-4 text-[#8C7A6B]" />
            <span>Calligraphy Card Messages</span>
          </div>
          <p className="text-[#6B5C50] leading-relaxed">
            Your personal sentiment transcribed by our atelier scribes onto heavy cotton rag cardstock.
          </p>
        </div>

        <div className="space-y-2 md:border-l md:border-[#E7E0D6] md:pl-8">
          <div className="flex items-center gap-2 text-[#1E1714] font-medium font-serif text-base">
            <ShieldCheck className="w-4 h-4 text-[#8C7A6B]" />
            <span>Discreet Gift Receipts</span>
          </div>
          <p className="text-[#6B5C50] leading-relaxed">
            Pricing is automatically omitted from delivery packing slips so your gesture remains unblemished.
          </p>
        </div>
      </div>

      {/* Occasion Filter Segmented Buttons */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#E7E0D6] pb-4 gap-4">
          <div>
            <span className="text-xs tracking-[0.2em] uppercase text-[#8C7A6B]">Curated By Occasion</span>
            <h2 className="font-serif text-2xl text-[#1E1714]">Selected Gifts</h2>
          </div>

          <div className="flex flex-wrap gap-2">
            {occasions.map(occ => (
              <button
                key={occ}
                onClick={() => setSelectedOccasion(occ)}
                className={`px-3.5 py-1.5 text-xs uppercase tracking-wider transition-colors border cursor-pointer ${
                  selectedOccasion === occ
                    ? 'bg-[#1E1714] text-[#FAF8F5] border-[#1E1714] font-medium'
                    : 'bg-white text-[#6B5C50] border-[#E7E0D6] hover:border-[#8C7A6B]'
                }`}
              >
                {occ}
              </button>
            ))}
          </div>
        </div>

        {/* Gift Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {giftProducts.map(prod => (
            <ProductCard key={prod.id} product={prod} />
          ))}
        </div>
      </div>

      {/* Gifting Service Configuration Banner */}
      <div className="bg-[#1E1714] text-[#FAF8F5] p-8 sm:p-12 border border-[#E7E0D6] flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 max-w-xl">
          <span className="text-xs tracking-[0.25em] uppercase text-[#BFA175] font-medium flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Complimentary Concierge Consultation</span>
          </span>
          <h3 className="font-serif text-2xl sm:text-3xl font-normal">
            Planning a Wedding Suite or Corporate Gifting?
          </h3>
          <p className="text-xs text-[#DCD3C7] leading-relaxed">
            Our atelier provides bespoke engraved bottles, monogrammed cashmere coats, and private batch extractions for celebratory cohorts.
          </p>
        </div>

        <button
          onClick={() => setCurrentPage('contact')}
          className="px-6 py-3 bg-[#FAF8F5] hover:bg-white text-[#1E1714] text-xs font-semibold uppercase tracking-[0.2em] transition-colors shrink-0 cursor-pointer shadow-lg"
        >
          Request Corporate Consultation
        </button>
      </div>
    </div>
  );
};
