<div align="center">

# Zamazor Front

**Modern storefront and admin console for a Moroccan supplement & wellness brand.**

A React 19 + TypeScript single-page application covering the full commerce journey —
animated marketing pages, product catalog, guest and authenticated carts, Stripe checkout,
order history, and a role-gated admin dashboard with realtime updates.

![React](https://img.shields.io/badge/React-19.2-61DAFB?logo=react&logoColor=black&style=flat-square)
![TypeScript](https://img.shields.io/badge/TypeScript-6.0-3178C6?logo=typescript&logoColor=white&style=flat-square)
![Vite](https://img.shields.io/badge/Vite-8.0-646CFF?logo=vite&logoColor=white&style=flat-square)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.3-38B2AC?logo=tailwindcss&logoColor=white&style=flat-square)
![TanStack Query](https://img.shields.io/badge/TanStack_Query-5.x-FF4154?logo=tanstack&logoColor=white&style=flat-square)
![Zustand](https://img.shields.io/badge/Zustand-5.0-433E38?style=flat-square)

</div>

---

## Table of Contents

- [Overview](#overview)
- [Key Features](#key-features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation & Setup](#installation--setup)
- [Environment Variables](#environment-variables)
- [Project Structure](#project-structure)
- [Architecture Notes](#architecture-notes)
- [Routing](#routing)
- [Available Scripts](#available-scripts)
- [Backend Contract](#backend-contract)

---

## Overview

Zamazor Front is the client-side application for the Zamazor supplement store. It solves the
problem of presenting a premium, content-heavy wellness brand while still handling the hard
parts of ecommerce correctly: session management, token refresh, cart state that survives the
guest-to-logged-in transition, backend-driven pagination and filtering, and an admin area that
stays in sync with the server without polling.

The codebase is organized as a **feature-sliced architecture** — every domain (auth, cart,
orders, products, dashboard…) owns its components, hooks, schemas, services, and stores, so
features can be worked on in isolation without a shared "everything" folder.

## Key Features

### Storefront

- **Animated marketing homepage** — hero carousel, category merchandising, formulation
  highlights, editorial sections, social proof, reviews, and trust badges, all choreographed
  with Motion.
- **Product catalog** — backend-backed browsing with category filters, goal/dietary facets,
  sorting (price, name), full-text search with debounced autocomplete suggestions, and
  server-side pagination.
- **Product detail pages** — dosage, active ingredients, evidence, optimal daily window, and
  curated reviews.
- **Recently viewed** — locally tracked product history surfaced back to the shopper.
- **Supplement Advisor Quiz** — a multi-step guided flow (focus → diet → activity level) that
  recommends matching products and can add them straight to the cart. Launched from a floating
  action button available across the site.

### Cart, Wishlist & Checkout

- **Guest cart & wishlist** — persisted client-side via Zustand, then **merged into the server
  cart/wishlist on login** (`/carts/sync`, `/wishlists/sync`).
- **Cart drawer + full cart page** — quantity editing, line removal, and a free-shipping
  progress bar.
- **Stripe Checkout** — order creation, redirect to the hosted payment page, then verification
  with dedicated success and cancellation routes.
- **Reorder** — re-add line items from a previous order in one action.

### Accounts & Security

- **Full auth lifecycle** — register, login, logout, silent token refresh, email verification,
  forgot password, and reset password flows.
- **Single-flight token refresh** — concurrent `401`s share one refresh request; failed refresh
  clears the session and notifies the user.
- **Route guards** — declarative `RequireAuth` supporting role allow-lists (`ADMIN`) and
  email-verification requirements.
- **Profile area** — editable user details, shipping addresses, and order history with status
  tracking.

### Admin Dashboard

- **Overview** — revenue and order KPIs, a sales dynamics chart (TanStack Charts), top
  products, category mix, a recent-orders grid, and low-stock alerts.
- **Product management** — create, edit, and delete products with category assignment.
- **Category & order management** — CRUD for categories, order listing with status transitions.
- **Realtime via Server-Sent Events** — a ref-counted singleton SSE connection invalidates the
  relevant TanStack Query caches when the backend emits changes, so open dashboards update
  themselves. Includes exponential backoff with jitter, tab-visibility pausing, and automatic
  reconnect on token rotation.

### Cross-cutting

- **Bilingual UI** — English and French translation dictionaries with dot-notation keys,
  persisted to `localStorage` and reflected on `<html lang>`.
- **Schema-first validation** — Zod schemas validate environment variables at boot, API
  responses, and every form (via React Hook Form).
- **Design system** — shadcn/ui primitives on Radix/Base UI, a custom "Luxe Forest" brand token
  scale driven by CSS custom properties, and consistent toast feedback via Sonner.
- **Performance** — React Compiler enabled, every route lazy-loaded behind Suspense with
  skeleton fallbacks, and a tuned QueryClient (5-minute stale time, no refetch-on-focus,
  no retries on `401`/`403`/`422`).

## Tech Stack

| Concern | Technology |
| --- | --- |
| **UI library** | React 19.2 (with React Compiler) |
| **Language** | TypeScript 6.0 (strict + `noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`, `erasableSyntaxOnly`) |
| **Build tool** | Vite 8 (`@vitejs/plugin-react`, `@rolldown/plugin-babel`) |
| **Styling** | Tailwind CSS 4 (`@tailwindcss/vite`), `tw-animate-css`, CSS custom-property theming |
| **Component kit** | shadcn/ui (`base-nova` style), Radix UI, Base UI, `lucide-react` icons |
| **Server state** | TanStack Query v5 |
| **Client state** | Zustand v5 (with `devtools` middleware) |
| **Routing** | React Router v7 (`createBrowserRouter`, lazy routes) |
| **HTTP** | Axios (separate public & authenticated instances) |
| **Validation** | Zod v4 + React Hook Form + `@hookform/resolvers` |
| **Animation** | Motion / Framer Motion v12 |
| **Charts** | TanStack React Charts, `d3-shape` |
| **Realtime** | `@microsoft/fetch-event-source` (SSE) |
| **Notifications** | Sonner |
| **Forms (marketing)** | `@formspree/react` |
| **Fonts** | Geist Variable, Playfair Display |
| **Linting** | ESLint 10, `typescript-eslint`, `eslint-plugin-react-hooks`, `eslint-plugin-react-refresh` |

## Prerequisites

| Requirement | Version | Notes |
| --- | --- | --- |
| **Node.js** | `^20.19.0` or `>=22.12.0` | Minimum enforced by Vite 8 |
| **npm** | `10+` | Ships with the Node versions above; the repo locks with `package-lock.json` |
| **Zamazor API** | Running backend | Defaults to `http://localhost:8080` |

Verify your toolchain:

```bash
node -v   # should print v20.19+ or v22.12+
npm -v
```

> The frontend is not mockable on its own — authentication, catalog, cart, orders, and the
> dashboard all read from the backend API. Start the API before running the app.

## Installation & Setup

### 1. Clone the repository

```bash
git clone https://github.com/Ayoubedf/zamazor-front.git
cd zamazor-front
```

### 2. Install dependencies

```bash
npm install
```

### 3. Create your environment file

`.env` is gitignored, so create it manually in the project root:

```bash
touch .env
```

Then populate it (see [Environment Variables](#environment-variables)):

```env
VITE_API_BASE_URL=http://localhost:8080
VITE_APP_NAME=Zamazor
```

### 4. Start the development server

```bash
npm run dev
```

Vite prints the local URL — typically <http://localhost:5173>.

### 5. Build for production

```bash
npm run build     # type-checks with tsc -b, then bundles into dist/
npm run preview   # serve the production build locally
```

## Environment Variables

Environment variables are validated with Zod at startup
(`src/app/config/constants.ts`). An invalid value **fails fast** with a descriptive console
error rather than degrading silently at runtime.

| Variable | Required | Default | Description |
| --- | :---: | --- | --- |
| `VITE_API_BASE_URL` | No | `http://localhost:8080` | Base URL of the Zamazor backend API. Must be a valid URL. |
| `VITE_APP_NAME` | No | `Zamazor` | Application name used in titles and branding. |

All client-exposed variables must be prefixed with `VITE_`.

## Project Structure

```txt
zamazor-front/
├── public/                   # Static assets served as-is
├── src/
│   ├── app/                  # Application shell (composition root)
│   │   ├── config/           #   Env validation, constants, API endpoint map, QueryClient
│   │   ├── layouts/          #   RootLayout · MainLayout · DashboardLayout
│   │   └── routes/           #   Router, typed route paths, lazy page registry, fallbacks
│   │
│   ├── assets/
│   │   ├── images/           #   Brand and product imagery
│   │   └── styles/           #   index.css — Tailwind 4 entry + design tokens
│   │
│   ├── features/             # Domain modules (see convention below)
│   │   ├── addresses/        #   Shipping address service, schemas, formatters
│   │   ├── auth/             #   Login/register/reset/verify, token manager, guards
│   │   ├── cart/             #   Guest + server cart, cart drawer, free-shipping logic
│   │   ├── dashboard/        #   Admin overview/products/categories/orders + SSE stream
│   │   ├── faq/              #   FAQ page content and components
│   │   ├── home/             #   Homepage sections (hero, proof, timeline, reviews…)
│   │   ├── orders/           #   Checkout, Stripe payment flow, order status
│   │   ├── products/         #   Catalog, filters, pagination, search, skeletons
│   │   ├── profile/          #   User settings, addresses, order history
│   │   ├── static-pages/     #   Contact, help, returns, shipping, terms, privacy…
│   │   ├── supplement-match/ #   Supplement Advisor Quiz
│   │   └── wishlists/        #   Guest + server wishlist
│   │
│   ├── lib/                  # Framework-level helpers — cn(), notify()
│   ├── shared/               # Cross-feature code
│   │   ├── components/       #   Header, Footer, MobileMenu, NotFound, UI kit
│   │   ├── context/          #   LanguageProvider (EN/FR translations)
│   │   ├── hooks/            #   use-debounce, use-document-title, use-recently-viewed…
│   │   ├── schemas/          #   Shared Zod schemas (pagination)
│   │   ├── types/            #   Shared TypeScript types
│   │   └── utils/            #   axiosPublic, axiosPrivate, parseResponse, price
│   │
│   ├── App.tsx               # Provider composition
│   └── main.tsx              # ReactDOM entry point
│
├── components.json           # shadcn/ui configuration (aliases, style, icon library)
├── eslint.config.js          # Flat ESLint config
├── vite.config.ts            # Plugins, React Compiler, "@" → src alias
├── tsconfig*.json            # Project references (app / node)
└── package.json
```

### Feature module convention

Each folder under `src/features/<domain>/` follows the same shape:

```txt
<domain>/
├── components/    # Presentational + container components, grouped by sub-area
├── config/        # Domain constants and static content
├── hooks/         # Domain-specific React hooks
├── pages/         # Route-level components (lazy-loaded by the router)
├── schemas/       # Zod schemas for entities and form payloads
├── services/
│   ├── api.ts         # Raw axios calls against API_ENDPOINTS
│   ├── keys.ts        # TanStack Query key factory
│   ├── queries.ts     # useQuery wrappers
│   └── mutations.ts   # useMutation wrappers + cache invalidation
├── stores/        # Zustand stores (client-only state)
└── types/         # Domain TypeScript types
```

The `api → keys → queries → mutations` split keeps network code, cache identity, and UI
concerns in separate files, which makes invalidation rules easy to audit.

## Architecture Notes

**State boundaries.** TanStack Query owns everything the server knows (products, orders, user
session). Zustand owns only client-side state (guest cart, guest wishlist, cart drawer
visibility, auth status). This avoids duplicating server data into a global store.

**ID-only persistence + bulk hydration.** The guest cart, guest wishlist, and recently-viewed
stores persist *only* product IDs (and quantities) to `localStorage` via Zustand's `persist`
middleware. Full product objects are resolved at render time through
`useBulkProducts` (`POST /products/bulk`). Stored lists therefore never go stale on price or
stock changes, and `localStorage` stays small.

**Two Axios instances.** `axiosPublic` for unauthenticated endpoints; `axiosPrivate` attaches
the bearer token, and its response interceptor transparently retries a `401` once after a
single-flight refresh. If refresh fails, the session is cleared and a "Session Expired" toast
is shown.

**Typed routes.** `src/app/routes/paths.ts` exports `APP_ROUTES`, where parameterized paths are
created with `createRoute()`. The helper is typed so `APP_ROUTES.PRODUCT({ id })` returns the
interpolated string literal type — passing a wrong param name is a compile error.

**Path alias.** `@/` resolves to `src/`, configured in both `vite.config.ts` and
`tsconfig.app.json`.

**Theming.** `src/assets/styles/index.css` defines the Tailwind 4 `@theme` block and a
"Luxe Forest" brand token scale that is *additive* — it does not override Tailwind's default
palette, so both `bg-brand-900` and `bg-emerald-600` remain valid.

**Code style.** EditorConfig enforces tabs and CRLF line endings. React Compiler is active, so
manual `useMemo`/`useCallback` is generally unnecessary in new code.

## Routing

All routes are lazy-loaded and wrapped in Suspense with a branded fallback.

### Public

| Path | Page |
| --- | --- |
| `/` | Home |
| `/shop` | Product catalog |
| `/product/:id` | Product detail |
| `/cart` | Cart |
| `/wishlist` | Wishlist |
| `/story` · `/contact` · `/faq` · `/help` | Brand & support |
| `/shipping` · `/returns` · `/accessibility` | Policies |
| `/terms` · `/privacy` | Legal |

### Authentication (full-screen layout)

| Path | Page |
| --- | --- |
| `/login` | Sign in |
| `/register` | Create account |
| `/forgot-password` | Request password reset |
| `/reset-password` | Set new password |
| `/verify-email` | Confirm email address |

### Protected

| Path | Requirement |
| --- | --- |
| `/profile` | Authenticated |
| `/profile/orders` | Authenticated + email verified |
| `/checkout` | Authenticated + email verified |
| `/checkout/orders/:orderId/success` | Authenticated + email verified |
| `/checkout/orders/:orderId/cancel` | Authenticated + email verified |

### Admin

| Path | Page |
| --- | --- |
| `/dashboard` | Overview (KPIs + sales chart) |
| `/dashboard/products` | Product management |
| `/dashboard/categories` | Category management |
| `/dashboard/orders` | Order management |

Requires the `ADMIN` role; any other authenticated user is redirected home. Unknown paths
render the `NotFound` page.

## Available Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the Vite dev server with HMR |
| `npm run build` | Type-check (`tsc -b`) then produce an optimized bundle in `dist/` |
| `npm run lint` | Run ESLint across the project |
| `npm run preview` | Serve the production build from `dist/` locally |

Useful one-offs:

```bash
npx tsc -b --noEmit      # type-check without bundling
npx eslint . --fix       # lint and auto-fix
npx shadcn add <name>    # add a UI primitive into src/shared/components/ui
```

> **Testing:** no test runner is currently configured — there is no `npm test` script and no
> test files in the repository. Correctness is enforced today through TypeScript strictness,
> Zod runtime validation, and ESLint (including `react-hooks` rules).

## Backend Contract

The app expects a REST API providing: authentication (with refresh tokens and email
verification), users, products (including search and a bulk ID-lookup endpoint), categories,
carts, addresses, wishlists, orders (with Stripe checkout and payment verification), dashboard
aggregates, and an SSE stream at `/dashboard/events`.

Every URL is centralized in `src/app/config/apiEndpoints.ts` — change endpoints there rather
than at call sites.

**Gotchas worth knowing:**

- Pagination on the storefront and dashboard is designed around *backend* pagination; client
  code does not slice full result sets.
- When assigning a category in the admin product form, submit the **category ID**, not its
  label.
- `VITE_API_BASE_URL` must be reachable from the browser, not just from your machine's shell —
  a tunnel or LAN address is needed when testing on mobile devices.

---

<div align="center">

Built with React, TypeScript, Vite, and Tailwind CSS.

</div>
