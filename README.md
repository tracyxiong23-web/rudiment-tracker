# 40 Rudiments — Drum Practice Tracker

A standalone version of your rudiment tracker, ready to deploy to Vercel.

## What changed from the Claude artifact version

- Storage now uses the browser's `localStorage` instead of Claude's `window.storage`, so it works as a normal website. Your practice data lives in the browser on whatever device you use it on (same as most simple web apps — it won't sync across devices unless you add a backend later, same tradeoff as before you wired up Firebase on the budget app).
- Custom app icon (practice pad + crossed drumsticks) is wired up as the favicon and the "Add to Home Screen" icon on iOS/Android.
- Everything else — themes, notation, streaks, sparklines — is unchanged.

## Deploy to Vercel

**Option A — GitHub import (same flow as the budget app):**
1. Create a new empty repo on GitHub.
2. From this folder: `git init && git add . && git commit -m "init"`
3. `git remote add origin <your-repo-url> && git push -u origin main`
4. In Vercel: **New Project → Import** your repo. Vercel auto-detects Vite — no config needed.
5. Deploy. You'll get a `*.vercel.app` URL, and can add a custom domain later if you want.

**Option B — Vercel CLI (faster, no GitHub needed):**
```bash
npm install -g vercel
vercel login
vercel --prod
```
Run that from this project folder and follow the prompts.

## Local development
```bash
npm install
npm run dev
```

## Notes
- If you ever want cross-device sync (like the budget app has with Firebase), the storage layer is isolated in `src/App.jsx` inside the `persist`, and the `useEffect` that loads data on mount — swap those for Firestore calls and everything else stays the same.
- Icons live in `/public` if you ever want to redesign them.
