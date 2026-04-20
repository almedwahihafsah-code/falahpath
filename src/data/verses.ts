export const versesOfTheDay = [
  { arabic: "إِنَّ مَعَ الْعُسْرِ يُسْرًا", reference: "الشرح: 6", reflection: "بعد كل ضيق فرج، فلا تيأس." },
  { arabic: "وَمَن يَتَّقِ اللَّهَ يَجْعَل لَّهُ مَخْرَجًا", reference: "الطلاق: 2", reflection: "التقوى مفتاح الفرج." },
  { arabic: "أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ", reference: "الرعد: 28", reflection: "اطمئنان القلب في ذكر الله." },
  { arabic: "وَبَشِّرِ الصَّابِرِينَ", reference: "البقرة: 155", reflection: "الصبر طريق البشارة." },
  { arabic: "إِنَّ اللَّهَ مَعَ الصَّابِرِينَ", reference: "البقرة: 153", reflection: "معية الله للصابرين." },
  { arabic: "وَمَا تَوْفِيقِي إِلَّا بِاللَّهِ", reference: "هود: 88", reflection: "التوفيق من الله وحده." },
  { arabic: "وَقُل رَّبِّ زِدْنِي عِلْمًا", reference: "طه: 114", reflection: "اطلب العلم دومًا." },
  { arabic: "وَأَن لَّيْسَ لِلْإِنسَانِ إِلَّا مَا سَعَىٰ", reference: "النجم: 39", reflection: "السعي قبل النتيجة." },
  { arabic: "فَاذْكُرُونِي أَذْكُرْكُمْ", reference: "البقرة: 152", reflection: "اذكر الله يذكرك." },
  { arabic: "وَلَا تَيْأَسُوا مِن رَّوْحِ اللَّهِ", reference: "يوسف: 87", reflection: "لا يأس مع الإيمان." },
];

export const getVerseOfTheDay = () => {
  const day = Math.floor(Date.now() / (1000 * 60 * 60 * 24));
  return versesOfTheDay[day % versesOfTheDay.length];
};
