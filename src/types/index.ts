export type Role = 'CUSTOMER' | 'ADMIN';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  addresses: Address[];
  emailVerifiedAt?: string;
  accountStatus: 'ACTIVE' | 'SUSPENDED';
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

export interface Cart {
  userId?: string;
  items: CartItem[];
  appliedCoupon?: Coupon;
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
  shippingFee: number;
  tax: number;
  totalAmount: number;
  paymentStatus: 'PENDING' | 'PAID' | 'FAILED';
  orderStatus: 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
  paymentMethod: 'RAZORPAY_UPI' | 'RAZORPAY_CARD' | 'COD';
  paymentReference?: string;
  razorpayOrderId?: string;
  trackingNumber?: string;
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
  active: boolean;
}

export interface ContactRequest {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
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
  recentOrders: Order[];
}
