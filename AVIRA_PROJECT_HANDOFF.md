# AVIRA — Complete Project Handoff Document

> **Purpose:** Full transfer guide for moving the AVIRA project to a new computer with a new Claude account, new GitHub, and new Vercel deployment.

---

## Table of Contents

1. [What is AVIRA](#1-what-is-avira)
2. [Current Live Status](#2-current-live-status)
3. [Tech Stack](#3-tech-stack)
4. [Project Structure](#4-project-structure)
5. [All Environment Variables](#5-all-environment-variables)
6. [Database Schema Summary](#6-database-schema-summary)
7. [Step-by-Step Setup on New Computer](#7-step-by-step-setup-on-new-computer)
8. [GitHub Setup (New Account)](#8-github-setup-new-account)
9. [Vercel Deployment Setup](#9-vercel-deployment-setup)
10. [Database Setup (Neon PostgreSQL)](#10-database-setup-neon-postgresql)
11. [Third-Party Services to Configure](#11-third-party-services-to-configure)
12. [Admin Panel Access](#12-admin-panel-access)
13. [Key Files and Their Purpose](#13-key-files-and-their-purpose)
14. [Known Issues and Fixes Applied](#14-known-issues-and-fixes-applied)
15. [Important Code Patterns — Do Not Break](#15-important-code-patterns--do-not-break)
16. [Everything Done in Claude Sessions](#16-everything-done-in-claude-sessions)
17. [What Still Needs Doing](#17-what-still-needs-doing)

---

## 1. What is AVIRA

AVIRA is a **full-stack D2C Indian jewellery ecommerce website** with a complete admin CRM backend.

- **Brand tagline:** "Little Things. Beautiful You."
- **Target market:** Indian women, everyday jewellery, gifting, celebrations
- **Business model:** Direct-to-consumer online store (no marketplace)
- **Website type:** Next.js App Router — both the storefront and admin panel in one codebase

### What the site has:
- Full storefront (home, categories, products, cart, checkout, account, wishlist)
- Admin CRM (orders, products, inventory, customers, campaigns, newsletter, reviews)
- Razorpay payment gateway integration (Indian payments: UPI, cards, net banking)
- NextAuth customer authentication (email/password + Google OAuth)
- Resend transactional email
- WhatsApp contact button
- Exit-intent popup with discount
- Scrolling ticker announcement banner
- Newsletter signup with email
- SEO metadata on all pages

---

## 2. Current Live Status

| Item | Value |
|---|---|
| **GitHub Repo (original)** | https://github.com/legacyvault23/Avira |
| **Original GitHub user** | legacyvault23 |
| **Local project path** | E:\From_C_Drive\Avira\avira-web |
| **Build status** | Passing (`npm run build` clean) |
| **Vercel deployment** | Live (auto-deploys from master branch) |
| **Database** | NOT YET CONNECTED — no DATABASE_URL set in Vercel |
| **Payments** | NOT YET CONFIGURED — Razorpay keys missing |
| **Email** | NOT YET CONFIGURED — Resend key missing |

The site currently shows **placeholder data** (Unsplash images, hardcoded product names) because the database has not been set up yet. Everything else is visually complete and functional.

---

## 3. Tech Stack

| Layer | Technology | Version |
|---|---|---|
| Framework | Next.js App Router | 16.3.3 |
| UI Runtime | React | 19.2.8 |
| Language | TypeScript | ^5 |
| Styling | Tailwind CSS | v4 |
| Database ORM | Prisma | ^5.22.0 |
| Database | PostgreSQL | (via Neon free tier recommended) |
| Auth | NextAuth v5 beta | ^5.0.0-beta.32 |
| Payments | Razorpay | ^2.9.8 |
| Email | Resend | ^6.24.0 |
| State management | Zustand | ^5.0.15 (cart + wishlist) |
| Animations | Framer Motion | ^13.1.1 |
| Icons | Lucide React | ^1.35.0 |
| Forms | React Hook Form + Zod | |
| Image optimization | Sharp | ^0.35.4 |
| Package manager | npm | |
| Node requirement | Node.js 18+ | |

**Fonts used:**
- Display: Cormorant Garamond (serif) — headings, editorial
- Body: DM Sans (sans-serif) — UI, paragraphs

---

## 4. Project Structure

```
avira-web/
├── public/
│   └── logo.png                    ← AVIRA logo (986 KB PNG)
├── prisma/
│   ├── schema.prisma               ← Full DB schema (30+ models)
│   └── seed.ts                     ← DB seed script
├── src/
│   ├── app/
│   │   ├── layout.tsx              ← Root layout, fonts, metadata
│   │   ├── globals.css             ← Design tokens, base styles
│   │   ├── (store)/                ← Customer storefront route group
│   │   │   ├── layout.tsx          ← Header + Footer + TickerBanner + MiniCart
│   │   │   ├── page.tsx            ← Home page
│   │   │   ├── about/              ← About page (with photos)
│   │   │   ├── account/            ← Customer account, orders, addresses, wishlist
│   │   │   ├── best-sellers/       ← Best sellers listing
│   │   │   ├── cart/               ← Cart page
│   │   │   ├── category/[slug]/    ← Category product listing
│   │   │   ├── checkout/           ← Checkout + payment
│   │   │   ├── collections/        ← Collections listing + [slug]
│   │   │   ├── contact/            ← Contact page
│   │   │   ├── edit/               ← AVIRA Edit (curated picks)
│   │   │   ├── faq/                ← FAQ page (14 Q&As, 5 categories)
│   │   │   ├── forgot-password/    ← Password reset flow
│   │   │   ├── jewellery-care/     ← Jewellery care guide
│   │   │   ├── login/              ← Customer login
│   │   │   ├── new-arrivals/       ← New arrivals listing
│   │   │   ├── no-return-policy/   ← No return policy page
│   │   │   ├── order-confirmation/ ← Post-purchase confirmation
│   │   │   ├── privacy-policy/     ← Privacy policy
│   │   │   ├── products/[slug]/    ← Individual product page
│   │   │   ├── register/           ← Customer registration
│   │   │   ├── reset-password/     ← Password reset
│   │   │   ├── search/             ← Search results
│   │   │   ├── shipping-policy/    ← Shipping policy
│   │   │   ├── shop-by-mood/       ← Mood-based shopping
│   │   │   ├── terms/              ← Terms & conditions
│   │   │   └── track-order/        ← Order tracking
│   │   ├── (admin)/                ← Admin CRM route group (auth-protected)
│   │   │   ├── layout.tsx          ← Admin layout with sidebar + auth check
│   │   │   └── admin/
│   │   │       ├── page.tsx        ← Dashboard
│   │   │       ├── orders/         ← Orders management
│   │   │       ├── products/       ← Products management
│   │   │       ├── customers/      ← Customer CRM
│   │   │       ├── campaigns/      ← Marketing campaigns
│   │   │       ├── newsletter/     ← Newsletter subscribers
│   │   │       ├── reviews/        ← Review moderation
│   │   │       ├── inventory/      ← Inventory management
│   │   │       └── settings/       ← Site settings
│   │   ├── (admin-public)/         ← Admin login (no auth check — separate group)
│   │   │   ├── layout.tsx          ← Transparent layout
│   │   │   └── admin/login/        ← Admin login page
│   │   └── api/                    ← API routes
│   │       ├── admin/              ← Admin APIs (auth, products, orders…)
│   │       ├── auth/               ← NextAuth handlers
│   │       ├── newsletter/         ← Newsletter subscribe
│   │       ├── orders/             ← Order creation
│   │       ├── payments/           ← Razorpay webhooks
│   │       └── products/           ← Product search/detail APIs
│   ├── components/
│   │   ├── admin/                  ← Admin UI components
│   │   ├── analytics/              ← Analytics tracking
│   │   ├── cart/                   ← MiniCart, CartItem
│   │   ├── category/               ← Category filters
│   │   ├── home/                   ← Home page sections
│   │   │   ├── HeroSection.tsx     ← Hero with background photo
│   │   │   ├── NewArrivalsSection.tsx ← 8 placeholder products
│   │   │   ├── BestSellersSection.tsx ← 4 placeholder products
│   │   │   ├── CategoryGrid.tsx    ← 5 category tiles with photos
│   │   │   ├── LifestorySection.tsx   ← "Jewellery for brighter days"
│   │   │   ├── AviraStory.tsx      ← Brand story section
│   │   │   └── ReviewsSection.tsx  ← Reviews (placeholder data)
│   │   ├── layout/
│   │   │   ├── Header.tsx          ← Nav, logo, cart icon, search
│   │   │   ├── Footer.tsx          ← Links, newsletter, social
│   │   │   └── TickerBanner.tsx    ← NEW: animated scrolling ticker
│   │   ├── product/                ← ProductGallery, ProductInfo, etc.
│   │   └── ui/                     ← Button, ProductCard, AviraMotif, etc.
│   ├── lib/
│   │   ├── db.ts                   ← Prisma client singleton
│   │   ├── constants.ts            ← NAV_LINKS, SITE_NAME, shipping config
│   │   └── utils.ts                ← formatPrice, cn, etc.
│   ├── store/
│   │   ├── cart.ts                 ← Zustand cart store
│   │   └── wishlist.ts             ← Zustand wishlist store
│   └── types/                      ← TypeScript type definitions
├── next.config.ts                  ← Image domains: unsplash + cloudinary
├── package.json                    ← Build script: "prisma generate && next build"
├── .env.local                      ← Local dev env vars (gitignored)
└── AVIRA_PROJECT_HANDOFF.md        ← This file
```

---

## 5. All Environment Variables

Create a `.env.local` file in the project root with these values. Also add all of these to your Vercel project settings under **Settings > Environment Variables**.

```env
# ── Database ────────────────────────────────────────────────────────────────
# Get from Neon.tech (free tier PostgreSQL)
DATABASE_URL="postgresql://user:password@host/dbname?sslmode=require"

# ── NextAuth ─────────────────────────────────────────────────────────────────
NEXTAUTH_URL="https://your-vercel-domain.vercel.app"
NEXTAUTH_SECRET="generate-with: openssl rand -base64 32"
AUTH_SECRET="same-value-as-nextauth-secret"

# For local dev only:
# NEXTAUTH_URL="http://localhost:3000"

# ── App URL ──────────────────────────────────────────────────────────────────
NEXT_PUBLIC_APP_URL="https://your-vercel-domain.vercel.app"
NEXT_PUBLIC_SITE_URL="https://your-vercel-domain.vercel.app"

# ── Razorpay (Indian Payments) ───────────────────────────────────────────────
# Get from razorpay.com > Settings > API Keys
RAZORPAY_KEY_ID="rzp_live_xxxxxxxxxxxx"
RAZORPAY_KEY_SECRET="your-razorpay-secret"
NEXT_PUBLIC_RAZORPAY_KEY_ID="rzp_live_xxxxxxxxxxxx"    # same as KEY_ID
RAZORPAY_WEBHOOK_SECRET="your-webhook-secret"

# ── Resend (Transactional Email) ──────────────────────────────────────────────
# Get from resend.com > API Keys
RESEND_API_KEY="re_xxxxxxxxxxxx"

# ── WhatsApp (optional) ───────────────────────────────────────────────────────
NEXT_PUBLIC_WHATSAPP_NUMBER="919999999999"   # country code + number, no +

# ── Google OAuth (optional — for "Continue with Google" on login) ─────────────
# Get from console.cloud.google.com
AUTH_GOOGLE_ID="your-google-client-id"
AUTH_GOOGLE_SECRET="your-google-client-secret"
```

**To generate NEXTAUTH_SECRET:** Run `openssl rand -base64 32` in any terminal (or use https://generate-secret.vercel.app/32).

---

## 6. Database Schema Summary

The Prisma schema (`prisma/schema.prisma`) has **30+ models**. Key ones:

| Model | Purpose |
|---|---|
| `User` | Customer accounts — `passwordHash`, `email`, `name`, `phone` |
| `CustomerProfile` | Extended customer data — `totalOrders`, `lifetimeValue` |
| `Address` | Delivery addresses |
| `AdminUser` | Admin CRM users — separate from customer `User` |
| `Product` | Products — `slug`, `mrp`, `salePrice`, `costPrice`, `isNewArrival`, `isBestSeller` |
| `ProductMedia` | Product images — `url`, `mediaType` ("image"), `sortOrder` |
| `ProductVariant` | Colour variants of a product |
| `Inventory` | Stock levels per product |
| `Category` | Product categories (earrings, bracelets, etc.) |
| `Collection` | Curated collections |
| `Order` | Orders — `guestEmail`, `shippingAddress` (JSON), `status`, `paymentStatus` |
| `Payment` | Razorpay payment records |
| `Shipment` | Shipping + tracking info |
| `Review` | Product reviews with moderation status |
| `Promotion` / `Coupon` | Discount codes |
| `Campaign` | Marketing banners |
| `NewsletterSubscriber` | Email list |

**Critical field names (do not guess):**
- `ProductMedia`: `mediaType` (string, not `type`), no `isPrimary` field
- `Inventory`: `stock` (not `quantity`)
- `User`: `passwordHash` (not `password`), `profile` relation (not `customerProfile`)
- `Order`: `shippingAddress` is JSON (not a relation), `guestEmail`, `guestPhone`, `guestName`
- `Shipment`: `courier` (not `carrier`)
- `Coupon`: discount fields are on `Promotion` model, not `Coupon`

---

## 7. Step-by-Step Setup on New Computer

### Prerequisites
Install these first:
- **Node.js 18+** — https://nodejs.org (download LTS)
- **Git** — https://git-scm.com
- **VS Code** (recommended) — https://code.visualstudio.com

### Step 1: Clone the repository
```bash
# After you set up new GitHub (see Section 8), clone your new repo:
git clone https://github.com/YOUR-NEW-USERNAME/YOUR-NEW-REPO-NAME.git
cd avira-web
```

### Step 2: Install dependencies
```bash
npm install
```

### Step 3: Set up environment variables
Create a file called `.env.local` in the project root and fill in the values from Section 5.

```bash
# Minimum needed for local dev (without payments or email):
DATABASE_URL="postgresql://..."     # from Neon.tech
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="any-random-32-char-string"
AUTH_SECRET="same-as-above"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### Step 4: Set up the database
```bash
# Push the schema to your new database (creates all tables)
npx prisma db push

# (Optional) Seed with sample data
npx prisma db seed
```

### Step 5: Run locally
```bash
npm run dev
```
Open http://localhost:3000 — the site should load.

### Step 6: Create admin user
The admin panel is at `/admin/login`. To create an admin user, run this in the Prisma Studio or via seed:
```bash
npx prisma studio
```
Or add to the seed file and re-seed.

---

## 8. GitHub Setup (New Account)

Your friend needs their own GitHub account and a new repository.

### Create the repo on GitHub.com:
1. Go to https://github.com/new
2. Repository name: `avira-web` (or any name you prefer)
3. Set to **Private**
4. Do NOT initialize with README (you'll push existing code)
5. Click **Create repository**

### Push the code to the new repo:
```bash
# In the project directory:
# Remove the old remote
git remote remove origin

# Add your new remote
git remote add origin https://github.com/YOUR-USERNAME/YOUR-REPO-NAME.git

# Push all code
git push -u origin master
```

### Verify:
```bash
git remote -v
# Should show your new GitHub URL
```

---

## 9. Vercel Deployment Setup

### Step 1: Create Vercel account
Go to https://vercel.com and sign up with your GitHub account.

### Step 2: Import the project
1. On Vercel dashboard, click **Add New > Project**
2. Connect your GitHub account if not already connected
3. Find your `avira-web` repository and click **Import**
4. Framework will be auto-detected as **Next.js**
5. Leave all build settings as default — do NOT change them
6. Click **Deploy** (this first deploy will fail — that's OK, we need to add env vars first)

### Step 3: Add environment variables
In your Vercel project:
1. Go to **Settings > Environment Variables**
2. Add ALL variables from Section 5
3. For `NEXTAUTH_URL` and `NEXT_PUBLIC_APP_URL`, use your Vercel URL: `https://your-project-name.vercel.app`

### Step 4: Redeploy
1. Go to **Deployments** tab
2. Click the `...` menu on the latest deployment
3. Click **Redeploy**

### Step 5: Verify
Visit your Vercel URL — the site should be live with all images showing.

### Build command (already set in package.json):
```json
"build": "prisma generate && next build"
```
This is critical — Vercel caches node_modules and won't run `prisma generate` otherwise, causing build failures.

---

## 10. Database Setup (Neon PostgreSQL)

**Recommended: Neon.tech** (free tier, generous limits, PostgreSQL-compatible)

### Step 1: Create Neon account
Go to https://neon.tech and sign up (free).

### Step 2: Create a project
1. Click **New Project**
2. Name it `avira`
3. Choose region closest to India (e.g., `ap-southeast-1`)
4. Click **Create Project**

### Step 3: Get the connection string
1. On the project dashboard, find **Connection Details**
2. Copy the **Connection string** — it looks like:
   `postgresql://user:password@ep-xxx.ap-southeast-1.aws.neon.tech/dbname?sslmode=require`
3. Paste this as `DATABASE_URL` in both `.env.local` and Vercel environment variables

### Step 4: Push schema and seed
```bash
# Run from the project directory:
npx prisma db push

# Verify tables were created:
npx prisma studio
# Opens browser UI showing all your empty tables

# Seed sample data (optional):
npx prisma db seed
```

### Step 5: Create first admin user
After `prisma db push`, you need to create an admin user manually. You can do this via Prisma Studio:
1. Run `npx prisma studio`
2. Click on `AdminUser` table
3. Click **Add record**
4. Fill in: `email`, `name`, `role` = `SUPER_ADMIN`, `active` = true
5. For `passwordHash`: You need to hash a password with bcrypt first. Run this in Node:

```javascript
// Run: node -e "require('bcryptjs').hash('YourPassword123', 10).then(h => console.log(h))"
node -e "const bcrypt = require('bcryptjs'); bcrypt.hash('YourPassword123', 10).then(h => console.log(h))"
```

Paste the output hash into the `passwordHash` field.

---

## 11. Third-Party Services to Configure

### Razorpay (Payments)
1. Go to https://razorpay.com and create an account
2. Complete KYC (required for live payments in India)
3. Go to **Settings > API Keys** → Generate keys
4. Use **Test keys** during development, **Live keys** for production
5. Set up webhook: Dashboard > Webhooks > Add webhook
   - URL: `https://your-domain.vercel.app/api/payments/webhook`
   - Events: `payment.captured`, `payment.failed`
   - Copy the Webhook Secret to `RAZORPAY_WEBHOOK_SECRET`

### Resend (Email)
1. Go to https://resend.com and create an account
2. Go to **API Keys** → Create API key
3. Add your domain for sending (or use `onboarding@resend.dev` for testing)
4. Paste API key as `RESEND_API_KEY`

### Google OAuth (Optional — for "Continue with Google" login)
1. Go to https://console.cloud.google.com
2. Create a new project
3. Enable **Google+ API**
4. Go to **Credentials > Create OAuth 2.0 Client ID**
5. Application type: Web Application
6. Authorized redirect URIs: `https://your-domain.vercel.app/api/auth/callback/google`
7. Copy Client ID → `AUTH_GOOGLE_ID`
8. Copy Client Secret → `AUTH_GOOGLE_SECRET`

---

## 12. Admin Panel Access

The admin panel is at: `https://your-domain.vercel.app/admin`

It redirects to: `https://your-domain.vercel.app/admin/login`

**Admin login is separate from customer login** — it uses a separate `AdminUser` table and JWT cookie (`avira_admin_token`), not NextAuth.

After login, you can:
- Add/edit products with images
- Manage orders and update status
- View customer list
- Create campaigns and promotions
- Manage newsletter subscribers
- Moderate reviews
- Adjust inventory

---

## 13. Key Files and Their Purpose

| File | Purpose |
|---|---|
| `src/app/globals.css` | All design tokens (colors, fonts, spacing). Modify brand colors here. |
| `src/lib/constants.ts` | NAV_LINKS, SITE_NAME, SITE_TAGLINE, shipping thresholds |
| `src/app/(store)/layout.tsx` | Store layout — adds TickerBanner + Header + Footer |
| `src/components/layout/TickerBanner.tsx` | Scrolling announcement ticker at top |
| `src/components/layout/Header.tsx` | Main navigation, logo, search, cart icon |
| `src/components/layout/Footer.tsx` | Footer with links, newsletter, social icons |
| `src/components/home/HeroSection.tsx` | Hero with background photo + CTA buttons |
| `src/components/home/NewArrivalsSection.tsx` | Shows 8 products (DB or Unsplash placeholders) |
| `src/components/home/BestSellersSection.tsx` | Shows 4 products (DB or Unsplash placeholders) |
| `src/components/home/CategoryGrid.tsx` | 5 category tiles with photos |
| `src/components/ui/ProductCard.tsx` | Product card used everywhere |
| `src/store/cart.ts` | Zustand cart state (client-side, persisted to localStorage) |
| `src/store/wishlist.ts` | Zustand wishlist state |
| `src/lib/db.ts` | Prisma client singleton |
| `prisma/schema.prisma` | Full database schema |
| `next.config.ts` | Image domains whitelist (Unsplash + Cloudinary) |
| `public/logo.png` | AVIRA logo — 986 KB PNG |

---

## 14. Known Issues and Fixes Applied

These were bugs found and fixed during Claude sessions — do not reintroduce them:

### 1. Heading text invisible on dark backgrounds
**Symptom:** Hero headline, footer headings appeared as dark charcoal on dark backgrounds.
**Root cause:** Global `h1-h6 { color: var(--color-charcoal) }` in `globals.css` is unlayered CSS and overrides Tailwind's `text-white` utility (which lives in `@layer utilities`). In CSS, unlayered styles always beat layered styles.
**Fix:** Removed `color` from the global heading rule in `globals.css`. Headings now inherit from body.

### 2. Vercel build fails: "Prisma has detected this project was built on Vercel"
**Symptom:** Build error about Prisma client not being generated.
**Root cause:** Vercel caches `node_modules` between builds, so `postinstall` doesn't re-run.
**Fix:** Changed build script in `package.json` to `"prisma generate && next build"`.

### 3. Admin login redirect loop
**Symptom:** `/admin/login` redirected to itself infinitely.
**Root cause:** The login page was inside the `(admin)` route group which has an auth-checking layout that redirects to `/admin/login`.
**Fix:** Moved admin login page to a separate `(admin-public)` route group with a transparent layout.

### 4. useSearchParams() SSR error
**Symptom:** Build error on `/login`, `/register`, `/search` pages.
**Root cause:** Next.js App Router requires `useSearchParams()` to be wrapped in `<Suspense>`.
**Fix:** Extracted inner components and wrapped default exports in `<Suspense>`.

### 5. Checkout crashes with "location is not defined"
**Symptom:** `/checkout` page crashed during SSR.
**Root cause:** `router.replace("/cart")` called synchronously during render.
**Fix:** Wrapped redirect in `useEffect`.

### 6. ProductMedia field name mismatch
**Symptom:** Admin product creation failed.
**Root cause:** Code used `type: "IMAGE"` and `isPrimary: true` — neither field exists on `ProductMedia`.
**Fix:** Changed to `mediaType: "image"` (no `isPrimary`).

### 7. Pages with DB queries fail static generation
**Symptom:** Build failures on pages that query the database.
**Fix:** Added `export const dynamic = "force-dynamic"` to all pages that import from `@/lib/db`.

---

## 15. Important Code Patterns — Do Not Break

### Route Groups
- `(store)` — customer-facing store, layout wraps with Header/Footer/cart/WhatsApp/exit-intent
- `(admin)` — CRM, layout checks `avira_admin_token` cookie and redirects to admin login if missing
- `(admin-public)` — admin login ONLY, transparent layout with no auth check

**Never put admin login inside `(admin)` — it causes an infinite redirect loop.**

### DB Queries on Server Components
All server components that query the DB must have:
```tsx
export const dynamic = "force-dynamic";
```
Otherwise Next.js tries to statically generate them at build time and fails without a DB.

### DB Queries Must Have try/catch
```tsx
async function getData() {
  try {
    return await db.model.findMany({ ... });
  } catch {
    return [];   // or null — never let it throw to the page
  }
}
```

### Tailwind in globals.css
If you add any CSS rule outside a `@layer` block in `globals.css`, it will override Tailwind utilities. Always put custom base styles in `@layer base {}`:
```css
@layer base {
  h1, h2, h3 {
    /* safe here — won't override Tailwind utilities */
  }
}
```

### Image Sources
Allowed remote image domains (in `next.config.ts`):
- `images.unsplash.com` — placeholder jewelry photos
- `res.cloudinary.com` — for when you add product image uploads

---

## 16. Everything Done in Claude Sessions

### Session 1 — Full codebase build
- Built complete Next.js 16.3.3 App Router project from scratch
- Designed all Prisma schema models (30+)
- Built customer storefront (all pages, routes, components)
- Built admin CRM (dashboard, orders, products, customers, campaigns, newsletter, reviews)
- Set up NextAuth with credentials + Google OAuth
- Integrated Razorpay payment flow
- Integrated Resend for transactional email
- Built Zustand stores for cart and wishlist
- Fixed all TypeScript and build errors
- Set up `.env.local` for local development

### Session 2 — GitHub + Vercel deployment
- Created GitHub repo at https://github.com/legacyvault23/Avira
- Pushed all code to GitHub
- Deployed to Vercel (auto-deploy from master branch)
- Fixed Vercel build error: added `prisma generate &&` to build script
- Fixed all pages with DB queries: added `export const dynamic = "force-dynamic"`
- Fixed admin login redirect loop: moved to `(admin-public)` route group
- Fixed `useSearchParams()` Suspense errors on login/register/search
- Fixed checkout SSR crash (router.replace in useEffect)

### Session 3 — Logo and product images
- Copied `Avira Logo.png` to `public/logo.png` (986 KB)
- Added hero background image (Unsplash jewelry photo)
- Updated CategoryGrid to render real images (5 Unsplash jewelry photos)
- Updated NewArrivalsSection with 8 unique Unsplash jewelry photos
- Updated BestSellersSection with 4 unique Unsplash jewelry photos
- Replaced all `/placeholder-product.jpg` fallbacks site-wide with Unsplash URLs

### Session 4 — 11 website changes from feedback document
Based on the user's feedback document, the following 11 changes were made:

1. **Scrolling ticker** — Created `TickerBanner.tsx` component with CSS scroll animation, replaces the static announcement bar. Shows: free shipping, handcrafted in India, gift wrapping, secure payments, new arrivals weekly, etc.

2. **Font readability** — Increased base font size 15px → 16px, line-height 1.6 → 1.65

3. **Warm-grey contrast** — Darkened `--color-warm-grey` token from `#9B8F89` to `#6E6460` for WCAG AA compliance on ivory/cream backgrounds

4. **Hero text contrast** — Eyebrow text `white/50` → `white/80`

5. **Footer text contrast** — Footer link text `white/60` → `white/80`, copyright text `white/40` → `white/70`

6. **Hero height** — Reduced from `90dvh` to `70vh` (less wasted space)

7. **About page rebuild** — Complete redesign: hero photo, two editorial jewelry photos (Unsplash), "How It Began" story with photo, values grid (6 tiles), quote block, CTA button

8. **Removed PackagingStory section** — Removed from home page (was placeholder circles only)

9. **Created /faq page** — 14 Q&As across 5 categories: Orders/Shipping, Products, Returns, Payments, Gifting

10. **Fixed broken footer links** — `/refund-policy` → `/no-return-policy`, FAQ now links to real `/faq` page

11. **Removed all em-dashes** — Replaced `—` and `–` in all 12+ customer-visible files with commas, colons, or natural language

12. **Product page graceful fallback** — Wrapped DB query in try/catch, no more crashes when DB is unavailable

13. **Login error messages** — Better UX: distinguishes "auth not configured" from "wrong credentials"

### Session 5 — Heading visibility fix
- Fixed critical bug: global CSS `h1-h6 { color: var(--color-charcoal) }` was overriding Tailwind's `text-white` utility
- Removed `color` property from global heading rule in `globals.css`
- Now headings are white on dark sections and charcoal on light sections as intended

---

## 17. What Still Needs Doing

These are not yet done and will need to be completed:

### High Priority
- [ ] **Connect the database** — Set up Neon PostgreSQL, add `DATABASE_URL` to Vercel
- [ ] **Create admin user** — Hash password and insert into `AdminUser` table
- [ ] **Add real products** — Use admin panel to add products with real photos
- [ ] **Set up Razorpay** — Add API keys to Vercel env vars, configure webhook
- [ ] **Set up Resend** — Add API key, verify sending domain

### Medium Priority
- [ ] **Set up Google OAuth** — For "Continue with Google" on login page
- [ ] **Upload real product images** — Currently using Unsplash placeholders
- [ ] **Configure WhatsApp number** — Set `NEXT_PUBLIC_WHATSAPP_NUMBER` in Vercel
- [ ] **Add real categories to DB** — Earrings, Bracelets, Necklaces, Rings, Sets
- [ ] **Add real collections** — Create curated collections via admin panel
- [ ] **Custom domain** — Point your domain to Vercel in Vercel > Settings > Domains

### Nice to Have
- [ ] **Google Analytics or Plausible** — Analytics already has tracking hooks, just add ID
- [ ] **Sitemap** — `/api/sitemap.xml` or Next.js `generateSitemap`
- [ ] **Cloudinary** — For production image uploads via admin panel
- [ ] **Abandoned cart emails** — The schema supports it, email automation not yet set up
- [ ] **SMS notifications** — Not yet integrated
- [ ] **Reviews moderation** — Seed some reviews via admin > Reviews panel
- [ ] **Exit intent popup** — Currently has 10% discount logic, needs a real coupon code in DB

---

## Quick Reference Commands

```bash
# Local development
npm run dev                    # Start dev server at localhost:3000

# Database
npx prisma db push             # Push schema changes to DB (no migration files)
npx prisma db seed             # Run seed file
npx prisma studio              # Visual DB browser
npx prisma generate            # Regenerate Prisma client after schema changes
npx prisma migrate dev         # Create migration file (for production changes)

# Build and type check
npm run build                  # Full production build
npx tsc --noEmit               # Type check only

# Git
git add .
git commit -m "Your message"
git push origin master         # Pushes to GitHub, Vercel auto-deploys

# Admin panel
# URL: https://your-domain.vercel.app/admin/login
# Email: whatever you set when creating the AdminUser record
# Password: whatever you hashed
```

---

## Brand Design Tokens (for reference)

These are in `src/app/globals.css`:

```css
--color-plum:        #54283C    /* Primary brand colour — deep plum */
--color-plum-light:  #6b3450    /* Lighter plum */
--color-plum-dark:   #3c1d2b    /* Darker plum */
--color-ivory:       #FBF7F2    /* Page background */
--color-cream:       #F9F4EC    /* Card backgrounds */
--color-blush:       #F0DDD5    /* Accent/section backgrounds */
--color-champagne:   #E8D5B7    /* Highlight areas */
--color-warm-grey:   #6E6460    /* Body text, muted labels (darkened for WCAG AA) */
--color-charcoal:    #2C2521    /* Headings, dark text */
--color-rose-gold:   #C9956C    /* Accents, price highlights */
```

Fonts:
- Display (headings): `Cormorant Garamond, Playfair Display, Georgia, serif`
- Body: `DM Sans, Inter, system-ui, sans-serif`

---

*Document generated from Claude sessions. Last updated: September 2026.*
*GitHub repo: https://github.com/legacyvault23/Avira*
*Project path: E:\From_C_Drive\Avira\avira-web*
