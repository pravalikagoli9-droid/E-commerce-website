import React, { createContext, useContext, useState, useEffect, ReactNode, useRef } from 'react';
import type { User, Product, CartItem, Order, Coupon, Address, GiftOptions, ProductAlert, Review } from '../types';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../lib/firebase';
import {
  signUpWithEmail,
  signInWithEmail,
  signInWithGoogle,
  sendPasswordReset,
  signOutUser,
  getUserProfile,
  syncUserProfileDoc,
  updateUserProfile
} from '../services/firebaseAuth';
import {
  saveCartToFirestore,
  mergeGuestCartWithCloud,
  saveWishlistToFirestore,
  fetchWishlistFromFirestore,
  fetchProductsFromFirestore,
  seedInitialFirestoreCatalog
} from '../services/firebaseFirestore';

export type ActivePage =
  | 'home'
  | 'shop'
  | 'product-detail'
  | 'cart'
  | 'checkout'
  | 'order-confirmation'
  | 'account'
  | 'admin'
  | 'about'
  | 'faq'
  | 'blog'
  | 'contact'
  | 'policies'
  | 'gifting'
  | 'offers'
  | 'tracking';

export interface ToastMessage {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

interface StoreContextType {
  // Page Navigation
  currentPage: ActivePage;
  setCurrentPage: (page: ActivePage) => void;
  selectedProduct: Product | null;
  setSelectedProduct: (product: Product | null) => void;
  activeOrder: Order | null;
  setActiveOrder: (order: Order | null) => void;
  selectedCategorySlug: string | null;
  setSelectedCategorySlug: (slug: string | null) => void;
  policyTab: string;
  setPolicyTab: (tab: string) => void;

  // Search & Cart Drawers
  isSearchOpen: boolean;
  setIsSearchOpen: (open: boolean) => void;
  isCartDrawerOpen: boolean;
  setIsCartDrawerOpen: (open: boolean) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;

  // Quick View Modal
  quickViewProduct: Product | null;
  setQuickViewProduct: (product: Product | null) => void;

  // Product Comparison
  compareList: Product[];
  addToCompare: (product: Product) => void;
  removeFromCompare: (productId: string) => void;
  clearCompare: () => void;
  isCompareOpen: boolean;
  setIsCompareOpen: (open: boolean) => void;

  // AI Motion Studio
  isMotionStudioOpen: boolean;
  setIsMotionStudioOpen: (open: boolean) => void;

  // Personalization & Recently Viewed
  recentlyViewedIds: string[];
  addRecentlyViewed: (productId: string) => void;
  favoriteCategories: string[];
  toggleFavoriteCategory: (slug: string) => void;

  // Auth (Firebase Powered with Local Fallback)
  user: User | null;
  token: string | null;
  login: (email: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  register: (name: string, email: string, pass: string, phone?: string) => Promise<{ success: boolean; error?: string }>;
  loginWithGoogle: () => Promise<{ success: boolean; error?: string }>;
  resetPassword: (email: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  addAddress: (addr: Omit<Address, 'id'>) => Promise<boolean>;
  updateProfileDetails: (name: string, phone: string, address?: Address) => Promise<{ success: boolean; error?: string }>;
  updatePreferences: (favCats: string[], notifs: any) => Promise<void>;
  quickLoginDemo: (role: 'CUSTOMER' | 'ADMIN') => Promise<void>;
  isFirebaseConnected: boolean;

  // Products
  products: Product[];
  isLoadingProducts: boolean;
  refreshProducts: () => Promise<void>;

  // Cart
  cartItems: CartItem[];
  addToCart: (product: Product, quantity?: number, variant?: string) => void;
  updateCartQuantity: (productId: string, quantity: number, variant?: string) => void;
  removeFromCart: (productId: string, variant?: string) => void;
  clearCart: () => void;
  appliedCoupon: Coupon | null;
  applyCoupon: (code: string) => Promise<{ success: boolean; error?: string }>;
  removeCoupon: () => void;

  // Gifting Experience
  giftOptions: GiftOptions;
  setGiftOptions: React.Dispatch<React.SetStateAction<GiftOptions>>;
  giftWrapFee: number;

  // Loyalty Rewards
  pointsToRedeem: number;
  setPointsToRedeem: (points: number) => void;
  pointsDiscount: number;

  // Financial calculations
  cartSubtotal: number;
  cartDiscount: number;
  cartShippingFee: number;
  cartTax: number;
  cartTotal: number;

  // Wishlist & Alerts
  wishlistIds: string[];
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  subscribeAlert: (productId: string, productName: string, email: string, type: 'PRICE_DROP' | 'BACK_IN_STOCK', targetPrice?: number) => Promise<boolean>;

  // Toasts
  toasts: ToastMessage[];
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentPage, setCurrentPage] = useState<ActivePage>('home');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [activeOrder, setActiveOrder] = useState<Order | null>(null);
  const [selectedCategorySlug, setSelectedCategorySlug] = useState<string | null>(null);
  const [policyTab, setPolicyTab] = useState<string>('shipping');

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Quick View
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  // Compare
  const [compareList, setCompareList] = useState<Product[]>([]);
  const [isCompareOpen, setIsCompareOpen] = useState(false);

  // AI Motion Studio
  const [isMotionStudioOpen, setIsMotionStudioOpen] = useState(false);

  // Recently Viewed & Personalization
  const [recentlyViewedIds, setRecentlyViewedIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('velmora_recent') || localStorage.getItem('elixir_recent');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [favoriteCategories, setFavoriteCategories] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('velmora_fav_cats') || localStorage.getItem('elixir_fav_cats');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // User Auth
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('velmora_token') || localStorage.getItem('elixir_token'));
  const [isFirebaseConnected, setIsFirebaseConnected] = useState<boolean>(true);

  const [guestId] = useState<string>(() => {
    let id = localStorage.getItem('velmora_guest_id') || localStorage.getItem('elixir_guest_id');
    if (!id) {
      id = `gst_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
      localStorage.setItem('velmora_guest_id', id);
    }
    return id;
  });

  const [products, setProducts] = useState<Product[]>([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);

  // Cart
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('velmora_cart') || localStorage.getItem('elixir_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);

  // Gifting Options
  const [giftOptions, setGiftOptions] = useState<GiftOptions>({
    isGift: false,
    giftWrap: false,
    recipientName: '',
    giftMessage: '',
    hidePriceOnReceipt: true,
    occasion: 'Celebration'
  });

  // Loyalty Points to Redeem
  const [pointsToRedeem, setPointsToRedeem] = useState<number>(0);

  // Wishlist
  const [wishlistIds, setWishlistIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('elixir_wishlist') || localStorage.getItem('velmora_wishlist');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    const id = `${Date.now()}_${Math.random().toString(36).substring(2, 5)}`;
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  };

  // Flag to prevent overwriting cloud cart during initial load
  const isInitialCartSyncDone = useRef<boolean>(false);

  // ==========================================
  // FIREBASE AUTH STATE LISTENER
  // ==========================================
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      if (fbUser) {
        try {
          const userToken = await fbUser.getIdToken();
          setToken(userToken);
          localStorage.setItem('velmora_token', userToken);

          // Retrieve or sync user profile in Firestore
          let profile = await getUserProfile(fbUser.uid);
          if (!profile) {
            profile = await syncUserProfileDoc(fbUser);
          }
          setUser(profile);
          if (profile?.favoriteCategories?.length) {
            setFavoriteCategories(profile.favoriteCategories);
          }

          // Merge guest cart with user's Firestore cloud cart
          const mergedCart = await mergeGuestCartWithCloud(fbUser.uid, cartItems);
          if (mergedCart && mergedCart.length > 0) {
            setCartItems(mergedCart);
          }

          // Fetch cloud wishlist
          const cloudWishlist = await fetchWishlistFromFirestore(fbUser.uid);
          if (cloudWishlist && cloudWishlist.length > 0) {
            setWishlistIds(prev => Array.from(new Set([...prev, ...cloudWishlist])));
          }

          isInitialCartSyncDone.current = true;
        } catch (err) {
          console.error('Firebase Auth sync error:', err);
        }
      } else {
        // If no Firebase user, check if we have an active legacy session token
        isInitialCartSyncDone.current = true;
      }
    });

    return () => unsubscribe();
  }, []);

  // Sync products from Cloud Firestore (with API fallback & seeding)
  const refreshProducts = async () => {
    setIsLoadingProducts(true);
    try {
      // 1. Try reading from Cloud Firestore first
      const firestoreProducts = await fetchProductsFromFirestore();
      if (firestoreProducts && firestoreProducts.length > 0) {
        setProducts(firestoreProducts);
        setIsLoadingProducts(false);
        return;
      }

      // 2. Fetch from backend API
      const res = await fetch('/api/products');
      if (res.ok) {
        const data = await res.json();
        const apiProds = data.products || [];
        setProducts(apiProds);

        // 3. Proactively seed to Firestore so future operations use Firestore directly
        if (apiProds.length > 0) {
          const catRes = await fetch('/api/categories');
          const catData = catRes.ok ? await catRes.json() : { categories: [] };
          seedInitialFirestoreCatalog(apiProds, catData.categories || []);
        }
      }
    } catch (err) {
      console.error('Failed to load products:', err);
    } finally {
      setIsLoadingProducts(false);
    }
  };

  useEffect(() => {
    refreshProducts();
  }, []);

  // Persist cart to localStorage & Cloud Firestore (for logged in patrons)
  useEffect(() => {
    localStorage.setItem('velmora_cart', JSON.stringify(cartItems));

    // Also persist to server endpoint for guest sessions
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    } else {
      headers['x-guest-id'] = guestId;
    }
    fetch('/api/cart/save', {
      method: 'POST',
      headers,
      body: JSON.stringify({ items: cartItems })
    }).catch(console.error);

    // Save to Firestore if user is authenticated and initial sync has completed
    if (auth.currentUser && isInitialCartSyncDone.current) {
      saveCartToFirestore(auth.currentUser.uid, cartItems, appliedCoupon, giftOptions).catch(err => {
        console.warn('Could not sync cart to Cloud Firestore:', err);
      });
    }
  }, [cartItems, appliedCoupon, giftOptions, token, guestId]);

  // Persist wishlist
  useEffect(() => {
    localStorage.setItem('velmora_wishlist', JSON.stringify(wishlistIds));
    if (auth.currentUser) {
      saveWishlistToFirestore(auth.currentUser.uid, wishlistIds).catch(console.warn);
    }
  }, [wishlistIds]);

  // Persist recently viewed
  useEffect(() => {
    localStorage.setItem('velmora_recent', JSON.stringify(recentlyViewedIds));
  }, [recentlyViewedIds]);

  // Persist favorite categories
  useEffect(() => {
    localStorage.setItem('velmora_fav_cats', JSON.stringify(favoriteCategories));
  }, [favoriteCategories]);

  const addRecentlyViewed = (productId: string) => {
    setRecentlyViewedIds(prev => {
      const filtered = prev.filter(id => id !== productId);
      return [productId, ...filtered].slice(0, 8);
    });
  };

  const toggleFavoriteCategory = (slug: string) => {
    setFavoriteCategories(prev => {
      const exists = prev.includes(slug);
      const updated = exists ? prev.filter(s => s !== slug) : [...prev, slug];
      if (token && user) {
        fetch('/api/user/preferences', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({ favoriteCategories: updated })
        }).catch(console.error);
      }
      showToast(
        exists ? 'Category preference updated.' : 'Category saved to your favorites.',
        'info'
      );
      return updated;
    });
  };

  const addToCompare = (product: Product) => {
    if (compareList.length >= 3) {
      showToast('You can compare a maximum of 3 items at a time.', 'info');
      setIsCompareOpen(true);
      return;
    }
    if (compareList.some(p => p.id === product.id)) {
      showToast('This item is already in your comparison list.', 'info');
      setIsCompareOpen(true);
      return;
    }
    setCompareList(prev => [...prev, product]);
    showToast(`Added "${product.name}" to product comparison.`, 'success');
    setIsCompareOpen(true);
  };

  const removeFromCompare = (productId: string) => {
    setCompareList(prev => prev.filter(p => p.id !== productId));
  };

  const clearCompare = () => {
    setCompareList([]);
  };

  // 1. Email/Password Sign-In
  const login = async (email: string, pass: string) => {
    try {
      // First attempt Firebase Authentication
      const fbRes = await signInWithEmail(email, pass);
      if (fbRes.user) {
        setUser(fbRes.user);
        const fbToken = await auth.currentUser?.getIdToken();
        if (fbToken) {
          setToken(fbToken);
          localStorage.setItem('velmora_token', fbToken);
        }
        showToast(`Welcome back, ${fbRes.user.name}!`, 'success');
        return { success: true };
      }

      // If Firebase auth failed, attempt legacy server auth (e.g. for preloaded demo users)
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password: pass })
      });
      const data = await res.json();
      if (!res.ok) {
        return { success: false, error: fbRes.error || data.error || 'Invalid credentials provided. Kindly try again.' };
      }

      setToken(data.token);
      setUser(data.user);
      localStorage.setItem('velmora_token', data.token);

      if (data.user.favoriteCategories) {
        setFavoriteCategories(data.user.favoriteCategories);
      }

      showToast(`Welcome back, ${data.user.name}!`, 'success');
      return { success: true };
    } catch {
      return { success: false, error: 'Network communication error. Kindly check your internet connection.' };
    }
  };

  // 2. Email/Password Registration
  const register = async (name: string, email: string, pass: string, phone?: string) => {
    try {
      // Register patron via Firebase Auth and create Firestore profile document
      const fbRes = await signUpWithEmail(name, email, pass, phone);
      if (fbRes.user) {
        setUser(fbRes.user);
        const fbToken = await auth.currentUser?.getIdToken();
        if (fbToken) {
          setToken(fbToken);
          localStorage.setItem('velmora_token', fbToken);
        }
        showToast(`Welcome! 500 bonus loyalty points have been credited to your account, ${fbRes.user.name}.`, 'success');
        return { success: true };
      }

      // Fallback to server registration
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password: pass })
      });
      const data = await res.json();
      if (!res.ok) {
        return { success: false, error: fbRes.error || data.error || 'Registration failed. Kindly verify your inputs.' };
      }

      setToken(data.token);
      setUser(data.user);
      localStorage.setItem('velmora_token', data.token);
      showToast(`Welcome! 500 bonus reward points have been credited, ${data.user.name}.`, 'success');
      return { success: true };
    } catch {
      return { success: false, error: 'Network connection issue encountered. Kindly try again.' };
    }
  };

  // 3. Google Sign-In
  const loginWithGoogle = async () => {
    try {
      const fbRes = await signInWithGoogle();
      if (fbRes.user) {
        setUser(fbRes.user);
        const fbToken = await auth.currentUser?.getIdToken();
        if (fbToken) {
          setToken(fbToken);
          localStorage.setItem('velmora_token', fbToken);
        }
        showToast(`Welcome, ${fbRes.user.name}! Successfully signed in via Google.`, 'success');
        return { success: true };
      }
      return { success: false, error: fbRes.error || 'Google sign-in could not be completed.' };
    } catch (e: any) {
      return { success: false, error: e?.message || 'Google sign-in encountered an issue.' };
    }
  };

  // 4. Password Reset
  const resetPassword = async (email: string) => {
    return await sendPasswordReset(email);
  };

  // 5. Sign Out
  const logout = async () => {
    await signOutUser();
    setUser(null);
    setToken(null);
    localStorage.removeItem('velmora_token');
    localStorage.removeItem('elixir_token');
    showToast('You have successfully signed out of your account.', 'info');
    if (currentPage === 'account' || currentPage === 'admin') {
      setCurrentPage('home');
    }
  };

  // 6. Update Profile Details
  const updateProfileDetails = async (name: string, phone: string, address?: Address) => {
    if (!user) return { success: false, error: 'Kindly sign in to update your profile.' };
    try {
      const updates: any = { name, phone };
      if (address) {
        const currentAddrs = user.addresses || [];
        const filtered = currentAddrs.filter(a => a.id !== address.id);
        updates.addresses = [address, ...filtered];
      }

      await updateUserProfile(user.id, updates);
      setUser(prev => prev ? { ...prev, ...updates } : null);
      showToast('Your profile information has been successfully updated in Firestore.', 'success');
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err?.message || 'Unable to update profile.' };
    }
  };

  const addAddress = async (addr: Omit<Address, 'id'>) => {
    const newAddr: Address = {
      ...addr,
      id: `addr_${Date.now()}`
    };

    if (user) {
      const updatedAddrs = [newAddr, ...(user.addresses || [])];
      await updateUserProfile(user.id, { addresses: updatedAddrs });
      setUser({ ...user, addresses: updatedAddrs });
      showToast('Delivery address saved to your cloud profile.', 'success');
      return true;
    }

    if (token) {
      try {
        const res = await fetch('/api/auth/add-address', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify(addr)
        });
        if (res.ok) {
          showToast('Delivery address saved.', 'success');
          return true;
        }
      } catch (e) {
        console.error(e);
      }
    }
    return false;
  };

  const updatePreferences = async (favCats: string[], notifs: any) => {
    if (!user) return;
    try {
      await updateUserProfile(user.id, {
        favoriteCategories: favCats,
        notificationPreferences: notifs
      });
      setUser({ ...user, favoriteCategories: favCats, notificationPreferences: notifs });
      showToast('Account preferences updated successfully.', 'success');
    } catch (e) {
      console.error(e);
    }
  };

  const quickLoginDemo = async (role: 'CUSTOMER' | 'ADMIN') => {
    if (role === 'ADMIN') {
      await login('admin@velmora.com', 'NoirAtelier2026!');
    } else {
      await login('client@velmora.com', 'Customer2026!');
    }
  };

  const addToCart = (product: Product, quantity = 1, variant?: string) => {
    setCartItems(prev => {
      const existingIdx = prev.findIndex(
        i => i.productId === product.id && i.selectedVariant === variant
      );
      if (existingIdx > -1) {
        const next = [...prev];
        next[existingIdx].quantity += quantity;
        return next;
      } else {
        return [...prev, { productId: product.id, product, quantity, selectedVariant: variant }];
      }
    });
    showToast(`Added "${product.name}" to your shopping cart.`, 'success');
    setIsCartDrawerOpen(true);
  };

  const updateCartQuantity = (productId: string, quantity: number, variant?: string) => {
    if (quantity <= 0) {
      removeFromCart(productId, variant);
      return;
    }
    setCartItems(prev =>
      prev.map(item => {
        if (item.productId === productId && item.selectedVariant === variant) {
          return { ...item, quantity: Math.min(item.product.stock || 10, quantity) };
        }
        return item;
      })
    );
  };

  const removeFromCart = (productId: string, variant?: string) => {
    setCartItems(prev =>
      prev.filter(i => !(i.productId === productId && i.selectedVariant === variant))
    );
    showToast('Item removed from your cart.', 'info');
  };

  const clearCart = () => {
    setCartItems([]);
    setAppliedCoupon(null);
    setPointsToRedeem(0);
  };

  const applyCoupon = async (code: string) => {
    try {
      const res = await fetch('/api/coupons/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, subtotal: cartSubtotal })
      });
      const data = await res.json();
      if (!res.ok) {
        return { success: false, error: data.error || 'Invalid promo code' };
      }
      setAppliedCoupon(data.coupon);
      showToast(`Promo code "${data.coupon.code}" applied.`, 'success');
      return { success: true };
    } catch {
      return { success: false, error: 'Failed to validate promo code' };
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    showToast('Promo code removed.', 'info');
  };

  const toggleWishlist = (productId: string) => {
    setWishlistIds(prev => {
      const exists = prev.includes(productId);
      const next = exists ? prev.filter(id => id !== productId) : [...prev, productId];
      showToast(
        exists ? 'Removed from your wishlist.' : 'Saved to your wishlist.',
        'info'
      );
      return next;
    });
  };

  const isInWishlist = (productId: string) => wishlistIds.includes(productId);

  const subscribeAlert = async (
    productId: string,
    productName: string,
    email: string,
    type: 'PRICE_DROP' | 'BACK_IN_STOCK',
    targetPrice?: number
  ) => {
    try {
      const res = await fetch('/api/alerts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId,
          productName,
          userEmail: email,
          type,
          targetPrice
        })
      });
      if (res.ok) {
        showToast(
          type === 'PRICE_DROP'
            ? `Price drop alert registered for ${productName}.`
            : `Back in stock notification registered for ${productName}.`,
          'success'
        );
        return true;
      }
    } catch {
      showToast('Failed to register notification.', 'error');
    }
    return false;
  };

  // Totals calculations
  const cartSubtotal = cartItems.reduce((acc, item) => {
    let price = item.product.price;
    if (item.selectedVariant && item.product.variants) {
      const v = item.product.variants.find(va => va.name === item.selectedVariant);
      if (v) price += v.priceDiff;
    }
    return acc + price * item.quantity;
  }, 0);

  let cartDiscount = 0;
  if (appliedCoupon && cartSubtotal >= appliedCoupon.minOrder) {
    if (appliedCoupon.discountType === 'PERCENT') {
      cartDiscount = Math.round((cartSubtotal * appliedCoupon.discountValue) / 100);
      if (appliedCoupon.maxDiscount && cartDiscount > appliedCoupon.maxDiscount) {
        cartDiscount = appliedCoupon.maxDiscount;
      }
    } else {
      cartDiscount = appliedCoupon.discountValue;
    }
  }

  // Loyalty Points discount: ₹1 per point up to 30% of subtotal
  const maxPossiblePoints = user ? Math.min(user.loyaltyPoints || 0, Math.floor(cartSubtotal * 0.3)) : 0;
  const pointsDiscount = Math.min(pointsToRedeem, maxPossiblePoints);

  const giftWrapFee = giftOptions.giftWrap ? 350 : 0;
  const discountedSubtotal = Math.max(0, cartSubtotal - cartDiscount - pointsDiscount);
  const cartShippingFee = cartItems.length === 0 ? 0 : discountedSubtotal >= 5000 ? 0 : 500;
  const taxableAmount = discountedSubtotal + giftWrapFee;
  const cartTax = cartItems.length === 0 ? 0 : Math.round(taxableAmount * 0.03);
  const cartTotal = taxableAmount + cartShippingFee + cartTax;

  return (
    <StoreContext.Provider
      value={{
        currentPage,
        setCurrentPage,
        selectedProduct,
        setSelectedProduct,
        activeOrder,
        setActiveOrder,
        selectedCategorySlug,
        setSelectedCategorySlug,
        policyTab,
        setPolicyTab,
        isSearchOpen,
        setIsSearchOpen,
        isCartDrawerOpen,
        setIsCartDrawerOpen,
        searchQuery,
        setSearchQuery,
        quickViewProduct,
        setQuickViewProduct,
        compareList,
        addToCompare,
        removeFromCompare,
        clearCompare,
        isCompareOpen,
        setIsCompareOpen,
        isMotionStudioOpen,
        setIsMotionStudioOpen,
        recentlyViewedIds,
        addRecentlyViewed,
        favoriteCategories,
        toggleFavoriteCategory,
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
        isFirebaseConnected,
        products,
        isLoadingProducts,
        refreshProducts,
        cartItems,
        addToCart,
        updateCartQuantity,
        removeFromCart,
        clearCart,
        appliedCoupon,
        applyCoupon,
        removeCoupon,
        giftOptions,
        setGiftOptions,
        giftWrapFee,
        pointsToRedeem,
        setPointsToRedeem,
        pointsDiscount,
        cartSubtotal,
        cartDiscount,
        cartShippingFee,
        cartTax,
        cartTotal,
        wishlistIds,
        toggleWishlist,
        isInWishlist,
        subscribeAlert,
        toasts,
        showToast
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
