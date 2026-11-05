# ns-trip

Website for ns-trip, a demo tourism company in Cameroon. Two pages: Home and Contact.

**Live:** https://ns-trip.heysimplice.com
**Design and development:** [Njoh Simplice](https://heysimplice.com)

**Stack:** React 19, Vite, Tailwind CSS 4, GSAP (ScrollTrigger, SplitText), Lenis

## Run locally

Needs Node.js 20.19 or later.

```bash
npm install
npm run dev
```

## Scripts

| Command           | What it does                    |
| ----------------- | ------------------------------- |
| `npm run dev`     | Start the dev server            |
| `npm run build`   | Build for production to `dist/` |
| `npm run preview` | Preview the production build    |
| `npm run lint`    | Lint with oxlint                |

## Structure

```
src/
├── pages/            Home.jsx and Contact.jsx (App.jsx picks one from the URL)
├── components/
│   ├── layout/       Navbar (with the Destinations mega menu), Footer,
│   │                 FooterScene (the drawn hikers scene), Cursor
│   ├── contact/      ContactForm
│   ├── home/         Hero, RegionsGrid, MaskedBanner, StickySteps, About,
│   │                 WhyUs, Facts, Itineraries, Stories, CallToAction
│   └── ui/           Button, Frame (pixel corners, crosses), Icons, MediaPlaceholder
├── hooks/            useLenis (smooth scroll), useReveal (heading/paragraph reveals)
├── libs/gsap.js      Registers GSAP plugins and the default ease once
└── utils/            content.js (all page copy), trails.js (hero route lines)
```

Design tokens (colours, fluid type scale `text-h1` to `text-small`, page margin) are in `src/index.css`.

## Images

Place photos are WebP files in `src/assets/images/places/`. Photos from Wikimedia Commons are credited in the footer (`footer.photoCredits` in `content.js`); keep that list in step with the images. The only placeholder left is the "Brand film" video in the About section (`MediaPlaceholder`). The hero artwork is generated: `TopoCanvas.jsx` draws the contour map and `utils/trails.js` holds the route lines.

All copy lives in `src/utils/content.js`. Facts about Cameroon are real; the ns-trip claims and itineraries are sample copy to review.

## Logo and icons

The logo is an olive square (`#566246`) on paper (`#f5f6f3`). Every file below uses that same shape.

| File | Size | Used by |
| ---- | ---- | ------- |
| `src/assets/images/ns-trip-logo.svg` | vector | Navbar and footer |
| `public/favicon.ico` | 16, 32, 48 | Browser tab (fallback) |
| `public/favicon.svg` | vector | Browser tab |
| `public/apple-touch-icon.png` | 180 × 180 | iOS home screen |
| `public/icon-192.png`, `public/icon-512.png` | 192, 512 | Web app manifest |
| `public/icon-maskable-512.png` | 512 | Android adaptive icon (extra padding for the safe zone) |
| `public/og-image.jpg` | 1200 × 630 | Link previews (Open Graph, X/Twitter) |

## Pages, SEO and deployment

Each page has its own HTML entry with its title, description, canonical URL, social tags and structured data: `index.html` (home) and `contact/index.html`. Both are listed in `vite.config.js`, so the build writes `dist/index.html` and `dist/contact/index.html` and any static host serves `/contact/` without rewrite rules.

Files in `public/` are copied to the site root:

| File | Purpose |
| ---- | ------- |
| `robots.txt` | Allows all crawlers and points to the sitemap |
| `sitemap.xml` | Lists `/` and `/contact/`; update `lastmod` when content changes |
| `llms.txt` | Plain-text summary of the site for AI assistants |
| `humans.txt` | Credits |
| `404.html` | Branded "page not found" page, used by most static hosts |
| `manifest.webmanifest` | Web app name, colours and icons |
| `_headers` | Security and cache headers (Netlify, Cloudflare Pages) |
| `.well-known/security.txt` | Where to report security issues |

The site URL (`https://ns-trip.heysimplice.com`) appears in the two HTML entries, `robots.txt`, `sitemap.xml`, `llms.txt` and `site.url` in `content.js`. Change it in all of them if the domain changes.

The contact form shows a thank-you message but does not send anything yet. Connect `handleSubmit` in `src/components/contact/ContactForm.jsx` to a form service before relying on it.

## Security headers

`public/_headers` sets a strict Content-Security-Policy (everything from this site only), HSTS, `nosniff`, `X-Frame-Options: DENY`, a referrer policy, a permissions policy and long caching for `/assets/*`. Netlify and Cloudflare Pages apply it automatically. On another host (Vercel, Apache, Nginx, GitHub Pages), copy the same headers into that host's config; GitHub Pages cannot set headers at all.

When the contact form is connected to a service, add that service's origin to `connect-src` (if the form uses `fetch`) or `form-action` (if it posts directly), or the browser will block the request.

The form already has length limits on every field and a hidden spam-trap field (`website`); keep validating and rate-limiting on the server side too, since browser checks can be bypassed.

`.well-known/security.txt` expires on 2027-11-05: update the `Expires` date before then.
