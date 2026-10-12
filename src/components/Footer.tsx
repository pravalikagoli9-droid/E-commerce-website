import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';

export const Footer: React.FC = () => {
  const { setCurrentPage, setSelectedCategorySlug, setPolicyTab, showToast } = useStore();
  const [email, setEmail] = useState('');
  const [isSubscribing, setIsSubscribing] = useState(false);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) return;
    setIsSubscribing(true);
    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      if (res.ok) {
        showToast('You are now inscribed into The Nocturne Gazette.', 'success');
        setEmail('');
      } else {
        showToast('Could not subscribe. Please try again.', 'error');
      }
    } catch {
      showToast('Connection error.', 'error');
    } finally {
      setIsSubscribing(false);
    }
  };

  const navPolicy = (tab: string) => {
    setPolicyTab(tab);
    setCurrentPage('policies');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#050505] text-[#C4BFB8] border-t border-[#1C1C1C] pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Top Newsletter & Brand Mission Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 pb-14 border-b border-[#1A1A1A]">
          {/* Brand Philosophy */}
          <div className="lg:col-span-5 space-y-4">
            <h2 className="text-2xl sm:text-3xl font-serif tracking-[0.16em] text-[#F0ECE8]">
              ÉLIXIR & NOIR
            </h2>
            <p className="text-xs tracking-[0.2em] uppercase text-[#888]">
              Haute Parfumerie · Sartorial Atelier · Botanical Skincare
            </p>
            <p className="text-sm text-[#8C867E] leading-relaxed max-w-md pt-2">
              Founded on the reverence of rare natural resins, architectural draping, and bio-compatible cellular elixirs. Crafted in limited editions between Grasse, Como, and Mumbai.
            </p>
          </div>

          {/* Newsletter / Nocturne Gazette */}
          <div className="lg:col-span-7 flex flex-col justify-center space-y-4">
            <div>
              <span className="text-xs tracking-[0.25em] uppercase text-[#C5A880] block mb-1">
                The Nocturne Gazette
              </span>
              <h3 className="font-serif text-xl sm:text-2xl text-[#FFFFFF]">
                Receive private invitations and private harvest releases.
              </h3>
            </div>

            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-2 max-w-xl">
              <input
                type="email"
                required
                placeholder="Enter your private email address..."
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="flex-1 bg-[#0F0F0F] border border-[#2B2B2B] px-4 py-3 text-xs text-[#FFFFFF] placeholder-[#666] focus:outline-none focus:border-[#C5A880] transition-colors"
              />
              <button
                type="submit"
                disabled={isSubscribing}
                className="px-6 py-3 bg-[#F0ECE8] hover:bg-white text-[#000000] text-xs font-semibold tracking-[0.2em] uppercase transition-colors shrink-0 flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Inscribe</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </form>
            <p className="text-[11px] text-[#666]">
              Zero spam. We respect your digital sanctuary. Unsubscribe at any time.
            </p>
          </div>
        </div>

        {/* Navigation Columns */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-xs">
          {/* Collections */}
          <div className="space-y-3">
            <p className="font-serif text-sm text-[#FFFFFF] tracking-wider uppercase">Collections</p>
            <ul className="space-y-2 text-[#999]">
              <li>
                <button
                  onClick={() => {
                    setSelectedCategorySlug('fragrances');
                    setCurrentPage('shop');
                  }}
                  className="hover:text-white transition-colors"
                >
                  Haute Parfumerie
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setSelectedCategorySlug('apparel');
                    setCurrentPage('shop');
                  }}
                  className="hover:text-white transition-colors"
                >
                  Sartorial Wardrobe
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setSelectedCategorySlug('skincare');
                    setCurrentPage('shop');
                  }}
                  className="hover:text-white transition-colors"
                >
                  Botanical Skincare
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setSelectedCategorySlug(null);
                    setCurrentPage('shop');
                  }}
                  className="hover:text-white transition-colors"
                >
                  All Archive Creations
                </button>
              </li>
            </ul>
          </div>

          {/* The Atelier */}
          <div className="space-y-3">
            <p className="font-serif text-sm text-[#FFFFFF] tracking-wider uppercase">The Atelier</p>
            <ul className="space-y-2 text-[#999]">
              <li>
                <button onClick={() => setCurrentPage('about')} className="hover:text-white transition-colors">
                  Our Philosophy
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentPage('about')} className="hover:text-white transition-colors">
                  Artisanal Craftsmanship
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentPage('blog')} className="hover:text-white transition-colors">
                  Atelier Journal & Notes
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentPage('contact')} className="hover:text-white transition-colors">
                  Private Consultation
                </button>
              </li>
            </ul>
          </div>

          {/* Concierge & Care */}
          <div className="space-y-3">
            <p className="font-serif text-sm text-[#FFFFFF] tracking-wider uppercase">Concierge</p>
            <ul className="space-y-2 text-[#999]">
              <li>
                <button onClick={() => setCurrentPage('account')} className="hover:text-white transition-colors">
                  Client Sanctuary
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentPage('faq')} className="hover:text-white transition-colors">
                  Frequently Answered
                </button>
              </li>
              <li>
                <button onClick={() => navPolicy('shipping')} className="hover:text-white transition-colors">
                  White Glove Courier
                </button>
              </li>
              <li>
                <button onClick={() => navPolicy('returns')} className="hover:text-white transition-colors">
                  Returns & Exchanges
                </button>
              </li>
            </ul>
          </div>

          {/* Legal & Standards */}
          <div className="space-y-3">
            <p className="font-serif text-sm text-[#FFFFFF] tracking-wider uppercase">Governance</p>
            <ul className="space-y-2 text-[#999]">
              <li>
                <button onClick={() => navPolicy('privacy')} className="hover:text-white transition-colors">
                  Privacy Policy
                </button>
              </li>
              <li>
                <button onClick={() => navPolicy('terms')} className="hover:text-white transition-colors">
                  Terms of Haute Commerce
                </button>
              </li>
              <li>
                <button onClick={() => navPolicy('shipping')} className="hover:text-white transition-colors">
                  Packaging Standards
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentPage('contact')} className="hover:text-white transition-colors">
                  Corporate & Bespoke Orders
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Security */}
        <div className="pt-8 border-t border-[#141414] flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-[#666]">
          <p>© {new Date().getFullYear()} ÉLIXIR & NOIR S.A. All international rights reserved.</p>
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1.5 text-[#888]">
              <ShieldCheck className="w-3.5 h-3.5 text-[#C5A880]" />
              Secure 256-Bit SSL Atelier Commerce
            </span>
            <span>Prices displayed in Indian Rupees (₹ INR) inclusive of duties</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
