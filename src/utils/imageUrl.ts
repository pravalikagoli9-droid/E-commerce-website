/**
 * VELMORA Atelier - Universal Product Image Utility
 * Resolves static and dynamic image paths safely across development, production, and Vercel hosting.
 */

// Elegant luxury SVG placeholder (Champagne Gold / Mocha Velvet flacon)
export const LUXURY_FALLBACK_IMAGE = `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 750" width="600" height="750">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#2D211E"/>
      <stop offset="50%" stop-color="#3D2E2B"/>
      <stop offset="100%" stop-color="#1F1614"/>
    </linearGradient>
    <linearGradient id="gold" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#F3E5AB"/>
      <stop offset="50%" stop-color="#D6B77A"/>
      <stop offset="100%" stop-color="#A88B4D"/>
    </linearGradient>
    <linearGradient id="glass" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="rgba(255,255,255,0.08)"/>
      <stop offset="50%" stop-color="rgba(255,255,255,0.2)"/>
      <stop offset="100%" stop-color="rgba(255,255,255,0.05)"/>
    </linearGradient>
  </defs>
  <rect width="600" height="750" fill="url(#bg)"/>
  
  <!-- Subtle luxury border frame -->
  <rect x="20" y="20" width="560" height="710" fill="none" stroke="#D6B77A" stroke-width="1" opacity="0.3"/>
  <rect x="26" y="26" width="548" height="698" fill="none" stroke="#D6B77A" stroke-width="0.5" opacity="0.15"/>
  
  <!-- Stylized Flacon -->
  <g transform="translate(300, 360)">
    <!-- Cap -->
    <rect x="-35" y="-170" width="70" height="55" rx="3" fill="url(#gold)"/>
    <!-- Collar -->
    <rect x="-20" y="-115" width="40" height="20" fill="url(#gold)"/>
    <!-- Bottle Body -->
    <path d="M -90,-80 L 90,-80 L 105,130 L -105,130 Z" fill="url(#glass)" stroke="url(#gold)" stroke-width="1.5"/>
    <!-- Liquid glow -->
    <path d="M -80,-30 L 80,-30 L 95,120 L -95,120 Z" fill="#D6B77A" opacity="0.15"/>
    <!-- Center Label -->
    <rect x="-55" y="-10" width="110" height="70" fill="#241B18" stroke="#D6B77A" stroke-width="1"/>
    <text x="0" y="20" font-family="serif" font-size="14" fill="#F3E5AB" text-anchor="middle" letter-spacing="3">VELMORA</text>
    <text x="0" y="38" font-family="sans-serif" font-size="8" fill="#D6B77A" text-anchor="middle" letter-spacing="2">PARFUM ATELIER</text>
  </g>
  
  <!-- Brand footer -->
  <text x="300" y="650" font-family="serif" font-size="16" fill="#F3E5AB" text-anchor="middle" letter-spacing="6">VELMORA</text>
  <text x="300" y="675" font-family="sans-serif" font-size="9" fill="#A89284" text-anchor="middle" letter-spacing="3">HAUTE BEAUTÉ</text>
</svg>
`)}`;

/**
 * Normalizes an image path to work consistently in both Vite development and Vercel production.
 */
export function getProductImageUrl(rawUrl?: string): string {
  if (!rawUrl || typeof rawUrl !== 'string' || rawUrl.trim() === '') {
    return '/images/velmora_perfume_ambre_1791912395312.jpg';
  }

  const clean = rawUrl.trim();

  // If already absolute URL or data URL
  if (clean.startsWith('http://') || clean.startsWith('https://') || clean.startsWith('data:')) {
    return clean;
  }

  // If path points to /src/assets/images/..., map to /images/... for clean production resolution
  if (clean.startsWith('/src/assets/images/')) {
    const filename = clean.replace('/src/assets/images/', '');
    return `/images/${filename}`;
  }

  if (clean.startsWith('src/assets/images/')) {
    const filename = clean.replace('src/assets/images/', '');
    return `/images/${filename}`;
  }

  if (clean.startsWith('/assets/images/')) {
    const filename = clean.replace('/assets/images/', '');
    return `/images/${filename}`;
  }

  // Ensure leading slash
  return clean.startsWith('/') ? clean : `/${clean}`;
}

/**
 * Image error handler that gracefully replaces missing images with the luxury fallback
 * and avoids infinite retry loops.
 */
export function handleImageError(e: React.SyntheticEvent<HTMLImageElement, Event>) {
  const target = e.currentTarget;
  if (!target.dataset.failedOnce) {
    target.dataset.failedOnce = 'true';
    // If it failed trying /src/assets/images, try /images/
    if (target.src.includes('/src/assets/images/')) {
      const parts = target.src.split('/src/assets/images/');
      target.src = `/images/${parts[1]}`;
      return;
    }
    // If it was /images, try /public or fallback
    target.src = LUXURY_FALLBACK_IMAGE;
  } else {
    target.src = LUXURY_FALLBACK_IMAGE;
  }
}
