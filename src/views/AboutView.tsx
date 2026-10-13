import React from 'react';
import { useStore } from '../context/StoreContext';
import { ArrowRight } from 'lucide-react';

export const AboutView: React.FC = () => {
  const { setCurrentPage } = useStore();

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-20">
      {/* Editorial Header */}
      <div className="text-center space-y-4">
        <span className="text-xs tracking-[0.3em] uppercase text-[#C9878D] font-semibold">
          Heritage & Philosophy
        </span>
        <h1 className="font-serif text-4xl sm:text-6xl text-[#392C2A] font-normal [text-wrap:balance]">
          The Art of Pure Refinement
        </h1>
        <div className="w-12 h-0.5 bg-[#C9878D] mx-auto mt-4" />
      </div>

      {/* Main Narrative Split */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div className="space-y-4 text-sm text-[#7D6B67] leading-relaxed">
          <h2 className="font-serif text-2xl text-[#392C2A] font-medium">
            Born from quiet dedication to timeless craftsmanship.
          </h2>
          <p>
            ÉLIXIR & NOIR was established as an antidote to fleeting trends and synthetic mass production. We live at the intersection of olfactory artistry, sculptural tailoring, and biocompatible skincare rituals.
          </p>
          <p>
            Our master perfumers work exclusively with unadulterated absolutes: wild amber from the Mediterranean, Florentine orris root aged for four years in cedar vats, and hand-plucked May roses from Grasse.
          </p>
        </div>

        <div className="aspect-[4/5] bg-[#FFFDF9] border border-[#E8DED4] overflow-hidden rounded-sm shadow-xs">
          <img
            src="/src/assets/images/hero_luxury_boutique_1791824705943.jpg"
            alt="Atelier Heritage"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* The 3 Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 py-12 border-y border-[#E8DED4] text-xs">
        <div className="space-y-3 bg-[#FFFDF9] p-6 border border-[#E8DED4] rounded-sm shadow-xs">
          <span className="font-mono text-[#C9878D] font-semibold">01. LUXURY FRAGRANCES</span>
          <h3 className="font-serif text-xl text-[#392C2A]">Cold Maceration</h3>
          <p className="text-[#7D6B67] leading-relaxed">
            Formulations undergo undisturbed aging in smoked glass carboys, allowing top and heart aromatic compounds to harmonize gracefully without heat degradation.
          </p>
        </div>

        <div className="space-y-3 bg-[#FFFDF9] p-6 border border-[#E8DED4] rounded-sm shadow-xs">
          <span className="font-mono text-[#C9878D] font-semibold">02. LIFESTYLE & APPAREL</span>
          <h3 className="font-serif text-xl text-[#392C2A]">Floating Canvas</h3>
          <p className="text-[#7D6B67] leading-relaxed">
            Outerwear pieces feature floating canvas chest structures that naturally conform to the wearer's contours, providing an architectural drape that synthetic bonding cannot match.
          </p>
        </div>

        <div className="space-y-3 bg-[#FFFDF9] p-6 border border-[#E8DED4] rounded-sm shadow-xs">
          <span className="font-mono text-[#C9878D] font-semibold">03. BOTANICAL SKINCARE</span>
          <h3 className="font-serif text-xl text-[#392C2A]">Lipid Resonance</h3>
          <p className="text-[#7D6B67] leading-relaxed">
            Formulations complement the natural lipid barrier of the skin, utilizing unrefined prickly pear seed oil and frankincense to nourish and protect delicate facial tissue.
          </p>
        </div>
      </div>

      {/* CTA Section */}
      <div className="text-center space-y-4 pt-6">
        <h3 className="font-serif text-2xl text-[#392C2A]">Experience our collection firsthand.</h3>
        <button
          onClick={() => setCurrentPage('shop')}
          className="px-8 py-3.5 bg-[#C9878D] hover:bg-[#B56F75] text-white text-xs font-semibold uppercase tracking-[0.2em] transition-colors cursor-pointer inline-flex items-center gap-2 rounded-sm shadow-md"
        >
          <span>Explore All Products</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
