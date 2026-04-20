export const habitPoints: Record<string, number> = {
  fajr: 10,
  wird: 15,
  dhuhr: 8,
  asr: 8,
  maghrib: 8,
  isha: 8,
  walk: 10,
  read: 10,
  work: 10,
  sadaqa: 12,
  family: 10,
  help: 10,
  sabr: 10,
};

export const calcLevel = (points: number) => Math.floor(Math.sqrt(points / 50));
export const pointsForLevel = (level: number) => level * level * 50;
export const progressToNextLevel = (points: number) => {
  const lvl = calcLevel(points);
  const cur = pointsForLevel(lvl);
  const next = pointsForLevel(lvl + 1);
  return Math.round(((points - cur) / (next - cur)) * 100);
};

export const badges = [
  { id: "first_step", title: "الخطوة الأولى", desc: "أكمل عادة واحدة", check: (p: number, h: number) => h >= 1 },
  { id: "ten_habits", title: "10 عادات", desc: "أكمل 10 عادات", check: (p: number, h: number) => h >= 10 },
  { id: "hundred_pts", title: "100 نقطة", desc: "اجمع 100 نقطة", check: (p: number) => p >= 100 },
  { id: "five_hundred", title: "500 نقطة", desc: "اجمع 500 نقطة", check: (p: number) => p >= 500 },
  { id: "level_3", title: "المستوى 3", desc: "وصلت للمستوى الثالث", check: (p: number) => calcLevel(p) >= 3 },
  { id: "level_5", title: "المستوى 5", desc: "وصلت للمستوى الخامس", check: (p: number) => calcLevel(p) >= 5 },
];
