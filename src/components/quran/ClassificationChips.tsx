import { Badge } from "@/components/ui/badge";
import { domainLabel } from "@/data/quran/taxonomy";
import { Megaphone, Heart, Sparkles, Hash } from "lucide-react";

interface Props {
  classification?: {
    domain_code?: string | null;
    sub_domain?: string | null;
    function?: string | null;
    themes?: string[] | null;
    tags?: string[] | null;
    educational_effects?: string[] | null;
    context?: string | null;
  } | null;
  compact?: boolean;
  onTagClick?: (tag: string) => void;
  onDomainClick?: (domain: string) => void;
  onThemeClick?: (theme: string) => void;
  onFunctionClick?: (fn: string) => void;
}

// Color mapping for rhetorical functions — each function gets a distinct visual identity
const FUNCTION_STYLES: Record<string, { bg: string; label: string }> = {
  "أمر":     { bg: "hsl(142 70% 38%)", label: "أمر إلهي" },
  "نهي":     { bg: "hsl(0 70% 45%)",   label: "نهي إلهي" },
  "وعد":     { bg: "hsl(45 85% 45%)",  label: "وعد" },
  "وعيد":    { bg: "hsl(15 75% 45%)",  label: "وعيد" },
  "قصة":     { bg: "hsl(215 65% 45%)", label: "قصة" },
  "مثل":     { bg: "hsl(265 55% 50%)", label: "مَثَل" },
  "حوار":    { bg: "hsl(190 65% 40%)", label: "حوار" },
  "تقرير":   { bg: "hsl(220 15% 45%)", label: "تقرير" },
  "تعزية":   { bg: "hsl(330 55% 50%)", label: "تعزية" },
  "تحفيز":   { bg: "hsl(35 90% 50%)",  label: "تحفيز" },
  "تصحيح":   { bg: "hsl(355 60% 50%)", label: "تصحيح" },
};

export const ClassificationChips = ({
  classification: c,
  compact = false,
  onTagClick,
  onDomainClick,
  onThemeClick,
  onFunctionClick,
}: Props) => {
  if (!c) return <Badge variant="outline" className="text-xs opacity-60">غير مصنّفة</Badge>;

  const fnStyle = c.function ? FUNCTION_STYLES[c.function] : null;
  const stop = (e: React.MouseEvent) => e.stopPropagation();

  return (
    <div className="space-y-2">
      {/* Layer 1 — Rhetorical Function (most prominent, color-coded) */}
      {c.function && (
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-[10px] text-muted-foreground font-medium">الوظيفة الخطابية:</span>
          <Badge
            style={{ backgroundColor: fnStyle?.bg ?? "hsl(var(--secondary))" }}
            className={`text-white border-0 gap-1 shadow-sm ${onFunctionClick ? "cursor-pointer hover:opacity-90 transition-opacity" : ""}`}
            onClick={onFunctionClick ? (e) => { stop(e); onFunctionClick(c.function!); } : undefined}
          >
            <Megaphone className="w-3 h-3" />
            {fnStyle?.label ?? c.function}
          </Badge>
        </div>
      )}

      {/* Layer 2 — Domain (Subjective Axis / المحور الموضوعي) */}
      {c.domain_code && (
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-[10px] text-muted-foreground font-medium">المحور الموضوعي:</span>
          <Badge
            style={{ backgroundColor: `hsl(var(--domain-${c.domain_code.toLowerCase()}))` }}
            className={`text-white border-0 ${onDomainClick ? "cursor-pointer hover:opacity-90 transition-opacity" : ""}`}
            onClick={onDomainClick ? (e) => { stop(e); onDomainClick(c.domain_code!); } : undefined}
          >
            {domainLabel(c.domain_code)}
          </Badge>
          {c.sub_domain && <Badge variant="outline" className="text-xs">{c.sub_domain}</Badge>}
        </div>
      )}

      {/* Layer 3 — Themes */}
      {c.themes && c.themes.length > 0 && (
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-[10px] text-muted-foreground font-medium">الموضوعات:</span>
          {c.themes.slice(0, compact ? 2 : 4).map(t => (
            <Badge
              key={t}
              variant="outline"
              className={`gap-1 ${onThemeClick ? "cursor-pointer hover:bg-accent/10 transition-colors" : ""}`}
              onClick={onThemeClick ? (e) => { stop(e); onThemeClick(t); } : undefined}
            >
              <Sparkles className="w-3 h-3 text-accent" />
              {t}
            </Badge>
          ))}
        </div>
      )}

      {/* Layer 4 — Educational Impact (الأثر التربوي) */}
      {c.educational_effects && c.educational_effects.length > 0 && (
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-[10px] text-muted-foreground font-medium">الأثر التربوي:</span>
          {c.educational_effects.slice(0, compact ? 2 : 3).map(e => (
            <Badge
              key={e}
              variant="secondary"
              className="gap-1 bg-emerald-50 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-100 border border-emerald-200 dark:border-emerald-900"
            >
              <Heart className="w-3 h-3" />
              {e.replace(/_/g, " ")}
            </Badge>
          ))}
        </div>
      )}

      {/* Layer 5 — Tags */}
      {c.tags && c.tags.length > 0 && (
        <div className="flex items-center gap-2 flex-wrap">
          {c.tags.slice(0, compact ? 2 : 4).map(t => (
            <Badge
              key={t}
              variant="outline"
              className={`text-accent gap-1 text-xs ${onTagClick ? "cursor-pointer hover:bg-accent/10 transition-colors" : ""}`}
              onClick={onTagClick ? (e) => { stop(e); onTagClick(t); } : undefined}
            >
              <Hash className="w-3 h-3" />
              {t.replace(/^#/, "")}
            </Badge>
          ))}
        </div>
      )}

      {/* Layer 6 — Context (مكية / مدنية) */}
      {c.context && (
        <Badge variant="outline" className="text-[10px] opacity-70">{c.context}</Badge>
      )}
    </div>
  );
};
