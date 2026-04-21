import { Badge } from "@/components/ui/badge";
import { domainLabel } from "@/data/quran/taxonomy";

interface Props {
  classification?: {
    domain_code?: string | null;
    function?: string | null;
    themes?: string[] | null;
    tags?: string[] | null;
  } | null;
}

export const ClassificationChips = ({ classification: c }: Props) => {
  if (!c) return <Badge variant="outline" className="text-xs opacity-60">غير مصنّفة</Badge>;
  return (
    <div className="flex flex-wrap gap-1.5">
      {c.domain_code && (
        <Badge style={{ backgroundColor: `hsl(var(--domain-${c.domain_code.toLowerCase()}))` }} className="text-white border-0">
          {domainLabel(c.domain_code)}
        </Badge>
      )}
      {c.function && <Badge variant="secondary">{c.function}</Badge>}
      {c.themes?.slice(0, 3).map(t => <Badge key={t} variant="outline">{t}</Badge>)}
      {c.tags?.slice(0, 2).map(t => <Badge key={t} variant="outline" className="text-accent">{t}</Badge>)}
    </div>
  );
};
