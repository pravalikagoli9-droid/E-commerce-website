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
  CheckCircle2
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
        <h2 className="font-serif text-3xl text-[#392C2A]">Your Shopping Cart is Empty</h2>
        <p className="text-xs text-[#7D6B67]">Please add items to your cart before proceeding to checkout.</p>
        <button
          onClick={() => setCurrentPage('shop')}
          className="px-6 py-2.5 bg-[#C9878D] hover:bg-[#B56F75] text-white text-xs uppercase tracking-[0.2em] font-semibold transition-colors rounded-sm shadow-xs cursor-pointer"
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
      setCouponError(res.error || 'Invalid promo code');
    } else {
      setCouponCode('');
    }
  };

  const handleCreateOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !email || !phone || !addressLine1 || !city || !postalCode) {
      showToast('Please complete all shipping address fields.', 'error');
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
        phone,
        isDefault: true
      };

      const orderPayload = {
        shippingAddress,
        paymentMethod,
        customerEmail: email
      };

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(user ? { Authorization: `Bearer ${localStorage.getItem('elixir_token')}` } : {})
        },
        body: JSON.stringify(orderPayload)
      });

      const data = await res.json();

      if (!res.ok) {
        showToast(data.error || 'Could not create order. Please try again.', 'error');
        setIsProcessing(false);
        return;
      }

      if (paymentMethod === 'COD') {
        clearCart();
        setActiveOrder(data.order);
        setCurrentPage('order-confirmation');
        showToast('Your order has been placed successfully!', 'success');
      } else {
        setPendingOrderId(data.order.id);
        setPaymentModalOpen(true);
      }
    } catch {
      showToast('Error creating order. Please check your network connection.', 'error');
    } finally {
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
        showToast('Payment verified! Your order has been placed.', 'success');
      } else {
        showToast(data.error || 'Payment verification failed.', 'error');
      }
    } catch {
      showToast('Payment verification error. Please contact customer support.', 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Editorial Title */}
      <div className="border-b border-[#E8DED4] pb-6">
        <span className="text-xs tracking-[0.25em] uppercase text-[#C9878D] font-semibold">
          Secure Checkout
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl text-[#392C2A] mt-1 font-normal">
          Complete Your Order
        </h1>
      </div>

      <form onSubmit={handleCreateOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Left Form: Delivery & Payment Details */}
        <div className="lg:col-span-7 space-y-10">
          {/* 1. Client Contact */}
          <div className="space-y-4 bg-[#FFFDF9] p-6 border border-[#E8DED4] rounded-sm shadow-2xs">
            <h2 className="font-serif text-xl text-[#392C2A] flex items-center gap-2">
              <span className="font-mono text-xs text-[#C9878D] font-semibold">01.</span>
              <span>Contact Information</span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block text-[#7D6B67] mb-1 uppercase tracking-wider font-semibold">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Eleanor Vance"
                  value={fullName}
                  onChange={e => setFullName(e.target.value)}
                  className="w-full bg-[#FAF7F2] border border-[#E8DED4] px-3.5 py-2.5 text-[#392C2A] placeholder-[#998] focus:outline-none focus:border-[#C9878D] rounded-sm"
                />
              </div>

              <div>
                <label className="block text-[#7D6B67] mb-1 uppercase tracking-wider font-semibold">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full bg-[#FAF7F2] border border-[#E8DED4] px-3.5 py-2.5 text-[#392C2A] placeholder-[#998] focus:outline-none focus:border-[#C9878D] rounded-sm"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-[#7D6B67] mb-1 uppercase tracking-wider font-semibold">
                  Phone Number
                </label>
                <input
                  type="tel"
                  required
                  placeholder="+91 98200 12345"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  className="w-full bg-[#FAF7F2] border border-[#E8DED4] px-3.5 py-2.5 text-[#392C2A] placeholder-[#998] focus:outline-none focus:border-[#C9878D] rounded-sm"
                />
              </div>
            </div>
          </div>

          {/* 2. Delivery Address */}
          <div className="space-y-4 bg-[#FFFDF9] p-6 border border-[#E8DED4] rounded-sm shadow-2xs">
            <h2 className="font-serif text-xl text-[#392C2A] flex items-center gap-2">
              <span className="font-mono text-xs text-[#C9878D] font-semibold">02.</span>
              <span>Shipping Address</span>
            </h2>
            <div className="space-y-4 text-xs">
              <div>
                <label className="block text-[#7D6B67] mb-1 uppercase tracking-wider font-semibold">
                  Street Address Line 1
                </label>
                <input
                  type="text"
                  required
                  placeholder="Apartment, suite, unit, building, street address"
                  value={addressLine1}
                  onChange={e => setAddressLine1(e.target.value)}
                  className="w-full bg-[#FAF7F2] border border-[#E8DED4] px-3.5 py-2.5 text-[#392C2A] placeholder-[#998] focus:outline-none focus:border-[#C9878D] rounded-sm"
                />
              </div>

              <div>
                <label className="block text-[#7D6B67] mb-1 uppercase tracking-wider font-semibold">
                  Address Line 2 (Optional)
                </label>
                <input
                  type="text"
                  placeholder="Apartment number, floor, landmark"
                  value={addressLine2}
                  onChange={e => setAddressLine2(e.target.value)}
                  className="w-full bg-[#FAF7F2] border border-[#E8DED4] px-3.5 py-2.5 text-[#392C2A] placeholder-[#998] focus:outline-none focus:border-[#C9878D] rounded-sm"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-[#7D6B67] mb-1 uppercase tracking-wider font-semibold">
                    City
                  </label>
                  <input
                    type="text"
                    required
                    value={city}
                    onChange={e => setCity(e.target.value)}
                    className="w-full bg-[#FAF7F2] border border-[#E8DED4] px-3.5 py-2.5 text-[#392C2A] placeholder-[#998] focus:outline-none focus:border-[#C9878D] rounded-sm"
                  />
                </div>
                <div>
                  <label className="block text-[#7D6B67] mb-1 uppercase tracking-wider font-semibold">
                    State
                  </label>
                  <input
                    type="text"
                    required
                    value={state}
                    onChange={e => setState(e.target.value)}
                    className="w-full bg-[#FAF7F2] border border-[#E8DED4] px-3.5 py-2.5 text-[#392C2A] placeholder-[#998] focus:outline-none focus:border-[#C9878D] rounded-sm"
                  />
                </div>
                <div>
                  <label className="block text-[#7D6B67] mb-1 uppercase tracking-wider font-semibold">
                    Postal / Zip Code
                  </label>
                  <input
                    type="text"
                    required
                    value={postalCode}
                    onChange={e => setPostalCode(e.target.value)}
                    className="w-full bg-[#FAF7F2] border border-[#E8DED4] px-3.5 py-2.5 text-[#392C2A] placeholder-[#998] focus:outline-none focus:border-[#C9878D] rounded-sm"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* 3. Payment Method */}
          <div className="space-y-4 bg-[#FFFDF9] p-6 border border-[#E8DED4] rounded-sm shadow-2xs">
            <h2 className="font-serif text-xl text-[#392C2A] flex items-center gap-2">
              <span className="font-mono text-xs text-[#C9878D] font-semibold">03.</span>
              <span>Payment Method</span>
            </h2>

            <div className="space-y-3">
              {/* Razorpay UPI */}
              <label
                onClick={() => setPaymentMethod('RAZORPAY_UPI')}
                className={`p-4 border flex items-start gap-4 cursor-pointer transition-colors rounded-sm ${
                  paymentMethod === 'RAZORPAY_UPI'
                    ? 'bg-[#FAF7F2] border-[#C9878D]'
                    : 'bg-[#FFFDF9] border-[#E8DED4] hover:border-[#C9878D]'
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  checked={paymentMethod === 'RAZORPAY_UPI'}
                  onChange={() => setPaymentMethod('RAZORPAY_UPI')}
                  className="mt-1 accent-[#C9878D]"
                />
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-sm font-medium text-[#392C2A]">
                    <QrCode className="w-4 h-4 text-[#C9878D]" />
                    <span>UPI (Google Pay, PhonePe, Paytm, QR Code)</span>
                  </div>
                  <p className="text-xs text-[#7D6B67]">
                    Zero fees · Instant confirmation via UPI payment methods.
                  </p>
                </div>
              </label>

              {/* Razorpay Cards */}
              <label
                onClick={() => setPaymentMethod('RAZORPAY_CARD')}
                className={`p-4 border flex items-start gap-4 cursor-pointer transition-colors rounded-sm ${
                  paymentMethod === 'RAZORPAY_CARD'
                    ? 'bg-[#FAF7F2] border-[#C9878D]'
                    : 'bg-[#FFFDF9] border-[#E8DED4] hover:border-[#C9878D]'
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  checked={paymentMethod === 'RAZORPAY_CARD'}
                  onChange={() => setPaymentMethod('RAZORPAY_CARD')}
                  className="mt-1 accent-[#C9878D]"
                />
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-sm font-medium text-[#392C2A]">
                    <CreditCard className="w-4 h-4 text-[#C9878D]" />
                    <span>Credit / Debit Cards & Net Banking</span>
                  </div>
                  <p className="text-xs text-[#7D6B67]">
                    Visa, Mastercard, American Express, and all major banks.
                  </p>
                </div>
              </label>

              {/* Cash On Delivery */}
              <label
                onClick={() => setPaymentMethod('COD')}
                className={`p-4 border flex items-start gap-4 cursor-pointer transition-colors rounded-sm ${
                  paymentMethod === 'COD'
                    ? 'bg-[#FAF7F2] border-[#C9878D]'
                    : 'bg-[#FFFDF9] border-[#E8DED4] hover:border-[#C9878D]'
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  checked={paymentMethod === 'COD'}
                  onChange={() => setPaymentMethod('COD')}
                  className="mt-1 accent-[#C9878D]"
                />
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-sm font-medium text-[#392C2A]">
                    <Truck className="w-4 h-4 text-[#C9878D]" />
                    <span>Cash on Delivery</span>
                  </div>
                  <p className="text-xs text-[#7D6B67]">
                    Pay directly in cash or UPI upon delivery.
                  </p>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Right Column: Order Summary & Place Order */}
        <div className="lg:col-span-5 bg-[#FFFDF9] border border-[#E8DED4] p-6 sm:p-8 space-y-6 sticky top-28 rounded-sm shadow-xs">
          <h2 className="font-serif text-2xl text-[#392C2A] pb-3 border-b border-[#E8DED4]">
            Order Summary
          </h2>

          {/* Cart Items list */}
          <div className="space-y-4 max-h-72 overflow-y-auto divide-y divide-[#E8DED4]">
            {cartItems.map((item, idx) => (
              <div key={idx} className="pt-3 first:pt-0 flex items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-14 bg-[#FAF7F2] border border-[#E8DED4] overflow-hidden shrink-0 rounded-xs">
                    <img
                      src={item.product.images[0] || ''}
                      alt=""
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <p className="font-serif text-sm text-[#392C2A] line-clamp-1 font-medium">{item.product.name}</p>
                    <p className="text-[#7D6B67]">Qty: {item.quantity} {item.selectedVariant ? `· ${item.selectedVariant}` : ''}</p>
                  </div>
                </div>
                <span className="font-mono text-[#392C2A] tabular-nums font-semibold">
                  ₹{(item.product.price * item.quantity).toLocaleString('en-US')}
                </span>
              </div>
            ))}
          </div>

          {/* Coupon Input */}
          <div className="pt-4 border-t border-[#E8DED4]">
            {appliedCoupon ? (
              <div className="flex items-center justify-between p-2.5 bg-[#FAF7F2] border border-[#E8DED4] text-xs rounded-sm">
                <div className="flex items-center gap-2 text-[#C9878D]">
                  <Tag className="w-3.5 h-3.5" />
                  <span className="font-mono font-semibold">{appliedCoupon.code}</span>
                  <span>(-₹{cartDiscount.toLocaleString('en-US')})</span>
                </div>
                <button
                  type="button"
                  onClick={removeCoupon}
                  className="text-[#7D6B67] hover:text-[#392C2A] underline cursor-pointer"
                >
                  Remove
                </button>
              </div>
            ) : (
              <div className="space-y-1">
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Promo Code"
                    value={couponCode}
                    onChange={e => setCouponCode(e.target.value)}
                    className="flex-1 bg-[#FAF7F2] border border-[#E8DED4] px-3 py-2 text-xs text-[#392C2A] placeholder-[#998] uppercase font-mono focus:outline-none focus:border-[#C9878D] rounded-sm"
                  />
                  <button
                    type="button"
                    onClick={handleApplyCoupon}
                    className="px-4 py-2 border border-[#E8DED4] bg-[#E8D8C8] hover:bg-[#DECABE] text-xs uppercase tracking-wider text-[#392C2A] font-semibold rounded-sm cursor-pointer"
                  >
                    Apply
                  </button>
                </div>
                {couponError && <p className="text-[11px] text-[#D97979]">{couponError}</p>}
              </div>
            )}
          </div>

          {/* Cost breakdown */}
          <div className="space-y-2 text-xs text-[#7D6B67] pt-4 border-t border-[#E8DED4]">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="font-mono text-[#392C2A] tabular-nums font-medium">
                ₹{cartSubtotal.toLocaleString('en-US')}
              </span>
            </div>
            {cartDiscount > 0 && (
              <div className="flex justify-between text-[#C9878D]">
                <span>Promo Discount</span>
                <span className="font-mono tabular-nums font-semibold">
                  -₹{cartDiscount.toLocaleString('en-US')}
                </span>
              </div>
            )}
            <div className="flex justify-between">
              <span>Shipping</span>
              <span className="font-mono text-[#392C2A] tabular-nums">
                {cartShippingFee === 0 ? 'Free' : `₹${cartShippingFee.toLocaleString('en-US')}`}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Estimated Tax (3%)</span>
              <span className="font-mono text-[#392C2A] tabular-nums">
                ₹{cartTax.toLocaleString('en-US')}
              </span>
            </div>
            <div className="flex justify-between text-base font-serif text-[#392C2A] pt-3 border-t border-[#E8DED4]">
              <span>Final Total</span>
              <span className="font-mono text-[#392C2A] tabular-nums text-lg font-bold">
                ₹{cartTotal.toLocaleString('en-US')}
              </span>
            </div>
          </div>

          {/* Submit CTA */}
          <button
            type="submit"
            disabled={isProcessing}
            className="w-full py-4 bg-[#C9878D] hover:bg-[#B56F75] text-white text-xs font-semibold tracking-[0.2em] uppercase transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-md rounded-sm"
          >
            <Lock className="w-4 h-4" />
            <span>
              {isProcessing
                ? 'Processing Order...'
                : paymentMethod === 'COD'
                ? 'Confirm Order'
                : `Pay ₹${cartTotal.toLocaleString('en-US')}`}
            </span>
          </button>

          <p className="text-[11px] text-[#7D6B67] text-center flex items-center justify-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-[#C9878D]" />
            Encrypted by 256-Bit SSL Protocols
          </p>
        </div>
      </form>

      {/* Payment Gateway Modal Simulation */}
      {paymentModalOpen && pendingOrderId && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-[#392C2A]/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#FAF7F2] border border-[#E8DED4] shadow-2xl p-6 sm:p-8 space-y-6 text-[#392C2A] rounded-sm">
            <div className="flex items-center justify-between border-b border-[#E8DED4] pb-4">
              <div>
                <span className="text-[10px] tracking-[0.2em] uppercase text-[#C9878D] font-mono font-semibold">
                  Secure Payment Gateway
                </span>
                <h3 className="font-serif text-xl text-[#392C2A]">ÉLIXIR & NOIR</h3>
              </div>
              <span className="font-mono text-xs text-[#7D6B67]">Demo Gateway</span>
            </div>

            <div className="p-4 bg-[#FFFDF9] border border-[#E8DED4] space-y-1 rounded-sm">
              <span className="text-xs text-[#7D6B67]">Amount to Authorize:</span>
              <p className="font-mono text-2xl text-[#392C2A] tabular-nums font-bold">
                ₹{cartTotal.toLocaleString('en-US')}
              </p>
            </div>

            {paymentMethod === 'RAZORPAY_UPI' ? (
              <div className="space-y-4 text-xs">
                <p className="text-[#7D6B67]">Scan with any UPI App or enter your UPI ID:</p>
                <div className="flex justify-center p-4 bg-white border border-[#E8DED4] rounded-md max-w-[180px] mx-auto shadow-xs">
                  <div className="w-36 h-36 bg-[#FAF7F2] border border-[#E8DED4] flex flex-col items-center justify-center text-[#392C2A] text-[10px] p-2 text-center rounded-sm">
                    <QrCode className="w-16 h-16 text-[#C9878D] mb-1" />
                    <span className="font-mono text-[9px]">UPI://PAY?PA=ELIXIR@ICICI</span>
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-[#7D6B67] uppercase font-semibold">UPI ID:</label>
                  <input
                    type="text"
                    value={upiId}
                    onChange={e => setUpiId(e.target.value)}
                    className="w-full bg-[#FFFDF9] border border-[#E8DED4] px-3 py-2 text-[#392C2A] font-mono rounded-sm"
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-3 text-xs">
                <div>
                  <label className="text-[#7D6B67] uppercase font-semibold">Card Number</label>
                  <input
                    type="text"
                    value={cardNumber}
                    onChange={e => setCardNumber(e.target.value)}
                    className="w-full bg-[#FFFDF9] border border-[#E8DED4] px-3 py-2 text-[#392C2A] font-mono rounded-sm"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[#7D6B67] uppercase font-semibold">Expiry Date</label>
                    <input
                      type="text"
                      value={cardExpiry}
                      onChange={e => setCardExpiry(e.target.value)}
                      className="w-full bg-[#FFFDF9] border border-[#E8DED4] px-3 py-2 text-[#392C2A] font-mono rounded-sm"
                    />
                  </div>
                  <div>
                    <label className="text-[#7D6B67] uppercase font-semibold">CVV</label>
                    <input
                      type="password"
                      value={cardCvv}
                      onChange={e => setCardCvv(e.target.value)}
                      className="w-full bg-[#FFFDF9] border border-[#E8DED4] px-3 py-2 text-[#392C2A] font-mono rounded-sm"
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
                className="w-full py-3.5 bg-[#C9878D] hover:bg-[#B56F75] text-white text-xs font-semibold tracking-[0.2em] uppercase transition-colors cursor-pointer flex items-center justify-center gap-2 rounded-sm shadow-md"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Simulate Successful Payment</span>
              </button>

              <button
                onClick={() => setPaymentModalOpen(false)}
                className="w-full py-2.5 border border-[#E8DED4] text-xs text-[#7D6B67] hover:text-[#392C2A] uppercase tracking-wider transition-colors cursor-pointer rounded-sm"
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
