# Password-protected hosting (Cloudflare Pages)

GitHub Pages cannot do server-side Basic Auth. This repo includes `functions/_middleware.js` for **Cloudflare Pages** only.

## One-time setup

1. [Cloudflare Dashboard](https://dash.cloudflare.com) → **Workers & Pages** → **Create** → **Pages** → **Connect to Git**.
2. Repo: `lgarciaaco/lgarciaaco.github.io`, branch `main`.
3. Build settings:
   - **Framework preset:** None
   - **Build command:** (empty)
   - **Build output directory:** `/`
4. After first deploy → **Settings** → **Environment variables** → **Production** → add **Secrets**:
   - `BASIC_USER` — username for the browser prompt
   - `BASIC_PASS` — password (use a long random string)
5. **Redeploy** so secrets are picked up.
6. Optional: **GitHub** → repo **Settings** → **Pages** → **Disable** Pages so `https://lgarciaaco.github.io/` is not a public bypass.

Your protected URL will be like `https://lgarciaaco-github-io.pages.dev` (or a custom domain you attach in CF).

## Update credentials

Pages → project → **Settings** → **Variables** → edit secrets → redeploy.

## Local test (optional)

```bash
npx wrangler pages dev . --compatibility-date=2024-01-01
# In another terminal, set secrets for local dev in wrangler.toml or via dashboard
```

## Security note

Basic Auth over HTTPS is fine to keep casual visitors out; it is not enterprise-grade (shared password, browser stores creds). Good enough for a private screening table.
