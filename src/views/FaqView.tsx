import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

export const FaqView: React.FC = () => {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const faqs = [
    {
      q: 'What distinguishes niche luxury perfumery from commercial fragrances?',
      a: 'Commercial designer scents rely predominantly on synthetic aroma molecules with rapid mass production. ÉLIXIR & NOIR formulations contain 24% to 30% natural extracts—including rare Orris root, real Centifolia Rose, and wild Frankincense—cold macerated for extended aging cycles to yield depth, noticeable sillage, and lasting skin affinity.'
    },
    {
      q: 'How long do the fragrances last on skin and fabric?',
      a: 'Owing to our elevated concentration and unadulterated base notes (bourbon vanilla, aged amber, and Mysore sandalwood), our Extraits de Parfum project for 12 to 18 hours on skin and remain pleasantly detectable on wool and silk fibers for multiple days.'
    },
    {
      q: 'What is the policy for complimentary express delivery across India?',
      a: 'We provide complimentary express shipping for all orders exceeding ₹5,000. Orders are enclosed in rigid gift presentation boxes with embossed branding and dispatched via secured air courier with OTP verification upon delivery. Transit times range from 2 to 4 business days.'
    },
    {
      q: 'Can I request custom sizing or measurements for apparel?',
      a: 'Yes. For our lifestyle and apparel pieces, sizing specifications can be submitted via our personal consultation form. We maintain size charts and accommodate custom requests prior to order dispatch.'
    },
    {
      q: 'What payment methods are supported at checkout?',
      a: 'Our checkout supports UPI (Google Pay, PhonePe, Paytm, BHIM), all major Credit and Debit cards (Visa, Mastercard, RuPay, American Express), and Net Banking. We also offer Cash on Delivery (COD) for eligible domestic addresses.'
    },
    {
      q: 'What is your return and exchange policy?',
      a: 'Unopened fragrances with intact seals and unworn apparel items with original tags and security ribbons may be exchanged or returned within 14 calendar days of confirmed delivery.'
    }
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12">
      <div className="text-center space-y-3 border-b border-[#E8DED4] pb-8">
        <span className="text-xs tracking-[0.25em] uppercase text-[#C9878D] font-semibold">
          Customer Care
        </span>
        <h1 className="font-serif text-3xl sm:text-5xl text-[#392C2A]">
          Frequently Asked Questions
        </h1>
        <p className="text-xs text-[#7D6B67] max-w-md mx-auto">
          Detailed answers regarding our fragrance concentrations, artisanal craftsmanship, and shipping policies.
        </p>
      </div>

      <div className="divide-y divide-[#E8DED4] border-y border-[#E8DED4] bg-[#FFFDF9] p-6 sm:p-8 rounded-sm shadow-xs">
        {faqs.map((faq, idx) => (
          <div key={idx} className="py-5 first:pt-0 last:pb-0">
            <button
              onClick={() => setOpenIdx(openIdx === idx ? null : idx)}
              className="w-full flex items-center justify-between text-left group cursor-pointer"
            >
              <span className="font-serif text-lg text-[#392C2A] group-hover:text-[#C9878D] transition-colors pr-4 font-medium">
                {faq.q}
              </span>
              {openIdx === idx ? (
                <ChevronUp className="w-4 h-4 text-[#C9878D] shrink-0" />
              ) : (
                <ChevronDown className="w-4 h-4 text-[#7D6B67] group-hover:text-[#392C2A] shrink-0" />
              )}
            </button>

            {openIdx === idx && (
              <p className="pt-3 text-xs sm:text-sm text-[#7D6B67] leading-relaxed">
                {faq.a}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
