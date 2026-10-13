import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { ArrowRight, ShieldCheck } from 'lucide-react';

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
        showToast('You have successfully subscribed to our newsletter.', 'success');
        setEmail('');
      } else {
        showToast('Could not subscribe. Please try again.', 'error');
      }
    } catch {
      showToast('Connection error. Please try again.', 'error');
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
    <footer className="bg-[#392C2A] text-[#E8D8C8] border-t border-[#4A3B39] pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Top Newsletter & Brand Mission Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 pb-14 border-b border-[#4A3B39]">
          {/* Brand Philosophy */}
          <div className="lg:col-span-5 space-y-4">
            <h2 className="text-2xl sm:text-3xl font-serif tracking-[0.16em] text-[#FAF7F2]">
              ÉLIXIR & NOIR
            </h2>
            <p className="text-xs tracking-[0.2em] uppercase text-[#D6B77A]">
              Luxury Fragrances · Lifestyle & Apparel · Botanical Skincare
            </p>
            <p className="text-sm text-[#E8D8C8]/80 leading-relaxed max-w-md pt-2 font-light">
              Founded on the reverence of rare natural resins, architectural tailoring, and biocompatible botanical elixirs. Crafted in limited editions with artisanal integrity.
            </p>
          </div>

          {/* Newsletter Form */}
          <div className="lg:col-span-7 flex flex-col justify-center space-y-4">
            <div>
              <span className="text-xs tracking-[0.25em] uppercase text-[#D6B77A] block mb-1">
                Newsletter
              </span>
              <h3 className="font-serif text-xl sm:text-2xl text-[#FAF7F2]">
                Receive private invitations and seasonal releases.
              </h3>
            </div>

            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-2 max-w-xl">
              <input
                type="email"
                required
                placeholder="Enter your email address..."
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="flex-1 bg-[#2C2120] border border-[#52413F] px-4 py-3 text-xs text-[#FAF7F2] placeholder-[#A89895] focus:outline-none focus:border-[#C9878D] transition-colors rounded-sm"
              />
              <button
                type="submit"
                disabled={isSubscribing}
                className="px-6 py-3 bg-[#C9878D] hover:bg-[#B56F75] text-white text-xs font-semibold tracking-[0.2em] uppercase transition-colors shrink-0 flex items-center justify-center gap-2 cursor-pointer shadow-sm rounded-sm"
              >
                <span>Subscribe</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </form>
            <p className="text-[11px] text-[#A89895]">
              No spam. We respect your privacy. You may unsubscribe at any time.
            </p>
          </div>
        </div>

        {/* Navigation Columns */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-xs">
          {/* Collections */}
          <div className="space-y-3">
            <p className="font-serif text-sm text-[#FAF7F2] tracking-wider uppercase font-semibold">Collections</p>
            <ul className="space-y-2 text-[#E8D8C8]/80">
              <li>
                <button
                  onClick={() => {
                    setSelectedCategorySlug('fragrances');
                    setCurrentPage('shop');
                  }}
                  className="hover:text-[#FAF7F2] transition-colors text-left"
                >
                  Luxury Fragrances
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setSelectedCategorySlug('apparel');
                    setCurrentPage('shop');
                  }}
                  className="hover:text-[#FAF7F2] transition-colors text-left"
                >
                  Lifestyle & Apparel
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setSelectedCategorySlug('skincare');
                    setCurrentPage('shop');
                  }}
                  className="hover:text-[#FAF7F2] transition-colors text-left"
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
                  className="hover:text-[#FAF7F2] transition-colors text-left"
                >
                  All Products
                </button>
              </li>
            </ul>
          </div>

          {/* The Atelier / About */}
          <div className="space-y-3">
            <p className="font-serif text-sm text-[#FAF7F2] tracking-wider uppercase font-semibold">About Us</p>
            <ul className="space-y-2 text-[#E8D8C8]/80">
              <li>
                <button onClick={() => setCurrentPage('about')} className="hover:text-[#FAF7F2] transition-colors text-left">
                  Our Philosophy
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentPage('about')} className="hover:text-[#FAF7F2] transition-colors text-left">
                  Artisanal Craftsmanship
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentPage('blog')} className="hover:text-[#FAF7F2] transition-colors text-left">
                  Journal & Notes
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentPage('contact')} className="hover:text-[#FAF7F2] transition-colors text-left">
                  Personal Consultation
                </button>
              </li>
            </ul>
          </div>

          {/* Customer Care */}
          <div className="space-y-3">
            <p className="font-serif text-sm text-[#FAF7F2] tracking-wider uppercase font-semibold">Customer Care</p>
            <ul className="space-y-2 text-[#E8D8C8]/80">
              <li>
                <button onClick={() => setCurrentPage('account')} className="hover:text-[#FAF7F2] transition-colors text-left">
                  Your Account
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentPage('faq')} className="hover:text-[#FAF7F2] transition-colors text-left">
                  Frequently Asked Questions
                </button>
              </li>
              <li>
                <button onClick={() => navPolicy('shipping')} className="hover:text-[#FAF7F2] transition-colors text-left">
                  Shipping Information
                </button>
              </li>
              <li>
                <button onClick={() => navPolicy('returns')} className="hover:text-[#FAF7F2] transition-colors text-left">
                  Returns & Exchanges
                </button>
              </li>
            </ul>
          </div>

          {/* Policies & Legal */}
          <div className="space-y-3">
            <p className="font-serif text-sm text-[#FAF7F2] tracking-wider uppercase font-semibold">Policies</p>
            <ul className="space-y-2 text-[#E8D8C8]/80">
              <li>
                <button onClick={() => navPolicy('privacy')} className="hover:text-[#FAF7F2] transition-colors text-left">
                  Privacy Policy
                </button>
              </li>
              <li>
                <button onClick={() => navPolicy('terms')} className="hover:text-[#FAF7F2] transition-colors text-left">
                  Terms of Service
                </button>
              </li>
              <li>
                <button onClick={() => navPolicy('shipping')} className="hover:text-[#FAF7F2] transition-colors text-left">
                  Packaging Standards
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentPage('contact')} className="hover:text-[#FAF7F2] transition-colors text-left">
                  Corporate & Custom Orders
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Security */}
        <div className="pt-8 border-t border-[#4A3B39] flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-[#A89895]">
          <p>© {new Date().getFullYear()} ÉLIXIR & NOIR. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1.5 text-[#E8D8C8]/80">
              <ShieldCheck className="w-3.5 h-3.5 text-[#D6B77A]" />
              Secure 256-Bit SSL Checkout
            </span>
            <span>Prices displayed in Indian Rupees (₹ INR) inclusive of all taxes</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
