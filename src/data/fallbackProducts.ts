import type { Product, Category } from '../types';

export const FALLBACK_CATEGORIES: Category[] = [
  {
    id: 'cat_fragrances',
    name: 'Luxury Fragrances',
    slug: 'fragrances',
    description: 'Artisanal niche fragrances crafted with fine natural resins, floral absolutes, and rare aged woods.',
    image: '/images/velmora_perfume_ambre_1791912395312.jpg',
    status: 'ACTIVE'
  },
  {
    id: 'cat_apparel',
    name: 'Lifestyle & Apparel',
    slug: 'apparel',
    description: 'Timeless wardrobe staples and loungewear in pure double-face wool, Mongolian cashmere, and mulberry silk.',
    image: '/images/category_apparel_1791824731775.jpg',
    status: 'ACTIVE'
  },
  {
    id: 'cat_skincare',
    name: 'Botanical Skincare',
    slug: 'skincare',
    description: 'Restorative serums, barrier creams, and facial sculpting tools crafted with clean botanical ingredients.',
    image: '/images/velmora_botanical_serum_1791912396485.jpg',
    status: 'ACTIVE'
  }
];

export const FALLBACK_PRODUCTS: Product[] = [
  {
    id: 'prod_nocturne_ambre',
    name: 'Nocturne Ambré Eau de Parfum',
    slug: 'nocturne-ambre-eau-de-parfum',
    description: 'An intoxicating, contemplative nocturnal olfactory portrait. Opens with spicy cardamom and smoked plum, deepening into ancient amber resin, roasted tonka bean, and Atlas cedarwood.',
    categoryId: 'cat_fragrances',
    categoryName: 'Luxury Fragrances',
    price: 18500,
    compareAtPrice: 21000,
    images: ['/images/velmora_perfume_ambre_1791912395312.jpg'],
    stock: 24,
    sku: 'VEL-FRG-001',
    status: 'ACTIVE',
    averageRating: 4.9,
    reviewCount: 18,
    isFeatured: true,
    isBestseller: true,
    isGiftPick: true,
    fragranceFamily: 'Smoky Amber & Oriental Woods',
    sillage: 'Enveloping',
    longevity: '14-16 hours',
    occasions: ['Evening Events', 'Intimate Dinners', 'Formal Gatherings'],
    notes: [
      'Top: Cardamom, Smoked Plum, Bergamot',
      'Heart: Moroccan Amber, Orris Root, Cistus',
      'Base: Bourbon Vanilla, Atlas Cedar, Dark Musk'
    ],
    details: {
      'Concentration': 'Eau de Parfum (24% maceration)',
      'Volume': '100ml / 3.4 FL. OZ.',
      'Origin': 'Grasse & Paris, France',
      'Packaging': 'Smoked glass bottle with brushed brass cap'
    },
    ingredients: 'Alcohol Denat., Parfum (Fragrance), Aqua (Water), Limonene, Linalool, Coumarin, Benzyl Benzoate, Eugenol.',
    variants: [
      { id: 'v_50ml', name: '50ml Flacon', type: 'volume', priceDiff: -5000, stock: 12 },
      { id: 'v_100ml', name: '100ml Grand Flacon', type: 'volume', priceDiff: 0, stock: 12 }
    ],
    createdAt: '2026-01-10T10:00:00.000Z'
  },
  {
    id: 'prod_aeterna_noir',
    name: 'Aeterna Ambre Noir Extrait',
    slug: 'aeterna-ambre-noir-extrait',
    description: 'A dark, resinous masterpiece crafted from rare wild labdanum, sacred temple incense, and rare Florentine orris butter. Revered for its mesmerizing sillage and longevity.',
    categoryId: 'cat_fragrances',
    categoryName: 'Luxury Fragrances',
    price: 16200,
    images: ['/images/category_fragrances_1791824720667.jpg'],
    stock: 19,
    sku: 'VEL-FRG-002',
    status: 'ACTIVE',
    averageRating: 4.8,
    reviewCount: 14,
    isFeatured: true,
    isNewArrival: true,
    isGiftPick: true,
    fragranceFamily: 'Balsamic Leather & Sacred Incense',
    sillage: 'Royal',
    longevity: '16+ hours on skin',
    occasions: ['Autumn Evenings', 'Art Openings', 'Black-Tie Gatherings'],
    notes: [
      'Top: Black Pepper, Elemi, Bitter Orange',
      'Heart: Florentine Orris, Labdanum Resin',
      'Base: Benzoin Tears, Vetiver, Birch Tar'
    ],
    details: {
      'Concentration': 'Extrait de Parfum (30% maceration)',
      'Volume': '100ml / 3.4 FL. OZ.',
      'Origin': 'VELMORA Atelier, Grasse',
      'Sillage': 'Intense & Enveloping'
    },
    createdAt: '2026-01-15T11:00:00.000Z'
  },
  {
    id: 'prod_santal_neroli',
    name: 'Santal Blanc & Néroli',
    slug: 'santal-blanc-neroli',
    description: 'Luminous solar purity counterpointed with creamed Mysore sandalwood. A clean, architectural fragrance evoking morning light through sheer linen curtains.',
    categoryId: 'cat_fragrances',
    categoryName: 'Luxury Fragrances',
    price: 19000,
    compareAtPrice: 22000,
    images: ['/images/hero_luxury_boutique_1791824705943.jpg'],
    stock: 14,
    sku: 'VEL-FRG-003',
    status: 'ACTIVE',
    averageRating: 4.7,
    reviewCount: 9,
    isFeatured: false,
    isNewArrival: true,
    fragranceFamily: 'Solar Citrus & Creamed Woods',
    sillage: 'Moderate',
    longevity: '10-12 hours',
    occasions: ['Daily Wear', 'Spring Morning Meetings', 'Weekend Brunches'],
    notes: [
      'Top: Tunisian Néroli, Petitgrain, Bergamot',
      'Heart: White Ambergris, Orris Butter, Jasmine',
      'Base: Mysore Sandalwood, White Cedar, Cashmeran'
    ],
    details: {
      'Concentration': 'Eau de Parfum (22%)',
      'Volume': '100ml / 3.4 FL. OZ.',
      'Origin': 'Grasse, France'
    },
    createdAt: '2026-01-20T14:00:00.000Z'
  },
  {
    id: 'prod_rose_minuit',
    name: 'Rose de Minuit Extrait',
    slug: 'rose-de-minuit-extrait',
    description: 'Crimson Turkish damascena roses macerated under moonlight with smoky leather, saffron threads, and patchouli heart. An opulent floral designed for evening wear.',
    categoryId: 'cat_fragrances',
    categoryName: 'Luxury Fragrances',
    price: 24500,
    images: ['/images/velmora_perfume_rose_1791912395755.jpg'],
    stock: 8,
    sku: 'VEL-FRG-004',
    status: 'ACTIVE',
    averageRating: 5.0,
    reviewCount: 22,
    isFeatured: true,
    isBestseller: true,
    isGiftPick: true,
    fragranceFamily: 'Opulent Floral Chypre',
    sillage: 'Royal',
    longevity: '18 hours',
    occasions: ['Grand Galas', 'Anniversaries', 'Opera Nights'],
    notes: [
      'Top: Persian Saffron, Pink Peppercorn',
      'Heart: Midnight Damask Rose, Taif Rose Absolute',
      'Base: Aged Patchouli, Dark Ambergris, Castoreum Accord'
    ],
    details: {
      'Concentration': 'Pure Extrait (32%)',
      'Volume': '100ml / 3.4 FL. OZ.',
      'Origin': 'Paris & Grasse'
    },
    createdAt: '2026-02-01T09:00:00.000Z'
  },
  {
    id: 'prod_obsidian_overcoat',
    name: 'The Obsidian Architectural Coat',
    slug: 'the-obsidian-architectural-coat',
    description: 'Double-breasted tailored long overcoat executed in 750gsm double-face virgin wool. Structured with full horsehair canvas and sculpted horn buttons.',
    categoryId: 'cat_apparel',
    categoryName: 'Lifestyle & Apparel',
    price: 64000,
    compareAtPrice: 72000,
    images: ['/images/category_apparel_1791824731775.jpg'],
    stock: 6,
    sku: 'VEL-APP-001',
    status: 'ACTIVE',
    averageRating: 4.9,
    reviewCount: 7,
    isFeatured: true,
    isBestseller: true,
    details: {
      'Composition': '100% Virgin Merino Wool (750gsm)',
      'Lining': '100% Pure Bemberg Cupro',
      'Construction': 'Full Horsehair Floating Canvas',
      'Origin': 'Biella, Italy & London, UK'
    },
    variants: [
      { id: 'v_sz_s', name: 'Size 46 / Small', type: 'size', priceDiff: 0, stock: 2 },
      { id: 'v_sz_m', name: 'Size 48 / Medium', type: 'size', priceDiff: 0, stock: 3 },
      { id: 'v_sz_l', name: 'Size 50 / Large', type: 'size', priceDiff: 0, stock: 1 }
    ],
    createdAt: '2026-01-05T12:00:00.000Z'
  },
  {
    id: 'prod_charmeuse_robe',
    name: 'Nocturne Silk Charmeuse Robe',
    slug: 'nocturne-silk-charmeuse-robe',
    description: 'Fluid floor-length evening kimono robe cut from heavyweight 22mm Italian mulberry silk charmeuse with contrast velvet piping and weighted waist sash.',
    categoryId: 'cat_apparel',
    categoryName: 'Lifestyle & Apparel',
    price: 38000,
    images: ['/images/velmora_luxury_apparel_1791912397560.jpg'],
    stock: 15,
    sku: 'VEL-APP-002',
    status: 'ACTIVE',
    averageRating: 4.8,
    reviewCount: 11,
    isFeatured: true,
    isGiftPick: true,
    details: {
      'Fabric': '100% Mulberry Silk Charmeuse (22 momme)',
      'Accents': 'Silk Velvet Collar Facing',
      'Care': 'Specialist Dry Clean Only',
      'Origin': 'Como, Italy'
    },
    variants: [
      { id: 'v_sz_1', name: 'Size I (EU 36-40)', type: 'size', priceDiff: 0, stock: 8 },
      { id: 'v_sz_2', name: 'Size II (EU 42-46)', type: 'size', priceDiff: 0, stock: 7 }
    ],
    createdAt: '2026-01-12T16:00:00.000Z'
  },
  {
    id: 'prod_cashmere_turtleneck',
    name: 'Minimalist Cashmere Turtleneck',
    slug: 'minimalist-cashmere-turtleneck',
    description: 'Seamless gauge-7 knit sweater fashioned from Grade-A Mongolian cashmere. Exceptionally soft with ribbed collar and raglan sleeve construction.',
    categoryId: 'cat_apparel',
    categoryName: 'Lifestyle & Apparel',
    price: 28500,
    images: ['/images/velmora_cashmere_knit_1791912551404.jpg'],
    stock: 12,
    sku: 'VEL-APP-003',
    status: 'ACTIVE',
    averageRating: 4.7,
    reviewCount: 16,
    isNewArrival: true,
    details: {
      'Material': '100% Grade-A Mongolian Cashmere (2-ply)',
      'Gauge': '7-gauge flatbed knit',
      'Origin': 'Inner Mongolia / Scotland'
    },
    variants: [
      { id: 'v_sz_s', name: 'Small', type: 'size', priceDiff: 0, stock: 4 },
      { id: 'v_sz_m', name: 'Medium', type: 'size', priceDiff: 0, stock: 5 },
      { id: 'v_sz_l', name: 'Large', type: 'size', priceDiff: 0, stock: 3 }
    ],
    createdAt: '2026-01-18T10:00:00.000Z'
  },
  {
    id: 'prod_pleated_trousers',
    name: 'Sartorial Tailored Pleated Trousers',
    slug: 'sartorial-tailored-pleated-trousers',
    description: 'High-waisted double-pleated trousers in four-season tropical worsted wool. Features side adjusters, curtain waistband, and clean 2-inch cuff hems.',
    categoryId: 'cat_apparel',
    categoryName: 'Lifestyle & Apparel',
    price: 32000,
    compareAtPrice: 36000,
    images: ['/images/velmora_tailored_trousers_1791912550672.jpg'],
    stock: 10,
    sku: 'VEL-APP-004',
    status: 'ACTIVE',
    averageRating: 4.8,
    reviewCount: 6,
    details: {
      'Cloth': '100% Super 130s Worsted Wool (280gsm)',
      'Hardware': 'Solid Brass Side Buckles',
      'Origin': 'Huddersfield, England'
    },
    createdAt: '2026-01-22T13:00:00.000Z'
  },
  {
    id: 'prod_aeterna_serum',
    name: 'Aeterna Botanical Restorative Serum',
    slug: 'aeterna-botanical-restorative-serum',
    description: 'Active lipid concentrate combining cold-pressed prickly pear seed oil, squalane from Portuguese olives, and marine astaxanthin for deep cellular restoration.',
    categoryId: 'cat_skincare',
    categoryName: 'Botanical Skincare',
    price: 9800,
    compareAtPrice: 11500,
    images: ['/images/velmora_botanical_serum_1791912396485.jpg'],
    stock: 35,
    sku: 'VEL-SKN-001',
    status: 'ACTIVE',
    averageRating: 4.9,
    reviewCount: 31,
    isFeatured: true,
    isBestseller: true,
    details: {
      'Volume': '30ml / 1.0 FL. OZ.',
      'Active Lipids': 'Opuntia Ficus-Indica, Squalane, Bakuchiol 1%',
      'Texture': 'Fast-absorbing dry velvet elixir',
      'Origin': 'Provence & Grasse'
    },
    variants: [
      { id: 'v_30ml', name: '30ml Dropper', type: 'volume', priceDiff: 0, stock: 25 },
      { id: 'v_50ml', name: '50ml Atelier Size', type: 'volume', priceDiff: 3800, stock: 10 }
    ],
    createdAt: '2026-01-08T15:00:00.000Z'
  },
  {
    id: 'prod_creme_sublime',
    name: 'Crème Sublime Nuit Restoratrice',
    slug: 'creme-sublime-nuit-restoratrice',
    description: 'Barrier-replenishing night balm with triple ceramide complexes, shea butter unsaponifiables, and evening primrose oil to firm and hydrate tired complexions.',
    categoryId: 'cat_skincare',
    categoryName: 'Botanical Skincare',
    price: 12400,
    images: ['/images/velmora_face_cream_1791912396507.jpg'],
    stock: 22,
    sku: 'VEL-SKN-002',
    status: 'ACTIVE',
    averageRating: 4.8,
    reviewCount: 19,
    isFeatured: true,
    isGiftPick: true,
    details: {
      'Weight': '50ml / 1.7 OZ. NET WT.',
      'Key Actives': 'Ceramides NP/AP/EOP, Niacinamide 4%, Blue Tansy',
      'Formula': 'Micro-emulsion velvet balm',
      'Origin': 'Switzerland & France'
    },
    createdAt: '2026-01-14T09:00:00.000Z'
  },
  {
    id: 'prod_obsidian_gua_sha',
    name: 'Obsidian Facial Sculpting Talisman',
    slug: 'obsidian-facial-sculpting-talisman',
    description: 'Hand-carved and diamond-polished from single-origin natural black volcanic obsidian. Designed with ergonomic edges for lymphatic drainage and facial contouring.',
    categoryId: 'cat_skincare',
    categoryName: 'Botanical Skincare',
    price: 4200,
    images: ['/images/velmora_obsidian_guasha_1791912397941.jpg'],
    stock: 40,
    sku: 'VEL-SKN-003',
    status: 'ACTIVE',
    averageRating: 5.0,
    reviewCount: 42,
    isBestseller: true,
    isGiftPick: true,
    details: {
      'Mineral': '100% Natural Black Volcanic Obsidian',
      'Finish': 'Mirror-honed ergonomic edge',
      'Includes': 'Custom velvet pouch and ritual instructional booklet'
    },
    createdAt: '2026-01-19T11:00:00.000Z'
  },
  {
    id: 'prod_rosewater_gold',
    name: 'Rosewater & 24K Colloidal Gold Mist',
    slug: 'rosewater-colloidal-gold-mist',
    description: 'Hydrosol steam-distilled from freshly plucked Grasse centifolia roses, suspended with pure 24-karat colloidal gold flakes and hyaluronic acid.',
    categoryId: 'cat_skincare',
    categoryName: 'Botanical Skincare',
    price: 7600,
    images: ['/images/category_skincare_1791824742582.jpg'],
    stock: 28,
    sku: 'VEL-SKN-004',
    status: 'ACTIVE',
    averageRating: 4.6,
    reviewCount: 15,
    isNewArrival: true,
    details: {
      'Volume': '120ml / 4.0 FL. OZ.',
      'Active Ingredients': 'Rosa Centifolia Floral Water, 24K Gold, Tremella Mushroom Extract'
    },
    createdAt: '2026-01-25T14:00:00.000Z'
  }
];
