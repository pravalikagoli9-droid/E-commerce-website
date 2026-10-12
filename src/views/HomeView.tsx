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
      title: "L'Art de l'Élixir et du Noir",
      subtitle: "Maison de Haute Parfumerie · Grasse Macerations",
      desc: "Cold-macerated wild amber, Somalian frankincense tears, and four-year-aged Florentine orris butter cured in smoked glass flacons.",
      ctaText: "Explore Haute Parfumerie",
      categorySlug: "fragrances",
      image: "/src/assets/images/hero_luxury_boutique_1791824705943.jpg"
    },
    {
      title: "Architectural Drape & Pure Wool",
      subtitle: "The Sartorial Wardrobe · Winter Atelier Edition",
      desc: "Hand-tailored double-faced 750gsm virgin wool overcoats and pure Como silk charmeuse robes crafted with floating canvas authority.",
      ctaText: "Discover Sartorial Pieces",
      categorySlug: "apparel",
      image: "/src/assets/images/category_apparel_1791824731775.jpg"
    },
    {
      title: "Cellular Botanical Restoration",
      subtitle: "Bio-Compatible Skincare · Dermal Rituals",
      desc: "Nutrient-dense prickly pear seed elixirs and hand-carved volcanic obsidian sculpting stones to nourish your evening sanctuary.",
      ctaText: "Experience Botanical Care",
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

  // Personalized recommendations based on favorite categories or popular picks
  const recommendedProducts = products
    .filter(p =>
      favoriteCategories.length > 0
        ? favoriteCategories.includes(p.categoryId.replace('cat_', ''))
        : p.averageRating >= 4.8
    )
    .slice(0, 4);

  const categories = [
    {
      title: 'Haute Parfumerie',
      subtitle: 'Rare wild resins, amber extracts, and Grasse macerations',
      slug: 'fragrances',
      image: '/src/assets/images/category_fragrances_1791824720667.jpg'
    },
    {
      title: 'Sartorial Wardrobe',
      subtitle: 'Architectural silhouettes in pure double-face wool and silk',
      slug: 'apparel',
      image: '/src/assets/images/category_apparel_1791824731775.jpg'
    },
    {
      title: 'Botanical Skincare',
      subtitle: 'Bio-compatible cellular oils with obsidian sculpting rituals',
      slug: 'skincare',
      image: '/src/assets/images/category_skincare_1791824742582.jpg'
    }
  ];

  return (
    <div className="space-y-24 sm:space-y-32 pb-16">
      {/* 1. Interactive Multi-Campaign Hero Section */}
      <section className="relative min-h-[82vh] sm:min-h-[88vh] flex items-center justify-center overflow-hidden bg-[#1E1714]">
        {/* Animated Background Image */}
        <div className="absolute inset-0 z-0">
          <img
            key={currentCampaign.image}
            src={currentCampaign.image}
            alt={currentCampaign.title}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-center transition-all duration-1000 ease-out opacity-65 animate-in fade-in"
          />
          {/* Subtle Scrim Gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#1E1714] via-[#1E1714]/40 to-[#1E1714]/30" />
        </div>

        {/* Hero Content Frame */}
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 text-center space-y-6 pt-12 pb-16">
          <span className="inline-block text-xs sm:text-sm tracking-[0.28em] uppercase text-[#BFA175] font-medium animate-in fade-in slide-in-from-bottom-2 duration-300">
            {currentCampaign.subtitle}
          </span>

          <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl lg:text-8xl text-[#FAF8F5] tracking-[0.05em] leading-[1.08] font-normal max-w-4xl mx-auto [text-wrap:balance]">
            {currentCampaign.title}
          </h1>

          <p className="text-sm sm:text-base md:text-lg text-[#DCD3C7] max-w-2xl mx-auto font-light leading-relaxed tracking-wide [text-wrap:balance]">
            {currentCampaign.desc}
          </p>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => {
                setSelectedCategorySlug(currentCampaign.categorySlug);
                setCurrentPage('shop');
              }}
              className="w-full sm:w-auto px-8 py-3.5 bg-[#FAF8F5] text-[#1E1714] text-xs font-semibold tracking-[0.22em] uppercase hover:bg-white transition-colors cursor-pointer shadow-xl flex items-center justify-center gap-2"
            >
              <span>{currentCampaign.ctaText}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => {
                setSelectedCategorySlug(null);
                setCurrentPage('shop');
              }}
              className="w-full sm:w-auto px-8 py-3.5 border border-[#B6A797] hover:border-white text-xs font-medium tracking-[0.22em] uppercase text-[#FAF8F5] hover:text-white transition-colors cursor-pointer"
            >
              All Atelier Works
            </button>
          </div>

          {/* Hero Carousel Navigation Dots & Controls */}
          <div className="pt-8 flex items-center justify-center gap-6">
            <button
              onClick={() =>
                setHeroIndex(prev => (prev - 1 + heroCampaigns.length) % heroCampaigns.length)
              }
              aria-label="Previous Campaign"
              className="p-1.5 rounded-full text-[#DCD3C7] hover:text-white border border-[#DCD3C7]/30 hover:border-white transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <div className="flex gap-2">
              {heroCampaigns.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setHeroIndex(idx)}
                  className={`h-1.5 transition-all duration-300 rounded-full cursor-pointer ${
                    heroIndex === idx ? 'w-8 bg-[#FAF8F5]' : 'w-2 bg-[#FAF8F5]/40 hover:bg-[#FAF8F5]/70'
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>

            <button
              onClick={() => setHeroIndex(prev => (prev + 1) % heroCampaigns.length)}
              aria-label="Next Campaign"
              className="p-1.5 rounded-full text-[#DCD3C7] hover:text-white border border-[#DCD3C7]/30 hover:border-white transition-colors cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* 2. Three Brand Quality Hallmarks */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 py-10 border-y border-[#E7E0D6] bg-white p-6 sm:p-10">
          <div className="space-y-2 pr-4">
            <span className="font-mono text-xs text-[#8C7A6B] tracking-wider block font-semibold">01</span>
            <h3 className="font-serif text-xl text-[#1E1714]">Rare Botanical Maceration</h3>
            <p className="text-xs text-[#6B5C50] leading-relaxed">
              Macerated in Grasse over twelve lunar cycles utilizing unrefined wild Moroccan amber, Somalian frankincense tears, and Florentine orris root.
            </p>
          </div>

          <div className="space-y-2 pr-4 md:border-l md:border-[#E7E0D6] md:pl-8">
            <span className="font-mono text-xs text-[#8C7A6B] tracking-wider block font-semibold">02</span>
            <h3 className="font-serif text-xl text-[#1E1714]">Floating Canvas Sartorial Tailoring</h3>
            <p className="text-xs text-[#6B5C50] leading-relaxed">
              Hand-finished double-faced virgin wool and 22-momme Como silk garments tailored with internal natural horsehair canvas structures.
            </p>
          </div>

          <div className="space-y-2 pr-4 md:border-l md:border-[#E7E0D6] md:pl-8">
            <span className="font-mono text-xs text-[#8C7A6B] tracking-wider block font-semibold">03</span>
            <h3 className="font-serif text-xl text-[#1E1714]">White Glove Courier Presentation</h3>
            <p className="text-xs text-[#6B5C50] leading-relaxed">
              Complimentary on acquisitions over ₹5,000. Formally boxed in rigid presentation cases, wax-sealed, and delivered via tracked courier.
            </p>
          </div>
        </div>
      </section>

      {/* 3. Personalized Shopping: Recently Viewed Products (if any) */}
      {recentlyViewedProducts.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="flex items-end justify-between border-b border-[#E7E0D6] pb-3">
            <div>
              <span className="text-xs tracking-[0.25em] uppercase text-[#8C7A6B] font-medium">
                Personalized History
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl text-[#1E1714]">Recently Viewed Creations</h2>
            </div>
            <span className="text-xs text-[#8C7A6B] font-mono">{recentlyViewedProducts.length} Creations</span>
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
        <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b border-[#E7E0D6] pb-4 gap-2">
          <div>
            <span className="text-xs tracking-[0.25em] uppercase text-[#BFA175] font-medium">
              The Three Disciplines
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-[#1E1714]">Curated Pillars</h2>
          </div>
          <button
            onClick={() => {
              setSelectedCategorySlug(null);
              setCurrentPage('shop');
            }}
            className="text-xs uppercase tracking-[0.18em] text-[#6B5C50] hover:text-[#1E1714] flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <span>View Full Archive</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {categories.map(cat => (
            <div
              key={cat.slug}
              onClick={() => {
                setSelectedCategorySlug(cat.slug);
                setCurrentPage('shop');
              }}
              className="group relative h-[480px] bg-[#1E1714] border border-[#E7E0D6] overflow-hidden cursor-pointer shadow-md"
            >
              <img
                src={cat.image}
                alt={cat.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105 opacity-85 group-hover:opacity-95"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1E1714] via-[#1E1714]/40 to-transparent" />

              <div className="absolute inset-x-0 bottom-0 p-8 space-y-2">
                <span className="text-[11px] tracking-[0.2em] uppercase text-[#BFA175] block font-medium">
                  Collection Pillar
                </span>
                <h3 className="font-serif text-2xl text-[#FAF8F5] group-hover:translate-x-1 transition-transform">
                  {cat.title}
                </h3>
                <p className="text-xs text-[#DCD3C7] line-clamp-2 leading-relaxed">
                  {cat.subtitle}
                </p>
                <div className="pt-2 flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-[#FAF8F5] font-medium">
                  <span>Explore Formulation</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform text-[#BFA175]" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. Featured Creations Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b border-[#E7E0D6] pb-4 gap-2">
          <div>
            <span className="text-xs tracking-[0.25em] uppercase text-[#BFA175] font-medium">
              Curated Icons
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-[#1E1714]">Featured Formulations</h2>
          </div>
          <button
            onClick={() => {
              setSelectedCategorySlug(null);
              setCurrentPage('shop');
            }}
            className="text-xs uppercase tracking-[0.18em] text-[#6B5C50] hover:text-[#1E1714] flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <span>All Catalog Works</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* 6. Gifting Salon Dedicated Teaser Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#F4EFEA] border border-[#E7E0D6] p-8 sm:p-14 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-4">
            <span className="text-xs tracking-[0.28em] uppercase text-[#8C7A6B] font-semibold flex items-center gap-2">
              <Gift className="w-4 h-4 text-[#BFA175]" />
              <span>The Gifting Salon</span>
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-[#1E1714] font-normal leading-tight">
              Creations of timeless distinction for weddings, executive milestones & anniversaries.
            </h2>
            <p className="text-xs sm:text-sm text-[#5C4F44] leading-relaxed max-w-xl">
              Each gift acquisition can be customized with luxury wax-sealed presentation boxes, personalized calligraphy messages, and concealed invoice pricing.
            </p>
            <div className="pt-2">
              <button
                onClick={() => setCurrentPage('gifting')}
                className="px-6 py-3 bg-[#1E1714] hover:bg-[#342721] text-[#FAF8F5] text-xs font-semibold tracking-[0.2em] uppercase transition-colors cursor-pointer inline-flex items-center gap-2 shadow-md"
              >
                <span>Enter The Gifting Salon</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <div className="lg:col-span-5 grid grid-cols-2 gap-4">
            {giftPicks.slice(0, 2).map(p => (
              <div key={p.id} className="bg-white border border-[#E7E0D6] p-3 space-y-2">
                <div className="aspect-[4/5] overflow-hidden bg-[#FAF8F5]">
                  <img src={p.images[0] || ''} alt="" className="w-full h-full object-cover" />
                </div>
                <div>
                  <h4 className="font-serif text-xs text-[#1E1714] font-medium line-clamp-1">{p.name}</h4>
                  <p className="font-mono text-xs text-[#8C7A6B]">₹{p.price.toLocaleString('en-IN')}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. Loyalty & Rewards: The Nocturne Privilège Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#1E1714] text-[#FAF8F5] p-8 sm:p-12 border border-[#E7E0D6] grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          <div className="md:col-span-8 space-y-3">
            <span className="text-xs tracking-[0.28em] uppercase text-[#BFA175] font-medium flex items-center gap-2">
              <Coins className="w-4 h-4 text-[#BFA175]" />
              <span>The Nocturne Privilège</span>
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-normal">
              Earn rewards on every acquisition.
            </h2>
            <p className="text-xs sm:text-sm text-[#DCD3C7] leading-relaxed max-w-xl">
              Receive 500 bonus points upon maiden registration. Patrons earn 1 point for every ₹100 acquired, unlockable as direct concession on checkout or towards limited harvest releases.
            </p>
          </div>
          <div className="md:col-span-4 flex flex-col sm:flex-row md:flex-col gap-3 justify-center">
            <button
              onClick={() => setCurrentPage('account')}
              className="py-3 px-6 bg-[#FAF8F5] hover:bg-white text-[#1E1714] text-xs font-semibold uppercase tracking-[0.2em] transition-colors cursor-pointer text-center"
            >
              Join Or View Points
            </button>
            <button
              onClick={() => setCurrentPage('offers')}
              className="py-3 px-6 border border-[#B6A797] hover:border-white text-[#FAF8F5] text-xs font-medium uppercase tracking-[0.2em] transition-colors cursor-pointer text-center"
            >
              View Active Privileges
            </button>
          </div>
        </div>
      </section>

      {/* 8. Atelier Bestsellers Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b border-[#E7E0D6] pb-4 gap-2">
          <div>
            <span className="text-xs tracking-[0.25em] uppercase text-[#BFA175] font-medium">
              Permanent Collection
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-[#1E1714]">Atelier Bestsellers</h2>
          </div>
          <button
            onClick={() => {
              setSelectedCategorySlug(null);
              setCurrentPage('shop');
            }}
            className="text-xs uppercase tracking-[0.18em] text-[#6B5C50] hover:text-[#1E1714] flex items-center gap-1.5 transition-colors cursor-pointer"
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

      {/* 9. Connoisseur Endorsements / Customer Reviews */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="border border-[#E7E0D6] bg-white p-8 sm:p-14 space-y-10">
          <div className="text-center space-y-2">
            <span className="text-xs tracking-[0.25em] uppercase text-[#8C7A6B] font-medium">
              The Connoisseur Circle
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl text-[#1E1714]">
              Endorsements of Refinement
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-xs text-[#5C4F44]">
            <div className="space-y-4 p-6 bg-[#FAF8F5] border border-[#E7E0D6]">
              <div className="flex items-center gap-1 text-[#BFA175]">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3 h-3 fill-[#BFA175]" />
                ))}
              </div>
              <p className="font-serif text-base text-[#1E1714] italic leading-relaxed">
                "Nocturne Ambré represents the pinnacle of contemporary niche fragrance. The smoky plum transition into royal amber lasts indefinitely on cashmere."
              </p>
              <div className="pt-2 border-t border-[#E7E0D6]">
                <p className="font-medium text-[#1E1714]">Eleanor Vance</p>
                <p className="text-[11px] text-[#8C7A6B]">Collector, Mumbai · Verified Patron</p>
              </div>
            </div>

            <div className="space-y-4 p-6 bg-[#FAF8F5] border border-[#E7E0D6]">
              <div className="flex items-center gap-1 text-[#BFA175]">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3 h-3 fill-[#BFA175]" />
                ))}
              </div>
              <p className="font-serif text-base text-[#1E1714] italic leading-relaxed">
                "The double-faced obsidian overcoat is sculpted with Savile Row precision yet carries an effortless Parisian ease. An heirloom garment."
              </p>
              <div className="pt-2 border-t border-[#E7E0D6]">
                <p className="font-medium text-[#1E1714]">Julian Montagu</p>
                <p className="text-[11px] text-[#8C7A6B]">Architectural Critic, London · Verified Patron</p>
              </div>
            </div>

            <div className="space-y-4 p-6 bg-[#FAF8F5] border border-[#E7E0D6]">
              <div className="flex items-center gap-1 text-[#BFA175]">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3 h-3 fill-[#BFA175]" />
                ))}
              </div>
              <p className="font-serif text-base text-[#1E1714] italic leading-relaxed">
                "The botanical restorative serum and obsidian sculpting stone transformed my evening ritual. Deeply hydrating without any residual sheen."
              </p>
              <div className="pt-2 border-t border-[#E7E0D6]">
                <p className="font-medium text-[#1E1714]">Aria Thorne</p>
                <p className="text-[11px] text-[#8C7A6B]">Creative Director, New Delhi · Verified Patron</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
