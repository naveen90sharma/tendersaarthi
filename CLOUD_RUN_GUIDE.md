# Cloud Run Deployment & Development Guide

To prevent build failures and "ECONNREFUSED" errors on Google Cloud Run, follow these rules:

## 1. Dynamic Rendering (CRITICAL)
Any page that fetches data from the database or API MUST be marked as dynamic. This prevents Next.js from trying to fetch data during the Docker build process when no database/server is available.

**Do this at the top of every new route/page:**
```typescript
export const dynamic = 'force-dynamic';
```

## 2. Supabase / Database Strategy
Always use the shim in `@/services/supabase`. 
- **DO NOT** use the raw `supabase-js` client in server components if it requires `process.env` keys that aren't available at build time.
- Our shim is build-safe and handles the transition between client-side and server-side fetching automatically.

## 3. Firebase Safety
Firebase environment variables are NOT available during Docker build.
- Firebase is initialized lazily in `src/services/firebase.ts`.
- If you add new auth functions, always check if `auth` is defined before using it, or use the wrappers in `src/services/auth.ts`.

## 4. Environment Variables
When deploying a new version to Cloud Run, ensure these variables are set in the Cloud Run Service configuration:
- `DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`
- `NEXT_PUBLIC_FIREBASE_API_KEY` (and other Firebase keys)
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SITE_URL` (Current deployment URL)

## 5. Local Testing before Push
Before pushing to GitHub, always run:
```bash
npm run build
```
If this command fails locally, it will DEFINITELY fail on Cloud Run. Fix all build errors locally first.
