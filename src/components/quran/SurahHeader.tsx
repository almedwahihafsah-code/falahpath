import { Card } from "@/components/ui/card";

interface Props {
  surah: { number: number; name_ar: string; revelation: string; verses_count: number };
}

export const SurahHeader = ({ surah }: Props) => (
  <Card className="p-6 bg-gradient-emerald text-primary-foreground text-center shadow-elegant">
    <div className="text-sm opacity-80 mb-1">سورة رقم {surah.number} • {surah.revelation} • {surah.verses_count} آية</div>
    <h2 className="font-display text-4xl mb-4">سورة {surah.name_ar}</h2>
    <div className="font-quran text-2xl text-gradient-gold py-3 border-y border-primary-foreground/20">
      بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
    </div>
  </Card>
);
