# SpotMijnVlucht Deals

Next.js applicatie voor het tonen van vliegaanbiedingen van SpotMijnVlucht. De app gebruikt een eigen API
(endpoints gehost op Google Cloud Run) voor het ophalen en beheren van deals en bevat componenten voor een
in-house admin dashboard.

## Projectstructuur

- `app/` – App Router met de publieke homepage (`page.tsx`) en API-routes (bijv. `api/deals`).
- `components/` – UI-componenten voor zowel frontend (cards, testimonials) als admin-modules.
- `lib/` – Helperfuncties en integraties (affiliate tracking, Supabase, normalisatie van deals).
- `styles/` – Tailwind CSS configuratie en globale stijlen.

## Vereiste omgevingvariabelen

De homepage haalt deals op via `/api/deals`. Deze route proxy’t naar de externe API.
Stel de volgende variabelen in (bijvoorbeeld via `.env.local` of Vercel Environment Variables):

```env
# Basis URL van de externe deals-API
DEALS_API_BASE_URL=https://spotmijnvlucht-api-778985017095.europe-west1.run.app

# Optioneel: pad of volledig endpoint voor het ophalen van deals
DEALS_API_PATH=/deals

# Optioneel: authenticatie richting de externe API
DEALS_API_KEY=\<API sleutel>
DEALS_API_AUTH_HEADER=Authorization
# Gebruik bij bearer-tokens de spatie aan het einde: "Bearer "
DEALS_API_KEY_PREFIX="Bearer "
```

Laat `DEALS_API_KEY`, `DEALS_API_AUTH_HEADER` of `DEALS_API_KEY_PREFIX` leeg als de externe API geen
authenticatie vereist of een andere header gebruikt.

## Ontwikkelomgeving

```bash
npm install
npm run dev
```

De applicatie draait standaard op `http://localhost:3000`.

### Linting

```bash
npm run lint
```

## Deal normalisatie

De normalisatielogica bevindt zich in `lib/deals.ts`. `app/api/deals/route.ts` haalt de externe API op en
converteert het antwoord naar een uniform formaat. Wanneer de externe API geen data terugstuurt, wordt een
fallback-deal geleverd zodat de frontend bruikbaar blijft.

## Admin dashboard

De map `components/admin` bevat een uitgebreide set van UI-componenten voor dealbeheer, expiratiebeheer,
nieuwsbriefinschrijvers en analytics. De bijbehorende API-routes (`/api/admin/*`) dienen nog gekoppeld te
worden aan een backend of database (bijv. Supabase of de Cloud Run API) zodat data vanuit het dashboard
kan worden beheerd.

