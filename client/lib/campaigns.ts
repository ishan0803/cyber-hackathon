import { genAntiTag, genHandle, mulberry32 } from "./synthetic";

export type CampaignCluster = {
  id: string;
  cluster: string; // e.g., "45 Tamil accounts"
  hashtag: string;
  time: string; // ISO timestamp
  linkedAccounts: string[];
  linkedHashtags: string[];
};

export function generateCampaignClusters(count = 20, seed = Date.now()): CampaignCluster[] {
  const rand = mulberry32(seed);
  const base = Date.now() - 1000 * 60 * 60; // last hour
  const clusters: CampaignCluster[] = [];
  for (let i = 0; i < count; i++) {
    const size = Math.floor(rand() * 80) + 20; // 20..99
    const tag = genAntiTag(rand);
    const accs = Array.from({ length: 6 }).map(() => genHandle(rand));
    const extraTags = new Set<string>();
    while (extraTags.size < 3) extraTags.add(genAntiTag(rand));
    const t = new Date(base + i * (1000 * 60 * 3) + Math.floor(rand() * 120000));
    clusters.push({
      id: `cc_${i}`,
      cluster: `${size} Tamil accounts`,
      hashtag: tag,
      time: t.toISOString(),
      linkedAccounts: accs,
      linkedHashtags: [tag, ...Array.from(extraTags)].slice(0, 3),
    });
  }
  return clusters;
}
