# Punching Machine Leaderboard

A React-powered arcade-style leaderboard frontend for tracking punching machine scores.

## Features

- Neon arcade UI with responsive leaderboard and animated impact feedback
- Local mock API layer (`src/services/scoresApi.js`) designed to be swapped with a Vercel + Supabase backend
- Score entry form, ranked leaderboard, and quick performance stats
- GitHub Pages deployment workflow on every push to `main`

## Local development

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

## Future backend integration points

- Replace methods in `/home/runner/work/punching-machine/punching-machine/src/services/scoresApi.js` with HTTP calls to your Vercel Serverless API.
- Keep response shape compatible with current score objects (`id`, `player`, `score`, `power`, `createdAt`).
- Add auth/user profile logic around the same API abstraction layer without changing UI components.
