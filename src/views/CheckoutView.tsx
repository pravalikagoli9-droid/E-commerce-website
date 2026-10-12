import React, { useState } from 'react';
import type { Address } from '../types';
import { useStore } from '../context/StoreContext';
import {
  ShieldCheck,
  CreditCard,
  QrCode,
  Truck,
  ArrowRight,
  Lock,
  Tag,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

export const CheckoutView: React.FC = () => {
  const {
    cartItems,
    cartSubtotal,
    cartDiscount,
    cartShippingFee,
    cartTax,
    cartTotal,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    clearCart,
    user,
    setActiveOrder,
    setCurrentPage,
    showToast
  } = useStore();

  const [fullName, setFullName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.addresses?.[0]?.phone || '');
  const [addressLine1, setAddressLine1] = useState(user?.addresses?.[0]?.addressLine1 || '');
  const [addressLine2, setAddressLine2] = useState(user?.addresses?.[0]?.addressLine2 || '');
  const [city, setCity] = useState(user?.addresses?.[0]?.city || 'Mumbai');
  const [state, setState] = useState(user?.addresses?.[0]?.state || 'Maharashtra');
  const [postalCode, setPostalCode] = useState(user?.addresses?.[0]?.postalCode || '400001');

  const [paymentMethod, setPaymentMethod] = useState<'RAZORPAY_UPI' | 'RAZORPAY_CARD' | 'COD'>('RAZORPAY_UPI');
  const [upiId, setUpiId] = useState('client@okaxis');
  const [cardNumber, setCardNumber] = useState('4111 2222 3333 4444');
  const [cardExpiry, setCardExpiry] = useState('12/28');
  const [cardCvv, setCardCvv] = useState('982');

  const [couponCode, setCouponCode] = useState('');
  const [couponError, setCouponError] = useState<string | null>(null);

  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [pendingOrderId, setPendingOrderId] = useState<string | null>(null);

  if (cartItems.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-24 text-center space-y-4">
        <h2 className="font-serif text-3xl text-white">Your Shopping Bag is Empty</h2>
        <p className="text-xs text-[#777]">Please add atelier creations before proceeding to checkout.</p>
        <button
          onClick={() => setCurrentPage('shop')}
          className="px-6 py-2.5 bg-[#F0ECE8] text-[#000000] text-xs uppercase tracking-[0.2em] font-medium"
        >
          Explore Catalog
        </button>
      </div>
    );
  }

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCode.trim()) return;
    setCouponError(null);
    const res = await applyCoupon(couponCode.trim());
    if (!res.success) {
      setCouponError(res.error || 'Invalid code');
    } else {
      setCouponCode('');
    }
  };

  const handleCreateOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !email || !phone || !addressLine1 || !city || !postalCode) {
      showToast('Please complete all delivery address fields.', 'error');
      return;
    }

    setIsProcessing(true);
    try {
      const shippingAddress: Address = {
        id: `addr_${Date.now()}`,
        fullName,
        addressLine1,
        addressLine2,
        city,
        state,
        postalCode,
        country: 'India',
        phone
      };

      const res = await fetch('/api/orders/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(user ? { Authorization: `Bearer ${localStorage.getItem('elixir_token')}` } : {})
        },
        body: JSON.stringify({
          items: cartItems.map(item => ({
            productId: item.productId,
            quantity: item.quantity,
            selectedVariant: item.selectedVariant
          })),
          shippingAddress,
          couponCode: appliedCoupon?.code,
          paymentMethod,
          customerEmail: email
        })
      });

      const data = await res.json();
      if (!res.ok) {
        showToast(data.error || 'Failed to initialize order.', 'error');
        setIsProcessing(false);
        return;
      }

      setPendingOrderId(data.order.id);

      if (paymentMethod === 'COD') {
        // Direct COD approval
        await handlePaymentSuccess(data.order.id, 'cod_verified_signature');
      } else {
        // Open Razorpay payment gateway simulation modal
        setPaymentModalOpen(true);
        setIsProcessing(false);
      }
    } catch (err) {
      console.error(err);
      showToast('Failed to connect to checkout service.', 'error');
      setIsProcessing(false);
    }
  };

  const handlePaymentSuccess = async (orderId: string, paymentRef: string) => {
    setIsProcessing(true);
    try {
      const res = await fetch('/api/orders/verify-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(user ? { Authorization: `Bearer ${localStorage.getItem('elixir_token')}` } : {})
        },
        body: JSON.stringify({
          orderId,
          razorpayPaymentId: paymentRef,
          razorpaySignature: `sig_verified_${Date.now()}`
        })
      });

      const data = await res.json();
      if (res.ok && data.order) {
        clearCart();
        setActiveOrder(data.order);
        setPaymentModalOpen(false);
        setCurrentPage('order-confirmation');
        showToast('Acquisition order successfully placed.', 'success');
      } else {
        showToast(data.error || 'Payment verification failed.', 'error');
      }
    } catch {
      showToast('Payment verification error.', 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Editorial Title */}
      <div className="border-b border-[#1C1C1C] pb-6">
        <span className="text-xs tracking-[0.25em] uppercase text-[#C5A880]">
          Bespoke Checkout
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl text-white mt-1">
          Complete Your Acquisition
        </h1>
      </div>

      <form onSubmit={handleCreateOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Left Form: Delivery & Payment Details */}
        <div className="lg:col-span-7 space-y-10">
          {/* 1. Client Contact */}
          <div className="space-y-4">
            <h2 className="font-serif text-xl text-white flex items-center gap-2">
              <span className="font-mono text-xs text-[#C5A880]">01.</span>
              <span>Client Information</span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block text-[#AAA] mb-1 uppercase tracking-wider">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Eleanor Vance"
                  value={fullName}
                  onChange={e => setFullName(e.target.value)}
                  className="w-full bg-[#0D0D0D] border border-[#262626] px-3.5 py-2.5 text-white placeholder-[#555] focus:outline-none focus:border-[#C5A880]"
                />
              </div>

              <div>
                <label className="block text-[#AAA] mb-1 uppercase tracking-wider">
                  Email Address (Receipt & Tracking)
                </label>
                <input
                  type="email"
                  required
                  placeholder="client@elixirnoir.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full bg-[#0D0D0D] border border-[#262626] px-3.5 py-2.5 text-white placeholder-[#555] focus:outline-none focus:border-[#C5A880]"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-[#AAA] mb-1 uppercase tracking-wider">
                  Telephone Contact (Courier Verification)
                </label>
                <input
                  type="tel"
                  required
                  placeholder="+91 98200 12345"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  className="w-full bg-[#0D0D0D] border border-[#262626] px-3.5 py-2.5 text-white placeholder-[#555] focus:outline-none focus:border-[#C5A880]"
                />
              </div>
            </div>
          </div>

          {/* 2. Delivery Address */}
          <div className="space-y-4">
            <h2 className="font-serif text-xl text-white flex items-center gap-2">
              <span className="font-mono text-xs text-[#C5A880]">02.</span>
              <span>Delivery Sanctuary</span>
            </h2>
            <div className="space-y-4 text-xs">
              <div>
                <label className="block text-[#AAA] mb-1 uppercase tracking-wider">
                  Street Address Line 1
                </label>
                <input
                  type="text"
                  required
                  placeholder="Apartment, Suite, Building Name, Street"
                  value={addressLine1}
                  onChange={e => setAddressLine1(e.target.value)}
                  className="w-full bg-[#0D0D0D] border border-[#262626] px-3.5 py-2.5 text-white placeholder-[#555] focus:outline-none focus:border-[#C5A880]"
                />
              </div>

              <div>
                <label className="block text-[#AAA] mb-1 uppercase tracking-wider">
                  Address Line 2 (Optional)
                </label>
                <input
                  type="text"
                  placeholder="Landmark, Estate Wing"
                  value={addressLine2}
                  onChange={e => setAddressLine2(e.target.value)}
                  className="w-full bg-[#0D0D0D] border border-[#262626] px-3.5 py-2.5 text-white placeholder-[#555] focus:outline-none focus:border-[#C5A880]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-[#AAA] mb-1 uppercase tracking-wider">
                    City
                  </label>
                  <input
                    type="text"
                    required
                    value={city}
                    onChange={e => setCity(e.target.value)}
                    className="w-full bg-[#0D0D0D] border border-[#262626] px-3.5 py-2.5 text-white placeholder-[#555] focus:outline-none focus:border-[#C5A880]"
                  />
                </div>
                <div>
                  <label className="block text-[#AAA] mb-1 uppercase tracking-wider">
                    State
                  </label>
                  <input
                    type="text"
                    required
                    value={state}
                    onChange={e => setState(e.target.value)}
                    className="w-full bg-[#0D0D0D] border border-[#262626] px-3.5 py-2.5 text-white placeholder-[#555] focus:outline-none focus:border-[#C5A880]"
                  />
                </div>
                <div>
                  <label className="block text-[#AAA] mb-1 uppercase tracking-wider">
                    PIN / Postal Code
                  </label>
                  <input
                    type="text"
                    required
                    value={postalCode}
                    onChange={e => setPostalCode(e.target.value)}
                    className="w-full bg-[#0D0D0D] border border-[#262626] px-3.5 py-2.5 text-white placeholder-[#555] focus:outline-none focus:border-[#C5A880]"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* 3. Payment Method */}
          <div className="space-y-4">
            <h2 className="font-serif text-xl text-white flex items-center gap-2">
              <span className="font-mono text-xs text-[#C5A880]">03.</span>
              <span>Payment Method</span>
            </h2>

            <div className="space-y-3">
              {/* Razorpay UPI */}
              <label
                onClick={() => setPaymentMethod('RAZORPAY_UPI')}
                className={`p-4 border flex items-start gap-4 cursor-pointer transition-colors ${
                  paymentMethod === 'RAZORPAY_UPI'
                    ? 'bg-[#141414] border-[#C5A880]'
                    : 'bg-[#0A0A0A] border-[#222] hover:border-[#444]'
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  checked={paymentMethod === 'RAZORPAY_UPI'}
                  onChange={() => setPaymentMethod('RAZORPAY_UPI')}
                  className="mt-1 accent-[#C5A880]"
                />
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-sm font-medium text-white">
                    <QrCode className="w-4 h-4 text-[#C5A880]" />
                    <span>Razorpay UPI (Google Pay, PhonePe, Paytm, QR)</span>
                  </div>
                  <p className="text-xs text-[#888]">
                    Zero gateway fees · Instant confirmation via encrypted Indian UPI protocol.
                  </p>
                </div>
              </label>

              {/* Razorpay Cards */}
              <label
                onClick={() => setPaymentMethod('RAZORPAY_CARD')}
                className={`p-4 border flex items-start gap-4 cursor-pointer transition-colors ${
                  paymentMethod === 'RAZORPAY_CARD'
                    ? 'bg-[#141414] border-[#C5A880]'
                    : 'bg-[#0A0A0A] border-[#222] hover:border-[#444]'
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  checked={paymentMethod === 'RAZORPAY_CARD'}
                  onChange={() => setPaymentMethod('RAZORPAY_CARD')}
                  className="mt-1 accent-[#C5A880]"
                />
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-sm font-medium text-white">
                    <CreditCard className="w-4 h-4 text-[#C5A880]" />
                    <span>Credit / Debit Cards & NetBanking (Razorpay)</span>
                  </div>
                  <p className="text-xs text-[#888]">
                    Visa, Mastercard, American Express, Rupay, and Top Tier Banks.
                  </p>
                </div>
              </label>

              {/* Cash On Delivery */}
              <label
                onClick={() => setPaymentMethod('COD')}
                className={`p-4 border flex items-start gap-4 cursor-pointer transition-colors ${
                  paymentMethod === 'COD'
                    ? 'bg-[#141414] border-[#C5A880]'
                    : 'bg-[#0A0A0A] border-[#222] hover:border-[#444]'
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  checked={paymentMethod === 'COD'}
                  onChange={() => setPaymentMethod('COD')}
                  className="mt-1 accent-[#C5A880]"
                />
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-sm font-medium text-white">
                    <Truck className="w-4 h-4 text-[#C5A880]" />
                    <span>Bespoke Concierge Delivery (Cash on Delivery)</span>
                  </div>
                  <p className="text-xs text-[#888]">
                    Remit directly to our white glove courier upon inspected delivery.
                  </p>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Right Column: Order Summary & Place Order */}
        <div className="lg:col-span-5 bg-[#0A0A0A] border border-[#222] p-6 sm:p-8 space-y-6 sticky top-28">
          <h2 className="font-serif text-2xl text-white pb-3 border-b border-[#1C1C1C]">
            Acquisitions Summary
          </h2>

          {/* Cart Items list */}
          <div className="space-y-4 max-h-72 overflow-y-auto divide-y divide-[#181818]">
            {cartItems.map((item, idx) => (
              <div key={idx} className="pt-3 first:pt-0 flex items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-14 bg-[#141414] border border-[#262626] overflow-hidden shrink-0">
                    <img
                      src={item.product.images[0] || ''}
                      alt=""
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <p className="font-serif text-sm text-white line-clamp-1">{item.product.name}</p>
                    <p className="text-[#777]">Qty: {item.quantity} {item.selectedVariant ? `· ${item.selectedVariant}` : ''}</p>
                  </div>
                </div>
                <span className="font-mono text-[#C5A880] tabular-nums">
                  ₹{(item.product.price * item.quantity).toLocaleString('en-IN')}
                </span>
              </div>
            ))}
          </div>

          {/* Coupon Input */}
          <div className="pt-4 border-t border-[#1C1C1C]">
            {appliedCoupon ? (
              <div className="flex items-center justify-between p-2.5 bg-[#141414] border border-[#262626] text-xs">
                <div className="flex items-center gap-2 text-[#C5A880]">
                  <Tag className="w-3.5 h-3.5" />
                  <span className="font-mono">{appliedCoupon.code}</span>
                  <span>(-₹{cartDiscount.toLocaleString('en-IN')})</span>
                </div>
                <button
                  type="button"
                  onClick={removeCoupon}
                  className="text-[#888] hover:text-white underline"
                >
                  Remove
                </button>
              </div>
            ) : (
              <div className="space-y-1">
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Coupon Code"
                    value={couponCode}
                    onChange={e => setCouponCode(e.target.value)}
                    className="flex-1 bg-[#121212] border border-[#2B2B2B] px-3 py-2 text-xs text-white placeholder-[#555] uppercase font-mono focus:outline-none focus:border-[#C5A880]"
                  />
                  <button
                    type="button"
                    onClick={handleApplyCoupon}
                    className="px-4 py-2 border border-[#333] hover:border-[#666] text-xs uppercase tracking-wider text-[#CCC] hover:text-white"
                  >
                    Apply
                  </button>
                </div>
                {couponError && <p className="text-[11px] text-[#A86464]">{couponError}</p>}
              </div>
            )}
          </div>

          {/* Cost breakdown */}
          <div className="space-y-2 text-xs text-[#8A857D] pt-4 border-t border-[#1C1C1C]">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="font-mono text-white tabular-nums">
                ₹{cartSubtotal.toLocaleString('en-IN')}
              </span>
            </div>
            {cartDiscount > 0 && (
              <div className="flex justify-between text-[#C5A880]">
                <span>Privilege Discount</span>
                <span className="font-mono tabular-nums">
                  -₹{cartDiscount.toLocaleString('en-IN')}
                </span>
              </div>
            )}
            <div className="flex justify-between">
              <span>White Glove Delivery</span>
              <span className="font-mono text-white tabular-nums">
                {cartShippingFee === 0 ? 'Complimentary' : `₹${cartShippingFee.toLocaleString('en-IN')}`}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Estimated GST (3%)</span>
              <span className="font-mono text-white tabular-nums">
                ₹{cartTax.toLocaleString('en-IN')}
              </span>
            </div>
            <div className="flex justify-between text-base font-serif text-white pt-3 border-t border-[#1C1C1C]">
              <span>Final Total</span>
              <span className="font-mono text-[#C5A880] tabular-nums text-lg">
                ₹{cartTotal.toLocaleString('en-IN')}
              </span>
            </div>
          </div>

          {/* Submit CTA */}
          <button
            type="submit"
            disabled={isProcessing}
            className="w-full py-4 bg-[#F0ECE8] hover:bg-white text-[#000000] text-xs font-semibold tracking-[0.2em] uppercase transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xl"
          >
            <Lock className="w-4 h-4" />
            <span>
              {isProcessing
                ? 'Validating Order...'
                : paymentMethod === 'COD'
                ? 'Confirm Concierge Order'
                : `Authorize ₹${cartTotal.toLocaleString('en-IN')}`}
            </span>
          </button>

          <p className="text-[11px] text-[#666] text-center flex items-center justify-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-[#C5A880]" />
            Encrypted by 256-Bit Razorpay Atelier Protocols
          </p>
        </div>
      </form>

      {/* Razorpay Gateway Modal Simulation */}
      {paymentModalOpen && pendingOrderId && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#0F0F0F] border border-[#2B2B2B] shadow-2xl p-6 sm:p-8 space-y-6 text-[#F0ECE8]">
            <div className="flex items-center justify-between border-b border-[#222] pb-4">
              <div>
                <span className="text-[10px] tracking-[0.2em] uppercase text-[#C5A880] font-mono">
                  Razorpay Secure Gateway
                </span>
                <h3 className="font-serif text-xl text-white">ÉLIXIR & NOIR S.A.</h3>
              </div>
              <span className="font-mono text-xs text-[#777]">Test Mode</span>
            </div>

            <div className="p-4 bg-[#141414] border border-[#222] space-y-1">
              <span className="text-xs text-[#888]">Amount to Authorize:</span>
              <p className="font-mono text-2xl text-[#C5A880] tabular-nums">
                ₹{cartTotal.toLocaleString('en-IN')}
              </p>
            </div>

            {paymentMethod === 'RAZORPAY_UPI' ? (
              <div className="space-y-4 text-xs">
                <p className="text-[#AAA]">Scan with any Indian UPI App or enter VPA:</p>
                <div className="flex justify-center p-4 bg-white rounded-md max-w-[180px] mx-auto">
                  {/* Visual QR Code Mock */}
                  <div className="w-36 h-36 bg-black flex flex-col items-center justify-center text-white text-[10px] p-2 text-center">
                    <QrCode className="w-16 h-16 text-white mb-1" />
                    <span>UPI://PAY?PA=ELIXIR@ICICI</span>
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-[#888]">Virtual Payment Address (UPI ID):</label>
                  <input
                    type="text"
                    value={upiId}
                    onChange={e => setUpiId(e.target.value)}
                    className="w-full bg-[#181818] border border-[#333] px-3 py-2 text-white font-mono"
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-3 text-xs">
                <div>
                  <label className="text-[#888]">Card Number</label>
                  <input
                    type="text"
                    value={cardNumber}
                    onChange={e => setCardNumber(e.target.value)}
                    className="w-full bg-[#181818] border border-[#333] px-3 py-2 text-white font-mono"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[#888]">Expiry</label>
                    <input
                      type="text"
                      value={cardExpiry}
                      onChange={e => setCardExpiry(e.target.value)}
                      className="w-full bg-[#181818] border border-[#333] px-3 py-2 text-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-[#888]">CVV</label>
                    <input
                      type="password"
                      value={cardCvv}
                      onChange={e => setCardCvv(e.target.value)}
                      className="w-full bg-[#181818] border border-[#333] px-3 py-2 text-white font-mono"
                    />
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-2 pt-2">
              <button
                onClick={() =>
                  handlePaymentSuccess(pendingOrderId, `pay_rzp_${Date.now()}`)
                }
                disabled={isProcessing}
                className="w-full py-3.5 bg-[#C5A880] hover:bg-[#D4BC96] text-black text-xs font-semibold tracking-[0.2em] uppercase transition-colors cursor-pointer flex items-center justify-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Simulate Successful Payment</span>
              </button>

              <button
                onClick={() => setPaymentModalOpen(false)}
                className="w-full py-2.5 border border-[#333] text-xs text-[#888] hover:text-white uppercase tracking-wider transition-colors"
              >
                Cancel Transaction
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
