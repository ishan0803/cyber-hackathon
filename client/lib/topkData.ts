export type AccountRow = { id: string; handle: string; risk: 'low'|'med'|'high'; score: number; spark: number[] };
export type HashtagRow = { id: string; tag: string; count: number; firstSeen: string; radius: number };
export type PostRow = { id: string; preview: string; engagement: number; risk: 'low'|'med'|'high' };

export function generateTopK(seed=Date.now()) {
  const rand = mulberry32(seed);
  const accounts: AccountRow[] = Array.from({ length: 50 }).map((_,i)=>({ id:`a${i}`, handle:`@acct_${i}`, risk: pick(['low','med','high'], rand), score: Math.round(rand()*1000), spark: Array.from({length:12}).map(()=>Math.round(rand()*10)) }));
  const hashtags: HashtagRow[] = Array.from({ length: 40 }).map((_,i)=>({ id:`h${i}`, tag:`#tag_${i}`, count: Math.round(rand()*5000), firstSeen: new Date(Date.now()-rand()*7*864e5).toISOString(), radius: +(rand()*10).toFixed(2) as unknown as number }));
  const posts: PostRow[] = Array.from({ length: 60 }).map((_,i)=>({ id:`p${i}`, preview:`Sample post ${i} with content...`, engagement: Math.round(rand()*20000), risk: pick(['low','med','high'], rand) }));
  return { accounts, hashtags, posts };
}

function pick<T>(arr:T[], r:()=>number){return arr[Math.floor(r()*arr.length)]}
function mulberry32(a: number) {return function () {let t = (a += 0x6d2b79f5); t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }}
