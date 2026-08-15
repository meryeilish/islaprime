export type VitalId = "salud" | "hambre" | "sed" | "stamina" | "sangrado";

export interface DinoVital {
  id: VitalId;
  label: string;
  value: number;
  max: number;
  tone: "red" | "amber" | "sky" | "green" | "rose";
}

export interface LiveDinoDemo {
  species: string;
  sex: "M" | "F";
  diet: string;
  growth: number;
  location: string;
  zone: string;
  aliveFor: string;
  kills: number;
  deaths: number;
  online: boolean;
  lastSync: string;
  vitals: DinoVital[];
}

/** Demo hasta conectar Steam + bot del servidor. */
export const liveDinoDemo: LiveDinoDemo = {
  species: "Allosaurus",
  sex: "M",
  diet: "Carnívoro",
  growth: 72,
  location: "South Lake",
  zone: "Gateway · Zona 4",
  aliveFor: "4h 18m",
  kills: 3,
  deaths: 1,
  online: true,
  lastSync: "hace 12 s",
  vitals: [
    { id: "salud", label: "Salud", value: 84, max: 100, tone: "red" },
    { id: "hambre", label: "Hambre", value: 61, max: 100, tone: "amber" },
    { id: "sed", label: "Sed", value: 48, max: 100, tone: "sky" },
    { id: "stamina", label: "Resistencia", value: 77, max: 100, tone: "green" },
    { id: "sangrado", label: "Sangrado", value: 8, max: 100, tone: "rose" },
  ],
};

export const walletDemo = {
  coins: 0,
  marks: 0,
  tierLabel: "Sin membresía",
  tierId: null as string | null,
};
