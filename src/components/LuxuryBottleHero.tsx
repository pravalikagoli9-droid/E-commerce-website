import React, { useState, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { ArrowRight, RotateCcw, Sparkles, Wind, Eye } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface LuxuryBottleHeroProps {
  onSwitchToSlides?: () => void;
}

export const LuxuryBottleHero: React.FC<LuxuryBottleHeroProps> = ({ onSwitchToSlides }) => {
  const { setCurrentPage, setSelectedCategorySlug } = useStore();

  // Animation sequence states
  // 0: Initializing (invisible/preparing)
  // 1: Bottle Appearance (fade-in, gentle scale-up, glass light reflection sheen)
  // 2: Cap Opening (cap smoothly lifts vertically off the neck)
  // 3: Fragrance Mist (translucent vapor & delicate particles drift upward)
  // 4: Luxury Reveal (VELMORA brand, tagline, and action buttons reveal)
  const [stage, setStage] = useState<number>(0);
  const [mistPuffActive, setMistPuffActive] = useState<boolean>(false);
  const [sprayCount, setSprayCount] = useState<number>(0);
  const [isReducedMotion, setIsReducedMotion] = useState<boolean>(false);

  // Check user preference for reduced motion
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setIsReducedMotion(mediaQuery.matches);

    const handler = (e: MediaQueryListEvent) => setIsReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  // Orchestrate the cinematic sequence
  useEffect(() => {
    if (isReducedMotion) {
      // Skip straight to the revealed state
      setStage(4);
      return;
    }

    // Sequence timing
    // T+100ms: Bottle begins appearance
    const t1 = setTimeout(() => setStage(1), 100);
    // T+1400ms: Cap smoothly lifts
    const t2 = setTimeout(() => setStage(2), 1400);
    // T+2200ms: Mist begins rising
    const t3 = setTimeout(() => {
      setStage(3);
      setMistPuffActive(true);
    }, 2200);
    // T+3000ms: Luxury text and CTAs reveal
    const t4 = setTimeout(() => setStage(4), 3000);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, [isReducedMotion]);

  // Handle replay
  const handleReplay = () => {
    setStage(0);
    setMistPuffActive(false);
    setTimeout(() => {
      setStage(1);
      setTimeout(() => setStage(2), 1300);
      setTimeout(() => {
        setStage(3);
        setMistPuffActive(true);
      }, 2100);
      setTimeout(() => setStage(4), 2900);
    }, 150);
  };

  // Trigger manual spray mist
  const handleSpray = () => {
    setSprayCount(prev => prev + 1);
    setMistPuffActive(true);
    setTimeout(() => {
      setMistPuffActive(false);
    }, 2600);
  };

  // Navigation handlers
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
      aria-label="VELMORA Haute Parfumerie Showcase"
      className="relative min-h-[92vh] sm:min-h-[95vh] flex items-center justify-center overflow-hidden bg-[#241B18] text-[#FAF7F2] py-12 px-4 sm:px-6"
    >
      {/* 1. Cinematic Studio Background Lighting & Shadows */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Soft Radial Center Spotlight */}
        <div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] sm:w-[950px] h-[700px] sm:h-[950px] rounded-full opacity-40 blur-[120px]"
          style={{
            background: 'radial-gradient(circle, #D6B77A 0%, #5A3E36 45%, #241B18 75%)'
          }}
        />

        {/* Ambient Top Studio Light Beam */}
        <div 
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[350px] opacity-25 blur-[90px]"
          style={{
            background: 'radial-gradient(ellipse at top, #FFFDF8 0%, #D6B77A 50%, transparent 80%)'
          }}
        />

        {/* Subtle Ambient Vignette Scrim */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#241B18]/70 via-transparent to-[#241B18]/90" />

        {/* Studio Pedestal Floor Reflection Surface */}
        <div 
          className="absolute bottom-[10%] left-1/2 -translate-x-1/2 w-[600px] sm:w-[800px] h-[120px] rounded-[100%] opacity-35 blur-[25px]"
          style={{
            background: 'radial-gradient(ellipse, #D6B77A 0%, #30231F 60%, transparent 80%)'
          }}
        />
      </div>

      {/* 2. Main Content Container using Bootstrap 5 Grid for semantic responsive layout */}
      <div className="container relative z-10 max-w-6xl mx-auto">
        <div className="row align-items-center justify-content-center gy-5">
          
          {/* LEFT/CENTER COLUMN: The Luxury Perfume Bottle with Vertical Cap Lifting & Fragrance Mist */}
          <div className="col-12 col-lg-6 d-flex flex-column align-items-center justify-content-center text-center">
            
            {/* Perfume Bottle Stage Container */}
            <div className="relative w-[280px] sm:w-[320px] h-[440px] sm:h-[480px] flex items-center justify-center">

              {/* Floor Shadow beneath the bottle */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ 
                  opacity: stage >= 1 ? 0.6 : 0, 
                  scale: stage >= 1 ? 1 : 0.8 
                }}
                transition={{ duration: 1.2, ease: 'easeOut' }}
                className="absolute bottom-12 left-1/2 -translate-x-1/2 w-[180px] sm:w-[210px] h-[22px] rounded-full blur-[10px] bg-black/80 pointer-events-none"
              />

              {/* BOTTLE BODY & NECK ASSEMBLY */}
              <motion.div
                initial={{ opacity: 0, scale: 0.92, y: 16 }}
                animate={{ 
                  opacity: stage >= 1 ? 1 : 0, 
                  scale: stage >= 1 ? 1 : 0.92,
                  y: stage >= 1 ? 0 : 16
                }}
                transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                className="relative z-10 flex flex-col items-center"
              >
                {/* 1. Golden Atomiser Collar & Nozzle (Stays on bottle neck) */}
                <div className="relative flex flex-col items-center z-10 mb-[-1px]">
                  {/* Fine Spray Aperture Tip */}
                  <div className="w-1.5 h-1.5 rounded-full bg-[#30231F] border border-[#D6B77A] z-20 mb-[-2px] shadow-sm" />
                  
                  {/* Cylindrical Spray Pump Nozzle */}
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
                    {/* Knurled horizontal micro-ridges */}
                    <div className="absolute inset-0 opacity-30 bg-[repeating-linear-gradient(90deg,#000,#000_1px,transparent_1px,transparent_3px)]" />
                  </div>
                </div>

                {/* 2. Heavy Smoked Crystal Flacon (Main Bottle Body) */}
                <div 
                  className="relative w-[170px] sm:w-[190px] h-[230px] sm:h-[250px] rounded-b-2xl rounded-t-md overflow-hidden shadow-2xl backdrop-blur-md"
                  style={{
                    background: 'linear-gradient(180deg, rgba(62, 44, 38, 0.85) 0%, rgba(35, 24, 21, 0.95) 100%)',
                    border: '1.5px solid rgba(214, 183, 122, 0.35)',
                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.75), inset 0 0 20px rgba(214, 183, 122, 0.15)'
                  }}
                >
                  {/* Glass Outer Wall Refraction (Thick crystal side bevels) */}
                  <div className="absolute inset-y-0 left-0 w-3 bg-gradient-to-r from-white/20 via-white/5 to-transparent pointer-events-none" />
                  <div className="absolute inset-y-0 right-0 w-3 bg-gradient-to-l from-white/20 via-white/5 to-transparent pointer-events-none" />
                  
                  {/* Thick Solid Crystal Bottom Base */}
                  <div 
                    className="absolute bottom-0 inset-x-0 h-10 border-t border-[#D6B77A]/20 pointer-events-none"
                    style={{
                      background: 'linear-gradient(180deg, rgba(214, 183, 122, 0.08) 0%, rgba(255, 255, 255, 0.15) 80%, rgba(214, 183, 122, 0.25) 100%)'
                    }}
                  >
                    {/* Internal base bevel reflections */}
                    <div className="absolute bottom-2 left-4 right-4 h-[1px] bg-white/40" />
                  </div>

                  {/* Internal Fragrance Nectar Chamber & Liquid Glow */}
                  <div 
                    className="absolute bottom-10 left-3 right-3 top-4 rounded-b-lg overflow-hidden flex flex-col justify-end"
                  >
                    {/* Golden Liquid Nectar with Meniscus */}
                    <div 
                      className="w-full h-[82%] relative"
                      style={{
                        background: 'linear-gradient(180deg, #D6B77A 0%, #9E743A 40%, #5A3E36 100%)',
                        boxShadow: 'inset 0 4px 12px rgba(255, 245, 220, 0.4)'
                      }}
                    >
                      {/* Gentle Liquid Meniscus Surface */}
                      <div className="absolute -top-1.5 inset-x-0 h-3 rounded-[50%] bg-[#ECCF96] opacity-90 blur-[0.5px]" />
                      
                      {/* Internal Caustic Light Ray */}
                      <div 
                        className="absolute inset-y-0 left-1/4 w-12 opacity-35 blur-[3px] transform -skew-x-12"
                        style={{
                          background: 'linear-gradient(90deg, transparent, #FFFDF8, transparent)'
                        }}
                      />
                    </div>
                  </div>

                  {/* Glass Reflection Sheen Beam (Sweeps across the flacon) */}
                  <motion.div
                    initial={{ x: '-150%', opacity: 0 }}
                    animate={{ 
                      x: stage >= 1 ? ['-150%', '200%'] : '-150%',
                      opacity: stage >= 1 ? [0, 0.8, 0] : 0
                    }}
                    transition={{
                      delay: 0.6,
                      duration: 1.4,
                      ease: 'easeInOut'
                    }}
                    className="absolute inset-y-0 w-24 transform -skew-x-25 pointer-events-none"
                    style={{
                      background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.4) 50%, transparent 100%)'
                    }}
                  />

                  {/* FRONT LABEL: Embossed Ivory & Champagne Gold Plaque */}
                  <div className="absolute top-[42%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[116px] sm:w-[128px] py-4 px-2 bg-[#FFFDF8] text-[#30231F] rounded-sm shadow-lg border border-[#D6B77A] flex flex-col items-center justify-center text-center">
                    <span className="text-[7px] tracking-[0.3em] uppercase text-[#78866B] font-semibold mb-0.5">
                      Haute Parfumerie
                    </span>
                    <h3 className="font-serif text-base sm:text-lg font-bold tracking-[0.24em] text-[#30231F] leading-tight mb-0.5">
                      VELMORA
                    </h3>
                    <div className="w-8 h-[1px] bg-[#D6B77A] my-1" />
                    <span className="text-[7.5px] tracking-[0.2em] uppercase text-[#5A3E36] font-medium">
                      Extrait De Parfum
                    </span>
                    <span className="text-[6.5px] tracking-[0.16em] uppercase text-[#8B736B] font-mono mt-0.5">
                      Paris · 50 ml
                    </span>
                  </div>
                </div>
              </motion.div>

              {/* 3. LUXURY CAP (Animates vertically upward off the bottle neck) */}
              <motion.div
                initial={{ y: 0, opacity: 0 }}
                animate={{
                  y: stage >= 2 ? (isReducedMotion ? -60 : [-5, -60, -56, -60]) : 0,
                  opacity: stage >= 1 ? 1 : 0
                }}
                transition={{
                  y: {
                    duration: 1.4,
                    times: [0, 0.7, 0.85, 1],
                    ease: [0.16, 1, 0.3, 1]
                  },
                  opacity: { duration: 0.6 }
                }}
                className="absolute z-20 flex flex-col items-center pointer-events-none"
                style={{
                  top: '64px',
                  left: '50%',
                  transform: 'translateX(-50%)'
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
                  {/* Cap internal crystal facets & refraction lines */}
                  <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_45%,rgba(255,255,255,0.25)_50%,transparent_55%)]" />
                  <div className="absolute top-0 inset-x-0 h-3 bg-gradient-to-b from-white/30 to-transparent" />
                  
                  {/* Golden Inset Crest Monogram on Cap Top */}
                  <div className="absolute top-2 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full border border-[#D6B77A]/70 flex items-center justify-center">
                    <span className="font-serif text-[8px] font-bold text-[#D6B77A]">V</span>
                  </div>

                  {/* Polished Champagne Gold Bottom Collar of Cap */}
                  <div 
                    className="absolute bottom-0 inset-x-0 h-3 border-t border-[#ECCF96]/40"
                    style={{
                      background: 'linear-gradient(90deg, #7A5F32 0%, #D6B77A 30%, #FFFDF8 50%, #D6B77A 70%, #594420 100%)'
                    }}
                  />
                </div>
              </motion.div>

              {/* 4. TRANSLUCENT FRAGRANCE MIST & DELICATE PARTICLES */}
              <AnimatePresence>
                {(stage >= 3 || mistPuffActive) && (
                  <div 
                    key={`mist-${sprayCount}`}
                    className="absolute z-15 pointer-events-none flex flex-col items-center"
                    style={{
                      top: '75px',
                      left: '50%',
                      transform: 'translateX(-50%)'
                    }}
                  >
                    {/* Primary Fragrance Vapor Plume 1 */}
                    <motion.div
                      initial={{ opacity: 0, scale: 0.2, y: 10 }}
                      animate={{ 
                        opacity: [0, 0.75, 0.4, 0],
                        scale: [0.3, 1.4, 2.2, 2.8],
                        y: [-5, -45, -95, -140],
                        x: [0, -6, 8, 4]
                      }}
                      transition={{ duration: 2.2, ease: 'easeOut' }}
                      className="w-16 h-20 rounded-full blur-[14px]"
                      style={{
                        background: 'radial-gradient(ellipse at center, rgba(236, 207, 150, 0.6) 0%, rgba(214, 183, 122, 0.25) 50%, transparent 80%)'
                      }}
                    />

                    {/* Secondary Delicate Expanding Vapor Ring */}
                    <motion.div
                      initial={{ opacity: 0, scale: 0.1, y: 0 }}
                      animate={{ 
                        opacity: [0, 0.85, 0.3, 0],
                        scale: [0.2, 1.8, 3.0],
                        y: [-10, -70, -130],
                        x: [0, 10, -5]
                      }}
                      transition={{ duration: 2.4, delay: 0.15, ease: 'easeOut' }}
                      className="absolute top-0 w-12 h-16 rounded-full blur-[12px]"
                      style={{
                        background: 'radial-gradient(circle, rgba(255, 253, 248, 0.7) 0%, rgba(214, 183, 122, 0.2) 60%, transparent 80%)'
                      }}
                    />

                    {/* Dispersing Golden Droplet Specks (Atomized particles) */}
                    {[
                      { x: -28, y: -80, d: 0.05, s: 4 },
                      { x: 32, y: -95, d: 0.12, s: 3 },
                      { x: -14, y: -120, d: 0.2, s: 5 },
                      { x: 22, y: -135, d: 0.18, s: 3.5 },
                      { x: -38, y: -110, d: 0.25, s: 3 },
                      { x: 10, y: -155, d: 0.3, s: 4 },
                      { x: -6, y: -70, d: 0.08, s: 4.5 },
                      { x: 40, y: -140, d: 0.22, s: 3 },
                    ].map((p, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, scale: 0, x: 0, y: 0 }}
                        animate={{ 
                          opacity: [0, 0.9, 0],
                          scale: [0.5, 1, 0.2],
                          x: p.x,
                          y: p.y
                        }}
                        transition={{ 
                          duration: 1.8, 
                          delay: p.d, 
                          ease: 'easeOut' 
                        }}
                        className="absolute top-2 rounded-full shadow-sm"
                        style={{
                          width: `${p.s}px`,
                          height: `${p.s}px`,
                          background: 'radial-gradient(circle, #FFFDF8 0%, #D6B77A 70%, transparent 100%)',
                          boxShadow: '0 0 6px rgba(214, 183, 122, 0.9)'
                        }}
                      />
                    ))}
                  </div>
                )}
              </AnimatePresence>

              {/* Interactive Bottle Controls Overlay (Replay & Spray) */}
              <div className="absolute -bottom-4 inset-x-0 flex items-center justify-center gap-3 z-30">
                <button
                  onClick={handleSpray}
                  aria-label="Spray perfume atomiser"
                  title="Spray Perfume Mist"
                  className="px-3 py-1.5 rounded-full bg-[#30231F]/90 hover:bg-[#5A3E36] border border-[#D6B77A]/50 text-[#D6B77A] hover:text-[#FFFDF8] text-[11px] font-medium tracking-wider flex items-center gap-1.5 shadow-md backdrop-blur-sm transition-all cursor-pointer active:scale-95"
                >
                  <Wind className="w-3.5 h-3.5 text-[#D6B77A]" />
                  <span>Atomize Mist</span>
                </button>

                <button
                  onClick={handleReplay}
                  aria-label="Replay perfume bottle opening animation"
                  title="Replay Cinematic Opening"
                  className="p-1.5 rounded-full bg-[#30231F]/90 hover:bg-[#5A3E36] border border-[#D6B77A]/50 text-[#E8D8C8] hover:text-white shadow-md backdrop-blur-sm transition-all cursor-pointer active:rotate-180"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Luxury Brand Typography Reveal & Functional Call-to-Actions */}
          <div className="col-12 col-lg-6 text-center text-lg-start space-y-6">
            
            {/* Step 5: LUXURY REVEAL */}
            <motion.div
              initial={{ opacity: 0, y: 22 }}
              animate={{ 
                opacity: stage >= 4 || isReducedMotion ? 1 : 0, 
                y: stage >= 4 || isReducedMotion ? 0 : 22 
              }}
              transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-4"
            >
              {/* Brand Header Kicker */}
              <div className="flex items-center justify-center justify-lg-start gap-2">
                <span className="text-[11px] sm:text-xs tracking-[0.32em] uppercase text-[#D6B77A] font-semibold">
                  Haute Parfumerie & Botanical Art
                </span>
                <span className="text-[#D6B77A] text-xs">·</span>
                <span className="text-[11px] sm:text-xs tracking-[0.24em] uppercase text-[#B7A397]">
                  Paris
                </span>
              </div>

              {/* Main Brand Title */}
              <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl font-normal text-[#FAF7F2] tracking-[0.06em] leading-[1.05] [text-wrap:balance]">
                VELMORA
              </h1>

              {/* Brand Tagline */}
              <div className="pt-1">
                <span className="font-sans text-xs sm:text-sm tracking-[0.32em] uppercase text-[#D6B77A] font-medium block">
                  Beauty in Every Detail
                </span>
              </div>

              {/* Story / Product Prose */}
              <p className="text-sm sm:text-base text-[#E8D8C8] max-w-xl font-light leading-relaxed tracking-wide [text-wrap:balance]">
                Each flacon is an intimate dialogue between master perfumery and contemporary architectural form. Cold-macerated wild amber, Florentine orris, and Somalian frankincense cured within hand-polished crystal.
              </p>

              {/* Step 6: CALL TO ACTION BUTTONS */}
              <div className="pt-4 flex flex-col sm:flex-row items-center justify-center justify-lg-start gap-4">
                {/* 1. SHOP FRAGRANCES BUTTON */}
                <button
                  onClick={handleShopFragrances}
                  className="w-full sm:w-auto px-8 py-3.5 bg-[#D6B77A] hover:bg-[#c4a362] text-[#30231F] text-xs font-semibold tracking-[0.22em] uppercase transition-all shadow-xl hover:shadow-[#D6B77A]/20 flex items-center justify-center gap-2 cursor-pointer active:scale-98"
                >
                  <span>Shop Fragrances</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#30231F]" />
                </button>

                {/* 2. SHOP ALL PRODUCTS BUTTON */}
                <button
                  onClick={handleShopAll}
                  className="w-full sm:w-auto px-8 py-3.5 border border-[#D6B77A]/80 hover:border-[#D6B77A] text-xs font-medium tracking-[0.22em] uppercase text-[#F8F4ED] hover:text-white hover:bg-[#D6B77A]/15 transition-all cursor-pointer active:scale-98"
                >
                  Shop All Products
                </button>
              </div>

              {/* Switch to Carousel Mode button for full catalog preview */}
              {onSwitchToSlides && (
                <div className="pt-3">
                  <button
                    onClick={onSwitchToSlides}
                    className="inline-flex items-center gap-2 text-xs text-[#B7A397] hover:text-[#FAF7F2] transition-colors cursor-pointer group"
                  >
                    <Eye className="w-3.5 h-3.5 text-[#D6B77A] group-hover:scale-110 transition-transform" />
                    <span className="underline underline-offset-4 decoration-[#D6B77A]/40 group-hover:decoration-[#D6B77A]">
                      Explore Other Collections (Apparel & Skincare)
                    </span>
                  </button>
                </div>
              )}

              {/* Trust Badges / Olfactory Notes Strip */}
              <div className="pt-6 border-t border-[#D6B77A]/20 grid grid-cols-3 gap-4 text-center text-lg-start">
                <div>
                  <span className="block text-xs font-serif text-[#FAF7F2] tracking-wider">Top Notes</span>
                  <span className="text-[11px] text-[#B7A397] font-light">Calabrian Bergamot & Pink Pepper</span>
                </div>
                <div>
                  <span className="block text-xs font-serif text-[#FAF7F2] tracking-wider">Heart Notes</span>
                  <span className="text-[11px] text-[#B7A397] font-light">Grasse Rose Absolute & Orris</span>
                </div>
                <div>
                  <span className="block text-xs font-serif text-[#FAF7F2] tracking-wider">Base Notes</span>
                  <span className="text-[11px] text-[#B7A397] font-light">Smoked Ambergris & Bourbon Vanilla</span>
                </div>
              </div>
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
};
