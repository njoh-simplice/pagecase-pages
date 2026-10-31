# NSAGENCY

A minimalist landing page for a software, communication and consulting agency. Big condensed type, a monospace voice, one accent colour and smooth scroll motion.

[Live demo](https://ns-agency.heysimplice.com/)

![NSAGENCY landing page](../../websites-captures/next/ns-agency.png)

## Features

- Single-page layout with four sections: About, Projects, Members and Contact
- Typographic design: Anton for headings, Kode Mono for body text, loaded with `next/font`
- Smooth scrolling with [Lenis](https://github.com/darkroomengineering/lenis) and scroll-driven animation with [GSAP](https://gsap.com)
- Responsive layout styled with Tailwind CSS v4
- SEO included: metadata, JSON-LD structured data, `robots.txt`, web manifest, `llms.txt` and a custom 404 page
- All text lives in one file, so you can rebrand it without touching the components

## Stack

- [Next.js](https://nextjs.org) 16 (App Router) and React 19
- TypeScript
- Tailwind CSS v4
- GSAP and Lenis

## Run locally

Requires Node.js 20.9 or later.

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). For a production build:

```bash
npm run build
npm start
```

## Make it yours

Edit [lib/content.ts](lib/content.ts) to change:

| Export | What it controls |
| ------ | ---------------- |
| `brand`, `tagline` | Agency name and description |
| `email`, `address` | Contact details |
| `services` | The services and their items |
| `projects` | Project names, categories and images |
| `members` | Team roles, names and descriptions |
| `portfolioUrl`, `author` | The "Website by" credit and contact links |

Then:

- Replace the images in `public/work/` with your own, and update their `width` and `height` in `projects`.
- Replace the icons in `public/` (`favicon.ico`, `apple-touch-icon.png`, `icon-192.png`, `icon-512.png`).
- Update `public/llms.txt` with your own description.
- Change fonts and colours in [app/layout.tsx](app/layout.tsx) and [app/globals.css](app/globals.css).

The project names and team members in `lib/content.ts` are placeholders. Replace them with real ones before you publish.

## Environment variables

| Variable | Purpose |
| -------- | ------- |
| `NEXT_PUBLIC_SITE_URL` | Your production URL, for example `https://example.com`. Used for metadata and structured data. Optional. |

## Project structure

```
app/            Routes: page, layout, 404, robots and manifest
components/     Motion (Lenis and GSAP), JSON-LD and small UI pieces
lib/            Content, structured data and text-splitting helpers
public/         Icons, project images and llms.txt
```

## Deploy

Deploy on [Vercel](https://vercel.com). Import the repository and set the **Root Directory** to `Next/ns-agency`. Leave the build settings at their defaults. If you set `NEXT_PUBLIC_SITE_URL`, add it under **Environment Variables**.

## Author

Created by [Njoh Simplice](https://heysimplice.com).
