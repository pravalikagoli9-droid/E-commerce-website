import React, { useState, useEffect } from 'react';
import type { Order } from '../types';
import { useStore } from '../context/StoreContext';
import {
  Package,
  Heart,
  MapPin,
  LogOut,
  Plus,
  ArrowRight,
  Shield,
  ShoppingBag,
  Trash2,
  Coins,
  Bell,
  Eye
} from 'lucide-react';

export const AccountView: React.FC = () => {
  const {
    user,
    token,
    login,
    register,
    logout,
    addAddress,
    updatePreferences,
    quickLoginDemo,
    wishlistIds,
    toggleWishlist,
    products,
    addToCart,
    setActiveOrder,
    setCurrentPage,
    setSelectedProduct,
    recentlyViewedIds,
    showToast
  } = useStore();

  const [activeTab, setActiveTab] = useState<'orders' | 'wishlist' | 'loyalty' | 'addresses' | 'preferences' | 'recent'>('orders');

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

  // Preferences Form State
  const [prefPriceDrop, setPrefPriceDrop] = useState(true);
  const [prefStock, setPrefStock] = useState(true);
  const [prefOrders, setPrefOrders] = useState(true);
  const [prefNewsletter, setPrefNewsletter] = useState(true);
  const [favCats, setFavCats] = useState<string[]>([]);

  useEffect(() => {
    if (user) {
      setPrefPriceDrop(user.notificationPreferences?.priceDropAlerts ?? true);
      setPrefStock(user.notificationPreferences?.backInStockAlerts ?? true);
      setPrefOrders(user.notificationPreferences?.orderUpdates ?? true);
      setPrefNewsletter(user.notificationPreferences?.gazetteNewsletter ?? true);
      setFavCats(user.favoriteCategories || []);
    }
  }, [user]);

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
      setAuthError(res.error || 'Invalid email or password.');
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setIsSubmittingAuth(true);
    const res = await register(authName, authEmail, authPassword);
    setIsSubmittingAuth(false);
    if (!res.success) {
      setAuthError(res.error || 'Registration failed. Please check your information.');
    }
  };

  const handleForgotPassword = (e: React.FormEvent) => {
    e.preventDefault();
    showToast('A password reset link has been sent to your email address.', 'info');
    setAuthMode('login');
  };

  const handleSaveAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!addrName || !addrLine1 || !addrCity || !addrPostal || !addrPhone) {
      showToast('Please complete all required address fields.', 'error');
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

  const handleSavePreferences = async (e: React.FormEvent) => {
    e.preventDefault();
    await updatePreferences(favCats, {
      priceDropAlerts: prefPriceDrop,
      backInStockAlerts: prefStock,
      orderUpdates: prefOrders,
      gazetteNewsletter: prefNewsletter
    });
    showToast('Your notification preferences have been saved.', 'success');
  };

  const toggleCategory = (slug: string) => {
    setFavCats(prev =>
      prev.includes(slug) ? prev.filter(s => s !== slug) : [...prev, slug]
    );
  };

  const wishlistProducts = products.filter(p => wishlistIds.includes(p.id));
  const recentlyViewedProducts = products.filter(p => recentlyViewedIds.includes(p.id));

  // If Not Logged In: Show Auth Portal
  if (!user) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 space-y-8">
        <div className="text-center space-y-2">
          <span className="text-xs tracking-[0.25em] uppercase text-[#C9878D] font-semibold">
            Customer Portal
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl text-[#392C2A] font-normal">
            {authMode === 'login'
              ? 'Sign In to Your Account'
              : authMode === 'register'
              ? 'Create an Account'
              : 'Reset Your Password'}
          </h1>
          <p className="text-xs text-[#7D6B67] leading-relaxed">
            Access your orders, track deliveries, and manage your wishlist and rewards.
          </p>
        </div>

        {/* Demo Fast Switcher */}
        <div className="p-4 bg-[#FFFDF9] border border-[#E8DED4] space-y-2.5 text-xs rounded-sm shadow-xs">
          <span className="block text-[11px] text-[#7D6B67] uppercase tracking-wider font-semibold">
            Quick Demo Sign-In
          </span>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => quickLoginDemo('CUSTOMER')}
              className="py-2 px-3 border border-[#E8DED4] hover:border-[#C9878D] text-[#392C2A] text-[11px] uppercase tracking-wider transition-colors cursor-pointer bg-[#FAF7F2] font-semibold rounded-xs"
            >
              Demo Customer
            </button>
            <button
              onClick={() => quickLoginDemo('ADMIN')}
              className="py-2 px-3 border border-[#C9878D] text-[#C9878D] hover:bg-[#C9878D] hover:text-white text-[11px] uppercase tracking-wider transition-colors cursor-pointer bg-[#FFFDF9] font-semibold rounded-xs"
            >
              Store Administrator
            </button>
          </div>
        </div>

        {/* Forms */}
        {authMode === 'login' ? (
          <form onSubmit={handleLoginSubmit} className="space-y-4 text-xs bg-[#FFFDF9] p-6 sm:p-8 border border-[#E8DED4] rounded-sm shadow-xs">
            {authError && (
              <div className="p-3 bg-[#FAF7F2] border border-[#D97979] text-[#D97979] text-[11px] rounded-xs">
                {authError}
              </div>
            )}
            <div>
              <label className="block text-[#7D6B67] mb-1 uppercase tracking-wider font-semibold">Email Address</label>
              <input
                type="email"
                required
                placeholder="name@example.com"
                value={authEmail}
                onChange={e => setAuthEmail(e.target.value)}
                className="w-full bg-[#FAF7F2] border border-[#E8DED4] px-3.5 py-2.5 text-[#392C2A] placeholder-[#998] focus:outline-none focus:border-[#C9878D] rounded-sm"
              />
            </div>
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-[#7D6B67] uppercase tracking-wider font-semibold">Password</label>
                <button
                  type="button"
                  onClick={() => setAuthMode('forgot')}
                  className="text-[11px] text-[#C9878D] hover:text-[#B56F75] underline cursor-pointer"
                >
                  Forgot Password?
                </button>
              </div>
              <input
                type="password"
                required
                placeholder="••••••••••••"
                value={authPassword}
                onChange={e => setAuthPassword(e.target.value)}
                className="w-full bg-[#FAF7F2] border border-[#E8DED4] px-3.5 py-2.5 text-[#392C2A] placeholder-[#998] focus:outline-none focus:border-[#C9878D] rounded-sm"
              />
            </div>
            <button
              type="submit"
              disabled={isSubmittingAuth}
              className="w-full py-3.5 bg-[#C9878D] hover:bg-[#B56F75] text-white text-xs font-semibold tracking-[0.2em] uppercase transition-colors cursor-pointer mt-2 shadow-xs rounded-sm"
            >
              {isSubmittingAuth ? 'Signing In...' : 'Sign In'}
            </button>
            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => setAuthMode('register')}
                className="text-xs text-[#7D6B67] hover:text-[#C9878D] underline cursor-pointer"
              >
                Don't have an account? Create one here.
              </button>
            </div>
          </form>
        ) : authMode === 'register' ? (
          <form onSubmit={handleRegisterSubmit} className="space-y-4 text-xs bg-[#FFFDF9] p-6 sm:p-8 border border-[#E8DED4] rounded-sm shadow-xs">
            {authError && (
              <div className="p-3 bg-[#FAF7F2] border border-[#D97979] text-[#D97979] text-[11px] rounded-xs">
                {authError}
              </div>
            )}
            <div>
              <label className="block text-[#7D6B67] mb-1 uppercase tracking-wider font-semibold">Full Name</label>
              <input
                type="text"
                required
                placeholder="Eleanor Vance"
                value={authName}
                onChange={e => setAuthName(e.target.value)}
                className="w-full bg-[#FAF7F2] border border-[#E8DED4] px-3.5 py-2.5 text-[#392C2A] placeholder-[#998] focus:outline-none focus:border-[#C9878D] rounded-sm"
              />
            </div>
            <div>
              <label className="block text-[#7D6B67] mb-1 uppercase tracking-wider font-semibold">Email Address</label>
              <input
                type="email"
                required
                placeholder="name@example.com"
                value={authEmail}
                onChange={e => setAuthEmail(e.target.value)}
                className="w-full bg-[#FAF7F2] border border-[#E8DED4] px-3.5 py-2.5 text-[#392C2A] placeholder-[#998] focus:outline-none focus:border-[#C9878D] rounded-sm"
              />
            </div>
            <div>
              <label className="block text-[#7D6B67] mb-1 uppercase tracking-wider font-semibold">Password (Minimum 8 Characters)</label>
              <input
                type="password"
                required
                placeholder="••••••••••••"
                value={authPassword}
                onChange={e => setAuthPassword(e.target.value)}
                className="w-full bg-[#FAF7F2] border border-[#E8DED4] px-3.5 py-2.5 text-[#392C2A] placeholder-[#998] focus:outline-none focus:border-[#C9878D] rounded-sm"
              />
            </div>
            <button
              type="submit"
              disabled={isSubmittingAuth}
              className="w-full py-3.5 bg-[#C9878D] hover:bg-[#B56F75] text-white text-xs font-semibold tracking-[0.2em] uppercase transition-colors cursor-pointer mt-2 shadow-xs rounded-sm"
            >
              {isSubmittingAuth ? 'Creating Account...' : 'Create Account (+500 Welcome Points)'}
            </button>
            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => setAuthMode('login')}
                className="text-xs text-[#7D6B67] hover:text-[#C9878D] underline cursor-pointer"
              >
                Already have an account? Sign in.
              </button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleForgotPassword} className="space-y-4 text-xs bg-[#FFFDF9] p-6 sm:p-8 border border-[#E8DED4] rounded-sm shadow-xs">
            <div>
              <label className="block text-[#7D6B67] mb-1 uppercase tracking-wider font-semibold">Registered Email Address</label>
              <input
                type="email"
                required
                placeholder="name@example.com"
                value={authEmail}
                onChange={e => setAuthEmail(e.target.value)}
                className="w-full bg-[#FAF7F2] border border-[#E8DED4] px-3.5 py-2.5 text-[#392C2A] placeholder-[#998] focus:outline-none focus:border-[#C9878D] rounded-sm"
              />
            </div>
            <button
              type="submit"
              className="w-full py-3.5 bg-[#C9878D] hover:bg-[#B56F75] text-white text-xs font-semibold tracking-[0.2em] uppercase transition-colors cursor-pointer mt-2 shadow-xs rounded-sm"
            >
              Send Password Reset Link
            </button>
            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => setAuthMode('login')}
                className="text-xs text-[#7D6B67] hover:text-[#C9878D] underline cursor-pointer"
              >
                Return to Sign In
              </button>
            </div>
          </form>
        )}
      </div>
    );
  }

  // Authenticated Dashboard
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header Profile Info */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#E8DED4] pb-6 gap-4">
        <div>
          <span className="text-xs tracking-[0.25em] uppercase text-[#C9878D] font-semibold">
            Your Account
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl text-[#392C2A] mt-1 font-normal">
            Welcome, {user.name}
          </h1>
          <div className="flex items-center gap-3 text-xs text-[#7D6B67] font-mono mt-1">
            <span>{user.email}</span>
            <span>·</span>
            <span className="text-[#392C2A] font-semibold">
              {user.loyaltyPoints || 0} Reward Points ({user.loyaltyTier || 'GOLD'} Tier)
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {user.role === 'ADMIN' && (
            <button
              onClick={() => setCurrentPage('admin')}
              className="px-4 py-2 border border-[#C9878D] text-xs uppercase tracking-wider text-[#C9878D] hover:bg-[#C9878D] hover:text-white flex items-center gap-1.5 font-semibold transition-colors cursor-pointer rounded-xs"
            >
              <Shield className="w-3.5 h-3.5" />
              <span>Admin Dashboard</span>
            </button>
          )}

          <button
            onClick={logout}
            className="px-4 py-2 border border-[#E8DED4] hover:border-[#C9878D] text-xs uppercase tracking-wider text-[#7D6B67] hover:text-[#392C2A] flex items-center gap-1.5 transition-colors cursor-pointer rounded-xs"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* Tabs Menu */}
      <div className="flex border-b border-[#E8DED4] gap-6 text-xs uppercase tracking-[0.18em] overflow-x-auto">
        <button
          onClick={() => setActiveTab('orders')}
          className={`pb-3 whitespace-nowrap transition-colors cursor-pointer flex items-center gap-2 ${
            activeTab === 'orders'
              ? 'text-[#392C2A] border-b-2 border-[#C9878D] font-semibold'
              : 'text-[#7D6B67] hover:text-[#392C2A]'
          }`}
        >
          <Package className="w-4 h-4" />
          <span>Orders ({userOrders.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('loyalty')}
          className={`pb-3 whitespace-nowrap transition-colors cursor-pointer flex items-center gap-2 ${
            activeTab === 'loyalty'
              ? 'text-[#392C2A] border-b-2 border-[#C9878D] font-semibold'
              : 'text-[#7D6B67] hover:text-[#392C2A]'
          }`}
        >
          <Coins className="w-4 h-4 text-[#D6B77A]" />
          <span>Reward Points ({user.loyaltyPoints || 0} Pts)</span>
        </button>

        <button
          onClick={() => setActiveTab('wishlist')}
          className={`pb-3 whitespace-nowrap transition-colors cursor-pointer flex items-center gap-2 ${
            activeTab === 'wishlist'
              ? 'text-[#392C2A] border-b-2 border-[#C9878D] font-semibold'
              : 'text-[#7D6B67] hover:text-[#392C2A]'
          }`}
        >
          <Heart className="w-4 h-4" />
          <span>Wishlist ({wishlistIds.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('addresses')}
          className={`pb-3 whitespace-nowrap transition-colors cursor-pointer flex items-center gap-2 ${
            activeTab === 'addresses'
              ? 'text-[#392C2A] border-b-2 border-[#C9878D] font-semibold'
              : 'text-[#7D6B67] hover:text-[#392C2A]'
          }`}
        >
          <MapPin className="w-4 h-4" />
          <span>Addresses ({user.addresses?.length || 0})</span>
        </button>

        <button
          onClick={() => setActiveTab('preferences')}
          className={`pb-3 whitespace-nowrap transition-colors cursor-pointer flex items-center gap-2 ${
            activeTab === 'preferences'
              ? 'text-[#392C2A] border-b-2 border-[#C9878D] font-semibold'
              : 'text-[#7D6B67] hover:text-[#392C2A]'
          }`}
        >
          <Bell className="w-4 h-4" />
          <span>Preferences & Alerts</span>
        </button>

        <button
          onClick={() => setActiveTab('recent')}
          className={`pb-3 whitespace-nowrap transition-colors cursor-pointer flex items-center gap-2 ${
            activeTab === 'recent'
              ? 'text-[#392C2A] border-b-2 border-[#C9878D] font-semibold'
              : 'text-[#7D6B67] hover:text-[#392C2A]'
          }`}
        >
          <Eye className="w-4 h-4" />
          <span>Recently Viewed ({recentlyViewedProducts.length})</span>
        </button>
      </div>

      {/* 1. ORDERS TAB */}
      {activeTab === 'orders' && (
        <div className="space-y-6">
          {isLoadingOrders ? (
            <p className="text-xs text-[#7D6B67] py-8">Loading order history...</p>
          ) : userOrders.length === 0 ? (
            <div className="p-12 text-center bg-[#FFFDF9] border border-[#E8DED4] space-y-3 rounded-sm shadow-xs">
              <p className="font-serif text-xl text-[#7D6B67]">No orders found yet.</p>
              <p className="text-xs text-[#7D6B67]">Orders placed with your account will appear here.</p>
              <button
                onClick={() => setCurrentPage('shop')}
                className="mt-2 px-6 py-2.5 bg-[#C9878D] hover:bg-[#B56F75] text-white text-xs uppercase tracking-[0.2em] font-semibold transition-colors cursor-pointer rounded-sm"
              >
                Shop Now
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {userOrders.map(order => (
                <div key={order.id} className="bg-[#FFFDF9] border border-[#E8DED4] p-6 space-y-4 shadow-xs rounded-sm">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#E8DED4] gap-2 text-xs">
                    <div>
                      <span className="font-mono text-[#392C2A] text-sm font-semibold">
                        Order #{order.orderNumber}
                      </span>
                      <span className="text-[#7D6B67] ml-3">
                        {new Date(order.createdAt).toLocaleDateString('en-US', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric'
                        })}
                      </span>
                    </div>

                    <div className="flex items-center gap-4">
                      <span className="text-[11px] tracking-wider uppercase font-mono px-2.5 py-1 bg-[#FAF7F2] border border-[#E8DED4] text-[#392C2A] font-semibold rounded-xs">
                        {order.orderStatus}
                      </span>
                      <span className="font-mono text-sm text-[#392C2A] font-bold tabular-nums">
                        ₹{order.totalAmount.toLocaleString('en-US')}
                      </span>
                    </div>
                  </div>

                  {/* Items inside order */}
                  <div className="space-y-3">
                    {order.items.map((item, i) => (
                      <div key={i} className="flex items-center justify-between gap-4 text-xs">
                        <div className="flex items-center gap-3">
                          <img
                            src={item.productImage || ''}
                            alt=""
                            className="w-10 h-12 object-cover border border-[#E8DED4] rounded-xs"
                          />
                          <div>
                            <p className="font-serif text-sm text-[#392C2A] font-medium">{item.productName}</p>
                            <p className="text-[#7D6B67]">
                              Qty: {item.quantity} {item.selectedVariant ? `· ${item.selectedVariant}` : ''}
                            </p>
                          </div>
                        </div>
                        <span className="font-mono text-[#392C2A] tabular-nums font-semibold">
                          ₹{(item.price * item.quantity).toLocaleString('en-US')}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="pt-4 border-t border-[#E8DED4] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-[#7D6B67]">
                    <div>
                      {order.trackingNumber ? (
                        <span>Tracking Number: <strong className="text-[#392C2A] font-mono">{order.trackingNumber}</strong> ({order.trackingCourier || 'Blue Dart'})</span>
                      ) : (
                        <span>Order being prepared at atelier</span>
                      )}
                    </div>
                    <div className="flex items-center gap-4">
                      <button
                        onClick={() => {
                          setActiveOrder(order);
                          setCurrentPage('order-confirmation');
                        }}
                        className="text-[#C9878D] hover:text-[#B56F75] underline flex items-center gap-1 cursor-pointer font-medium"
                      >
                        <span>View Receipt & Tracking</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 2. LOYALTY & REWARDS TAB */}
      {activeTab === 'loyalty' && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 bg-[#FFFDF9] border border-[#E8DED4] space-y-2 rounded-sm shadow-xs">
              <span className="text-[11px] uppercase tracking-wider text-[#7D6B67] font-semibold">Available Points</span>
              <p className="font-mono text-3xl text-[#392C2A] font-bold">
                {user.loyaltyPoints || 0}
              </p>
              <p className="text-[11px] text-[#7D6B67]">Worth ₹{user.loyaltyPoints || 0} toward future orders</p>
            </div>

            <div className="p-6 bg-[#FFFDF9] border border-[#E8DED4] space-y-2 rounded-sm shadow-xs">
              <span className="text-[11px] uppercase tracking-wider text-[#7D6B67] font-semibold">Member Tier</span>
              <p className="font-serif text-3xl text-[#D6B77A] font-normal">
                {user.loyaltyTier || 'GOLD'}
              </p>
              <p className="text-[11px] text-[#7D6B67]">Upgraded at 1,000 points and 3,000 points</p>
            </div>

            <div className="p-6 bg-[#FFFDF9] border border-[#E8DED4] space-y-2 rounded-sm shadow-xs">
              <span className="text-[11px] uppercase tracking-wider text-[#7D6B67] font-semibold">Redemption Policy</span>
              <p className="text-xs text-[#7D6B67] leading-relaxed">
                1 point equals ₹1 discount. Redeem directly in your cart for up to 30% of total order value.
              </p>
            </div>
          </div>

          <div className="bg-[#FFFDF9] border border-[#E8DED4] p-6 space-y-4 rounded-sm shadow-xs">
            <h3 className="font-serif text-xl text-[#392C2A]">Points History</h3>
            {user.loyaltyHistory && user.loyaltyHistory.length > 0 ? (
              <div className="divide-y divide-[#E8DED4] text-xs">
                {user.loyaltyHistory.map(tx => (
                  <div key={tx.id} className="py-3 flex items-center justify-between">
                    <div>
                      <p className="text-[#392C2A] font-medium">{tx.description}</p>
                      <p className="text-[#7D6B67] font-mono text-[11px]">{tx.date}</p>
                    </div>
                    <span
                      className={`font-mono font-semibold ${
                        tx.type === 'EARNED' ? 'text-[#3E7B54]' : 'text-[#D97979]'
                      }`}
                    >
                      {tx.type === 'EARNED' ? `+${tx.points}` : `-${tx.points}`} Pts
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-[#7D6B67]">No points transactions recorded yet.</p>
            )}
          </div>
        </div>
      )}

      {/* 3. WISHLIST TAB */}
      {activeTab === 'wishlist' && (
        <div className="space-y-6">
          {wishlistProducts.length === 0 ? (
            <div className="p-12 text-center bg-[#FFFDF9] border border-[#E8DED4] space-y-3 rounded-sm shadow-xs">
              <p className="font-serif text-xl text-[#7D6B67]">Your wishlist is currently empty.</p>
              <p className="text-xs text-[#7D6B67]">Save products by clicking the heart icon on any product card.</p>
              <button
                onClick={() => setCurrentPage('shop')}
                className="mt-2 px-6 py-2.5 bg-[#C9878D] hover:bg-[#B56F75] text-white text-xs uppercase tracking-[0.2em] font-semibold transition-colors cursor-pointer rounded-sm"
              >
                Browse Products
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {wishlistProducts.map(p => (
                <div key={p.id} className="bg-[#FFFDF9] border border-[#E8DED4] p-4 flex flex-col justify-between space-y-4 rounded-sm shadow-xs">
                  <div
                    onClick={() => {
                      setSelectedProduct(p);
                      setCurrentPage('product-detail');
                    }}
                    className="cursor-pointer space-y-3"
                  >
                    <div className="aspect-[4/3] bg-[#FAF7F2] overflow-hidden rounded-xs">
                      <img src={p.images[0] || ''} alt="" className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <span className="text-[10px] tracking-wider uppercase text-[#C9878D] font-semibold">
                        {p.categoryName}
                      </span>
                      <h3 className="font-serif text-base text-[#392C2A] font-medium">{p.name}</h3>
                      <p className="font-mono text-xs text-[#392C2A] tabular-nums mt-0.5 font-semibold">
                        ₹{p.price.toLocaleString('en-US')}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-2 border-t border-[#E8DED4]">
                    <button
                      onClick={() => addToCart(p, 1, p.variants?.[0]?.name)}
                      className="flex-1 py-2 bg-[#C9878D] hover:bg-[#B56F75] text-white text-[11px] font-semibold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors cursor-pointer rounded-xs shadow-xs"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                      <span>Add to Cart</span>
                    </button>
                    <button
                      onClick={() => toggleWishlist(p.id)}
                      className="p-2 border border-[#E8DED4] text-[#7D6B67] hover:text-[#D97979] hover:border-[#D97979] transition-colors rounded-xs cursor-pointer"
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

      {/* 4. ADDRESSES TAB */}
      {activeTab === 'addresses' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="font-serif text-xl text-[#392C2A]">Saved Shipping Addresses</h2>
            <button
              onClick={() => setShowAddAddress(!showAddAddress)}
              className="px-4 py-2 border border-[#C9878D] text-xs uppercase tracking-wider text-[#C9878D] hover:bg-[#C9878D] hover:text-white flex items-center gap-1.5 transition-colors cursor-pointer rounded-xs font-semibold"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add New Address</span>
            </button>
          </div>

          {showAddAddress && (
            <form onSubmit={handleSaveAddress} className="p-6 bg-[#FFFDF9] border border-[#E8DED4] space-y-4 text-xs max-w-xl rounded-sm shadow-xs">
              <h3 className="font-serif text-lg text-[#392C2A]">Add New Address</h3>
              <div>
                <label className="block text-[#7D6B67] mb-1 font-semibold uppercase">Full Name</label>
                <input
                  type="text"
                  required
                  value={addrName}
                  onChange={e => setAddrName(e.target.value)}
                  className="w-full bg-[#FAF7F2] border border-[#E8DED4] px-3 py-2 text-[#392C2A] rounded-sm focus:border-[#C9878D]"
                />
              </div>
              <div>
                <label className="block text-[#7D6B67] mb-1 font-semibold uppercase">Address Line 1</label>
                <input
                  type="text"
                  required
                  value={addrLine1}
                  onChange={e => setAddrLine1(e.target.value)}
                  className="w-full bg-[#FAF7F2] border border-[#E8DED4] px-3 py-2 text-[#392C2A] rounded-sm focus:border-[#C9878D]"
                />
              </div>
              <div>
                <label className="block text-[#7D6B67] mb-1 font-semibold uppercase">Address Line 2 (Optional)</label>
                <input
                  type="text"
                  value={addrLine2}
                  onChange={e => setAddrLine2(e.target.value)}
                  className="w-full bg-[#FAF7F2] border border-[#E8DED4] px-3 py-2 text-[#392C2A] rounded-sm focus:border-[#C9878D]"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#7D6B67] mb-1 font-semibold uppercase">City</label>
                  <input
                    type="text"
                    required
                    value={addrCity}
                    onChange={e => setAddrCity(e.target.value)}
                    className="w-full bg-[#FAF7F2] border border-[#E8DED4] px-3 py-2 text-[#392C2A] rounded-sm focus:border-[#C9878D]"
                  />
                </div>
                <div>
                  <label className="block text-[#7D6B67] mb-1 font-semibold uppercase">Postal Code (PIN)</label>
                  <input
                    type="text"
                    required
                    value={addrPostal}
                    onChange={e => setAddrPostal(e.target.value)}
                    className="w-full bg-[#FAF7F2] border border-[#E8DED4] px-3 py-2 text-[#392C2A] rounded-sm focus:border-[#C9878D]"
                  />
                </div>
              </div>
              <div>
                <label className="block text-[#7D6B67] mb-1 font-semibold uppercase">Phone Number</label>
                <input
                  type="text"
                  required
                  value={addrPhone}
                  onChange={e => setAddrPhone(e.target.value)}
                  className="w-full bg-[#FAF7F2] border border-[#E8DED4] px-3 py-2 text-[#392C2A] rounded-sm focus:border-[#C9878D]"
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  className="px-6 py-2 bg-[#C9878D] hover:bg-[#B56F75] text-white uppercase tracking-wider font-semibold cursor-pointer rounded-sm shadow-xs"
                >
                  Save Address
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddAddress(false)}
                  className="px-4 py-2 border border-[#E8DED4] text-[#7D6B67] hover:text-[#392C2A] uppercase tracking-wider cursor-pointer rounded-sm"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {user.addresses?.map(addr => (
              <div key={addr.id} className="p-6 bg-[#FFFDF9] border border-[#E8DED4] space-y-2 text-xs text-[#7D6B67] rounded-sm shadow-xs">
                <div className="flex justify-between items-center text-[#392C2A]">
                  <span className="font-serif text-base font-semibold">{addr.fullName}</span>
                  {addr.isDefault && (
                    <span className="text-[10px] tracking-wider uppercase text-[#C9878D] border border-[#C9878D] px-2 py-0.5 font-semibold rounded-xs">
                      Default Address
                    </span>
                  )}
                </div>
                <p>{addr.addressLine1}</p>
                {addr.addressLine2 && <p>{addr.addressLine2}</p>}
                <p>{addr.city}, {addr.state} - {addr.postalCode}</p>
                <p>India · {addr.phone}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5. PREFERENCES & ALERTS TAB */}
      {activeTab === 'preferences' && (
        <form onSubmit={handleSavePreferences} className="max-w-2xl bg-[#FFFDF9] border border-[#E8DED4] p-8 space-y-6 text-xs rounded-sm shadow-xs">
          <h2 className="font-serif text-xl text-[#392C2A] pb-3 border-b border-[#E8DED4]">
            Notification Preferences & Alerts
          </h2>

          <div className="space-y-4">
            <h3 className="font-serif text-base text-[#392C2A]">Notification Channels</h3>
            <div className="space-y-3">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={prefPriceDrop}
                  onChange={e => setPrefPriceDrop(e.target.checked)}
                  className="accent-[#C9878D]"
                />
                <div>
                  <p className="text-[#392C2A] font-medium">Price Drop Notifications</p>
                  <p className="text-[#7D6B67] text-[11px]">Receive alerts when items in your wishlist go on sale.</p>
                </div>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={prefStock}
                  onChange={e => setPrefStock(e.target.checked)}
                  className="accent-[#C9878D]"
                />
                <div>
                  <p className="text-[#392C2A] font-medium">Back-in-Stock Alerts</p>
                  <p className="text-[#7D6B67] text-[11px]">Receive notification when sold-out items are restocked.</p>
                </div>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={prefOrders}
                  onChange={e => setPrefOrders(e.target.checked)}
                  className="accent-[#C9878D]"
                />
                <div>
                  <p className="text-[#392C2A] font-medium">Real-time Order Updates</p>
                  <p className="text-[#7D6B67] text-[11px]">Receive SMS and email notifications with delivery updates.</p>
                </div>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={prefNewsletter}
                  onChange={e => setPrefNewsletter(e.target.checked)}
                  className="accent-[#C9878D]"
                />
                <div>
                  <p className="text-[#392C2A] font-medium">Newsletter & Seasonal Releases</p>
                  <p className="text-[#7D6B67] text-[11px]">Receive curated articles and exclusive early access to new collections.</p>
                </div>
              </label>
            </div>
          </div>

          <div className="space-y-3 pt-4 border-t border-[#E8DED4]">
            <h3 className="font-serif text-base text-[#392C2A]">Favorite Product Categories</h3>
            <p className="text-[#7D6B67] text-[11px]">Select your preferred categories for personalized recommendations:</p>
            <div className="flex flex-wrap gap-2">
              {[
                { name: 'Luxury Fragrances', slug: 'fragrances' },
                { name: 'Lifestyle & Apparel', slug: 'apparel' },
                { name: 'Botanical Skincare', slug: 'skincare' }
              ].map(cat => (
                <button
                  type="button"
                  key={cat.slug}
                  onClick={() => toggleCategory(cat.slug)}
                  className={`px-3 py-1.5 border uppercase tracking-wider text-xs cursor-pointer rounded-xs transition-colors ${
                    favCats.includes(cat.slug)
                      ? 'bg-[#C9878D] text-white border-[#C9878D] font-semibold shadow-xs'
                      : 'bg-[#FAF7F2] text-[#7D6B67] border-[#E8DED4] hover:border-[#C9878D]'
                  }`}
                >
                  {cat.name} {favCats.includes(cat.slug) && '✓'}
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3.5 bg-[#C9878D] hover:bg-[#B56F75] text-white uppercase tracking-[0.2em] font-semibold transition-colors cursor-pointer rounded-sm shadow-xs"
          >
            Save Notification Preferences
          </button>
        </form>
      )}

      {/* 6. RECENTLY VIEWED TAB */}
      {activeTab === 'recent' && (
        <div className="space-y-6">
          {recentlyViewedProducts.length === 0 ? (
            <p className="text-xs text-[#7D6B67] py-8 text-center bg-[#FFFDF9] border border-[#E8DED4] rounded-sm">
              No products recently viewed in this browsing session.
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {recentlyViewedProducts.map(p => (
                <div
                  key={p.id}
                  onClick={() => {
                    setSelectedProduct(p);
                    setCurrentPage('product-detail');
                  }}
                  className="bg-[#FFFDF9] border border-[#E8DED4] p-3 space-y-2 cursor-pointer hover:border-[#C9878D] transition-colors rounded-sm shadow-xs"
                >
                  <div className="aspect-[4/5] bg-[#FAF7F2] overflow-hidden rounded-xs">
                    <img src={p.images[0] || ''} alt="" className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h4 className="font-serif text-sm text-[#392C2A] font-medium line-clamp-1">{p.name}</h4>
                    <p className="font-mono text-xs text-[#392C2A] tabular-nums font-semibold">₹{p.price.toLocaleString('en-US')}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
