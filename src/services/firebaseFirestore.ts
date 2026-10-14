import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  query,
  where,
  orderBy,
  limit
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import type { Product, Category, CartItem, Order, Review, Coupon, GiftOptions } from '../types';

// ==========================================
// 1. SHOPPING CART SYNCHRONIZATION
// ==========================================

export interface FirestoreCartData {
  userId: string;
  items: CartItem[];
  appliedCoupon?: Coupon | null;
  giftOptions?: GiftOptions | null;
  updatedAt: string;
}

export async function saveCartToFirestore(
  userId: string,
  items: CartItem[],
  appliedCoupon?: Coupon | null,
  giftOptions?: GiftOptions | null
): Promise<void> {
  const docPath = `carts/${userId}`;
  try {
    const cartRef = doc(db, 'carts', userId);
    // Sanitize item objects for Firestore
    const cleanItems = items.map(item => ({
      productId: item.productId,
      quantity: item.quantity,
      selectedVariant: item.selectedVariant || '',
      product: {
        id: item.product.id,
        name: item.product.name,
        slug: item.product.slug,
        price: item.product.price,
        images: item.product.images || [],
        stock: item.product.stock,
        categoryId: item.product.categoryId || '',
        categoryName: item.product.categoryName || ''
      }
    }));

    const cartData: FirestoreCartData = {
      userId,
      items: cleanItems as any,
      appliedCoupon: appliedCoupon || null,
      giftOptions: giftOptions || null,
      updatedAt: new Date().toISOString()
    };

    await setDoc(cartRef, cartData);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, docPath);
  }
}

export async function fetchCartFromFirestore(userId: string): Promise<FirestoreCartData | null> {
  const docPath = `carts/${userId}`;
  try {
    const cartRef = doc(db, 'carts', userId);
    const snap = await getDoc(cartRef);
    if (snap.exists()) {
      return snap.data() as FirestoreCartData;
    }
    return null;
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, docPath);
  }
}

// Merge guest cart items into user's cloud cart upon sign-in
export async function mergeGuestCartWithCloud(
  userId: string,
  guestItems: CartItem[]
): Promise<CartItem[]> {
  try {
    const cloudCart = await fetchCartFromFirestore(userId);
    const cloudItems = cloudCart?.items || [];

    if (!guestItems.length) {
      return cloudItems;
    }

    const mergedMap = new Map<string, CartItem>();

    // Add existing cloud items
    for (const item of cloudItems) {
      const key = `${item.productId}_${item.selectedVariant || 'default'}`;
      mergedMap.set(key, { ...item });
    }

    // Merge or add guest items
    for (const gItem of guestItems) {
      const key = `${gItem.productId}_${gItem.selectedVariant || 'default'}`;
      if (mergedMap.has(key)) {
        const existing = mergedMap.get(key)!;
        existing.quantity += gItem.quantity;
      } else {
        mergedMap.set(key, { ...gItem });
      }
    }

    const finalItems = Array.from(mergedMap.values());
    await saveCartToFirestore(userId, finalItems, cloudCart?.appliedCoupon, cloudCart?.giftOptions);
    return finalItems;
  } catch (err) {
    console.error('Failed to merge cloud cart:', err);
    return guestItems;
  }
}

// ==========================================
// 2. WISHLIST SYNCHRONIZATION
// ==========================================

export async function saveWishlistToFirestore(userId: string, productIds: string[]): Promise<void> {
  const docPath = `wishlists/${userId}`;
  try {
    const ref = doc(db, 'wishlists', userId);
    await setDoc(ref, {
      userId,
      productIds,
      updatedAt: new Date().toISOString()
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, docPath);
  }
}

export async function fetchWishlistFromFirestore(userId: string): Promise<string[]> {
  const docPath = `wishlists/${userId}`;
  try {
    const ref = doc(db, 'wishlists', userId);
    const snap = await getDoc(ref);
    if (snap.exists()) {
      return (snap.data().productIds as string[]) || [];
    }
    return [];
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, docPath);
  }
}

// ==========================================
// 3. ORDERS MANAGEMENT
// ==========================================

export async function saveOrderToFirestore(order: Order): Promise<void> {
  const docPath = `orders/${order.id}`;
  try {
    const ref = doc(db, 'orders', order.id);
    await setDoc(ref, {
      ...order,
      createdAt: order.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, docPath);
  }
}

export async function fetchUserOrdersFromFirestore(userId: string): Promise<Order[]> {
  const colPath = 'orders';
  try {
    const ordersCol = collection(db, 'orders');
    const q = query(
      ordersCol,
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );
    const snap = await getDocs(q);
    return snap.docs.map(d => d.data() as Order);
  } catch (error) {
    // If composite index is building or query fails, fallback to simple query
    try {
      const fallbackQ = query(collection(db, 'orders'), where('userId', '==', userId));
      const snap = await getDocs(fallbackQ);
      const orders = snap.docs.map(d => d.data() as Order);
      return orders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } catch (fallbackErr) {
      handleFirestoreError(fallbackErr, OperationType.LIST, colPath);
    }
  }
}

export async function fetchAllOrdersAdmin(): Promise<Order[]> {
  const colPath = 'orders';
  try {
    const snap = await getDocs(collection(db, 'orders'));
    const orders = snap.docs.map(d => d.data() as Order);
    return orders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, colPath);
  }
}

export async function updateOrderStatusInFirestore(
  orderId: string,
  orderStatus: Order['orderStatus'],
  paymentStatus: Order['paymentStatus'],
  trackingNumber?: string,
  trackingCourier?: string
): Promise<void> {
  const docPath = `orders/${orderId}`;
  try {
    const ref = doc(db, 'orders', orderId);
    await updateDoc(ref, {
      orderStatus,
      paymentStatus,
      trackingNumber: trackingNumber || '',
      trackingCourier: trackingCourier || 'Blue Dart Express',
      updatedAt: new Date().toISOString()
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, docPath);
  }
}

// ==========================================
// 4. CATALOG (PRODUCTS & CATEGORIES)
// ==========================================

export async function fetchProductsFromFirestore(): Promise<Product[]> {
  const colPath = 'products';
  try {
    const snap = await getDocs(collection(db, 'products'));
    if (snap.empty) {
      return [];
    }
    return snap.docs.map(d => d.data() as Product);
  } catch (error) {
    console.warn('Could not read products from Firestore, falling back to local API:', error);
    return [];
  }
}

export async function fetchCategoriesFromFirestore(): Promise<Category[]> {
  const colPath = 'categories';
  try {
    const snap = await getDocs(collection(db, 'categories'));
    if (snap.empty) {
      return [];
    }
    return snap.docs.map(d => d.data() as Category);
  } catch (error) {
    console.warn('Could not read categories from Firestore:', error);
    return [];
  }
}

// Seed initial catalogue into Firestore if empty
export async function seedInitialFirestoreCatalog(
  products: Product[],
  categories: Category[]
): Promise<void> {
  try {
    const existingSnap = await getDocs(collection(db, 'products'));
    if (!existingSnap.empty) {
      return; // Already seeded
    }

    // Seed categories
    for (const cat of categories) {
      await setDoc(doc(db, 'categories', cat.id), cat);
    }

    // Seed products
    for (const prod of products) {
      await setDoc(doc(db, 'products', prod.id), prod);
    }
    console.log('VELMORA catalog seeded successfully to Cloud Firestore.');
  } catch (err) {
    console.warn('Catalog seeding skipped or restricted by security rules:', err);
  }
}

// ==========================================
// 5. REVIEWS
// ==========================================

export async function saveReviewToFirestore(review: Review): Promise<void> {
  const docPath = `reviews/${review.id}`;
  try {
    const ref = doc(db, 'reviews', review.id);
    await setDoc(ref, review);
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, docPath);
  }
}

export async function fetchProductReviewsFromFirestore(productId: string): Promise<Review[]> {
  const colPath = 'reviews';
  try {
    const q = query(
      collection(db, 'reviews'),
      where('productId', '==', productId)
    );
    const snap = await getDocs(q);
    return snap.docs.map(d => d.data() as Review);
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, colPath);
  }
}
