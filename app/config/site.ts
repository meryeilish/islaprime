export const siteConfig = {
  name: "Isla Prime",
  tagline: "Caza · Sobrevive · Evoluciona",
  game: "The Isle: Evrima",
  map: "Gateway",
  /** IP:puerto de juego (público, para conectar en The Isle). */
  serverIp: "87.237.54.227:7777",
  maxPlayers: 50,
  urls: {
    steamLogin: "/api/auth/steam",
    discord: "https://discord.gg/hyTQWgc8nJ",
    patreon: "https://patreon.com/islaprime",
    tienda: "https://tienda.islaprime.com",
    theIsleSteam:
      "https://store.steampowered.com/app/376210/The_Isle/",
  },
} as const;
