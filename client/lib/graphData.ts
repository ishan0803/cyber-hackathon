export type NodeType = "hashtag" | "account" | "post";
import { genHandle, genAntiTag, mulberry32, pick } from "@/lib/synthetic";
export type EdgeType = "mention" | "reshare" | "retweet";

export type GraphNode = {
  id: string;
  label: string;
  type: NodeType;
  timestamp: number;
  lang: string;
  region: string;
  risk: number; // 0-1
};

export type GraphEdge = {
  id: string;
  source: string;
  target: string;
  type: EdgeType;
};

const LANGS = ["en", "hi", "ta", "bn"];
const REGIONS = ["north", "south", "east", "west"];

export function generateGraph(nAccounts = 40, nHashtags = 20, nPosts = 60, seed = Date.now()) {
  const rand = mulberry32(seed);
  const nodes: GraphNode[] = [];
  const edges: GraphEdge[] = [];

  for (let i = 0; i < nAccounts; i++) {
    nodes.push({
      id: `a${i}`,
      label: genHandle(rand),
      type: "account",
      timestamp: Date.now() - Math.floor(rand() * 1000 * 3600 * 24 * 7),
      lang: pick(LANGS, rand),
      region: pick(REGIONS, rand),
      risk: +(0.2 + rand() * 0.8).toFixed(2),
    });
  }
  for (let i = 0; i < nHashtags; i++) {
    nodes.push({
      id: `h${i}`,
      label: `#tag_${i}`,
      type: "hashtag",
      timestamp: Date.now() - Math.floor(rand() * 1000 * 3600 * 24 * 7),
      lang: pick(LANGS, rand),
      region: pick(REGIONS, rand),
      risk: +(0.1 + rand() * 0.6).toFixed(2),
    });
  }
  for (let i = 0; i < nPosts; i++) {
    nodes.push({
      id: `p${i}`,
      label: `Post ${i}`,
      type: "post",
      timestamp: Date.now() - Math.floor(rand() * 1000 * 3600 * 24 * 7),
      lang: pick(LANGS, rand),
      region: pick(REGIONS, rand),
      risk: +(rand()).toFixed(2) as unknown as number,
    });
  }

  const allIds = nodes.map((n) => n.id);
  const EdgeTypes: EdgeType[] = ["mention", "reshare", "retweet"];
  const edgeCount = Math.min(400, Math.floor(allIds.length * 5));
  for (let i = 0; i < edgeCount; i++) {
    const s = pick(allIds, rand);
    let t = pick(allIds, rand);
    if (t === s) t = pick(allIds, rand);
    edges.push({ id: `e${i}`, source: s, target: t, type: pick(EdgeTypes, rand) });
  }

  return { nodes, edges };
}

function pick<T>(arr: T[], r: () => number) {
  return arr[Math.floor(r() * arr.length)];
}

function mulberry32(a: number) {
  return function () {
    let t = (a += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
