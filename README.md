# LENSCO — Next.js Version

This is a conversion of the original Vite + React SPA to **Next.js 15 (App Router)**.

## Getting started

```bash
npm install
npm run dev
```

Open http://localhost:3000.

To build for production:

```bash
npm run build
npm start
```

## What changed from the Vite version

- **Routing**: The old app used a single `page` state variable in `App.tsx` to fake
  navigation. That's replaced with real Next.js routes and URLs:
  - `/` — home / product grid (was `page === 'home'`)
  - `/product/[id]` — product detail, now a real dynamic route with its own URL,
    statically generated at build time via `generateStaticParams` (was
    `page === 'product'` + a `selectedProduct` state variable)
  - `/cart` — cart (was `page === 'cart'`)
  - `/wishlist` — wishlist (was `page === 'wishlist'`)

  `Navbar` and `BottomNav` now use `next/link` and `usePathname()` instead of an
  `onNavigate` callback prop, and highlight the active tab based on the current URL.

- **Shared cart/wishlist state**: Because pages are now separate routes instead of
  one big component tree, the cart/wishlist state that used to live in `App.tsx`'s
  `useState` has moved to `context/AppContext.tsx`, a client-side React Context
  provider that wraps the whole app in `app/layout.tsx`. As a bonus, it now persists
  to `localStorage`, so the cart/wishlist survive a page refresh (they didn't
  before).

- **Images**: `<img>` tags are replaced with `next/image`, which gives automatic
  resizing/lazy-loading/optimization. `next.config.ts` allow-lists
  `images.unsplash.com` (the domain used by the product photos in
  `data/products.ts`) via `images.remotePatterns`.

- **Server vs. client components**: Pages that only need to _render_ data
  (`app/product/[id]/page.tsx`) are plain server components that look up the
  product and pass it to a client component for the interactive bits (image
  gallery, color picker, tabs). The home page is split the same way
  (`app/page.tsx` server → `components/HomeClient.tsx` client for
  category/sort filtering). Cart and wishlist pages are fully client components
  since everything on them is interactive and reads from the shared context.

- **Metadata**: Each product page now gets its own `<title>`/description via
  `generateMetadata`, which the old SPA couldn't do per-"page".

- **Removed**: the Figma Make–specific tooling (`.figma/`, custom Vite plugins
  for site config/HMR/error overlay, `vite.config.ts`) — none of that is
  relevant to a Next.js app. Tailwind v4 (`@tailwindcss/postcss`) and the same
  design tokens/fonts (`Fraunces` / `Outfit`) are preserved as-is in
  `app/globals.css`, so the visual design is unchanged.

## Project structure

```
app/
  layout.tsx           Root layout: fonts, <AppProvider>, Navbar, BottomNav
  globals.css          Tailwind v4 + design tokens (unchanged from original)
  page.tsx             Home route (server) -> HomeClient
  product/[id]/page.tsx  Product detail route (server, static params) -> ProductDetail
  cart/page.tsx         Cart route (client)
  wishlist/page.tsx     Wishlist route (client)
  not-found.tsx         404 page
components/
  Navbar.tsx, BottomNav.tsx, ProductCard.tsx  (client)
  HomeClient.tsx, ProductDetail.tsx           (client, interactive page bodies)
context/
  AppContext.tsx        Cart/wishlist state + localStorage persistence
data/
  products.ts            Same product catalog as the original
types/
  index.ts               Same Product/CartItem types (minus the old `Page` type)
```
