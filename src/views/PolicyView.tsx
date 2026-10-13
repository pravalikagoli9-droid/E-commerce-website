import React from 'react';
import { useStore } from '../context/StoreContext';

export const PolicyView: React.FC = () => {
  const { policyTab, setPolicyTab } = useStore();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12">
      <div className="text-center space-y-3 border-b border-[#E8DED4] pb-8">
        <span className="text-xs tracking-[0.25em] uppercase text-[#C9878D] font-semibold">
          Customer Care
        </span>
        <h1 className="font-serif text-3xl sm:text-5xl text-[#392C2A]">
          Policies & Terms
        </h1>
      </div>

      {/* Policy Tabs */}
      <div className="flex border-b border-[#E8DED4] gap-6 text-xs uppercase tracking-[0.18em] overflow-x-auto">
        <button
          onClick={() => setPolicyTab('shipping')}
          className={`pb-3 whitespace-nowrap cursor-pointer transition-colors ${
            policyTab === 'shipping'
              ? 'text-[#392C2A] border-b-2 border-[#C9878D] font-semibold'
              : 'text-[#7D6B67] hover:text-[#392C2A]'
          }`}
        >
          Shipping Policy
        </button>

        <button
          onClick={() => setPolicyTab('returns')}
          className={`pb-3 whitespace-nowrap cursor-pointer transition-colors ${
            policyTab === 'returns'
              ? 'text-[#392C2A] border-b-2 border-[#C9878D] font-semibold'
              : 'text-[#7D6B67] hover:text-[#392C2A]'
          }`}
        >
          Returns & Exchanges
        </button>

        <button
          onClick={() => setPolicyTab('privacy')}
          className={`pb-3 whitespace-nowrap cursor-pointer transition-colors ${
            policyTab === 'privacy'
              ? 'text-[#392C2A] border-b-2 border-[#C9878D] font-semibold'
              : 'text-[#7D6B67] hover:text-[#392C2A]'
          }`}
        >
          Privacy Policy
        </button>

        <button
          onClick={() => setPolicyTab('terms')}
          className={`pb-3 whitespace-nowrap cursor-pointer transition-colors ${
            policyTab === 'terms'
              ? 'text-[#392C2A] border-b-2 border-[#C9878D] font-semibold'
              : 'text-[#7D6B67] hover:text-[#392C2A]'
          }`}
        >
          Terms of Service
        </button>
      </div>

      {/* Content */}
      <div className="bg-[#FFFDF9] border border-[#E8DED4] p-8 sm:p-12 space-y-6 text-xs text-[#7D6B67] leading-relaxed rounded-sm shadow-xs">
        {policyTab === 'shipping' && (
          <div className="space-y-6">
            <h2 className="font-serif text-2xl text-[#392C2A]">Express Shipping Policy</h2>
            <p>
              Every order from ÉLIXIR & NOIR is prepared with meticulous care. Products are packaged in our signature gift boxes with protective insulation and dispatched in secured shipping containers.
            </p>
            <div className="space-y-3 pt-2">
              <h3 className="font-serif text-base text-[#392C2A]">Delivery Schedules</h3>
              <ul className="list-disc pl-5 space-y-2">
                <li><strong>Complimentary Delivery:</strong> Granted automatically for all orders exceeding ₹5,000 across India.</li>
                <li><strong>Metro Destinations (Mumbai, Delhi, Bengaluru):</strong> 2 to 3 business days via prioritized air transit.</li>
                <li><strong>Regional Destinations:</strong> 3 to 5 business days with direct signature verification upon delivery.</li>
                <li><strong>Cash on Delivery:</strong> Available for eligible domestic orders with pre-dispatch verification.</li>
              </ul>
            </div>
          </div>
        )}

        {policyTab === 'returns' && (
          <div className="space-y-6">
            <h2 className="font-serif text-2xl text-[#392C2A]">Return & Exchange Policy</h2>
            <p>
              Due to the artisanal nature of our formulations and luxury garments, we adhere to high standards of hygiene and quality:
            </p>
            <div className="space-y-3 pt-2">
              <h3 className="font-serif text-base text-[#392C2A]">Fragrances & Skincare</h3>
              <p>
                Bottles are accompanied by a complimentary 2ml sample vial of the identical scent. We invite customers to test the sample first. If the scent does not suit you, the full-size bottle may be returned within 14 calendar days, provided the original packaging and seal remain unopened.
              </p>
              <h3 className="font-serif text-base text-[#392C2A] pt-2">Apparel & Lifestyle</h3>
              <p>
                Garments must be returned unworn, unwashed, and in pristine condition with all original tags attached. Return shipping will be coordinated with our customer care concierge.
              </p>
            </div>
          </div>
        )}

        {policyTab === 'privacy' && (
          <div className="space-y-6">
            <h2 className="font-serif text-2xl text-[#392C2A]">Customer Privacy Policy</h2>
            <p>
              ÉLIXIR & NOIR is committed to protecting your privacy. We collect only information essential to process orders, deliver packages, and manage your account.
            </p>
            <div className="space-y-3 pt-2">
              <h3 className="font-serif text-base text-[#392C2A]">Data Protection Measures</h3>
              <ul className="list-disc pl-5 space-y-2">
                <li>We do not sell, rent, or share customer emails or purchase histories with third parties.</li>
                <li>Payment details are transmitted over 256-bit SSL encrypted channels directly to certified payment processors. Credit card numbers and CVV codes are never stored on our servers.</li>
                <li>Customers may request account deletion or export of personal records at any time by contacting our support team.</li>
              </ul>
            </div>
          </div>
        )}

        {policyTab === 'terms' && (
          <div className="space-y-6">
            <h2 className="font-serif text-2xl text-[#392C2A]">Terms of Service</h2>
            <p>
              By accessing and placing orders through ÉLIXIR & NOIR, customers agree to the terms described below:
            </p>
            <div className="space-y-3 pt-2">
              <ul className="list-disc pl-5 space-y-2">
                <li><strong>Limited Edition Batches:</strong> Fragrances and apparel are produced in seasonal editions. In the rare event of inventory exhaustion, prompt refunds will be issued within 48 hours.</li>
                <li><strong>Pricing & Taxes:</strong> All listed prices are in Indian Rupees (₹ INR) and include applicable taxes.</li>
                <li><strong>Intellectual Property:</strong> Product descriptions, branding, photographs, and formulations are the sole property of ÉLIXIR & NOIR.</li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
