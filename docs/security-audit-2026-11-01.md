# Security audit — BloomingRock marketing site

**Date:** 2026-11-01  
**Scope:** `dianadcerv/bloomingrock-website` (forms, Paid Look intake + private Blob, `/product`, headers, SEO)  
**Aligned with:** Gauge live-site audit (fix-soon list)

## Executive summary

Forms and server actions are in good shape overall (signed runtime form tokens, honeypot, Turnstile, sanitization, generic errors). This pass **patched runtime dependencies**, **fail-closed production auth for tokens and Turnstile**, **reduced client exposure to Blob upload code**, and **hardened upload validation**. Remaining items are mostly platform/CSP tradeoffs and serverless rate-limit semantics.

---

## Findings

| Severity | Finding | Evidence | Recommended fix | Status |
|----------|---------|----------|-----------------|--------|
| **Critical** | Next.js advisories (cache/`use cache` RCE & leaks, image optimizer SSRF/RCE, Server Actions DoS) on 16.0–16.4.0 | `npm audit` before fix; `package-lock.json` had `next@16.3.6` | Bump to patched Next (16.4.3+) via `npm audit fix` | **Fixed in PR** |
| **High** | `sharp`, `source-map-js`, `brace-expansion` transitive issues | `npm audit` | `npm audit fix` (lockfile refresh) | **Fixed in PR** |
| **High** | `zod` memory DoS in `@vercel/blob` → `@vercel/cli-config` chain | `npm audit`; `npm ls zod` showed 4.1.11 nested | `package.json` `"overrides": { "zod": "^4.6.6" }` | **Fixed in PR** |
| **High** | Predictable form token secret in production (`bloomingrock-form-token` / missing `FORM_TOKEN_SECRET`) | `src/lib/look-security.ts` `tokenSecret()` | Require `FORM_TOKEN_SECRET` in production; dev-only fallback | **Fixed in PR** |
| **High** | Turnstile fail-open when both keys unset | `verifyTurnstile()` returned `true` if no secret and no site key | Fail closed in production unless **both** keys configured | **Fixed in PR** |
| **Medium** | Client bundle pulled `@vercel/blob` via shared module import from `PaidLookIntakeForm` | Build output previously included Blob in `.next/static` | Split limits to `paid-look-upload-limits.ts`; server-only upload module | **Fixed in PR** |
| **Medium** | Upload MIME trust client `File.type` only | `validatePaidLookUploads` | Magic-byte sniff + mismatch check (`verifyPaidLookUploadContents`) | **Fixed in PR** |
| **Medium** | In-memory rate limits (`SlidingWindowLimiter`) not shared across serverless instances | `look-security.ts` module singletons | Vercel KV / Upstash / edge middleware when abuse becomes visible | **Open — documented** |
| **Medium** | CSP allows `'unsafe-inline'` and `'unsafe-eval'` (Next/Tailwind/Turnstile) | `next.config.ts` | Tighten with nonces/hashes when Next 16 CSP story stabilizes | **Open — accept risk for now** |
| **Low** | No `Strict-Transport-Security` in app config (Vercel also sends HSTS on custom domains) | `next.config.ts` | Add HSTS header | **Fixed in PR** |
| **Low** | `/paid-look-intake` relied on page `robots` metadata only | `paid-look-intake/page.tsx` `noindex` | Add `robots.txt` `Disallow` (defense in depth) | **Fixed in PR** |
| **Low** | Resend email fallback includes private Blob URLs when Command Center intake fails | `paid-look-intake/actions.ts` `sendPaidLookEmailNotification` | Prefer portal-only delivery for uploads; omit URLs from email or use signed short-lived links | **Fixed** (names/count only; no URLs; controlled submissions omit names) |
| **Info** | Secrets not in client bundles | Grep `.next/static` for API keys; only `NEXT_PUBLIC_TURNSTILE_SITE_KEY` passed to client | Keep server-only env for `FORM_TOKEN_SECRET`, `TURNSTILE_SECRET_KEY`, `RESEND_*`, `BLOB_*`, `INTAKE_*` | **Verified OK** |
| **Info** | Runtime form tokens via `connection()` + `mintFormToken()` | `look-security.ts` | Avoid minting tokens at static build time | **Verified OK** |
| **Info** | `/product` indexable; `/paid-look-intake` not in sitemap | `sitemap.ts`, page metadata | No change needed | **Verified OK** |
| **Info** | Private Blob `access: "private"` on Paid Look uploads | `paid-look-intake-upload.ts` | Unchanged | **Verified OK** |
| **Info** | XSS: user input escaped in email HTML; JSON-LD via `JSON.stringify` | form `actions.ts`, marketing pages | Continue pattern | **Verified OK** |
| **Moderate (dev)** | `minimatch` DoS via ESLint toolchain only | `npm audit` post-fix | Wait for eslint-config-next; avoid `audit fix --force` | **Accept risk (dev-only)** |

---

## Production checklist (Vercel)

Ensure these env vars are set in **Production** (not only Preview):

- `FORM_TOKEN_SECRET` — dedicated secret for HMAC form tokens (required after this PR)
- `NEXT_PUBLIC_TURNSTILE_SITE_KEY` + `TURNSTILE_SECRET_KEY`
- `RESEND_API_KEY`, `RESEND_EMAIL_DOMAIN` (optional but recommended)
- `INTAKE_INBOUND_SECRET` and `COMMAND_CENTER_URL` (required in production for Command Center POST; local dev defaults to `http://localhost:3001` when unset)
- `BLOB_READ_WRITE_TOKEN` for Paid Look file uploads

---

## Commands run

```bash
npm audit
npm audit fix
npm install   # zod override
npm run lint
npm run test
npm run build
```
