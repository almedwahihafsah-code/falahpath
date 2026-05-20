import { Link } from "react-router-dom";
import type { AyahListItem } from "@/hooks/useAyatByDomain";

type Props = {
  ayah: AyahListItem;
  intentCode?: string;
  domainCode?: string;
};

export const AyahCard = ({ ayah, intentCode, domainCode }: Props) => {
  const params = new URLSearchParams();
  if (intentCode) params.set("intent", intentCode);
  if (domainCode) params.set("domain", domainCode);
  const qs = params.toString();
  const href = `/ayah/${ayah.id}${qs ? `?${qs}` : ""}`;

  return (
    <Link
      to={href}
      className="card-rest card-lift rounded-xl p-8 block focus:outline-none focus-visible:ring-4 focus-visible:ring-accent/30"
    >
      <div className="flex items-center justify-between mb-5">
        <span className="text-caption text-accent">
          {ayah.surah_name_ar ?? `سورة ${ayah.surah_number}`} • {ayah.verse_number}
        </span>
        {ayah.is_primary && (
          <span className="text-[0.65rem] tracking-wide px-2 py-0.5 rounded-full bg-accent/10 text-accent border border-accent/30">
            آية محورية
          </span>
        )}
      </div>
      <p className="text-quran text-right leading-loose line-clamp-4">
        ﴿ {ayah.text_ar} ﴾
      </p>
    </Link>
  );
};

export default AyahCard;