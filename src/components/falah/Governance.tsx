import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShieldCheck, Sparkles, Infinity as InfinityIcon, ArrowUpRight } from "lucide-react";

export const Governance = () => {
  return (
    <section id="governance" className="bg-primary text-primary-foreground py-28 md:py-32 relative overflow-hidden">
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(hsl(var(--accent-glow)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--accent-glow)) 1px, transparent 1px)",
          backgroundSize: "96px 96px",
        }}
        aria-hidden
      />
      <div className="container relative">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-3 mb-6">
            <span className="h-px w-10 bg-accent/70" />
            <span className="font-sans2 text-[11px] tracking-[0.45em] uppercase text-accent font-medium">
              الجهة المشغّلة · OPERATED BY
            </span>
            <span className="h-px w-10 bg-accent/70" />
          </div>
          <h2 className="font-editorial text-4xl md:text-6xl leading-tight tracking-tight mb-6">
            تُدار باحترافيةٍ <em className="text-gradient-gold not-italic font-editorial italic">مؤسسية.</em>
          </h2>
          <p className="font-body text-base md:text-lg text-primary-foreground/75 leading-loose">
            يطوّر منهج الفلاح ويُديره فريق
            <span className="text-accent font-semibold"> ماركتس موفرز للاستشارات</span> —
            شركة تحوّل استراتيجي مقرّها دبي بخبرة تتجاوز 25 عامًا في بناء الأسواق والمؤسسات.
            هذا يضمن للوقف الاستدامة، والحوكمة المؤسسية، والاحترافية في كل تفصيل.
          </p>
        </div>

        {/* Brand plate */}
        <div className="max-w-3xl mx-auto mb-12">
          <div className="border border-accent/30 rounded-sm p-10 md:p-14 text-center bg-primary-foreground/[0.03] backdrop-blur-sm relative">
            <span
              className="absolute top-6 left-1/2 -translate-x-1/2 h-[3px] w-10 rounded-full"
              style={{ backgroundColor: "hsl(0 72% 50%)" }}
              aria-hidden
            />
            <p className="font-sans2 text-[10px] tracking-[0.5em] uppercase text-primary-foreground/60 mb-4 mt-2">
              Managed &amp; Operated by
            </p>
            <div className="flex items-baseline justify-center gap-2 mb-2">
              <p className="font-editorial text-4xl md:text-5xl text-primary-foreground tracking-tight">
                Markets Movers
              </p>
              <span
                className="font-editorial text-4xl md:text-5xl leading-none"
                style={{ color: "hsl(0 72% 55%)" }}
                aria-hidden
              >
                .
              </span>
            </div>
            <p className="font-display text-lg text-accent mb-3">ماركتس موفرز للاستشارات</p>
            <p className="font-sans2 text-[11px] tracking-[0.35em] uppercase text-primary-foreground/55">
              Leading Markets To Better Future
            </p>
          </div>
        </div>

        {/* Credibility strip */}
        <div className="max-w-5xl mx-auto mb-14 grid grid-cols-2 md:grid-cols-4 gap-px bg-accent/20 border border-accent/20 rounded-sm overflow-hidden">
          {[
            { k: "+25", l: "عامًا من الخبرة" },
            { k: "دبي", l: "حضور عالمي" },
            { k: "حوكمة", l: "مؤسسية" },
            { k: "إدارة", l: "احترافية للوقف" },
          ].map((item, i) => (
            <div key={i} className="bg-primary px-5 py-7 text-center">
              <div className="font-editorial text-2xl md:text-3xl text-accent mb-1">{item.k}</div>
              <div className="font-body text-xs md:text-sm text-primary-foreground/70 tracking-wide">{item.l}</div>
            </div>
          ))}
        </div>

        <div className="grid md:grid-cols-3 gap-5">
          {[
            { Icon: ShieldCheck, t: "الاستدامة", d: "حوكمة مؤسسية تضمن استمرار الوقف وخدمته للأجيال." },
            { Icon: Sparkles, t: "الجودة التقنية", d: "بنية رقمية حديثة، أداء متين، وتجربة استخدام راقية." },
            { Icon: InfinityIcon, t: "خلودٌ معرفي", d: "مشروع وقفي قابلٌ للنماء والامتداد عبر الزمن." },
          ].map(({ Icon, t, d }, i) => (
            <Card
              key={i}
              className="bg-primary-foreground/[0.04] border border-accent/20 backdrop-blur-sm p-7 hover:bg-primary-foreground/[0.07] hover:border-accent/40 transition-smooth shadow-md"
            >
              <div className="inline-flex items-center justify-center w-11 h-11 rounded-full border border-accent/40 mb-5">
                <Icon className="w-5 h-5 text-accent" />
              </div>
              <h3 className="font-editorial text-2xl text-primary-foreground mb-2">{t}</h3>
              <p className="text-sm text-primary-foreground/65 leading-relaxed font-body">{d}</p>
            </Card>
          ))}
        </div>

        <div className="mt-14 text-center">
          <Button
            asChild
            size="lg"
            className="bg-accent text-accent-foreground hover:bg-accent/90 btn-lux font-medium tracking-wide"
          >
            <a
              href="https://www.marketsmovers.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2"
            >
              تعرّف على ماركتس موفرز
              <ArrowUpRight className="w-4 h-4" />
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
};