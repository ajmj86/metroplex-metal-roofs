# Metroplex Metal Roof Visualizer

Single-page Next.js 14 app embedded via iframe on a WordPress site. Users enter their address, configure a metal roof style and color, submit their contact info, and receive an AI-generated before/after comparison.

## Stack

- **Next.js 14** (App Router, TypeScript)
- **Tailwind CSS** with custom brand tokens
- **OpenAI** `gpt-image-1` via `images.edit`
- **Google Maps** Street View Static API + Maps Static API + Places API (autocomplete)
- **GoHighLevel** webhook for lead delivery

---

## Setup

### 1. Clone & install

```bash
npm install
```

### 2. Environment variables

Copy `.env.example` to `.env.local` and fill in each value:

```bash
cp .env.example .env.local
```

| Variable | Description |
|---|---|
| `GOOGLE_MAPS_API_KEY` | Server-side key for Street View + Maps Static API routes |
| `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` | Same key — exposed to browser for Places Autocomplete |
| `OPENAI_API_KEY` | OpenAI key with access to `gpt-image-1` |
| `NEXT_PUBLIC_GHL_WEBHOOK_URL` | GoHighLevel inbound webhook URL |

Both Google Maps variables use the **same key value** — the split exists only because server-side env vars are not exposed to the browser in Next.js.

### 3. Google Cloud Console — enable APIs

In the [Google Cloud Console](https://console.cloud.google.com/apis/library), enable:

1. **Street View Static API** — fetches the house photo
2. **Maps Static API** — satellite fallback when Street View is unavailable
3. **Places API** — powers the address autocomplete in the address input field

Restrict the key to these two APIs and add HTTP referrer restrictions for your domain in production.

### 4. OpenAI access

`gpt-image-1` requires access via the OpenAI API. Ensure your organization has been granted image editing access and that your API key has the `images` scope.

### 5. Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Deploy to Vercel

```bash
npx vercel
```

Set all environment variables in the Vercel project dashboard under **Settings → Environment Variables**.

### Vercel plan requirements

| Feature | Requirement |
|---|---|
| AI image generation (up to ~30 s) | **Vercel Pro** — serverless functions timeout at 10 s on Hobby |
| File uploads > ~3 MB | **Vercel Pro** — larger request bodies supported |

The `/api/render` route sets `export const maxDuration = 60` which requires the Pro plan.

---

## WordPress iframe embed

Add this to any WordPress page or widget:

```html
<iframe
  src="https://your-visualizer.vercel.app"
  width="100%"
  style="min-height: 700px; border: none; border-radius: 8px;"
  scrolling="yes"
  loading="lazy"
></iframe>
```

### Listening for the CTA postMessage

When the user clicks "Get My Free Estimate", the iframe posts:

```javascript
{
  type: "metroplex-get-estimate",
  address: "123 Main St, Dallas, TX",
  roofType: "Standing Seam",
  color: "Charcoal"
}
```

Handle it on the parent page:

```javascript
window.addEventListener('message', (e) => {
  if (e.data?.type === 'metroplex-get-estimate') {
    // scroll to your estimate form, pre-fill fields, etc.
    console.log(e.data);
  }
});
```

---

## API Routes

### `POST /api/resolve-image`

**Request**
```json
{ "address": "123 Main St, Dallas TX" }
```

**Response**
```json
{
  "imageUrl": "https://maps.googleapis.com/...",
  "source": "streetview",
  "address": "123 Main St, Dallas TX"
}
```

`source` is `"streetview"` or `"satellite"`. Uses the Street View Metadata API to verify a real image exists before returning the Street View URL — avoids the grey placeholder that the Static API returns for unmapped addresses.

---

### `POST /api/render`

**Request**
```json
{
  "imageUrl": "https://maps.googleapis.com/... OR data:image/jpeg;base64,...",
  "roofType": "Standing Seam",
  "color": "Charcoal",
  "colorHex": "#3A3A3A"
}
```

**Response**
```json
{ "renderedImageUrl": "data:image/png;base64,..." }
```

Accepts both HTTPS image URLs (street view / satellite) and `data:` URIs (file uploads). Calls `openai.images.edit` with `model: gpt-image-1`.

---

## Lead payload sent to GHL

```json
{
  "name": "Jane Smith",
  "phone": "214-555-0100",
  "email": "jane@example.com",
  "address": "123 Main St, Dallas TX",
  "roofType": "Standing Seam",
  "color": "Charcoal",
  "smsConsent": true,
  "emailConsent": false,
  "imageSource": "streetview",
  "timestamp": "2025-06-10T14:23:00.000Z",
  "source": "visualizer"
}
```

---

## Project structure

```
src/
  app/
    layout.tsx          — root layout, Google Fonts
    page.tsx            — step state machine (steps 1–3)
    globals.css         — Tailwind + scrollbar styles
    privacy/page.tsx    — privacy policy
    terms/page.tsx      — terms of service
    api/
      resolve-image/route.ts   — Google Maps API calls
      render/route.ts          — OpenAI gpt-image-1 edit
  components/
    StepOne.tsx         — address input + file upload fallback
    StepTwo.tsx         — house preview, roof/color picker, lead form
    StepThree.tsx       — result view + CTA
    BeforeAfterSlider.tsx — drag-to-compare component
  types/
    index.ts            — shared types, ROOF_TYPES, COLORS constants
```
