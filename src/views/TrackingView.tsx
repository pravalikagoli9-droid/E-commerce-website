import React, { useState } from 'react';
import type { Order } from '../types';
import { useStore } from '../context/StoreContext';
import {
  Search,
  Truck,
  CheckCircle2,
  Package,
  Clock,
  MapPin,
  Calendar,
  AlertCircle,
  ExternalLink
} from 'lucide-react';

export const TrackingView: React.FC = () => {
  const { user } = useStore();
  const [query, setQuery] = useState('EN-84920'); // pre-fill demo order
  const [trackedOrder, setTrackedOrder] = useState<Order | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);

  const handleTrack = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!query.trim()) return;

    setIsSearching(true);
    setSearchError(null);
    try {
      const res = await fetch(`/api/orders/track/${encodeURIComponent(query.trim())}`);
      const data = await res.json();
      if (res.ok && data.order) {
        setTrackedOrder(data.order);
      } else {
        setSearchError(data.error || 'No order record corresponds to that reference number.');
        setTrackedOrder(null);
      }
    } catch {
      setSearchError('Error connecting to courier tracking gateway.');
      setTrackedOrder(null);
    } finally {
      setIsSearching(false);
    }
  };

  const stages = [
    { key: 'PLACED', title: 'Order Placed', desc: 'Inscribed in ledger' },
    { key: 'CONFIRMED', title: 'Payment Confirmed', desc: 'Verified 256-bit settlement' },
    { key: 'PROCESSING', title: 'Atelier Preparation', desc: 'Cold bottling & wax seal' },
    { key: 'SHIPPED', title: 'White Glove Transit', desc: 'Prioritized air courier' },
    { key: 'OUT_FOR_DELIVERY', title: 'Out for Handover', desc: 'Concierge dispatch' },
    { key: 'DELIVERED', title: 'Delivered', desc: 'Signed sanctuary delivery' }
  ];

  const getStageIndex = (status: string) => {
    switch (status) {
      case 'PLACED': return 0;
      case 'CONFIRMED': return 1;
      case 'PROCESSING': return 2;
      case 'SHIPPED': return 3;
      case 'OUT_FOR_DELIVERY': return 4;
      case 'DELIVERED': return 5;
      default: return 1;
    }
  };

  const currentIdx = trackedOrder ? getStageIndex(trackedOrder.orderStatus) : 0;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Header */}
      <div className="text-center space-y-3 border-b border-[#E7E0D6] pb-8">
        <div className="w-12 h-12 bg-[#F4EFEA] border border-[#DCD3C7] rounded-full flex items-center justify-center mx-auto text-[#1E1714]">
          <Truck className="w-6 h-6 text-[#8C7A6B]" />
        </div>
        <span className="text-xs tracking-[0.3em] uppercase text-[#8C7A6B] font-semibold block">
          Courier Concierge
        </span>
        <h1 className="font-serif text-3xl sm:text-5xl text-[#1E1714] font-normal">
          Track Your Acquisition
        </h1>
        <p className="text-xs text-[#5C4F44] max-w-md mx-auto leading-relaxed">
          Monitor the preparation, wax-sealing, and white glove courier transit of your bespoke order.
        </p>
      </div>

      {/* Search Input */}
      <form onSubmit={handleTrack} className="max-w-xl mx-auto space-y-3">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-[#8C7A6B] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              required
              placeholder="Enter Order Reference (e.g. EN-84920)..."
              value={query}
              onChange={e => setQuery(e.target.value)}
              className="w-full bg-white border border-[#DCD3C7] pl-10 pr-3.5 py-3 text-xs text-[#1E1714] font-mono uppercase focus:outline-none focus:border-[#1E1714]"
            />
          </div>
          <button
            type="submit"
            disabled={isSearching}
            className="px-6 py-3 bg-[#1E1714] hover:bg-[#342721] text-[#FAF8F5] text-xs uppercase tracking-wider font-semibold transition-colors cursor-pointer shrink-0"
          >
            {isSearching ? 'Locating...' : 'Track Waybill'}
          </button>
        </div>

        {searchError && (
          <div className="p-3 bg-[#FDF2F2] border border-[#F3C8C8] text-[#9E3636] text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{searchError}</span>
          </div>
        )}
      </form>

      {/* Tracked Order Details */}
      {trackedOrder && (
        <div className="bg-white border border-[#E7E0D6] shadow-sm p-6 sm:p-10 space-y-8 animate-in fade-in duration-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-[#E7E0D6] gap-3">
            <div>
              <span className="text-[10px] tracking-wider uppercase text-[#8C7A6B]">Order Ledger</span>
              <h2 className="font-serif text-2xl text-[#1E1714] font-medium">#{trackedOrder.orderNumber}</h2>
              <p className="text-xs text-[#5C4F44] font-mono mt-0.5">
                Placed on {new Date(trackedOrder.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
              </p>
            </div>

            <div className="text-right">
              <span className="text-[10px] tracking-wider uppercase text-[#8C7A6B]">Courier Waybill</span>
              <p className="font-mono text-sm text-[#1E1714] font-semibold">{trackedOrder.trackingNumber || 'Pending Courier Scan'}</p>
              <p className="text-xs text-[#8C7A6B]">{trackedOrder.trackingCourier || 'Blue Dart Apex Sovereign'}</p>
            </div>
          </div>

          {/* 6 Stage Timeline */}
          <div className="space-y-4">
            <h3 className="font-serif text-lg text-[#1E1714]">Fulfillment Progression</h3>
            <div className="grid grid-cols-2 md:grid-cols-6 gap-4 pt-2">
              {stages.map((st, idx) => {
                const isPassed = idx <= currentIdx;
                const isCurrent = idx === currentIdx;

                return (
                  <div key={st.key} className="space-y-2 relative">
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-mono font-medium ${
                          isPassed
                            ? 'bg-[#1E1714] text-[#FAF8F5]'
                            : 'bg-[#F4EFEA] text-[#8C7A6B] border border-[#DCD3C7]'
                        } ${isCurrent ? 'ring-2 ring-[#BFA175]' : ''}`}
                      >
                        {idx + 1}
                      </div>
                      <div
                        className={`h-0.5 flex-1 hidden md:block ${
                          isPassed ? 'bg-[#1E1714]' : 'bg-[#E7E0D6]'
                        }`}
                      />
                    </div>
                    <div>
                      <p className={`text-xs font-medium ${isPassed ? 'text-[#1E1714]' : 'text-[#8C7A6B]'}`}>
                        {st.title}
                      </p>
                      <p className="text-[11px] text-[#8C7A6B] leading-tight mt-0.5">{st.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Items & Shipping Address Split */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6 border-t border-[#E7E0D6] text-xs">
            <div className="space-y-3">
              <h4 className="font-serif text-base text-[#1E1714]">Creations in Transit</h4>
              <div className="space-y-3 divide-y divide-[#F3EFEA]">
                {trackedOrder.items.map((it, i) => (
                  <div key={i} className="pt-2 first:pt-0 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <img src={it.productImage || ''} alt="" className="w-10 h-12 object-cover border border-[#E7E0D6]" />
                      <div>
                        <p className="font-serif text-sm text-[#1E1714] font-medium">{it.productName}</p>
                        <p className="text-[#8C7A6B]">Qty: {it.quantity} {it.selectedVariant ? `· ${it.selectedVariant}` : ''}</p>
                      </div>
                    </div>
                    <span className="font-mono text-[#1E1714] font-semibold">
                      ₹{(it.price * it.quantity).toLocaleString('en-IN')}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-serif text-base text-[#1E1714]">Delivery Sanctuary</h4>
              <div className="p-4 bg-[#F4EFEA] border border-[#E7E0D6] space-y-1 text-[#5C4F44] leading-relaxed">
                <p className="text-[#1E1714] font-medium">{trackedOrder.shippingAddress.fullName}</p>
                <p>{trackedOrder.shippingAddress.addressLine1}</p>
                {trackedOrder.shippingAddress.addressLine2 && <p>{trackedOrder.shippingAddress.addressLine2}</p>}
                <p>{trackedOrder.shippingAddress.city}, {trackedOrder.shippingAddress.state} - {trackedOrder.shippingAddress.postalCode}</p>
                <p>Contact: {trackedOrder.shippingAddress.phone}</p>
                <div className="pt-2 border-t border-[#DCD3C7] flex items-center gap-2 text-[11px] text-[#1E1714] font-medium">
                  <Calendar className="w-3.5 h-3.5 text-[#8C7A6B]" />
                  <span>Estimated Delivery: {trackedOrder.estimatedDelivery || '3-4 Business Days'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
