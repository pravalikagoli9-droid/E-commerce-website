import React from 'react';
import { useStore } from '../context/StoreContext';
import { ProductCard } from '../components/ProductCard';
import { ArrowRight, Sparkles, Feather, ShieldCheck, Compass } from 'lucide-react';

export const HomeView: React.FC = () => {
  const { products, setCurrentPage, setSelectedCategorySlug } = useStore();

  const featuredProducts = products.filter(p => p.isFeatured).slice(0, 4);
  const bestsellers = products.filter(p => p.isBestseller).slice(0, 4);

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
    <div className="space-y-24 sm:space-y-32">
      {/* 1. Large Luxury Hero Section */}
      <section className="relative min-h-[85vh] sm:min-h-[90vh] flex items-center justify-center overflow-hidden bg-black">
        {/* Cinematic Backdrop Image with subtle dark scrim */}
        <div className="absolute inset-0 z-0">
          <img
            src="/src/assets/images/hero_luxury_boutique_1791824705943.jpg"
            alt="ÉLIXIR & NOIR Haute Parfumerie Hero"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-center scale-100 transition-transform duration-1000 opacity-75"
          />
          {/* Gradients ensuring 4.5:1 text contrast */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-black/30" />
          <div className="absolute inset-0 bg-radial from-transparent via-black/40 to-black" />
        </div>

        {/* Hero Content Frame */}
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 text-center space-y-6 pt-12 pb-16">
          <span className="inline-block text-xs sm:text-sm tracking-[0.3em] uppercase text-[#C5A880] font-medium">
            Maison de Haute Parfumerie & Sartorial Atelier
          </span>

          <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl lg:text-8xl text-[#FFFFFF] tracking-[0.06em] leading-[1.08] font-normal max-w-4xl mx-auto [text-wrap:balance]">
            L'Art de l'Élixir et du Noir
          </h1>

          <p className="text-sm sm:text-base md:text-lg text-[#D6D0C7] max-w-2xl mx-auto font-light leading-relaxed tracking-wide [text-wrap:balance]">
            An uncompromising sanctuary of rare olfactory macerations, architectural virgin wool draping, and bio-compatible cellular restorations.
          </p>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => {
                setSelectedCategorySlug(null);
                setCurrentPage('shop');
              }}
              className="w-full sm:w-auto px-8 py-3.5 bg-[#F0ECE8] text-[#000000] text-xs font-semibold tracking-[0.22em] uppercase hover:bg-white transition-colors cursor-pointer shadow-xl flex items-center justify-center gap-2"
            >
              <span>Explore The Collection</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => {
                setSelectedCategorySlug('fragrances');
                setCurrentPage('shop');
              }}
              className="w-full sm:w-auto px-8 py-3.5 border border-[#555] hover:border-white text-xs font-medium tracking-[0.22em] uppercase text-[#E0DBD3] hover:text-white transition-colors cursor-pointer"
            >
              Haute Parfumerie
            </button>
          </div>
        </div>
      </section>

      {/* 2. Three Brand Quality Hallmarks */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 py-10 border-y border-[#1F1F1F]">
          <div className="space-y-3 pr-4">
            <span className="font-mono text-xs text-[#C5A880] tracking-wider block">01</span>
            <h3 className="font-serif text-xl text-[#F0ECE8]">Rare Botanical Extractions</h3>
            <p className="text-xs text-[#8A857D] leading-relaxed">
              Macerated in Grasse over twelve lunar cycles utilizing unrefined wild Moroccan amber, Somalian frankincense tears, and Florentine orris butter.
            </p>
          </div>

          <div className="space-y-3 pr-4 md:border-l md:border-[#1F1F1F] md:pl-8">
            <span className="font-mono text-xs text-[#C5A880] tracking-wider block">02</span>
            <h3 className="font-serif text-xl text-[#F0ECE8]">Sartorial Architectural Precision</h3>
            <p className="text-xs text-[#8A857D] leading-relaxed">
              Hand-finished double-faced virgin wool and 22-momme Como silk garments tailored with internal floating canvas structures.
            </p>
          </div>

          <div className="space-y-3 pr-4 md:border-l md:border-[#1F1F1F] md:pl-8">
            <span className="font-mono text-xs text-[#C5A880] tracking-wider block">03</span>
            <h3 className="font-serif text-xl text-[#F0ECE8]">White Glove Bespoke Presentation</h3>
            <p className="text-xs text-[#8A857D] leading-relaxed">
              Every acquisition is enclosed in heavy black lacquered presentation cases, secured with wax seals, and delivered via tracked concierge courier.
            </p>
          </div>
        </div>
      </section>

      {/* 3. Welcome & Atelier Mission Section */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 text-center space-y-6">
        <span className="text-xs tracking-[0.3em] uppercase text-[#888] block">
          The Atelier Manifesto
        </span>
        <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-[#FFFFFF] tracking-wide leading-tight [text-wrap:balance]">
          "We do not create for the masses. We craft for the individual who views beauty as an intimate ceremony."
        </h2>
        <div className="w-12 h-px bg-[#C5A880] mx-auto mt-6" />
        <p className="text-sm sm:text-base text-[#9E988F] max-w-3xl mx-auto leading-relaxed pt-2 font-light">
          At ÉLIXIR & NOIR, luxury is defined not by excess, but by the quiet power of exceptional substance. Each formula is limited in production, respecting natural agricultural harvests and true artisanal patience.
        </p>
      </section>

      {/* 4. Category Showcase Cards */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b border-[#1A1A1A] pb-4 gap-2">
          <div>
            <span className="text-xs tracking-[0.25em] uppercase text-[#C5A880]">The Three Disciplines</span>
            <h2 className="font-serif text-3xl sm:text-4xl text-[#FFFFFF]">Curated Pillars</h2>
          </div>
          <button
            onClick={() => {
              setSelectedCategorySlug(null);
              setCurrentPage('shop');
            }}
            className="text-xs uppercase tracking-[0.18em] text-[#AAA] hover:text-white flex items-center gap-1.5 transition-colors cursor-pointer"
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
              className="group relative h-[480px] bg-[#0A0A0A] border border-[#222] overflow-hidden cursor-pointer"
            >
              <img
                src={cat.image}
                alt={cat.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105 opacity-80 group-hover:opacity-90"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
              
              <div className="absolute inset-x-0 bottom-0 p-8 space-y-2">
                <span className="text-[11px] tracking-[0.2em] uppercase text-[#C5A880] block">
                  Collection
                </span>
                <h3 className="font-serif text-2xl text-white group-hover:translate-x-1 transition-transform">
                  {cat.title}
                </h3>
                <p className="text-xs text-[#AAA] line-clamp-2 leading-relaxed">
                  {cat.subtitle}
                </p>
                <div className="pt-2 flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-white font-medium">
                  <span>Explore Formulation</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform text-[#C5A880]" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. Featured Creations Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b border-[#1A1A1A] pb-4 gap-2">
          <div>
            <span className="text-xs tracking-[0.25em] uppercase text-[#C5A880]">Curated Icons</span>
            <h2 className="font-serif text-3xl sm:text-4xl text-[#FFFFFF]">Featured Formulations</h2>
          </div>
          <button
            onClick={() => {
              setSelectedCategorySlug(null);
              setCurrentPage('shop');
            }}
            className="text-xs uppercase tracking-[0.18em] text-[#AAA] hover:text-white flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <span>All Catalog Creations</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* 6. Editorial Atelier Craft Banner */}
      <section className="bg-[#080808] border-y border-[#1F1F1F] py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-6 space-y-6">
              <span className="text-xs tracking-[0.3em] uppercase text-[#C5A880]">
                Sustainable Sourcing
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl text-[#FFFFFF] leading-snug">
                Extracted with reverence for raw botanical integrity.
              </h2>
              <p className="text-sm text-[#9E988F] leading-relaxed">
                We reject industrial mass compounding. Every bottle of our Haute Parfumerie is hand-poured in numbered small batches. Our skincare elixirs utilize cold-pressed seed oils with zero chemical emulsifiers or synthetic preservatives.
              </p>
              <div className="pt-2 flex items-center gap-8 text-xs tracking-wider uppercase text-[#B5B0A8]">
                <div>
                  <span className="block font-mono text-lg text-white text-bold">100%</span>
                  <span>Pure Extractions</span>
                </div>
                <div className="h-8 w-px bg-[#262626]" />
                <div>
                  <span className="block font-mono text-lg text-white text-bold">24-30%</span>
                  <span>Maceration Strength</span>
                </div>
                <div className="h-8 w-px bg-[#262626]" />
                <div>
                  <span className="block font-mono text-lg text-white text-bold">Zero</span>
                  <span>Synthetic Dyes</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-6">
              <div className="aspect-[4/3] bg-[#141414] border border-[#2B2B2B] overflow-hidden">
                <img
                  src="/src/assets/images/category_fragrances_1791824720667.jpg"
                  alt="Atelier Craftsmanship"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Bestselling Products */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b border-[#1A1A1A] pb-4 gap-2">
          <div>
            <span className="text-xs tracking-[0.25em] uppercase text-[#C5A880]">Permanent Collection</span>
            <h2 className="font-serif text-3xl sm:text-4xl text-[#FFFFFF]">Atelier Bestsellers</h2>
          </div>
          <button
            onClick={() => {
              setSelectedCategorySlug(null);
              setCurrentPage('shop');
            }}
            className="text-xs uppercase tracking-[0.18em] text-[#AAA] hover:text-white flex items-center gap-1.5 transition-colors cursor-pointer"
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

      {/* 8. Connoisseur Endorsements / Customer Reviews */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="border border-[#1F1F1F] bg-[#0A0A0A] p-8 sm:p-14 space-y-10">
          <div className="text-center space-y-2">
            <span className="text-xs tracking-[0.25em] uppercase text-[#C5A880]">
              The Connoisseur Circle
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl text-white">
              Endorsements of Refinement
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-xs text-[#9E988F]">
            <div className="space-y-4 p-6 bg-[#0E0E0E] border border-[#1A1A1A]">
              <p className="font-serif text-base text-[#F0ECE8] italic leading-relaxed">
                "Nocturne Ambré represents the pinnacle of contemporary niche fragrance. The smoky plum transition into royal amber lasts indefinitely on cashmere."
              </p>
              <div className="pt-2 border-t border-[#1F1F1F]">
                <p className="font-medium text-white">Eleanor Vance</p>
                <p className="text-[11px] text-[#666]">Collector, Mumbai</p>
              </div>
            </div>

            <div className="space-y-4 p-6 bg-[#0E0E0E] border border-[#1A1A1A]">
              <p className="font-serif text-base text-[#F0ECE8] italic leading-relaxed">
                "The double-faced obsidian overcoat is sculpted with Savile Row precision yet carries an effortless Parisian ease. An heirloom garment."
              </p>
              <div className="pt-2 border-t border-[#1F1F1F]">
                <p className="font-medium text-white">Julian Montagu</p>
                <p className="text-[11px] text-[#666]">Architectural Critic, London</p>
              </div>
            </div>

            <div className="space-y-4 p-6 bg-[#0E0E0E] border border-[#1A1A1A]">
              <p className="font-serif text-base text-[#F0ECE8] italic leading-relaxed">
                "The botanical restorative serum and obsidian sculpting stone transformed my evening ritual. Deeply hydrating without any residual sheen."
              </p>
              <div className="pt-2 border-t border-[#1F1F1F]">
                <p className="font-medium text-white">Aria Thorne</p>
                <p className="text-[11px] text-[#666]">Creative Director, New Delhi</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
