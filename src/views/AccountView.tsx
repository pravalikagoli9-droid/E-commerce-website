import React, { useState, useEffect } from 'react';
import type { Order } from '../types';
import { useStore } from '../context/StoreContext';
import { fetchUserOrdersFromFirestore } from '../services/firebaseFirestore';
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
  Eye,
  UserCheck,
  Phone,
  Mail,
  Edit3,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

export const AccountView: React.FC = () => {
  const {
    user,
    token,
    login,
    register,
    loginWithGoogle,
    resetPassword,
    logout,
    addAddress,
    updateProfileDetails,
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

  const [activeTab, setActiveTab] = useState<'profile' | 'orders' | 'wishlist' | 'loyalty' | 'addresses' | 'preferences' | 'recent'>('orders');

  // Auth Forms
  const [authMode, setAuthMode] = useState<'login' | 'register' | 'forgot'>('login');
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authName, setAuthName] = useState('');
  const [authPhone, setAuthPhone] = useState('');
  const [isSubmittingAuth, setIsSubmittingAuth] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [forgotSuccess, setForgotSuccess] = useState<string | null>(null);

  // User Orders
  const [userOrders, setUserOrders] = useState<Order[]>([]);
  const [isLoadingOrders, setIsLoadingOrders] = useState(false);

  // Profile Edit Form State
  const [editName, setEditName] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [isSavingProfile, setIsSavingProfile] = useState(false);

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
      setEditName(user.name || '');
      setEditPhone(user.phone || '');
      setPrefPriceDrop(user.notificationPreferences?.priceDropAlerts ?? true);
      setPrefStock(user.notificationPreferences?.backInStockAlerts ?? true);
      setPrefOrders(user.notificationPreferences?.orderUpdates ?? true);
      setPrefNewsletter(user.notificationPreferences?.gazetteNewsletter ?? true);
      setFavCats(user.favoriteCategories || []);
    }
  }, [user]);

  // Load orders directly from Cloud Firestore when user is authenticated
  useEffect(() => {
    if (user?.id) {
      setIsLoadingOrders(true);
      fetchUserOrdersFromFirestore(user.id)
        .then(orders => {
          if (orders && orders.length > 0) {
            setUserOrders(orders);
          } else if (token) {
            // Fallback to server endpoint
            fetch('/api/orders', {
              headers: { Authorization: `Bearer ${token}` }
            })
              .then(res => res.json())
              .then(data => {
                setUserOrders(data.orders || []);
              })
              .catch(console.error);
          }
        })
        .catch(() => {
          if (token) {
            fetch('/api/orders', {
              headers: { Authorization: `Bearer ${token}` }
            })
              .then(res => res.json())
              .then(data => {
                setUserOrders(data.orders || []);
              })
              .catch(console.error);
          }
        })
        .finally(() => setIsLoadingOrders(false));
    }
  }, [user?.id, token]);

  const validateEmail = (email: string) => {
    return /\S+@\S+\.\S+/.test(email);
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);

    if (!validateEmail(authEmail)) {
      setAuthError('Kindly provide a valid email address.');
      return;
    }
    if (!authPassword) {
      setAuthError('Kindly enter your account password.');
      return;
    }

    setIsSubmittingAuth(true);
    const res = await login(authEmail, authPassword);
    setIsSubmittingAuth(false);
    if (!res.success) {
      setAuthError(res.error || 'Invalid email address or password. Kindly try again.');
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);

    if (!authName.trim()) {
      setAuthError('Kindly enter your full name.');
      return;
    }
    if (!validateEmail(authEmail)) {
      setAuthError('Kindly provide a valid email address.');
      return;
    }
    if (authPassword.length < 8) {
      setAuthError('Password must contain at least 8 characters.');
      return;
    }

    setIsSubmittingAuth(true);
    const res = await register(authName, authEmail, authPassword, authPhone);
    setIsSubmittingAuth(false);
    if (!res.success) {
      setAuthError(res.error || 'Registration failed. Kindly verify your details.');
    }
  };

  const handleGoogleSignIn = async () => {
    setAuthError(null);
    setIsSubmittingAuth(true);
    const res = await loginWithGoogle();
    setIsSubmittingAuth(false);
    if (!res.success) {
      setAuthError(res.error || 'Google sign-in could not be completed. Kindly try again.');
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setForgotSuccess(null);

    if (!validateEmail(authEmail)) {
      setAuthError('Kindly enter a valid registered email address.');
      return;
    }

    setIsSubmittingAuth(true);
    const res = await resetPassword(authEmail);
    setIsSubmittingAuth(false);
    if (res.success) {
      setForgotSuccess('A password reset link has been dispatched to your email address. Kindly check your inbox.');
    } else {
      setAuthError(res.error || 'Unable to send password reset email. Kindly check your email address.');
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editName.trim()) {
      showToast('Kindly enter your name.', 'error');
      return;
    }
    setIsSavingProfile(true);
    const res = await updateProfileDetails(editName.trim(), editPhone.trim());
    setIsSavingProfile(false);
    if (!res.success) {
      showToast(res.error || 'Unable to update profile. Kindly try again.', 'error');
    }
  };

  const handleSaveAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!addrName || !addrLine1 || !addrCity || !addrPostal || !addrPhone) {
      showToast('Kindly complete all required address fields.', 'error');
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
      setAddrName('');
      setAddrLine1('');
      setAddrLine2('');
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
    showToast('Your notification preferences have been saved successfully.', 'success');
  };

  const toggleCategory = (slug: string) => {
    setFavCats(prev =>
      prev.includes(slug) ? prev.filter(s => s !== slug) : [...prev, slug]
    );
  };

  const wishlistProducts = products.filter(p => wishlistIds.includes(p.id));
  const recentlyViewedProducts = products.filter(p => recentlyViewedIds.includes(p.id));

  // IF NOT LOGGED IN: SHOW AUTHENTICATION PORTAL
  if (!user) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 space-y-8">
        <div className="text-center space-y-2">
          <span className="text-xs tracking-[0.25em] uppercase text-[#D6B77A] font-semibold">
            VELMORA Customer Concierge
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl text-[#30231F] font-normal">
            {authMode === 'login'
              ? 'Sign In to Your Account'
              : authMode === 'register'
              ? 'Create a Patron Account'
              : 'Reset Your Password'}
          </h1>
          <p className="text-xs text-[#7D6B67] leading-relaxed">
            Access your cloud-synced orders, delivery tracking, saved wishlist, and loyalty benefits.
          </p>
        </div>

        {/* Google One-Click Sign-In Button */}
        <div className="bg-[#FFFDF9] border border-[#E8DED4] p-4 rounded-sm shadow-xs space-y-3">
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={isSubmittingAuth}
            className="w-full py-3 px-4 border border-[#D6B77A] hover:border-[#B56F75] bg-white hover:bg-[#FAF7F2] text-[#30231F] text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer rounded-xs flex items-center justify-center gap-3 shadow-xs"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>Continue with Google</span>
          </button>

          <div className="flex items-center gap-2 pt-1">
            <div className="flex-1 h-[1px] bg-[#E8DED4]" />
            <span className="text-[10px] uppercase tracking-wider text-[#7D6B67] font-semibold">Or with Email</span>
            <div className="flex-1 h-[1px] bg-[#E8DED4]" />
          </div>
        </div>

        {/* Demo Fast Switcher */}
        <div className="p-4 bg-[#FFFDF9] border border-[#E8DED4] space-y-2.5 text-xs rounded-sm shadow-xs">
          <span className="block text-[11px] text-[#7D6B67] uppercase tracking-wider font-semibold">
            Quick Demo Sign-In
          </span>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => quickLoginDemo('CUSTOMER')}
              className="py-2 px-3 border border-[#E8DED4] hover:border-[#D6B77A] text-[#30231F] text-[11px] uppercase tracking-wider transition-colors cursor-pointer bg-[#FAF7F2] font-semibold rounded-xs"
            >
              Demo Patron
            </button>
            <button
              onClick={() => quickLoginDemo('ADMIN')}
              className="py-2 px-3 border border-[#D6B77A] text-[#9E743A] hover:bg-[#D6B77A] hover:text-[#241B18] text-[11px] uppercase tracking-wider transition-colors cursor-pointer bg-[#FFFDF9] font-semibold rounded-xs"
            >
              Store Director
            </button>
          </div>
        </div>

        {/* Forms */}
        {authMode === 'login' ? (
          <form onSubmit={handleLoginSubmit} className="space-y-4 text-xs bg-[#FFFDF9] p-6 sm:p-8 border border-[#E8DED4] rounded-sm shadow-xs">
            {authError && (
              <div className="p-3 bg-[#FAF7F2] border border-[#D97979] text-[#A63A3A] text-[11px] rounded-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-[#A63A3A]" />
                <span>{authError}</span>
              </div>
            )}
            <div>
              <label className="block text-[#7D6B67] mb-1 uppercase tracking-wider font-semibold">Email Address</label>
              <input
                type="email"
                required
                placeholder="patron@velmora.com"
                value={authEmail}
                onChange={e => setAuthEmail(e.target.value)}
                className="w-full bg-[#FAF7F2] border border-[#E8DED4] px-3.5 py-2.5 text-[#30231F] placeholder-[#998] focus:outline-none focus:border-[#D6B77A] rounded-sm"
              />
            </div>
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-[#7D6B67] uppercase tracking-wider font-semibold">Password</label>
                <button
                  type="button"
                  onClick={() => {
                    setAuthMode('forgot');
                    setAuthError(null);
                    setForgotSuccess(null);
                  }}
                  className="text-[11px] text-[#9E743A] hover:text-[#5A3E36] underline cursor-pointer"
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
                className="w-full bg-[#FAF7F2] border border-[#E8DED4] px-3.5 py-2.5 text-[#30231F] placeholder-[#998] focus:outline-none focus:border-[#D6B77A] rounded-sm"
              />
            </div>
            <button
              type="submit"
              disabled={isSubmittingAuth}
              className="w-full py-3.5 bg-[#D6B77A] hover:bg-[#ECCF96] text-[#241B18] text-xs font-semibold tracking-[0.2em] uppercase transition-colors cursor-pointer mt-2 shadow-xs rounded-sm"
            >
              {isSubmittingAuth ? 'Signing In...' : 'Sign In'}
            </button>
            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => {
                  setAuthMode('register');
                  setAuthError(null);
                }}
                className="text-xs text-[#7D6B67] hover:text-[#30231F] underline cursor-pointer"
              >
                New to VELMORA? Create your patron account.
              </button>
            </div>
          </form>
        ) : authMode === 'register' ? (
          <form onSubmit={handleRegisterSubmit} className="space-y-4 text-xs bg-[#FFFDF9] p-6 sm:p-8 border border-[#E8DED4] rounded-sm shadow-xs">
            {authError && (
              <div className="p-3 bg-[#FAF7F2] border border-[#D97979] text-[#A63A3A] text-[11px] rounded-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-[#A63A3A]" />
                <span>{authError}</span>
              </div>
            )}
            <div>
              <label className="block text-[#7D6B67] mb-1 uppercase tracking-wider font-semibold">Full Name</label>
              <input
                type="text"
                required
                placeholder="Aarav Sharma"
                value={authName}
                onChange={e => setAuthName(e.target.value)}
                className="w-full bg-[#FAF7F2] border border-[#E8DED4] px-3.5 py-2.5 text-[#30231F] placeholder-[#998] focus:outline-none focus:border-[#D6B77A] rounded-sm"
              />
            </div>
            <div>
              <label className="block text-[#7D6B67] mb-1 uppercase tracking-wider font-semibold">Email Address</label>
              <input
                type="email"
                required
                placeholder="patron@velmora.com"
                value={authEmail}
                onChange={e => setAuthEmail(e.target.value)}
                className="w-full bg-[#FAF7F2] border border-[#E8DED4] px-3.5 py-2.5 text-[#30231F] placeholder-[#998] focus:outline-none focus:border-[#D6B77A] rounded-sm"
              />
            </div>
            <div>
              <label className="block text-[#7D6B67] mb-1 uppercase tracking-wider font-semibold">Mobile Number</label>
              <input
                type="tel"
                placeholder="+91 98200 12345"
                value={authPhone}
                onChange={e => setAuthPhone(e.target.value)}
                className="w-full bg-[#FAF7F2] border border-[#E8DED4] px-3.5 py-2.5 text-[#30231F] placeholder-[#998] focus:outline-none focus:border-[#D6B77A] rounded-sm"
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
                className="w-full bg-[#FAF7F2] border border-[#E8DED4] px-3.5 py-2.5 text-[#30231F] placeholder-[#998] focus:outline-none focus:border-[#D6B77A] rounded-sm"
              />
            </div>
            <button
              type="submit"
              disabled={isSubmittingAuth}
              className="w-full py-3.5 bg-[#D6B77A] hover:bg-[#ECCF96] text-[#241B18] text-xs font-semibold tracking-[0.2em] uppercase transition-colors cursor-pointer mt-2 shadow-xs rounded-sm"
            >
              {isSubmittingAuth ? 'Creating Account...' : 'Register (+500 Welcome Points)'}
            </button>
            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => {
                  setAuthMode('login');
                  setAuthError(null);
                }}
                className="text-xs text-[#7D6B67] hover:text-[#30231F] underline cursor-pointer"
              >
                Already registered? Sign in here.
              </button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleForgotPassword} className="space-y-4 text-xs bg-[#FFFDF9] p-6 sm:p-8 border border-[#E8DED4] rounded-sm shadow-xs">
            {forgotSuccess && (
              <div className="p-3 bg-[#F0FDF4] border border-[#86EFAC] text-[#166534] text-[11px] rounded-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-[#166534]" />
                <span>{forgotSuccess}</span>
              </div>
            )}
            {authError && (
              <div className="p-3 bg-[#FAF7F2] border border-[#D97979] text-[#A63A3A] text-[11px] rounded-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-[#A63A3A]" />
                <span>{authError}</span>
              </div>
            )}
            <div>
              <label className="block text-[#7D6B67] mb-1 uppercase tracking-wider font-semibold">Registered Email Address</label>
              <input
                type="email"
                required
                placeholder="patron@velmora.com"
                value={authEmail}
                onChange={e => setAuthEmail(e.target.value)}
                className="w-full bg-[#FAF7F2] border border-[#E8DED4] px-3.5 py-2.5 text-[#30231F] placeholder-[#998] focus:outline-none focus:border-[#D6B77A] rounded-sm"
              />
            </div>
            <button
              type="submit"
              disabled={isSubmittingAuth}
              className="w-full py-3.5 bg-[#D6B77A] hover:bg-[#ECCF96] text-[#241B18] text-xs font-semibold tracking-[0.2em] uppercase transition-colors cursor-pointer mt-2 shadow-xs rounded-sm"
            >
              {isSubmittingAuth ? 'Sending Reset Link...' : 'Send Password Reset Link'}
            </button>
            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => {
                  setAuthMode('login');
                  setAuthError(null);
                  setForgotSuccess(null);
                }}
                className="text-xs text-[#7D6B67] hover:text-[#30231F] underline cursor-pointer"
              >
                Return to Sign In
              </button>
            </div>
          </form>
        )}
      </div>
    );
  }

  // AUTHENTICATED PATRON DASHBOARD
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header Profile Info */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#E8DED4] pb-6 gap-4">
        <div>
          <span className="text-xs tracking-[0.25em] uppercase text-[#D6B77A] font-semibold">
            Patron Account · Cloud Synchronized
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl text-[#30231F] mt-1 font-normal">
            Welcome, {user.name}
          </h1>
          <div className="flex flex-wrap items-center gap-3 text-xs text-[#7D6B67] font-mono mt-1">
            <span>{user.email}</span>
            {user.phone && (
              <>
                <span>·</span>
                <span>{user.phone}</span>
              </>
            )}
            <span>·</span>
            <span className="text-[#30231F] font-semibold">
              {user.loyaltyPoints || 0} Reward Points ({user.loyaltyTier || 'NOIR'} Tier)
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {user.role === 'ADMIN' && (
            <button
              onClick={() => setCurrentPage('admin')}
              className="px-4 py-2 border border-[#D6B77A] text-xs uppercase tracking-wider text-[#9E743A] hover:bg-[#D6B77A] hover:text-[#241B18] flex items-center gap-1.5 font-semibold transition-colors cursor-pointer rounded-xs"
            >
              <Shield className="w-3.5 h-3.5" />
              <span>Admin Dashboard</span>
            </button>
          )}

          <button
            onClick={logout}
            className="px-4 py-2 border border-[#E8DED4] hover:border-[#D6B77A] text-xs uppercase tracking-wider text-[#7D6B67] hover:text-[#30231F] flex items-center gap-1.5 transition-colors cursor-pointer rounded-xs"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* Tabs Menu */}
      <div className="flex border-b border-[#E8DED4] gap-6 text-xs uppercase tracking-[0.18em] overflow-x-auto">
        <button
          onClick={() => setActiveTab('profile')}
          className={`pb-3 whitespace-nowrap transition-colors cursor-pointer flex items-center gap-2 ${
            activeTab === 'profile'
              ? 'text-[#30231F] border-b-2 border-[#D6B77A] font-semibold'
              : 'text-[#7D6B67] hover:text-[#30231F]'
          }`}
        >
          <UserCheck className="w-4 h-4 text-[#D6B77A]" />
          <span>Profile Details</span>
        </button>

        <button
          onClick={() => setActiveTab('orders')}
          className={`pb-3 whitespace-nowrap transition-colors cursor-pointer flex items-center gap-2 ${
            activeTab === 'orders'
              ? 'text-[#30231F] border-b-2 border-[#D6B77A] font-semibold'
              : 'text-[#7D6B67] hover:text-[#30231F]'
          }`}
        >
          <Package className="w-4 h-4" />
          <span>Orders ({userOrders.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('loyalty')}
          className={`pb-3 whitespace-nowrap transition-colors cursor-pointer flex items-center gap-2 ${
            activeTab === 'loyalty'
              ? 'text-[#30231F] border-b-2 border-[#D6B77A] font-semibold'
              : 'text-[#7D6B67] hover:text-[#30231F]'
          }`}
        >
          <Coins className="w-4 h-4 text-[#D6B77A]" />
          <span>Reward Points ({user.loyaltyPoints || 0} Pts)</span>
        </button>

        <button
          onClick={() => setActiveTab('wishlist')}
          className={`pb-3 whitespace-nowrap transition-colors cursor-pointer flex items-center gap-2 ${
            activeTab === 'wishlist'
              ? 'text-[#30231F] border-b-2 border-[#D6B77A] font-semibold'
              : 'text-[#7D6B67] hover:text-[#30231F]'
          }`}
        >
          <Heart className="w-4 h-4" />
          <span>Wishlist ({wishlistIds.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('addresses')}
          className={`pb-3 whitespace-nowrap transition-colors cursor-pointer flex items-center gap-2 ${
            activeTab === 'addresses'
              ? 'text-[#30231F] border-b-2 border-[#D6B77A] font-semibold'
              : 'text-[#7D6B67] hover:text-[#30231F]'
          }`}
        >
          <MapPin className="w-4 h-4" />
          <span>Addresses ({user.addresses?.length || 0})</span>
        </button>

        <button
          onClick={() => setActiveTab('preferences')}
          className={`pb-3 whitespace-nowrap transition-colors cursor-pointer flex items-center gap-2 ${
            activeTab === 'preferences'
              ? 'text-[#30231F] border-b-2 border-[#D6B77A] font-semibold'
              : 'text-[#7D6B67] hover:text-[#30231F]'
          }`}
        >
          <Bell className="w-4 h-4" />
          <span>Preferences</span>
        </button>

        <button
          onClick={() => setActiveTab('recent')}
          className={`pb-3 whitespace-nowrap transition-colors cursor-pointer flex items-center gap-2 ${
            activeTab === 'recent'
              ? 'text-[#30231F] border-b-2 border-[#D6B77A] font-semibold'
              : 'text-[#7D6B67] hover:text-[#30231F]'
          }`}
        >
          <Eye className="w-4 h-4" />
          <span>Recently Viewed ({recentlyViewedIds.length})</span>
        </button>
      </div>

      {/* 0. PROFILE & CONTACT DETAILS TAB (FIRESTORE SYNCED) */}
      {activeTab === 'profile' && (
        <div className="max-w-2xl bg-[#FFFDF9] border border-[#E8DED4] p-8 space-y-6 text-xs rounded-sm shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-[#E8DED4]">
            <div>
              <h2 className="font-serif text-xl text-[#30231F]">Patron Profile & Firestore Information</h2>
              <p className="text-[#7D6B67] text-[11px] mt-0.5">Manage your details stored securely in Cloud Firestore.</p>
            </div>
            <div className="flex items-center gap-1.5 px-2.5 py-1 bg-[#F0FDF4] border border-[#86EFAC] text-[#166534] rounded-full text-[10px] font-mono">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Cloud Synced</span>
            </div>
          </div>

          <form onSubmit={handleSaveProfile} className="space-y-4">
            <div>
              <label className="block text-[#7D6B67] mb-1 uppercase tracking-wider font-semibold">Full Name</label>
              <input
                type="text"
                required
                value={editName}
                onChange={e => setEditName(e.target.value)}
                className="w-full bg-[#FAF7F2] border border-[#E8DED4] px-3.5 py-2.5 text-[#30231F] focus:outline-none focus:border-[#D6B77A] rounded-sm"
              />
            </div>

            <div>
              <label className="block text-[#7D6B67] mb-1 uppercase tracking-wider font-semibold">Email Address (Registered)</label>
              <input
                type="email"
                disabled
                value={user.email}
                className="w-full bg-[#EFEBE6] border border-[#E8DED4] px-3.5 py-2.5 text-[#7D6B67] cursor-not-allowed rounded-sm"
              />
              <span className="text-[10px] text-[#7D6B67] mt-1 block">To change your email address, kindly contact concierge.</span>
            </div>

            <div>
              <label className="block text-[#7D6B67] mb-1 uppercase tracking-wider font-semibold">Contact Telephone / Mobile</label>
              <input
                type="tel"
                placeholder="+91 98200 12345"
                value={editPhone}
                onChange={e => setEditPhone(e.target.value)}
                className="w-full bg-[#FAF7F2] border border-[#E8DED4] px-3.5 py-2.5 text-[#30231F] focus:outline-none focus:border-[#D6B77A] rounded-sm"
              />
            </div>

            <div className="p-4 bg-[#FAF7F2] border border-[#E8DED4] rounded-xs space-y-1">
              <span className="font-semibold text-[#30231F] block text-xs">Patron Privilege Summary</span>
              <p className="text-[11px] text-[#7D6B67]">
                Tier: <strong className="text-[#30231F]">{user.loyaltyTier || 'NOIR'}</strong> · Available Balance: <strong className="text-[#D6B77A]">{user.loyaltyPoints || 0} Points</strong>
              </p>
              <p className="text-[10px] text-[#7D6B67]">Cloud Document: <code className="text-[#9E743A]">/users/{user.id}</code></p>
            </div>

            <button
              type="submit"
              disabled={isSavingProfile}
              className="w-full py-3.5 bg-[#D6B77A] hover:bg-[#ECCF96] text-[#241B18] uppercase tracking-[0.2em] font-semibold transition-colors cursor-pointer rounded-sm shadow-xs"
            >
              {isSavingProfile ? 'Updating in Firestore...' : 'Update Profile in Cloud Firestore'}
            </button>
          </form>
        </div>
      )}

      {/* 1. ORDERS TAB */}
      {activeTab === 'orders' && (
        <div className="space-y-6">
          {isLoadingOrders ? (
            <p className="text-xs text-[#7D6B67] py-8 text-center bg-[#FFFDF9] border border-[#E8DED4] rounded-sm">
              Fetching your orders from Cloud Firestore...
            </p>
          ) : userOrders.length === 0 ? (
            <div className="text-center py-12 bg-[#FFFDF9] border border-[#E8DED4] space-y-3 rounded-sm">
              <ShoppingBag className="w-8 h-8 text-[#D6B77A] mx-auto stroke-1" />
              <h3 className="font-serif text-lg text-[#30231F]">No Orders on Record</h3>
              <p className="text-xs text-[#7D6B67]">You have not placed any orders with VELMORA yet.</p>
              <button
                onClick={() => setCurrentPage('shop')}
                className="px-6 py-2 bg-[#D6B77A] hover:bg-[#ECCF96] text-[#241B18] text-xs uppercase tracking-wider font-semibold transition-colors rounded-sm cursor-pointer"
              >
                Explore Catalogue
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {userOrders.map(order => (
                <div key={order.id} className="bg-[#FFFDF9] border border-[#E8DED4] p-6 space-y-4 rounded-sm shadow-xs">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#E8DED4] pb-4 gap-2">
                    <div>
                      <span className="font-mono text-xs text-[#7D6B67] block">Order #{order.orderNumber}</span>
                      <span className="text-[11px] text-[#7D6B67]">
                        Placed on {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-1 text-[10px] uppercase tracking-wider bg-[#FAF7F2] text-[#30231F] border border-[#E8DED4] font-semibold rounded-xs">
                        {order.orderStatus}
                      </span>
                      <span className={`px-2.5 py-1 text-[10px] uppercase tracking-wider font-semibold rounded-xs ${
                        order.paymentStatus === 'PAID'
                          ? 'bg-[#F0FDF4] text-[#166534] border border-[#86EFAC]'
                          : 'bg-[#FFFBEB] text-[#92400E] border border-[#FCD34D]'
                      }`}>
                        {order.paymentStatus}
                      </span>
                    </div>
                  </div>

                  {/* Order Line Items */}
                  <div className="divide-y divide-[#E8DED4]/60">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="py-3 flex items-center justify-between text-xs">
                        <div className="flex items-center gap-3">
                          <img
                            src={item.productImage || ''}
                            alt=""
                            className="w-12 h-14 object-cover bg-[#FAF7F2] rounded-xs border border-[#E8DED4]"
                          />
                          <div>
                            <p className="font-serif text-[#30231F] font-medium">{item.productName}</p>
                            {item.selectedVariant && (
                              <p className="text-[11px] text-[#7D6B67]">Edition: {item.selectedVariant}</p>
                            )}
                            <p className="text-[11px] text-[#7D6B67]">Quantity: {item.quantity}</p>
                          </div>
                        </div>
                        <span className="font-mono text-[#30231F] tabular-nums font-semibold">
                          ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between pt-4 border-t border-[#E8DED4] gap-3">
                    <div className="text-xs text-[#7D6B67]">
                      <span>Payment: {order.paymentMethod === 'COD' ? 'Cash on Delivery' : 'Online Prepaid'}</span>
                      {order.trackingNumber && (
                        <p className="text-[11px] text-[#9E743A]">
                          Courier: {order.trackingCourier || 'Blue Dart Express'} · AWB: {order.trackingNumber}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-[#7D6B67]">Total Amount:</span>
                      <span className="font-serif text-lg text-[#30231F] font-semibold tabular-nums">
                        ₹{order.totalAmount.toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 2. LOYALTY REWARDS TAB */}
      {activeTab === 'loyalty' && (
        <div className="space-y-6">
          <div className="bg-[#FFFDF9] border border-[#E8DED4] p-6 sm:p-8 space-y-4 rounded-sm shadow-xs">
            <span className="text-xs tracking-[0.25em] uppercase text-[#D6B77A] font-semibold block">
              Maison VELMORA Privileges
            </span>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="font-serif text-2xl text-[#30231F]">
                  Tier Status: {user.loyaltyTier || 'NOIR'}
                </h3>
                <p className="text-xs text-[#7D6B67] mt-1">
                  Earn points on every handcrafted flacon purchase and redeem at checkout (₹1 per point).
                </p>
              </div>
              <div className="text-right">
                <span className="font-serif text-3xl sm:text-4xl text-[#30231F] font-bold">
                  {user.loyaltyPoints || 0}
                </span>
                <span className="text-xs text-[#7D6B67] block uppercase tracking-wider font-semibold">
                  Available Reward Points
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. WISHLIST TAB */}
      {activeTab === 'wishlist' && (
        <div className="space-y-6">
          {wishlistProducts.length === 0 ? (
            <div className="text-center py-12 bg-[#FFFDF9] border border-[#E8DED4] space-y-3 rounded-sm">
              <Heart className="w-8 h-8 text-[#D6B77A] mx-auto stroke-1" />
              <h3 className="font-serif text-lg text-[#30231F]">Your Wishlist is Empty</h3>
              <p className="text-xs text-[#7D6B67]">Save your favorite signature fragrances and couture items for later.</p>
              <button
                onClick={() => setCurrentPage('shop')}
                className="px-6 py-2 bg-[#D6B77A] hover:bg-[#ECCF96] text-[#241B18] text-xs uppercase tracking-wider font-semibold transition-colors rounded-sm cursor-pointer"
              >
                Explore Catalogue
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {wishlistProducts.map(prod => (
                <div key={prod.id} className="bg-[#FFFDF9] border border-[#E8DED4] p-4 space-y-3 rounded-sm shadow-xs flex flex-col justify-between">
                  <div
                    onClick={() => {
                      setSelectedProduct(prod);
                      setCurrentPage('product-detail');
                    }}
                    className="cursor-pointer space-y-3"
                  >
                    <div className="aspect-[4/5] bg-[#FAF7F2] overflow-hidden rounded-xs">
                      <img src={prod.images[0] || ''} alt={prod.name} className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <span className="text-[10px] uppercase tracking-wider text-[#7D6B67]">{prod.categoryName}</span>
                      <h4 className="font-serif text-base text-[#30231F] font-medium">{prod.name}</h4>
                      <p className="font-mono text-sm text-[#30231F] tabular-nums font-semibold">
                        ₹{prod.price.toLocaleString('en-IN')}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-2 border-t border-[#E8DED4]">
                    <button
                      onClick={() => addToCart(prod, 1)}
                      className="flex-1 py-2 bg-[#D6B77A] hover:bg-[#ECCF96] text-[#241B18] text-xs uppercase tracking-wider font-semibold rounded-xs transition-colors cursor-pointer text-center"
                    >
                      Add to Cart
                    </button>
                    <button
                      onClick={() => toggleWishlist(prod.id)}
                      className="p-2 border border-[#E8DED4] hover:border-[#D6B77A] text-[#7D6B67] hover:text-[#30231F] rounded-xs cursor-pointer"
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
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-xl text-[#30231F]">Saved Delivery Addresses</h2>
            <button
              onClick={() => setShowAddAddress(true)}
              className="px-4 py-2 bg-[#D6B77A] hover:bg-[#ECCF96] text-[#241B18] text-xs uppercase tracking-wider font-semibold flex items-center gap-1.5 rounded-sm transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add New Address</span>
            </button>
          </div>

          {showAddAddress && (
            <form onSubmit={handleSaveAddress} className="max-w-2xl bg-[#FFFDF9] border border-[#E8DED4] p-6 space-y-4 text-xs rounded-sm shadow-xs">
              <h3 className="font-serif text-base text-[#30231F]">Add Delivery Address</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[#7D6B67] mb-1 uppercase tracking-wider font-semibold">Full Name</label>
                  <input
                    type="text"
                    required
                    value={addrName}
                    onChange={e => setAddrName(e.target.value)}
                    className="w-full bg-[#FAF7F2] border border-[#E8DED4] px-3.5 py-2 text-[#30231F] rounded-sm"
                  />
                </div>
                <div>
                  <label className="block text-[#7D6B67] mb-1 uppercase tracking-wider font-semibold">Telephone / Mobile</label>
                  <input
                    type="tel"
                    required
                    value={addrPhone}
                    onChange={e => setAddrPhone(e.target.value)}
                    className="w-full bg-[#FAF7F2] border border-[#E8DED4] px-3.5 py-2 text-[#30231F] rounded-sm"
                  />
                </div>
              </div>
              <div>
                <label className="block text-[#7D6B67] mb-1 uppercase tracking-wider font-semibold">Address Line 1</label>
                <input
                  type="text"
                  required
                  placeholder="House/Apartment Number, Street"
                  value={addrLine1}
                  onChange={e => setAddrLine1(e.target.value)}
                  className="w-full bg-[#FAF7F2] border border-[#E8DED4] px-3.5 py-2 text-[#30231F] rounded-sm"
                />
              </div>
              <div>
                <label className="block text-[#7D6B67] mb-1 uppercase tracking-wider font-semibold">Address Line 2 (Optional)</label>
                <input
                  type="text"
                  placeholder="Locality, Landmark"
                  value={addrLine2}
                  onChange={e => setAddrLine2(e.target.value)}
                  className="w-full bg-[#FAF7F2] border border-[#E8DED4] px-3.5 py-2 text-[#30231F] rounded-sm"
                />
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-[#7D6B67] mb-1 uppercase tracking-wider font-semibold">City</label>
                  <input
                    type="text"
                    required
                    value={addrCity}
                    onChange={e => setAddrCity(e.target.value)}
                    className="w-full bg-[#FAF7F2] border border-[#E8DED4] px-3.5 py-2 text-[#30231F] rounded-sm"
                  />
                </div>
                <div>
                  <label className="block text-[#7D6B67] mb-1 uppercase tracking-wider font-semibold">State</label>
                  <input
                    type="text"
                    required
                    value={addrState}
                    onChange={e => setAddrState(e.target.value)}
                    className="w-full bg-[#FAF7F2] border border-[#E8DED4] px-3.5 py-2 text-[#30231F] rounded-sm"
                  />
                </div>
                <div>
                  <label className="block text-[#7D6B67] mb-1 uppercase tracking-wider font-semibold">PIN Code</label>
                  <input
                    type="text"
                    required
                    value={addrPostal}
                    onChange={e => setAddrPostal(e.target.value)}
                    className="w-full bg-[#FAF7F2] border border-[#E8DED4] px-3.5 py-2 text-[#30231F] rounded-sm"
                  />
                </div>
              </div>
              <div className="flex items-center gap-3 pt-2">
                <button
                  type="submit"
                  className="py-2.5 px-6 bg-[#D6B77A] hover:bg-[#ECCF96] text-[#241B18] text-xs uppercase tracking-wider font-semibold rounded-xs transition-colors cursor-pointer"
                >
                  Save Address in Cloud
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddAddress(false)}
                  className="py-2.5 px-4 border border-[#E8DED4] hover:border-[#D6B77A] text-[#7D6B67] text-xs uppercase tracking-wider rounded-xs cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {(user.addresses || []).map((addr, idx) => (
              <div key={idx} className="bg-[#FFFDF9] border border-[#E8DED4] p-5 space-y-2 rounded-sm shadow-xs text-xs">
                <div className="flex items-center justify-between">
                  <strong className="font-serif text-sm text-[#30231F]">{addr.fullName}</strong>
                  {addr.isDefault && (
                    <span className="px-2 py-0.5 text-[10px] bg-[#FAF7F2] border border-[#D6B77A] text-[#9E743A] rounded-xs font-semibold">
                      Primary Delivery Address
                    </span>
                  )}
                </div>
                <p className="text-[#7D6B67]">
                  {addr.addressLine1}
                  {addr.addressLine2 && `, ${addr.addressLine2}`}
                </p>
                <p className="text-[#7D6B67]">
                  {addr.city}, {addr.state} - {addr.postalCode}
                </p>
                <p className="text-[#30231F] font-mono mt-2">Mobile: {addr.phone}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5. PREFERENCES TAB */}
      {activeTab === 'preferences' && (
        <form onSubmit={handleSavePreferences} className="max-w-2xl bg-[#FFFDF9] border border-[#E8DED4] p-8 space-y-6 text-xs rounded-sm shadow-xs">
          <h2 className="font-serif text-xl text-[#30231F] pb-3 border-b border-[#E8DED4]">
            Notification Preferences & Alerts
          </h2>

          <div className="space-y-4">
            <h3 className="font-serif text-base text-[#30231F]">Notification Channels</h3>
            <div className="space-y-3">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={prefPriceDrop}
                  onChange={e => setPrefPriceDrop(e.target.checked)}
                  className="accent-[#D6B77A]"
                />
                <div>
                  <p className="text-[#30231F] font-medium">Price Drop Notifications</p>
                  <p className="text-[#7D6B67] text-[11px]">Receive alerts when items in your wishlist go on special promotion.</p>
                </div>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={prefStock}
                  onChange={e => setPrefStock(e.target.checked)}
                  className="accent-[#D6B77A]"
                />
                <div>
                  <p className="text-[#30231F] font-medium">Back-in-Stock Alerts</p>
                  <p className="text-[#7D6B67] text-[11px]">Receive notifications when rare vintage extraits are restocked.</p>
                </div>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={prefOrders}
                  onChange={e => setPrefOrders(e.target.checked)}
                  className="accent-[#D6B77A]"
                />
                <div>
                  <p className="text-[#30231F] font-medium">Real-Time Order Updates</p>
                  <p className="text-[#7D6B67] text-[11px]">Receive updates with courier consignment tracking.</p>
                </div>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={prefNewsletter}
                  onChange={e => setPrefNewsletter(e.target.checked)}
                  className="accent-[#D6B77A]"
                />
                <div>
                  <p className="text-[#30231F] font-medium">VELMORA Gazette Newsletter</p>
                  <p className="text-[#7D6B67] text-[11px]">Receive private invitations and notes on high perfumery distillations.</p>
                </div>
              </label>
            </div>
          </div>

          <div className="space-y-3 pt-4 border-t border-[#E8DED4]">
            <h3 className="font-serif text-base text-[#30231F]">Favorite Product Categories</h3>
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
                      ? 'bg-[#D6B77A] text-[#241B18] border-[#D6B77A] font-semibold shadow-xs'
                      : 'bg-[#FAF7F2] text-[#7D6B67] border-[#E8DED4] hover:border-[#D6B77A]'
                  }`}
                >
                  {cat.name} {favCats.includes(cat.slug) && '✓'}
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3.5 bg-[#D6B77A] hover:bg-[#ECCF96] text-[#241B18] uppercase tracking-[0.2em] font-semibold transition-colors cursor-pointer rounded-sm shadow-xs"
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
                  className="bg-[#FFFDF9] border border-[#E8DED4] p-3 space-y-2 cursor-pointer hover:border-[#D6B77A] transition-colors rounded-sm shadow-xs"
                >
                  <div className="aspect-[4/5] bg-[#FAF7F2] overflow-hidden rounded-xs">
                    <img src={p.images[0] || ''} alt="" className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h4 className="font-serif text-sm text-[#30231F] font-medium line-clamp-1">{p.name}</h4>
                    <p className="font-mono text-xs text-[#30231F] tabular-nums font-semibold">₹{p.price.toLocaleString('en-IN')}</p>
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
