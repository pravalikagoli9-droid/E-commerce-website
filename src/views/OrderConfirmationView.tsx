import React from 'react';
import { useStore } from '../context/StoreContext';
import {
  CheckCircle,
  Truck,
  ArrowRight,
  Printer
} from 'lucide-react';

export const OrderConfirmationView: React.FC = () => {
  const { activeOrder, setCurrentPage } = useStore();

  if (!activeOrder) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-24 text-center space-y-4">
        <h2 className="font-serif text-3xl text-[#392C2A]">No Active Order Found</h2>
        <p className="text-xs text-[#7D6B67]">Please check your order history in Your Account.</p>
        <button
          onClick={() => setCurrentPage('account')}
          className="px-6 py-2.5 bg-[#C9878D] hover:bg-[#B56F75] text-white text-xs uppercase tracking-[0.2em] font-semibold rounded-sm shadow-xs cursor-pointer"
        >
          View Your Account
        </button>
      </div>
    );
  }

  const steps = [
    { title: 'Order Confirmed', desc: 'Order received & paid', completed: true },
    {
      title: 'Atelier Packaging',
      desc: 'Hand-packaged in signature gift box',
      completed: ['PROCESSING', 'SHIPPED', 'DELIVERED'].includes(activeOrder.orderStatus)
    },
    {
      title: 'In Transit',
      desc: activeOrder.trackingNumber || 'Tracking assigned',
      completed: ['SHIPPED', 'DELIVERED'].includes(activeOrder.orderStatus)
    },
    {
      title: 'Delivered',
      desc: 'Handed over to recipient',
      completed: activeOrder.orderStatus === 'DELIVERED'
    }
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Top Banner */}
      <div className="text-center space-y-4 border-b border-[#E8DED4] pb-10">
        <div className="w-12 h-12 bg-[#E8D8C8] border border-[#E8DED4] rounded-full flex items-center justify-center mx-auto text-[#392C2A]">
          <CheckCircle className="w-6 h-6 text-[#C9878D]" />
        </div>
        <span className="text-xs tracking-[0.28em] uppercase text-[#C9878D] block font-semibold">
          Order Confirmed
        </span>
        <h1 className="font-serif text-3xl sm:text-5xl text-[#392C2A] font-normal">
          Thank you for your order!
        </h1>
        <p className="text-sm text-[#7D6B67] max-w-lg mx-auto leading-relaxed">
          Your order has been recorded under order number{' '}
          <span className="text-[#392C2A] font-mono font-semibold">{activeOrder.orderNumber}</span>.
          A confirmation receipt has been sent to {activeOrder.customerEmail}.
        </p>
      </div>

      {/* Tracking Progression Timeline */}
      <div className="p-6 sm:p-8 bg-[#FFFDF9] border border-[#E8DED4] space-y-6 rounded-sm shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#E8DED4] pb-4">
          <div>
            <span className="text-[10px] tracking-[0.2em] uppercase text-[#7D6B67] block font-semibold">
              Delivery Progress
            </span>
            <p className="font-serif text-lg text-[#392C2A]">Express Courier Status</p>
          </div>
          {activeOrder.trackingNumber && (
            <div className="text-xs font-mono text-[#C9878D] font-semibold">
              Tracking Number: {activeOrder.trackingNumber}
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-6 pt-2">
          {steps.map((st, i) => (
            <div key={i} className="relative space-y-2">
              <div className="flex items-center gap-2">
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-mono font-semibold ${
                    st.completed
                      ? 'bg-[#C9878D] text-white'
                      : 'bg-[#FAF7F2] text-[#7D6B67] border border-[#E8DED4]'
                  }`}
                >
                  {i + 1}
                </div>
                <div
                  className={`h-0.5 flex-1 hidden sm:block ${
                    st.completed ? 'bg-[#C9878D]' : 'bg-[#E8DED4]'
                  }`}
                />
              </div>
              <div>
                <p className={`text-xs font-semibold ${st.completed ? 'text-[#392C2A]' : 'text-[#7D6B67]'}`}>
                  {st.title}
                </p>
                <p className="text-[11px] text-[#7D6B67] mt-0.5">{st.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Order Itemized Summary Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        {/* Left: Ordered Items */}
        <div className="md:col-span-7 bg-[#FFFDF9] border border-[#E8DED4] p-6 space-y-4 rounded-sm shadow-xs">
          <h2 className="font-serif text-xl text-[#392C2A] pb-3 border-b border-[#E8DED4]">
            Ordered Items
          </h2>

          <div className="divide-y divide-[#E8DED4] space-y-3">
            {activeOrder.items.map((it, idx) => (
              <div key={idx} className="pt-3 first:pt-0 flex items-center justify-between gap-4 text-xs">
                <div className="flex items-center gap-3">
                  <div className="w-14 h-16 bg-[#FAF7F2] border border-[#E8DED4] overflow-hidden shrink-0 rounded-xs">
                    <img
                      src={it.productImage || ''}
                      alt=""
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="font-serif text-sm text-[#392C2A] font-medium">{it.productName}</h3>
                    {it.selectedVariant && (
                      <p className="text-[#7D6B67]">{it.selectedVariant}</p>
                    )}
                    <p className="text-[#7D6B67]">Quantity: {it.quantity}</p>
                  </div>
                </div>

                <span className="font-mono text-[#392C2A] tabular-nums font-semibold">
                  ₹{(it.price * it.quantity).toLocaleString('en-US')}
                </span>
              </div>
            ))}
          </div>

          {/* Pricing Totals */}
          <div className="pt-4 border-t border-[#E8DED4] space-y-2 text-xs text-[#7D6B67]">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="font-mono text-[#392C2A] tabular-nums font-medium">
                ₹{activeOrder.subtotal.toLocaleString('en-US')}
              </span>
            </div>
            {activeOrder.discount > 0 && (
              <div className="flex justify-between text-[#C9878D]">
                <span>Promo Discount</span>
                <span className="font-mono tabular-nums font-semibold">
                  -₹{activeOrder.discount.toLocaleString('en-US')}
                </span>
              </div>
            )}
            <div className="flex justify-between">
              <span>Shipping</span>
              <span className="font-mono text-[#392C2A] tabular-nums">
                {activeOrder.shippingFee === 0 ? 'Free' : `₹${activeOrder.shippingFee.toLocaleString('en-US')}`}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Estimated Tax (3%)</span>
              <span className="font-mono text-[#392C2A] tabular-nums">
                ₹{activeOrder.tax.toLocaleString('en-US')}
              </span>
            </div>
            <div className="flex justify-between text-base font-serif text-[#392C2A] pt-2 border-t border-[#E8DED4]">
              <span>Total Paid</span>
              <span className="font-mono text-[#392C2A] tabular-nums text-lg font-bold">
                ₹{activeOrder.totalAmount.toLocaleString('en-US')}
              </span>
            </div>
          </div>
        </div>

        {/* Right: Delivery Address & Courier Notes */}
        <div className="md:col-span-5 space-y-6">
          <div className="bg-[#FFFDF9] border border-[#E8DED4] p-6 space-y-4 text-xs rounded-sm shadow-xs">
            <h2 className="font-serif text-lg text-[#392C2A] pb-2 border-b border-[#E8DED4]">
              Shipping Address
            </h2>
            <div className="space-y-1 text-[#7D6B67] leading-relaxed">
              <p className="text-[#392C2A] font-semibold">{activeOrder.shippingAddress.fullName}</p>
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

            <div className="pt-3 border-t border-[#E8DED4] space-y-1 text-[#7D6B67]">
              <span className="block text-[#392C2A] font-semibold">Payment Details</span>
              <p>Method: {activeOrder.paymentMethod}</p>
              {activeOrder.paymentReference && (
                <p className="font-mono text-[11px]">Reference: {activeOrder.paymentReference}</p>
              )}
            </div>
          </div>

          {/* Action CTAs */}
          <div className="space-y-3">
            <button
              onClick={() => setCurrentPage('shop')}
              className="w-full py-3.5 bg-[#C9878D] hover:bg-[#B56F75] text-white text-xs font-semibold tracking-[0.2em] uppercase transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-md rounded-sm"
            >
              <span>Continue Shopping</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={() => window.print()}
              className="w-full py-3 border border-[#E8DED4] hover:border-[#C9878D] text-xs text-[#7D6B67] hover:text-[#392C2A] uppercase tracking-wider transition-colors flex items-center justify-center gap-2 cursor-pointer rounded-sm"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Order Receipt</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
