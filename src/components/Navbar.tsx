import React, { useState, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { Search, ShoppingBag, Heart, User as UserIcon, Shield, Menu, X, Scale, Gift, Tag, Sparkles, Truck } from 'lucide-react';

export const Navbar: React.FC = () => {
  const {
    currentPage,
    setCurrentPage,
    setSelectedCategorySlug,
    cartItems,
    wishlistIds,
    compareList,
    setIsCompareOpen,
    setIsSearchOpen,
    setIsCartDrawerOpen,
    user,
    logout,
    quickLoginDemo
  } = useStore();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);
  const [announcementIdx, setAnnouncementIdx] = useState(0);

  const announcements = [
    'Complimentary White Glove Courier on acquisitions above ₹5,000 across India',
    'Privilege Inscription: 500 Welcome Points awarded on maiden account creation',
    'Bespoke Gifting Service: Hand-waxed seals & personalized calligraphy cards available'
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
    <header className="sticky top-0 z-40 w-full bg-[#FAF8F5]/95 backdrop-blur-md border-b border-[#E7E0D6] transition-all">
      {/* Editorial Announcement Bar (Rotating) */}
      <div className="bg-[#1E1714] text-[11px] tracking-[0.18em] uppercase text-[#FAF8F5] py-2 px-4 text-center overflow-hidden">
        <div className="max-w-7xl mx-auto flex items-center justify-center gap-2 transition-all duration-500">
          <Sparkles className="w-3 h-3 text-[#BFA175] shrink-0" />
          <span className="font-light text-[#E5DDD3]">{announcements[announcementIdx]}</span>
        </div>
      </div>

      {/* Primary Top Bar: 3 Zones Contract */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-8">
        {/* Zone 1: Brand Wordmark (Single text element in deep espresso) */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigateTo('home')}
            className="text-2xl sm:text-3xl font-serif tracking-[0.18em] text-[#1E1714] hover:text-[#5C4F44] transition-colors whitespace-nowrap shrink-0 text-left cursor-pointer"
          >
            ÉLIXIR & NOIR
          </button>
        </div>

        {/* Zone 2: Single-Line Nav Links */}
        <nav className="hidden lg:flex items-center gap-7 text-[12px] tracking-[0.16em] uppercase text-[#6B5C50]">
          <button
            onClick={() => navigateTo('home')}
            className={`hover:text-[#1E1714] transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              currentPage === 'home' ? 'text-[#1E1714] border-b-2 border-[#1E1714] pb-0.5 font-medium' : ''
            }`}
          >
            Home
          </button>
          <button
            onClick={() => navigateTo('shop', null)}
            className={`hover:text-[#1E1714] transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              currentPage === 'shop' && !['fragrances', 'apparel', 'skincare'].includes('')
                ? 'text-[#1E1714] border-b-2 border-[#1E1714] pb-0.5 font-medium'
                : ''
            }`}
          >
            Catalog
          </button>
          <button
            onClick={() => navigateTo('shop', 'fragrances')}
            className="hover:text-[#1E1714] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            Parfumerie
          </button>
          <button
            onClick={() => navigateTo('shop', 'apparel')}
            className="hover:text-[#1E1714] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            Sartorial
          </button>
          <button
            onClick={() => navigateTo('shop', 'skincare')}
            className="hover:text-[#1E1714] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            Skincare
          </button>
          <button
            onClick={() => navigateTo('gifting')}
            className={`hover:text-[#1E1714] transition-colors whitespace-nowrap shrink-0 cursor-pointer flex items-center gap-1 ${
              currentPage === 'gifting' ? 'text-[#1E1714] border-b-2 border-[#1E1714] pb-0.5 font-medium' : ''
            }`}
          >
            <Gift className="w-3.5 h-3.5 text-[#BFA175]" />
            <span>Gifting</span>
          </button>
          <button
            onClick={() => navigateTo('offers')}
            className={`hover:text-[#1E1714] transition-colors whitespace-nowrap shrink-0 cursor-pointer flex items-center gap-1 ${
              currentPage === 'offers' ? 'text-[#1E1714] border-b-2 border-[#1E1714] pb-0.5 font-medium' : ''
            }`}
          >
            <Tag className="w-3.5 h-3.5 text-[#BFA175]" />
            <span>Privileges</span>
          </button>
          <button
            onClick={() => navigateTo('tracking')}
            className={`hover:text-[#1E1714] transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              currentPage === 'tracking' ? 'text-[#1E1714] border-b-2 border-[#1E1714] pb-0.5 font-medium' : ''
            }`}
          >
            Track Order
          </button>
        </nav>

        {/* Zone 3: Interactive Affordances & Action Cluster */}
        <div className="flex items-center gap-4 sm:gap-5 shrink-0">
          {/* Search Trigger */}
          <button
            onClick={() => setIsSearchOpen(true)}
            aria-label="Search creations"
            className="p-2 text-[#6B5C50] hover:text-[#1E1714] transition-colors cursor-pointer"
          >
            <Search className="w-5 h-5" strokeWidth={1.5} />
          </button>

          {/* Comparison Salon Trigger */}
          <button
            onClick={() => setIsCompareOpen(true)}
            aria-label="Comparison Salon"
            className="relative p-2 text-[#6B5C50] hover:text-[#1E1714] transition-colors cursor-pointer hidden sm:block"
            title="Comparison Salon"
          >
            <Scale className="w-5 h-5" strokeWidth={1.5} />
            {compareCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-[#8C7A6B] text-white text-[10px] font-medium rounded-full flex items-center justify-center font-mono">
                {compareCount}
              </span>
            )}
          </button>

          {/* Wishlist Trigger */}
          <button
            onClick={() => navigateTo('account')}
            aria-label="Wishlist"
            className="relative p-2 text-[#6B5C50] hover:text-[#1E1714] transition-colors cursor-pointer"
          >
            <Heart className="w-5 h-5" strokeWidth={1.5} />
            {wishlistCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-[#C8A29A] text-white text-[10px] font-medium rounded-full flex items-center justify-center font-mono">
                {wishlistCount}
              </span>
            )}
          </button>

          {/* Shopping Bag Trigger */}
          <button
            onClick={() => setIsCartDrawerOpen(true)}
            aria-label="Shopping Bag"
            className="relative p-2 text-[#6B5C50] hover:text-[#1E1714] transition-colors cursor-pointer"
          >
            <ShoppingBag className="w-5 h-5" strokeWidth={1.5} />
            {cartCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-[#1E1714] text-[#FAF8F5] text-[10px] font-semibold rounded-full flex items-center justify-center font-mono">
                {cartCount}
              </span>
            )}
          </button>

          {/* Account Menu Popover */}
          <div className="relative">
            <button
              onClick={() => setIsAccountMenuOpen(!isAccountMenuOpen)}
              aria-label="Customer Account"
              className="p-2 text-[#6B5C50] hover:text-[#1E1714] transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <UserIcon className="w-5 h-5" strokeWidth={1.5} />
              {user && (
                <span className="hidden xl:inline text-xs text-[#1E1714] font-medium max-w-[90px] truncate">
                  {user.name.split(' ')[0]}
                </span>
              )}
            </button>

            {isAccountMenuOpen && (
              <div className="absolute right-0 mt-3 w-72 bg-white border border-[#E7E0D6] shadow-2xl p-4 text-sm z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                {user ? (
                  <div className="space-y-3">
                    <div className="pb-3 border-b border-[#F3EFEA]">
                      <p className="font-serif text-base text-[#1E1714] truncate font-medium">{user.name}</p>
                      <p className="text-xs text-[#8C7A6B] truncate font-mono">{user.email}</p>

                      {/* Loyalty Badge in Menu */}
                      <div className="mt-2 p-2 bg-[#F4EFEA] border border-[#E7E0D6] flex items-center justify-between text-[11px]">
                        <span className="text-[#8C7A6B] uppercase tracking-wider">Nocturne Privilège</span>
                        <span className="font-mono text-[#1E1714] font-semibold">
                          {user.loyaltyPoints || 0} Pts · {user.loyaltyTier || 'NOIR'}
                        </span>
                      </div>

                      {user.role === 'ADMIN' && (
                        <div className="mt-2 inline-flex items-center gap-1 text-[10px] tracking-wider uppercase text-[#BFA175] font-semibold">
                          <Shield className="w-3 h-3" /> Atelier Director (Admin)
                        </div>
                      )}
                    </div>

                    <div className="space-y-1">
                      <button
                        onClick={() => navigateTo('account')}
                        className="w-full text-left py-1.5 px-2 text-xs tracking-wider uppercase text-[#1E1714] hover:bg-[#F4EFEA] transition-colors"
                      >
                        Client Sanctuary
                      </button>
                      <button
                        onClick={() => navigateTo('tracking')}
                        className="w-full text-left py-1.5 px-2 text-xs tracking-wider uppercase text-[#1E1714] hover:bg-[#F4EFEA] transition-colors"
                      >
                        Order Waybill Tracking
                      </button>
                      <button
                        onClick={() => navigateTo('gifting')}
                        className="w-full text-left py-1.5 px-2 text-xs tracking-wider uppercase text-[#1E1714] hover:bg-[#F4EFEA] transition-colors"
                      >
                        Gifting Collections
                      </button>
                      {user.role === 'ADMIN' && (
                        <button
                          onClick={() => navigateTo('admin')}
                          className="w-full text-left py-1.5 px-2 text-xs tracking-wider uppercase text-[#BFA175] hover:bg-[#F4EFEA] transition-colors flex items-center gap-2 font-medium"
                        >
                          <Shield className="w-3.5 h-3.5" /> Admin Atelier Portal
                        </button>
                      )}
                    </div>

                    <div className="pt-2 border-t border-[#F3EFEA]">
                      <button
                        onClick={() => {
                          logout();
                          setIsAccountMenuOpen(false);
                        }}
                        className="w-full text-left py-1.5 px-2 text-xs tracking-wider uppercase text-[#A86464] hover:bg-[#F4EFEA] transition-colors"
                      >
                        Sign Out
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <p className="text-xs text-[#6B5C50] leading-relaxed">
                      Enter the sanctuary to view your acquisition orders, privilege points, and bespoke consultations.
                    </p>
                    <div className="space-y-2 pt-1">
                      <button
                        onClick={() => navigateTo('account')}
                        className="w-full py-2 bg-[#1E1714] text-[#FAF8F5] text-xs font-semibold tracking-[0.15em] uppercase hover:bg-[#342721] transition-colors"
                      >
                        Sign In / Register
                      </button>
                      <div className="pt-2 border-t border-[#F3EFEA] text-[11px] text-[#8C7A6B] space-y-1">
                        <span className="block text-[#6B5C50] font-medium">Evaluation Instant Sign-In:</span>
                        <div className="grid grid-cols-2 gap-2 pt-1">
                          <button
                            onClick={() => {
                              quickLoginDemo('CUSTOMER');
                              setIsAccountMenuOpen(false);
                            }}
                            className="py-1 px-2 border border-[#DCD3C7] hover:border-[#8C7A6B] text-[#1E1714] text-[10px] tracking-wider uppercase"
                          >
                            Demo Client
                          </button>
                          <button
                            onClick={() => {
                              quickLoginDemo('ADMIN');
                              setIsAccountMenuOpen(false);
                            }}
                            className="py-1 px-2 border border-[#BFA175] hover:bg-[#FAF8F5] text-[#8C7A6B] text-[10px] tracking-wider uppercase font-medium"
                          >
                            Admin Portal
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Mobile menu hamburger */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 text-[#6B5C50] hover:text-[#1E1714]"
            aria-label="Toggle Navigation"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-[#FAF8F5] border-b border-[#E7E0D6] px-6 py-6 space-y-5 animate-in slide-in-from-top-4 duration-200">
          <nav className="flex flex-col space-y-4 text-xs tracking-[0.2em] uppercase text-[#6B5C50]">
            <button onClick={() => navigateTo('home')} className="text-left hover:text-[#1E1714] py-1">
              Home
            </button>
            <button onClick={() => navigateTo('shop', null)} className="text-left hover:text-[#1E1714] py-1">
              All Creations
            </button>
            <button onClick={() => navigateTo('shop', 'fragrances')} className="text-left hover:text-[#1E1714] py-1">
              Haute Parfumerie
            </button>
            <button onClick={() => navigateTo('shop', 'apparel')} className="text-left hover:text-[#1E1714] py-1">
              Sartorial Wardrobe
            </button>
            <button onClick={() => navigateTo('shop', 'skincare')} className="text-left hover:text-[#1E1714] py-1">
              Botanical Skincare
            </button>
            <button onClick={() => navigateTo('gifting')} className="text-left hover:text-[#1E1714] py-1 flex items-center gap-2">
              <Gift className="w-3.5 h-3.5 text-[#BFA175]" />
              <span>Gifting Collections</span>
            </button>
            <button onClick={() => navigateTo('offers')} className="text-left hover:text-[#1E1714] py-1 flex items-center gap-2">
              <Tag className="w-3.5 h-3.5 text-[#BFA175]" />
              <span>Privilege Codes</span>
            </button>
            <button onClick={() => navigateTo('tracking')} className="text-left hover:text-[#1E1714] py-1 flex items-center gap-2">
              <Truck className="w-3.5 h-3.5" />
              <span>Track Order</span>
            </button>
            <button onClick={() => navigateTo('about')} className="text-left hover:text-[#1E1714] py-1">
              The Atelier
            </button>
            <button onClick={() => navigateTo('faq')} className="text-left hover:text-[#1E1714] py-1">
              Client Concierge & FAQ
            </button>
            <button onClick={() => navigateTo('contact')} className="text-left hover:text-[#1E1714] py-1">
              Private Consultation
            </button>
          </nav>
        </div>
      )}
    </header>
  );
};
