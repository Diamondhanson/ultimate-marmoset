# Ultimate Marmoset & Capuchin Monkeys Home

A deep-canopy website for a hand-raising primate nursery, built with Next.js 16,
Tailwind CSS v4, Supabase and Resend.

## What's inside

- **Public site** — home, available monkeys (with species filter), individual
  listing pages, about, care guide, delivery & visit policy, health guarantee,
  reviews, FAQ, contact
- **Reservations** — visitors build a list and send a reservation request (no
  online payment); it's saved to Supabase and emailed to the owner, with a
  confirmation emailed back to the family
- **Reviews** — visitors submit reviews, the owner approves and features them
- **Contact form** — saved to Supabase and emailed to the owner
- **Admin dashboard** (`/admin`) — owner-only login: add/edit/delete listings
  with photo uploads, manage reservations, moderate reviews, read messages

## Run it

```bash
npm install
npm run dev
```

Open <http://localhost:3000>. With no keys configured the site runs in
**preview mode** with 10 sample monkeys; the dashboard at `/admin` accepts any
email with the password `preview`.

## Share images & brand assets

Every page produces a proper link preview when pasted into Facebook, WhatsApp,
iMessage or X. The home page has its own designed card, and each monkey's page
generates one showing that animal's photo, name, species, age, price and
status — so a shared listing is always current. Previews need a real public
domain and a correct `site.url`; see SETUP.md.

Logo, social profile picture and Facebook cover art are in
[`public/brand/`](public/brand/README.md), downloadable from the live site at
`/brand/…`.

## Go live

Follow [SETUP.md](SETUP.md) — create a Supabase project, run
`supabase/schema.sql`, create a Resend key, and paste the values into
`.env.local`. Everything switches from sample data to the real database
automatically; no code changes are needed.

## Where things live

| Path | What it is |
|---|---|
| `app/(site)/` | Public pages |
| `app/admin/` | Gated dashboard |
| `app/actions/` | Server Actions (all mutations) |
| `lib/data.ts` | The single data layer — falls back to sample data without Supabase |
| `lib/email.ts` | Resend templates; no-ops cleanly without a key |
| `lib/site.ts` | Business details: name, phone, email, socials, deposit amount |
| `lib/sample-monkeys.ts` | Preview-mode catalogue |
| `supabase/schema.sql` | One-shot database + storage setup |
| `proxy.ts` | Auth gate for `/admin` |
| `public/monkeys/` | The nursery's own photos used across the site |
| `app/opengraph-image.tsx` | Generated 1200×630 share card for the home page |
| `app/(site)/monkeys/[slug]/opengraph-image.tsx` | Per-monkey share card — name, species, age, price and status, drawn from the listing |
| `app/brand-assets/facebook-cover/` | Generates the 1640×856 social cover art |
| `app/icon.png`, `app/apple-icon.png`, `app/favicon.ico` | Browser and home-screen icons, all built from `public/brand/logo.svg` |
| `public/brand/` | Downloadable logo, profile picture and cover art — see its README |
| `assets/` | Brand font files, used only to draw the generated images |
