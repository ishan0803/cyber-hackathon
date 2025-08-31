import { genAntiTag, genHandle, mulberry32 } from "./synthetic";

export type CampaignCluster = {
  id: string;
  cluster: string; // e.g., "45 Tamil accounts"
  hashtag: string;
  time: string; // ISO timestamp
  linkedAccounts: string[];
  linkedHashtags: string[];
};

export function generateCampaignClusters(
  count = 20,
  seed = Date.now(),
): CampaignCluster[] {
  const rand = mulberry32(seed);
  const base = Date.now() - 1000 * 60 * 60; // last hour
  const clusters: CampaignCluster[] = [];
  for (let i = 0; i < count; i++) {
    const size = Math.floor(rand() * 80) + 20; // 20..99
    const tag = genAntiTag(rand);
    // ensure 6 unique accounts
    const accsSet = new Set<string>();
    while (accsSet.size < 6) accsSet.add(genHandle(rand));
    const accs = Array.from(accsSet);
    // ensure unique hashtags and avoid duplicating the main tag
    const extraTags = new Set<string>();
    while (extraTags.size < 3) {
      const tCandidate = genAntiTag(rand);
      if (tCandidate !== tag) extraTags.add(tCandidate);
    }
    const allTagsUnique = Array.from(new Set([tag, ...Array.from(extraTags)]));
    const t = new Date(
      base + i * (1000 * 60 * 3) + Math.floor(rand() * 120000),
    );
    clusters.push({
      id: `cc_${i}`,
      cluster: `${size} Tamil accounts`,
      hashtag: tag,
      time: t.toISOString(),
      linkedAccounts: accs,
      linkedHashtags: allTagsUnique.slice(0, 3),
    });
  }
  return clusters;
}
