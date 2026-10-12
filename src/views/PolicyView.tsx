import React from 'react';
import { useStore } from '../context/StoreContext';
import { Truck, RotateCcw, Shield, FileText } from 'lucide-react';

export const PolicyView: React.FC = () => {
  const { policyTab, setPolicyTab } = useStore();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12">
      <div className="text-center space-y-3 border-b border-[#1C1C1C] pb-8">
        <span className="text-xs tracking-[0.25em] uppercase text-[#C5A880]">
          Institutional Standards
        </span>
        <h1 className="font-serif text-3xl sm:text-5xl text-white">
          Policies & Governance
        </h1>
      </div>

      {/* Policy Tabs */}
      <div className="flex border-b border-[#1C1C1C] gap-6 text-xs uppercase tracking-[0.18em] overflow-x-auto">
        <button
          onClick={() => setPolicyTab('shipping')}
          className={`pb-3 whitespace-nowrap cursor-pointer transition-colors ${
            policyTab === 'shipping'
              ? 'text-white border-b-2 border-[#F0ECE8] font-medium'
              : 'text-[#777] hover:text-white'
          }`}
        >
          White Glove Shipping
        </button>

        <button
          onClick={() => setPolicyTab('returns')}
          className={`pb-3 whitespace-nowrap cursor-pointer transition-colors ${
            policyTab === 'returns'
              ? 'text-white border-b-2 border-[#F0ECE8] font-medium'
              : 'text-[#777] hover:text-white'
          }`}
        >
          Returns & Exchanges
        </button>

        <button
          onClick={() => setPolicyTab('privacy')}
          className={`pb-3 whitespace-nowrap cursor-pointer transition-colors ${
            policyTab === 'privacy'
              ? 'text-white border-b-2 border-[#F0ECE8] font-medium'
              : 'text-[#777] hover:text-white'
          }`}
        >
          Privacy Governance
        </button>

        <button
          onClick={() => setPolicyTab('terms')}
          className={`pb-3 whitespace-nowrap cursor-pointer transition-colors ${
            policyTab === 'terms'
              ? 'text-white border-b-2 border-[#F0ECE8] font-medium'
              : 'text-[#777] hover:text-white'
          }`}
        >
          Terms of Commerce
        </button>
      </div>

      {/* Content */}
      <div className="bg-[#0A0A0A] border border-[#1F1F1F] p-8 sm:p-12 space-y-6 text-xs text-[#A8A29A] leading-relaxed">
        {policyTab === 'shipping' && (
          <div className="space-y-6">
            <h2 className="font-serif text-2xl text-white">White Glove Courier Shipping Policy</h2>
            <p>
              Every acquisition from ÉLIXIR & NOIR is treated as a cultural shipment. Creations are enclosed in matte-black rigid presentation boxes lined with recycled cotton flocking, sealed with a hand-applied hot wax seal, and cocooned in climate-controlled outer containers.
            </p>
            <div className="space-y-3 pt-2">
              <h3 className="font-serif text-base text-white">Delivery Schedules</h3>
              <ul className="list-disc pl-5 space-y-2">
                <li><strong>Complimentary Delivery:</strong> Granted automatically for all orders exceeding ₹5,000 across India.</li>
                <li><strong>Metro Destinations (Mumbai, Delhi, Bengaluru):</strong> 2 to 3 business days via prioritized air transit.</li>
                <li><strong>Regional Destinations:</strong> 3 to 5 business days with direct signature verification upon handover.</li>
                <li><strong>Cash on Delivery:</strong> Available for orders up to ₹50,000 with pre-dispatch telephonic authorization.</li>
              </ul>
            </div>
          </div>
        )}

        {policyTab === 'returns' && (
          <div className="space-y-6">
            <h2 className="font-serif text-2xl text-white">Return & Exchange Policy</h2>
            <p>
              Due to the rare nature of our artisanal formulations, we adhere to strict purity and hygiene standards:
            </p>
            <div className="space-y-3 pt-2">
              <h3 className="font-serif text-base text-white">Fragrances & Skincare</h3>
              <p>
                Bottles are accompanied by a complimentary 2ml sample vial of the identical creation. We invite clients to evaluate the sample first. If the scent profile does not resonate, the full-size flacon may be returned within 14 calendar days, provided the primary presentation wax seal remains untouched and unbroken.
              </p>
              <h3 className="font-serif text-base text-white pt-2">Sartorial Wardrobe</h3>
              <p>
                Garments must be returned unworn, unwashed, and in immaculate original condition with all fabric care tags and security ties attached. Return courier transit will be arranged directly by our concierge.
              </p>
            </div>
          </div>
        )}

        {policyTab === 'privacy' && (
          <div className="space-y-6">
            <h2 className="font-serif text-2xl text-white">Client Privacy & Data Sanctuary</h2>
            <p>
              ÉLIXIR & NOIR values discretion above all else. We collect only information essential to formulate orders, execute delivery, and maintain private client accounts.
            </p>
            <div className="space-y-3 pt-2">
              <h3 className="font-serif text-base text-white">Data Protection Measures</h3>
              <ul className="list-disc pl-5 space-y-2">
                <li>We never monetize, broker, or disclose client names, emails, or acquisition histories to third parties.</li>
                <li>Financial credentials are transmitted exclusively over 256-bit SSL encrypted channels directly to PCI-DSS certified payment processors (Razorpay). Raw card numbers and CVV codes are never stored on our database.</li>
                <li>Clients retain the right to request comprehensive account redaction or export of personal records at any time.</li>
              </ul>
            </div>
          </div>
        )}

        {policyTab === 'terms' && (
          <div className="space-y-6">
            <h2 className="font-serif text-2xl text-white">Terms of Haute Commerce</h2>
            <p>
              By accessing and completing acquisitions through the ÉLIXIR & NOIR digital boutique, clients assent to the terms delineated herein:
            </p>
            <div className="space-y-3 pt-2">
              <ul className="list-disc pl-5 space-y-2">
                <li><strong>Limited Edition Batches:</strong> All formulas are produced in seasonal harvests. In the rare event of inventory exhaustion prior to processing, full refunds will be remitted within 48 hours.</li>
                <li><strong>Pricing & Taxes:</strong> All stated prices are in Indian Rupees (₹ INR) and include applicable domestic luxury goods taxation.</li>
                <li><strong>Intellectual Property:</strong> Formulations, descriptions, olfactory structures, and architectural photography are the sole intellectual domain of ÉLIXIR & NOIR S.A.</li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
