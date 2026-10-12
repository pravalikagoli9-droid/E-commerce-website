import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

export const FaqView: React.FC = () => {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const faqs = [
    {
      q: 'What distinguishes Haute Parfumerie from commercial fragrances?',
      a: 'Commercial designer scents rely predominantly on synthetic aroma molecules (often 95%+ by volume) with minimal maturation. ÉLIXIR & NOIR formulations contain 24% to 30% natural extracts—including rare Orris root, real Centifolia Rose, and wild Frankincense—macerated for a minimum of twelve months to yield unmatched depth, sillage, and skin affinity.'
    },
    {
      q: 'How long do the fragrances endure on skin and textile?',
      a: 'Owing to our elevated concentration and unadulterated base notes (bourbon vanilla, aged amber, and Mysore sandalwood), our Extraits de Parfum consistently project for 12 to 18 hours on skin and remain discernibly present on wool and silk fibers for multiple days.'
    },
    {
      q: 'What is the policy for White Glove Courier Delivery across India?',
      a: 'We provide complimentary White Glove delivery for all acquisitions exceeding ₹5,000. Orders are enclosed in rigid black presentation boxes with hot-stamped gold foil and dispatched via secured air courier with OTP verification upon delivery. Transit times range from 2 to 4 business days.'
    },
    {
      q: 'Can I request bespoke sizing or alterations for garments?',
      a: 'Yes. For our sartorial wardrobe, client measurements can be submitted via private consultation. We maintain an archive of bespoke patterns and accommodate custom sleeve lengths and trouser rises prior to dispatch.'
    },
    {
      q: 'What payment methods are supported through Razorpay?',
      a: 'Our checkout is fully integrated with Razorpay, supporting UPI (Google Pay, PhonePe, Paytm, BHIM), all major domestic and international Credit and Debit cards (Visa, Mastercard, RuPay, Amex), and Net Banking. We also offer Concierge Cash on Delivery (COD) for eligible domestic addresses.'
    },
    {
      q: 'What is your returns and satisfaction guarantee policy?',
      a: 'Unopened fragrances with intact wax-sealed presentation seals and unworn garments with original security ribbons may be exchanged or returned within 14 calendar days of signed receipt.'
    }
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12">
      <div className="text-center space-y-3 border-b border-[#1C1C1C] pb-8">
        <span className="text-xs tracking-[0.25em] uppercase text-[#C5A880]">
          Client Concierge
        </span>
        <h1 className="font-serif text-3xl sm:text-5xl text-white">
          Frequently Answered Inquiries
        </h1>
        <p className="text-xs text-[#888] max-w-md mx-auto">
          Detailed clarifications regarding our olfactory concentrations, artisanal tailoring, and delivery protocol.
        </p>
      </div>

      <div className="divide-y divide-[#1C1C1C] border-y border-[#1C1C1C]">
        {faqs.map((faq, idx) => (
          <div key={idx} className="py-5">
            <button
              onClick={() => setOpenIdx(openIdx === idx ? null : idx)}
              className="w-full flex items-center justify-between text-left group cursor-pointer"
            >
              <span className="font-serif text-lg text-[#F0ECE8] group-hover:text-white transition-colors pr-4">
                {faq.q}
              </span>
              {openIdx === idx ? (
                <ChevronUp className="w-4 h-4 text-[#C5A880] shrink-0" />
              ) : (
                <ChevronDown className="w-4 h-4 text-[#666] group-hover:text-white shrink-0" />
              )}
            </button>

            {openIdx === idx && (
              <p className="pt-3 text-xs sm:text-sm text-[#A8A29A] leading-relaxed animate-in fade-in duration-200">
                {faq.a}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
