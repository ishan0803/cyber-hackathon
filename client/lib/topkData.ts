import { genHandle, genAntiTag, mulberry32, pick } from "@/lib/synthetic";

export type AccountRow = {
  id: string;
  handle: string;
  risk: "low" | "med" | "high";
  score: number;
  spark: number[];
};
export type HashtagRow = {
  id: string;
  tag: string;
  count: number;
  firstSeen: string;
  radius: number;
};
export type PostRow = {
  id: string;
  preview: string;
  engagement: number;
  risk: "low" | "med" | "high";
};

export function generateTopK(seed = Date.now()) {
  const rand = mulberry32(seed);
  const topics = [
    "election rally",
    "policy controversy",
    "media bias claim",
    "bot network spike",
    "T20 clash tonight",
    "misinfo takedown",
    "hashtag brigading",
    "coordinated trend",
    "geo-targeted push",
    "astro-turfing",
  ];

  const accounts: AccountRow[] = Array.from({ length: 50 }).map((_, i) => ({
    id: `a${i}`,
    handle: genHandle(rand),
    risk: pick(["low", "med", "high"], rand),
    score: Math.round(rand() * 1000),
    spark: Array.from({ length: 12 }).map(() => Math.round(rand() * 10)),
  }));

  const hashtags: HashtagRow[] = Array.from({ length: 40 }).map((_, i) => ({
    id: `h${i}`,
    tag: genAntiTag(rand),
    count: 500 + Math.round(rand() * 9500),
    firstSeen: new Date(Date.now() - rand() * 7 * 864e5).toISOString(),
    radius: +(2 + rand() * 8).toFixed(2) as unknown as number,
  }));

  const posts: PostRow[] = Array.from({ length: 60 }).map((_, i) => {
    const acc = accounts[Math.floor(rand() * accounts.length)].handle;
    const tag = genAntiTag(rand);
    const topic = pick(topics, rand);
    const preview = `${acc} on ${topic} ${tag} — what do you think?`;
    return {
      id: `p${i}`,
      preview,
      engagement: 1000 + Math.round(rand() * 30000),
      risk: pick(["low", "med", "high"], rand),
    };
  });
  return { accounts, hashtags, posts };
}
