export type SupporterTierId =
  | "supporter"
  | "vip"
  | "hunter"
  | "apex";

export interface SupporterTier {
  id: SupporterTierId;
  emoji: string;
  name: string;
  price: string;
  priceNote: string;
  coins: number;
  coinsLabel: string;
  popular?: boolean;
  summary: string;
  perks: string[];
}

/** Moneda de la isla — crece, recompensas y desbloqueos en la web. */
export const primeCoins = {
  name: "Monedas Prime",
  short: "Monedas",
  cadence: "cada 2 semanas",
  uses: [
    "Comprar grows en The Isle",
    "Participar en recompensas y sorteos",
    "Desbloquear funciones de la web",
  ],
} as const;

export const supporterTiers: SupporterTier[] = [
  {
    id: "supporter",
    emoji: "🌱",
    name: "Prime Supporter",
    price: "$5",
    priceNote: "/ mes",
    coins: 7,
    coinsLabel: "7 Monedas Prime cada 2 semanas",
    summary: "Entrada al apoyo de la isla con rol, badge y comunidad.",
    perks: [
      "7 Monedas Prime cada 2 semanas",
      "Rol Prime Supporter en Discord",
      "Acceso a canales Supporter",
      "Badge de Supporter en la web",
      "Participación en sorteos para supporters",
      "Patreon ↔ Discord ↔ Web",
      "Acceso básico a beneficios de la comunidad",
    ],
  },
  {
    id: "vip",
    emoji: "👑",
    name: "PRIME VIP",
    price: "$10",
    priceNote: "/ mes",
    coins: 15,
    coinsLabel: "15 Monedas Prime cada 2 semanas",
    summary: "Skin Studio, cola básica y canales VIP.",
    perks: [
      "Todo lo de Supporter",
      "15 Monedas Prime cada 2 semanas",
      "Rol 👑 Prime VIP",
      "Prioridad básica en la cola",
      "Acceso a Skin Studio",
      "Guardar skins favoritas",
      "Personalización extra del perfil",
      "Acceso anticipado a novedades",
      "Sorteos VIP",
      "Canales VIP de Discord",
    ],
  },
  {
    id: "hunter",
    emoji: "🦕",
    name: "Prime Hunter",
    price: "$15",
    priceNote: "/ mes",
    coins: 25,
    coinsLabel: "25 Monedas Prime cada 2 semanas",
    popular: true,
    summary: "Más cola, eventos, bot y descuentos con monedas.",
    perks: [
      "Todo lo de VIP",
      "25 Monedas Prime cada 2 semanas",
      "Mayor prioridad de cola",
      "Skins exclusivas de Supporter",
      "Más espacios para guardar skins",
      "Acceso a eventos exclusivos",
      "Comandos especiales del bot",
      "Descuentos en grows/desbloqueos con Monedas Prime",
      "Perfil Hunter especial en la web",
      "Acceso anticipado a nuevas herramientas",
    ],
  },
  {
    id: "apex",
    emoji: "🩸",
    name: "Prime Apex",
    price: "$25",
    priceNote: "/ mes",
    coins: 40,
    coinsLabel: "40 Monedas Prime cada 2 semanas",
    summary: "Máxima prioridad, slots, unlocks y todo el pack premium.",
    perks: [
      "Todo lo de Hunter",
      "40 Monedas Prime cada 2 semanas",
      "🩸 Rol exclusivo PRIME APEX",
      "Máxima prioridad de cola",
      "Acceso con servidor lleno (slots reservados)",
      "Skin Studio completo",
      "Skins APEX/VIP exclusivas",
      "Más opciones de personalización",
      "Desbloqueos especiales de dinosaurios",
      "Beneficios especiales con Monedas Prime",
      "Eventos exclusivos APEX",
      "Sorteos exclusivos APEX",
      "Perfil APEX destacado en islaprime.net",
      "Badge exclusivo",
      "Acceso a pruebas de nuevas funciones",
      "Todas las herramientas premium del bot",
    ],
  },
];

export const vipPillars = [
  {
    id: "website",
    emoji: "🌐",
    title: "Web",
    items: ["Skin Studio", "Monedas Prime", "Perfil VIP", "Herramientas exclusivas"],
  },
  {
    id: "discord",
    emoji: "💬",
    title: "Discord",
    items: ["Roles VIP", "Canales privados", "Comandos del bot"],
  },
  {
    id: "isle",
    emoji: "🦖",
    title: "The Isle",
    items: ["Prioridad de cola", "Grows", "Skins", "Desbloqueos de población"],
  },
] as const;

export const claimSteps = [
  {
    step: "01",
    title: "Únete en Patreon",
    description: "Elige tu tier en Patreon (desde Supporter hasta Prime Apex).",
  },
  {
    step: "02",
    title: "Vincula en la web",
    description: "Entra con Steam y conecta Patreon desde tu panel de Isla Prime.",
  },
  {
    step: "03",
    title: "Sincroniza Discord",
    description: "Autoriza Discord para recibir el rol y canales de tu tier.",
  },
  {
    step: "04",
    title: "Desbloquea beneficios",
    description: "VIP, coins y herramientas se activan al verificar la membresía.",
  },
] as const;

/** @deprecated Prefer supporterTiers */
export const membershipTiers = supporterTiers.map((tier) => ({
  name: tier.name,
  price: `${tier.price} / mes`,
  accent: tier.popular ? "border-red-500/50" : "border-zinc-700",
  featured: tier.popular,
  features: tier.perks.slice(0, 4),
}));
