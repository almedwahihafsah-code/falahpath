import { OrnamentalDivider } from "@/components/falah/OrnamentalDivider";
import { getDomainJourney } from "@/data/journey-map";
import { Sparkles, BookOpen, HelpCircle, HandHeart, Lightbulb } from "lucide-react";

type Props = {
  domainCode: string;
  intentCode?: string;
  /** When true the panel is shown as the primary card (no DB verses yet). */
  emphasized?: boolean;
};

/**
 * Journey panel — surfaces a curated verse, a practical action, and a
 * reflection question for a given domain. Acts as the always-on activation
 * layer above the (possibly empty) DB-classified verses list.
 */
export const DomainJourneyPanel = ({ domainCode, emphasized }: Props) => {
  const journey = getDomainJourney(domainCode);
  if (!journey) return null;

  return (
    <section
      aria-label="رحلة هذا المجال"
      className={`card-sacred rounded-xl p-8 md:p-10 space-y-8 ${
        emphasized ? "shadow-[var(--shadow-gold)]" : ""
      }`}
    >
      <div className="text-center space-y-4">
        <p className="text-caption text-accent flex items-center justify-center gap-2">
          <BookOpen className="w-4 h-4" aria-hidden="true" /> آية مختارة
        </p>
        <p className="text-quran leading-loose">﴿ {journey.verse.text_ar} ﴾</p>
        <p className="text-caption text-muted-foreground">
          سورة {journey.verse.surah_name_ar} • آية {journey.verse.verse_number}
        </p>
      </div>

      <OrnamentalDivider />

      <div className="space-y-6">
        {journey.understanding && (
          <div className="card-rest rounded-xl p-6 space-y-3">
            <p className="text-caption text-accent flex items-center gap-2">
              <Lightbulb className="w-4 h-4" aria-hidden="true" /> الفهم
            </p>
            <p className="text-body text-foreground leading-relaxed">
              {journey.understanding}
            </p>
          </div>
        )}

        <div className="card-rest rounded-xl p-6 space-y-3">
          <p className="text-caption text-accent flex items-center gap-2">
            <Sparkles className="w-4 h-4" aria-hidden="true" /> سلوك عملي اليوم
          </p>
          <p className="text-body text-foreground leading-relaxed">{journey.action}</p>
        </div>

        {journey.dua && (
          <div className="card-rest rounded-xl p-6 space-y-3 border-r-2 border-accent/40">
            <p className="text-caption text-accent flex items-center gap-2">
              <HandHeart className="w-4 h-4" aria-hidden="true" /> دعاء
            </p>
            <p className="text-quran text-lg md:text-xl leading-loose text-foreground">
              ﴿ {journey.dua.text_ar} ﴾
            </p>
            {journey.dua.source_ar && (
              <p className="text-caption text-muted-foreground">{journey.dua.source_ar}</p>
            )}
          </div>
        )}

        <div className="card-rest rounded-xl p-6 space-y-3">
          <p className="text-caption text-accent flex items-center gap-2">
            <HelpCircle className="w-4 h-4" aria-hidden="true" /> سؤال للتفكر
          </p>
          <p className="text-body text-foreground leading-relaxed">{journey.reflection}</p>
        </div>
      </div>

    </section>
  );
};

export default DomainJourneyPanel;