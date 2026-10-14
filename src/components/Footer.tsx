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
        showToast('You have successfully subscribed to VELMORA updates.', 'success');
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
    <footer className="bg-[#5A3E36] text-[#F8F4ED] border-t border-[#48322B] pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Top Newsletter & Brand Mission Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 pb-14 border-b border-[#48322B]">
          {/* Brand Philosophy */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center gap-2">
              <h2 className="text-2xl sm:text-3xl font-serif tracking-[0.22em] text-[#F8F4ED] font-medium">
                VELMORA
              </h2>
              <span className="w-1.5 h-1.5 rounded-full bg-[#D6B77A] inline-block" />
            </div>
            <p className="text-[10px] tracking-[0.28em] uppercase text-[#D6B77A] font-medium font-sans">
              BEAUTY IN EVERY DETAIL
            </p>
            <p className="text-xs text-[#B7A397] tracking-wider uppercase font-medium">
              Luxury Fragrances · Botanical Skincare · Lifestyle & Apparel
            </p>
            <p className="text-sm text-[#F8F4ED]/80 leading-relaxed max-w-md pt-1 font-light">
              Founded on the devotion to rare natural absolutes, biocompatible skincare elixirs, and architectural design. Crafted in limited editions with uncompromised international standards.
            </p>
          </div>

          {/* Newsletter Form */}
          <div className="lg:col-span-7 flex flex-col justify-center space-y-4">
            <div>
              <span className="text-xs tracking-[0.25em] uppercase text-[#D6B77A] block mb-1 font-medium flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>The VELMORA Gazette</span>
              </span>
              <h3 className="font-serif text-xl sm:text-2xl text-[#F8F4ED]">
                Receive private invitations, seasonal previews, and member privileges.
              </h3>
            </div>

            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-2 max-w-xl">
              <input
                type="email"
                required
                placeholder="Enter your email address..."
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="flex-1 bg-[#48322B] border border-[#6B4D44] px-4 py-3 text-xs text-[#F8F4ED] placeholder-[#B7A397] focus:outline-none focus:border-[#D6B77A] transition-colors rounded-sm"
              />
              <button
                type="submit"
                disabled={isSubscribing}
                className="px-6 py-3 bg-[#D6B77A] hover:bg-[#C2A366] text-[#30231F] text-xs font-semibold tracking-[0.2em] uppercase transition-colors shrink-0 flex items-center justify-center gap-2 cursor-pointer shadow-sm rounded-sm"
              >
                <span>Subscribe</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </form>
            <p className="text-[11px] text-[#B7A397]">
              We respect your privacy. Unsubscribe at any time with a single click.
            </p>
          </div>
        </div>

        {/* Navigation Columns */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-xs">
          {/* Collections */}
          <div className="space-y-3">
            <p className="font-serif text-sm text-[#F8F4ED] tracking-wider uppercase font-semibold">Collections</p>
            <ul className="space-y-2 text-[#F8F4ED]/80">
              <li>
                <button
                  onClick={() => {
                    setSelectedCategorySlug('fragrances');
                    setCurrentPage('shop');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-[#D6B77A] transition-colors text-left cursor-pointer"
                >
                  Luxury Fragrances
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setSelectedCategorySlug('skincare');
                    setCurrentPage('shop');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-[#D6B77A] transition-colors text-left cursor-pointer"
                >
                  Botanical Skincare
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setSelectedCategorySlug('apparel');
                    setCurrentPage('shop');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-[#D6B77A] transition-colors text-left cursor-pointer"
                >
                  Lifestyle & Apparel
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setSelectedCategorySlug(null);
                    setCurrentPage('shop');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-[#D6B77A] transition-colors text-left cursor-pointer"
                >
                  All Beauty Products
                </button>
              </li>
            </ul>
          </div>

          {/* About Us */}
          <div className="space-y-3">
            <p className="font-serif text-sm text-[#F8F4ED] tracking-wider uppercase font-semibold">About VELMORA</p>
            <ul className="space-y-2 text-[#F8F4ED]/80">
              <li>
                <button onClick={() => setCurrentPage('about')} className="hover:text-[#D6B77A] transition-colors text-left cursor-pointer">
                  Our Philosophy
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentPage('about')} className="hover:text-[#D6B77A] transition-colors text-left cursor-pointer">
                  Artisanal Craftsmanship
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentPage('blog')} className="hover:text-[#D6B77A] transition-colors text-left cursor-pointer">
                  Journal & Fragrance Notes
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentPage('contact')} className="hover:text-[#D6B77A] transition-colors text-left cursor-pointer">
                  Personal Consultation
                </button>
              </li>
            </ul>
          </div>

          {/* Customer Care */}
          <div className="space-y-3">
            <p className="font-serif text-sm text-[#F8F4ED] tracking-wider uppercase font-semibold">Customer Care</p>
            <ul className="space-y-2 text-[#F8F4ED]/80">
              <li>
                <button onClick={() => setCurrentPage('account')} className="hover:text-[#D6B77A] transition-colors text-left cursor-pointer">
                  Your Account
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentPage('faq')} className="hover:text-[#D6B77A] transition-colors text-left cursor-pointer">
                  Frequently Asked Questions
                </button>
              </li>
              <li>
                <button onClick={() => navPolicy('shipping')} className="hover:text-[#D6B77A] transition-colors text-left cursor-pointer">
                  Shipping Information
                </button>
              </li>
              <li>
                <button onClick={() => navPolicy('returns')} className="hover:text-[#D6B77A] transition-colors text-left cursor-pointer">
                  Returns & Exchanges
                </button>
              </li>
            </ul>
          </div>

          {/* Policies & Legal */}
          <div className="space-y-3">
            <p className="font-serif text-sm text-[#F8F4ED] tracking-wider uppercase font-semibold">Policies</p>
            <ul className="space-y-2 text-[#F8F4ED]/80">
              <li>
                <button onClick={() => navPolicy('privacy')} className="hover:text-[#D6B77A] transition-colors text-left cursor-pointer">
                  Privacy Policy
                </button>
              </li>
              <li>
                <button onClick={() => navPolicy('terms')} className="hover:text-[#D6B77A] transition-colors text-left cursor-pointer">
                  Terms of Service
                </button>
              </li>
              <li>
                <button onClick={() => navPolicy('shipping')} className="hover:text-[#D6B77A] transition-colors text-left cursor-pointer">
                  Packaging Standards
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentPage('contact')} className="hover:text-[#D6B77A] transition-colors text-left cursor-pointer">
                  Concierge Support
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Security */}
        <div className="pt-8 border-t border-[#48322B] flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-[#B7A397]">
          <p>© {new Date().getFullYear()} VELMORA. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1.5 text-[#F8F4ED]/80">
              <ShieldCheck className="w-3.5 h-3.5 text-[#D6B77A]" />
              Secure 256-Bit SSL Checkout
            </span>
            <span>Prices in Indian Rupees (₹ INR) inclusive of all applicable taxes</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
