# TrendKart — Rate List & Stock Register

A rate-list and stock-register tool for a mobile-accessories counter in Jalandhar, Punjab.
The dashboard shows street rates against printed MRPs, estimated margins, and what to stock next.

---

## What it is

| | |
|---|---|
| **Rate list** | 120 product lines across 15 categories (Cables, Chargers, Power Banks, Earphones, TWS, Headphones, Speakers, Covers, Screen Guards, Power Strips, OTG & Hubs, Ring Lights, Selfie Sticks, Mounts, Accessories), sorted by rank within each category. |
| **Stock register** | A per-browser ledger of what is on the shelf. Add lines from the rate list, mark them in-stock / low / out, remove them. Nothing leaves the device — it lives in `localStorage` only. |
| **Buy suggestions** | Three lines worth restocking next: best margin, fastest mover under ₹1 500, and the top seller in a category you carry nothing in yet. |
| **Coverage** | A quick read of which categories have live stock and which are gaps. |

## Data

`src/data/catalog.ts` is a **hand-compiled** sample catalogue of 120 product lines across 15 categories with representative Punjab street rates and printed MRPs. It is **not a live price feed** and is **not affiliated with any retailer**. Search volumes and weekly deltas are indicative bands only.

Margin figures are **estimated by band**, not quoted rates (see `MARGIN_NOTE` in `src/lib/market.ts`):

| Street rate | Assumed retail margin |
|---|---|
| Up to ₹500 | 45 % |
| ₹501 – ₹2,000 | 35 % |
| ₹2,001 – ₹10,000 | 25 % |
| Above ₹10,000 | 15 % |

## Swapping in a live feed

`src/lib/market.ts` is the **single seam** between the UI and the data source. It exports four simple accessors:

```ts
getProducts()             // → Product[]
getProductsByCategory()   // → Product[]
getTrends()               // → TrendRow[]
getDataAsOf()             // → string  (ISO date)
```

To plug in a real feed, replace the bodies of those four functions (or change what `src/data/catalog.ts` exports). Every component reads through `market.ts`, so nothing else changes.

## Register

The register is stored in **this browser only** using `localStorage`. Clearing site data clears it. Nothing is uploaded or synced.

## API routes

| Route | Description |
|---|---|
| `GET /api/rates` | All products. |
| `GET /api/rates?category=Cables` | Products in a single named category. Pass `all` for everything. |
| `GET /api/trends` | Trend rows with weekly delta and search-volume band. |

Both routes return JSON and are rendered on demand by the Next.js App Router.

## Dev scripts

```sh
npm run dev          # Turbopack dev server → http://localhost:3000
npm run build        # Production build (downloads IBM Plex fonts on first run — network required)
npm run start        # Serve the production build
npm run lint         # ESLint (eslint-config-next)
npm run typecheck    # tsc --noEmit (strict)
npm test             # 30 unit tests via node:test
```

The test runner uses Node's built-in `node:test` with `--experimental-strip-types` and a path-alias resolve hook in `tests/hooks.mjs`. It requires **zero extra test dependencies** — keep it that way.

## Tech stack

- **Next.js 16** (App Router, Turbopack)
- **React 19**
- **Tailwind CSS v4** — CSS-first, no `tailwind.config.js`
- **TypeScript** (strict)
- **IBM Plex Sans / Condensed / Mono** — loaded at build time via `next/font/google`

## Theme

Light and dark modes are class-based (`.dark` on `<html>`). A tiny blocking script injected in `<head>` reads `localStorage` before first paint, so dark mode never flickers on reload. The toggle is in the top-right corner of the app bar.

---

> The catalogue is hand-compiled from what moves at a Punjab accessories counter — representative street rates and printed MRPs. Not a live price feed. Not affiliated with any retailer.
