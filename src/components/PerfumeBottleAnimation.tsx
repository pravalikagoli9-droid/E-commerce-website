import React, { useState, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { ArrowRight, RotateCcw, Sparkles, Wind, Eye } from 'lucide-react';

interface PerfumeBottleAnimationProps {
  onExploreCampaigns?: () => void;
  className?: string;
}

/**
 * PerfumeBottleAnimation Component
 *
 * Cinematic CSS-based animation of a luxury VELMORA Extrait de Parfum flacon.
 * Features:
 *  1. Semantic HTML5 tags (<section>, <figure>, <figcaption>, <header>, <article>, <button>)
 *  2. CSS3 keyframe animations for bottle appearance, vertical cap lifting, and delicate fragrance mist
 *  3. Interactive controls: Replay animation, Atomize fragrance spray, toggle reduced motion
 *  4. VELMORA Luxury Palette: Mocha Brown (#5A3E36, #30231F), Champagne Gold (#D6B77A, #ECCF96),
 *     Warm Ivory (#FFFDF8, #FAF7F2), and Muted Olive Green (#78866B)
 *  5. Bootstrap 5 responsive grid & layout classes seamlessly composed with custom CSS
 */
export const PerfumeBottleAnimation: React.FC<PerfumeBottleAnimationProps> = ({
  onExploreCampaigns,
  className = ''
}) => {
  const { setCurrentPage, setSelectedCategorySlug } = useStore();

  // Animation sequence states
  // 0: Preparing
  // 1: Bottle Appearance (fade-in, gentle scale-up, glass light reflection sheen)
  // 2: Cap Vertical Lift (lifts cleanly off the neck)
  // 3: Fragrance Mist (translucent delicate vapor rising)
  // 4: Brand & CTAs Reveal
  const [animStage, setAnimStage] = useState<number>(0);
  const [manualSprayActive, setManualSprayActive] = useState<boolean>(false);
  const [sprayCycle, setSprayCycle] = useState<number>(0);
  const [isReducedMotion, setIsReducedMotion] = useState<boolean>(false);

  // Detect user's reduced-motion OS accessibility preference
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setIsReducedMotion(mq.matches);

    const listener = (e: MediaQueryListEvent) => setIsReducedMotion(e.matches);
    mq.addEventListener('change', listener);
    return () => mq.removeEventListener('change', listener);
  }, []);

  // Orchestrate the cinematic sequence
  useEffect(() => {
    if (isReducedMotion) {
      setAnimStage(4);
      return;
    }

    // Sequence timeline:
    // T+120ms: Bottle emerges
    const t1 = setTimeout(() => setAnimStage(1), 120);
    // T+1300ms: Cap lifts vertically
    const t2 = setTimeout(() => setAnimStage(2), 1300);
    // T+2100ms: Mist rises gently
    const t3 = setTimeout(() => setAnimStage(3), 2100);
    // T+2900ms: Luxury text and CTAs reveal
    const t4 = setTimeout(() => setAnimStage(4), 2900);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, [isReducedMotion]);

  // Replay animation sequence
  const handleReplay = () => {
    setAnimStage(0);
    setManualSprayActive(false);
    setTimeout(() => {
      setAnimStage(1);
      setTimeout(() => setAnimStage(2), 1200);
      setTimeout(() => setAnimStage(3), 2000);
      setTimeout(() => setAnimStage(4), 2800);
    }, 100);
  };

  // Trigger mist spray manually
  const handleSpray = () => {
    setSprayCycle(c => c + 1);
    setManualSprayActive(true);
    setTimeout(() => setManualSprayActive(false), 2400);
  };

  // Navigations
  const handleShopFragrances = () => {
    setSelectedCategorySlug('fragrances');
    setCurrentPage('shop');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleShopAll = () => {
    setSelectedCategorySlug(null);
    setCurrentPage('shop');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <section
      aria-label="VELMORA Haute Parfumerie Cinematic Showcase"
      className={`relative min-h-[92vh] sm:min-h-[96vh] flex items-center justify-center overflow-hidden bg-[#241B18] text-[#FAF7F2] py-12 px-4 sm:px-6 ${className}`}
    >
      {/* Embedded CSS3 Keyframes & Component Rules */}
      <style>{`
        @keyframes velmoraBottleEnter {
          0% {
            opacity: 0;
            transform: scale(0.92) translateY(18px);
          }
          100% {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }

        @keyframes velmoraCapLift {
          0% {
            opacity: 1;
            transform: translate(-50%, 0);
          }
          65% {
            transform: translate(-50%, -64px);
          }
          82% {
            transform: translate(-50%, -58px);
          }
          100% {
            opacity: 1;
            transform: translate(-50%, -62px);
          }
        }

        @keyframes velmoraMistRise {
          0% {
            opacity: 0;
            transform: scale(0.3) translateY(5px);
          }
          30% {
            opacity: 0.8;
            transform: scale(1.3) translateY(-40px);
          }
          70% {
            opacity: 0.35;
            transform: scale(2.2) translateY(-90px);
          }
          100% {
            opacity: 0;
            transform: scale(2.8) translateY(-135px);
          }
        }

        @keyframes velmoraSheenSweep {
          0% {
            transform: translateX(-140%) skewX(-25deg);
            opacity: 0;
          }
          40% {
            opacity: 0.85;
          }
          100% {
            transform: translateX(200%) skewX(-25deg);
            opacity: 0;
          }
        }

        @keyframes velmoraParticleDrift {
          0% {
            opacity: 0;
            transform: translate(0, 0) scale(0.5);
          }
          40% {
            opacity: 0.9;
          }
          100% {
            opacity: 0;
            transform: translate(var(--drift-x, 0px), var(--drift-y, -90px)) scale(1.2);
          }
        }

        @keyframes velmoraPedestalPulse {
          0%, 100% {
            opacity: 0.35;
            transform: translateX(-50%) scale(1);
          }
          50% {
            opacity: 0.45;
            transform: translateX(-50%) scale(1.04);
          }
        }

        .bottle-animating-enter {
          animation: velmoraBottleEnter 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        .cap-animating-lift {
          animation: velmoraCapLift 1.35s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        .sheen-sweeping {
          animation: velmoraSheenSweep 1.5s cubic-bezier(0.4, 0, 0.2, 1) 0.6s forwards;
        }

        .mist-plume-anim {
          animation: velmoraMistRise 2.2s cubic-bezier(0.2, 0.8, 0.4, 1) forwards;
        }

        .pedestal-glow {
          animation: velmoraPedestalPulse 6s ease-in-out infinite;
        }
      `}</style>

      {/* 1. Cinematic Studio Atmosphere (Lighting, Reflections, Floor Pedestal) */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        {/* Soft Radial Center Studio Spotlight */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[720px] sm:w-[980px] h-[720px] sm:h-[980px] rounded-full opacity-40 blur-[130px]"
          style={{
            background: 'radial-gradient(circle, #D6B77A 0%, #5A3E36 45%, #241B18 75%)'
          }}
        />

        {/* Ambient Top Key Light */}
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[520px] h-[360px] opacity-25 blur-[90px]"
          style={{
            background: 'radial-gradient(ellipse at top, #FFFDF8 0%, #D6B77A 50%, transparent 80%)'
          }}
        />

        {/* Studio Vignette Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#241B18]/70 via-transparent to-[#241B18]/90" />

        {/* Studio Pedestal Floor Glow */}
        <div
          className="pedestal-glow absolute bottom-[9%] left-1/2 -translate-x-1/2 w-[600px] sm:w-[820px] h-[130px] rounded-[100%] blur-[26px]"
          style={{
            background: 'radial-gradient(ellipse, #D6B77A 0%, #30231F 60%, transparent 80%)'
          }}
        />
      </div>

      {/* 2. Main Content Container using Bootstrap 5 Grid for semantic responsive layout */}
      <div className="container relative z-10 max-w-6xl mx-auto">
        <div className="row align-items-center justify-content-center gy-5">

          {/* LEFT/TOP COLUMN: The Luxury Perfume Bottle with Vertical Cap Lifting & Fragrance Mist */}
          <div className="col-12 col-lg-6 d-flex flex-column align-items-center justify-content-center text-center">
            
            {/* Semantic Figure Container for the Flacon and Opening Animation */}
            <figure 
              className="relative w-[280px] sm:w-[320px] h-[450px] sm:h-[490px] flex items-center justify-center m-0 p-0"
              role="img"
              aria-label="Cinematic 3D-styled animation of the VELMORA smoked crystal perfume bottle opening with rising fragrance mist"
            >
              {/* Floor Shadow beneath flacon */}
              <div
                className={`absolute bottom-11 left-1/2 -translate-x-1/2 w-[180px] sm:w-[210px] h-[22px] rounded-full blur-[10px] bg-black/80 pointer-events-none transition-all duration-1000 ${
                  animStage >= 1 ? 'opacity-70 scale-100' : 'opacity-0 scale-75'
                }`}
                aria-hidden="true"
              />

              {/* BOTTLE BODY & NECK ASSEMBLY */}
              <div
                className={`relative z-10 flex flex-col items-center transition-all duration-1000 ${
                  animStage >= 1 ? 'bottle-animating-enter opacity-100' : 'opacity-0 scale-95 translate-y-4'
                }`}
              >
                {/* 1. Golden Atomiser Collar & Spray Nozzle (Stays firmly on bottle neck) */}
                <header className="relative flex flex-col items-center z-10 mb-[-1px]">
                  {/* Fine Spray Aperture Tip */}
                  <div className="w-1.5 h-1.5 rounded-full bg-[#30231F] border border-[#D6B77A] z-20 mb-[-2px] shadow-sm" />

                  {/* Cylindrical Gold Spray Pump Nozzle */}
                  <div
                    className="w-5 h-6 rounded-t-sm shadow-sm relative overflow-hidden"
                    style={{
                      background: 'linear-gradient(90deg, #9C7D46 0%, #ECCF96 35%, #FFFDF8 50%, #ECCF96 65%, #8A6E3B 100%)',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.5)'
                    }}
                  >
                    {/* Metallic specular streak */}
                    <div className="absolute inset-y-0 left-1/3 w-1 bg-white/40 blur-[0.5px]" />
                  </div>

                  {/* Threaded Collar Ring with Diamond Knurling Texture */}
                  <div
                    className="w-10 h-4 rounded-sm relative overflow-hidden border-t border-b border-[#ECCF96]/50 shadow-md"
                    style={{
                      background: 'linear-gradient(90deg, #7A5F32 0%, #D6B77A 25%, #FFF7E6 50%, #D6B77A 75%, #594420 100%)'
                    }}
                  >
                    <div className="absolute inset-0 opacity-30 bg-[repeating-linear-gradient(90deg,#000,#000_1px,transparent_1px,transparent_3px)]" />
                  </div>
                </header>

                {/* 2. Heavy Smoked Crystal Flacon (Main Bottle Body) */}
                <article
                  className="relative w-[170px] sm:w-[190px] h-[230px] sm:h-[250px] rounded-b-2xl rounded-t-md overflow-hidden shadow-2xl backdrop-blur-md"
                  style={{
                    background: 'linear-gradient(180deg, rgba(62, 44, 38, 0.88) 0%, rgba(35, 24, 21, 0.96) 100%)',
                    border: '1.5px solid rgba(214, 183, 122, 0.35)',
                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.75), inset 0 0 20px rgba(214, 183, 122, 0.15)'
                  }}
                >
                  {/* Thick Crystal Wall Refraction Bevels */}
                  <div className="absolute inset-y-0 left-0 w-3 bg-gradient-to-r from-white/20 via-white/5 to-transparent pointer-events-none" />
                  <div className="absolute inset-y-0 right-0 w-3 bg-gradient-to-l from-white/20 via-white/5 to-transparent pointer-events-none" />

                  {/* Heavy Solid Crystal Base */}
                  <div
                    className="absolute bottom-0 inset-x-0 h-10 border-t border-[#D6B77A]/20 pointer-events-none"
                    style={{
                      background: 'linear-gradient(180deg, rgba(214, 183, 122, 0.08) 0%, rgba(255, 255, 255, 0.15) 80%, rgba(214, 183, 122, 0.25) 100%)'
                    }}
                  >
                    <div className="absolute bottom-2 left-4 right-4 h-[1px] bg-white/40" />
                  </div>

                  {/* Liquid Nectar Chamber */}
                  <div className="absolute bottom-10 left-3 right-3 top-4 rounded-b-lg overflow-hidden flex flex-col justify-end">
                    <div
                      className="w-full h-[82%] relative"
                      style={{
                        background: 'linear-gradient(180deg, #D6B77A 0%, #9E743A 40%, #5A3E36 100%)',
                        boxShadow: 'inset 0 4px 12px rgba(255, 245, 220, 0.4)'
                      }}
                    >
                      {/* Fluid Meniscus Curve */}
                      <div className="absolute -top-1.5 inset-x-0 h-3 rounded-[50%] bg-[#ECCF96] opacity-90 blur-[0.5px]" />
                      
                      {/* Internal Caustic Ray */}
                      <div
                        className="absolute inset-y-0 left-1/4 w-12 opacity-35 blur-[3px] transform -skew-x-12"
                        style={{
                          background: 'linear-gradient(90deg, transparent, #FFFDF8, transparent)'
                        }}
                      />
                    </div>
                  </div>

                  {/* Glass Light Reflection Sheen Beam (Sweeps across the flacon on entrance) */}
                  <div
                    className={`absolute inset-y-0 w-24 transform -skew-x-25 pointer-events-none ${
                      animStage >= 1 ? 'sheen-sweeping' : 'opacity-0'
                    }`}
                    style={{
                      background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.45) 50%, transparent 100%)'
                    }}
                  />

                  {/* FRONT LABEL: Embossed Warm Ivory & Champagne Gold Plaque */}
                  <figcaption className="absolute top-[42%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[116px] sm:w-[128px] py-4 px-2 bg-[#FFFDF8] text-[#30231F] rounded-sm shadow-lg border border-[#D6B77A] flex flex-col items-center justify-center text-center">
                    <span className="text-[7px] tracking-[0.3em] uppercase text-[#78866B] font-semibold mb-0.5">
                      Haute Parfumerie
                    </span>
                    <strong className="font-serif text-base sm:text-lg font-bold tracking-[0.24em] text-[#30231F] leading-tight mb-0.5">
                      VELMORA
                    </strong>
                    <div className="w-8 h-[1px] bg-[#D6B77A] my-1" />
                    <span className="text-[7.5px] tracking-[0.2em] uppercase text-[#5A3E36] font-medium">
                      Extrait De Parfum
                    </span>
                    <span className="text-[6.5px] tracking-[0.16em] uppercase text-[#8B736B] font-mono mt-0.5">
                      Paris · 50 ml
                    </span>
                  </figcaption>
                </article>
              </div>

              {/* 3. LUXURY CAP (Animates Vertically Off The Bottle Neck) */}
              <div
                className={`absolute z-20 flex flex-col items-center pointer-events-none transition-all ${
                  animStage >= 2 ? (isReducedMotion ? 'opacity-100' : 'cap-animating-lift opacity-100') : animStage >= 1 ? 'opacity-100 translate-x-[-50%]' : 'opacity-0'
                }`}
                style={{
                  top: '64px',
                  left: '50%',
                  transform: animStage < 2 ? 'translateX(-50%)' : undefined
                }}
              >
                {/* Faceted Smoked Crystal Cap with Champagne Gold Base */}
                <div
                  className="w-14 sm:w-16 h-14 sm:h-16 rounded-md relative overflow-hidden shadow-2xl"
                  style={{
                    background: 'linear-gradient(135deg, #4A332C 0%, #291D1A 60%, #17100E 100%)',
                    border: '1.5px solid rgba(214, 183, 122, 0.65)',
                    boxShadow: '0 12px 30px rgba(0,0,0,0.8), inset 0 0 10px rgba(214,183,122,0.3)'
                  }}
                >
                  <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_45%,rgba(255,255,255,0.25)_50%,transparent_55%)]" />
                  <div className="absolute top-0 inset-x-0 h-3 bg-gradient-to-b from-white/30 to-transparent" />

                  {/* Monogram Crest on Cap Top */}
                  <div className="absolute top-2 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full border border-[#D6B77A]/70 flex items-center justify-center">
                    <span className="font-serif text-[8px] font-bold text-[#D6B77A]">V</span>
                  </div>

                  {/* Polished Gold Cap Base Ring */}
                  <div
                    className="absolute bottom-0 inset-x-0 h-3 border-t border-[#ECCF96]/40"
                    style={{
                      background: 'linear-gradient(90deg, #7A5F32 0%, #D6B77A 30%, #FFFDF8 50%, #D6B77A 70%, #594420 100%)'
                    }}
                  />
                </div>
              </div>

              {/* 4. TRANSLUCENT FRAGRANCE MIST & DELICATE ATOMIZED PARTICLES */}
              {(animStage >= 3 || manualSprayActive) && (
                <div
                  key={`mist-vapor-${sprayCycle}`}
                  className="absolute z-15 pointer-events-none flex flex-col items-center"
                  style={{
                    top: '75px',
                    left: '50%',
                    transform: 'translateX(-50%)'
                  }}
                  aria-hidden="true"
                >
                  {/* Primary Soft Vapor Plume */}
                  <div
                    className="mist-plume-anim w-16 h-20 rounded-full blur-[14px]"
                    style={{
                      background: 'radial-gradient(ellipse at center, rgba(236, 207, 150, 0.65) 0%, rgba(214, 183, 122, 0.25) 50%, transparent 80%)'
                    }}
                  />

                  {/* Secondary Expanding Golden Mist Ring */}
                  <div
                    className="mist-plume-anim absolute top-0 w-12 h-16 rounded-full blur-[11px]"
                    style={{
                      background: 'radial-gradient(circle, rgba(255, 253, 248, 0.75) 0%, rgba(214, 183, 122, 0.2) 60%, transparent 80%)',
                      animationDelay: '0.15s'
                    }}
                  />

                  {/* Subtle atomized gold micro-droplets */}
                  {[
                    { x: '-28px', y: '-80px', d: '0.05s', s: 4 },
                    { x: '32px', y: '-95px', d: '0.12s', s: 3 },
                    { x: '-14px', y: '-120px', d: '0.2s', s: 5 },
                    { x: '18px', y: '-135px', d: '0.28s', s: 3 },
                    { x: '-36px', y: '-145px', d: '0.35s', s: 4 }
                  ].map((p, idx) => (
                    <div
                      key={idx}
                      className="absolute rounded-full bg-[#FFFDF8] blur-[0.5px]"
                      style={
                        {
                          width: `${p.s}px`,
                          height: `${p.s}px`,
                          boxShadow: '0 0 6px rgba(214, 183, 122, 0.8)',
                          animation: `velmoraParticleDrift 2.1s ease-out ${p.d} forwards`,
                          '--drift-x': p.x,
                          '--drift-y': p.y
                        } as React.CSSProperties
                      }
                    />
                  ))}
                </div>
              )}
            </figure>

            {/* Interactive Flacon Utility Controls */}
            <div className="d-flex align-items-center justify-content-center gap-2 mt-4 pt-2">
              <button
                type="button"
                onClick={handleReplay}
                className="btn btn-sm text-[#FAF7F2] border border-[#D6B77A]/40 hover:border-[#D6B77A] bg-[#30231F]/60 hover:bg-[#30231F] rounded-pill px-3 py-1.5 text-xs font-sans tracking-wider d-flex align-items-center gap-1.5 transition-all cursor-pointer shadow-sm"
                title="Replay cinematic bottle opening animation"
                aria-label="Replay perfume bottle opening animation"
              >
                <RotateCcw className="w-3.5 h-3.5 text-[#D6B77A]" />
                <span>Replay Animation</span>
              </button>

              <button
                type="button"
                onClick={handleSpray}
                className="btn btn-sm text-[#FAF7F2] border border-[#D6B77A]/40 hover:border-[#D6B77A] bg-[#30231F]/60 hover:bg-[#30231F] rounded-pill px-3 py-1.5 text-xs font-sans tracking-wider d-flex align-items-center gap-1.5 transition-all cursor-pointer shadow-sm"
                title="Atomize fragrance mist"
                aria-label="Atomize fragrance mist"
              >
                <Wind className="w-3.5 h-3.5 text-[#ECCF96]" />
                <span>Atomize Mist</span>
              </button>

              {onExploreCampaigns && (
                <button
                  type="button"
                  onClick={onExploreCampaigns}
                  className="btn btn-sm text-[#ECCF96] border border-[#D6B77A]/40 hover:border-[#D6B77A] bg-[#30231F]/60 hover:bg-[#30231F] rounded-pill px-3 py-1.5 text-xs font-sans tracking-wider d-flex align-items-center gap-1.5 transition-all cursor-pointer shadow-sm"
                  title="Explore campaign slides"
                  aria-label="Explore campaign slides"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Campaign Slides</span>
                </button>
              )}
            </div>

            {/* Perfume Note Accords Pill */}
            <div className="mt-3 flex items-center justify-center gap-2 text-[10px] tracking-[0.2em] uppercase text-[#D6B77A]/80 font-mono">
              <span>Amber Resins</span>
              <span className="w-1 h-1 rounded-full bg-[#D6B77A]/40" />
              <span>Florentine Orris</span>
              <span className="w-1 h-1 rounded-full bg-[#D6B77A]/40" />
              <span>Smoked Cedar</span>
            </div>
          </div>

          {/* RIGHT/BOTTOM COLUMN: Brand Reveal, Tagline & Action Callouts */}
          <div className="col-12 col-lg-6 text-center text-lg-start d-flex flex-column align-items-center align-items-lg-start">
            
            {/* Stage Indicator Pill */}
            <div
              className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#30231F]/80 border border-[#D6B77A]/40 text-[#D6B77A] text-[11px] tracking-[0.24em] uppercase font-sans mb-4 shadow-sm transition-all duration-700 ${
                animStage >= 1 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
              }`}
            >
              <Sparkles className="w-3 h-3 text-[#D6B77A]" />
              <span>Haute Parfumerie & Botanical Art</span>
            </div>

            {/* VELMORA Brand Name Reveal */}
            <h1
              className={`font-serif text-4xl sm:text-5xl lg:text-6xl tracking-[0.22em] text-[#FAF7F2] font-normal leading-tight mb-3 transition-all duration-1000 ${
                animStage >= 4 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
            >
              VELMORA
            </h1>

            {/* Tagline */}
            <h2
              className={`text-xs sm:text-sm font-sans tracking-[0.34em] uppercase text-[#D6B77A] font-medium mb-6 transition-all duration-1000 delay-150 ${
                animStage >= 4 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
            >
              BEAUTY IN EVERY DETAIL
            </h2>

            {/* Editorial Narrative */}
            <p
              className={`text-[#FAF7F2]/85 text-sm sm:text-base leading-relaxed max-w-lg font-light mb-8 transition-all duration-1000 delay-300 ${
                animStage >= 4 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
            >
              Cold-macerated wild amber, Somalian frankincense tears, and four-year-aged Florentine orris butter. 
              Bottled in smoked crystal flacons engineered to release fragrance in a luminous, microscopic suspension.
            </p>

            {/* 6. CALL TO ACTION BUTTONS (Shop Fragrances & Shop All Products) */}
            <div
              className={`d-flex flex-wrap gap-3.5 justify-content-center justify-content-lg-start w-100 transition-all duration-1000 delay-500 ${
                animStage >= 4 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
            >
              <button
                type="button"
                onClick={handleShopFragrances}
                className="btn px-6 py-3.5 bg-[#D6B77A] hover:bg-[#ECCF96] text-[#241B18] font-sans text-xs tracking-[0.22em] uppercase font-bold rounded-sm shadow-lg transition-all duration-300 d-inline-flex align-items-center justify-content-center gap-2 cursor-pointer border-0"
              >
                <span>SHOP FRAGRANCES</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={handleShopAll}
                className="btn px-6 py-3.5 bg-transparent hover:bg-[#FAF7F2]/10 text-[#FAF7F2] border border-[#D6B77A] font-sans text-xs tracking-[0.22em] uppercase font-medium rounded-sm transition-all duration-300 d-inline-flex align-items-center justify-content-center gap-2 cursor-pointer"
              >
                <span>SHOP ALL PRODUCTS</span>
              </button>
            </div>

            {/* Luxury Provenance Badges (Bootstrap Flex row) */}
            <div
              className={`mt-8 pt-6 border-t border-[#D6B77A]/25 d-flex flex-wrap align-items-center gap-4 text-[11px] tracking-[0.16em] uppercase text-[#FAF7F2]/70 font-mono transition-all duration-1000 delay-700 ${
                animStage >= 4 ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <div className="d-flex align-items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#D6B77A]" />
                <span>Grasse Maceration</span>
              </div>
              <div className="d-flex align-items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#78866B]" />
                <span>Zero Synthetics</span>
              </div>
              <div className="d-flex align-items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#D6B77A]" />
                <span>Refillable Crystal</span>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};
