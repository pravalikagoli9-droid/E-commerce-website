import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import type { User, Product, CartItem, Order, Coupon, Address } from '../types';

export type ActivePage =
  | 'home'
  | 'shop'
  | 'product-detail'
  | 'cart'
  | 'checkout'
  | 'order-confirmation'
  | 'order-tracking'
  | 'account'
  | 'admin'
  | 'about'
  | 'faq'
  | 'blog'
  | 'contact'
  | 'policies';

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

  // Auth
  user: User | null;
  token: string | null;
  login: (email: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  register: (name: string, email: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  addAddress: (addr: Omit<Address, 'id'>) => Promise<boolean>;
  quickLoginDemo: (role: 'CUSTOMER' | 'ADMIN') => Promise<void>;

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
  cartSubtotal: number;
  cartDiscount: number;
  cartShippingFee: number;
  cartTax: number;
  cartTotal: number;

  // Wishlist
  wishlistIds: string[];
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;

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

  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('elixir_token'));
  const [guestId] = useState<string>(() => {
    let id = localStorage.getItem('elixir_guest_id');
    if (!id) {
      id = `gst_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
      localStorage.setItem('elixir_guest_id', id);
    }
    return id;
  });

  const [products, setProducts] = useState<Product[]>([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('elixir_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [wishlistIds, setWishlistIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('elixir_wishlist');
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

  // Sync products from server
  const refreshProducts = async () => {
    setIsLoadingProducts(true);
    try {
      const res = await fetch('/api/products');
      if (res.ok) {
        const data = await res.json();
        setProducts(data.products || []);
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

  // Sync auth state
  useEffect(() => {
    if (token) {
      fetch('/api/auth/me', {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(res => (res.ok ? res.json() : null))
        .then(data => {
          if (data?.user) {
            setUser(data.user);
          } else {
            setUser(null);
            setToken(null);
            localStorage.removeItem('elixir_token');
          }
        })
        .catch(() => {
          setUser(null);
          setToken(null);
          localStorage.removeItem('elixir_token');
        });
    }
  }, [token]);

  // Persist cart to localStorage & server
  useEffect(() => {
    localStorage.setItem('elixir_cart', JSON.stringify(cartItems));
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
  }, [cartItems, token, guestId]);

  // Persist wishlist
  useEffect(() => {
    localStorage.setItem('elixir_wishlist', JSON.stringify(wishlistIds));
  }, [wishlistIds]);

  const login = async (email: string, pass: string) => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password: pass })
      });
      const data = await res.json();
      if (!res.ok) {
        return { success: false, error: data.error || 'Login failed' };
      }

      setToken(data.token);
      setUser(data.user);
      localStorage.setItem('elixir_token', data.token);

      // Merge guest cart with user cart
      if (cartItems.length > 0) {
        try {
          const syncRes = await fetch('/api/cart/sync', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${data.token}`
            },
            body: JSON.stringify({ guestItems: cartItems })
          });
          if (syncRes.ok) {
            const syncData = await syncRes.json();
            if (syncData.items) setCartItems(syncData.items);
          }
        } catch (e) {
          console.warn('Cart sync warning:', e);
        }
      }

      showToast(`Welcome back, ${data.user.name}`, 'success');
      return { success: true };
    } catch {
      return { success: false, error: 'Connection error' };
    }
  };

  const register = async (name: string, email: string, pass: string) => {
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password: pass })
      });
      const data = await res.json();
      if (!res.ok) {
        return { success: false, error: data.error || 'Registration failed' };
      }

      setToken(data.token);
      setUser(data.user);
      localStorage.setItem('elixir_token', data.token);
      showToast(`Account created. Welcome to ÉLIXIR & NOIR, ${data.user.name}.`, 'success');
      return { success: true };
    } catch {
      return { success: false, error: 'Connection error' };
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('elixir_token');
    showToast('You have been signed out from the atelier session.', 'info');
    if (currentPage === 'account' || currentPage === 'admin') {
      setCurrentPage('home');
    }
  };

  const addAddress = async (addr: Omit<Address, 'id'>) => {
    if (!token) return false;
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
        const data = await res.json();
        if (user) {
          setUser({ ...user, addresses: data.addresses });
        }
        showToast('Atelier delivery address saved.', 'success');
        return true;
      }
    } catch (e) {
      console.error(e);
    }
    return false;
  };

  const quickLoginDemo = async (role: 'CUSTOMER' | 'ADMIN') => {
    if (role === 'ADMIN') {
      await login('admin@elixirnoir.com', 'NoirAtelier2026!');
    } else {
      await login('client@elixirnoir.com', 'Customer2026!');
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
    showToast(`Added "${product.name}" to your shopping bag.`, 'success');
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
    showToast('Item removed from shopping bag.', 'info');
  };

  const clearCart = () => {
    setCartItems([]);
    setAppliedCoupon(null);
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
        return { success: false, error: data.error || 'Invalid coupon' };
      }
      setAppliedCoupon(data.coupon);
      showToast(`Privilege code "${data.coupon.code}" applied.`, 'success');
      return { success: true };
    } catch {
      return { success: false, error: 'Failed to validate coupon' };
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    showToast('Privilege code removed.', 'info');
  };

  const toggleWishlist = (productId: string) => {
    setWishlistIds(prev => {
      const exists = prev.includes(productId);
      const next = exists ? prev.filter(id => id !== productId) : [...prev, productId];
      showToast(
        exists ? 'Removed from your curated wishlist.' : 'Saved to your curated wishlist.',
        'info'
      );
      return next;
    });

    if (token) {
      fetch('/api/wishlist/toggle', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ productId })
      }).catch(console.error);
    }
  };

  const isInWishlist = (productId: string) => wishlistIds.includes(productId);

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

  const taxableAmount = Math.max(0, cartSubtotal - cartDiscount);
  const cartShippingFee = cartItems.length === 0 ? 0 : taxableAmount >= 5000 ? 0 : 500;
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
        user,
        token,
        login,
        register,
        logout,
        addAddress,
        quickLoginDemo,
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
        cartSubtotal,
        cartDiscount,
        cartShippingFee,
        cartTax,
        cartTotal,
        wishlistIds,
        toggleWishlist,
        isInWishlist,
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
