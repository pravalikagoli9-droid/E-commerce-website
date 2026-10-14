import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { useStore } from '../context/StoreContext';
import { ArrowRight, RotateCcw, Sparkles, Wind, Eye, Volume2, VolumeX, Droplets, ShieldCheck } from 'lucide-react';

interface PerfumeBottleAnimationProps {
  onExploreCampaigns?: () => void;
  className?: string;
}

interface FragranceEdition {
  id: string;
  name: string;
  subtitle: string;
  classification: string;
  volume: string;
  notes: string[];
  nectarGradient: string;
  glowColor: string;
  accentColor: string;
  labelVariant: string;
}

const FRAGRANCE_EDITIONS: FragranceEdition[] = [
  {
    id: 'ambre-royale',
    name: 'Ambre Royale',
    subtitle: 'N° 01 · Extrait de Parfum',
    classification: 'Haute Parfumerie',
    volume: '50 ml / 1.7 FL. OZ.',
    notes: ['Cognac Amber', 'Smoked Oud', 'Honeyed Resin'],
    nectarGradient: 'linear-gradient(180deg, #F3D28C 0%, #D6B77A 25%, #A87938 60%, #593C2A 100%)',
    glowColor: 'rgba(214, 183, 122, 0.45)',
    accentColor: '#D6B77A',
    labelVariant: 'warm-ivory'
  },
  {
    id: 'rose-celeste',
    name: 'Rose Céleste',
    subtitle: 'N° 02 · Extrait de Parfum',
    classification: 'Haute Parfumerie',
    volume: '50 ml / 1.7 FL. OZ.',
    notes: ['Centifolia Rose', 'Orris Root', 'Cashmere Wood'],
    nectarGradient: 'linear-gradient(180deg, #F8C3B9 0%, #D4887B 30%, #9B5349 65%, #4C2621 100%)',
    glowColor: 'rgba(212, 136, 123, 0.45)',
    accentColor: '#E29E92',
    labelVariant: 'rose-ivory'
  },
  {
    id: 'orris-imperial',
    name: 'Orris Imperial',
    subtitle: 'N° 03 · Extrait de Parfum',
    classification: 'Haute Parfumerie',
    volume: '50 ml / 1.7 FL. OZ.',
    notes: ['Florentine Orris', 'White Vetiver', 'Solar Musk'],
    nectarGradient: 'linear-gradient(180deg, #FFF0D4 0%, #E8D3A7 30%, #BA9F6B 65%, #5E4A28 100%)',
    glowColor: 'rgba(232, 211, 167, 0.45)',
    accentColor: '#ECCF96',
    labelVariant: 'warm-ivory'
  }
];

export const PerfumeBottleAnimation: React.FC<PerfumeBottleAnimationProps> = ({
  onExploreCampaigns,
  className = ''
}) => {
  const { setCurrentPage, setSelectedCategorySlug } = useStore();

  // Animation sequence stages:
  // 0: Preparing/hidden
  // 1: Bottle materialization (fade-in, 3D scale, glass sheen sweep)
  // 2: Cap magnetic disengage & vertical ascent
  // 3: High-pressure nozzle depression & atomized fragrance mist eruption
  // 4: Brand reveal & call to action buttons
  const [animStage, setAnimStage] = useState<number>(0);
  const [capOpen, setCapOpen] = useState<boolean>(false);
  const [pumpDepressed, setPumpDepressed] = useState<boolean>(false);
  const [isSpraying, setIsSpraying] = useState<boolean>(false);
  const [sprayCycle, setSprayCycle] = useState<number>(0);
  const [selectedFragrance, setSelectedFragrance] = useState<FragranceEdition>(FRAGRANCE_EDITIONS[0]);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(false);
  const [isReducedMotion, setIsReducedMotion] = useState<boolean>(false);

  // 3D Parallax state
  const [parallax, setParallax] = useState<{ x: number; y: number; sheenX: number }>({
    x: 0,
    y: 0,
    sheenX: 50
  });

  const bottleRef = useRef<HTMLDivElement>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);

  // Detect reduced-motion preference
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setIsReducedMotion(mq.matches);

    const listener = (e: MediaQueryListEvent) => setIsReducedMotion(e.matches);
    mq.addEventListener('change', listener);
    return () => mq.removeEventListener('change', listener);
  }, []);

  // Web Audio API synthesizer for luxury atomiser acoustic realism
  const playAtomiserSound = useCallback(() => {
    if (!soundEnabled || typeof window === 'undefined') return;
    try {
      const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtxClass) return;

      if (!audioCtxRef.current) {
        audioCtxRef.current = new AudioCtxClass();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      const now = ctx.currentTime;

      // 1. Mechanical pump tactile click
      const clickOsc = ctx.createOscillator();
      const clickGain = ctx.createGain();
      clickOsc.type = 'triangle';
      clickOsc.frequency.setValueAtTime(320, now);
      clickOsc.frequency.exponentialRampToValueAtTime(80, now + 0.04);
      clickGain.gain.setValueAtTime(0.08, now);
      clickGain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
      clickOsc.connect(clickGain);
      clickGain.connect(ctx.destination);
      clickOsc.start(now);
      clickOsc.stop(now + 0.04);

      // 2. High-pressure aerosol pneumatic "pssshh" whisper
      const bufferSize = ctx.sampleRate * 0.45;
      const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }

      const whiteNoise = ctx.createBufferSource();
      whiteNoise.buffer = noiseBuffer;

      const bandpass = ctx.createBiquadFilter();
      bandpass.type = 'bandpass';
      bandpass.frequency.setValueAtTime(3800, now + 0.02);
      bandpass.Q.setValueAtTime(1.8, now + 0.02);

      const noiseGain = ctx.createGain();
      noiseGain.gain.setValueAtTime(0.001, now);
      noiseGain.gain.linearRampToValueAtTime(0.12, now + 0.04);
      noiseGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.42);

      whiteNoise.connect(bandpass);
      bandpass.connect(noiseGain);
      noiseGain.connect(ctx.destination);

      whiteNoise.start(now + 0.02);
      whiteNoise.stop(now + 0.45);

      // 3. Subtle crystalline resonance chime
      const chimeOsc = ctx.createOscillator();
      const chimeGain = ctx.createGain();
      chimeOsc.type = 'sine';
      chimeOsc.frequency.setValueAtTime(1760, now + 0.05); // A6 note
      chimeGain.gain.setValueAtTime(0.03, now + 0.05);
      chimeGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.6);
      chimeOsc.connect(chimeGain);
      chimeGain.connect(ctx.destination);
      chimeOsc.start(now + 0.05);
      chimeOsc.stop(now + 0.6);
    } catch {
      // Audio playback silently gracefully ignored
    }
  }, [soundEnabled]);

  // Main cinematic timeline sequence
  useEffect(() => {
    if (isReducedMotion) {
      setAnimStage(4);
      setCapOpen(true);
      return;
    }

    // Step 1: Flacon materializes
    const t1 = setTimeout(() => {
      setAnimStage(1);
    }, 150);

    // Step 2: Cap lifts smoothly
    const t2 = setTimeout(() => {
      setAnimStage(2);
      setCapOpen(true);
    }, 1400);

    // Step 3: Nozzle depresses and mist atomizes
    const t3 = setTimeout(() => {
      setAnimStage(3);
      setPumpDepressed(true);
      setIsSpraying(true);
      setSprayCycle(c => c + 1);
      playAtomiserSound();

      // Release nozzle spring after 220ms
      setTimeout(() => setPumpDepressed(false), 220);
      // Dissipate main mist
      setTimeout(() => setIsSpraying(false), 2600);
    }, 2400);

    // Step 4: Brand & luxury CTAs reveal
    const t4 = setTimeout(() => {
      setAnimStage(4);
    }, 3200);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, [isReducedMotion, playAtomiserSound]);

  // Mouse move parallax handler for realistic 3D specular light refraction
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!bottleRef.current) return;
    const rect = bottleRef.current.getBoundingClientRect();
    const xRatio = (e.clientX - rect.left) / rect.width - 0.5; // -0.5 to 0.5
    const yRatio = (e.clientY - rect.top) / rect.height - 0.5;

    setParallax({
      x: xRatio * 14, // degrees
      y: -yRatio * 10,
      sheenX: (xRatio + 0.5) * 100 // 0 to 100%
    });
  };

  const handleMouseLeave = () => {
    setParallax({ x: 0, y: 0, sheenX: 50 });
  };

  // Replay animation sequence from start
  const handleReplay = () => {
    setAnimStage(0);
    setCapOpen(false);
    setPumpDepressed(false);
    setIsSpraying(false);

    setTimeout(() => {
      setAnimStage(1);
      setTimeout(() => {
        setAnimStage(2);
        setCapOpen(true);
      }, 1250);
      setTimeout(() => {
        setAnimStage(3);
        setPumpDepressed(true);
        setIsSpraying(true);
        setSprayCycle(c => c + 1);
        playAtomiserSound();
        setTimeout(() => setPumpDepressed(false), 220);
        setTimeout(() => setIsSpraying(false), 2600);
      }, 2200);
      setTimeout(() => {
        setAnimStage(4);
      }, 3000);
    }, 120);
  };

  // Trigger mist atomization on demand
  const triggerManualSpray = () => {
    setPumpDepressed(true);
    setIsSpraying(true);
    setSprayCycle(c => c + 1);
    playAtomiserSound();

    setTimeout(() => setPumpDepressed(false), 200);
    setTimeout(() => setIsSpraying(false), 2600);
  };

  // Toggle cap open / close manually
  const toggleCap = () => {
    if (capOpen) {
      setCapOpen(false);
      setIsSpraying(false);
    } else {
      setCapOpen(true);
      setTimeout(() => {
        triggerManualSpray();
      }, 350);
    }
  };

  // Switch fragrance edition
  const handleSelectEdition = (edition: FragranceEdition) => {
    setSelectedFragrance(edition);
    triggerManualSpray();
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

  // Realistic mist micro-particles calculation
  const mistParticles = useMemo(() => {
    return [
      { id: 1, x: -14, y: -75, scale: 3.5, delay: 0.02, opacity: 0.95 },
      { id: 2, x: 18, y: -90, scale: 4.2, delay: 0.06, opacity: 0.9 },
      { id: 3, x: -32, y: -110, scale: 3.0, delay: 0.12, opacity: 0.85 },
      { id: 4, x: 26, y: -125, scale: 4.8, delay: 0.16, opacity: 0.8 },
      { id: 5, x: -8, y: -140, scale: 2.8, delay: 0.22, opacity: 0.75 },
      { id: 6, x: 42, y: -155, scale: 3.8, delay: 0.28, opacity: 0.7 },
      { id: 7, x: -48, y: -170, scale: 3.2, delay: 0.34, opacity: 0.65 },
      { id: 8, x: 8, y: -185, scale: 4.0, delay: 0.4, opacity: 0.6 },
      { id: 9, x: -24, y: -200, scale: 2.6, delay: 0.46, opacity: 0.55 },
      { id: 10, x: 34, y: -215, scale: 3.4, delay: 0.52, opacity: 0.5 },
      { id: 11, x: -55, y: -230, scale: 2.4, delay: 0.58, opacity: 0.45 },
      { id: 12, x: 50, y: -240, scale: 3.0, delay: 0.64, opacity: 0.4 },
      { id: 13, x: -12, y: -255, scale: 2.2, delay: 0.7, opacity: 0.35 },
      { id: 14, x: 16, y: -268, scale: 2.8, delay: 0.76, opacity: 0.3 }
    ];
  }, []);

  return (
    <section
      aria-label="VELMORA Haute Parfumerie Flacon Showcase"
      className={`relative min-h-[92vh] sm:min-h-[96vh] flex items-center justify-center overflow-hidden bg-[#241B18] text-[#FAF7F2] py-12 px-4 sm:px-6 select-none ${className}`}
    >
      {/* Embedded CSS3 Keyframes & Optical Shimmer Rules */}
      <style>{`
        @keyframes velmoraFlaconEmerge {
          0% {
            opacity: 0;
            transform: scale(0.92) translateY(24px) rotateX(4deg);
          }
          100% {
            opacity: 1;
            transform: scale(1) translateY(0) rotateX(0deg);
          }
        }

        @keyframes velmoraMagneticCapLift {
          0% {
            transform: translate(-50%, 0) rotate(0deg);
            filter: drop-shadow(0 4px 6px rgba(0,0,0,0.6));
          }
          20% {
            transform: translate(-50%, -6px) rotate(-1deg);
          }
          65% {
            transform: translate(-50%, -84px) rotate(1.2deg);
            filter: drop-shadow(0 20px 25px rgba(0,0,0,0.45));
          }
          85% {
            transform: translate(-50%, -75px) rotate(-0.5deg);
          }
          100% {
            transform: translate(-50%, -78px) rotate(0deg);
            filter: drop-shadow(0 16px 20px rgba(0,0,0,0.4));
          }
        }

        @keyframes velmoraCapHover {
          0%, 100% {
            transform: translate(-50%, -78px) rotate(0deg);
          }
          50% {
            transform: translate(-50%, -82px) rotate(0.8deg);
          }
        }

        @keyframes velmoraNozzleSprayBurst {
          0% {
            opacity: 0;
            transform: translate(-50%, 0) scale(0.2);
          }
          25% {
            opacity: 0.95;
            transform: translate(-50%, -30px) scale(0.9);
          }
          60% {
            opacity: 0.7;
            transform: translate(-50%, -75px) scale(1.6);
          }
          100% {
            opacity: 0;
            transform: translate(-50%, -130px) scale(2.4);
          }
        }

        @keyframes velmoraAtomizedParticleFlight {
          0% {
            opacity: 0;
            transform: translate(0, 0) scale(0.4);
          }
          25% {
            opacity: 0.95;
          }
          70% {
            opacity: 0.6;
          }
          100% {
            opacity: 0;
            transform: translate(var(--dx, 0px), var(--dy, -120px)) scale(1.3);
          }
        }

        @keyframes velmoraSheenGleam {
          0% {
            transform: translateX(-160%) skewX(-28deg);
            opacity: 0;
          }
          45% {
            opacity: 0.85;
          }
          100% {
            transform: translateX(220%) skewX(-28deg);
            opacity: 0;
          }
        }

        @keyframes velmoraLiquidMeniscusShimmer {
          0%, 100% {
            opacity: 0.75;
            transform: scaleX(1);
          }
          50% {
            opacity: 0.95;
            transform: scaleX(1.02);
          }
        }

        @keyframes velmoraPedestalPlinthBreath {
          0%, 100% {
            opacity: 0.4;
            transform: translateX(-50%) scale(1);
          }
          50% {
            opacity: 0.55;
            transform: translateX(-50%) scale(1.03);
          }
        }

        .flacon-enter-active {
          animation: velmoraFlaconEmerge 1.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        .cap-lifting-active {
          animation: velmoraMagneticCapLift 1.35s cubic-bezier(0.16, 1, 0.3, 1) forwards,
                     velmoraCapHover 4s ease-in-out 1.35s infinite;
        }

        .sheen-gleam-active {
          animation: velmoraSheenGleam 1.6s cubic-bezier(0.4, 0, 0.2, 1) 0.5s forwards;
        }

        .nozzle-burst-active {
          animation: velmoraNozzleSprayBurst 2.1s cubic-bezier(0.2, 0.8, 0.35, 1) forwards;
        }

        .plinth-pulse {
          animation: velmoraPedestalPlinthBreath 5.5s ease-in-out infinite;
        }
      `}</style>

      {/* 1. CINEMATIC STUDIO ENVIRONMENT (Lighting, Radial Spotlight, Vignette) */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        {/* Soft Radial Center Studio Spotlight tuned to fragrance glow */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[740px] sm:w-[1020px] h-[740px] sm:h-[1020px] rounded-full blur-[140px] transition-all duration-1000"
          style={{
            background: `radial-gradient(circle, ${selectedFragrance.glowColor} 0%, rgba(90, 62, 54, 0.45) 45%, rgba(36, 27, 24, 0.8) 75%)`
          }}
        />

        {/* Studio Top Key Light */}
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[580px] h-[380px] opacity-25 blur-[100px]"
          style={{
            background: 'radial-gradient(ellipse at top, #FFFDF8 0%, #D6B77A 45%, transparent 75%)'
          }}
        />

        {/* Atmospheric Side Rim Highlights */}
        <div className="absolute top-1/4 left-10 w-72 h-72 rounded-full blur-[120px] bg-[#D6B77A]/10" />
        <div className="absolute top-1/3 right-10 w-80 h-80 rounded-full blur-[120px] bg-[#ECCF96]/10" />

        {/* Studio Vignette Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#241B18]/70 via-transparent to-[#241B18]/95" />

        {/* Studio Plinth Floor Glow */}
        <div
          className="plinth-pulse absolute bottom-[7%] left-1/2 -translate-x-1/2 w-[620px] sm:w-[860px] h-[140px] rounded-[100%] blur-[28px]"
          style={{
            background: `radial-gradient(ellipse, ${selectedFragrance.accentColor} 0%, rgba(48, 35, 31, 0.8) 60%, transparent 80%)`
          }}
        />
      </div>

      {/* 2. MAIN BOUTIQUE STAGE (Bootstrap 5 Grid System) */}
      <div className="container relative z-10 max-w-6xl mx-auto">
        <div className="row align-items-center justify-content-center gy-5">

          {/* LEFT COLUMN: THE REALISTIC PERFUME FLACON WITH 3D PERSPECTIVE & OPENING MECHANICS */}
          <div className="col-12 col-lg-6 d-flex flex-column align-items-center justify-content-center text-center">
            
            {/* Semantic Figure Container with 3D Parallax Tracking */}
            <figure
              ref={bottleRef}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              className="relative w-[300px] sm:w-[340px] h-[470px] sm:h-[510px] flex items-center justify-center m-0 p-0 cursor-pointer"
              role="img"
              aria-label={`Realistic 3D-styled animation of ${selectedFragrance.name} Extrait de Parfum flacon with opening cap and fragrance mist`}
              style={{
                perspective: '1200px'
              }}
            >
              {/* Floor Shadow: Contact Shadow + Diffuse Drop Shadow */}
              <div
                className={`absolute bottom-10 left-1/2 -translate-x-1/2 w-[200px] sm:w-[230px] h-[24px] rounded-full blur-[11px] bg-black/85 pointer-events-none transition-all duration-1000 ${
                  animStage >= 1 ? 'opacity-80 scale-100' : 'opacity-0 scale-75'
                }`}
                aria-hidden="true"
              />
              <div
                className={`absolute bottom-9 left-1/2 -translate-x-1/2 w-[150px] sm:w-[170px] h-[14px] rounded-full blur-[5px] bg-black pointer-events-none transition-all duration-1000 ${
                  animStage >= 1 ? 'opacity-90' : 'opacity-0'
                }`}
                aria-hidden="true"
              />

              {/* Pedestal Inverted Mirror Reflection on Lacquered Studio Surface */}
              <div
                className={`absolute bottom-[-16px] left-1/2 -translate-x-1/2 w-[160px] sm:w-[180px] h-[75px] overflow-hidden pointer-events-none opacity-25 blur-[1.5px] transition-all duration-1000 transform scale-y-[-1] mask-image-gradient ${
                  animStage >= 1 ? 'opacity-25' : 'opacity-0'
                }`}
                style={{
                  maskImage: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 80%)',
                  WebkitMaskImage: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 80%)'
                }}
                aria-hidden="true"
              >
                <div
                  className="w-full h-full rounded-t-2xl"
                  style={{
                    background: selectedFragrance.nectarGradient
                  }}
                />
              </div>

              {/* 3D TILT WRAPPER CONTAINER (Reacts to cursor coordinates for realistic depth) */}
              <div
                className={`relative z-10 flex flex-col items-center transition-transform duration-200 ease-out ${
                  animStage >= 1 ? 'flacon-enter-active opacity-100' : 'opacity-0'
                }`}
                style={{
                  transform: `rotateY(${parallax.x}deg) rotateX(${parallax.y}deg)`,
                  transformStyle: 'preserve-3d'
                }}
              >
                {/* 1. ATOMIZER ASSEMBLY: COLLAR, SPRING STEM & PRECISION SPRAY NOZZLE */}
                <header className="relative flex flex-col items-center z-10 mb-[-1px]">
                  
                  {/* Precision Spray Nozzle (Depresses vertically during atomization) */}
                  <div
                    onClick={(e) => {
                      e.stopPropagation();
                      triggerManualSpray();
                    }}
                    className={`relative flex flex-col items-center cursor-pointer transition-transform duration-150 ${
                      pumpDepressed ? 'translate-y-[3.5px]' : 'translate-y-0'
                    }`}
                    title="Click nozzle to atomize fragrance"
                  >
                    {/* Atomizer Spray Orifice (Micro-aperture hole where mist exits) */}
                    <div className="w-1.5 h-1.5 rounded-full bg-[#1A1210] border border-[#ECCF96] z-30 mb-[-2px] shadow-inner relative">
                      <div className="absolute inset-0 rounded-full bg-black/60" />
                    </div>

                    {/* Brushed 24K Gold Actuator Cylinder */}
                    <div
                      className="w-5 h-6 rounded-t-sm shadow-sm relative overflow-hidden"
                      style={{
                        background: 'linear-gradient(90deg, #7A5F32 0%, #D6B77A 25%, #FFFDF8 45%, #ECCF96 65%, #594420 100%)',
                        boxShadow: '0 1px 4px rgba(0,0,0,0.6)'
                      }}
                    >
                      {/* Polished Specular Highlight Strip */}
                      <div
                        className="absolute inset-y-0 w-1 bg-white/50 blur-[0.5px] transition-all duration-150"
                        style={{ left: `${parallax.sheenX * 0.4 + 20}%` }}
                      />
                    </div>
                  </div>

                  {/* Threaded Knurled Crimp Collar Ring */}
                  <div
                    className="w-10 h-4 rounded-sm relative overflow-hidden border-t border-b border-[#ECCF96]/50 shadow-md"
                    style={{
                      background: 'linear-gradient(90deg, #594420 0%, #D6B77A 25%, #FFF7E6 50%, #D6B77A 75%, #423218 100%)'
                    }}
                  >
                    {/* Micro Diamond Mesh Knurling Texture */}
                    <div className="absolute inset-0 opacity-35 bg-[repeating-linear-gradient(45deg,#000,#000_1px,transparent_1px,transparent_3px)]" />
                    <div className="absolute inset-0 opacity-25 bg-[repeating-linear-gradient(-45deg,#000,#000_1px,transparent_1px,transparent_3px)]" />
                  </div>
                </header>

                {/* 2. MAIN FLACON BODY: HEAVY SMOKED CRYSTAL GLASS & LIQUID CHAMBER */}
                <article
                  onClick={toggleCap}
                  className="relative w-[176px] sm:w-[196px] h-[236px] sm:h-[256px] rounded-b-2xl rounded-t-md overflow-hidden shadow-2xl backdrop-blur-md"
                  style={{
                    background: 'linear-gradient(180deg, rgba(58, 41, 35, 0.90) 0%, rgba(30, 21, 18, 0.97) 100%)',
                    border: '1.5px solid rgba(214, 183, 122, 0.45)',
                    boxShadow: `0 30px 60px -12px rgba(0, 0, 0, 0.85), inset 0 0 25px ${selectedFragrance.glowColor}`
                  }}
                >
                  {/* Outer Crystal Glass Refraction Chamfers (Left & Right Thick Glass Walls) */}
                  <div className="absolute inset-y-0 left-0 w-3.5 bg-gradient-to-r from-white/25 via-white/10 to-transparent pointer-events-none" />
                  <div className="absolute inset-y-0 right-0 w-3.5 bg-gradient-to-l from-white/25 via-white/10 to-transparent pointer-events-none" />

                  {/* Corner Bevel Reflections */}
                  <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-b from-white/20 to-transparent pointer-events-none" />

                  {/* Ultra-Thick Solid Crystal Glass Base ("Cul-de-Bouteille") */}
                  <div
                    className="absolute bottom-0 inset-x-0 h-11 border-t border-[#D6B77A]/25 pointer-events-none overflow-hidden"
                    style={{
                      background: 'linear-gradient(180deg, rgba(214, 183, 122, 0.1) 0%, rgba(255, 255, 255, 0.2) 75%, rgba(214, 183, 122, 0.3) 100%)'
                    }}
                  >
                    {/* Inner Glass Caustic Highlight Line */}
                    <div className="absolute bottom-2.5 left-4 right-4 h-[1.5px] bg-white/50 rounded-full blur-[0.3px]" />
                    <div className="absolute bottom-4 left-6 right-6 h-[0.8px] bg-[#ECCF96]/60 rounded-full" />
                  </div>

                  {/* Internal Liquid Chamber with Nectar & Meniscus */}
                  <div className="absolute bottom-11 left-3.5 right-3.5 top-4 rounded-b-lg overflow-hidden flex flex-col justify-end">
                    
                    {/* Realistic Frosted Dip Tube (Capillary feeder extending into the liquid) */}
                    <div
                      className="absolute inset-y-0 left-[48%] w-[1.5px] pointer-events-none z-10 transform rotate-1"
                      style={{
                        background: 'linear-gradient(180deg, rgba(255,255,255,0.7) 0%, rgba(255,255,255,0.3) 100%)',
                        boxShadow: '0 0 2px rgba(255,255,255,0.4)'
                      }}
                    />

                    {/* Dynamic Liquid Nectar */}
                    <div
                      className="w-full h-[84%] relative transition-all duration-700 ease-out"
                      style={{
                        background: selectedFragrance.nectarGradient,
                        boxShadow: 'inset 0 4px 14px rgba(255, 245, 220, 0.45)'
                      }}
                    >
                      {/* Fluid Meniscus Curve (Physics of liquid tension against glass) */}
                      <div
                        className="absolute -top-2 inset-x-0 h-4 rounded-[50%] opacity-90 blur-[0.6px] transition-colors duration-500"
                        style={{
                          background: selectedFragrance.accentColor,
                          animation: 'velmoraLiquidMeniscusShimmer 4s ease-in-out infinite'
                        }}
                      />

                      {/* Internal Sunlight Caustic Ray */}
                      <div
                        className="absolute inset-y-0 w-14 opacity-35 blur-[4px] transform -skew-x-12 transition-all duration-300"
                        style={{
                          left: `${parallax.sheenX * 0.5 + 15}%`,
                          background: 'linear-gradient(90deg, transparent, #FFFDF8, transparent)'
                        }}
                      />
                    </div>
                  </div>

                  {/* Glass Light Reflection Sheen Beam (Sweeps dynamically across flacon) */}
                  <div
                    className={`absolute inset-y-0 w-28 transform -skew-x-25 pointer-events-none ${
                      animStage >= 1 ? 'sheen-gleam-active' : 'opacity-0'
                    }`}
                    style={{
                      background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.45) 50%, transparent 100%)'
                    }}
                  />

                  {/* DYNAMIC CURSOR SPECULAR GLINT */}
                  <div
                    className="absolute inset-y-0 w-10 pointer-events-none blur-[1px] opacity-40 transition-all duration-150 transform -skew-x-20"
                    style={{
                      left: `${parallax.sheenX}%`,
                      background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.8), transparent)'
                    }}
                  />

                  {/* FRONT LABEL PLAQUE: Tactile Warm Ivory & Embossed Champagne Gold Foil */}
                  <figcaption
                    className={`absolute top-[43%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120px] sm:w-[132px] py-4 px-2.5 rounded-sm shadow-xl border border-[#D6B77A] flex flex-col items-center justify-center text-center transition-colors duration-500 ${
                      selectedFragrance.labelVariant === 'rose-ivory' ? 'bg-[#FFF9F7]' : 'bg-[#FFFDF8]'
                    }`}
                    style={{
                      boxShadow: '0 8px 20px rgba(0,0,0,0.5), inset 0 0 10px rgba(214,183,122,0.2)'
                    }}
                  >
                    {/* Gold Hot-Stamp Filigree Border Inset */}
                    <div className="absolute inset-1 border border-[#D6B77A]/40 pointer-events-none" />

                    <span className="text-[7px] tracking-[0.32em] uppercase text-[#78866B] font-semibold mb-0.5">
                      {selectedFragrance.classification}
                    </span>
                    <strong className="font-serif text-base sm:text-lg font-bold tracking-[0.24em] text-[#30231F] leading-tight mb-0.5">
                      VELMORA
                    </strong>
                    <div className="w-8 h-[1px] bg-[#D6B77A] my-1" />
                    <span className="text-[7.5px] tracking-[0.22em] uppercase text-[#5A3E36] font-medium">
                      {selectedFragrance.name}
                    </span>
                    <span className="text-[6.5px] tracking-[0.16em] uppercase text-[#8B736B] font-mono mt-0.5">
                      {selectedFragrance.volume}
                    </span>
                  </figcaption>
                </article>
              </div>

              {/* 3. MAGNETIC FACETED CRYSTAL CAP (Lifts cleanly off the neck with physical inertia) */}
              <div
                onClick={toggleCap}
                className={`absolute z-30 flex flex-col items-center cursor-pointer transition-all ${
                  capOpen
                    ? (isReducedMotion ? 'opacity-100 -translate-y-20' : 'cap-lifting-active opacity-100')
                    : animStage >= 1
                      ? 'opacity-100 translate-x-[-50%]'
                      : 'opacity-0'
                }`}
                style={{
                  top: '68px',
                  left: '50%',
                  transform: !capOpen && animStage >= 1 ? 'translateX(-50%)' : undefined
                }}
                title={capOpen ? 'Click to replace perfume cap' : 'Click to lift perfume cap'}
              >
                {/* Faceted Smoked Obsidian Cap Block with Beveled Light Cuts */}
                <div
                  className="w-14 sm:w-16 h-14 sm:h-16 rounded-md relative overflow-hidden shadow-2xl transition-transform hover:scale-105 duration-200"
                  style={{
                    background: 'linear-gradient(135deg, #4A332C 0%, #291D1A 60%, #150F0D 100%)',
                    border: '1.5px solid rgba(214, 183, 122, 0.7)',
                    boxShadow: '0 16px 35px rgba(0,0,0,0.85), inset 0 0 12px rgba(214,183,122,0.35)'
                  }}
                >
                  {/* Diagonal Facet Glint */}
                  <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_45%,rgba(255,255,255,0.3)_50%,transparent_55%)]" />
                  <div className="absolute top-0 inset-x-0 h-3 bg-gradient-to-b from-white/35 to-transparent" />

                  {/* Monogram Crest Medallion on Cap Crown */}
                  <div className="absolute top-2 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full border border-[#D6B77A]/80 flex items-center justify-center bg-[#30231F]/80">
                    <span className="font-serif text-[8.5px] font-bold text-[#D6B77A]">V</span>
                  </div>

                  {/* Polished Inlaid 24K Gold Base Collar Ring */}
                  <div
                    className="absolute bottom-0 inset-x-0 h-3.5 border-t border-[#ECCF96]/50"
                    style={{
                      background: 'linear-gradient(90deg, #7A5F32 0%, #D6B77A 30%, #FFFDF8 50%, #D6B77A 70%, #594420 100%)'
                    }}
                  />
                </div>

                {/* Soft Drop Shadow Cast by Cap onto Bottle Neck */}
                <div
                  className={`w-12 h-2 rounded-full blur-[3px] bg-black/60 transition-all duration-300 mt-1 ${
                    capOpen ? 'opacity-40 scale-125' : 'opacity-80 scale-95'
                  }`}
                  aria-hidden="true"
                />
              </div>

              {/* 4. REALISTIC HIGH-PRESSURE ATOMIZED MIST & SCINTILLATING SCENT PARTICLES */}
              {isSpraying && (
                <div
                  key={`mist-burst-${sprayCycle}`}
                  className="absolute z-20 pointer-events-none flex flex-col items-center"
                  style={{
                    top: '76px',
                    left: '50%',
                    transform: 'translateX(-50%)'
                  }}
                  aria-hidden="true"
                >
                  {/* High-Velocity Conical Aerosol Plume */}
                  <div
                    className="nozzle-burst-active w-20 h-24 rounded-full blur-[12px]"
                    style={{
                      background: `radial-gradient(ellipse at center, ${selectedFragrance.glowColor} 0%, rgba(255, 253, 248, 0.4) 40%, transparent 80%)`
                    }}
                  />

                  {/* Secondary Expanding Vapor Ring */}
                  <div
                    className="nozzle-burst-active absolute top-[-10px] w-14 h-18 rounded-full blur-[9px]"
                    style={{
                      background: 'radial-gradient(circle, rgba(255, 253, 248, 0.8) 0%, rgba(214, 183, 122, 0.25) 60%, transparent 80%)',
                      animationDelay: '0.08s'
                    }}
                  />

                  {/* Shockwave Scent Ring Expanding from Nozzle */}
                  <div
                    className="absolute -top-2 w-8 h-8 rounded-full border border-[#FFFDF8]/70 blur-[1px] animate-ping"
                    style={{ animationDuration: '1.2s' }}
                  />

                  {/* Multi-layered Atomized Golden Micro-Droplets (Turbulence Simulation) */}
                  {mistParticles.map(p => (
                    <div
                      key={p.id}
                      className="absolute rounded-full bg-[#FFFDF8] blur-[0.4px]"
                      style={
                        {
                          width: `${p.scale}px`,
                          height: `${p.scale}px`,
                          boxShadow: `0 0 6px ${selectedFragrance.accentColor}`,
                          animation: `velmoraAtomizedParticleFlight 2.2s cubic-bezier(0.16, 0.8, 0.4, 1) ${p.delay}s forwards`,
                          '--dx': `${p.x}px`,
                          '--dy': `${p.y}px`
                        } as React.CSSProperties
                      }
                    />
                  ))}
                </div>
              )}
            </figure>

            {/* INTERACTIVE CONTROLS BAR: REPLAY, ATOMIZE MIST, SOUND & CAMPAIGN */}
            <div className="d-flex flex-wrap align-items-center justify-content-center gap-2 mt-4 pt-1">
              <button
                type="button"
                onClick={handleReplay}
                className="btn btn-sm text-[#FAF7F2] border border-[#D6B77A]/40 hover:border-[#D6B77A] bg-[#30231F]/70 hover:bg-[#30231F] rounded-pill px-3 py-1.5 text-xs font-sans tracking-wider d-flex align-items-center gap-1.5 transition-all cursor-pointer shadow-sm"
                title="Replay cinematic bottle opening animation"
                aria-label="Replay perfume bottle opening animation"
              >
                <RotateCcw className="w-3.5 h-3.5 text-[#D6B77A]" />
                <span>Replay Animation</span>
              </button>

              <button
                type="button"
                onClick={triggerManualSpray}
                className="btn btn-sm text-[#FAF7F2] border border-[#D6B77A]/40 hover:border-[#D6B77A] bg-[#30231F]/70 hover:bg-[#30231F] rounded-pill px-3 py-1.5 text-xs font-sans tracking-wider d-flex align-items-center gap-1.5 transition-all cursor-pointer shadow-sm"
                title="Atomize fragrance mist"
                aria-label="Atomize fragrance mist"
              >
                <Wind className="w-3.5 h-3.5 text-[#ECCF96]" />
                <span>Atomize Mist</span>
              </button>

              <button
                type="button"
                onClick={() => setSoundEnabled(!soundEnabled)}
                className={`btn btn-sm border rounded-pill px-3 py-1.5 text-xs font-sans tracking-wider d-flex align-items-center gap-1.5 transition-all cursor-pointer shadow-sm ${
                  soundEnabled
                    ? 'text-[#D6B77A] border-[#D6B77A] bg-[#30231F]'
                    : 'text-[#FAF7F2]/60 border-[#D6B77A]/25 bg-[#30231F]/40 hover:text-[#FAF7F2]'
                }`}
                title={soundEnabled ? 'Acoustic mist sound active' : 'Enable acoustic mist sound'}
                aria-label={soundEnabled ? 'Mute atomiser sound' : 'Enable atomiser sound'}
              >
                {soundEnabled ? (
                  <Volume2 className="w-3.5 h-3.5 text-[#D6B77A]" />
                ) : (
                  <VolumeX className="w-3.5 h-3.5 text-stone-400" />
                )}
                <span>{soundEnabled ? 'Sound On' : 'Sound Off'}</span>
              </button>

              {onExploreCampaigns && (
                <button
                  type="button"
                  onClick={onExploreCampaigns}
                  className="btn btn-sm text-[#ECCF96] border border-[#D6B77A]/40 hover:border-[#D6B77A] bg-[#30231F]/70 hover:bg-[#30231F] rounded-pill px-3 py-1.5 text-xs font-sans tracking-wider d-flex align-items-center gap-1.5 transition-all cursor-pointer shadow-sm"
                  title="Explore campaign showcase"
                  aria-label="Explore campaign showcase"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Campaign Slides</span>
                </button>
              )}
            </div>

            {/* SIGNATURE EXTRAIT SELECTION TABS */}
            <div className="mt-3.5 flex items-center justify-center gap-2">
              <span className="text-[10px] uppercase tracking-[0.2em] text-[#D6B77A]/70 font-mono mr-1">
                Edition:
              </span>
              {FRAGRANCE_EDITIONS.map(edition => {
                const isSelected = selectedFragrance.id === edition.id;
                return (
                  <button
                    key={edition.id}
                    onClick={() => handleSelectEdition(edition)}
                    className={`px-2.5 py-1 rounded-full text-[10px] tracking-wider uppercase font-sans transition-all cursor-pointer border ${
                      isSelected
                        ? 'bg-[#D6B77A]/20 border-[#D6B77A] text-[#ECCF96]'
                        : 'bg-transparent border-[#D6B77A]/20 text-[#FAF7F2]/60 hover:text-[#FAF7F2] hover:border-[#D6B77A]/40'
                    }`}
                  >
                    {edition.name}
                  </button>
                );
              })}
            </div>

            {/* Perfume Note Accords Bar */}
            <div className="mt-2.5 flex items-center justify-center gap-2 text-[10.5px] tracking-[0.2em] uppercase text-[#D6B77A]/80 font-mono">
              {selectedFragrance.notes.map((note, idx) => (
                <React.Fragment key={note}>
                  <span>{note}</span>
                  {idx < selectedFragrance.notes.length - 1 && (
                    <span className="w-1 h-1 rounded-full bg-[#D6B77A]/40" />
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* RIGHT COLUMN: LUXURY BRAND REVEAL, TAGLINE & BOUTIQUE CALL TO ACTIONS */}
          <div className="col-12 col-lg-6 text-center text-lg-start d-flex flex-column align-items-center align-items-lg-start">
            
            {/* Stage Indicator Pill */}
            <div
              className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#30231F]/80 border border-[#D6B77A]/40 text-[#D6B77A] text-[11px] tracking-[0.24em] uppercase font-sans mb-4 shadow-sm transition-all duration-700 ${
                animStage >= 1 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
              }`}
            >
              <Sparkles className="w-3 h-3 text-[#D6B77A]" />
              <span>Haute Parfumerie · Paris</span>
            </div>

            {/* BRAND NAME REVEAL */}
            <h1
              className={`font-serif text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-light tracking-[0.16em] text-[#FAF7F2] mb-3 transition-all duration-1000 ${
                animStage >= 4 ? 'opacity-100 translate-y-0' : animStage >= 1 ? 'opacity-85 translate-y-2' : 'opacity-0 translate-y-4'
              }`}
            >
              VELMORA
            </h1>

            {/* MANDATORY BRAND TAGLINE */}
            <h2
              className={`text-sm sm:text-base md:text-lg tracking-[0.38em] uppercase text-[#D6B77A] font-light mb-6 transition-all duration-1000 delay-150 ${
                animStage >= 4 ? 'opacity-100 translate-y-0' : animStage >= 1 ? 'opacity-70 translate-y-2' : 'opacity-0 translate-y-4'
              }`}
            >
              BEAUTY IN EVERY DETAIL
            </h2>

            {/* Narrative Editorial Copy */}
            <p
              className={`text-sm sm:text-base text-[#FAF7F2]/80 font-light leading-relaxed max-w-lg mb-8 transition-all duration-1000 delay-300 ${
                animStage >= 4 ? 'opacity-100 translate-y-0' : animStage >= 1 ? 'opacity-60 translate-y-2' : 'opacity-0 translate-y-4'
              }`}
            >
              Distilled in Grasse, aged in French oak casks, and presented in smoked crystal flacons.
              Each flacon holds a rare, high-concentration Extrait de Parfum crafted with rare raw botanicals,
              cognac amber resins, and velvety Florentine orris.
            </p>

            {/* REVEALED CALL TO ACTION BUTTONS (Bootstrap 5 Buttons Styled to VELMORA Palette) */}
            <div
              className={`d-flex flex-column flex-sm-row gap-3 w-100 max-w-md transition-all duration-1000 delay-500 ${
                animStage >= 4 ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 translate-y-3 pointer-events-none'
              }`}
            >
              {/* PRIMARY ACTION: SHOP FRAGRANCES */}
              <button
                type="button"
                onClick={handleShopFragrances}
                className="btn btn-lg bg-[#D6B77A] hover:bg-[#ECCF96] text-[#241B18] font-semibold text-xs uppercase tracking-[0.24em] rounded-pill px-6 py-3.5 shadow-lg transition-all transform hover:-translate-y-0.5 cursor-pointer d-flex align-items-center justify-content-center gap-2"
                aria-label="Shop VELMORA luxury fragrances"
              >
                <span>SHOP FRAGRANCES</span>
                <ArrowRight className="w-4 h-4 text-[#241B18]" />
              </button>

              {/* SECONDARY ACTION: SHOP ALL PRODUCTS */}
              <button
                type="button"
                onClick={handleShopAll}
                className="btn btn-lg border border-[#D6B77A] hover:border-[#ECCF96] text-[#FAF7F2] hover:text-[#241B18] hover:bg-[#D6B77A] font-semibold text-xs uppercase tracking-[0.24em] rounded-pill px-6 py-3.5 shadow-sm transition-all transform hover:-translate-y-0.5 cursor-pointer d-flex align-items-center justify-content-center gap-2"
                aria-label="Shop all VELMORA products"
              >
                <span>SHOP ALL PRODUCTS</span>
              </button>
            </div>

            {/* Authentic Luxury Certification Badges */}
            <div
              className={`mt-8 pt-6 border-t border-[#D6B77A]/20 d-flex flex-wrap items-center justify-center justify-content-lg-start gap-4 text-xs text-[#FAF7F2]/70 font-sans transition-all duration-1000 delay-700 ${
                animStage >= 4 ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <div className="d-flex align-items-center gap-1.5">
                <Droplets className="w-4 h-4 text-[#D6B77A]" />
                <span>35% Pure Extrait Concentration</span>
              </div>
              <div className="d-flex align-items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#78866B]" />
                <span>Individually Numbered Flacons</span>
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};
