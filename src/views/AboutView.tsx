import React from 'react';
import { useStore } from '../context/StoreContext';
import { ArrowRight } from 'lucide-react';

export const AboutView: React.FC = () => {
  const { setCurrentPage } = useStore();

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-20">
      {/* Editorial Header */}
      <div className="text-center space-y-4">
        <span className="text-xs tracking-[0.3em] uppercase text-[#C5A880]">
          The Heritage & Philosophy
        </span>
        <h1 className="font-serif text-4xl sm:text-6xl text-white font-normal [text-wrap:balance]">
          A Sanctuary of Pure Refinement
        </h1>
        <div className="w-12 h-px bg-[#C5A880] mx-auto mt-4" />
      </div>

      {/* Main Narrative Split */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div className="space-y-4 text-sm text-[#A8A29A] leading-relaxed">
          <h2 className="font-serif text-2xl text-white">
            Born from the silence of nocturnal contemplation.
          </h2>
          <p>
            ÉLIXIR & NOIR was established as an antidote to ephemeral trends and synthetic mass production. We inhabit the intersection between olfactory chemistry, sculptural garment draping, and bio-compatible cellular restorations.
          </p>
          <p>
            Our master perfumers work exclusively with unadulterated absolutes: wild amber from the Mediterranean basin, Florentine orris root aged for four years in cedar vats, and hand-plucked May roses from Grasse.
          </p>
        </div>

        <div className="aspect-[4/5] bg-[#121212] border border-[#222] overflow-hidden">
          <img
            src="/src/assets/images/hero_luxury_boutique_1791824705943.jpg"
            alt="Atelier Heritage"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* The 3 Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 py-12 border-y border-[#1C1C1C] text-xs">
        <div className="space-y-3">
          <span className="font-mono text-[#C5A880]">01. LES PARFUMS</span>
          <h3 className="font-serif text-xl text-white">Cold Maceration</h3>
          <p className="text-[#888] leading-relaxed">
            Formulations undergo 12 lunar cycles of undisturbed resting in smoked glass carboys, allowing top and heart volatile compounds to marry harmoniously without thermal distress.
          </p>
        </div>

        <div className="space-y-3">
          <span className="font-mono text-[#C5A880]">02. LA COUTURE</span>
          <h3 className="font-serif text-xl text-white">Floating Canvas</h3>
          <p className="text-[#888] leading-relaxed">
            Every outerwear piece features a horsehair canvas chest piece that gently molds to the client’s anatomy over time, providing architectural drape that synthetic fusing can never replicate.
          </p>
        </div>

        <div className="space-y-3">
          <span className="font-mono text-[#C5A880]">03. LA BOTANIQUE</span>
          <h3 className="font-serif text-xl text-white">Lipid Resonance</h3>
          <p className="text-[#888] leading-relaxed">
            Skincare formulations match the natural fatty acid matrix of human epidermis, utilizing unrefined prickly pear seed oil and sacred frankincense to trigger biological rejuvenation.
          </p>
        </div>
      </div>

      {/* CTA Section */}
      <div className="text-center space-y-4 pt-6">
        <h3 className="font-serif text-2xl text-white">Experience the creations firsthand.</h3>
        <button
          onClick={() => setCurrentPage('shop')}
          className="px-8 py-3.5 bg-[#F0ECE8] hover:bg-white text-black text-xs font-semibold uppercase tracking-[0.2em] transition-colors cursor-pointer inline-flex items-center gap-2"
        >
          <span>Explore The Catalog</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
