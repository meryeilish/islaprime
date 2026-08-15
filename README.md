# Isla Prime

Web del servidor **Isla Prime** (The Isle: Evrima) — Next.js 16.

## Desarrollo

```bash
cp .env.example .env.local
npm install
npx prisma db push
npm run dev
```

## Auth / economía / RCON

- `GET /api/auth/steam` — login Steam OpenID
- `GET /api/auth/me` — sesión actual
- `GET /api/wallet` — monedas / marcas
- `GET /api/player/dino` — dino real vía `getplayerdata`
- `POST /api/webhooks/patreon` — recompensas Patreon
- `POST /api/game/apply-skin` — aplicar skin (RCON custom)
- `POST /api/game/claim-reward` — gastar monedas + reward RCON

En el VPS: `ISLE_RCON_HOST=127.0.0.1` y no subir `.env.local`.

## Deploy slim (sin 42 GB)

```bash
npm run pack:vps
# o
npm run deploy:slim
```

GitHub Actions: workflow `Deploy slim` genera artefacto `islaprime-web-slim` (sin `public/models`).
