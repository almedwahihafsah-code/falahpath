import { Link } from "react-router-dom";
import { Heart, Activity, Sparkles, Briefcase, Coins, Users, Globe2, Mountain, LucideIcon } from "lucide-react";
import type { Domain } from "@/hooks/useDomains";

const ICONS: Record<string, LucideIcon> = {
  heart: Heart,
  body: Activity,
  mind: Sparkles,
  work: Briefcase,
  wealth: Coins,
  family: Users,
  ummah: Globe2,
  trials: Mountain,
};

type Props = {
  domain: Domain;
  intentCode?: string;
  ayahCount?: number;
};

export const DomainCard = ({ domain, intentCode, ayahCount }: Props) => {
  const Icon = ICONS[domain.code] ?? Heart;
  const href = intentCode ? `/ayat?intent=${intentCode}&domain=${domain.code}` : `/ayat?domain=${domain.code}`;
  const pending = ayahCount === 0;
  return (
    <Link
      to={href}
      className="relative card-rest card-lift rounded-xl p-8 flex flex-col items-start gap-4 focus:outline-none focus-visible:ring-4 focus-visible:ring-accent/30"
    >
      {pending && (
        <span
          className="absolute top-3 left-3 text-[0.65rem] font-medium tracking-wide px-2 py-0.5 rounded-full bg-gold-500/10 text-gold-700 border border-gold-500/30"
          dir="rtl"
        >
          قيد الإعداد
        </span>
      )}
      <Icon className="w-10 h-10 text-accent" strokeWidth={1.5} aria-hidden="true" />
      <div className="space-y-1">
        <h3 className="text-h2 text-primary">{domain.label_ar}</h3>
        {domain.subtitle_ar && <p className="text-body text-muted-foreground">{domain.subtitle_ar}</p>}
      </div>
    </Link>
  );
};

export default DomainCard;