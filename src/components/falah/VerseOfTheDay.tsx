import { Card } from "@/components/ui/card";
import { getVerseOfTheDay } from "@/data/verses";
import { BookOpen } from "lucide-react";

export const VerseOfTheDay = () => {
  const v = getVerseOfTheDay();
  return (
    <Card className="p-6 bg-gradient-card border-border/60 shadow-soft">
      <div className="flex items-center gap-2 text-accent text-sm mb-3">
        <BookOpen className="w-4 h-4" /> آية اليوم
      </div>
      <p className="font-quran text-2xl text-primary leading-loose mb-2">﴿ {v.arabic} ﴾</p>
      <p className="text-xs text-accent mb-3">{v.reference}</p>
      <p className="text-sm text-muted-foreground">{v.reflection}</p>
    </Card>
  );
};
