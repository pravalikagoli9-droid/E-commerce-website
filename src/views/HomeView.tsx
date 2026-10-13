import React, { useState, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { ProductCard } from '../components/ProductCard';
import {
  ArrowRight,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Gift,
  Coins,
  ShieldCheck,
  Star,
  Eye,
  Heart
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const HomeView: React.FC = () => {
  const {
    products,
    setCurrentPage,
    setSelectedCategorySlug,
    recentlyViewedIds,
    favoriteCategories,
    toggleFavoriteCategory
  } = useStore();

  const [heroIndex, setHeroIndex] = useState(0);

  const heroCampaigns = [
    {
      title: "Artisanal Perfumes & Niche Elixirs",
      subtitle: "Luxury Fragrances · French Macerations",
      desc: "Cold-macerated wild amber, Somalian frankincense tears, and four-year-aged Florentine orris butter cured in smoked glass flacons.",
      ctaText: "Shop Fragrances",
      categorySlug: "fragrances",
      image: "/src/assets/images/hero_luxury_boutique_1791824705943.jpg"
    },
    {
      title: "Architectural Drape & Pure Wool",
      subtitle: "Lifestyle & Apparel · Winter Edition",
      desc: "Hand-tailored double-faced 750gsm virgin wool overcoats and pure Como silk charmeuse robes crafted with floating canvas authority.",
      ctaText: "Shop Apparel",
      categorySlug: "apparel",
      image: "/src/assets/images/category_apparel_1791824731775.jpg"
    },
    {
      title: "Cellular Botanical Restoration",
      subtitle: "Botanical Skincare · Restorative Care",
      desc: "Nutrient-dense prickly pear seed elixirs and hand-carved volcanic obsidian sculpting stones to nourish your evening skincare routine.",
      ctaText: "Shop Skincare",
      categorySlug: "skincare",
      image: "/src/assets/images/category_skincare_1791824742582.jpg"
    }
  ];

  // Auto rotate hero campaigns every 7 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setHeroIndex(prev => (prev + 1) % heroCampaigns.length);
    }, 7000);
    return () => clearInterval(timer);
  }, [heroCampaigns.length]);

  const currentCampaign = heroCampaigns[heroIndex];

  const featuredProducts = products.filter(p => p.isFeatured).slice(0, 4);
  const bestsellers = products.filter(p => p.isBestseller).slice(0, 4);
  const giftPicks = products.filter(p => p.isGiftPick).slice(0, 4);

  // Recently viewed products
  const recentlyViewedProducts = products.filter(p => recentlyViewedIds.includes(p.id));

  const categories = [
    {
      title: 'Luxury Fragrances',
      subtitle: 'Rare wild resins, amber extracts, and Grasse floral absolutes',
      slug: 'fragrances',
      image: '/src/assets/images/category_fragrances_1791824720667.jpg'
    },
    {
      title: 'Lifestyle & Apparel',
      subtitle: 'Architectural silhouettes in pure double-face wool and Como silk',
      slug: 'apparel',
      image: '/src/assets/images/category_apparel_1791824731775.jpg'
    },
    {
      title: 'Botanical Skincare',
      subtitle: 'Bio-compatible cellular facial oils with obsidian sculpting rituals',
      slug: 'skincare',
      image: '/src/assets/images/category_skincare_1791824742582.jpg'
    }
  ];

  return (
    <div className="space-y-24 sm:space-y-32 pb-16">
      {/* 1. Interactive Multi-Campaign Hero Section */}
      <section className="relative min-h-[82vh] sm:min-h-[88vh] flex items-center justify-center overflow-hidden bg-[#392C2A]">
        {/* Animated Background Image */}
        <div className="absolute inset-0 z-0">
          <AnimatePresence mode="wait">
            <motion.img
              key={currentCampaign.image}
              src={currentCampaign.image}
              alt={currentCampaign.title}
              referrerPolicy="no-referrer"
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 0.7, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.9, ease: 'easeOut' }}
              className="w-full h-full object-cover object-center"
            />
          </AnimatePresence>
          {/* Subtle Scrim Gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#392C2A] via-[#392C2A]/50 to-[#392C2A]/35" />
        </div>

        {/* Hero Content Frame */}
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 text-center space-y-6 pt-12 pb-16">
          <AnimatePresence mode="wait">
            <motion.div
              key={heroIndex}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -14 }}
              transition={{ duration: 0.5 }}
              className="space-y-6"
            >
              <span className="inline-block text-xs sm:text-sm tracking-[0.28em] uppercase text-[#D6B77A] font-semibold">
                {currentCampaign.subtitle}
              </span>

              <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl lg:text-8xl text-[#FAF7F2] tracking-[0.04em] leading-[1.08] font-normal max-w-4xl mx-auto [text-wrap:balance]">
                {currentCampaign.title}
              </h1>

              <p className="text-sm sm:text-base md:text-lg text-[#E8D8C8] max-w-2xl mx-auto font-light leading-relaxed tracking-wide [text-wrap:balance]">
                {currentCampaign.desc}
              </p>

              <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
                <button
                  onClick={() => {
                    setSelectedCategorySlug(currentCampaign.categorySlug);
                    setCurrentPage('shop');
                  }}
                  className="w-full sm:w-auto px-8 py-3.5 bg-[#C9878D] text-white text-xs font-semibold tracking-[0.22em] uppercase hover:bg-[#B56F75] transition-colors cursor-pointer shadow-xl flex items-center justify-center gap-2"
                >
                  <span>{currentCampaign.ctaText}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => {
                    setSelectedCategorySlug(null);
                    setCurrentPage('shop');
                  }}
                  className="w-full sm:w-auto px-8 py-3.5 border border-[#E8D8C8] hover:border-white text-xs font-medium tracking-[0.22em] uppercase text-[#FAF7F2] hover:text-white transition-colors cursor-pointer"
                >
                  Shop All Products
                </button>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Hero Carousel Navigation Dots & Controls */}
          <div className="pt-8 flex items-center justify-center gap-6">
            <button
              onClick={() =>
                setHeroIndex(prev => (prev - 1 + heroCampaigns.length) % heroCampaigns.length)
              }
              aria-label="Previous Campaign"
              className="p-2 rounded-full text-[#E8D8C8] hover:text-white border border-[#E8D8C8]/40 hover:border-white transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <div className="flex gap-2.5">
              {heroCampaigns.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setHeroIndex(idx)}
                  className={`h-2 transition-all duration-300 rounded-full cursor-pointer ${
                    heroIndex === idx ? 'w-8 bg-[#C9878D]' : 'w-2 bg-[#E8D8C8]/40 hover:bg-[#E8D8C8]/80'
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>

            <button
              onClick={() => setHeroIndex(prev => (prev + 1) % heroCampaigns.length)}
              aria-label="Next Campaign"
              className="p-2 rounded-full text-[#E8D8C8] hover:text-white border border-[#E8D8C8]/40 hover:border-white transition-colors cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* 2. Three Brand Quality Hallmarks */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 py-10 border-y border-[#E8DED4] bg-[#FFFDF9] p-6 sm:p-10 rounded-sm shadow-xs"
        >
          <div className="space-y-2 pr-4">
            <span className="font-mono text-xs text-[#C9878D] tracking-wider block font-semibold">01</span>
            <h3 className="font-serif text-xl text-[#392C2A]">Rare Botanical Ingredients</h3>
            <p className="text-xs text-[#7D6B67] leading-relaxed">
              Formulated over slow aging cycles utilizing wild Moroccan amber, Somalian frankincense tears, and Florentine orris root.
            </p>
          </div>

          <div className="space-y-2 pr-4 md:border-l md:border-[#E8DED4] md:pl-8">
            <span className="font-mono text-xs text-[#C9878D] tracking-wider block font-semibold">02</span>
            <h3 className="font-serif text-xl text-[#392C2A]">Artisanal Craftsmanship</h3>
            <p className="text-xs text-[#7D6B67] leading-relaxed">
              Hand-finished double-faced virgin wool, Grade-A cashmere, and pure 22-momme Como silk garments tailored to perfection.
            </p>
          </div>

          <div className="space-y-2 pr-4 md:border-l md:border-[#E8DED4] md:pl-8">
            <span className="font-mono text-xs text-[#C9878D] tracking-wider block font-semibold">03</span>
            <h3 className="font-serif text-xl text-[#392C2A]">Complimentary Luxury Delivery</h3>
            <p className="text-xs text-[#7D6B67] leading-relaxed">
              Free express shipping on all orders over ₹5,000. Beautifully boxed, safely sealed, and dispatched with full online tracking.
            </p>
          </div>
        </motion.div>
      </section>

      {/* 3. Personalized Shopping: Recently Viewed Products */}
      {recentlyViewedProducts.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="flex items-end justify-between border-b border-[#E8DED4] pb-3">
            <div>
              <span className="text-xs tracking-[0.25em] uppercase text-[#C9878D] font-semibold">
                Your Browsing History
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl text-[#392C2A]">Recently Viewed Products</h2>
            </div>
            <span className="text-xs text-[#7D6B67] font-mono">{recentlyViewedProducts.length} Products</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {recentlyViewedProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      )}

      {/* 4. Three Pillar Disciplines (Category Showcase Cards) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b border-[#E8DED4] pb-4 gap-2">
          <div>
            <span className="text-xs tracking-[0.25em] uppercase text-[#C9878D] font-semibold">
              Curated Collections
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-[#392C2A]">Explore by Category</h2>
          </div>
          <button
            onClick={() => {
              setSelectedCategorySlug(null);
              setCurrentPage('shop');
            }}
            className="text-xs uppercase tracking-[0.18em] text-[#7D6B67] hover:text-[#C9878D] flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <span>View All Categories</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {categories.map((cat, idx) => (
            <motion.div
              key={cat.slug}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.1 }}
              onClick={() => {
                setSelectedCategorySlug(cat.slug);
                setCurrentPage('shop');
              }}
              className="group relative h-[480px] bg-[#392C2A] border border-[#E8DED4] overflow-hidden cursor-pointer shadow-md rounded-sm"
            >
              <img
                src={cat.image}
                alt={cat.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105 opacity-85 group-hover:opacity-95"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#392C2A] via-[#392C2A]/40 to-transparent" />

              <div className="absolute inset-x-0 bottom-0 p-8 space-y-2">
                <span className="text-[11px] tracking-[0.2em] uppercase text-[#D6B77A] block font-semibold">
                  Collection
                </span>
                <h3 className="font-serif text-2xl text-[#FAF7F2] group-hover:translate-x-1 transition-transform">
                  {cat.title}
                </h3>
                <p className="text-xs text-[#E8D8C8] line-clamp-2 leading-relaxed">
                  {cat.subtitle}
                </p>
                <div className="pt-2 flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-[#FAF7F2] font-medium">
                  <span>Shop Collection</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform text-[#C9878D]" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 5. Featured Creations Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b border-[#E8DED4] pb-4 gap-2">
          <div>
            <span className="text-xs tracking-[0.25em] uppercase text-[#C9878D] font-semibold">
              Editor's Choice
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-[#392C2A]">Featured Products</h2>
          </div>
          <button
            onClick={() => {
              setSelectedCategorySlug(null);
              setCurrentPage('shop');
            }}
            className="text-xs uppercase tracking-[0.18em] text-[#7D6B67] hover:text-[#C9878D] flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* 6. Gifting Dedicated Teaser Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="bg-[#E8D8C8]/35 border border-[#E8DED4] p-8 sm:p-14 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center rounded-sm"
        >
          <div className="lg:col-span-7 space-y-4">
            <span className="text-xs tracking-[0.28em] uppercase text-[#C9878D] font-semibold flex items-center gap-2">
              <Gift className="w-4 h-4 text-[#C9878D]" />
              <span>Gift Sets & Services</span>
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-[#392C2A] font-normal leading-tight">
              Thoughtful luxury gifts for weddings, milestones, holidays, and anniversaries.
            </h2>
            <p className="text-xs sm:text-sm text-[#7D6B67] leading-relaxed max-w-xl">
              Every gift order can include luxury gift wrapping, a personalized card message, and a gift receipt with hidden prices.
            </p>
            <div className="pt-2">
              <button
                onClick={() => setCurrentPage('gifting')}
                className="px-6 py-3 bg-[#C9878D] hover:bg-[#B56F75] text-white text-xs font-semibold tracking-[0.2em] uppercase transition-colors cursor-pointer inline-flex items-center gap-2 shadow-md"
              >
                <span>Explore Gift Sets</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <div className="lg:col-span-5 grid grid-cols-2 gap-4">
            {giftPicks.slice(0, 2).map(p => (
              <div key={p.id} className="bg-[#FFFDF9] border border-[#E8DED4] p-3 space-y-2 rounded-sm shadow-xs">
                <div className="aspect-[4/5] overflow-hidden bg-[#FAF7F2]">
                  <img src={p.images[0] || ''} alt="" className="w-full h-full object-cover" />
                </div>
                <div>
                  <h4 className="font-serif text-xs text-[#392C2A] font-medium line-clamp-1">{p.name}</h4>
                  <p className="font-mono text-xs text-[#7D6B67]">₹{p.price.toLocaleString('en-US')}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* 7. Loyalty & Rewards Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="bg-[#392C2A] text-[#FAF7F2] p-8 sm:p-12 border border-[#E8DED4] grid grid-cols-1 md:grid-cols-12 gap-8 items-center rounded-sm shadow-lg"
        >
          <div className="md:col-span-8 space-y-3">
            <span className="text-xs tracking-[0.28em] uppercase text-[#D6B77A] font-semibold flex items-center gap-2">
              <Coins className="w-4 h-4 text-[#D6B77A]" />
              <span>Member Rewards Program</span>
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-normal text-[#FAF7F2]">
              Earn rewards with every purchase.
            </h2>
            <p className="text-xs sm:text-sm text-[#E8D8C8] leading-relaxed max-w-xl">
              Receive 500 bonus points when you create an account. Earn 1 point for every ₹100 spent, redeemable directly as a discount at checkout.
            </p>
          </div>
          <div className="md:col-span-4 flex flex-col sm:flex-row md:flex-col gap-3 justify-center">
            <button
              onClick={() => setCurrentPage('account')}
              className="py-3 px-6 bg-[#C9878D] hover:bg-[#B56F75] text-white text-xs font-semibold uppercase tracking-[0.2em] transition-colors cursor-pointer text-center shadow-sm"
            >
              Join Or View Points
            </button>
            <button
              onClick={() => setCurrentPage('offers')}
              className="py-3 px-6 border border-[#E8D8C8] hover:border-white text-[#FAF7F2] text-xs font-medium uppercase tracking-[0.2em] transition-colors cursor-pointer text-center"
            >
              View Special Offers
            </button>
          </div>
        </motion.div>
      </section>

      {/* 8. Best Sellers Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b border-[#E8DED4] pb-4 gap-2">
          <div>
            <span className="text-xs tracking-[0.25em] uppercase text-[#C9878D] font-semibold">
              Customer Favorites
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-[#392C2A]">Best Sellers</h2>
          </div>
          <button
            onClick={() => {
              setSelectedCategorySlug(null);
              setCurrentPage('shop');
            }}
            className="text-xs uppercase tracking-[0.18em] text-[#7D6B67] hover:text-[#C9878D] flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <span>Explore All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {bestsellers.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* 9. Verified Customer Reviews */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="border border-[#E8DED4] bg-[#FFFDF9] p-8 sm:p-14 space-y-10 rounded-sm">
          <div className="text-center space-y-2">
            <span className="text-xs tracking-[0.25em] uppercase text-[#C9878D] font-semibold">
              Customer Endorsements
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl text-[#392C2A]">
              Verified Customer Reviews
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-xs text-[#7D6B67]">
            <motion.div
              whileHover={{ y: -4 }}
              className="space-y-4 p-6 bg-[#FAF7F2] border border-[#E8DED4] rounded-sm shadow-2xs"
            >
              <div className="flex items-center gap-1 text-[#D6B77A]">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-[#D6B77A]" />
                ))}
              </div>
              <p className="font-serif text-base text-[#392C2A] italic leading-relaxed">
                "Nocturne Ambré is exquisite. The warm spiced plum notes opening into ancient amber last all day and evening. Worth every rupee."
              </p>
              <div className="pt-2 border-t border-[#E8DED4]">
                <p className="font-semibold text-[#392C2A]">Eleanor Vance</p>
                <p className="text-[11px] text-[#7D6B67]">Mumbai · Verified Buyer</p>
              </div>
            </motion.div>

            <motion.div
              whileHover={{ y: -4 }}
              className="space-y-4 p-6 bg-[#FAF7F2] border border-[#E8DED4] rounded-sm shadow-2xs"
            >
              <div className="flex items-center gap-1 text-[#D6B77A]">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-[#D6B77A]" />
                ))}
              </div>
              <p className="font-serif text-base text-[#392C2A] italic leading-relaxed">
                "The double-faced overcoat is tailored with immaculate precision. The silk lapel drape is subtle and elegant. Exceptional quality."
              </p>
              <div className="pt-2 border-t border-[#E8DED4]">
                <p className="font-semibold text-[#392C2A]">Julian Montagu</p>
                <p className="text-[11px] text-[#7D6B67]">London · Verified Buyer</p>
              </div>
            </motion.div>

            <motion.div
              whileHover={{ y: -4 }}
              className="space-y-4 p-6 bg-[#FAF7F2] border border-[#E8DED4] rounded-sm shadow-2xs"
            >
              <div className="flex items-center gap-1 text-[#D6B77A]">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-[#D6B77A]" />
                ))}
              </div>
              <p className="font-serif text-base text-[#392C2A] italic leading-relaxed">
                "The botanical restorative serum and obsidian sculpting stone transformed my nighttime skincare routine. Deeply nourishing without feeling greasy."
              </p>
              <div className="pt-2 border-t border-[#E8DED4]">
                <p className="font-semibold text-[#392C2A]">Aria Thorne</p>
                <p className="text-[11px] text-[#7D6B67]">New Delhi · Verified Buyer</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};
