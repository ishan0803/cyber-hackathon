export interface LayoutRequest {
  ids: string[];
  seed: number;
}
export interface LayoutResponse {
  positions: Record<string, { x: number; y: number }>;
}

// Simple circular jitter layout running off-thread
self.onmessage = (e: MessageEvent<LayoutRequest>) => {
  const { ids, seed } = e.data;
  const rand = mulberry32(seed);
  const positions: Record<string, { x: number; y: number }> = {};
  const R = 300;
  ids.forEach((id, i) => {
    const angle = (i / ids.length) * Math.PI * 2;
    const r = R * (0.6 + rand() * 0.4);
    positions[id] = {
      x: Math.cos(angle) * r + (rand() - 0.5) * 40,
      y: Math.sin(angle) * r + (rand() - 0.5) * 40,
    };
  });
  const resp: LayoutResponse = { positions };
  // @ts-expect-error - postMessage in worker
  self.postMessage(resp);
};

function mulberry32(a: number) {
  return function () {
    let t = (a += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
