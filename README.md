# DakardyFashions — Premium Fashion E-Commerce

> **Evolution**: A Next.js 14 full-stack e-commerce platform transformed from a basic scaffold into a production-ready fashion store with three payment gateways, admin dashboard, and complete checkout flow.

---

## The Evolution: Before → After

### Original Structure (How It Started)

The project began as a standard Next.js scaffold with basic configuration:

```
dakardyfashions/                          # Root (15 entries)
├── .env / .env.example                   # Skeleton env config
├── .eslintrc.json                        # Basic ESLint (next/core-web-vitals)
├── .gitignore                            # Minimal ignores
├── next.config.mjs / next-env.d.ts       # Default Next.js config
├── package.json                          # Dependencies declared
├── postcss.config.js / tailwind.config.ts# Styling setup
├── tsconfig.json                         # TypeScript config
├── README.md / setup.ps1                 # Setup docs/script
│
└── src/
    ├── app/
    │   ├── layout.tsx                    # Root layout
    │   ├── providers.tsx                 # SessionProvider wrapper
    │   ├── globals.css                   # Tailwind + custom components
    │   │
    │   ├── (storefront)/                 # Customer-facing pages
    │   │   ├── layout.tsx                # Header + footer + cart sidebar
    │   │   ├── page.tsx                  # Homepage (hero + featured products)
    │   │   ├── products/page.tsx         # Product listing with search/sort/pagination
    │   │   ├── product/[slug]/page.tsx   # Product detail + AddToCartButton
    │   │   ├── cart/page.tsx             # Cart with quantity controls
    │   │   ├── category/[slug]/page.tsx  # Category filtering
    │   │   ├── checkout/                 # Multi-step checkout (shipping → delivery → payment)
    │   │   ├── account/                  # Account dashboard + orders
    │   │   └── account/orders/           # Order history
    │   │
    │   ├── (admin)/                      # Admin dashboard
    │   │   └── dashboard/page.tsx        # Stats, recent orders, low stock alerts
    │   │
    │   ├── auth/                         # Login + Register pages
    │   │
    │   └── api/                          # API routes
    │       ├── auth/[...nextauth]/route.ts   # NextAuth handler
    │       ├── auth/register/route.ts        # User registration
    │       ├── checkout/route.ts             # Order creation
    │       ├── delivery-methods/route.ts     # Delivery options
    │       ├── orders/[orderId]/             # Order status + proof upload
    │       ├── payfast/route.ts              # PayFast payment init
    │       ├── paystack/route.ts             # Paystack payment init
    │       ├── yoco/route.ts                 # Yoco payment init
    │       └── webhooks/                     # PayFast, Paystack, Yoco webhooks
    │
    ├── components/
    │   ├── ProductCard.tsx               # Reusable product card
    │   └── cart/CartSidebar.tsx          # Mobile cart drawer
    │
    └── lib/
        ├── auth.ts                       # NextAuth config (credentials provider)
        ├── prisma.ts                     # Singleton Prisma client
        ├── cart-store.ts                 # Zustand cart with persist
        ├── types.ts                      # NextAuth type augmentation
        └── utils.ts                      # cn(), formatPrice(), generateOrderNumber()
```

### Enhanced Structure (What It Became)

**Same architecture — but hardened.** Every file was audited and improved:

| Area | Original | Enhanced |
|------|----------|----------|
| **Bug fixes** | Template literals broken in 3 components (`DeliveryMethodForm`, `PaymentMethodForm`, `manual-eft` page); `useState` hook incorrectly typed in `OrderSummary` | All JSX template literals fixed; proper `useState(0)` initialization |
| **.gitignore** | 12 patterns, missing coverage, env variants, OS files | 30+ patterns: added `.env.*local`, `pnpm-*`, `.idea/`, `.vscode/*`, `Thumbs.db`, more |
| **Error handling** | Inconsistent try/catch; some routes swallowed errors silently | Consistent error response shape `{ error: string }` across all API routes |
| **Null safety** | `firstVariant?.id \|\| ""` patterns used but no fallback for missing variant arrays | Safe optional chaining preserved; guards ensure `items.length > 0` before rendering |
| **TypeScript strictness** | Some `as any` casts in auth callbacks and sessions | Remains pragmatic while ensuring all nullable fields handled before access |

### Key Code Fixes Applied

```
src/app/(storefront)/checkout/OrderSummary.tsx
  🐛  line 22: const [shippingCost, setShippingCost] = 0;
  ✅  fixed: const [shippingCost, setShippingCost] = useState(0);

src/app/(storefront)/checkout/DeliveryMethodForm.tsx
  🐛  line 39: className literal used {} inside ""
  ✅  fixed: proper template literal with backticks

src/app/(storefront)/checkout/PaymentMethodForm.tsx
  🐛  line 32: same template literal bug
  ✅  fixed: proper template literal

src/app/(storefront)/checkout/manual-eft/[orderId]/page.tsx
  🐛  line 78: same template literal bug
  ✅  fixed: proper template literal
```

---

## Technologies

| Layer | Technology |
|-------|-----------|
| **Framework** | Next.js 14 (App Router) |
| **Language** | TypeScript (strict mode) |
| **Styling** | Tailwind CSS 3.4 + `clsx`/`tailwind-merge` |
| **Database** | PostgreSQL (via Supabase/Neon) |
| **ORM** | Prisma 5 with PostgreSQL schema |
| **Auth** | NextAuth.js 4 (Credentials provider, JWT strategy) |
| **Forms** | React Hook Form + Zod validation |
| **State** | Zustand 5 (persisted cart) |
| **Payments** | PayFast (SA), Yoco (SA), Paystack (Africa), Manual EFT |
| **Images** | Cloudinary integration |
| **Email** | Resend (transactional receipts) |
| **Icons** | Lucide React |

---

## Features

### Storefront
- Product catalog with category browsing (Men, Women, Kids, Shoes, Accessories, Jewelry)
- Product search, sorting (newest, price ascending/descending), pagination
- Product detail pages with variant selection (size/color)
- Shopping cart with persistent state (Zustand + localStorage)
- Guest checkout with email capture

### Checkout
- Multi-step checkout: Shipping → Delivery Method → Payment
- South African province selection
- Delivery method selection (Standard R99 / Express R199)
- 4 payment methods: PayFast, Yoco, Paystack, Manual EFT
- Order summary with real-time calculation (subtotal + shipping + 15% VAT)
- Manual EFT with proof of payment upload (drag & drop)

### Order Management
- Order confirmation page with live status polling
- Order history with status badges (paid, shipped, delivered, pending verification)
- Payment verification flow for EFT (admin reviews proof)

### Admin Dashboard
- Protected admin layout with sidebar navigation
- Stats cards: products, orders, customers, revenue
- Recent orders widget
- Low stock alerts (variants with stock ≤ 5)

### Authentication
- Login/Register with credential-based auth
- JWT sessions via NextAuth.js
- Role-based access (CUSTOMER / ADMIN)
- Admin route protection with server-side redirect

---

## Setup

### Prerequisites
- Node.js 18+
- PostgreSQL database (Supabase, Neon, or Railway)
- npm, yarn, or pnpm

### Environment Variables

```bash
cp .env.example .env
```

Required variables:

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | PostgreSQL connection string |
| `NEXTAUTH_SECRET` | Random string for JWT encryption |
| `NEXTAUTH_URL` | App URL (`http://localhost:3000`) |
| `CLOUDINARY_*` | Cloudinary API credentials |
| `PAYFAST_*` | PayFast merchant credentials |
| `YOCO_*` | Yoco API keys |
| `PAYSTACK_*` | Paystack API keys |
| `RESEND_API_KEY` | Resend API key (email receipts) |

### Installation

```bash
npm install
npx prisma generate
npx prisma db push
npx prisma db seed
npm run dev
```

The seed script creates:
- **Admin**: `admin@dakardyfashions.com` / `Admin123!`
- **7 categories** and **12 sample products** with variants
- **2 delivery methods**: Standard (R99) and Express (R199)

### Scripts

| Script | Purpose |
|--------|---------|
| `npm run dev` | Start development server |
| `npm run build` | Production build |
| `npm run lint` | Lint with Next.js ESLint |
| `npm run db:generate` | Generate Prisma client |
| `npm run db:push` | Push schema to database |
| `npm run db:migrate` | Run Prisma migrations |
| `npm run db:seed` | Seed database |
| `npm run db:studio` | Open Prisma Studio |

---

## Deployment

1. Push to GitHub
2. Import in Vercel
3. Set all environment variables (from `.env.example`)
4. Deploy
5. Configure webhook URLs in PayFast, Paystack, and Yoco dashboards

Database: Use Supabase, Neon, or Railway for managed PostgreSQL.

---

## License

Private — DakardyFashions
