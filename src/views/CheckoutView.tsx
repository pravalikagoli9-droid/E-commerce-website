import React, { useState } from 'react';
import type { Address } from '../types';
import { useStore } from '../context/StoreContext';
import { saveOrderToFirestore } from '../services/firebaseFirestore';
import {
  ShieldCheck,
  CreditCard,
  QrCode,
  Truck,
  ArrowRight,
  Lock,
  Tag,
  CheckCircle2,
  Info,
  AlertCircle,
  Sparkles
} from 'lucide-react';
import { getProductImageUrl, handleImageError } from '../utils/imageUrl';

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
  const [upiId, setUpiId] = useState('patron.velmora@okhdfcbank');
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
      showToast('Kindly complete all shipping address fields before proceeding.', 'error');
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
        items: cartItems.map(item => ({
          productId: item.productId || item.product?.id,
          productName: item.product?.name,
          quantity: item.quantity,
          selectedVariant: item.selectedVariant
        })),
        couponCode: appliedCoupon?.code,
        shippingAddress,
        paymentMethod,
        customerEmail: email
      };

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(user ? { Authorization: `Bearer ${localStorage.getItem('velmora_token') || localStorage.getItem('elixir_token')}` } : {})
        },
        body: JSON.stringify(orderPayload)
      });

      const data = await res.json();

      if (!res.ok) {
        showToast(data.error || 'Could not place order. Kindly try again.', 'error');
        setIsProcessing(false);
        return;
      }

      // Persist order asynchronously to Cloud Firestore
      if (data.order) {
        saveOrderToFirestore(data.order).catch(err => {
          console.warn('Could not record order in Cloud Firestore:', err);
        });
      }

      if (paymentMethod === 'COD') {
        clearCart();
        setActiveOrder(data.order);
        setCurrentPage('order-confirmation');
        showToast('Your order has been placed successfully via Cash on Delivery! Kindly note your tracking reference.', 'success');
      } else {
        setPendingOrderId(data.order.id);
        setPaymentModalOpen(true);
      }
    } catch {
      showToast('Error creating order. Kindly check your internet connection.', 'error');
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
          ...(user ? { Authorization: `Bearer ${localStorage.getItem('velmora_token') || localStorage.getItem('elixir_token')}` } : {})
        },
        body: JSON.stringify({
          orderId,
          razorpayPaymentId: paymentRef,
          razorpaySignature: `sig_demo_verified_${Date.now()}`
        })
      });

      const data = await res.json();
      if (res.ok && data.order) {
        // Update order in Firestore as PAID
        saveOrderToFirestore(data.order).catch(console.warn);

        clearCart();
        setActiveOrder(data.order);
        setPaymentModalOpen(false);
        setCurrentPage('order-confirmation');
        showToast('Payment verified successfully in demo mode! Your order has been placed.', 'success');
      } else {
        showToast(data.error || 'Payment verification failed. Kindly try again.', 'error');
      }
    } catch {
      showToast('Payment verification error. Kindly contact customer concierge.', 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSimulateFailure = () => {
    showToast('Payment Simulation: Transaction declined for testing purposes. No charges were incurred.', 'error');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Editorial Title */}
      <div className="border-b border-[#E8DED4] pb-6 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <span className="text-xs tracking-[0.25em] uppercase text-[#C9878D] font-semibold">
            Secure Checkout
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl text-[#392C2A] mt-1 font-normal">
            Complete Your Order
          </h1>
        </div>

        {/* Demo Payment Mode Badge in Header */}
        <div className="flex items-center gap-2 bg-[#FAF7F2] border border-[#D6B77A]/50 px-3.5 py-2 rounded-xs shadow-2xs">
          <span className="w-2 h-2 rounded-full bg-[#16A34A] animate-pulse"></span>
          <span className="text-[11px] font-mono uppercase tracking-wider text-[#5A3E36] font-semibold">
            Demo Payment Mode Active
          </span>
        </div>
      </div>

      {/* Prominent Demo Mode Information Banner */}
      <div className="bg-[#FAF7F2] border-l-4 border-[#D6B77A] border-t border-r border-b border-[#E8DED4] p-4 sm:p-5 rounded-sm shadow-2xs">
        <div className="flex items-start gap-3">
          <div className="w-7 h-7 rounded-full bg-[#E8D8C8] text-[#5A3E36] flex items-center justify-center shrink-0 mt-0.5 border border-[#D6B77A]/40">
            <Info className="w-4 h-4 text-[#5A3E36]" />
          </div>
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-serif text-sm font-medium text-[#392C2A]">
                Sandbox Demo Payment Mode (Razorpay Optional)
              </span>
              <span className="px-2 py-0.5 text-[9px] font-mono uppercase tracking-wider bg-[#FFFDF9] text-[#7D6B67] border border-[#E8DED4] rounded-xs font-semibold">
                Development & Testing
              </span>
            </div>
            <p className="text-xs text-[#7D6B67] leading-relaxed">
              Razorpay credentials (<code className="font-mono text-[11px] text-[#5A3E36] bg-[#FFFDF9] px-1 py-0.5 border border-[#E8DED4] rounded-2xs">RAZORPAY_KEY_ID</code>) are completely optional. You can safely simulate UPI and Card payments, test real order generation, verify inventory deductions, sync to Firestore, and track the Blue Dart dispatch without any monetary deduction.
            </p>
          </div>
        </div>
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
                <div className="space-y-1 w-full">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 text-sm font-medium text-[#392C2A]">
                      <QrCode className="w-4 h-4 text-[#C9878D]" />
                      <span>UPI (Google Pay, PhonePe, Paytm, QR Code)</span>
                    </div>
                    <span className="px-2 py-0.5 text-[9px] font-mono uppercase tracking-wider bg-[#E8D8C8] text-[#5A3E36] border border-[#D6B77A]/40 rounded-xs font-semibold">
                      Demo Sandbox
                    </span>
                  </div>
                  <p className="text-xs text-[#7D6B67]">
                    Simulated instant authorization · Zero fees · No real bank account debited.
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
                <div className="space-y-1 w-full">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 text-sm font-medium text-[#392C2A]">
                      <CreditCard className="w-4 h-4 text-[#C9878D]" />
                      <span>Credit / Debit Cards & Net Banking</span>
                    </div>
                    <span className="px-2 py-0.5 text-[9px] font-mono uppercase tracking-wider bg-[#E8D8C8] text-[#5A3E36] border border-[#D6B77A]/40 rounded-xs font-semibold">
                      Demo Sandbox
                    </span>
                  </div>
                  <p className="text-xs text-[#7D6B67]">
                    Visa, Mastercard, RuPay & American Express · Sandbox test gateway.
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
                <div className="space-y-1 w-full">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 text-sm font-medium text-[#392C2A]">
                      <Truck className="w-4 h-4 text-[#C9878D]" />
                      <span>Cash on Delivery</span>
                    </div>
                    <span className="px-2 py-0.5 text-[9px] font-mono uppercase tracking-wider bg-[#FAF7F2] text-[#7D6B67] border border-[#E8DED4] rounded-xs font-semibold">
                      Doorstep
                    </span>
                  </div>
                  <p className="text-xs text-[#7D6B67]">
                    Pay directly via cash or UPI upon courier handover.
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
                      src={getProductImageUrl(item.product.images?.[0])}
                      alt={item.product.name}
                      referrerPolicy="no-referrer"
                      onError={handleImageError}
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
          <div className="w-full max-w-md bg-[#FAF7F2] border border-[#E8DED4] shadow-2xl p-6 sm:p-8 space-y-5 text-[#392C2A] rounded-sm animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-[#E8DED4] pb-4">
              <div>
                <span className="text-[10px] tracking-[0.2em] uppercase text-[#C9878D] font-mono font-semibold">
                  VELMORA Atelier
                </span>
                <h3 className="font-serif text-xl text-[#392C2A]">Demo Payment Gateway</h3>
              </div>
              <span className="font-mono text-[10px] bg-[#E8D8C8] text-[#5A3E36] px-2 py-1 uppercase tracking-wider font-semibold border border-[#D6B77A]/40 rounded-xs">
                Test Sandbox
              </span>
            </div>

            {/* Sandbox Notice */}
            <div className="p-3.5 bg-[#FFFDF9] border border-[#D6B77A]/50 rounded-xs flex items-start gap-2.5 text-xs text-[#7D6B67]">
              <Info className="w-4 h-4 text-[#D6B77A] shrink-0 mt-0.5" />
              <p className="leading-relaxed text-[11px]">
                <strong className="text-[#392C2A] font-medium">Safe Demo Mode:</strong> No actual monetary transaction will occur. Razorpay keys are optional. Click below to verify complete order placement, receipt, and Blue Dart tracking.
              </p>
            </div>

            <div className="p-4 bg-[#FFFDF9] border border-[#E8DED4] space-y-1 rounded-sm">
              <span className="text-xs text-[#7D6B67] uppercase tracking-wider font-semibold">Amount to Authorize:</span>
              <p className="font-mono text-2xl text-[#392C2A] tabular-nums font-bold">
                ₹{cartTotal.toLocaleString('en-US')}
              </p>
            </div>

            {paymentMethod === 'RAZORPAY_UPI' ? (
              <div className="space-y-4 text-xs">
                <p className="text-[#7D6B67]">Test UPI QR Code or Simulated VPA Address:</p>
                <div className="flex justify-center p-4 bg-white border border-[#E8DED4] rounded-md max-w-[180px] mx-auto shadow-xs">
                  <div className="w-36 h-36 bg-[#FAF7F2] border border-[#E8DED4] flex flex-col items-center justify-center text-[#392C2A] text-[10px] p-2 text-center rounded-sm">
                    <QrCode className="w-16 h-16 text-[#C9878D] mb-1" />
                    <span className="font-mono text-[9px] text-[#7D6B67]">UPI://PAY?PA=VELMORA@ICICI</span>
                    <span className="text-[8px] text-[#C9878D] font-mono mt-1 font-semibold uppercase">[Demo QR]</span>
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-[#7D6B67] uppercase font-semibold">Test Virtual Payment Address (VPA):</label>
                  <input
                    type="text"
                    value={upiId}
                    onChange={e => setUpiId(e.target.value)}
                    className="w-full bg-[#FFFDF9] border border-[#E8DED4] px-3 py-2 text-[#392C2A] font-mono text-xs rounded-sm focus:outline-none focus:border-[#C9878D]"
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-3 text-xs">
                <div>
                  <label className="text-[#7D6B67] uppercase font-semibold">Test Card Number</label>
                  <input
                    type="text"
                    value={cardNumber}
                    onChange={e => setCardNumber(e.target.value)}
                    className="w-full bg-[#FFFDF9] border border-[#E8DED4] px-3 py-2 text-[#392C2A] font-mono text-xs rounded-sm focus:outline-none focus:border-[#C9878D]"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[#7D6B67] uppercase font-semibold">Expiry Date</label>
                    <input
                      type="text"
                      value={cardExpiry}
                      onChange={e => setCardExpiry(e.target.value)}
                      className="w-full bg-[#FFFDF9] border border-[#E8DED4] px-3 py-2 text-[#392C2A] font-mono text-xs rounded-sm focus:outline-none focus:border-[#C9878D]"
                    />
                  </div>
                  <div>
                    <label className="text-[#7D6B67] uppercase font-semibold">CVV</label>
                    <input
                      type="password"
                      value={cardCvv}
                      onChange={e => setCardCvv(e.target.value)}
                      className="w-full bg-[#FFFDF9] border border-[#E8DED4] px-3 py-2 text-[#392C2A] font-mono text-xs rounded-sm focus:outline-none focus:border-[#C9878D]"
                    />
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-2 pt-2">
              <button
                type="button"
                onClick={() =>
                  handlePaymentSuccess(pendingOrderId, `pay_demo_${Date.now()}`)
                }
                disabled={isProcessing}
                className="w-full py-3.5 bg-[#C9878D] hover:bg-[#B56F75] text-white text-xs font-semibold tracking-[0.2em] uppercase transition-colors cursor-pointer flex items-center justify-center gap-2 rounded-sm shadow-md"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Simulate Successful Payment (Instant Test)</span>
              </button>

              <button
                type="button"
                onClick={handleSimulateFailure}
                className="w-full py-2.5 border border-[#D97979]/40 bg-[#FFF5F5] hover:bg-[#FFEAEB] text-xs text-[#B91C1C] uppercase tracking-wider transition-colors cursor-pointer rounded-sm flex items-center justify-center gap-1.5"
              >
                <AlertCircle className="w-3.5 h-3.5 text-[#B91C1C]" />
                <span>Test Payment Failure / Decline</span>
              </button>

              <button
                type="button"
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
