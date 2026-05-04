import { Card } from "@/components/ui/card";
import { Building2, ShieldCheck, Sparkles, Infinity as InfinityIcon } from "lucide-react";

export const Governance = () => {
  return (
    <section id="governance" className="bg-[hsl(155_30%_8%)] text-primary-foreground py-28 md:py-32 relative overflow-hidden">
      <div
        className="absolute inset-0 opacity-[0.05] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(hsl(40 60% 70%) 1px, transparent 1px), linear-gradient(90deg, hsl(40 60% 70%) 1px, transparent 1px)",
          backgroundSize: "80px 80px",
        }}
        aria-hidden
      />
      <div className="container relative">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-3 mb-6">
            <span className="h-px w-10 bg-accent/70" />
            <span className="font-sans2 text-[11px] tracking-[0.45em] uppercase text-accent">
              Executive Governance
            </span>
            <span className="h-px w-10 bg-accent/70" />
          </div>
          <h2 className="font-editorial text-4xl md:text-6xl leading-tight tracking-tight mb-6">
            تُدار باحترافيةٍ <em className="text-gradient-gold not-italic font-editorial italic">مؤسسية.</em>
          </h2>
          <p className="font-body text-base md:text-lg text-primary-foreground/70 leading-loose">
            يُشرف على المنصة ويديرها فريقٌ متخصص من
            <span className="text-accent font-semibold"> ماركتس موفرز للاستشارات</span>،
            ضمانًا للاستدامة، الجودة التقنية، والاحترافية في تقديم المحتوى المعرفي.
          </p>
        </div>

        {/* Brand plate */}
        <div className="max-w-3xl mx-auto mb-16">
          <div className="border border-accent/30 rounded-sm p-10 md:p-12 text-center bg-primary-foreground/[0.02] backdrop-blur-sm">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-full border border-accent/40 mb-5">
              <Building2 className="w-6 h-6 text-accent" />
            </div>
            <p className="font-sans2 text-[10px] tracking-[0.5em] uppercase text-primary-foreground/60 mb-3">
              Managed & Operated by
            </p>
            <p className="font-editorial text-3xl md:text-4xl text-primary-foreground mb-1">
              Markets Movers
            </p>
            <p className="font-display text-lg text-accent">ماركتس موفرز للاستشارات</p>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-5">
          {[
            { Icon: ShieldCheck, t: "الاستدامة", d: "حوكمة مؤسسية تضمن استمرار الوقف وخدمته للأجيال." },
            { Icon: Sparkles, t: "الجودة التقنية", d: "بنية رقمية حديثة، أداء متين، وتجربة استخدام راقية." },
            { Icon: InfinityIcon, t: "خلودٌ معرفي", d: "مشروع وقفي قابلٌ للنماء والامتداد عبر الزمن." },
          ].map(({ Icon, t, d }, i) => (
            <Card
              key={i}
              className="bg-primary-foreground/[0.03] border-primary-foreground/10 backdrop-blur-sm p-7 hover:bg-primary-foreground/[0.06] transition-smooth"
            >
              <Icon className="w-6 h-6 text-accent mb-5" />
              <h3 className="font-editorial text-2xl text-primary-foreground mb-2">{t}</h3>
              <p className="text-sm text-primary-foreground/65 leading-relaxed font-body">{d}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};