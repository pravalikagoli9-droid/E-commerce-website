import React from 'react';
import { useStore } from '../context/StoreContext';
import {
  CheckCircle,
  Truck,
  Package,
  ShieldCheck,
  ArrowRight,
  Printer,
  Calendar,
  ExternalLink
} from 'lucide-react';

export const OrderConfirmationView: React.FC = () => {
  const { activeOrder, setCurrentPage } = useStore();

  if (!activeOrder) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-24 text-center space-y-4">
        <h2 className="font-serif text-3xl text-white">No Active Order Found</h2>
        <p className="text-xs text-[#777]">Please check your order history in the Client Sanctuary.</p>
        <button
          onClick={() => setCurrentPage('account')}
          className="px-6 py-2.5 bg-[#F0ECE8] text-[#000000] text-xs uppercase tracking-[0.2em] font-medium"
        >
          View Client Sanctuary
        </button>
      </div>
    );
  }

  const steps = [
    { title: 'Inscribed in Atelier', desc: 'Order confirmed & paid', completed: true },
    {
      title: 'Atelier Preparation',
      desc: 'Wax-sealed & boxed in noir presentation',
      completed: ['PROCESSING', 'SHIPPED', 'DELIVERED'].includes(activeOrder.orderStatus)
    },
    {
      title: 'White Glove Courier',
      desc: activeOrder.trackingNumber || 'Tracking assigned',
      completed: ['SHIPPED', 'DELIVERED'].includes(activeOrder.orderStatus)
    },
    {
      title: 'Sanctuary Arrival',
      desc: 'Signed delivery',
      completed: activeOrder.orderStatus === 'DELIVERED'
    }
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Top Banner */}
      <div className="text-center space-y-4 border-b border-[#1C1C1C] pb-10">
        <div className="w-12 h-12 bg-[#171717] border border-[#C5A880]/40 rounded-full flex items-center justify-center mx-auto text-[#C5A880]">
          <CheckCircle className="w-6 h-6" />
        </div>
        <span className="text-xs tracking-[0.28em] uppercase text-[#C5A880] block font-mono">
          Acquisition Inscribed
        </span>
        <h1 className="font-serif text-3xl sm:text-5xl text-white font-normal">
          Thank you for your acquisition.
        </h1>
        <p className="text-sm text-[#A8A29A] max-w-lg mx-auto leading-relaxed">
          Your order has been recorded into the ÉLIXIR & NOIR ledger under reference{' '}
          <span className="text-white font-mono font-medium">{activeOrder.orderNumber}</span>.
          A formal receipt has been dispatched to {activeOrder.customerEmail}.
        </p>
      </div>

      {/* Tracking Progression Timeline */}
      <div className="p-6 sm:p-8 bg-[#0A0A0A] border border-[#1F1F1F] space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#181818] pb-4">
          <div>
            <span className="text-[10px] tracking-[0.2em] uppercase text-[#888] block">
              Concierge Tracking
            </span>
            <p className="font-serif text-lg text-white">White Glove Courier Status</p>
          </div>
          {activeOrder.trackingNumber && (
            <div className="text-xs font-mono text-[#C5A880]">
              Waybill: {activeOrder.trackingNumber}
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-6 pt-2">
          {steps.map((st, i) => (
            <div key={i} className="relative space-y-2">
              <div className="flex items-center gap-2">
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-mono ${
                    st.completed
                      ? 'bg-[#C5A880] text-black font-semibold'
                      : 'bg-[#1C1C1C] text-[#666]'
                  }`}
                >
                  {i + 1}
                </div>
                <div
                  className={`h-0.5 flex-1 hidden sm:block ${
                    st.completed ? 'bg-[#C5A880]' : 'bg-[#222]'
                  }`}
                />
              </div>
              <div>
                <p className={`text-xs font-medium ${st.completed ? 'text-white' : 'text-[#666]'}`}>
                  {st.title}
                </p>
                <p className="text-[11px] text-[#777] mt-0.5">{st.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Order Itemized Summary Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        {/* Left: Ordered Items */}
        <div className="md:col-span-7 bg-[#0A0A0A] border border-[#1F1F1F] p-6 space-y-4">
          <h2 className="font-serif text-xl text-white pb-3 border-b border-[#181818]">
            Items in Formulation
          </h2>

          <div className="divide-y divide-[#181818] space-y-3">
            {activeOrder.items.map((it, idx) => (
              <div key={idx} className="pt-3 first:pt-0 flex items-center justify-between gap-4 text-xs">
                <div className="flex items-center gap-3">
                  <div className="w-14 h-16 bg-[#141414] border border-[#222] overflow-hidden shrink-0">
                    <img
                      src={it.productImage || ''}
                      alt=""
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="font-serif text-sm text-white">{it.productName}</h3>
                    {it.selectedVariant && (
                      <p className="text-[#888]">{it.selectedVariant}</p>
                    )}
                    <p className="text-[#666]">Quantity: {it.quantity}</p>
                  </div>
                </div>

                <span className="font-mono text-white tabular-nums">
                  ₹{(it.price * it.quantity).toLocaleString('en-IN')}
                </span>
              </div>
            ))}
          </div>

          {/* Pricing Totals */}
          <div className="pt-4 border-t border-[#181818] space-y-2 text-xs text-[#888]">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="font-mono text-white tabular-nums">
                ₹{activeOrder.subtotal.toLocaleString('en-IN')}
              </span>
            </div>
            {activeOrder.discount > 0 && (
              <div className="flex justify-between text-[#C5A880]">
                <span>Privilege Code</span>
                <span className="font-mono tabular-nums">
                  -₹{activeOrder.discount.toLocaleString('en-IN')}
                </span>
              </div>
            )}
            <div className="flex justify-between">
              <span>Delivery</span>
              <span className="font-mono text-white tabular-nums">
                {activeOrder.shippingFee === 0 ? 'Complimentary' : `₹${activeOrder.shippingFee}`}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Applicable GST (3%)</span>
              <span className="font-mono text-white tabular-nums">
                ₹{activeOrder.tax.toLocaleString('en-IN')}
              </span>
            </div>
            <div className="flex justify-between text-base font-serif text-white pt-2 border-t border-[#181818]">
              <span>Total Remitted</span>
              <span className="font-mono text-[#C5A880] tabular-nums text-lg">
                ₹{activeOrder.totalAmount.toLocaleString('en-IN')}
              </span>
            </div>
          </div>
        </div>

        {/* Right: Delivery Address & Courier Notes */}
        <div className="md:col-span-5 space-y-6">
          <div className="bg-[#0A0A0A] border border-[#1F1F1F] p-6 space-y-4 text-xs">
            <h2 className="font-serif text-lg text-white pb-2 border-b border-[#181818]">
              Sanctuary Delivery Address
            </h2>
            <div className="space-y-1 text-[#AAA] leading-relaxed">
              <p className="text-white font-medium">{activeOrder.shippingAddress.fullName}</p>
              <p>{activeOrder.shippingAddress.addressLine1}</p>
              {activeOrder.shippingAddress.addressLine2 && (
                <p>{activeOrder.shippingAddress.addressLine2}</p>
              )}
              <p>
                {activeOrder.shippingAddress.city}, {activeOrder.shippingAddress.state} -{' '}
                <span className="font-mono">{activeOrder.shippingAddress.postalCode}</span>
              </p>
              <p>India · {activeOrder.shippingAddress.phone}</p>
            </div>

            <div className="pt-3 border-t border-[#181818] space-y-1 text-[#888]">
              <span className="block text-white font-medium">Payment Verification</span>
              <p>Method: {activeOrder.paymentMethod}</p>
              {activeOrder.paymentReference && (
                <p className="font-mono text-[11px]">Ref: {activeOrder.paymentReference}</p>
              )}
            </div>
          </div>

          {/* Action CTAs */}
          <div className="space-y-3">
            <button
              onClick={() => setCurrentPage('shop')}
              className="w-full py-3.5 bg-[#F0ECE8] hover:bg-white text-[#000000] text-xs font-semibold tracking-[0.2em] uppercase transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-lg"
            >
              <span>Continue Exploring Catalog</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={() => window.print()}
              className="w-full py-3 border border-[#333] hover:border-[#666] text-xs text-[#AAA] hover:text-white uppercase tracking-wider transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Formal Receipt</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
