import { Link } from "react-router-dom";
import { Sun, Feather, Compass, Anchor, HandHeart, Sunrise, LucideIcon } from "lucide-react";
import type { Intent } from "@/hooks/useIntents";

const ICONS: Record<string, LucideIcon> = {
  falah: Sun,
  sakinah: Feather,
  hidayah: Compass,
  thabat: Anchor,
  shukr: HandHeart,
  inabah: Sunrise,
};

export const IntentCard = ({
  intent,
  onSelect,
  preselected,
}: {
  intent: Intent;
  onSelect?: (code: string) => void;
  preselected?: boolean;
}) => {
  const Icon = ICONS[intent.code] ?? Sun;
  return (
    <Link
      to={`/domain?intent=${intent.code}`}
      onClick={() => onSelect?.(intent.code)}
      className={`card-rest card-lift rounded-xl p-8 flex flex-col items-center text-center gap-4 focus:outline-none focus-visible:ring-4 focus-visible:ring-accent/30 ${
        preselected ? "ring-2 ring-accent border-accent/50 shadow-[var(--shadow-gold)]" : ""
      }`}
    >
      <Icon className="w-10 h-10 text-accent" strokeWidth={1.5} aria-hidden="true" />
      <div className="space-y-1">
        <h3 className="text-h2 text-primary">{intent.label_ar}</h3>
        {intent.label_en && <p className="text-caption text-muted-foreground">{intent.label_en}</p>}
      </div>
      <p className="text-body text-muted-foreground leading-relaxed">{intent.description_ar}</p>
      {preselected && (
        <span className="text-caption text-accent">اختيارك من البداية ✦</span>
      )}
    </Link>
  );
};

export default IntentCard;