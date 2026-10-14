import fs from 'fs';
import path from 'path';
import { hashPassword, verifyPassword, db } from '../src/server/db';

function runTests() {
  console.log('🧪 Starting VELMORA E-Commerce & Firebase Test Suite...\n');
  let passed = 0;
  let failed = 0;

  function assert(name: string, condition: boolean) {
    if (condition) {
      console.log(`  ✓ ${name}`);
      passed++;
    } else {
      console.error(`  ✗ ${name}`);
      failed++;
    }
  }

  // 1. Password Security
  console.log('1. Password Hashing & Verification:');
  const pass = 'NoirAtelier2026!';
  const hashed = hashPassword(pass);
  assert('Hash should not equal plain password', hashed !== pass);
  assert('Password verification succeeds with correct password', verifyPassword(pass, hashed));
  assert('Password verification fails with incorrect password', !verifyPassword('WrongPass123', hashed));

  // 2. Coupon Validation Logic
  console.log('\n2. Coupon Validation:');
  const welcomeCoupon = db.findCouponByCode('WELCOME10');
  assert('WELCOME10 exists and is active', !!welcomeCoupon && welcomeCoupon.active);
  assert('WELCOME10 has min order requirement of ₹5000', welcomeCoupon?.minOrder === 5000);
  const fakeCoupon = db.findCouponByCode('INVALID_CODE');
  assert('Invalid coupon returns null', fakeCoupon === null);

  // 3. Products & Stock Logic
  console.log('\n3. Products & Inventory:');
  const products = db.getProducts();
  assert('Products list is non-empty', products.length >= 10);
  const ambre = db.findProductById('prod_nocturne_ambre');
  assert('Nocturne Ambré product exists', !!ambre);
  assert('Price is positive', !!ambre && ambre.price > 0);
  const initialStock = ambre?.stock || 0;
  const decResult = db.decrementProductStock('prod_nocturne_ambre', 1);
  assert('Decrement stock succeeds', decResult);
  const afterStock = db.findProductById('prod_nocturne_ambre')?.stock || 0;
  assert('Stock decreased by 1', afterStock === initialStock - 1);
  // Restore stock
  db.updateProduct('prod_nocturne_ambre', { stock: initialStock });

  // 4. Cart & Guest Cart Merging
  console.log('\n4. Cart Operations:');
  const freshUserId = `usr_test_${Date.now()}`;
  const guestCart = [
    { productId: 'prod_nocturne_ambre', product: ambre!, quantity: 2 }
  ];
  const mergedCart = db.mergeGuestCart(freshUserId, guestCart);
  assert('Guest cart merged successfully', mergedCart.length >= 1);
  assert('Cart item quantity preserved', mergedCart[0].quantity === 2);

  // 5. Orders & Calculations
  console.log('\n5. Order Creation & Calculation:');
  const testOrder = db.createOrder({
    userId: 'usr_client_01',
    customerName: 'Test Client',
    customerEmail: 'test@velmora.com',
    items: [
      {
        productId: 'prod_nocturne_ambre',
        productName: 'Nocturne Ambré Eau de Parfum',
        productImage: '',
        price: 18500,
        quantity: 1
      }
    ],
    shippingAddress: {
      id: 'addr_test',
      fullName: 'Test Client',
      addressLine1: 'Colaba Causeway',
      city: 'Mumbai',
      state: 'MH',
      postalCode: '400005',
      country: 'India',
      phone: '+91 99999 88888'
    },
    subtotal: 18500,
    discount: 1850,
    shippingFee: 0,
    tax: 500,
    totalAmount: 17150,
    paymentStatus: 'PAID',
    orderStatus: 'PROCESSING',
    paymentMethod: 'RAZORPAY_UPI'
  });
  assert('Order created with unique order number', testOrder.orderNumber.startsWith('EN-'));
  assert('Order total amount matches sum', testOrder.totalAmount === 17150);

  // 6. Firebase Architecture & Modular Integration
  console.log('\n6. Firebase Configuration & Blueprint Audit:');
  const configExists = fs.existsSync(path.resolve(process.cwd(), 'firebase-applet-config.json'));
  assert('firebase-applet-config.json exists', configExists);
  if (configExists) {
    const config = JSON.parse(fs.readFileSync(path.resolve(process.cwd(), 'firebase-applet-config.json'), 'utf-8'));
    assert('Firebase config has valid projectId', !!config.projectId && config.projectId.length > 0);
    assert('Firebase config has valid apiKey', !!config.apiKey && config.apiKey.startsWith('AIza'));
    assert('Firebase config has firestoreDatabaseId', !!config.firestoreDatabaseId && config.firestoreDatabaseId.length > 0);
  }

  const blueprintExists = fs.existsSync(path.resolve(process.cwd(), 'firebase-blueprint.json'));
  assert('firebase-blueprint.json exists', blueprintExists);
  if (blueprintExists) {
    const blueprint = JSON.parse(fs.readFileSync(path.resolve(process.cwd(), 'firebase-blueprint.json'), 'utf-8'));
    assert('Blueprint contains entities definition', !!blueprint.entities && Object.keys(blueprint.entities).length >= 6);
    assert('Blueprint defines User, Cart, Order, Product entities',
      !!blueprint.entities.User && !!blueprint.entities.Cart && !!blueprint.entities.Order && !!blueprint.entities.Product);
    assert('Blueprint contains Firestore collection paths', !!blueprint.firestore && Object.keys(blueprint.firestore).length >= 6);
  }

  const rulesExists = fs.existsSync(path.resolve(process.cwd(), 'firestore.rules'));
  assert('firestore.rules exists', rulesExists);
  if (rulesExists) {
    const rules = fs.readFileSync(path.resolve(process.cwd(), 'firestore.rules'), 'utf-8');
    assert('firestore.rules enforces default-deny catchall', rules.includes('allow read, write: if false;'));
    assert('firestore.rules validates user profile ownership', rules.includes('isOwner(userId)'));
    assert('firestore.rules enforces admin protections', rules.includes('isAdmin()'));
    assert('firestore.rules validates cart ownership', rules.includes('isValidCart'));
    assert('firestore.rules validates order integrity', rules.includes('isValidOrder'));
  }

  console.log(`\nResults: ${passed} passed, ${failed} failed.`);
  if (failed > 0) {
    process.exit(1);
  }
}

runTests();
