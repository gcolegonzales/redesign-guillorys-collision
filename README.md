# Guillory's Collision Center — Website Redesign Concept

An unsolicited, single-page website redesign concept for **Guillory's Collision Center, Inc.** —
a family-owned auto body and collision repair shop in Gonzales, LA.

## Why this redesign

Their current website (`autocollisionrepairgonzales.com`) loads an **error page** — it's effectively
down. Anyone who searches for the shop online finds nothing working, which means missed estimates and
lost trust for a business that has earned a 37-year reputation and a 4.6-star average across 62
reviews. This concept shows a fast, modern, mobile-friendly site — built around the shop's real brand
voice ("Honest people, quality work") — that puts the phone number, the free-estimate request, and the
lifetime warranty front and center.

## What's included

- Animated sticky/shrinking header with animated nav underlines, a motion mobile menu, and
  click-to-call `(225) 622-4144`
- A hero anchored by a **real photo of the shop** on Hwy 44 and a "Get a free estimate" CTA
- An editorial services list covering all real services: collision repair, auto body & paint,
  frame & structural, paintless dent repair, auto glass, and insurance + rental-car help
- A "How it works" numbered process (free estimate → insurance handled → repair with updates → dual
  sign-off + lifetime warranty), drawn from the shop's own described process
- A real, styled **Free Estimate request form** (name, phone, vehicle year/make/model, damage
  description, optional photo upload) — the shop's money feature
- Trust ("why us"), a headline customer review with supporting quotes, and location/hours/contact
  with a "Get directions" link
- Smooth scroll-reveal + count-up animations, responsive from 360px phones to widescreen, and full
  `prefers-reduced-motion` support

## Real photos

The photos in `assets/photos/` are the shop's own images, recovered from the **Wayback Machine**
archive of the old `autocollisionrepairgonzales.com` site — the real building and lot on Hwy 44.

## How to view

Just open `index.html` in any browser (double-click it). No build step, no dependencies —
it's fully static.

## SEO

On-page SEO is retrofitted: `AutoBodyShop` JSON-LD structured data (name, phone, address,
opening hours, image, url, areaServed, aggregateRating, sameAs), a canonical link, complete
Open Graph + Twitter Card tags, plus `robots.txt` and `sitemap.xml` at the repo root.

**Base URL placeholder:** the canonical link, `og:url`, JSON-LD `url`/`image`, `robots.txt`, and
`sitemap.xml` all use the literal placeholder `https://REPLACE-WITH-DOMAIN.com/`. Before deploying,
do a one-line find-and-replace of `https://REPLACE-WITH-DOMAIN.com/` with the real domain across
those files.

## Notes

- The estimate form is a front-end demo; it is **not wired to a backend** and sends nothing.
- Data (hours, services, address, phone, rating) was verified against public directory listings and
  the shop's archived website; review quotes are illustrative and labeled as such on the page.
- This is an unsolicited concept pitch, not the official Guillory's Collision Center website.
