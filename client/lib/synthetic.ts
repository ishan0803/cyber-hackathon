export const FIRST_NAMES = [
  "Aarav","Vivaan","Aditya","Vihaan","Arjun","Krishna","Ishaan","Rohan","Rahul","Karthik",
  "Sanjay","Amit","Vikram","Ananya","Aadhya","Diya","Ishita","Kavya","Meera","Nandini",
  "Priya","Riya","Sneha","Tanvi","Kunal","Rakesh","Pooja","Neha","Rohit","Anil",
];

export const LAST_NAMES = [
  "Sharma","Verma","Gupta","Iyer","Reddy","Naidu","Patel","Singh","Khan","Das","Ghosh",
  "Chatterjee","Nair","Menon","Banerjee","Mukherjee","Yadav","Kulkarni","Pillai","Rao","Bhatt",
];

export const ANTI_INDIA_HASHTAGS = [
  "#AntiIndiaNarrative","#BoycottIndia","#IndiaOut","#ShameOnIndia","#StopIndia",
  "#PropagandaWatch","#FakeNewsIndia","#AgainstIndiaPolicy","#AntiIndiaTrend","#BreakIndiaAgenda",
  "#DownWithIndia","#AntiIndiaCampaign","#BoycottBollywood","#CensorIndia","#BanIndiaProducts",
  "#anti_india","#स्वदेश_विरोध","#भारत_विरोधी","#StopIndianMedia","#ExposeIndia",
];

export function mulberry32(a: number) {
  return function () {
    let t = (a += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function pick<T>(arr: T[], rand: () => number): T {
  return arr[Math.floor(rand() * arr.length)];
}

export function genHandle(rand: () => number) {
  const f = pick(FIRST_NAMES, rand);
  const l = pick(LAST_NAMES, rand)[0].toLowerCase();
  const num = Math.floor(rand() * 90 + 10);
  return `@${f.toLowerCase()}${l}${num}`;
}

export function genAntiTag(rand: () => number) {
  return pick(ANTI_INDIA_HASHTAGS, rand);
}
