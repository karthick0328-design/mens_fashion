# AURELIUS | Men's Fashion & Accessories E-Commerce Platform

A production-grade, full-stack Men's Fashion & Accessories e-commerce platform built with **React (TypeScript)** on the frontend and **Node.js/Express (JavaScript ES Modules)** on the backend, backed by **MongoDB**. Designed with an original, luxury sartorial visual identity and the robust usability standards of top Indian e-commerce marketplaces (Flipkart, Amazon).

---

## 1. Project Overview & Features

### Customer Experience:
- **Homepage**: Luxury hero lifestyle showcase, Shop-by-Category responsive cards (T-Shirts, Shirts, Jeans, Trousers, Watches, Shoes, Accessories), Trending Now, Best Sellers, and Fine Horology watch spotlight.
- **Product Listing & Faceted Search (`/products`)**:
  - Direct alignment with **Reference Image 1**.
  - Collapsible filter sidebar: Department categories, multi-brand search, dual-ended price range, interactive size buttons, color swatches, customer ratings, discount thresholds, and out-of-stock toggles.
  - Sorting: Relevance, Popularity, Price (Low to High), Price (High to Low), Newest Arrivals, Biggest Discount.
  - Complete synchronization with URL query parameters for persistent bookmarking and navigation.
- **Product Detail & Variant Engine (`/products/:slug`)**:
  - Direct alignment with **Reference Image 2**.
  - Multi-angle vertical thumbnail gallery with high-res zoom lens.
  - Interactive variant matrix: selecting colors dynamically updates images and available sizes; out-of-stock sizes are disabled/struck-through.
  - Live stock urgency indicator ("Only 3 left in stock - order soon" in amber).
  - Indian 6-digit PIN code delivery estimator with estimated delivery dates.
  - Size Chart modal with measurements (Chest, Length, Shoulder).
  - Promos & Bank Offers card with one-click code copy.
  - Sticky mobile bottom action bar (`[ Add to Bag ]` and `[ Buy Now ]`).
  - Category-specific dynamic specifications table.
  - Verified customer ratings and reviews with 5-star distribution bars.
- **Shopping Bag & Wishlist**:
  - Slide-in Cart Drawer and dedicated `/cart` page with variant previews, quantity controls bounded by live inventory, voucher validation (`WELCOME10`, `FASHION20`, `LUXE500`), and real-time subtotal computation.
  - Instant optimistic Wishlist toggle with server sync.
- **Zero-Trust Checkout & Orders**:
  - Multi-step checkout: Address selection/creation, Order summary, Payment simulation (COD, UPI, Net Banking, Credit/Debit card).
  - **Zero-Trust Price Integrity**: Client NEVER submits prices or totals; the backend recalculates prices, discounts, and shipping fees server-side.
  - **Atomic Concurrency Control**: Stock is decremented atomically via MongoDB `$elemMatch` and `$inc`, preventing overselling.
  - Visual shipment progress timeline (`CONFIRMED` → `PROCESSING` → `SHIPPED` → `DELIVERED`).
  - Order cancellation with automatic inventory restock.
- **Customer Account Center (`/profile`)**:
  - Saved addresses with default address management.
  - Order history and status lookup.

### Admin Management Portal (`/admin`):
- **Executive Dashboard**: Live KPIs (Total Sales, Total Orders, Active Customers, Active Catalog, Low Stock Alerts), weekly sales velocity chart, recent transactions, and low stock inventory watchlist.
- **Product Management**: Filterable product catalog table with search and creation modal.
- **Live Inventory Manager**: Real-time SKU-level inventory control with inline stock adjustment (`PATCH /api/v1/admin/inventory/:sku`).
- **Order Fulfillment Pipeline**: Order management with live milestone transitions (`PROCESSING`, `SHIPPED`, `DELIVERED`).
- **Customer Directory**: Customer spending totals, order history counts, and registration dates.

---

## 2. Technology Stack & Ports

- **Frontend**:
  - React 18 + **TypeScript** (Strict mode)
  - Vite Bundler
  - Tailwind CSS + Headless UI patterns
  - TanStack Query v5 (Server state caching)
  - Zustand (Client UI & cart drawer state)
  - Lucide React (Icons)
  - **Port**: `http://localhost:3000`
- **Backend**:
  - Node.js + Express (**JavaScript ES Modules**)
  - Mongoose 8 (MongoDB ODM)
  - Helmet (HTTP security headers)
  - CORS (Configured for `http://localhost:3000`)
  - Rate Limiting (`express-rate-limit`)
  - JWT Authentication + bcryptjs (12 salt rounds)
  - Morgan (HTTP request logger)
  - **Port**: `http://localhost:5000`
- **Database**:
  - MongoDB (`mongodb://localhost:27017/mens_fashion_db`)
  - Compound indexes and text search indexes

---

## 3. Monorepo Folder Structure

```
e:\Men's Website\
├── package.json               # Root npm workspaces orchestrator
├── tsconfig.base.json         # Base TypeScript options
├── .gitignore
├── .env.example
├── server/                    # Node.js/Express (JavaScript ES Modules)
│   ├── package.json
│   ├── .env
│   ├── .env.example
│   └── src/
│       ├── config/            # DB connection (db.js) & Env loader (env.js)
│       ├── constants/         # Roles, Order statuses, Sizes, Categories
│       ├── controllers/       # Auth, Product, Cart, Wishlist, Order, Admin
│       ├── middleware/        # JWT auth, errorHandler, rateLimiter
│       ├── models/            # User, Category, Product, Cart, Order, Review, Coupon
│       ├── routes/            # Express routers under /api/v1/*
│       ├── seeds/             # 80 realistic products with full variant matrices
│       ├── utils/             # Token utilities
│       ├── app.js             # Express application configuration
│       └── server.js          # Server bootstrap listener on port 5000
└── client/                    # React 18 + TypeScript + Vite
    ├── package.json
    ├── vite.config.ts         # Configured for port 3000 with /api proxy
    ├── tailwind.config.js     # Luxury menswear design tokens
    ├── index.html
    └── src/
        ├── components/
        │   ├── layout/        # Header, AnnouncementBar, Footer
        │   ├── home/          # HeroBanner, CategoryGrid, WatchSpotlight
        │   ├── product/       # ProductCard, FilterSidebar, SizeChartModal
        │   └── cart/          # CartDrawer
        ├── pages/
        │   ├── Home/
        │   ├── Products/      # Ref Image 1 Faceted Search & Listing
        │   ├── ProductDetails/# Ref Image 2 Gallery, Variants & Buy Box
        │   ├── Cart/          # Dedicated Cart & Voucher application
        │   ├── Wishlist/      # Saved wishlist grid
        │   ├── Checkout/      # Multi-step checkout
        │   ├── Orders/        # Order history & Milestone tracking
        │   ├── Profile/       # Account details & Address book
        │   ├── Auth/          # Login & Register
        │   └── Admin/         # Dashboard, Products, Inventory, Orders, Customers
        ├── services/          # Axios API client with JWT interceptor
        ├── store/             # Zustand stores (useAuthStore, useCartStore, useWishlistStore)
        ├── types/             # Domain TypeScript definitions (IUser, IProduct, ICart, etc.)
        ├── App.tsx            # Route map
        └── main.tsx           # Entrypoint with QueryClientProvider & BrowserRouter
```

---

## 4. Setup & Running Instructions

### Prerequisites
- Node.js `v20.x` or higher
- npm `v10.x` or higher
- MongoDB Server running locally on `localhost:27017`

### 1. Install Dependencies
Run from the root directory:
```bash
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` into `server/.env`:
```env
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:3000
MONGO_URI=mongodb://localhost:27017/mens_fashion_db
JWT_SECRET=super_secret_mens_fashion_jwt_key_98234710928374
JWT_EXPIRES_IN=7d
BCRYPT_SALT_ROUNDS=12
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX=1000
```

### 3. Populate Database (Seed Data)
Seed 80 curated products across 7 categories with complete variant matrices, coupons, customer reviews, and default test accounts:
```bash
npm run seed
```

### 4. Run Both Frontend and Backend Concurrently
From the root workspace directory:
```bash
npm run dev
```
- **Backend API**: `http://localhost:5000/api/v1/health`
- **Frontend Storefront**: `http://localhost:3000`

---

## 5. Pre-Configured Test Credentials

| Role | Email | Password | Access Level |
|---|---|---|---|
| **Administrator** | `admin@example.com` | `Admin@123` | Full Admin Portal (`/admin`), Products, Inventory, Orders |
| **Demo Customer** | `customer@aurelius.com` | `Customer@123456` | Saved Addresses, Wishlist, Bag, Checkout, Order Tracking |

---

## 6. Verification & Automated Test Commands

Run the automated end-to-end test verifying all 10 core commerce operations (Health, Catalog fetch, Registration, Cart sync, Coupon math, Zero-trust checkout, Atomic stock decrement, Tracking timeline, and Admin order fulfillment):
```bash
node scratch/e2e_verify.js
```

Verify client TypeScript compilation and production bundle:
```bash
npm run build --workspace=client
```
