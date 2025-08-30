export type AccountRow = { id: string; handle: string; risk: 'low'|'med'|'high'; score: number; spark: number[] };
export type HashtagRow = { id: string; tag: string; count: number; firstSeen: string; radius: number };
export type PostRow = { id: string; preview: string; engagement: number; risk: 'low'|'med'|'high' };

export function generateTopK(seed=Date.now()) {
  const rand = mulberry32(seed);
  const firstNames = ["Aarav","Vivaan","Aditya","Vihaan","Arjun","Krishna","Ishaan","Rohan","Rahul","Karthik","Sanjay","Amit","Vikram","Ananya","Aadhya","Diya","Ishita","Kavya","Meera","Nandini","Priya","Riya","Sneha","Tanvi"];
  const lastNames = ["Sharma","Verma","Gupta","Iyer","Reddy","Naidu","Patel","Singh","Khan","Das","Ghosh","Chatterjee","Nair","Menon","Banerjee","Mukherjee","Yadav","Kulkarni","Pillai","Rao"];
  const hashtagPool = [
    "#AntiIndiaNarrative","#BoycottIndia","#IndiaOut","#ShameOnIndia","#StopIndia",
    "#PropagandaWatch","#FakeNewsIndia","#AgainstIndiaPolicy","#AntiIndiaTrend","#BreakIndiaAgenda",
    "#DownWithIndia","#AntiIndiaCampaign","#BoycottBollywood","#CensorIndia","#BanIndiaProducts",
    "#anti_india","#स्वदेश_विरोध","#भारत_विरो���ी","#StopIndianMedia","#ExposeIndia"
  ];
  const topics = [
    "election rally", "space mission milestone", "rail corridor upgrade", "flood relief efforts", "T20 clash tonight",
    "UPI adoption in rural India", "women-led startup", "metro expansion", "Ayushman Bharat drive", "tourism boost"
  ];

  const accounts: AccountRow[] = Array.from({ length: 50 }).map((_,i)=>{
    const f = pick(firstNames, rand); const l = pick(lastNames, rand);
    const num = Math.floor(rand()*90+10);
    const handle = `@${f.toLowerCase()}${l[0].toLowerCase()}${num}`;
    return { id:`a${i}`, handle, risk: pick(['low','med','high'], rand), score: Math.round(rand()*1000), spark: Array.from({length:12}).map(()=>Math.round(rand()*10)) };
  });

  const hashtags: HashtagRow[] = Array.from({ length: 40 }).map((_,i)=>({
    id:`h${i}`,
    tag: pick(hashtagPool, rand),
    count: 500 + Math.round(rand()*9500),
    firstSeen: new Date(Date.now()-rand()*7*864e5).toISOString(),
    radius: +(2 + rand()*8).toFixed(2) as unknown as number,
  }));

  const posts: PostRow[] = Array.from({ length: 60 }).map((_,i)=>{
    const acc = accounts[Math.floor(rand()*accounts.length)].handle;
    const tag = pick(hashtagPool, rand);
    const topic = pick(topics, rand);
    const preview = `${acc} on ${topic} ${tag} — what do you think?`;
    return { id:`p${i}`, preview, engagement: 1000 + Math.round(rand()*30000), risk: pick(['low','med','high'], rand) };
  });
  return { accounts, hashtags, posts };
}

function pick<T>(arr:T[], r:()=>number){return arr[Math.floor(r()*arr.length)]}
function mulberry32(a: number) {return function () {let t = (a += 0x6d2b79f5); t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }}
