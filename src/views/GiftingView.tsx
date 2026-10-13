import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { ProductCard } from '../components/ProductCard';
import { Gift, Sparkles, Package, HeartHandshake, ShieldCheck } from 'lucide-react';

export const GiftingView: React.FC = () => {
  const { products, setCurrentPage, setGiftOptions, showToast } = useStore();
  const [selectedOccasion, setSelectedOccasion] = useState<string>('All Occasions');

  const occasions = [
    'All Occasions',
    'Weddings & Celebrations',
    'Milestones & Achievements',
    'Self-Care & Wellness',
    'Holidays & Festivities',
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
    showToast('Signature gift wrapping added to your order preferences.', 'success');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      {/* Editorial Header */}
      <div className="text-center space-y-4 max-w-3xl mx-auto border-b border-[#E8DED4] pb-10">
        <div className="w-12 h-12 bg-[#E8D8C8] border border-[#E8DED4] rounded-full flex items-center justify-center mx-auto text-[#392C2A]">
          <Gift className="w-6 h-6 text-[#C9878D]" />
        </div>
        <span className="text-xs tracking-[0.3em] uppercase text-[#C9878D] font-semibold block">
          Gift Collection & Services
        </span>
        <h1 className="font-serif text-3xl sm:text-5xl text-[#392C2A] font-normal [text-wrap:balance]">
          Artisanal Gifts of Distinction
        </h1>
        <p className="text-xs sm:text-sm text-[#7D6B67] leading-relaxed">
          Curated fragrances and lifestyle essentials created for unforgettable moments. Every gift is hand-packaged in our signature box with ribbon wrapping, a personalized card message, and a discreet gift receipt.
        </p>
      </div>

      {/* 3 Brand Gifting Hallmarks */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 p-8 bg-[#FFFDF9] border border-[#E8DED4] text-xs rounded-sm shadow-xs">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-[#392C2A] font-semibold font-serif text-base">
            <Package className="w-4 h-4 text-[#C9878D]" />
            <span>Signature Gift Packaging</span>
          </div>
          <p className="text-[#7D6B67] leading-relaxed">
            Beautifully enclosed in handcrafted presentation boxes with embossed branding and fine satin ribbon.
          </p>
        </div>

        <div className="space-y-2 md:border-l md:border-[#E8DED4] md:pl-8">
          <div className="flex items-center gap-2 text-[#392C2A] font-semibold font-serif text-base">
            <HeartHandshake className="w-4 h-4 text-[#C9878D]" />
            <span>Personalized Gift Messages</span>
          </div>
          <p className="text-[#7D6B67] leading-relaxed">
            Your personal sentiment printed or hand-scripted on luxury heavy cotton cardstock.
          </p>
        </div>

        <div className="space-y-2 md:border-l md:border-[#E8DED4] md:pl-8">
          <div className="flex items-center gap-2 text-[#392C2A] font-semibold font-serif text-base">
            <ShieldCheck className="w-4 h-4 text-[#C9878D]" />
            <span>Discreet Gift Receipts</span>
          </div>
          <p className="text-[#7D6B67] leading-relaxed">
            Prices are omitted from packing slips so your gift recipient experiences only pure delight.
          </p>
        </div>
      </div>

      {/* Occasion Filter Segmented Buttons */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#E8DED4] pb-4 gap-4">
          <div>
            <span className="text-xs tracking-[0.2em] uppercase text-[#C9878D] font-semibold">Curated by Occasion</span>
            <h2 className="font-serif text-2xl text-[#392C2A]">Featured Gifts</h2>
          </div>

          <div className="flex flex-wrap gap-2">
            {occasions.map(occ => (
              <button
                key={occ}
                onClick={() => setSelectedOccasion(occ)}
                className={`px-3.5 py-1.5 text-xs uppercase tracking-wider transition-colors border cursor-pointer rounded-xs ${
                  selectedOccasion === occ
                    ? 'bg-[#C9878D] text-white border-[#C9878D] font-semibold shadow-xs'
                    : 'bg-[#FFFDF9] text-[#7D6B67] border-[#E8DED4] hover:border-[#C9878D] hover:text-[#392C2A]'
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
      <div className="bg-[#392C2A] text-[#FAF7F2] p-8 sm:p-12 border border-[#E8DED4] flex flex-col md:flex-row items-center justify-between gap-6 rounded-sm shadow-md">
        <div className="space-y-2 max-w-xl">
          <span className="text-xs tracking-[0.25em] uppercase text-[#D6B77A] font-semibold flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Personalized Concierge Service</span>
          </span>
          <h3 className="font-serif text-2xl sm:text-3xl font-normal text-[#FAF7F2]">
            Planning Wedding Favors or Corporate Gifting?
          </h3>
          <p className="text-xs text-[#E8D8C8] leading-relaxed">
            Our atelier provides bespoke engraved perfume flacons, monogrammed apparel, and custom curated gift sets for special occasions.
          </p>
        </div>

        <button
          onClick={() => setCurrentPage('contact')}
          className="px-6 py-3.5 bg-[#C9878D] hover:bg-[#B56F75] text-white text-xs font-semibold uppercase tracking-[0.2em] transition-colors shrink-0 cursor-pointer shadow-md rounded-sm"
        >
          Request Gift Consultation
        </button>
      </div>
    </div>
  );
};
