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
  Trash2,
  Coins,
  Bell,
  Eye,
  CheckCircle2,
  RotateCcw
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

  const handleSavePreferences = async (e: React.FormEvent) => {
    e.preventDefault();
    await updatePreferences(favCats, {
      priceDropAlerts: prefPriceDrop,
      backInStockAlerts: prefStock,
      orderUpdates: prefOrders,
      gazetteNewsletter: prefNewsletter
    });
  };

  const toggleCategory = (slug: string) => {
    setFavCats(prev =>
      prev.includes(slug) ? prev.filter(s => s !== slug) : [...prev, slug]
    );
  };

  const wishlistProducts = products.filter(p => wishlistIds.includes(p.id));
  const recentlyViewedProducts = products.filter(p => recentlyViewedIds.includes(p.id));

  // If Not Logged In: Show Luxury Auth Portal
  if (!user) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 space-y-8">
        <div className="text-center space-y-2">
          <span className="text-xs tracking-[0.25em] uppercase text-[#8C7A6B] font-semibold">
            The Client Sanctuary
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl text-[#1E1714]">
            {authMode === 'login'
              ? 'Sanctuary Sign In'
              : authMode === 'register'
              ? 'Create Atelier Account'
              : 'Password Recovery'}
          </h1>
          <p className="text-xs text-[#6B5C50] leading-relaxed">
            Access your private acquisitions, tracked deliveries, and bespoke consultations.
          </p>
        </div>

        {/* Demo Fast Switcher */}
        <div className="p-3 bg-white border border-[#E7E0D6] space-y-2 text-xs">
          <span className="block text-[11px] text-[#8C7A6B] uppercase tracking-wider font-semibold">
            Evaluation Quick Sign-In
          </span>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => quickLoginDemo('CUSTOMER')}
              className="py-1.5 px-3 border border-[#DCD3C7] hover:border-[#1E1714] text-[#1E1714] text-[11px] uppercase tracking-wider transition-colors cursor-pointer bg-[#FAF8F5]"
            >
              Demo Client
            </button>
            <button
              onClick={() => quickLoginDemo('ADMIN')}
              className="py-1.5 px-3 border border-[#BFA175] text-[#8C7A6B] hover:text-[#1E1714] text-[11px] uppercase tracking-wider transition-colors cursor-pointer bg-[#F4EFEA] font-semibold"
            >
              Admin Director
            </button>
          </div>
        </div>

        {/* Forms */}
        {authMode === 'login' ? (
          <form onSubmit={handleLoginSubmit} className="space-y-4 text-xs bg-white p-6 border border-[#E7E0D6]">
            {authError && (
              <div className="p-3 bg-[#FDF2F2] border border-[#F3C8C8] text-[#9E3636] text-[11px]">
                {authError}
              </div>
            )}
            <div>
              <label className="block text-[#8C7A6B] mb-1 uppercase tracking-wider font-medium">Email</label>
              <input
                type="email"
                required
                placeholder="client@elixirnoir.com"
                value={authEmail}
                onChange={e => setAuthEmail(e.target.value)}
                className="w-full bg-[#FAF8F5] border border-[#DCD3C7] px-3.5 py-2.5 text-[#1E1714] placeholder-[#AAA] focus:outline-none focus:border-[#1E1714]"
              />
            </div>
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-[#8C7A6B] uppercase tracking-wider font-medium">Password</label>
                <button
                  type="button"
                  onClick={() => setAuthMode('forgot')}
                  className="text-[11px] text-[#8C7A6B] hover:text-[#1E1714] underline"
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
                className="w-full bg-[#FAF8F5] border border-[#DCD3C7] px-3.5 py-2.5 text-[#1E1714] placeholder-[#AAA] focus:outline-none focus:border-[#1E1714]"
              />
            </div>
            <button
              type="submit"
              disabled={isSubmittingAuth}
              className="w-full py-3.5 bg-[#1E1714] hover:bg-[#342721] text-[#FAF8F5] text-xs font-semibold tracking-[0.2em] uppercase transition-colors cursor-pointer mt-2"
            >
              {isSubmittingAuth ? 'Verifying Credentials...' : 'Sign In to Sanctuary'}
            </button>
            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => setAuthMode('register')}
                className="text-xs text-[#8C7A6B] hover:text-[#1E1714] underline"
              >
                Don't possess an account? Inscribe here.
              </button>
            </div>
          </form>
        ) : authMode === 'register' ? (
          <form onSubmit={handleRegisterSubmit} className="space-y-4 text-xs bg-white p-6 border border-[#E7E0D6]">
            {authError && (
              <div className="p-3 bg-[#FDF2F2] border border-[#F3C8C8] text-[#9E3636] text-[11px]">
                {authError}
              </div>
            )}
            <div>
              <label className="block text-[#8C7A6B] mb-1 uppercase tracking-wider font-medium">Full Name</label>
              <input
                type="text"
                required
                placeholder="Eleanor Vance"
                value={authName}
                onChange={e => setAuthName(e.target.value)}
                className="w-full bg-[#FAF8F5] border border-[#DCD3C7] px-3.5 py-2.5 text-[#1E1714] placeholder-[#AAA] focus:outline-none focus:border-[#1E1714]"
              />
            </div>
            <div>
              <label className="block text-[#8C7A6B] mb-1 uppercase tracking-wider font-medium">Email</label>
              <input
                type="email"
                required
                placeholder="client@elixirnoir.com"
                value={authEmail}
                onChange={e => setAuthEmail(e.target.value)}
                className="w-full bg-[#FAF8F5] border border-[#DCD3C7] px-3.5 py-2.5 text-[#1E1714] placeholder-[#AAA] focus:outline-none focus:border-[#1E1714]"
              />
            </div>
            <div>
              <label className="block text-[#8C7A6B] mb-1 uppercase tracking-wider font-medium">Password (Min 8 chars)</label>
              <input
                type="password"
                required
                placeholder="••••••••••••"
                value={authPassword}
                onChange={e => setAuthPassword(e.target.value)}
                className="w-full bg-[#FAF8F5] border border-[#DCD3C7] px-3.5 py-2.5 text-[#1E1714] placeholder-[#AAA] focus:outline-none focus:border-[#1E1714]"
              />
            </div>
            <button
              type="submit"
              disabled={isSubmittingAuth}
              className="w-full py-3.5 bg-[#1E1714] hover:bg-[#342721] text-[#FAF8F5] text-xs font-semibold tracking-[0.2em] uppercase transition-colors cursor-pointer mt-2"
            >
              {isSubmittingAuth ? 'Creating Record...' : 'Create Account (+500 Welcome Points)'}
            </button>
            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => setAuthMode('login')}
                className="text-xs text-[#8C7A6B] hover:text-[#1E1714] underline"
              >
                Already possess an account? Sign in.
              </button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleForgotPassword} className="space-y-4 text-xs bg-white p-6 border border-[#E7E0D6]">
            <div>
              <label className="block text-[#8C7A6B] mb-1 uppercase tracking-wider font-medium">Registered Email</label>
              <input
                type="email"
                required
                placeholder="client@elixirnoir.com"
                value={authEmail}
                onChange={e => setAuthEmail(e.target.value)}
                className="w-full bg-[#FAF8F5] border border-[#DCD3C7] px-3.5 py-2.5 text-[#1E1714] placeholder-[#AAA] focus:outline-none focus:border-[#1E1714]"
              />
            </div>
            <button
              type="submit"
              className="w-full py-3.5 bg-[#1E1714] hover:bg-[#342721] text-[#FAF8F5] text-xs font-semibold tracking-[0.2em] uppercase transition-colors cursor-pointer mt-2"
            >
              Send Cryptographic Reset Token
            </button>
            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => setAuthMode('login')}
                className="text-xs text-[#8C7A6B] hover:text-[#1E1714] underline"
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#E7E0D6] pb-6 gap-4">
        <div>
          <span className="text-xs tracking-[0.25em] uppercase text-[#8C7A6B] font-semibold">
            Client Sanctuary
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl text-[#1E1714] mt-1">
            Welcome, {user.name}
          </h1>
          <div className="flex items-center gap-3 text-xs text-[#6B5C50] font-mono mt-1">
            <span>{user.email}</span>
            <span>·</span>
            <span className="text-[#1E1714] font-semibold">
              {user.loyaltyPoints || 0} Nocturne Points ({user.loyaltyTier || 'NOIR'} Tier)
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {user.role === 'ADMIN' && (
            <button
              onClick={() => setCurrentPage('admin')}
              className="px-4 py-2 border border-[#BFA175] text-xs uppercase tracking-wider text-[#8C7A6B] hover:text-[#1E1714] flex items-center gap-1.5 font-medium cursor-pointer"
            >
              <Shield className="w-3.5 h-3.5" />
              <span>Admin Atelier Portal</span>
            </button>
          )}

          <button
            onClick={logout}
            className="px-4 py-2 border border-[#DCD3C7] hover:border-[#1E1714] text-xs uppercase tracking-wider text-[#6B5C50] hover:text-[#1E1714] flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* Tabs Menu */}
      <div className="flex border-b border-[#E7E0D6] gap-6 text-xs uppercase tracking-[0.18em] overflow-x-auto">
        <button
          onClick={() => setActiveTab('orders')}
          className={`pb-3 whitespace-nowrap transition-colors cursor-pointer flex items-center gap-2 ${
            activeTab === 'orders'
              ? 'text-[#1E1714] border-b-2 border-[#1E1714] font-medium'
              : 'text-[#8C7A6B] hover:text-[#1E1714]'
          }`}
        >
          <Package className="w-4 h-4" />
          <span>Orders & Tracking ({userOrders.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('loyalty')}
          className={`pb-3 whitespace-nowrap transition-colors cursor-pointer flex items-center gap-2 ${
            activeTab === 'loyalty'
              ? 'text-[#1E1714] border-b-2 border-[#1E1714] font-medium'
              : 'text-[#8C7A6B] hover:text-[#1E1714]'
          }`}
        >
          <Coins className="w-4 h-4 text-[#BFA175]" />
          <span>Privilège Rewards ({user.loyaltyPoints || 0} Pts)</span>
        </button>

        <button
          onClick={() => setActiveTab('wishlist')}
          className={`pb-3 whitespace-nowrap transition-colors cursor-pointer flex items-center gap-2 ${
            activeTab === 'wishlist'
              ? 'text-[#1E1714] border-b-2 border-[#1E1714] font-medium'
              : 'text-[#8C7A6B] hover:text-[#1E1714]'
          }`}
        >
          <Heart className="w-4 h-4" />
          <span>Curated Wishlist ({wishlistIds.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('addresses')}
          className={`pb-3 whitespace-nowrap transition-colors cursor-pointer flex items-center gap-2 ${
            activeTab === 'addresses'
              ? 'text-[#1E1714] border-b-2 border-[#1E1714] font-medium'
              : 'text-[#8C7A6B] hover:text-[#1E1714]'
          }`}
        >
          <MapPin className="w-4 h-4" />
          <span>Sanctuary Addresses ({user.addresses?.length || 0})</span>
        </button>

        <button
          onClick={() => setActiveTab('preferences')}
          className={`pb-3 whitespace-nowrap transition-colors cursor-pointer flex items-center gap-2 ${
            activeTab === 'preferences'
              ? 'text-[#1E1714] border-b-2 border-[#1E1714] font-medium'
              : 'text-[#8C7A6B] hover:text-[#1E1714]'
          }`}
        >
          <Bell className="w-4 h-4" />
          <span>Alerts & Personalization</span>
        </button>

        <button
          onClick={() => setActiveTab('recent')}
          className={`pb-3 whitespace-nowrap transition-colors cursor-pointer flex items-center gap-2 ${
            activeTab === 'recent'
              ? 'text-[#1E1714] border-b-2 border-[#1E1714] font-medium'
              : 'text-[#8C7A6B] hover:text-[#1E1714]'
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
            <p className="text-xs text-[#8C7A6B] py-8">Retrieving order ledgers...</p>
          ) : userOrders.length === 0 ? (
            <div className="p-12 text-center bg-white border border-[#E7E0D6] space-y-3">
              <p className="font-serif text-xl text-[#8C7A6B]">No historical orders recorded yet.</p>
              <p className="text-xs text-[#6B5C50]">Acquisitions completed with this account will be archived here.</p>
              <button
                onClick={() => setCurrentPage('shop')}
                className="mt-2 px-6 py-2.5 bg-[#1E1714] text-[#FAF8F5] text-xs uppercase tracking-[0.2em]"
              >
                Explore Catalog
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {userOrders.map(order => (
                <div key={order.id} className="bg-white border border-[#E7E0D6] p-6 space-y-4 shadow-sm">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#F3EFEA] gap-2 text-xs">
                    <div>
                      <span className="font-mono text-[#1E1714] text-sm font-semibold">
                        Order #{order.orderNumber}
                      </span>
                      <span className="text-[#8C7A6B] ml-3">
                        {new Date(order.createdAt).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric'
                        })}
                      </span>
                    </div>

                    <div className="flex items-center gap-4">
                      <span className="text-[11px] tracking-wider uppercase font-mono px-2 py-0.5 border border-[#DCD3C7] text-[#1E1714] font-medium">
                        {order.orderStatus}
                      </span>
                      <span className="font-mono text-sm text-[#1E1714] font-bold tabular-nums">
                        ₹{order.totalAmount.toLocaleString('en-IN')}
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
                            className="w-10 h-12 object-cover border border-[#E7E0D6]"
                          />
                          <div>
                            <p className="font-serif text-sm text-[#1E1714] font-medium">{item.productName}</p>
                            <p className="text-[#8C7A6B]">
                              Qty: {item.quantity} {item.selectedVariant ? `· ${item.selectedVariant}` : ''}
                            </p>
                          </div>
                        </div>
                        <span className="font-mono text-[#1E1714] tabular-nums">
                          ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="pt-4 border-t border-[#F3EFEA] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-[#6B5C50]">
                    <div>
                      {order.trackingNumber ? (
                        <span>Waybill: <strong className="text-[#1E1714] font-mono">{order.trackingNumber}</strong> ({order.trackingCourier || 'Blue Dart'})</span>
                      ) : (
                        <span>Atelier Packaging & Formulation in Progress</span>
                      )}
                    </div>
                    <div className="flex items-center gap-4">
                      <button
                        onClick={() => {
                          setActiveOrder(order);
                          setCurrentPage('order-confirmation');
                        }}
                        className="text-[#1E1714] hover:text-[#8C7A6B] underline flex items-center gap-1 cursor-pointer font-medium"
                      >
                        <span>Full Receipt & Live Tracking</span>
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
            <div className="p-6 bg-white border border-[#E7E0D6] space-y-2">
              <span className="text-[11px] uppercase tracking-wider text-[#8C7A6B]">Available Points</span>
              <p className="font-mono text-3xl text-[#1E1714] font-bold">
                {user.loyaltyPoints || 0}
              </p>
              <p className="text-[11px] text-[#6B5C50]">Worth ₹{user.loyaltyPoints || 0} towards future acquisitions</p>
            </div>

            <div className="p-6 bg-white border border-[#E7E0D6] space-y-2">
              <span className="text-[11px] uppercase tracking-wider text-[#8C7A6B]">Atelier Patron Tier</span>
              <p className="font-serif text-3xl text-[#BFA175] font-normal">
                {user.loyaltyTier || 'NOIR'}
              </p>
              <p className="text-[11px] text-[#6B5C50]">Tier upgraded at 1,000 (Or) and 3,000 (Impérial)</p>
            </div>

            <div className="p-6 bg-white border border-[#E7E0D6] space-y-2">
              <span className="text-[11px] uppercase tracking-wider text-[#8C7A6B]">Redemption Policy</span>
              <p className="text-xs text-[#5C4F44] leading-relaxed">
                1 point equals ₹1 concession. Redeem directly inside your shopping bag for up to 30% of total order value.
              </p>
            </div>
          </div>

          <div className="bg-white border border-[#E7E0D6] p-6 space-y-4">
            <h3 className="font-serif text-xl text-[#1E1714]">Points Ledger History</h3>
            {user.loyaltyHistory && user.loyaltyHistory.length > 0 ? (
              <div className="divide-y divide-[#F3EFEA] text-xs">
                {user.loyaltyHistory.map(tx => (
                  <div key={tx.id} className="py-3 flex items-center justify-between">
                    <div>
                      <p className="text-[#1E1714] font-medium">{tx.description}</p>
                      <p className="text-[#8C7A6B] font-mono text-[11px]">{tx.date}</p>
                    </div>
                    <span
                      className={`font-mono font-semibold ${
                        tx.type === 'EARNED' ? 'text-[#3F6E50]' : 'text-[#A86464]'
                      }`}
                    >
                      {tx.type === 'EARNED' ? `+${tx.points}` : `-${tx.points}`} Pts
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-[#8C7A6B]">No transactions recorded yet.</p>
            )}
          </div>
        </div>
      )}

      {/* 3. WISHLIST TAB */}
      {activeTab === 'wishlist' && (
        <div className="space-y-6">
          {wishlistProducts.length === 0 ? (
            <div className="p-12 text-center bg-white border border-[#E7E0D6] space-y-3">
              <p className="font-serif text-xl text-[#8C7A6B]">Your curated wishlist is presently empty.</p>
              <p className="text-xs text-[#6B5C50]">Save creations by selecting the heart icon on any card.</p>
              <button
                onClick={() => setCurrentPage('shop')}
                className="mt-2 px-6 py-2.5 bg-[#1E1714] text-[#FAF8F5] text-xs uppercase tracking-[0.2em]"
              >
                Browse Catalog
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {wishlistProducts.map(p => (
                <div key={p.id} className="bg-white border border-[#E7E0D6] p-4 flex flex-col justify-between space-y-4">
                  <div
                    onClick={() => {
                      setSelectedProduct(p);
                      setCurrentPage('product-detail');
                    }}
                    className="cursor-pointer space-y-3"
                  >
                    <div className="aspect-[4/3] bg-[#F4EFEA] overflow-hidden">
                      <img src={p.images[0] || ''} alt="" className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <span className="text-[10px] tracking-wider uppercase text-[#BFA175] font-semibold">
                        {p.categoryName}
                      </span>
                      <h3 className="font-serif text-base text-[#1E1714] font-medium">{p.name}</h3>
                      <p className="font-mono text-xs text-[#8C7A6B] tabular-nums mt-0.5 font-semibold">
                        ₹{p.price.toLocaleString('en-IN')}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-2 border-t border-[#F3EFEA]">
                    <button
                      onClick={() => addToCart(p, 1, p.variants?.[0]?.name)}
                      className="flex-1 py-2 bg-[#1E1714] hover:bg-[#342721] text-[#FAF8F5] text-[11px] font-semibold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                      <span>Move to Bag</span>
                    </button>
                    <button
                      onClick={() => toggleWishlist(p.id)}
                      className="p-2 border border-[#DCD3C7] text-[#8C7A6B] hover:text-[#A86464] hover:border-[#A86464] transition-colors"
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
            <h2 className="font-serif text-xl text-[#1E1714]">Saved Delivery Sanctuaries</h2>
            <button
              onClick={() => setShowAddAddress(!showAddAddress)}
              className="px-4 py-2 border border-[#1E1714] text-xs uppercase tracking-wider text-[#1E1714] hover:bg-[#1E1714] hover:text-[#FAF8F5] flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add New Address</span>
            </button>
          </div>

          {showAddAddress && (
            <form onSubmit={handleSaveAddress} className="p-6 bg-white border border-[#E7E0D6] space-y-4 text-xs max-w-xl">
              <h3 className="font-serif text-lg text-[#1E1714]">Add Delivery Sanctuary</h3>
              <div>
                <label className="block text-[#8C7A6B] mb-1">Full Legal Name</label>
                <input
                  type="text"
                  required
                  value={addrName}
                  onChange={e => setAddrName(e.target.value)}
                  className="w-full bg-[#FAF8F5] border border-[#DCD3C7] px-3 py-2 text-[#1E1714]"
                />
              </div>
              <div>
                <label className="block text-[#8C7A6B] mb-1">Address Line 1</label>
                <input
                  type="text"
                  required
                  value={addrLine1}
                  onChange={e => setAddrLine1(e.target.value)}
                  className="w-full bg-[#FAF8F5] border border-[#DCD3C7] px-3 py-2 text-[#1E1714]"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#8C7A6B] mb-1">City</label>
                  <input
                    type="text"
                    required
                    value={addrCity}
                    onChange={e => setAddrCity(e.target.value)}
                    className="w-full bg-[#FAF8F5] border border-[#DCD3C7] px-3 py-2 text-[#1E1714]"
                  />
                </div>
                <div>
                  <label className="block text-[#8C7A6B] mb-1">Postal Code (PIN)</label>
                  <input
                    type="text"
                    required
                    value={addrPostal}
                    onChange={e => setAddrPostal(e.target.value)}
                    className="w-full bg-[#FAF8F5] border border-[#DCD3C7] px-3 py-2 text-[#1E1714]"
                  />
                </div>
              </div>
              <div>
                <label className="block text-[#8C7A6B] mb-1">Phone Number (Courier Handover)</label>
                <input
                  type="text"
                  required
                  value={addrPhone}
                  onChange={e => setAddrPhone(e.target.value)}
                  className="w-full bg-[#FAF8F5] border border-[#DCD3C7] px-3 py-2 text-[#1E1714]"
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  className="px-6 py-2 bg-[#1E1714] text-[#FAF8F5] uppercase tracking-wider font-semibold cursor-pointer"
                >
                  Save Address
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddAddress(false)}
                  className="px-4 py-2 border border-[#DCD3C7] text-[#8C7A6B] uppercase tracking-wider cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {user.addresses?.map(addr => (
              <div key={addr.id} className="p-6 bg-white border border-[#E7E0D6] space-y-2 text-xs text-[#5C4F44]">
                <div className="flex justify-between items-center text-[#1E1714]">
                  <span className="font-serif text-base font-medium">{addr.fullName}</span>
                  {addr.isDefault && (
                    <span className="text-[10px] tracking-wider uppercase text-[#BFA175] border border-[#BFA175] px-1.5 py-0.5 font-medium">
                      Default Sanctuary
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
        <form onSubmit={handleSavePreferences} className="max-w-2xl bg-white border border-[#E7E0D6] p-8 space-y-6 text-xs">
          <h2 className="font-serif text-xl text-[#1E1714] pb-3 border-b border-[#F3EFEA]">
            Sanctuary Preferences & Alerts
          </h2>

          <div className="space-y-4">
            <h3 className="font-serif text-base text-[#1E1714]">Notification Channels</h3>
            <div className="space-y-3">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={prefPriceDrop}
                  onChange={e => setPrefPriceDrop(e.target.checked)}
                  className="accent-[#1E1714]"
                />
                <div>
                  <p className="text-[#1E1714] font-medium">Privilege Price Drop Notifications</p>
                  <p className="text-[#8C7A6B] text-[11px]">Receive alerts when wishlist creations receive seasonal concessions.</p>
                </div>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={prefStock}
                  onChange={e => setPrefStock(e.target.checked)}
                  className="accent-[#1E1714]"
                />
                <div>
                  <p className="text-[#1E1714] font-medium">Back-in-Stock Atelier Alerts</p>
                  <p className="text-[#8C7A6B] text-[11px]">Receive notification when limited batch harvest bottles are restocked.</p>
                </div>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={prefOrders}
                  onChange={e => setPrefOrders(e.target.checked)}
                  className="accent-[#1E1714]"
                />
                <div>
                  <p className="text-[#1E1714] font-medium">Real-time Order Waybill Updates</p>
                  <p className="text-[#8C7A6B] text-[11px]">Dispatches SMS & email courier milestones for white glove deliveries.</p>
                </div>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={prefNewsletter}
                  onChange={e => setPrefNewsletter(e.target.checked)}
                  className="accent-[#1E1714]"
                />
                <div>
                  <p className="text-[#1E1714] font-medium">The Nocturne Gazette Journal</p>
                  <p className="text-[#8C7A6B] text-[11px]">Bi-monthly essays on olfactory maceration and sartorial architecture.</p>
                </div>
              </label>
            </div>
          </div>

          <div className="space-y-3 pt-4 border-t border-[#F3EFEA]">
            <h3 className="font-serif text-base text-[#1E1714]">Favorite Curated Disciplines</h3>
            <p className="text-[#8C7A6B] text-[11px]">Select your preferred categories for personalized catalog recommendations:</p>
            <div className="flex flex-wrap gap-2">
              {[
                { name: 'Haute Parfumerie', slug: 'fragrances' },
                { name: 'Sartorial Wardrobe', slug: 'apparel' },
                { name: 'Botanical Skincare', slug: 'skincare' }
              ].map(cat => (
                <button
                  type="button"
                  key={cat.slug}
                  onClick={() => toggleCategory(cat.slug)}
                  className={`px-3 py-1.5 border uppercase tracking-wider text-xs cursor-pointer ${
                    favCats.includes(cat.slug)
                      ? 'bg-[#1E1714] text-[#FAF8F5] border-[#1E1714] font-medium'
                      : 'bg-[#FAF8F5] text-[#5C4F44] border-[#DCD3C7]'
                  }`}
                >
                  {cat.name} {favCats.includes(cat.slug) && '✓'}
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-[#1E1714] hover:bg-[#342721] text-[#FAF8F5] uppercase tracking-[0.2em] font-semibold transition-colors cursor-pointer"
          >
            Save Sanctuary Preferences
          </button>
        </form>
      )}

      {/* 6. RECENTLY VIEWED TAB */}
      {activeTab === 'recent' && (
        <div className="space-y-6">
          {recentlyViewedProducts.length === 0 ? (
            <p className="text-xs text-[#8C7A6B] py-8 text-center bg-white border border-[#E7E0D6]">
              No creations recently viewed in this browser session.
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
                  className="bg-white border border-[#E7E0D6] p-3 space-y-2 cursor-pointer hover:border-[#1E1714] transition-colors"
                >
                  <div className="aspect-[4/5] bg-[#F4EFEA] overflow-hidden">
                    <img src={p.images[0] || ''} alt="" className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h4 className="font-serif text-sm text-[#1E1714] font-medium line-clamp-1">{p.name}</h4>
                    <p className="font-mono text-xs text-[#8C7A6B] tabular-nums">₹{p.price.toLocaleString('en-IN')}</p>
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
