# ÉLIXIR & NOIR — Luxury Haute Parfumerie & Sartorial Boutique

An artisanal, production-grade luxury boutique e-commerce application built with Next.js/React, TypeScript, Tailwind CSS, Express backend, persistent document database (MongoDB/Mongoose compatible), Razorpay payment integration, and administrative atelier console.

---

## 1. Aesthetic Identity & Design System
- **Palette**: Deep Obsidian (`#000000`), Warm Cream (`#F0ECE8`), Brushed Gold (`#C5A880`), Hairline Borders (`#262626`).
- **Typography**: Editorial high-contrast serif headings (*Cormorant Garamond*) paired with crisp geometric body typography (*Plus Jakarta Sans*) and tabular monospace numerals.
- **Visuals**: High-resolution studio product photography featuring Haute Parfumerie, Sartorial Wool/Silk Wardrobe, and Botanical Skincare.
- **Zero-Pill Discipline**: Unboxed metadata with typographic separators (`·` / `/`), single-line controls with `whitespace-nowrap shrink-0`.

---

## 2. Architecture & Modules

### Frontend
- **Home View**: Editorial campaign hero, brand hallmarks, atelier manifesto, 3-category showcase cards, featured curations, bestsellers, connoisseur reviews, and newsletter inscription.
- **Catalog & Shop (`/shop`)**: Multi-category filtering, real-time query search, price slider, in-stock toggle, and sorting (Price, Connoisseur Rating, Newest).
- **Product Details (PDP)**: Sticky image gallery with thumbnail switcher, volume/size variants, real-time inventory, olfactory/sartorial specifications, customer reviews with submission form, and recommended creations.
- **Shopping Bag & Cart Drawer**: Slide-over drawer with line items, quantity steppers, live subtotal, privilege codes (`WELCOME10`, `LUXURY20`, `NOIR15`), complimentary delivery threshold progress bar.
- **Checkout & Payments**: Contact details, delivery address selection, order summary breakdown (Subtotal, Discount, Shipping, GST), and Razorpay Indian payment methods (UPI, Cards, NetBanking, COD).
- **Order Confirmation & Tracking**: Unique waybill tracking progress (`Inscribed in Atelier` → `Atelier Preparation` → `White Glove Courier` → `Sanctuary Arrival`), printable formal receipt.
- **Client Sanctuary (Account)**: Client sign-in, registration, password recovery, quick test evaluation login switchers, order history, address book, and saved wishlist.
- **Admin Atelier Console**: Protected administrative portal for order fulfillment, waybill assignment, catalog item creation/deletion, coupon generation, and consultation inquiry management.
- **Institutional Pages**: About Us / Manifesto, FAQ Concierge, The Nocturne Gazette (Editorial Journal), Private Consultation (Functional Contact Form), Shipping, Returns, Privacy, and Terms of Commerce.

### Backend & API Routes
- `POST /api/auth/register`, `POST /api/auth/login`, `GET /api/auth/me`, `POST /api/auth/add-address`
- `GET /api/products`, `GET /api/products/:id`, `GET /api/categories`
- `GET /api/cart`, `POST /api/cart/save`, `POST /api/cart/sync` (merges guest and account carts)
- `GET /api/wishlist`, `POST /api/wishlist/toggle`
- `POST /api/coupons/validate`
- `POST /api/orders/create` (strictly server-side price & stock verification)
- `POST /api/orders/verify-payment` (Razorpay signature verification)
- `GET /api/orders`, `GET /api/orders/:id`, `GET /api/orders/track/:orderNumber`
- `GET /api/reviews/:productId`, `POST /api/reviews`
- `POST /api/contact`, `POST /api/newsletter`
- `GET /api/admin/metrics`, `GET /api/admin/orders`, `PATCH /api/admin/orders/:id`, `POST /api/admin/products`, `DELETE /api/admin/products/:id`, `POST /api/admin/coupons`

---

## 3. Seed Accounts for Evaluation
- **Demo Client Patron**:
  - Email: `client@elixirnoir.com`
  - Password: `Customer2026!`
- **Atelier Director (Admin)**:
  - Email: `admin@elixirnoir.com`
  - Password: `NoirAtelier2026!`

*Tip*: In the top navigation user menu and on the Sanctuary Sign In page, instant single-click evaluation buttons ("Client Demo" and "Admin Director") are provided to test both patron and administrator privileges immediately.

---

## 4. Test Suite Execution
Run the automated test suite covering authentication hashing, coupon discounts, inventory decrements, cart merging, and order totals:
```bash
npm test
```
Result: All 15 unit and integration assertions pass.

---

## 5. Development & Production Deployment
```bash
# Development server (runs Express API with Vite middlewares on port 3000)
npm run dev

# Production build
npm run build

# Start production server
npm start
```
