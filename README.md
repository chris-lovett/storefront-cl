# Cloudflare Storefront Demo

A simple e-commerce storefront built for Cloudflare Workers. It includes:

- product catalog
- add-to-cart functionality
- cart summary
- checkout form
- order confirmation flow
- customer profile panel

This is intended as a clean starter app for a shopping site that can later be extended with:
- product images
- login/auth
- persistent cart storage
- database-backed order history
- Stripe integration
- admin dashboard

## Prerequisites

- Node.js 18+
- Cloudflare account
- Wrangler CLI

## Install

```bash
npm install
```

## Login to Cloudflare

```bash
npx wrangler login
```

## Run locally

```bash
npm run dev
```

Then open the local URL shown by Wrangler.

## Deploy

```bash
npm run deploy
```

## Project files

- `src/index.js` — Worker logic and HTML UI
- `wrangler.toml` — Worker configuration
- `package.json` — scripts and dependencies

## Notes

This demo stores cart state in memory using a session cookie. That works for a quick deployment and demo, but for production you'd usually replace it with:
- Cloudflare KV
- Cloudflare D1
- Durable Objects

## Example purchase flow

1. Browse products
2. Add items to cart
3. Fill in shipping info
4. Submit checkout
5. Receive order confirmation ID

## Next ideas

- Support product image assets
- Add login and user accounts
- Persist orders in D1
- Add a cart page and product detail page
- Integrate payment processing
