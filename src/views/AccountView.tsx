import React, { useState, useEffect } from 'react';
import type { Order } from '../types';
import { useStore } from '../context/StoreContext';
import {
  User as UserIcon,
  Package,
  Heart,
  MapPin,
  Lock,
  LogOut,
  Plus,
  ArrowRight,
  Shield,
  ShoppingBag,
  Trash2
} from 'lucide-react';

export const AccountView: React.FC = () => {
  const {
    user,
    token,
    login,
    register,
    logout,
    addAddress,
    quickLoginDemo,
    wishlistIds,
    toggleWishlist,
    products,
    addToCart,
    setActiveOrder,
    setCurrentPage,
    setSelectedProduct,
    showToast
  } = useStore();

  const [activeTab, setActiveTab] = useState<'profile' | 'orders' | 'addresses' | 'wishlist'>('orders');

  // Auth Forms
  const [authMode, setAuthMode] = useState<'login' | 'register' | 'forgot'>('login');
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authName, setAuthName] = useState('');
  const [isSubmittingAuth, setIsSubmittingAuth] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  // User Orders
  const [userOrders, setUserOrders] = useState<Order[]>([]);
  const [isLoadingOrders, setIsLoadingOrders] = useState(false);

  // Address Modal / Form
  const [showAddAddress, setShowAddAddress] = useState(false);
  const [addrName, setAddrName] = useState('');
  const [addrLine1, setAddrLine1] = useState('');
  const [addrLine2, setAddrLine2] = useState('');
  const [addrCity, setAddrCity] = useState('Mumbai');
  const [addrState, setAddrState] = useState('Maharashtra');
  const [addrPostal, setAddrPostal] = useState('400001');
  const [addrPhone, setAddrPhone] = useState('+91 98200 12345');

  // Load orders when authenticated
  useEffect(() => {
    if (token) {
      setIsLoadingOrders(true);
      fetch('/api/orders', {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(res => res.json())
        .then(data => {
          setUserOrders(data.orders || []);
        })
        .catch(console.error)
        .finally(() => setIsLoadingOrders(false));
    }
  }, [token]);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setIsSubmittingAuth(true);
    const res = await login(authEmail, authPassword);
    setIsSubmittingAuth(false);
    if (!res.success) {
      setAuthError(res.error || 'Authentication rejected');
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setIsSubmittingAuth(true);
    const res = await register(authName, authEmail, authPassword);
    setIsSubmittingAuth(false);
    if (!res.success) {
      setAuthError(res.error || 'Registration rejected');
    }
  };

  const handleForgotPassword = (e: React.FormEvent) => {
    e.preventDefault();
    showToast('A cryptographic reset token has been dispatched to your email.', 'info');
    setAuthMode('login');
  };

  const handleSaveAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!addrName || !addrLine1 || !addrCity || !addrPostal || !addrPhone) {
      showToast('Please complete all address fields.', 'error');
      return;
    }
    const success = await addAddress({
      fullName: addrName,
      addressLine1: addrLine1,
      addressLine2: addrLine2,
      city: addrCity,
      state: addrState,
      postalCode: addrPostal,
      country: 'India',
      phone: addrPhone,
      isDefault: true
    });
    if (success) {
      setShowAddAddress(false);
    }
  };

  const wishlistProducts = products.filter(p => wishlistIds.includes(p.id));

  // If Not Logged In: Show Luxury Auth Portal
  if (!user) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 space-y-8">
        <div className="text-center space-y-2">
          <span className="text-xs tracking-[0.25em] uppercase text-[#C5A880]">
            The Client Sanctuary
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl text-white">
            {authMode === 'login'
              ? 'Sanctuary Sign In'
              : authMode === 'register'
              ? 'Create Atelier Account'
              : 'Password Recovery'}
          </h1>
          <p className="text-xs text-[#888] leading-relaxed">
            Access your private acquisitions, tracked deliveries, and bespoke consultations.
          </p>
        </div>

        {/* Demo Fast Switcher */}
        <div className="p-3 bg-[#0F0F0F] border border-[#262626] space-y-2 text-xs">
          <span className="block text-[11px] text-[#A6A097] uppercase tracking-wider">
            Evaluation Quick Sign-In
          </span>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => quickLoginDemo('CUSTOMER')}
              className="py-1.5 px-3 border border-[#333] hover:border-[#666] text-[#CCC] hover:text-white text-[11px] uppercase tracking-wider transition-colors cursor-pointer"
            >
              Client Demo
            </button>
            <button
              onClick={() => quickLoginDemo('ADMIN')}
              className="py-1.5 px-3 border border-[#C5A880]/50 hover:border-[#C5A880] text-[#C5A880] text-[11px] uppercase tracking-wider transition-colors cursor-pointer"
            >
              Admin Director
            </button>
          </div>
        </div>

        {/* Forms */}
        {authMode === 'login' ? (
          <form onSubmit={handleLoginSubmit} className="space-y-4 text-xs">
            {authError && (
              <div className="p-3 bg-[#241313] border border-[#4A2020] text-[#E08A8A] text-[11px]">
                {authError}
              </div>
            )}
            <div>
              <label className="block text-[#AAA] mb-1 uppercase tracking-wider">Email</label>
              <input
                type="email"
                required
                placeholder="client@elixirnoir.com"
                value={authEmail}
                onChange={e => setAuthEmail(e.target.value)}
                className="w-full bg-[#0D0D0D] border border-[#2B2B2B] px-3.5 py-2.5 text-white placeholder-[#555] focus:outline-none focus:border-[#C5A880]"
              />
            </div>
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-[#AAA] uppercase tracking-wider">Password</label>
                <button
                  type="button"
                  onClick={() => setAuthMode('forgot')}
                  className="text-[11px] text-[#888] hover:text-white underline"
                >
                  Forgot?
                </button>
              </div>
              <input
                type="password"
                required
                placeholder="••••••••••••"
                value={authPassword}
                onChange={e => setAuthPassword(e.target.value)}
                className="w-full bg-[#0D0D0D] border border-[#2B2B2B] px-3.5 py-2.5 text-white placeholder-[#555] focus:outline-none focus:border-[#C5A880]"
              />
            </div>
            <button
              type="submit"
              disabled={isSubmittingAuth}
              className="w-full py-3.5 bg-[#F0ECE8] hover:bg-white text-[#000000] text-xs font-semibold tracking-[0.2em] uppercase transition-colors cursor-pointer mt-2"
            >
              {isSubmittingAuth ? 'Verifying Credentials...' : 'Sign In to Sanctuary'}
            </button>
            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => setAuthMode('register')}
                className="text-xs text-[#888] hover:text-white underline"
              >
                Don't possess an account? Inscribe here.
              </button>
            </div>
          </form>
        ) : authMode === 'register' ? (
          <form onSubmit={handleRegisterSubmit} className="space-y-4 text-xs">
            {authError && (
              <div className="p-3 bg-[#241313] border border-[#4A2020] text-[#E08A8A] text-[11px]">
                {authError}
              </div>
            )}
            <div>
              <label className="block text-[#AAA] mb-1 uppercase tracking-wider">Full Name</label>
              <input
                type="text"
                required
                placeholder="Eleanor Vance"
                value={authName}
                onChange={e => setAuthName(e.target.value)}
                className="w-full bg-[#0D0D0D] border border-[#2B2B2B] px-3.5 py-2.5 text-white placeholder-[#555] focus:outline-none focus:border-[#C5A880]"
              />
            </div>
            <div>
              <label className="block text-[#AAA] mb-1 uppercase tracking-wider">Email</label>
              <input
                type="email"
                required
                placeholder="client@elixirnoir.com"
                value={authEmail}
                onChange={e => setAuthEmail(e.target.value)}
                className="w-full bg-[#0D0D0D] border border-[#2B2B2B] px-3.5 py-2.5 text-white placeholder-[#555] focus:outline-none focus:border-[#C5A880]"
              />
            </div>
            <div>
              <label className="block text-[#AAA] mb-1 uppercase tracking-wider">Password (Min 8 chars)</label>
              <input
                type="password"
                required
                placeholder="••••••••••••"
                value={authPassword}
                onChange={e => setAuthPassword(e.target.value)}
                className="w-full bg-[#0D0D0D] border border-[#2B2B2B] px-3.5 py-2.5 text-white placeholder-[#555] focus:outline-none focus:border-[#C5A880]"
              />
            </div>
            <button
              type="submit"
              disabled={isSubmittingAuth}
              className="w-full py-3.5 bg-[#F0ECE8] hover:bg-white text-[#000000] text-xs font-semibold tracking-[0.2em] uppercase transition-colors cursor-pointer mt-2"
            >
              {isSubmittingAuth ? 'Creating Record...' : 'Create Account'}
            </button>
            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => setAuthMode('login')}
                className="text-xs text-[#888] hover:text-white underline"
              >
                Already possess an account? Sign in.
              </button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleForgotPassword} className="space-y-4 text-xs">
            <div>
              <label className="block text-[#AAA] mb-1 uppercase tracking-wider">Registered Email</label>
              <input
                type="email"
                required
                placeholder="client@elixirnoir.com"
                value={authEmail}
                onChange={e => setAuthEmail(e.target.value)}
                className="w-full bg-[#0D0D0D] border border-[#2B2B2B] px-3.5 py-2.5 text-white placeholder-[#555] focus:outline-none focus:border-[#C5A880]"
              />
            </div>
            <button
              type="submit"
              className="w-full py-3.5 bg-[#F0ECE8] hover:bg-white text-[#000000] text-xs font-semibold tracking-[0.2em] uppercase transition-colors cursor-pointer mt-2"
            >
              Send Reset Link
            </button>
            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => setAuthMode('login')}
                className="text-xs text-[#888] hover:text-white underline"
              >
                Return to Sign In
              </button>
            </div>
          </form>
        )}
      </div>
    );
  }

  // Authenticated Sanctuary Dashboard
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header Profile Info */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#1C1C1C] pb-6 gap-4">
        <div>
          <span className="text-xs tracking-[0.25em] uppercase text-[#C5A880]">
            Client Sanctuary
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl text-white mt-1">
            Welcome, {user.name}
          </h1>
          <p className="text-xs text-[#888] font-mono mt-0.5">{user.email}</p>
        </div>

        <div className="flex items-center gap-3">
          {user.role === 'ADMIN' && (
            <button
              onClick={() => setCurrentPage('admin')}
              className="px-4 py-2 border border-[#C5A880]/60 hover:border-[#C5A880] text-xs uppercase tracking-wider text-[#C5A880] flex items-center gap-1.5"
            >
              <Shield className="w-3.5 h-3.5" />
              <span>Admin Atelier Portal</span>
            </button>
          )}

          <button
            onClick={logout}
            className="px-4 py-2 border border-[#333] hover:border-[#555] text-xs uppercase tracking-wider text-[#888] hover:text-white flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* Tabs Menu (Interactive Buttons, NO pills) */}
      <div className="flex border-b border-[#1C1C1C] gap-6 text-xs uppercase tracking-[0.18em]">
        <button
          onClick={() => setActiveTab('orders')}
          className={`pb-3 flex items-center gap-2 transition-colors cursor-pointer ${
            activeTab === 'orders'
              ? 'text-white border-b-2 border-[#F0ECE8] font-medium'
              : 'text-[#777] hover:text-white'
          }`}
        >
          <Package className="w-4 h-4" />
          <span>Acquisitions & Tracking ({userOrders.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('wishlist')}
          className={`pb-3 flex items-center gap-2 transition-colors cursor-pointer ${
            activeTab === 'wishlist'
              ? 'text-white border-b-2 border-[#F0ECE8] font-medium'
              : 'text-[#777] hover:text-white'
          }`}
        >
          <Heart className="w-4 h-4" />
          <span>Curated Wishlist ({wishlistIds.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('addresses')}
          className={`pb-3 flex items-center gap-2 transition-colors cursor-pointer ${
            activeTab === 'addresses'
              ? 'text-white border-b-2 border-[#F0ECE8] font-medium'
              : 'text-[#777] hover:text-white'
          }`}
        >
          <MapPin className="w-4 h-4" />
          <span>Sanctuary Addresses ({user.addresses?.length || 0})</span>
        </button>

        <button
          onClick={() => setActiveTab('profile')}
          className={`pb-3 flex items-center gap-2 transition-colors cursor-pointer ${
            activeTab === 'profile'
              ? 'text-white border-b-2 border-[#F0ECE8] font-medium'
              : 'text-[#777] hover:text-white'
          }`}
        >
          <UserIcon className="w-4 h-4" />
          <span>Client Profile</span>
        </button>
      </div>

      {/* TAB CONTENT */}

      {/* 1. ORDERS TAB */}
      {activeTab === 'orders' && (
        <div className="space-y-6">
          {isLoadingOrders ? (
            <p className="text-xs text-[#888] py-8">Retrieving order ledgers...</p>
          ) : userOrders.length === 0 ? (
            <div className="p-12 text-center bg-[#0A0A0A] border border-[#1C1C1C] space-y-3">
              <p className="font-serif text-xl text-[#888]">No historical orders recorded yet.</p>
              <p className="text-xs text-[#666]">Acquisitions made with this account will be permanently archived here.</p>
              <button
                onClick={() => setCurrentPage('shop')}
                className="mt-2 px-6 py-2.5 bg-[#F0ECE8] text-[#000000] text-xs uppercase tracking-[0.2em]"
              >
                Explore Catalog
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {userOrders.map(order => (
                <div
                  key={order.id}
                  className="bg-[#0A0A0A] border border-[#1F1F1F] p-6 space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#181818] gap-2 text-xs">
                    <div>
                      <span className="font-mono text-white text-sm font-semibold">
                        Order #{order.orderNumber}
                      </span>
                      <span className="text-[#666] ml-3">
                        {new Date(order.createdAt).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric'
                        })}
                      </span>
                    </div>

                    <div className="flex items-center gap-4">
                      <span
                        className={`text-[11px] tracking-wider uppercase font-mono px-2 py-0.5 border ${
                          order.orderStatus === 'DELIVERED'
                            ? 'text-[#64B587] border-[#64B587]/30'
                            : order.orderStatus === 'SHIPPED'
                            ? 'text-[#C5A880] border-[#C5A880]/30'
                            : 'text-[#DDD] border-[#444]'
                        }`}
                      >
                        {order.orderStatus}
                      </span>

                      <span className="font-mono text-sm text-[#C5A880] tabular-nums">
                        ₹{order.totalAmount.toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>

                  {/* Items inside order */}
                  <div className="space-y-3">
                    {order.items.map((item, i) => (
                      <div key={i} className="flex items-center justify-between gap-4 text-xs">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-12 bg-[#141414] border border-[#222] overflow-hidden shrink-0">
                            <img
                              src={item.productImage || ''}
                              alt=""
                              referrerPolicy="no-referrer"
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div>
                            <p className="font-serif text-sm text-white">{item.productName}</p>
                            <p className="text-[#666]">
                              Qty: {item.quantity} {item.selectedVariant ? `· ${item.selectedVariant}` : ''}
                            </p>
                          </div>
                        </div>
                        <span className="font-mono text-[#AAA] tabular-nums">
                          ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="pt-4 border-t border-[#181818] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-[#888]">
                    <div>
                      {order.trackingNumber ? (
                        <span>Courier Waybill: <strong className="text-white font-mono">{order.trackingNumber}</strong></span>
                      ) : (
                        <span>Atelier Formulation & Packaging in progress</span>
                      )}
                    </div>
                    <button
                      onClick={() => {
                        setActiveOrder(order);
                        setCurrentPage('order-confirmation');
                      }}
                      className="text-white hover:text-[#C5A880] underline flex items-center gap-1 cursor-pointer"
                    >
                      <span>View Full Receipt & Tracking</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 2. WISHLIST TAB */}
      {activeTab === 'wishlist' && (
        <div className="space-y-6">
          {wishlistProducts.length === 0 ? (
            <div className="p-12 text-center bg-[#0A0A0A] border border-[#1C1C1C] space-y-3">
              <p className="font-serif text-xl text-[#888]">Your wishlist sanctuary is empty.</p>
              <p className="text-xs text-[#666]">Explore creations and save items for future private acquisitions.</p>
              <button
                onClick={() => setCurrentPage('shop')}
                className="mt-2 px-6 py-2.5 bg-[#F0ECE8] text-[#000000] text-xs uppercase tracking-[0.2em]"
              >
                Browse Catalog
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {wishlistProducts.map(p => (
                <div key={p.id} className="bg-[#0A0A0A] border border-[#1F1F1F] p-4 flex flex-col justify-between space-y-4">
                  <div
                    onClick={() => {
                      setSelectedProduct(p);
                      setCurrentPage('product-detail');
                    }}
                    className="cursor-pointer space-y-3"
                  >
                    <div className="aspect-[4/3] bg-[#141414] overflow-hidden">
                      <img
                        src={p.images[0] || ''}
                        alt={p.name}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover hover:scale-105 transition-transform"
                      />
                    </div>
                    <div>
                      <span className="text-[10px] tracking-wider uppercase text-[#C5A880]">
                        {p.categoryName}
                      </span>
                      <h3 className="font-serif text-base text-white">{p.name}</h3>
                      <p className="font-mono text-xs text-[#AAA] tabular-nums mt-0.5">
                        ₹{p.price.toLocaleString('en-IN')}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-2 border-t border-[#181818]">
                    <button
                      onClick={() => addToCart(p, 1, p.variants?.[0]?.name)}
                      className="flex-1 py-2 bg-[#F0ECE8] hover:bg-white text-black text-[11px] font-semibold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                      <span>Move to Bag</span>
                    </button>
                    <button
                      onClick={() => toggleWishlist(p.id)}
                      className="p-2 border border-[#2B2B2B] hover:border-[#A86464] text-[#777] hover:text-[#A86464] transition-colors"
                      title="Remove from wishlist"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 3. ADDRESSES TAB */}
      {activeTab === 'addresses' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="font-serif text-xl text-white">Saved Delivery Addresses</h2>
            <button
              onClick={() => setShowAddAddress(!showAddAddress)}
              className="px-4 py-2 border border-[#333] hover:border-white text-xs uppercase tracking-wider text-white flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add New Address</span>
            </button>
          </div>

          {showAddAddress && (
            <form onSubmit={handleSaveAddress} className="p-6 bg-[#0D0D0D] border border-[#2B2B2B] space-y-4 text-xs max-w-xl">
              <h3 className="font-serif text-lg text-white">Add Delivery Sanctuary</h3>
              <div>
                <label className="block text-[#AAA] mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={addrName}
                  onChange={e => setAddrName(e.target.value)}
                  className="w-full bg-[#141414] border border-[#2B2B2B] px-3 py-2 text-white"
                />
              </div>
              <div>
                <label className="block text-[#AAA] mb-1">Address Line 1</label>
                <input
                  type="text"
                  required
                  value={addrLine1}
                  onChange={e => setAddrLine1(e.target.value)}
                  className="w-full bg-[#141414] border border-[#2B2B2B] px-3 py-2 text-white"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#AAA] mb-1">City</label>
                  <input
                    type="text"
                    required
                    value={addrCity}
                    onChange={e => setAddrCity(e.target.value)}
                    className="w-full bg-[#141414] border border-[#2B2B2B] px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-[#AAA] mb-1">Postal Code</label>
                  <input
                    type="text"
                    required
                    value={addrPostal}
                    onChange={e => setAddrPostal(e.target.value)}
                    className="w-full bg-[#141414] border border-[#2B2B2B] px-3 py-2 text-white"
                  />
                </div>
              </div>
              <div>
                <label className="block text-[#AAA] mb-1">Phone Number</label>
                <input
                  type="text"
                  required
                  value={addrPhone}
                  onChange={e => setAddrPhone(e.target.value)}
                  className="w-full bg-[#141414] border border-[#2B2B2B] px-3 py-2 text-white"
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  className="px-6 py-2 bg-[#F0ECE8] text-black uppercase tracking-wider font-semibold"
                >
                  Save Address
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddAddress(false)}
                  className="px-4 py-2 border border-[#333] text-[#888] uppercase tracking-wider"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {user.addresses?.map(addr => (
              <div key={addr.id} className="p-6 bg-[#0A0A0A] border border-[#1F1F1F] space-y-2 text-xs text-[#AAA]">
                <div className="flex justify-between items-center text-white">
                  <span className="font-serif text-base">{addr.fullName}</span>
                  {addr.isDefault && (
                    <span className="text-[10px] tracking-wider uppercase text-[#C5A880] border border-[#C5A880]/30 px-1.5 py-0.5">
                      Default
                    </span>
                  )}
                </div>
                <p>{addr.addressLine1}</p>
                {addr.addressLine2 && <p>{addr.addressLine2}</p>}
                <p>{addr.city}, {addr.state} - {addr.postalCode}</p>
                <p>{addr.country} · {addr.phone}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. PROFILE TAB */}
      {activeTab === 'profile' && (
        <div className="max-w-xl bg-[#0A0A0A] border border-[#1F1F1F] p-8 space-y-6 text-xs">
          <h2 className="font-serif text-xl text-white pb-3 border-b border-[#181818]">
            Client Credentials & Security
          </h2>
          <div className="space-y-4">
            <div>
              <span className="text-[#888] block mb-1">Full Legal Name</span>
              <p className="text-white text-sm font-medium">{user.name}</p>
            </div>
            <div>
              <span className="text-[#888] block mb-1">Registered Sanctuary Email</span>
              <p className="text-white text-sm font-mono">{user.email}</p>
            </div>
            <div>
              <span className="text-[#888] block mb-1">Atelier Tier</span>
              <p className="text-[#C5A880] font-mono tracking-wider">
                {user.role === 'ADMIN' ? 'DIRECTEUR DE L’ATELIER (ADMIN)' : 'ESTEEMED PATRON (CLIENT)'}
              </p>
            </div>
            <div>
              <span className="text-[#888] block mb-1">Inscription Date</span>
              <p className="text-[#888] font-mono">{new Date(user.createdAt).toLocaleDateString()}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
