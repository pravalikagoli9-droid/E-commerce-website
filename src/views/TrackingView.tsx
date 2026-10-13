import React, { useState } from 'react';
import type { Order } from '../types';
import { useStore } from '../context/StoreContext';
import {
  Search,
  Truck,
  Calendar,
  AlertCircle
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
        setSearchError(data.error || 'No order corresponds to that reference number.');
        setTrackedOrder(null);
      }
    } catch {
      setSearchError('Error connecting to courier tracking system.');
      setTrackedOrder(null);
    } finally {
      setIsSearching(false);
    }
  };

  const stages = [
    { key: 'PLACED', title: 'Order Placed', desc: 'Order received & logged' },
    { key: 'CONFIRMED', title: 'Payment Confirmed', desc: 'Verified and authorized' },
    { key: 'PROCESSING', title: 'Atelier Preparation', desc: 'Packaging & quality check' },
    { key: 'SHIPPED', title: 'In Transit', desc: 'Dispatched via express courier' },
    { key: 'OUT_FOR_DELIVERY', title: 'Out for Delivery', desc: 'With local delivery agent' },
    { key: 'DELIVERED', title: 'Delivered', desc: 'Successfully handed over' }
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
      <div className="text-center space-y-3 border-b border-[#E8DED4] pb-8">
        <div className="w-12 h-12 bg-[#E8D8C8] border border-[#E8DED4] rounded-full flex items-center justify-center mx-auto text-[#392C2A]">
          <Truck className="w-6 h-6 text-[#C9878D]" />
        </div>
        <span className="text-xs tracking-[0.3em] uppercase text-[#C9878D] font-semibold block">
          Order Tracking
        </span>
        <h1 className="font-serif text-3xl sm:text-5xl text-[#392C2A] font-normal">
          Track Your Order
        </h1>
        <p className="text-xs text-[#7D6B67] max-w-md mx-auto leading-relaxed">
          Monitor the packaging, dispatch, and real-time transit status of your shipment.
        </p>
      </div>

      {/* Search Input */}
      <form onSubmit={handleTrack} className="max-w-xl mx-auto space-y-3">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-[#7D6B67] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              required
              placeholder="Enter Order Number (e.g. EN-84920)..."
              value={query}
              onChange={e => setQuery(e.target.value)}
              className="w-full bg-[#FFFDF9] border border-[#E8DED4] pl-10 pr-3.5 py-3 text-xs text-[#392C2A] font-mono uppercase focus:outline-none focus:border-[#C9878D] rounded-sm"
            />
          </div>
          <button
            type="submit"
            disabled={isSearching}
            className="px-6 py-3 bg-[#C9878D] hover:bg-[#B56F75] text-white text-xs uppercase tracking-wider font-semibold transition-colors cursor-pointer shrink-0 rounded-sm shadow-xs"
          >
            {isSearching ? 'Searching...' : 'Track Order'}
          </button>
        </div>

        {searchError && (
          <div className="p-3 bg-[#FAF7F2] border border-[#D97979] text-[#D97979] text-xs flex items-center gap-2 rounded-xs">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{searchError}</span>
          </div>
        )}
      </form>

      {/* Tracked Order Details */}
      {trackedOrder && (
        <div className="bg-[#FFFDF9] border border-[#E8DED4] shadow-xs p-6 sm:p-10 space-y-8 rounded-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-[#E8DED4] gap-3">
            <div>
              <span className="text-[10px] tracking-wider uppercase text-[#7D6B67] font-semibold">Order Number</span>
              <h2 className="font-serif text-2xl text-[#392C2A] font-medium">#{trackedOrder.orderNumber}</h2>
              <p className="text-xs text-[#7D6B67] font-mono mt-0.5">
                Placed on {new Date(trackedOrder.createdAt).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
              </p>
            </div>

            <div className="text-right">
              <span className="text-[10px] tracking-wider uppercase text-[#7D6B67] font-semibold">Tracking Number</span>
              <p className="font-mono text-sm text-[#392C2A] font-semibold">{trackedOrder.trackingNumber || 'Pending Courier Scan'}</p>
              <p className="text-xs text-[#7D6B67]">{trackedOrder.trackingCourier || 'Blue Dart Express'}</p>
            </div>
          </div>

          {/* 6 Stage Timeline */}
          <div className="space-y-4">
            <h3 className="font-serif text-lg text-[#392C2A]">Delivery Timeline</h3>
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
                            ? 'bg-[#C9878D] text-white'
                            : 'bg-[#FAF7F2] text-[#7D6B67] border border-[#E8DED4]'
                        } ${isCurrent ? 'ring-2 ring-[#D6B77A]' : ''}`}
                      >
                        {idx + 1}
                      </div>
                      <div
                        className={`h-0.5 flex-1 hidden md:block ${
                          isPassed ? 'bg-[#C9878D]' : 'bg-[#E8DED4]'
                        }`}
                      />
                    </div>
                    <div>
                      <p className={`text-xs font-medium ${isPassed ? 'text-[#392C2A]' : 'text-[#7D6B67]'}`}>
                        {st.title}
                      </p>
                      <p className="text-[11px] text-[#7D6B67] leading-tight mt-0.5">{st.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Items & Shipping Address Split */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6 border-t border-[#E8DED4] text-xs">
            <div className="space-y-3">
              <h4 className="font-serif text-base text-[#392C2A]">Items in Shipment</h4>
              <div className="space-y-3 divide-y divide-[#E8DED4]">
                {trackedOrder.items.map((it, i) => (
                  <div key={i} className="pt-2 first:pt-0 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <img src={it.productImage || ''} alt="" className="w-10 h-12 object-cover border border-[#E8DED4] rounded-xs" />
                      <div>
                        <p className="font-serif text-sm text-[#392C2A] font-medium">{it.productName}</p>
                        <p className="text-[#7D6B67]">Qty: {it.quantity} {it.selectedVariant ? `· ${it.selectedVariant}` : ''}</p>
                      </div>
                    </div>
                    <span className="font-mono text-[#392C2A] font-semibold tabular-nums">
                      ₹{(it.price * it.quantity).toLocaleString('en-US')}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-serif text-base text-[#392C2A]">Shipping Address</h4>
              <div className="p-4 bg-[#FAF7F2] border border-[#E8DED4] space-y-1 text-[#7D6B67] leading-relaxed rounded-sm">
                <p className="text-[#392C2A] font-semibold">{trackedOrder.shippingAddress.fullName}</p>
                <p>{trackedOrder.shippingAddress.addressLine1}</p>
                {trackedOrder.shippingAddress.addressLine2 && <p>{trackedOrder.shippingAddress.addressLine2}</p>}
                <p>{trackedOrder.shippingAddress.city}, {trackedOrder.shippingAddress.state} - {trackedOrder.shippingAddress.postalCode}</p>
                <p>Phone: {trackedOrder.shippingAddress.phone}</p>
                <div className="pt-2 border-t border-[#E8DED4] flex items-center gap-2 text-[11px] text-[#392C2A] font-medium">
                  <Calendar className="w-3.5 h-3.5 text-[#C9878D]" />
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
