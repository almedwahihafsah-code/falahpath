import { Card } from "@/components/ui/card";
import { ClassificationChips } from "./ClassificationChips";

interface Props {
  verse: { id: string; verse_number: number; text_ar: string };
  classification?: any;
  onClick: () => void;
}

export const VerseCard = ({ verse, classification, onClick }: Props) => (
  <Card onClick={onClick} className="p-5 cursor-pointer hover:shadow-elegant transition-smooth bg-gradient-card">
    <div className="flex items-start gap-4">
      <div className="shrink-0 w-10 h-10 rounded-full bg-gradient-emerald text-primary-foreground flex items-center justify-center font-display text-sm shadow-soft">
        {verse.verse_number}
      </div>
      <div className="flex-1 space-y-3">
        <p className="font-quran text-2xl leading-loose text-foreground" dir="rtl">{verse.text_ar}</p>
        <ClassificationChips classification={classification} />
      </div>
    </div>
  </Card>
);
