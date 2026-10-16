import React, { useState, useRef, useEffect } from 'react';
import {
  X,
  Upload,
  Film,
  Sparkles,
  Play,
  Download,
  AlertCircle,
  RefreshCw,
  Sliders,
  CheckCircle2,
  Video
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { getProductImageUrl, handleImageError } from '../utils/imageUrl';

interface MotionStudioModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PRESET_IMAGES = [
  {
    name: 'Ambre Nocturne Flacon',
    src: '/images/velmora_perfume_ambre_1791912395312.jpg',
    defaultPrompt: 'Cinematic slow camera pan around a luxury perfume bottle on reflective smoked glass, delicate fragrance mist rising, warm golden studio lighting'
  },
  {
    name: 'Rose Absolue Extrait',
    src: '/images/velmora_perfume_rose_1791912395755.jpg',
    defaultPrompt: 'High-end commercial video of a crystal perfume bottle with champagne gold highlights, soft focus floral background, cinematic slow motion'
  },
  {
    name: 'Botanical Cellular Serum',
    src: '/images/velmora_botanical_serum_1791912396485.jpg',
    defaultPrompt: 'Sculptural luxury skincare bottle with gentle water caustics, soft studio light beam passing through glass, serene commercial aesthetic'
  },
  {
    name: 'Silk & Tailored Robe',
    src: '/images/category_apparel_1791824731775.jpg',
    defaultPrompt: 'Luxury Como silk fabric floating weightlessly in slow motion, golden hour sunlight highlighting textured weave, editorial fashion aesthetic'
  }
];

const STYLE_PROMPTS = [
  'Cinematic slow camera pan with delicate fragrance mist and warm champagne lighting',
  'Slow 360-degree studio turntable rotation with glass reflections and subtle shadows',
  'Macro focus reveal with golden light sweep and atmospheric floating dust particles',
  'Soft focus editorial movement with gentle depth-of-field transition'
];

export const MotionStudioModal: React.FC<MotionStudioModalProps> = ({ isOpen, onClose }) => {
  const [selectedImage, setSelectedImage] = useState<string>(PRESET_IMAGES[0].src);
  const [aspectRatio, setAspectRatio] = useState<'16:9' | '9:16'>('16:9');
  const [prompt, setPrompt] = useState<string>(PRESET_IMAGES[0].defaultPrompt);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [generationStep, setGenerationStep] = useState<string>('');
  const [generatedVideoUrl, setGeneratedVideoUrl] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [operationName, setOperationName] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const pollingIntervalRef = useRef<number | null>(null);

  // Clean up blob URL on unmount
  useEffect(() => {
    return () => {
      if (pollingIntervalRef.current) clearInterval(pollingIntervalRef.current);
      if (generatedVideoUrl) URL.revokeObjectURL(generatedVideoUrl);
    };
  }, [generatedVideoUrl]);

  if (!isOpen) return null;

  // Handle local image file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setErrorMessage('Please select a valid image file (PNG, JPG, WebP).');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setSelectedImage(event.target.result as string);
        setErrorMessage(null);
      }
    };
    reader.readAsDataURL(file);
  };

  // Start Video Generation using Veo 3.1
  const handleGenerate = async () => {
    if (!selectedImage) {
      setErrorMessage('Please upload or select an image to animate.');
      return;
    }

    setIsGenerating(true);
    setErrorMessage(null);
    setGeneratedVideoUrl(null);
    setGenerationStep('Initiating Veo video synthesis (veo-3.1-fast-generate-preview)...');

    try {
      // 1. Convert image to base64 if needed
      let base64Data = selectedImage;
      let mimeType = 'image/jpeg';

      if (selectedImage.startsWith('data:')) {
        const matches = selectedImage.match(/^data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+);base64,(.+)$/);
        if (matches) {
          mimeType = matches[1];
          base64Data = matches[2];
        }
      } else {
        // Fetch local static asset and convert to base64
        const resp = await fetch(selectedImage);
        const blob = await resp.blob();
        mimeType = blob.type || 'image/jpeg';
        const reader = new FileReader();
        base64Data = await new Promise<string>((resolve, reject) => {
          reader.onload = () => {
            const result = reader.result as string;
            const pureBase64 = result.split(',')[1];
            resolve(pureBase64);
          };
          reader.onerror = reject;
          reader.readAsDataURL(blob);
        });
      }

      // 2. Call backend to start generation
      setGenerationStep('Submitting creative frames to Veo video engine...');
      const response = await fetch('/api/generate-video', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64: base64Data,
          mimeType,
          prompt,
          aspectRatio
        })
      });

      if (!response.ok) {
        const errJson = await response.json().catch(() => ({}));
        throw new Error(errJson.error || `Server responded with status ${response.status}`);
      }

      const { operationName: opName } = await response.json();
      setOperationName(opName);
      setGenerationStep('Sculpting motion vectors and atmospheric lighting...');

      // 3. Poll for completion
      let attempts = 0;
      const stepMessages = [
        'Simulating realistic camera trajectory...',
        'Synthesizing fragrance mist & glass caustics...',
        'Rendering high-fidelity luxury motion frames...',
        'Polishing lighting reflections and final render...'
      ];

      pollingIntervalRef.current = window.setInterval(async () => {
        attempts++;
        setGenerationStep(stepMessages[attempts % stepMessages.length]);

        try {
          const pollRes = await fetch('/api/video-status', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ operationName: opName })
          });

          if (!pollRes.ok) return;

          const pollData = await pollRes.json();
          if (pollData.done) {
            if (pollingIntervalRef.current) clearInterval(pollingIntervalRef.current);
            setGenerationStep('Downloading finalized luxury video...');

            // 4. Download video binary
            const dlRes = await fetch('/api/video-download', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ operationName: opName })
            });

            if (!dlRes.ok) {
              throw new Error('Failed to download generated video.');
            }

            const videoBlob = await dlRes.blob();
            const videoUrl = URL.createObjectURL(videoBlob);
            setGeneratedVideoUrl(videoUrl);
            setIsGenerating(false);
            setGenerationStep('');
          } else if (pollData.error) {
            if (pollingIntervalRef.current) clearInterval(pollingIntervalRef.current);
            throw new Error(pollData.error.message || 'Video generation encountered an error.');
          }
        } catch (pollErr: any) {
          if (pollingIntervalRef.current) clearInterval(pollingIntervalRef.current);
          setIsGenerating(false);
          setErrorMessage(pollErr?.message || 'Error occurred during video polling.');
        }
      }, 4000);

    } catch (err: any) {
      if (pollingIntervalRef.current) clearInterval(pollingIntervalRef.current);
      setIsGenerating(false);
      setErrorMessage(err?.message || 'Failed to generate video.');
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/75 backdrop-blur-md overflow-y-auto"
      role="dialog"
      aria-modal="true"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.96 }}
        className="relative w-full max-w-4xl bg-[#FFFDF8] text-[#30231F] border border-[#D6B77A]/40 shadow-2xl overflow-hidden my-auto"
      >
        {/* Top Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 bg-[#30231F] text-[#FAF7F2] border-b border-[#D6B77A]/30">
          <div className="flex items-center gap-3">
            <Film className="w-5 h-5 text-[#D6B77A]" />
            <div>
              <span className="text-[10px] tracking-[0.25em] uppercase text-[#D6B77A] font-semibold block">
                VELMORA Studio
              </span>
              <h2 className="font-serif text-lg sm:text-xl font-normal tracking-wide text-[#FAF7F2]">
                Animate Still to Video with Veo
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close Motion Studio"
            className="p-1.5 text-[#B7A397] hover:text-white transition-colors cursor-pointer rounded-full"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Studio Body Grid */}
        <div className="p-6 sm:p-8 space-y-6 max-h-[82vh] overflow-y-auto">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* LEFT COLUMN: Image Input & Aspect Ratio (5 cols) */}
            <div className="lg:col-span-5 space-y-5">
              
              {/* Image Preview & Upload Container */}
              <div>
                <label className="block text-xs font-semibold tracking-wider uppercase text-[#5A3E36] mb-2">
                  Source Beauty Image
                </label>

                <div className="relative group border-2 border-dashed border-[#B7A397]/50 rounded-sm overflow-hidden bg-[#F8F4ED] aspect-square flex items-center justify-center">
                  {selectedImage ? (
                    <img
                      src={getProductImageUrl(selectedImage)}
                      alt="Source for Veo generation"
                      onError={handleImageError}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="text-center p-6 space-y-2">
                      <Upload className="w-8 h-8 mx-auto text-[#B7A397]" />
                      <p className="text-xs text-[#5A3E36]">Upload a product or campaign photo</p>
                    </div>
                  )}

                  {/* Overlay Upload Button */}
                  <div className="absolute inset-0 bg-[#30231F]/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 text-white">
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="px-4 py-2 bg-[#D6B77A] text-[#30231F] text-xs font-semibold uppercase tracking-wider rounded-sm shadow-md cursor-pointer hover:bg-[#c4a362] transition-colors"
                    >
                      Change Photo
                    </button>
                    <span className="text-[10px] text-[#FAF7F2]/80">PNG, JPG, WebP supported</span>
                  </div>
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </div>

              {/* Curated VELMORA Presets */}
              <div>
                <span className="block text-[11px] font-medium text-[#78866B] uppercase tracking-wider mb-2">
                  Or select a VELMORA campaign asset:
                </span>
                <div className="grid grid-cols-4 gap-2">
                  {PRESET_IMAGES.map((preset, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setSelectedImage(preset.src);
                        setPrompt(preset.defaultPrompt);
                      }}
                      className={`relative aspect-square rounded-sm overflow-hidden border-2 transition-all cursor-pointer ${
                        selectedImage === preset.src ? 'border-[#D6B77A] scale-102 shadow-md' : 'border-transparent opacity-75 hover:opacity-100'
                      }`}
                      title={preset.name}
                    >
                      <img
                        src={getProductImageUrl(preset.src)}
                        alt={preset.name}
                        onError={handleImageError}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Aspect Ratio Selector (Compulsory 16:9 or 9:16) */}
              <div>
                <label className="block text-xs font-semibold tracking-wider uppercase text-[#5A3E36] mb-2">
                  Video Aspect Ratio
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setAspectRatio('16:9')}
                    className={`py-2.5 px-3 rounded-sm border text-xs font-medium tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer ${
                      aspectRatio === '16:9'
                        ? 'border-[#D6B77A] bg-[#5A3E36] text-white shadow-sm'
                        : 'border-[#B7A397]/40 bg-white text-[#30231F] hover:border-[#5A3E36]'
                    }`}
                  >
                    <Sliders className="w-3.5 h-3.5 text-[#D6B77A]" />
                    <span>16:9 Landscape</span>
                  </button>

                  <button
                    onClick={() => setAspectRatio('9:16')}
                    className={`py-2.5 px-3 rounded-sm border text-xs font-medium tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer ${
                      aspectRatio === '9:16'
                        ? 'border-[#D6B77A] bg-[#5A3E36] text-white shadow-sm'
                        : 'border-[#B7A397]/40 bg-white text-[#30231F] hover:border-[#5A3E36]'
                    }`}
                  >
                    <Sliders className="w-3.5 h-3.5 text-[#D6B77A] rotate-90" />
                    <span>9:16 Portrait</span>
                  </button>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: Prompt, Model Info & Generated Video Preview (7 cols) */}
            <div className="lg:col-span-7 space-y-5">
              
              {/* Creative Motion Direction Prompt */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-semibold tracking-wider uppercase text-[#5A3E36]">
                    Creative Motion Prompt
                  </label>
                  <span className="text-[10px] text-[#B7A397] font-mono">
                    Model: veo-3.1-fast-generate-preview
                  </span>
                </div>

                <textarea
                  rows={3}
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Describe the desired camera movements, fragrance mist, lighting, or motion dynamics..."
                  className="w-full p-3 bg-white border border-[#B7A397]/50 rounded-sm text-xs text-[#30231F] focus:border-[#D6B77A] focus:outline-none transition-colors leading-relaxed"
                />

                {/* Preset Prompt Suggestions */}
                <div className="mt-2 space-y-1">
                  <span className="text-[10px] text-[#78866B] uppercase tracking-wider block">
                    Quick suggestions:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {STYLE_PROMPTS.map((p, i) => (
                      <button
                        key={i}
                        onClick={() => setPrompt(p)}
                        className="text-[10px] px-2 py-1 bg-[#F8F4ED] hover:bg-[#D6B77A]/20 text-[#5A3E36] rounded border border-[#B7A397]/30 transition-colors text-left"
                      >
                        {p.slice(0, 46)}...
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Generate Action Button */}
              <div>
                <button
                  onClick={handleGenerate}
                  disabled={isGenerating}
                  className={`w-full py-3.5 px-6 rounded-sm text-xs font-semibold uppercase tracking-[0.2em] flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg ${
                    isGenerating
                      ? 'bg-[#B7A397] text-white cursor-not-allowed'
                      : 'bg-[#5A3E36] hover:bg-[#48322B] text-white'
                  }`}
                >
                  {isGenerating ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin text-[#D6B77A]" />
                      <span>Synthesizing Video...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 text-[#D6B77A]" />
                      <span>Generate Video with Veo</span>
                    </>
                  )}
                </button>
              </div>

              {/* Status / Error Notifications */}
              {errorMessage && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-800 text-xs rounded-sm flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold block">Generation Alert</span>
                    <span>{errorMessage}</span>
                  </div>
                </div>
              )}

              {isGenerating && (
                <div className="p-4 bg-[#F8F4ED] border border-[#D6B77A]/40 rounded-sm space-y-2 text-center animate-pulse">
                  <div className="flex items-center justify-center gap-2 text-xs text-[#5A3E36] font-medium">
                    <Video className="w-4 h-4 text-[#D6B77A]" />
                    <span>{generationStep}</span>
                  </div>
                  <p className="text-[11px] text-[#B7A397]">
                    Veo video models generate full cinematic clips. This takes approximately 30-60 seconds.
                  </p>
                </div>
              )}

              {/* Generated Video Player Viewport */}
              {generatedVideoUrl && (
                <div className="space-y-3 pt-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-serif font-semibold text-[#5A3E36] flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-[#78866B]" />
                      Generated Cinematic Video Ready
                    </span>
                    <a
                      href={generatedVideoUrl}
                      download={`velmora_veo_video_${Date.now()}.mp4`}
                      className="inline-flex items-center gap-1 text-[11px] font-medium text-[#5A3E36] hover:text-[#30231F] underline cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5 text-[#D6B77A]" />
                      <span>Download MP4</span>
                    </a>
                  </div>

                  <div className={`relative bg-black rounded-sm overflow-hidden shadow-xl mx-auto ${
                    aspectRatio === '9:16' ? 'max-w-[260px]' : 'w-full'
                  }`}>
                    <video
                      src={generatedVideoUrl}
                      controls
                      autoPlay
                      loop
                      playsInline
                      className="w-full h-auto max-h-[380px] object-contain mx-auto"
                    />
                  </div>
                </div>
              )}

            </div>

          </div>

        </div>

        {/* Footer info strip */}
        <div className="px-6 py-3 bg-[#F8F4ED] border-t border-[#B7A397]/25 flex items-center justify-between text-[11px] text-[#B7A397]">
          <span>VELMORA Haute Parfumerie · AI Motion Atelier</span>
          <span className="font-mono">veo-3.1-fast-generate-preview · 1080p</span>
        </div>
      </motion.div>
    </div>
  );
};
