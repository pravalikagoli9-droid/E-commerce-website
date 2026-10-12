import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { Search, ShoppingBag, Heart, User as UserIcon, Shield, Menu, X } from 'lucide-react';

export const Navbar: React.FC = () => {
  const {
    currentPage,
    setCurrentPage,
    setSelectedCategorySlug,
    cartItems,
    wishlistIds,
    setIsSearchOpen,
    setIsCartDrawerOpen,
    user,
    logout,
    quickLoginDemo
  } = useStore();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);

  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const wishlistCount = wishlistIds.length;

  const navigateTo = (page: any, categorySlug?: string | null) => {
    if (categorySlug !== undefined) {
      setSelectedCategorySlug(categorySlug);
    }
    setCurrentPage(page);
    setIsMobileMenuOpen(false);
    setIsAccountMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-[#000000]/95 backdrop-blur-md border-b border-[#262626] transition-all">
      {/* Editorial Announcement Bar */}
      <div className="bg-[#121212] border-b border-[#1f1f1f] text-[11px] tracking-[0.2em] uppercase text-[#A39E98] py-1.5 px-4 text-center">
        <span>Complimentary White Glove Courier on acquisitions above ₹5,000</span>
        <span className="mx-2 text-[#444]">·</span>
        <span className="text-[#C5A880]">Bespoke Presentation Box Included</span>
      </div>

      {/* Primary Top Bar: 3 Zones Contract */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-8">
        {/* Zone 1: Brand Wordmark (Single text element) */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigateTo('home')}
            className="text-2xl sm:text-3xl font-serif tracking-[0.18em] text-[#F0ECE8] hover:text-[#FFFFFF] transition-colors whitespace-nowrap shrink-0 text-left cursor-pointer"
          >
            ÉLIXIR & NOIR
          </button>
        </div>

        {/* Zone 2: Single-Line Nav Links */}
        <nav className="hidden md:flex items-center gap-8 text-[13px] tracking-[0.15em] uppercase text-[#B5B0A8]">
          <button
            onClick={() => navigateTo('home')}
            className={`hover:text-[#FFFFFF] transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              currentPage === 'home' ? 'text-[#FFFFFF] border-b border-[#F0ECE8] pb-0.5' : ''
            }`}
          >
            Home
          </button>
          <button
            onClick={() => navigateTo('shop', null)}
            className={`hover:text-[#FFFFFF] transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              currentPage === 'shop' && !['fragrances', 'apparel', 'skincare'].includes('')
                ? 'text-[#FFFFFF] border-b border-[#F0ECE8] pb-0.5'
                : ''
            }`}
          >
            All Creations
          </button>
          <button
            onClick={() => navigateTo('shop', 'fragrances')}
            className="hover:text-[#FFFFFF] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            Parfumerie
          </button>
          <button
            onClick={() => navigateTo('shop', 'apparel')}
            className="hover:text-[#FFFFFF] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            Sartorial
          </button>
          <button
            onClick={() => navigateTo('shop', 'skincare')}
            className="hover:text-[#FFFFFF] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            Skincare
          </button>
          <button
            onClick={() => navigateTo('about')}
            className={`hover:text-[#FFFFFF] transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              currentPage === 'about' ? 'text-[#FFFFFF] border-b border-[#F0ECE8] pb-0.5' : ''
            }`}
          >
            The Atelier
          </button>
        </nav>

        {/* Zone 3: Interactive Affordances & Action Cluster */}
        <div className="flex items-center gap-5 shrink-0">
          {/* Search Trigger */}
          <button
            onClick={() => setIsSearchOpen(true)}
            aria-label="Search creations"
            className="p-2 text-[#C4BFB8] hover:text-[#FFFFFF] transition-colors cursor-pointer"
          >
            <Search className="w-[19px] h-[19px]" strokeWidth={1.5} />
          </button>

          {/* Wishlist Trigger */}
          <button
            onClick={() => navigateTo('account')}
            aria-label="Wishlist"
            className="relative p-2 text-[#C4BFB8] hover:text-[#FFFFFF] transition-colors cursor-pointer"
          >
            <Heart className="w-[19px] h-[19px]" strokeWidth={1.5} />
            {wishlistCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-[#C5A880] text-[#000000] text-[10px] font-medium rounded-full flex items-center justify-center font-mono">
                {wishlistCount}
              </span>
            )}
          </button>

          {/* Shopping Bag Trigger */}
          <button
            onClick={() => setIsCartDrawerOpen(true)}
            aria-label="Shopping Bag"
            className="relative p-2 text-[#C4BFB8] hover:text-[#FFFFFF] transition-colors cursor-pointer"
          >
            <ShoppingBag className="w-[19px] h-[19px]" strokeWidth={1.5} />
            {cartCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-[#F0ECE8] text-[#000000] text-[10px] font-semibold rounded-full flex items-center justify-center font-mono">
                {cartCount}
              </span>
            )}
          </button>

          {/* Account Menu Popover */}
          <div className="relative">
            <button
              onClick={() => setIsAccountMenuOpen(!isAccountMenuOpen)}
              aria-label="Customer Account"
              className="p-2 text-[#C4BFB8] hover:text-[#FFFFFF] transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <UserIcon className="w-[19px] h-[19px]" strokeWidth={1.5} />
              {user && (
                <span className="hidden xl:inline text-xs text-[#E0DBD3] max-w-[90px] truncate">
                  {user.name.split(' ')[0]}
                </span>
              )}
            </button>

            {isAccountMenuOpen && (
              <div className="absolute right-0 mt-3 w-64 bg-[#0F0F0F] border border-[#2B2B2B] shadow-2xl p-4 text-sm z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                {user ? (
                  <div className="space-y-3">
                    <div className="pb-3 border-b border-[#242424]">
                      <p className="font-serif text-base text-[#F0ECE8] truncate">{user.name}</p>
                      <p className="text-xs text-[#8A857D] truncate font-mono">{user.email}</p>
                      {user.role === 'ADMIN' && (
                        <div className="mt-1 inline-flex items-center gap-1 text-[10px] tracking-wider uppercase text-[#C5A880]">
                          <Shield className="w-3 h-3" /> Atelier Director (Admin)
                        </div>
                      )}
                    </div>

                    <div className="space-y-1">
                      <button
                        onClick={() => navigateTo('account')}
                        className="w-full text-left py-1.5 px-2 text-xs tracking-wider uppercase text-[#D1CCC4] hover:bg-[#1A1A1A] hover:text-white transition-colors"
                      >
                        Client Sanctuary
                      </button>
                      <button
                        onClick={() => navigateTo('account')}
                        className="w-full text-left py-1.5 px-2 text-xs tracking-wider uppercase text-[#D1CCC4] hover:bg-[#1A1A1A] hover:text-white transition-colors"
                      >
                        Order History & Tracking
                      </button>
                      {user.role === 'ADMIN' && (
                        <button
                          onClick={() => navigateTo('admin')}
                          className="w-full text-left py-1.5 px-2 text-xs tracking-wider uppercase text-[#C5A880] hover:bg-[#1A1A1A] transition-colors flex items-center gap-2"
                        >
                          <Shield className="w-3.5 h-3.5" /> Admin Atelier Portal
                        </button>
                      )}
                    </div>

                    <div className="pt-2 border-t border-[#242424]">
                      <button
                        onClick={() => {
                          logout();
                          setIsAccountMenuOpen(false);
                        }}
                        className="w-full text-left py-1.5 px-2 text-xs tracking-wider uppercase text-[#A86464] hover:bg-[#1A1A1A] transition-colors"
                      >
                        Sign Out
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <p className="text-xs text-[#A39E98] leading-relaxed">
                      Enter the sanctuary to view your acquisition orders, bespoke formulations, and concierge wishlists.
                    </p>
                    <div className="space-y-2 pt-1">
                      <button
                        onClick={() => navigateTo('account')}
                        className="w-full py-2 bg-[#F0ECE8] text-[#000000] text-xs font-medium tracking-[0.15em] uppercase hover:bg-white transition-colors"
                      >
                        Sign In / Register
                      </button>
                      <div className="pt-2 border-t border-[#222] text-[11px] text-[#7A756D] space-y-1">
                        <span className="block text-[#9E988F]">Instant Evaluation Access:</span>
                        <div className="grid grid-cols-2 gap-2 pt-1">
                          <button
                            onClick={() => {
                              quickLoginDemo('CUSTOMER');
                              setIsAccountMenuOpen(false);
                            }}
                            className="py-1 px-2 border border-[#333] hover:border-[#666] text-[#CCC] text-[10px] tracking-wider uppercase"
                          >
                            Demo Client
                          </button>
                          <button
                            onClick={() => {
                              quickLoginDemo('ADMIN');
                              setIsAccountMenuOpen(false);
                            }}
                            className="py-1 px-2 border border-[#C5A880]/50 hover:border-[#C5A880] text-[#C5A880] text-[10px] tracking-wider uppercase"
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

          {/* Mobile hamburger */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 text-[#C4BFB8] hover:text-[#FFFFFF]"
            aria-label="Toggle Navigation"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-[#0A0A0A] border-b border-[#242424] px-6 py-6 space-y-5 animate-in slide-in-from-top-4 duration-200">
          <nav className="flex flex-col space-y-4 text-sm tracking-[0.2em] uppercase text-[#C4BFB8]">
            <button
              onClick={() => navigateTo('home')}
              className="text-left hover:text-white transition-colors py-1"
            >
              Home
            </button>
            <button
              onClick={() => navigateTo('shop', null)}
              className="text-left hover:text-white transition-colors py-1"
            >
              All Creations
            </button>
            <button
              onClick={() => navigateTo('shop', 'fragrances')}
              className="text-left hover:text-white transition-colors py-1"
            >
              Haute Parfumerie
            </button>
            <button
              onClick={() => navigateTo('shop', 'apparel')}
              className="text-left hover:text-white transition-colors py-1"
            >
              Sartorial Wardrobe
            </button>
            <button
              onClick={() => navigateTo('shop', 'skincare')}
              className="text-left hover:text-white transition-colors py-1"
            >
              Botanical Skincare
            </button>
            <button
              onClick={() => navigateTo('about')}
              className="text-left hover:text-white transition-colors py-1"
            >
              The Atelier
            </button>
            <button
              onClick={() => navigateTo('faq')}
              className="text-left hover:text-white transition-colors py-1"
            >
              Client Concierge & FAQ
            </button>
            <button
              onClick={() => navigateTo('contact')}
              className="text-left hover:text-white transition-colors py-1"
            >
              Private Consultation
            </button>
          </nav>
        </div>
      )}
    </header>
  );
};
