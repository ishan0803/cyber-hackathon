import { addMinutes, subHours } from "date-fns";

export type KPI = {
  activeCampaigns: number;
  highRiskAccounts: number;
  alerts24h: number;
  engagementVolume: number;
};

export type TimePoint = { time: string; engagement: number };
export type StateBar = { state: string; flagged: number };
export type DonutSlice = { name: string; value: number };

export function generateKPI(seed = Date.now()): KPI {
  const rand = mulberry32(seed);
  return {
    activeCampaigns: Math.floor(rand() * 120) + 380,
    highRiskAccounts: Math.floor(rand() * 80) + 220,
    alerts24h: Math.floor(rand() * 50) + 70,
    engagementVolume: Math.floor(rand() * 30000) + 150000,
  };
}

export function generateTrend(seed = Date.now()): TimePoint[] {
  const points: TimePoint[] = [];
  const start = subHours(new Date(), 24);
  const rand = mulberry32(seed);
  let t = start;
  let v = 1000 + rand() * 500;
  for (let i = 0; i < 48; i++) {
    v = Math.max(200, v + (rand() - 0.45) * 200);
    points.push({ time: formatHHMM(t), engagement: Math.round(v) });
    t = addMinutes(t, 30);
  }
  return points;
}

export function generateStateBars(seed = Date.now()): StateBar[] {
  const states = [
    "MH",
    "DL",
    "KA",
    "TN",
    "WB",
    "GJ",
    "RJ",
    "UP",
    "PB",
    "KL",
  ];
  const rand = mulberry32(seed);
  return states.map((s) => ({ state: s, flagged: Math.floor(rand() * 80) + 10 }));
}

export function generateDonut(seed = Date.now()): DonutSlice[] {
  const rand = mulberry32(seed);
  const a = 40 + rand() * 30; // criticism
  const b = 60 + rand() * 40; // anti-India
  const rest = 100 - Math.min(95, (a + b) / 2);
  return [
    { name: "Criticism", value: Math.round(a) },
    { name: "Anti-India", value: Math.round(b) },
    { name: "Other", value: Math.round(rest) },
  ];
}

export function generateHeatPoints(n = 20, seed = Date.now()) {
  const rand = mulberry32(seed);
  // rough region around India
  const latBase = 22.5;
  const lonBase = 78.9;
  return Array.from({ length: n }).map(() => ({
    lat: latBase + (rand() - 0.5) * 20,
    lon: lonBase + (rand() - 0.5) * 40,
    intensity: 0.5 + rand(),
  }));
}

function formatHHMM(d: Date) {
  return d.toTimeString().slice(0, 5);
}

function mulberry32(a: number) {
  return function () {
    let t = (a += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
