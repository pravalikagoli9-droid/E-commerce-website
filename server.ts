import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import crypto from 'crypto';
import dotenv from 'dotenv';
import { db, hashPassword, verifyPassword } from './src/server/db.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
const isProduction = process.env.NODE_ENV === 'production';

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Simple Bearer token / Session token verification
function getAuthUser(req: express.Request) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  const token = authHeader.split(' ')[1];
  try {
    const decoded = Buffer.from(token, 'base64').toString('utf-8');
    const [userId, exp] = decoded.split(':');
    if (parseInt(exp, 10) < Date.now()) {
      return null;
    }
    const user = db.findUserById(userId);
    if (!user || user.accountStatus !== 'ACTIVE') return null;
    return user;
  } catch {
    return null;
  }
}

function generateToken(userId: string): string {
  // 7 days expiration
  const exp = Date.now() + 7 * 24 * 60 * 60 * 1000;
  return Buffer.from(`${userId}:${exp}`).toString('base64');
}

// ----------------------------------------------------
// API ROUTES
// ----------------------------------------------------

// 1. AUTHENTICATION
app.post('/api/auth/register', (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Name, email, and password are required.' });
  }

  const normalizedEmail = email.trim().toLowerCase();
  if (password.length < 8) {
    return res.status(400).json({ error: 'Password must be at least 8 characters in length.' });
  }

  const existing = db.findUserByEmail(normalizedEmail);
  if (existing) {
    return res.status(409).json({ error: 'An account with this email already exists.' });
  }

  const user = db.createUser({
    name: name.trim(),
    email: normalizedEmail,
    passwordHash: hashPassword(password),
    role: 'CUSTOMER',
    accountStatus: 'ACTIVE',
    addresses: [],
    emailVerifiedAt: new Date().toISOString()
  });

  const token = generateToken(user.id);
  const { passwordHash: _, ...safeUser } = user;
  return res.json({ user: safeUser, token });
});

app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required.' });
  }

  const user = db.findUserByEmail(email.trim().toLowerCase());
  if (!user || !verifyPassword(password, user.passwordHash)) {
    return res.status(401).json({ error: 'Invalid email address or credentials.' });
  }

  if (user.accountStatus !== 'ACTIVE') {
    return res.status(403).json({ error: 'This account has been suspended.' });
  }

  const token = generateToken(user.id);
  const { passwordHash: _, ...safeUser } = user;
  return res.json({ user: safeUser, token });
});

app.get('/api/auth/me', (req, res) => {
  const user = getAuthUser(req);
  if (!user) {
    return res.status(401).json({ error: 'Unauthenticated' });
  }
  const { passwordHash: _, ...safeUser } = user;
  return res.json({ user: safeUser });
});

app.post('/api/auth/add-address', (req, res) => {
  const user = getAuthUser(req);
  if (!user) return res.status(401).json({ error: 'Unauthenticated' });

  const { fullName, addressLine1, addressLine2, city, state, postalCode, country, phone, isDefault } = req.body;
  if (!fullName || !addressLine1 || !city || !postalCode || !phone) {
    return res.status(400).json({ error: 'Please provide all mandatory address fields.' });
  }

  const newAddress = {
    id: `addr_${Date.now()}`,
    fullName,
    addressLine1,
    addressLine2,
    city,
    state: state || 'MH',
    postalCode,
    country: country || 'India',
    phone,
    isDefault: !!isDefault
  };

  const updatedAddresses = isDefault
    ? user.addresses.map(a => ({ ...a, isDefault: false })).concat([newAddress])
    : [...user.addresses, newAddress];

  const updated = db.updateUser(user.id, { addresses: updatedAddresses });
  return res.json({ addresses: updated?.addresses || [] });
});

// 2. PRODUCTS & CATEGORIES
app.get('/api/products', (req, res) => {
  const { categoryId, search, sort, minPrice, maxPrice } = req.query as Record<string, string>;
  let products = db.getProducts({ categoryId, search });

  if (minPrice) {
    products = products.filter(p => p.price >= parseFloat(minPrice));
  }
  if (maxPrice) {
    products = products.filter(p => p.price <= parseFloat(maxPrice));
  }

  if (sort === 'price_asc') {
    products.sort((a, b) => a.price - b.price);
  } else if (sort === 'price_desc') {
    products.sort((a, b) => b.price - a.price);
  } else if (sort === 'rating') {
    products.sort((a, b) => b.averageRating - a.averageRating);
  } else if (sort === 'newest') {
    products.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  return res.json({ products });
});

app.get('/api/products/:id', (req, res) => {
  const product = db.findProductById(req.params.id);
  if (!product) {
    return res.status(404).json({ error: 'Product not found' });
  }
  return res.json({ product });
});

app.get('/api/categories', (_req, res) => {
  const categories = db.getCategories();
  return res.json({ categories });
});

// 3. CART (Guest or Authenticated)
app.get('/api/cart', (req, res) => {
  const user = getAuthUser(req);
  const cartId = user ? user.id : (req.headers['x-guest-id'] as string || 'guest');
  const items = db.getCart(cartId);
  return res.json({ items });
});

app.post('/api/cart/save', (req, res) => {
  const user = getAuthUser(req);
  const cartId = user ? user.id : (req.headers['x-guest-id'] as string || 'guest');
  const { items } = req.body;
  if (!Array.isArray(items)) {
    return res.status(400).json({ error: 'Invalid items payload' });
  }
  db.saveCart(cartId, items);
  return res.json({ success: true, items });
});

app.post('/api/cart/sync', (req, res) => {
  const user = getAuthUser(req);
  if (!user) return res.status(401).json({ error: 'Unauthenticated' });
  const { guestItems } = req.body;
  if (!Array.isArray(guestItems)) {
    return res.status(400).json({ error: 'Invalid guestItems payload' });
  }
  const merged = db.mergeGuestCart(user.id, guestItems);
  return res.json({ items: merged });
});

// 4. WISHLIST
app.get('/api/wishlist', (req, res) => {
  const user = getAuthUser(req);
  if (!user) return res.json({ productIds: [] });
  const productIds = db.getWishlist(user.id);
  return res.json({ productIds });
});

app.post('/api/wishlist/toggle', (req, res) => {
  const user = getAuthUser(req);
  if (!user) return res.status(401).json({ error: 'Unauthenticated' });
  const { productId } = req.body;
  if (!productId) return res.status(400).json({ error: 'ProductId required' });
  const updated = db.toggleWishlist(user.id, productId);
  return res.json({ productIds: updated });
});

// 5. COUPONS
app.post('/api/coupons/validate', (req, res) => {
  const { code, subtotal } = req.body;
  if (!code) return res.status(400).json({ error: 'Coupon code is required' });

  const coupon = db.findCouponByCode(code);
  if (!coupon) {
    return res.status(404).json({ error: 'Invalid or expired boutique coupon code.' });
  }

  if (subtotal && subtotal < coupon.minOrder) {
    return res.status(400).json({
      error: `This coupon requires a minimum acquisition order of ₹${coupon.minOrder.toLocaleString('en-IN')}.`
    });
  }

  return res.json({ coupon });
});

// 6. ORDERS & RAZORPAY PAYMENT SIMULATION / VERIFICATION
app.post('/api/orders/create', (req, res) => {
  const user = getAuthUser(req);
  const {
    items,
    shippingAddress,
    couponCode,
    paymentMethod = 'RAZORPAY_UPI'
  } = req.body;

  if (!items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: 'Cart items cannot be empty.' });
  }

  if (!shippingAddress || !shippingAddress.fullName || !shippingAddress.addressLine1 || !shippingAddress.city || !shippingAddress.phone) {
    return res.status(400).json({ error: 'Valid shipping address is required.' });
  }

  // Server-side calculation & stock check
  let subtotal = 0;
  const verifiedOrderItems = [];

  for (const item of items) {
    const product = db.findProductById(item.productId);
    if (!product || product.status !== 'ACTIVE') {
      return res.status(400).json({ error: `Product ${item.productName || item.productId} is currently unavailable.` });
    }

    if (product.stock < item.quantity) {
      return res.status(400).json({
        error: `Insufficient atelier stock for ${product.name}. Remaining: ${product.stock}`
      });
    }

    let unitPrice = product.price;
    if (item.selectedVariant && product.variants) {
      const v = product.variants.find(v => v.name === item.selectedVariant);
      if (v) unitPrice += v.priceDiff;
    }

    subtotal += unitPrice * item.quantity;
    verifiedOrderItems.push({
      productId: product.id,
      productName: product.name,
      productImage: product.images[0] || '',
      price: unitPrice,
      quantity: item.quantity,
      selectedVariant: item.selectedVariant
    });
  }

  // Coupon discount calculation
  let discount = 0;
  if (couponCode) {
    const coupon = db.findCouponByCode(couponCode);
    if (coupon && subtotal >= coupon.minOrder) {
      if (coupon.discountType === 'PERCENT') {
        discount = Math.round((subtotal * coupon.discountValue) / 100);
        if (coupon.maxDiscount && discount > coupon.maxDiscount) {
          discount = coupon.maxDiscount;
        }
      } else {
        discount = coupon.discountValue;
      }
    }
  }

  // Shipping policy: complimentary over ₹5,000, otherwise ₹500
  const shippingFee = (subtotal - discount) >= 5000 ? 0 : 500;
  // GST calculation (3% on luxury fragrance & apparel)
  const taxableAmount = Math.max(0, subtotal - discount);
  const tax = Math.round(taxableAmount * 0.03);
  const totalAmount = taxableAmount + shippingFee + tax;

  // Razorpay order simulation
  const razorpayOrderId = `order_rzp_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 6)}`;

  const order = db.createOrder({
    userId: user?.id,
    customerName: shippingAddress.fullName,
    customerEmail: user?.email || req.body.customerEmail || 'client@elixirnoir.com',
    items: verifiedOrderItems,
    shippingAddress,
    subtotal,
    discount,
    shippingFee,
    tax,
    totalAmount,
    paymentStatus: paymentMethod === 'COD' ? 'PENDING' : 'PENDING',
    orderStatus: 'PROCESSING',
    paymentMethod,
    razorpayOrderId
  });

  return res.json({
    order,
    razorpay: {
      orderId: razorpayOrderId,
      amount: totalAmount * 100, // paise
      currency: 'INR',
      key: process.env.RAZORPAY_KEY_ID || 'rzp_test_luxury_preview'
    }
  });
});

app.post('/api/orders/verify-payment', (req, res) => {
  const { orderId, razorpayPaymentId, razorpaySignature } = req.body;
  if (!orderId) {
    return res.status(400).json({ error: 'OrderId is required.' });
  }

  const order = db.findOrderById(orderId);
  if (!order) {
    return res.status(404).json({ error: 'Order not found.' });
  }

  // Deduct inventory
  for (const item of order.items) {
    db.decrementProductStock(item.productId, item.quantity);
  }

  // Update order status to PAID
  const updatedOrder = db.updateOrder(order.id, {
    paymentStatus: 'PAID',
    paymentReference: razorpayPaymentId || `pay_rzp_${Date.now()}`,
    orderStatus: 'PROCESSING',
    trackingNumber: `WG-IND-${Math.floor(10000000 + Math.random() * 90000000)}`
  });

  // Clear user cart if authenticated
  if (order.userId) {
    db.saveCart(order.userId, []);
  }

  return res.json({ success: true, order: updatedOrder });
});

app.get('/api/orders', (req, res) => {
  const user = getAuthUser(req);
  if (!user) return res.status(401).json({ error: 'Unauthenticated' });
  const orders = db.getOrders(user.id);
  return res.json({ orders });
});

app.get('/api/orders/:id', (req, res) => {
  const order = db.findOrderById(req.params.id);
  if (!order) return res.status(404).json({ error: 'Order not found' });
  return res.json({ order });
});

app.get('/api/orders/track/:orderNumber', (req, res) => {
  const order = db.findOrderById(req.params.orderNumber);
  if (!order) return res.status(404).json({ error: 'No order found with that reference number' });
  return res.json({ order });
});

// 7. REVIEWS
app.get('/api/reviews/:productId', (req, res) => {
  const reviews = db.getReviewsForProduct(req.params.productId);
  return res.json({ reviews });
});

app.post('/api/reviews', (req, res) => {
  const user = getAuthUser(req);
  const { productId, rating, comment } = req.body;
  if (!productId || !rating || !comment) {
    return res.status(400).json({ error: 'Product ID, rating (1-5), and commentary are required.' });
  }
  const review = db.createReview({
    productId,
    rating: Math.min(5, Math.max(1, parseInt(rating, 10))),
    comment: comment.trim(),
    userId: user ? user.id : 'guest_collector',
    userName: user ? user.name : (req.body.userName || 'Anonymous Connoisseur'),
    verifiedPurchase: !!user
  });
  return res.json({ review });
});

// 8. CONTACT & NEWSLETTER
app.post('/api/contact', (req, res) => {
  const { name, email, subject, message } = req.body;
  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Name, email, and message are required.' });
  }
  const request = db.addContactRequest({
    name: name.trim(),
    email: email.trim(),
    subject: subject ? subject.trim() : 'General Boutique Inquiry',
    message: message.trim()
  });
  return res.json({ success: true, request });
});

app.post('/api/newsletter', (req, res) => {
  const { email } = req.body;
  if (!email || !email.includes('@')) {
    return res.status(400).json({ error: 'Valid email address is required.' });
  }
  const sub = db.subscribeNewsletter(email.trim());
  return res.json({ success: true, subscriber: sub });
});

// 9. ADMIN ATELIER ENDPOINTS (Protected with role === 'ADMIN')
function requireAdmin(req: express.Request, res: express.Response, next: express.NextFunction) {
  const user = getAuthUser(req);
  if (!user || user.role !== 'ADMIN') {
    return res.status(403).json({ error: 'Access forbidden: Administrator privileges required.' });
  }
  next();
}

app.get('/api/admin/metrics', requireAdmin, (_req, res) => {
  const orders = db.getOrders();
  const products = db.getAllProductsAdmin();
  const users = db.getUsers();

  const totalSales = orders
    .filter(o => o.paymentStatus === 'PAID')
    .reduce((sum, o) => sum + o.totalAmount, 0);

  const lowStockProducts = products.filter(p => p.stock <= 10).length;

  res.json({
    metrics: {
      totalSales,
      totalOrders: orders.length,
      totalCustomers: users.filter(u => u.role === 'CUSTOMER').length,
      lowStockProducts,
      recentOrders: orders.slice(0, 5)
    }
  });
});

app.get('/api/admin/orders', requireAdmin, (_req, res) => {
  const orders = db.getOrders();
  res.json({ orders });
});

app.patch('/api/admin/orders/:id', requireAdmin, (req, res) => {
  const { orderStatus, trackingNumber, paymentStatus } = req.body;
  const updated = db.updateOrder(req.params.id, {
    ...(orderStatus && { orderStatus }),
    ...(trackingNumber && { trackingNumber }),
    ...(paymentStatus && { paymentStatus })
  });
  if (!updated) return res.status(404).json({ error: 'Order not found' });
  res.json({ order: updated });
});

app.get('/api/admin/products', requireAdmin, (_req, res) => {
  const products = db.getAllProductsAdmin();
  res.json({ products });
});

app.post('/api/admin/products', requireAdmin, (req, res) => {
  const { name, categoryId, price, description, stock, sku, images, notes, details } = req.body;
  if (!name || !price || !categoryId) {
    return res.status(400).json({ error: 'Name, category, and price are required.' });
  }
  const category = db.findCategoryById(categoryId);
  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

  const newProduct = db.createProduct({
    name,
    slug: `${slug}-${Date.now().toString(36)}`,
    description: description || 'Artisanal boutique creation.',
    categoryId,
    categoryName: category ? category.name : 'Exclusive',
    price: parseFloat(price),
    images: images && images.length ? images : ['/src/assets/images/hero_luxury_boutique_1791824705943.jpg'],
    stock: parseInt(stock, 10) || 10,
    sku: sku || `EN-${Math.floor(100 + Math.random() * 900)}`,
    status: 'ACTIVE',
    averageRating: 5.0,
    reviewCount: 0,
    notes: Array.isArray(notes) ? notes : [],
    details: details || {}
  });
  res.json({ product: newProduct });
});

app.put('/api/admin/products/:id', requireAdmin, (req, res) => {
  const updated = db.updateProduct(req.params.id, req.body);
  if (!updated) return res.status(404).json({ error: 'Product not found' });
  res.json({ product: updated });
});

app.delete('/api/admin/products/:id', requireAdmin, (req, res) => {
  const success = db.deleteProduct(req.params.id);
  if (!success) return res.status(404).json({ error: 'Product not found' });
  res.json({ success: true });
});

app.get('/api/admin/customers', requireAdmin, (_req, res) => {
  const users = db.getUsers().map(({ passwordHash: _, ...u }) => u);
  res.json({ customers: users });
});

app.get('/api/admin/coupons', requireAdmin, (_req, res) => {
  res.json({ coupons: db.getCoupons() });
});

app.post('/api/admin/coupons', requireAdmin, (req, res) => {
  const { code, discountType, discountValue, minOrder, maxDiscount, expiryDate } = req.body;
  if (!code || !discountValue || !minOrder) {
    return res.status(400).json({ error: 'Code, value, and minOrder are required.' });
  }
  const coupon = db.createCoupon({
    code: code.toUpperCase().trim(),
    discountType: discountType || 'PERCENT',
    discountValue: parseFloat(discountValue),
    minOrder: parseFloat(minOrder),
    maxDiscount: maxDiscount ? parseFloat(maxDiscount) : undefined,
    expiryDate: expiryDate || '2027-12-31',
    active: true
  });
  res.json({ coupon });
});

app.get('/api/admin/contact-requests', requireAdmin, (_req, res) => {
  res.json({ contactRequests: db.getContactRequests() });
});

app.patch('/api/admin/contact-requests/:id', requireAdmin, (req, res) => {
  const updated = db.updateContactRequestStatus(req.params.id, req.body.status);
  res.json({ request: updated });
});

// ----------------------------------------------------
// FRONTEND SERVING (Vite middleware in dev, dist in prod)
// ----------------------------------------------------
async function startServer() {
  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`✨ ÉLIXIR & NOIR boutique engine listening on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch(err => {
  console.error('Failed to start server:', err);
});
