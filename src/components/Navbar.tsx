import React, { useState, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { Search, ShoppingBag, Heart, User as UserIcon, Shield, Menu, X, Scale, Gift, Tag, Sparkles, Truck, Film } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const Navbar: React.FC = () => {
  const {
    currentPage,
    setCurrentPage,
    selectedCategorySlug,
    setSelectedCategorySlug,
    cartItems,
    wishlistIds,
    compareList,
    setIsCompareOpen,
    setIsSearchOpen,
    setIsCartDrawerOpen,
    setIsMotionStudioOpen,
    user,
    logout,
    quickLoginDemo
  } = useStore();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);
  const [announcementIdx, setAnnouncementIdx] = useState(0);

  const announcements = [
    'Complimentary express shipping on orders over ₹5,000 across India',
    'Member Rewards: 500 bonus points credited on new account registration',
    'Signature Gift Packaging: Handcrafted boxes with personalized gift messages'
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setAnnouncementIdx(prev => (prev + 1) % announcements.length);
    }, 5500);
    return () => clearInterval(timer);
  }, [announcements.length]);

  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const wishlistCount = wishlistIds.length;
  const compareCount = compareList.length;

  const navigateTo = (page: any, categorySlug?: string | null) => {
    if (categorySlug !== undefined) {
      setSelectedCategorySlug(categorySlug);
    }
    setCurrentPage(page);
    setIsMobileMenuOpen(false);
    setIsAccountMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-[#F8F4ED]/95 backdrop-blur-md border-b border-[#B7A397]/30 transition-all">
      {/* Editorial Announcement Bar (Rotating) */}
      <div className="bg-[#5A3E36] text-[11px] tracking-[0.2em] uppercase text-[#F8F4ED] py-2 px-4 text-center overflow-hidden">
        <div className="max-w-7xl mx-auto flex items-center justify-center gap-2">
          <Sparkles className="w-3.5 h-3.5 text-[#D6B77A] shrink-0" />
          <AnimatePresence mode="wait">
            <motion.span
              key={announcementIdx}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.35 }}
              className="font-light text-[#F8F4ED]/90"
            >
              {announcements[announcementIdx]}
            </motion.span>
          </AnimatePresence>
        </div>
      </div>

      {/* Primary Top Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-8">
        {/* Zone 1: VELMORA Wordmark Logo with Tagline */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigateTo('home')}
            className="flex flex-col text-left group cursor-pointer focus:outline-none"
            aria-label="VELMORA Home"
          >
            <span className="text-2xl sm:text-3xl font-serif tracking-[0.24em] text-[#5A3E36] group-hover:text-[#30231F] transition-colors font-medium flex items-center">
              VELMORA
              <span className="w-1.5 h-1.5 rounded-full bg-[#D6B77A] inline-block ml-1.5 mb-1" />
            </span>
            <span className="text-[9px] sm:text-[10px] tracking-[0.28em] uppercase text-[#B7A397] group-hover:text-[#5A3E36] transition-colors font-sans -mt-0.5 font-medium">
              BEAUTY IN EVERY DETAIL
            </span>
          </button>
        </div>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden lg:flex items-center gap-7 text-[12px] tracking-[0.16em] uppercase text-[#30231F]/80">
          <button
            onClick={() => navigateTo('home')}
            className={`hover:text-[#5A3E36] transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              currentPage === 'home' ? 'text-[#5A3E36] border-b-2 border-[#5A3E36] pb-0.5 font-semibold' : ''
            }`}
          >
            Home
          </button>
          <button
            onClick={() => navigateTo('shop', null)}
            className={`hover:text-[#5A3E36] transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              currentPage === 'shop' && !selectedCategorySlug
                ? 'text-[#5A3E36] border-b-2 border-[#5A3E36] pb-0.5 font-semibold'
                : ''
            }`}
          >
            Shop All
          </button>
          <button
            onClick={() => navigateTo('shop', 'fragrances')}
            className={`hover:text-[#5A3E36] transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              currentPage === 'shop' && selectedCategorySlug === 'fragrances'
                ? 'text-[#5A3E36] border-b-2 border-[#5A3E36] pb-0.5 font-semibold'
                : ''
            }`}
          >
            Fragrances
          </button>
          <button
            onClick={() => navigateTo('shop', 'skincare')}
            className={`hover:text-[#78866B] text-[#78866B] font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer flex items-center gap-1 ${
              currentPage === 'shop' && selectedCategorySlug === 'skincare'
                ? 'border-b-2 border-[#78866B] pb-0.5 font-semibold'
                : ''
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#78866B]" />
            Skincare
          </button>
          <button
            onClick={() => navigateTo('shop', 'apparel')}
            className={`hover:text-[#5A3E36] transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              currentPage === 'shop' && selectedCategorySlug === 'apparel'
                ? 'text-[#5A3E36] border-b-2 border-[#5A3E36] pb-0.5 font-semibold'
                : ''
            }`}
          >
            Lifestyle & Apparel
          </button>
          <button
            onClick={() => navigateTo('gifting')}
            className={`hover:text-[#5A3E36] transition-colors whitespace-nowrap shrink-0 cursor-pointer flex items-center gap-1 ${
              currentPage === 'gifting' ? 'text-[#5A3E36] border-b-2 border-[#5A3E36] pb-0.5 font-semibold' : ''
            }`}
          >
            <Gift className="w-3.5 h-3.5 text-[#D6B77A]" />
            <span>Gifts</span>
          </button>
          <button
            onClick={() => navigateTo('offers')}
            className={`hover:text-[#5A3E36] transition-colors whitespace-nowrap shrink-0 cursor-pointer flex items-center gap-1 ${
              currentPage === 'offers' ? 'text-[#5A3E36] border-b-2 border-[#5A3E36] pb-0.5 font-semibold' : ''
            }`}
          >
            <Tag className="w-3.5 h-3.5 text-[#D6B77A]" />
            <span>Special Offers</span>
          </button>
          <button
            onClick={() => navigateTo('tracking')}
            className={`hover:text-[#5A3E36] transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              currentPage === 'tracking' ? 'text-[#5A3E36] border-b-2 border-[#5A3E36] pb-0.5 font-semibold' : ''
            }`}
          >
            Track Order
          </button>
          <button
            onClick={() => setIsMotionStudioOpen(true)}
            className="hover:text-[#5A3E36] transition-colors whitespace-nowrap shrink-0 cursor-pointer flex items-center gap-1.5 px-2.5 py-1 rounded-sm bg-[#D6B77A]/15 border border-[#D6B77A]/50 text-[#5A3E36] text-[11px] font-medium shadow-xs"
          >
            <Film className="w-3 h-3 text-[#D6B77A]" />
            <span>Motion Studio</span>
          </button>
        </nav>

        {/* Zone 3: Interactive Affordances & Action Cluster */}
        <div className="flex items-center gap-4 sm:gap-5 shrink-0">
          {/* Search Trigger */}
          <button
            onClick={() => setIsSearchOpen(true)}
            aria-label="Search products"
            title="Search products"
            className="p-2 text-[#30231F]/80 hover:text-[#5A3E36] transition-colors cursor-pointer"
          >
            <Search className="w-5 h-5" strokeWidth={1.5} />
          </button>

          {/* Comparison Trigger */}
          <button
            onClick={() => setIsCompareOpen(true)}
            aria-label="Product Comparison"
            className="relative p-2 text-[#30231F]/80 hover:text-[#5A3E36] transition-colors cursor-pointer hidden sm:block"
            title="Product Comparison"
          >
            <Scale className="w-5 h-5" strokeWidth={1.5} />
            {compareCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-[#D6B77A] text-[#30231F] text-[10px] font-semibold rounded-full flex items-center justify-center font-mono">
                {compareCount}
              </span>
            )}
          </button>

          {/* Wishlist Trigger */}
          <button
            onClick={() => navigateTo('account')}
            aria-label="Wishlist"
            title="Wishlist"
            className="relative p-2 text-[#30231F]/80 hover:text-[#5A3E36] transition-colors cursor-pointer"
          >
            <Heart className="w-5 h-5" strokeWidth={1.5} />
            {wishlistCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-[#5A3E36] text-white text-[10px] font-semibold rounded-full flex items-center justify-center font-mono">
                {wishlistCount}
              </span>
            )}
          </button>

          {/* Shopping Cart Trigger */}
          <button
            onClick={() => setIsCartDrawerOpen(true)}
            aria-label="Shopping Cart"
            title="Shopping Cart"
            className="relative p-2 text-[#30231F]/80 hover:text-[#5A3E36] transition-colors cursor-pointer"
          >
            <ShoppingBag className="w-5 h-5" strokeWidth={1.5} />
            {cartCount > 0 && (
              <motion.span
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                className="absolute top-1 right-1 w-4 h-4 bg-[#5A3E36] text-white text-[10px] font-semibold rounded-full flex items-center justify-center font-mono shadow-sm"
              >
                {cartCount}
              </motion.span>
            )}
          </button>

          {/* Account Menu Popover */}
          <div className="relative">
            <button
              onClick={() => setIsAccountMenuOpen(!isAccountMenuOpen)}
              aria-label="Your Account"
              title="Your Account"
              className="p-2 text-[#30231F]/80 hover:text-[#5A3E36] transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <UserIcon className="w-5 h-5" strokeWidth={1.5} />
              {user && (
                <span className="hidden xl:inline text-xs text-[#30231F] font-medium max-w-[90px] truncate">
                  {user.name.split(' ')[0]}
                </span>
              )}
            </button>

            <AnimatePresence>
              {isAccountMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 6, scale: 0.98 }}
                  transition={{ duration: 0.18 }}
                  className="absolute right-0 mt-3 w-72 bg-[#FFFDF8] border border-[#B7A397]/40 shadow-2xl p-4 text-sm z-50 rounded-sm"
                >
                  {user ? (
                    <div className="space-y-3">
                      <div className="pb-3 border-b border-[#B7A397]/30">
                        <p className="font-serif text-base text-[#30231F] truncate font-medium">{user.name}</p>
                        <p className="text-xs text-[#B7A397] truncate font-mono">{user.email}</p>

                        {/* Loyalty Badge in Menu */}
                        <div className="mt-2 p-2 bg-[#F8F4ED] border border-[#B7A397]/30 flex items-center justify-between text-[11px]">
                          <span className="text-[#30231F]/70 uppercase tracking-wider">Rewards Tier</span>
                          <span className="font-mono text-[#5A3E36] font-semibold">
                            {user.loyaltyPoints || 0} Pts · {user.loyaltyTier || 'GOLD'}
                          </span>
                        </div>

                        {user.role === 'ADMIN' && (
                          <div className="mt-2 inline-flex items-center gap-1 text-[10px] tracking-wider uppercase text-[#5A3E36] font-semibold">
                            <Shield className="w-3 h-3 text-[#D6B77A]" /> Store Administrator
                          </div>
                        )}
                      </div>

                      <div className="space-y-1">
                        <button
                          onClick={() => navigateTo('account')}
                          className="w-full text-left py-1.5 px-2 text-xs tracking-wider uppercase text-[#30231F] hover:bg-[#F8F4ED] transition-colors rounded"
                        >
                          My Account & Orders
                        </button>
                        <button
                          onClick={() => navigateTo('tracking')}
                          className="w-full text-left py-1.5 px-2 text-xs tracking-wider uppercase text-[#30231F] hover:bg-[#F8F4ED] transition-colors rounded"
                        >
                          Track an Order
                        </button>
                        <button
                          onClick={() => navigateTo('gifting')}
                          className="w-full text-left py-1.5 px-2 text-xs tracking-wider uppercase text-[#30231F] hover:bg-[#F8F4ED] transition-colors rounded"
                        >
                          Gift Sets & Services
                        </button>
                        {user.role === 'ADMIN' && (
                          <button
                            onClick={() => navigateTo('admin')}
                            className="w-full text-left py-1.5 px-2 text-xs tracking-wider uppercase text-[#5A3E36] hover:bg-[#F8F4ED] transition-colors flex items-center gap-2 font-medium rounded"
                          >
                            <Shield className="w-3.5 h-3.5 text-[#D6B77A]" /> Admin Dashboard
                          </button>
                        )}
                      </div>

                      <div className="pt-2 border-t border-[#B7A397]/30">
                        <button
                          onClick={() => {
                            logout();
                            setIsAccountMenuOpen(false);
                          }}
                          className="w-full text-left py-1.5 px-2 text-xs tracking-wider uppercase text-[#5A3E36] hover:bg-[#F8F4ED] transition-colors rounded font-medium"
                        >
                          Sign Out
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <p className="text-xs text-[#30231F]/80 leading-relaxed">
                        Sign in to view your order history, reward points balance, and saved favorites.
                      </p>
                      <div className="space-y-2 pt-1">
                        <button
                          onClick={() => navigateTo('account')}
                          className="w-full py-2.5 bg-[#5A3E36] text-white text-xs font-semibold tracking-[0.15em] uppercase hover:bg-[#48322B] transition-colors shadow-sm cursor-pointer"
                        >
                          Sign In / Register
                        </button>
                        <div className="pt-2 border-t border-[#B7A397]/30 text-[11px] text-[#30231F]/70 space-y-1">
                          <span className="block text-[#30231F] font-medium">Quick Demo Sign-In:</span>
                          <div className="grid grid-cols-2 gap-2 pt-1">
                            <button
                              onClick={() => {
                                quickLoginDemo('CUSTOMER');
                                setIsAccountMenuOpen(false);
                              }}
                              className="py-1 px-2 border border-[#B7A397]/50 hover:border-[#5A3E36] text-[#30231F] text-[10px] tracking-wider uppercase cursor-pointer"
                            >
                              Demo Customer
                            </button>
                            <button
                              onClick={() => {
                                quickLoginDemo('ADMIN');
                                setIsAccountMenuOpen(false);
                              }}
                              className="py-1 px-2 border border-[#D6B77A] hover:bg-[#F8F4ED] text-[#5A3E36] text-[10px] tracking-wider uppercase font-semibold cursor-pointer"
                            >
                              Demo Admin
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Mobile menu hamburger */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 text-[#30231F]/80 hover:text-[#5A3E36]"
            aria-label="Toggle Navigation"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="lg:hidden bg-[#F8F4ED] border-b border-[#B7A397]/30 px-6 py-6 space-y-5 overflow-hidden"
          >
            <nav className="flex flex-col space-y-4 text-xs tracking-[0.2em] uppercase text-[#30231F]/80">
              <button onClick={() => navigateTo('home')} className="text-left hover:text-[#5A3E36] py-1 cursor-pointer">
                Home
              </button>
              <button onClick={() => navigateTo('shop', null)} className="text-left hover:text-[#5A3E36] py-1 cursor-pointer">
                Shop All
              </button>
              <button onClick={() => navigateTo('shop', 'fragrances')} className="text-left hover:text-[#5A3E36] py-1 cursor-pointer">
                Fragrances
              </button>
              <button onClick={() => navigateTo('shop', 'skincare')} className="text-left hover:text-[#78866B] py-1 flex items-center gap-1.5 cursor-pointer text-[#78866B] font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-[#78866B]" />
                <span>Botanical Skincare</span>
              </button>
              <button onClick={() => navigateTo('shop', 'apparel')} className="text-left hover:text-[#5A3E36] py-1 cursor-pointer">
                Lifestyle & Apparel
              </button>
              <button onClick={() => navigateTo('gifting')} className="text-left hover:text-[#5A3E36] py-1 flex items-center gap-2 cursor-pointer">
                <Gift className="w-3.5 h-3.5 text-[#D6B77A]" />
                <span>Gift Sets & Services</span>
              </button>
              <button onClick={() => navigateTo('offers')} className="text-left hover:text-[#5A3E36] py-1 flex items-center gap-2 cursor-pointer">
                <Tag className="w-3.5 h-3.5 text-[#D6B77A]" />
                <span>Special Offers</span>
              </button>
              <button onClick={() => navigateTo('tracking')} className="text-left hover:text-[#5A3E36] py-1 flex items-center gap-2 cursor-pointer">
                <Truck className="w-3.5 h-3.5" />
                <span>Track Order</span>
              </button>
              <button 
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  setIsMotionStudioOpen(true);
                }} 
                className="text-left hover:text-[#5A3E36] py-1 flex items-center gap-2 cursor-pointer text-[#5A3E36] font-medium"
              >
                <Film className="w-3.5 h-3.5 text-[#D6B77A]" />
                <span>AI Motion Studio (Veo)</span>
              </button>
              <button onClick={() => navigateTo('about')} className="text-left hover:text-[#5A3E36] py-1 cursor-pointer">
                About VELMORA
              </button>
              <button onClick={() => navigateTo('faq')} className="text-left hover:text-[#5A3E36] py-1 cursor-pointer">
                Customer Care & FAQ
              </button>
              <button onClick={() => navigateTo('contact')} className="text-left hover:text-[#5A3E36] py-1 cursor-pointer">
                Contact & Concierge
              </button>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
