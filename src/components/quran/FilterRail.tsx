import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { DOMAINS, FUNCTIONS, THEMES, TAGS } from "@/data/quran/taxonomy";

export interface Filters {
  domains: string[];
  functions: string[];
  themes: string[];
  tags: string[];
  classifiedOnly: boolean;
}

interface Props {
  filters: Filters;
  setFilters: (f: Filters) => void;
}

const toggle = (arr: string[], v: string) => arr.includes(v) ? arr.filter(x => x !== v) : [...arr, v];

export const FilterRail = ({ filters, setFilters }: Props) => (
  <div className="space-y-5">
    <div className="flex items-center justify-between">
      <Label htmlFor="co">مصنّفة فقط</Label>
      <Switch id="co" checked={filters.classifiedOnly} onCheckedChange={(v) => setFilters({ ...filters, classifiedOnly: v })} />
    </div>
    <Section title="المجال">
      {DOMAINS.map(d => (
        <Badge key={d.code} variant={filters.domains.includes(d.code) ? "default" : "outline"} className="cursor-pointer"
          style={filters.domains.includes(d.code) ? { backgroundColor: `hsl(var(--${d.color}))` } : {}}
          onClick={() => setFilters({ ...filters, domains: toggle(filters.domains, d.code) })}>
          {d.label}
        </Badge>
      ))}
    </Section>
    <Section title="الوظيفة">
      {FUNCTIONS.map(f => (
        <Badge key={f} variant={filters.functions.includes(f) ? "default" : "outline"} className="cursor-pointer"
          onClick={() => setFilters({ ...filters, functions: toggle(filters.functions, f) })}>{f}</Badge>
      ))}
    </Section>
    <Section title="المحاور">
      {THEMES.map(t => (
        <Badge key={t} variant={filters.themes.includes(t) ? "default" : "outline"} className="cursor-pointer"
          onClick={() => setFilters({ ...filters, themes: toggle(filters.themes, t) })}>{t}</Badge>
      ))}
    </Section>
    <Section title="العلامات">
      {TAGS.map(t => (
        <Badge key={t} variant={filters.tags.includes(t) ? "default" : "outline"} className="cursor-pointer"
          onClick={() => setFilters({ ...filters, tags: toggle(filters.tags, t) })}>{t}</Badge>
      ))}
    </Section>
  </div>
);

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div>
    <h4 className="text-sm font-display text-primary mb-2">{title}</h4>
    <div className="flex flex-wrap gap-1.5">{children}</div>
  </div>
);
