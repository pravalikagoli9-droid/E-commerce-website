import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import type {
  User,
  Product,
  Category,
  Order,
  Review,
  Coupon,
  ContactRequest,
  NewsletterSubscriber,
  CartItem,
  ProductAlert,
  LoyaltyTier,
  LoyaltyTransaction
} from '../types';

interface UserWithAuth extends User {
  passwordHash: string;
}

interface DatabaseSchema {
  users: UserWithAuth[];
  products: Product[];
  categories: Category[];
  orders: Order[];
  reviews: Review[];
  coupons: Coupon[];
  carts: Record<string, { items: CartItem[]; updatedAt: string }>;
  wishlists: Record<string, string[]>;
  productAlerts: ProductAlert[];
  contactRequests: ContactRequest[];
  subscribers: NewsletterSubscriber[];
}

const DB_DIR = path.resolve(process.cwd(), '.data');
const DB_FILE = path.join(DB_DIR, 'boutique_store.json');

// Ensure DB directory exists
if (!fs.existsSync(DB_DIR)) {
  fs.mkdirSync(DB_DIR, { recursive: true });
}

export function hashPassword(password: string): string {
  const salt = 'velmora_salt_2026';
  return crypto.scryptSync(password, salt, 32).toString('hex');
}

export function verifyPassword(password: string, hash: string): boolean {
  return hashPassword(password) === hash;
}

const initialSeedData: DatabaseSchema = {
  users: [
    {
      id: 'usr_admin_01',
      name: 'Adrien de Noir (Director)',
      email: 'admin@velmora.com',
      passwordHash: hashPassword('NoirAtelier2026!'),
      role: 'ADMIN',
      accountStatus: 'ACTIVE',
      emailVerifiedAt: '2026-01-01T00:00:00.000Z',
      loyaltyPoints: 3400,
      loyaltyTier: 'IMPÉRIAL',
      loyaltyHistory: [
        {
          id: 'ly_adm_1',
          date: '2026-01-01',
          description: 'VELMORA Founder Privilege Allowance',
          points: 3400,
          type: 'EARNED'
        }
      ],
      favoriteCategories: ['fragrances', 'apparel'],
      notificationPreferences: {
        priceDropAlerts: true,
        backInStockAlerts: true,
        orderUpdates: true,
        gazetteNewsletter: true
      },
      addresses: [
        {
          id: 'addr_adm_1',
          fullName: 'Adrien de Noir',
          addressLine1: 'VELMORA Atelier, 18 Rue de la Paix',
          city: 'Mumbai',
          state: 'Maharashtra',
          postalCode: '400001',
          country: 'India',
          phone: '+91 98200 12345',
          isDefault: true
        }
      ],
      createdAt: '2026-01-01T00:00:00.000Z'
    },
    {
      id: 'usr_client_01',
      name: 'Eleanor Vance',
      email: 'client@velmora.com',
      passwordHash: hashPassword('Customer2026!'),
      role: 'CUSTOMER',
      accountStatus: 'ACTIVE',
      emailVerifiedAt: '2026-02-15T12:00:00.000Z',
      loyaltyPoints: 1250,
      loyaltyTier: 'OR',
      loyaltyHistory: [
        {
          id: 'ly_cli_1',
          date: '2026-02-15',
          description: 'Welcome VELMORA Member Bonus',
          points: 500,
          type: 'EARNED'
        },
        {
          id: 'ly_cli_2',
          date: '2026-10-10',
          description: 'Order VEL-84920 Points',
          points: 750,
          type: 'EARNED'
        }
      ],
      favoriteCategories: ['fragrances', 'skincare'],
      notificationPreferences: {
        priceDropAlerts: true,
        backInStockAlerts: true,
        orderUpdates: true,
        gazetteNewsletter: true
      },
      addresses: [
        {
          id: 'addr_cli_1',
          fullName: 'Eleanor Vance',
          addressLine1: 'Flat 4B, Malabar Hill Crest',
          addressLine2: 'Ridge Road',
          city: 'Mumbai',
          state: 'Maharashtra',
          postalCode: '400006',
          country: 'India',
          phone: '+91 98111 87654',
          isDefault: true
        }
      ],
      createdAt: '2026-02-15T12:00:00.000Z'
    }
  ],
  categories: [
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
  ],
  products: [
    {
      id: 'prod_nocturne_ambre',
      name: 'Nocturne Ambré Eau de Parfum',
      slug: 'nocturne-ambre-eau-de-parfum',
      description: 'An intoxicating, contemplative nocturnal olfactory portrait. Opens with spicy cardamom and smoked plum, deepening into ancient amber resin, roasted tonka bean, and Atlas cedarwood.',
      categoryId: 'cat_fragrances',
      categoryName: 'Luxury Fragrances',
      price: 18500,
      compareAtPrice: 21000,
      images: [
        '/images/velmora_perfume_ambre_1791912395312.jpg'
      ],
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
      images: [
        '/images/category_fragrances_1791824720667.jpg'
      ],
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
      images: [
        '/images/hero_luxury_boutique_1791824705943.jpg'
      ],
      stock: 14,
      sku: 'VEL-FRG-003',
      status: 'ACTIVE',
      averageRating: 5.0,
      reviewCount: 11,
      isFeatured: false,
      isBestseller: true,
      isGiftPick: true,
      fragranceFamily: 'Luminous Citrus & White Woods',
      sillage: 'Moderate',
      longevity: '10-12 hours on skin',
      occasions: ['Executive Boardrooms', 'Summer Escapes', 'Daytime Receptions'],
      notes: [
        'Top: Bitter Orange Flower, Petitgrain, Bergamot',
        'Heart: Tunisian Néroli, White Iris',
        'Base: Mysore Sandalwood, Iso E Super, Cashmeran'
      ],
      details: {
        'Volume': '100ml',
        'Origin': 'France',
        'Character': 'Crisp, Aristocratic, Pure'
      },
      createdAt: '2026-01-20T09:00:00.000Z'
    },
    {
      id: 'prod_rose_minuit',
      name: 'Rose de Minuit Extrait',
      slug: 'rose-de-minuit-extrait',
      description: 'Midnight harvesting of May roses layered over precious Persian saffron, smoky Cypriol oil, and deep velvet musk. Unashamedly opulent and dark.',
      categoryId: 'cat_fragrances',
      categoryName: 'Luxury Fragrances',
      price: 24500,
      images: [
        '/images/velmora_perfume_rose_1791912395755.jpg'
      ],
      stock: 8,
      sku: 'VEL-FRG-004',
      status: 'ACTIVE',
      averageRating: 4.9,
      reviewCount: 9,
      isFeatured: false,
      isGiftPick: true,
      fragranceFamily: 'Opulent Dark Floral & Saffron Wood',
      sillage: 'Enveloping',
      longevity: '18 hours on skin',
      occasions: ['Anniversaries', 'Intimate Dinners', 'Opera Nights'],
      notes: [
        'Top: Saffron, Pink Peppercorn',
        'Heart: Centifolia Rose Absolute, Bulgarian Rose',
        'Base: Cypriol, Oud Accord, Ambrette'
      ],
      details: {
        'Volume': '100ml',
        'Cask Age': '18 Months Aged Maceration',
        'Limited Batch': 'Edition of 300 bottles'
      },
      createdAt: '2026-02-01T14:00:00.000Z'
    },
    {
      id: 'prod_obsidian_overcoat',
      name: 'The Obsidian Architectural Coat',
      slug: 'the-obsidian-architectural-coat',
      description: 'Hand-tailored from double-faced 750gsm virgin wool with an asymmetric waterfall silk lapel drape. Structured shoulders and floating canvas construction provide effortless authority.',
      categoryId: 'cat_apparel',
      categoryName: 'Lifestyle & Apparel',
      price: 64000,
      compareAtPrice: 72000,
      images: [
        '/images/category_apparel_1791824731775.jpg'
      ],
      stock: 6,
      sku: 'VEL-APP-001',
      status: 'ACTIVE',
      averageRating: 5.0,
      reviewCount: 7,
      isFeatured: true,
      isBestseller: true,
      isGiftPick: true,
      fabricComposition: '100% Virgin Double-Face Wool (750gsm) & 100% Como Silk Faille Drape',
      careInstructions: 'Specialist ecological dry clean only. Store on wide cedar coat hanger with provided breathable garment cover.',
      sizeGuide: [
        { size: '46 / Small', chest: '96 cm / 38 in', waist: '82 cm / 32 in', length: '118 cm / 46 in' },
        { size: '48 / Medium', chest: '102 cm / 40 in', waist: '88 cm / 35 in', length: '120 cm / 47 in' },
        { size: '50 / Large', chest: '108 cm / 42.5 in', waist: '94 cm / 37 in', length: '122 cm / 48 in' }
      ],
      details: {
        'Fabric': '100% Virgin Wool with 100% Mulberry Silk Faille Drape',
        'Tailoring': 'Hand-basted canvas chest piece, horn buttons',
        'Fit': 'Contemporary relaxed silhouette with sharp architectural shoulder',
        'Care': 'Specialist dry clean only'
      },
      variants: [
        { id: 'v_sz_s', name: 'Size 46 / Small', type: 'size', priceDiff: 0, stock: 2 },
        { id: 'v_sz_m', name: 'Size 48 / Medium', type: 'size', priceDiff: 0, stock: 3 },
        { id: 'v_sz_l', name: 'Size 50 / Large', type: 'size', priceDiff: 0, stock: 1 }
      ],
      createdAt: '2026-01-12T15:00:00.000Z'
    },
    {
      id: 'prod_charmeuse_robe',
      name: 'Nocturne Silk Charmeuse Robe',
      slug: 'nocturne-silk-charmeuse-robe',
      description: 'Cut from heavyweight 22-momme pure mulberry silk in raven black. French seams throughout with deep patch pockets and a liquid drape that glides across skin.',
      categoryId: 'cat_apparel',
      categoryName: 'Lifestyle & Apparel',
      price: 38000,
      images: [
        '/images/velmora_luxury_apparel_1791912397560.jpg'
      ],
      stock: 15,
      sku: 'VEL-APP-002',
      status: 'ACTIVE',
      averageRating: 4.9,
      reviewCount: 12,
      isFeatured: false,
      isNewArrival: true,
      isGiftPick: true,
      fabricComposition: '100% Grade-6A Mulberry Silk Charmeuse (22 Momme)',
      careInstructions: 'Hand wash with ph-neutral silk detergent in cold water, or delicate dry clean. Iron damp on reverse.',
      sizeGuide: [
        { size: 'Size I (EU 36-40)', chest: '90-100 cm', waist: '70-85 cm', length: '130 cm' },
        { size: 'Size II (EU 42-46)', chest: '102-114 cm', waist: '86-102 cm', length: '135 cm' }
      ],
      details: {
        'Fabric': '100% Mulberry Silk Charmeuse (22 Momme)',
        'Finish': 'Matte-sheen liquid luster',
        'Origin': 'Como, Italy'
      },
      variants: [
        { id: 'v_sz_1', name: 'Size I (EU 36-40)', type: 'size', priceDiff: 0, stock: 8 },
        { id: 'v_sz_2', name: 'Size II (EU 42-46)', type: 'size', priceDiff: 0, stock: 7 }
      ],
      createdAt: '2026-02-05T16:00:00.000Z'
    },
    {
      id: 'prod_cashmere_turtleneck',
      name: 'Minimalist Cashmere Turtleneck',
      slug: 'minimalist-cashmere-turtleneck',
      description: 'Spun from two-ply Grade-A Mongolian inner fleece cashmere. Seamless body knitting with zero pressure points, featherweight warmth, and enduring shape retention.',
      categoryId: 'cat_apparel',
      categoryName: 'Lifestyle & Apparel',
      price: 28500,
      images: [
        '/images/velmora_cashmere_knit_1791912551404.jpg'
      ],
      stock: 12,
      sku: 'VEL-APP-003',
      status: 'ACTIVE',
      averageRating: 4.8,
      reviewCount: 8,
      isFeatured: false,
      fabricComposition: '100% Grade-A Mongolian Cashmere (15.2 Micron, 2-Ply)',
      careInstructions: 'Hand wash cold with cashmere wash; dry flat on towel. Never wring or tumble dry.',
      sizeGuide: [
        { size: 'Small', chest: '94 cm', waist: '80 cm', length: '66 cm' },
        { size: 'Medium', chest: '100 cm', waist: '86 cm', length: '68 cm' },
        { size: 'Large', chest: '106 cm', waist: '92 cm', length: '70 cm' }
      ],
      details: {
        'Yarn': '100% Grade-A Mongolian Cashmere (15.2 Micron)',
        'Gauge': '12-Gauge Fine Knit',
        'Color': 'Carbon Charcoal'
      },
      variants: [
        { id: 'v_sz_s', name: 'Small', type: 'size', priceDiff: 0, stock: 4 },
        { id: 'v_sz_m', name: 'Medium', type: 'size', priceDiff: 0, stock: 5 },
        { id: 'v_sz_l', name: 'Large', type: 'size', priceDiff: 0, stock: 3 }
      ],
      createdAt: '2026-02-10T11:00:00.000Z'
    },
    {
      id: 'prod_pleated_trousers',
      name: 'Sartorial Tailored Pleated Trousers',
      slug: 'sartorial-tailored-pleated-trousers',
      description: 'Precision high-rise trousers with deep forward double pleats, side adjusters in matte brass, and a graceful wide-leg break cut in high-twist British wool-twill.',
      categoryId: 'cat_apparel',
      categoryName: 'Lifestyle & Apparel',
      price: 32000,
      compareAtPrice: 36000,
      images: [
        '/images/velmora_tailored_trousers_1791912550672.jpg'
      ],
      stock: 10,
      sku: 'VEL-APP-004',
      status: 'ACTIVE',
      averageRating: 4.9,
      reviewCount: 6,
      fabricComposition: '100% High-Twist British Wool Twill (340gsm)',
      careInstructions: 'Dry clean only. Press with cloth barrier to prevent shine.',
      sizeGuide: [
        { size: '30 / UK 30', chest: 'N/A', waist: '76 cm', length: '104 cm' },
        { size: '32 / UK 32', chest: 'N/A', waist: '81 cm', length: '106 cm' },
        { size: '34 / UK 34', chest: 'N/A', waist: '86 cm', length: '108 cm' }
      ],
      details: {
        'Fabric': '100% High-Twist Wool Twill (340gsm)',
        'Waist': 'Curved waistband with dual side cinch buckles',
        'Pockets': 'Jetted rear pockets with genuine horn buttons'
      },
      createdAt: '2026-02-12T13:00:00.000Z'
    },
    {
      id: 'prod_aeterna_serum',
      name: 'Aeterna Botanical Restorative Serum',
      slug: 'aeterna-botanical-restorative-serum',
      description: 'A transformative, bio-compatible facial concentrate. Formulated with cold-extracted prickly pear seed oil, wild frankincense resin, squalane, and active bakuchiol to nourish cellular matrix overnight.',
      categoryId: 'cat_skincare',
      categoryName: 'Botanical Skincare',
      price: 9800,
      compareAtPrice: 11500,
      images: [
        '/images/velmora_botanical_serum_1791912396485.jpg'
      ],
      stock: 35,
      sku: 'VEL-SKN-001',
      status: 'ACTIVE',
      averageRating: 4.9,
      reviewCount: 32,
      isFeatured: true,
      isBestseller: true,
      isGiftPick: true,
      skinType: 'All skin types, especially sensitive or barrier-compromised skin',
      usageRitual: 'Dispense 3-4 drops into warmed palms. Gently press onto face and décolletage after cleansing in the evening.',
      dermatologicalWarnings: 'For external cosmetic use only. Patch test on inner wrist 24 hours prior to first full application.',
      details: {
        'Volume': '30ml / 1 FL. OZ.',
        'Texture': 'Silken lipid elixir with instantaneous dermal absorption',
        'Key Actives': 'Prickly Pear Seed Oil (85% Vitamin E content), Frankincense Frereana, Bakuchiol 2%',
        'Usage': 'Apply 3-4 drops onto cleansed skin before nocturnal rest'
      },
      ingredients: 'Opuntia Ficus-Indica (Prickly Pear) Seed Oil*, Squalane (Olive-Derived), Boswellia Frereana (Frankincense) Resin Extract, Rosa Damascena Flower Oil, Bakuchiol, Tocopherol (Vitamin E). *Organically cultivated.',
      variants: [
        { id: 'v_30ml', name: '30ml Dropper', type: 'volume', priceDiff: 0, stock: 25 },
        { id: 'v_50ml', name: '50ml Atelier Size', type: 'volume', priceDiff: 3800, stock: 10 }
      ],
      createdAt: '2026-01-08T08:00:00.000Z'
    },
    {
      id: 'prod_creme_sublime',
      name: 'Crème Sublime Nuit Restoratrice',
      slug: 'creme-sublime-nuit-restoratrice',
      description: 'An ultra-dense velvet barrier cream powered by fermented black truffle peptides, snow mushroom polysaccharide, and deep sea microalgae. Locks hydration and softens expression lines.',
      categoryId: 'cat_skincare',
      categoryName: 'Botanical Skincare',
      price: 12400,
      images: [
        '/images/velmora_face_cream_1791912396507.jpg'
      ],
      stock: 22,
      sku: 'VEL-SKN-002',
      status: 'ACTIVE',
      averageRating: 4.8,
      reviewCount: 16,
      isFeatured: false,
      isNewArrival: true,
      isGiftPick: true,
      skinType: 'Dry, dehydrated, or mature epidermis',
      usageRitual: 'Warm a pea-sized amount between fingertips to melt the truffle lipid crystal matrix. Smooth upward over neck and jawline.',
      dermatologicalWarnings: 'Formulated without synthetic fragrance or parabens. Avoid direct ocular contact.',
      details: {
        'Volume': '50ml Net Wt. 1.7 oz.',
        'Pot': 'Double-walled smoked glass jar with magnetic spatula',
        'Aroma': 'Subtle naturally occurring neroli and damp moss notes'
      },
      createdAt: '2026-01-18T10:00:00.000Z'
    },
    {
      id: 'prod_obsidian_gua_sha',
      name: 'Obsidian Facial Sculpting Talisman',
      slug: 'obsidian-facial-sculpting-talisman',
      description: 'Carved by master lapidaries from natural volcanic black obsidian stone. Precision ergonomic bevels stimulate lymphatic drainage, define cheekbones, and release jaw tension.',
      categoryId: 'cat_skincare',
      categoryName: 'Botanical Skincare',
      price: 4200,
      images: [
        '/images/velmora_obsidian_guasha_1791912397941.jpg'
      ],
      stock: 40,
      sku: 'VEL-SKN-003',
      status: 'ACTIVE',
      averageRating: 5.0,
      reviewCount: 24,
      isFeatured: false,
      isGiftPick: true,
      skinType: 'Universal facial sculpting instrument',
      usageRitual: 'Pair with Aeterna Botanical Serum. Glide stone outward from chin to ear, jawline to temple, using gentle feather-light pressure.',
      dermatologicalWarnings: 'Natural stone: handle with care. Cleanse with mild botanical soap and dry with microfiber cloth.',
      details: {
        'Material': '100% Genuine Volcanic Black Obsidian',
        'Includes': 'Embossed saddle leather travel pouch & care cloth',
        'Dimensions': '105mm x 60mm x 8mm'
      },
      createdAt: '2026-01-22T14:00:00.000Z'
    },
    {
      id: 'prod_rosewater_gold',
      name: 'Rosewater & 24K Colloidal Gold Mist',
      slug: 'rosewater-colloidal-gold-mist',
      description: 'Distilled copper alembic rosewater from first-flush Iranian Damask blossoms, infused with pure 24K colloidal gold suspension and mineral electrolytes to restore natural skin pH.',
      categoryId: 'cat_skincare',
      categoryName: 'Botanical Skincare',
      price: 7600,
      images: [
        '/images/category_skincare_1791824742582.jpg'
      ],
      stock: 28,
      sku: 'VEL-SKN-004',
      status: 'ACTIVE',
      averageRating: 4.7,
      reviewCount: 15,
      isFeatured: false,
      isGiftPick: true,
      skinType: 'All skin types; ideal for mid-day revitalization and post-flight hydration',
      usageRitual: 'Mist liberally over face with eyes closed before serum application or throughout the day.',
      dermatologicalWarnings: 'Store in cool place shielded from direct sunlight to preserve raw floral hydrosol vitality.',
      details: {
        'Volume': '120ml / 4 FL. OZ.',
        'Sprayer': 'Micro-mist nebulizer nozzle',
        'Purity': '100% Hydrosol, Zero synthetic stabilizers'
      },
      createdAt: '2026-01-25T17:00:00.000Z'
    }
  ],
  orders: [
    {
      id: 'ord_1042',
      orderNumber: 'VEL-84920',
      userId: 'usr_client_01',
      customerName: 'Eleanor Vance',
      customerEmail: 'client@velmora.com',
      items: [
        {
          productId: 'prod_nocturne_ambre',
          productName: 'Nocturne Ambré Eau de Parfum',
          productImage: '/images/velmora_perfume_ambre_1791912395312.jpg',
          price: 18500,
          quantity: 1,
          selectedVariant: '100ml Grand Flacon'
        },
        {
          productId: 'prod_aeterna_serum',
          productName: 'Aeterna Botanical Restorative Serum',
          productImage: '/images/velmora_botanical_serum_1791912396485.jpg',
          price: 9800,
          quantity: 1,
          selectedVariant: '30ml Dropper'
        }
      ],
      shippingAddress: {
        id: 'addr_cli_1',
        fullName: 'Eleanor Vance',
        addressLine1: 'Flat 4B, Malabar Hill Crest',
        addressLine2: 'Ridge Road',
        city: 'Mumbai',
        state: 'Maharashtra',
        postalCode: '400006',
        country: 'India',
        phone: '+91 98111 87654'
      },
      subtotal: 28300,
      discount: 2830,
      shippingFee: 0,
      tax: 1273,
      totalAmount: 26743,
      pointsEarned: 267,
      paymentStatus: 'PAID',
      orderStatus: 'SHIPPED',
      paymentMethod: 'RAZORPAY_UPI',
      paymentReference: 'pay_rzp_mock_881920',
      razorpayOrderId: 'order_rzp_mock_11029',
      trackingNumber: 'WG-IND-90219482',
      trackingCourier: 'Blue Dart Apex Sovereign',
      estimatedDelivery: '14 October 2026',
      createdAt: '2026-10-10T14:22:00.000Z',
      updatedAt: '2026-10-11T09:15:00.000Z'
    }
  ],
  reviews: [
    {
      id: 'rev_01',
      userId: 'usr_client_01',
      userName: 'Eleanor Vance',
      productId: 'prod_nocturne_ambre',
      rating: 5,
      comment: 'An utterly transcendental composition. The smoked plum notes opening into ancient amber are unlike anything in conventional French perfumery. Sillage lasted 14 hours on my cashmere lapel.',
      verifiedPurchase: true,
      helpfulCount: 14,
      status: 'APPROVED',
      createdAt: '2026-09-15T18:30:00.000Z'
    },
    {
      id: 'rev_02',
      userId: 'usr_connoisseur_02',
      userName: 'Julian Montagu',
      productId: 'prod_obsidian_overcoat',
      rating: 5,
      comment: 'The drape of this double-faced wool is architectural perfection. The silk lapel catches the light with subtle restraint. True Savile Row quality with Parisian minimalism.',
      verifiedPurchase: true,
      helpfulCount: 9,
      status: 'APPROVED',
      createdAt: '2026-09-22T11:15:00.000Z'
    },
    {
      id: 'rev_03',
      userId: 'usr_client_03',
      userName: 'Aria Thorne',
      productId: 'prod_aeterna_serum',
      rating: 5,
      comment: 'The prickly pear and frankincense blend calmed my sensitive skin in three nights. Texture is lightweight yet deeply restorative. The obsidian applicator makes evening ritual divine.',
      verifiedPurchase: true,
      helpfulCount: 18,
      status: 'APPROVED',
      createdAt: '2026-10-01T20:10:00.000Z'
    }
  ],
  coupons: [
    {
      id: 'coup_01',
      code: 'WELCOME10',
      discountType: 'PERCENT',
      discountValue: 10,
      minOrder: 5000,
      maxDiscount: 3000,
      description: '10% off your first order over ₹5,000',
      expiryDate: '2027-12-31',
      active: true
    },
    {
      id: 'coup_02',
      code: 'LUXURY20',
      discountType: 'PERCENT',
      discountValue: 20,
      minOrder: 25000,
      maxDiscount: 10000,
      description: '20% off all orders over ₹25,000',
      expiryDate: '2027-12-31',
      active: true
    },
    {
      id: 'coup_03',
      code: 'VELMORA15',
      discountType: 'PERCENT',
      discountValue: 15,
      minOrder: 10000,
      maxDiscount: 5000,
      description: '15% off boutique collections over ₹10,000',
      expiryDate: '2027-12-31',
      active: true
    },
    {
      id: 'coup_04',
      code: 'FESTIVE25',
      discountType: 'PERCENT',
      discountValue: 25,
      minOrder: 30000,
      maxDiscount: 12000,
      description: '25% off holiday & seasonal collections over ₹30,000',
      expiryDate: '2027-12-31',
      active: true
    },
    {
      id: 'coup_05',
      code: 'GIFT500',
      discountType: 'FIXED',
      discountValue: 500,
      minOrder: 4000,
      description: 'Flat ₹500 off luxury gift orders over ₹4,000',
      expiryDate: '2027-12-31',
      active: true
    }
  ],
  carts: {},
  wishlists: {
    'usr_client_01': ['prod_nocturne_ambre', 'prod_obsidian_overcoat']
  },
  productAlerts: [
    {
      id: 'alt_01',
      productId: 'prod_nocturne_ambre',
      productName: 'Nocturne Ambré Eau de Parfum',
      userEmail: 'client@velmora.com',
      type: 'PRICE_DROP',
      targetPrice: 17000,
      createdAt: '2026-10-01T10:00:00.000Z'
    }
  ],
  contactRequests: [
    {
      id: 'cnt_01',
      name: 'Lord Henry Wotton',
      email: 'henry@mayfairclub.co.uk',
      subject: 'Bespoke Private Formulation Inquiry',
      message: 'Seeking a private consultation for a bespoke sandalwood and leather formulation for an anniversary estate gala.',
      status: 'RESPONDED',
      createdAt: '2026-09-28T16:00:00.000Z'
    }
  ],
  subscribers: [
    {
      id: 'sub_01',
      email: 'collector@parfumgazette.com',
      status: 'SUBSCRIBED',
      subscribedAt: '2026-08-10T12:00:00.000Z'
    }
  ]
};

// Database state in memory with auto-save to disk
class BoutiqueDatabase {
  private data: DatabaseSchema;

  constructor() {
    this.data = this.loadData();
  }

  private loadData(): DatabaseSchema {
    try {
      if (fs.existsSync(DB_FILE)) {
        const fileContent = fs.readFileSync(DB_FILE, 'utf-8');
        const parsed = JSON.parse(fileContent);
        return {
          ...initialSeedData,
          ...parsed,
          users: parsed.users || initialSeedData.users,
          products: parsed.products || initialSeedData.products,
          categories: parsed.categories || initialSeedData.categories,
          orders: parsed.orders || initialSeedData.orders,
          reviews: parsed.reviews || initialSeedData.reviews,
          coupons: parsed.coupons || initialSeedData.coupons,
          carts: parsed.carts || initialSeedData.carts,
          wishlists: parsed.wishlists || initialSeedData.wishlists,
          productAlerts: parsed.productAlerts || initialSeedData.productAlerts,
          contactRequests: parsed.contactRequests || initialSeedData.contactRequests,
          subscribers: parsed.subscribers || initialSeedData.subscribers,
        };
      }
    } catch (err) {
      console.warn('Could not read existing database, initializing seed:', err);
    }
    this.saveData(initialSeedData);
    return initialSeedData;
  }

  private saveData(data: DatabaseSchema) {
    try {
      fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
    } catch (err) {
      console.error('Failed to write database file:', err);
    }
  }

  private persist() {
    this.saveData(this.data);
  }

  // --- USERS ---
  getUsers() {
    return this.data.users;
  }

  findUserById(id: string) {
    return this.data.users.find(u => u.id === id);
  }

  findUserByEmail(email: string) {
    return this.data.users.find(u => u.email.toLowerCase() === email.toLowerCase());
  }

  createUser(user: Omit<UserWithAuth, 'id' | 'createdAt'>): UserWithAuth {
    const newUser: UserWithAuth = {
      ...user,
      id: `usr_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      loyaltyPoints: 500, // 500 welcome points
      loyaltyTier: 'NOIR',
      loyaltyHistory: [
        {
          id: `ly_${Date.now()}`,
          date: new Date().toISOString().split('T')[0],
          description: 'Welcome Sanctuary Inscription Bonus',
          points: 500,
          type: 'EARNED'
        }
      ],
      favoriteCategories: [],
      notificationPreferences: {
        priceDropAlerts: true,
        backInStockAlerts: true,
        orderUpdates: true,
        gazetteNewsletter: true
      },
      createdAt: new Date().toISOString()
    };
    this.data.users.push(newUser);
    this.persist();
    return newUser;
  }

  updateUser(id: string, updates: Partial<UserWithAuth>): UserWithAuth | null {
    const idx = this.data.users.findIndex(u => u.id === id);
    if (idx === -1) return null;
    this.data.users[idx] = { ...this.data.users[idx], ...updates };
    this.persist();
    return this.data.users[idx];
  }

  awardLoyaltyPoints(userId: string, points: number, description: string): boolean {
    const user = this.findUserById(userId);
    if (!user) return false;
    user.loyaltyPoints = (user.loyaltyPoints || 0) + points;
    if (!user.loyaltyHistory) user.loyaltyHistory = [];
    user.loyaltyHistory.unshift({
      id: `ly_${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      description,
      points,
      type: 'EARNED'
    });
    // Tier calculation
    if (user.loyaltyPoints >= 3000) user.loyaltyTier = 'IMPÉRIAL';
    else if (user.loyaltyPoints >= 1000) user.loyaltyTier = 'OR';
    else user.loyaltyTier = 'NOIR';

    this.persist();
    return true;
  }

  redeemLoyaltyPoints(userId: string, points: number, description: string): boolean {
    const user = this.findUserById(userId);
    if (!user || user.loyaltyPoints < points) return false;
    user.loyaltyPoints -= points;
    if (!user.loyaltyHistory) user.loyaltyHistory = [];
    user.loyaltyHistory.unshift({
      id: `ly_${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      description,
      points,
      type: 'REDEEMED'
    });
    this.persist();
    return true;
  }

  // --- PRODUCTS ---
  getProducts(filter?: { categoryId?: string; search?: string; status?: string; occasion?: string; isGiftPick?: boolean }) {
    let list = this.data.products;
    if (filter?.status) {
      list = list.filter(p => p.status === filter.status);
    } else {
      list = list.filter(p => p.status === 'ACTIVE');
    }
    if (filter?.categoryId) {
      list = list.filter(p => p.categoryId === filter.categoryId);
    }
    if (filter?.isGiftPick) {
      list = list.filter(p => p.isGiftPick);
    }
    if (filter?.search) {
      const q = filter.search.toLowerCase();
      list = list.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.categoryName.toLowerCase().includes(q) ||
        (p.fragranceFamily && p.fragranceFamily.toLowerCase().includes(q)) ||
        (p.notes && p.notes.some(n => n.toLowerCase().includes(q)))
      );
    }
    return list;
  }

  getAllProductsAdmin() {
    return this.data.products;
  }

  findProductById(id: string) {
    return this.data.products.find(p => p.id === id || p.slug === id);
  }

  createProduct(product: Omit<Product, 'id' | 'createdAt'>): Product {
    const newProduct: Product = {
      ...product,
      id: `prod_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      createdAt: new Date().toISOString()
    };
    this.data.products.push(newProduct);
    this.persist();
    return newProduct;
  }

  updateProduct(id: string, updates: Partial<Product>): Product | null {
    const idx = this.data.products.findIndex(p => p.id === id);
    if (idx === -1) return null;
    this.data.products[idx] = { ...this.data.products[idx], ...updates };
    this.persist();
    return this.data.products[idx];
  }

  deleteProduct(id: string): boolean {
    const initialLen = this.data.products.length;
    this.data.products = this.data.products.filter(p => p.id !== id);
    if (this.data.products.length !== initialLen) {
      this.persist();
      return true;
    }
    return false;
  }

  decrementProductStock(id: string, qty: number): boolean {
    const prod = this.findProductById(id);
    if (!prod) return false;
    if (prod.stock < qty) return false;
    prod.stock -= qty;
    this.persist();
    return true;
  }

  // --- CATEGORIES ---
  getCategories() {
    return this.data.categories;
  }

  findCategoryById(id: string) {
    return this.data.categories.find(c => c.id === id || c.slug === id);
  }

  // --- CARTS ---
  getCart(userIdOrSession: string): CartItem[] {
    const cart = this.data.carts[userIdOrSession];
    if (!cart) return [];
    return cart.items;
  }

  saveCart(userIdOrSession: string, items: CartItem[]) {
    this.data.carts[userIdOrSession] = {
      items,
      updatedAt: new Date().toISOString()
    };
    this.persist();
  }

  mergeGuestCart(userId: string, guestItems: CartItem[]): CartItem[] {
    const userCart = this.getCart(userId);
    const itemMap = new Map<string, CartItem>();

    for (const item of userCart) {
      const key = `${item.productId}_${item.selectedVariant || ''}`;
      itemMap.set(key, { ...item });
    }

    for (const item of guestItems) {
      const key = `${item.productId}_${item.selectedVariant || ''}`;
      if (itemMap.has(key)) {
        const existing = itemMap.get(key)!;
        existing.quantity += item.quantity;
      } else {
        itemMap.set(key, { ...item });
      }
    }

    const merged = Array.from(itemMap.values());
    this.saveCart(userId, merged);
    return merged;
  }

  // --- WISHLIST ---
  getWishlist(userId: string): string[] {
    return this.data.wishlists[userId] || [];
  }

  toggleWishlist(userId: string, productId: string): string[] {
    const current = this.data.wishlists[userId] || [];
    let updated: string[];
    if (current.includes(productId)) {
      updated = current.filter(id => id !== productId);
    } else {
      updated = [...current, productId];
    }
    this.data.wishlists[userId] = updated;
    this.persist();
    return updated;
  }

  // --- PRODUCT ALERTS ---
  addProductAlert(alert: Omit<ProductAlert, 'id' | 'createdAt'>): ProductAlert {
    const newAlert: ProductAlert = {
      ...alert,
      id: `alt_${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    this.data.productAlerts.unshift(newAlert);
    this.persist();
    return newAlert;
  }

  getProductAlerts(email?: string) {
    if (email) {
      return this.data.productAlerts.filter(a => a.userEmail.toLowerCase() === email.toLowerCase());
    }
    return this.data.productAlerts;
  }

  // --- ORDERS ---
  getOrders(userId?: string) {
    if (userId) {
      return this.data.orders.filter(o => o.userId === userId);
    }
    return this.data.orders;
  }

  findOrderById(id: string) {
    return this.data.orders.find(o => o.id === id || o.orderNumber === id);
  }

  createOrder(order: Omit<Order, 'id' | 'orderNumber' | 'createdAt' | 'updatedAt'>): Order {
    const timestamp = Date.now();
    const randomHex = Math.floor(1000 + Math.random() * 9000);
    const newOrder: Order = {
      ...order,
      id: `ord_${timestamp}`,
      orderNumber: `EN-${randomHex}`,
      orderStatus: 'PLACED',
      trackingCourier: 'Blue Dart Sovereign White Glove',
      estimatedDelivery: 'Within 3-4 Business Days',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    this.data.orders.unshift(newOrder);

    // Award loyalty points: 1 point per ₹100
    if (order.userId && order.totalAmount > 0) {
      const earned = Math.floor(order.totalAmount / 100);
      newOrder.pointsEarned = earned;
      this.awardLoyaltyPoints(order.userId, earned, `Acquisition ${newOrder.orderNumber}`);
    }

    this.persist();
    return newOrder;
  }

  updateOrder(id: string, updates: Partial<Order>): Order | null {
    const idx = this.data.orders.findIndex(o => o.id === id || o.orderNumber === id);
    if (idx === -1) return null;
    this.data.orders[idx] = {
      ...this.data.orders[idx],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    this.persist();
    return this.data.orders[idx];
  }

  // --- REVIEWS ---
  getReviewsForProduct(productId: string) {
    return this.data.reviews.filter(r => r.productId === productId && r.status !== 'FLAGGED');
  }

  getAllReviewsAdmin() {
    return this.data.reviews;
  }

  createReview(review: Omit<Review, 'id' | 'createdAt'>): Review {
    const newReview: Review = {
      ...review,
      id: `rev_${Date.now()}`,
      helpfulCount: 0,
      status: 'APPROVED',
      createdAt: new Date().toISOString()
    };
    this.data.reviews.unshift(newReview);

    // Recalculate average rating for product
    const productReviews = this.getReviewsForProduct(review.productId);
    const avg = productReviews.reduce((acc, r) => acc + r.rating, 0) / productReviews.length;
    this.updateProduct(review.productId, {
      averageRating: parseFloat(avg.toFixed(1)),
      reviewCount: productReviews.length
    });

    this.persist();
    return newReview;
  }

  reportReview(id: string) {
    const r = this.data.reviews.find(rev => rev.id === id);
    if (r) {
      r.reported = true;
      r.status = 'FLAGGED';
      this.persist();
    }
    return r;
  }

  updateReviewStatus(id: string, status: 'APPROVED' | 'PENDING' | 'FLAGGED') {
    const r = this.data.reviews.find(rev => rev.id === id);
    if (r) {
      r.status = status;
      this.persist();
    }
    return r;
  }

  // --- COUPONS ---
  getCoupons() {
    return this.data.coupons;
  }

  findCouponByCode(code: string): Coupon | null {
    const coupon = this.data.coupons.find(
      c => c.code.toUpperCase() === code.trim().toUpperCase() && c.active
    );
    if (!coupon) return null;
    const now = new Date().toISOString().split('T')[0];
    if (coupon.expiryDate < now) return null;
    return coupon;
  }

  createCoupon(coupon: Omit<Coupon, 'id'>): Coupon {
    const newCoupon: Coupon = {
      ...coupon,
      id: `coup_${Date.now()}`
    };
    this.data.coupons.push(newCoupon);
    this.persist();
    return newCoupon;
  }

  // --- CONTACT & NEWSLETTER ---
  addContactRequest(req: Omit<ContactRequest, 'id' | 'status' | 'createdAt'>): ContactRequest {
    const newReq: ContactRequest = {
      ...req,
      id: `cnt_${Date.now()}`,
      status: 'NEW',
      createdAt: new Date().toISOString()
    };
    this.data.contactRequests.unshift(newReq);
    this.persist();
    return newReq;
  }

  getContactRequests() {
    return this.data.contactRequests;
  }

  updateContactRequestStatus(id: string, status: 'NEW' | 'RESPONDED') {
    const req = this.data.contactRequests.find(c => c.id === id);
    if (req) {
      req.status = status;
      this.persist();
    }
    return req;
  }

  subscribeNewsletter(email: string): NewsletterSubscriber {
    const existing = this.data.subscribers.find(s => s.email.toLowerCase() === email.toLowerCase());
    if (existing) {
      existing.status = 'SUBSCRIBED';
      this.persist();
      return existing;
    }
    const sub: NewsletterSubscriber = {
      id: `sub_${Date.now()}`,
      email: email.toLowerCase(),
      status: 'SUBSCRIBED',
      subscribedAt: new Date().toISOString()
    };
    this.data.subscribers.unshift(sub);
    this.persist();
    return sub;
  }

  getSubscribers() {
    return this.data.subscribers;
  }
}

export const db = new BoutiqueDatabase();
