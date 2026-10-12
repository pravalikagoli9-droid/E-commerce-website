export type Role = 'CUSTOMER' | 'ADMIN';

export type LoyaltyTier = 'NOIR' | 'OR' | 'IMPÉRIAL';

export interface LoyaltyTransaction {
  id: string;
  date: string;
  description: string;
  points: number;
  type: 'EARNED' | 'REDEEMED';
}

export interface NotificationPreferences {
  priceDropAlerts: boolean;
  backInStockAlerts: boolean;
  orderUpdates: boolean;
  gazetteNewsletter: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  addresses: Address[];
  emailVerifiedAt?: string;
  accountStatus: 'ACTIVE' | 'SUSPENDED';
  loyaltyPoints: number;
  loyaltyTier: LoyaltyTier;
  loyaltyHistory: LoyaltyTransaction[];
  favoriteCategories: string[];
  notificationPreferences: NotificationPreferences;
  createdAt: string;
}

export interface Address {
  id: string;
  fullName: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone: string;
  isDefault?: boolean;
}

export interface ProductVariant {
  id: string;
  name: string;
  type: 'volume' | 'size' | 'finish';
  priceDiff: number;
  stock: number;
}

export interface SizeGuideRow {
  size: string;
  chest: string;
  waist: string;
  length: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  categoryId: string;
  categoryName: string;
  price: number;
  compareAtPrice?: number;
  images: string[];
  variants?: ProductVariant[];
  stock: number;
  sku: string;
  status: 'ACTIVE' | 'ARCHIVED';
  averageRating: number;
  reviewCount: number;
  details?: Record<string, string>;
  notes?: string[];
  ingredients?: string;
  isFeatured?: boolean;
  isNewArrival?: boolean;
  isBestseller?: boolean;
  isGiftPick?: boolean;
  // Category-specific luxury discovery
  fragranceFamily?: string;
  sillage?: 'Intimate' | 'Moderate' | 'Enveloping' | 'Royal';
  longevity?: string;
  occasions?: string[];
  skinType?: string;
  usageRitual?: string;
  dermatologicalWarnings?: string;
  fabricComposition?: string;
  careInstructions?: string;
  sizeGuide?: SizeGuideRow[];
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  status: 'ACTIVE' | 'INACTIVE';
}

export interface CartItem {
  productId: string;
  product: Product;
  quantity: number;
  selectedVariant?: string;
}

export interface GiftOptions {
  isGift: boolean;
  giftWrap: boolean;
  recipientName: string;
  giftMessage: string;
  hidePriceOnReceipt: boolean;
  occasion: string;
}

export interface Cart {
  userId?: string;
  items: CartItem[];
  appliedCoupon?: Coupon;
  giftOptions?: GiftOptions;
}

export interface OrderItem {
  productId: string;
  productName: string;
  productImage: string;
  price: number;
  quantity: number;
  selectedVariant?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  userId?: string;
  customerName: string;
  customerEmail: string;
  items: OrderItem[];
  shippingAddress: Address;
  subtotal: number;
  discount: number;
  pointsDiscount?: number;
  pointsRedeemed?: number;
  pointsEarned?: number;
  giftWrapFee?: number;
  giftOptions?: GiftOptions;
  shippingFee: number;
  tax: number;
  totalAmount: number;
  paymentStatus: 'PENDING' | 'PAID' | 'FAILED';
  orderStatus: 'PLACED' | 'CONFIRMED' | 'PROCESSING' | 'SHIPPED' | 'OUT_FOR_DELIVERY' | 'DELIVERED' | 'CANCELLED';
  paymentMethod: 'RAZORPAY_UPI' | 'RAZORPAY_CARD' | 'COD';
  paymentReference?: string;
  razorpayOrderId?: string;
  trackingNumber?: string;
  trackingCourier?: string;
  estimatedDelivery?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Review {
  id: string;
  userId: string;
  userName: string;
  productId: string;
  rating: number;
  comment: string;
  verifiedPurchase: boolean;
  images?: string[];
  reported?: boolean;
  helpfulCount?: number;
  status?: 'APPROVED' | 'PENDING' | 'FLAGGED';
  createdAt: string;
}

export interface Coupon {
  id: string;
  code: string;
  discountType: 'PERCENT' | 'FIXED';
  discountValue: number;
  minOrder: number;
  maxDiscount?: number;
  expiryDate: string;
  description?: string;
  active: boolean;
}

export interface ProductAlert {
  id: string;
  productId: string;
  productName: string;
  userEmail: string;
  type: 'PRICE_DROP' | 'BACK_IN_STOCK';
  targetPrice?: number;
  createdAt: string;
}

export interface ContactRequest {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  orderNumber?: string;
  status: 'NEW' | 'RESPONDED';
  createdAt: string;
}

export interface NewsletterSubscriber {
  id: string;
  email: string;
  status: 'SUBSCRIBED' | 'UNSUBSCRIBED';
  subscribedAt: string;
}

export interface AdminMetrics {
  totalSales: number;
  totalOrders: number;
  totalCustomers: number;
  lowStockProducts: number;
  totalReviews: number;
  recentOrders: Order[];
}
