import { Navbar } from "@/components/falah/Navbar";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import {
  ArrowLeft,
  BookOpen,
  Compass,
  ListTodo,
  Sunrise,
  Trophy,
  Layers,
  PlayCircle,
} from "lucide-react";
import heroPattern from "@/assets/hero-pattern.jpg";
import heroMuseum from "@/assets/hero-museum.jpg";
import { useEffect, useState } from "react";
import { domains, paths, methodSteps } from "@/data/falah";
import { LegacySection } from "@/components/falah/LegacySection";
import { ContributeSection } from "@/components/falah/ContributeSection";
import { FalahiTeaser } from "@/components/falah/FalahiTeaser";
import { Governance } from "@/components/falah/Governance";
import { EngagementHub } from "@/components/falah/EngagementHub";
import { SiteFooter } from "@/components/falah/SiteFooter";
import { useScrollReveal } from "@/hooks/useScrollReveal";

const Eyebrow = ({ kicker, label }: { kicker: string; label: string }) => (
  <div className="inline-flex items-center gap-3 mb-6">
    <span className="h-px w-10 bg-accent/60" />
    <span className="font-sans2 text-[11px] tracking-[0.45em] uppercase text-accent font-medium">
      {kicker} · {label}
    </span>
    <span className="h-px w-10 bg-accent/60" />
  </div>
);

const useParallax = () => {
  const [y, setY] = useState(0);
  useEffect(() => {
    const onScroll = () => setY(window.scrollY);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return y;
};

const ParallaxBg = ({
  image,
  speed = 0.25,
  opacity = 0.08,
  tint,
}: {
  image: string;
  speed?: number;
  opacity?: number;
  tint?: string;
}) => {
  const y = useParallax();
  return (
    <>
      <div
        className="absolute inset-0 will-change-transform pointer-events-none"
        style={{
          backgroundImage: `url(${image})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          opacity,
          transform: `translate3d(0, ${y * speed}px, 0)`,
        }}
        aria-hidden
      />
      {tint && <div className="absolute inset-0 pointer-events-none" style={{ background: tint }} aria-hidden />}
    </>
  );
};

const Index = () => {
  useScrollReveal();
  const { user } = useAuth();
  const domainsHref = user ? "/domain" : "/auth";
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* HERO — Museumcore Cinematic */}
      <section className="relative overflow-hidden bg-background min-h-[92vh] flex items-center">
        <img
          src={heroMuseum}
          alt=""
          width={1920}
          height={1080}
          className="absolute inset-0 w-full h-full object-cover"
          aria-hidden
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to bottom, hsl(40 35% 93% / 0.55) 0%, hsl(40 35% 93% / 0.78) 45%, hsl(40 35% 93% / 0.96) 90%, hsl(40 35% 93%) 100%)",
          }}
          aria-hidden
        />
        {/* Subtle museum dot grid */}
        <div
          className="absolute inset-0 opacity-[0.05] pointer-events-none"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, hsl(var(--primary)) 1px, transparent 0)",
            backgroundSize: "36px 36px",
          }}
          aria-hidden
        />

        <div className="container relative pt-32 pb-24 md:pt-40 md:pb-32 text-center">
          <div className="animate-float-in">
            <Eyebrow kicker="A Quranic Endowment" label="وقفٌ قرآنيٌّ معرفي" />
          </div>

          <h1 className="font-editorial text-[2.75rem] xs:text-[3.25rem] sm:text-6xl md:text-8xl lg:text-[8.5rem] text-primary leading-[1] tracking-tight mb-8 animate-float-in">
            منهج <em className="not-italic font-editorial italic text-gradient-gold">الفلاح</em>
          </h1>

          {/* Ornament rule */}
          <div className="flex items-center justify-center gap-4 mb-7" aria-hidden>
            <span className="h-px w-16 md:w-24 bg-accent/50" />
            <span className="w-1.5 h-1.5 rotate-45 bg-accent/70" />
            <span className="h-px w-16 md:w-24 bg-accent/50" />
          </div>

          <p className="font-quran text-xl sm:text-2xl md:text-4xl text-primary/85 mb-6 leading-loose">
            ﴿ قَدْ أَفْلَحَ مَن زَكَّاهَا ﴾
          </p>

          <p className="font-editorial italic text-base sm:text-lg md:text-2xl text-muted-foreground max-w-2xl mx-auto mb-12 leading-relaxed">
            من الوحي… إلى الحياة. القرآن هدايةٌ تُعاش، وسلوكٌ يُنجز، وفلاحٌ لا ينقطع.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 mb-16">
            <Button
              asChild
              size="lg"
              className="btn-lux bg-primary text-primary-foreground hover:bg-primary/90 shadow-elegant text-base px-10 h-12 rounded-none font-sans2 tracking-widest uppercase"
            >
              <Link to="/app">
                ابدأ رحلتك <ArrowLeft className="mr-2 w-4 h-4" />
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="btn-lux border-primary/30 hover:border-accent text-primary text-base px-10 h-12 rounded-none font-sans2 tracking-widest uppercase bg-transparent"
            >
              <a href="#perspective">تعرّف على المنهج</a>
            </Button>
          </div>

          {/* Editorial film frame */}
          <div className="max-w-5xl mx-auto animate-float-in">
            <p className="font-sans2 text-[10px] tracking-[0.45em] uppercase text-accent mb-4">
              <PlayCircle className="inline w-3.5 h-3.5 mb-0.5 ml-1" />
              Featured Film · فيلم تعريفي
            </p>
            <div
              className="img-zoom relative p-[2px]"
              style={{
                background:
                  "linear-gradient(135deg, hsl(38 75% 55%), hsl(42 85% 70%) 40%, hsl(38 60% 40%))",
              }}
            >
              <div className="bg-card p-2">
                <div className="border border-accent/30 p-[3px]">
                  <div className="aspect-video relative overflow-hidden">
                    <iframe
                      src="https://www.youtube.com/embed/tiNANW1m1_o"
                      title="منهج الفلاح — تعريف بالمشروع"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                      loading="lazy"
                      className="w-full h-full"
                    />
                  </div>
                </div>
              </div>
            </div>
            <p className="font-sans2 text-xs tracking-widest text-muted-foreground mt-5 uppercase">
              An Introduction · شاهد تعريفًا موجزًا بمنهج الفلاح
            </p>
          </div>
        </div>
      </section>

      {/* PERSPECTIVE */}
      <section id="perspective" className="relative container py-40 md:py-56 overflow-hidden">
        <ParallaxBg image={heroPattern} speed={0.18} opacity={0.05} />
        <div className="reveal relative text-center mb-24 max-w-3xl mx-auto">
          <Eyebrow kicker="The Perspective" label="المنظور" />
          <h2 className="font-editorial text-4xl sm:text-5xl md:text-6xl text-primary leading-[1.05] tracking-tight">
            رؤيتنا، رسالتنا، <em className="not-italic italic text-accent">قِيَمنا.</em>
          </h2>
        </div>
        <div className="relative grid md:grid-cols-3 gap-px bg-border/50">
          {[
            { n: "I", t: "الرؤية", en: "Vision", d: "بناء إنسانٍ مهتدٍ بالقرآن، يحقّق الفلاح في دنياه ويصل إلى الجنّة في آخرته." },
            { n: "II", t: "الرسالة", en: "Mission", d: "تقديم منهج قرآني عملي شامل يُحوّل الآيات إلى بوصلة حياة وسلوك وإنجاز." },
            { n: "III", t: "القيم", en: "Values", d: "القرآن أصلٌ ومنهج، الهداية قبل الإنجاز، السلوك قبل النتائج، الدنيا مزرعة الآخرة." },
          ].map((item, i) => (
            <div key={i} className={`reveal bg-background p-10 md:p-12 group hover:bg-card transition-smooth ${i === 1 ? "md:translate-y-10" : ""}`} style={{ transitionDelay: `${i * 90}ms` }}>
              <p className="font-editorial italic text-5xl text-accent/70 mb-6">{item.n}</p>
              <p className="font-sans2 text-[10px] tracking-[0.4em] uppercase text-accent mb-2">{item.en}</p>
              <h3 className="font-editorial text-3xl text-primary mb-5">{item.t}</h3>
              <p className="text-muted-foreground leading-loose text-[15px]">{item.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* METHOD */}
      <section id="method" className="relative bg-[hsl(118_18%_10%)] text-primary-foreground py-40 md:py-56 overflow-hidden">
        <ParallaxBg image={heroMuseum} speed={0.2} opacity={0.18} />
        <div
          className="absolute inset-0 opacity-[0.05] pointer-events-none"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, hsl(38 60% 70%) 1px, transparent 0)",
            backgroundSize: "40px 40px",
          }}
          aria-hidden
        />
        <div
          className="absolute inset-0 opacity-50 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse at 50% 0%, hsl(38 75% 55% / 0.18), transparent 60%)",
          }}
          aria-hidden
        />
        <div className="container relative">
          <div className="reveal text-center mb-20 max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-3 mb-6">
              <span className="h-px w-10 bg-accent/70" />
              <span className="font-sans2 text-[11px] tracking-[0.45em] uppercase text-accent font-medium">
                The Method · المنهج
              </span>
              <span className="h-px w-10 bg-accent/70" />
            </div>
            <h2 className="font-editorial text-4xl sm:text-5xl md:text-6xl leading-[1.05] tracking-tight mb-6">
              من الآية… <em className="not-italic italic text-gradient-gold">إلى الفلاح.</em>
            </h2>
            <p className="font-editorial italic text-lg md:text-xl text-primary-foreground/65 leading-relaxed">
              أربع خطوات تُحوّل الوحي إلى سلوكٍ وأثرٍ ومآلٍ كريم.
            </p>
          </div>
          <div className="grid md:grid-cols-4 gap-px bg-primary-foreground/10">
            {methodSteps.map((s, i) => (
              <div
                key={s.n}
                className="reveal relative bg-[hsl(155_45%_8%)] p-8 md:p-10 hover:bg-[hsl(155_40%_11%)] transition-smooth group"
                style={{ transitionDelay: `${i * 80}ms` }}
              >
                <div className="flex items-baseline gap-3 mb-6">
                  <span className="font-editorial text-6xl text-gradient-gold leading-none">{s.n}</span>
                  <span className="font-sans2 text-[10px] tracking-[0.4em] uppercase text-accent/70">
                    Step
                  </span>
                </div>
                <h3 className="font-editorial text-2xl mb-3 text-primary-foreground">{s.title}</h3>
                <p className="text-primary-foreground/65 text-sm leading-loose">{s.desc}</p>
                <span className="absolute bottom-0 right-0 h-px w-0 bg-accent group-hover:w-full transition-all duration-700" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* DOMAINS — Masonry */}
      <section id="domains" className="relative bg-[hsl(40_30%_91%)] py-40 md:py-56 overflow-hidden">
        <ParallaxBg image={heroPattern} speed={0.12} opacity={0.06} />
        <div className="relative container">
          <div className="reveal text-center mb-24 max-w-3xl mx-auto">
            <Eyebrow kicker="The Eight Domains" label="المجالات الثمانية" />
            <h2 className="font-editorial text-4xl sm:text-5xl md:text-6xl text-primary leading-[1.05] tracking-tight mb-6">
              رحلةُ الحياة <em className="not-italic italic text-accent">المتكاملة.</em>
            </h2>
            <p className="font-editorial italic text-lg text-muted-foreground leading-relaxed">
              ثمانية مجالاتٍ تُغطّي الإنسان كلّه — قلبَه، جسدَه، عقلَه، عمله، ماله، أسرته، أمّته، وابتلاءاته.
            </p>
          </div>
          <div className="columns-1 md:columns-2 lg:columns-3 gap-6 [column-fill:_balance]">
            {domains.map((d, i) => (
              <Link
                to={domainsHref}
                key={d.id}
                className={`reveal group break-inside-avoid mb-6 block bg-card border border-border shadow-md p-8 hover:bg-card hover:shadow-elegant hover:-translate-y-1 transition-smooth relative overflow-hidden cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
                  i % 3 === 0 ? "pb-14" : i % 3 === 1 ? "pb-10" : "pb-12"
                }`}
                style={{ transitionDelay: `${(i % 6) * 70}ms` }}
              >
                <div className="flex items-start justify-between mb-6">
                  <span className="font-editorial italic text-5xl text-accent/60 leading-none">
                    {d.id.toString().padStart(2, "0")}
                  </span>
                  <BookOpen className="w-4 h-4 text-accent opacity-50 group-hover:opacity-100 transition-smooth" />
                </div>
                <h3 className="font-editorial text-2xl text-foreground mb-1 leading-tight">{d.title}</h3>
                <p className="font-sans2 text-[10px] tracking-[0.35em] uppercase text-accent mb-4">
                  {d.subtitle}
                </p>
                <p className="font-quran text-[15px] text-primary/75 mb-4 leading-loose">﴿ {d.quote} ﴾</p>
                <p className="text-sm text-muted-foreground leading-loose">{d.desc}</p>
                <span className="absolute bottom-0 left-0 h-[2px] w-0 bg-accent group-hover:w-full transition-all duration-700" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* FALAHI TEASER — after the 8 Domains, before Paths/Legacy */}
      <FalahiTeaser />

      {/* PATHS */}
      <section id="paths" className="relative container py-40 md:py-56 overflow-hidden">
        <ParallaxBg image={heroMuseum} speed={0.15} opacity={0.04} />
        <div className="reveal relative text-center mb-24 max-w-3xl mx-auto">
          <Eyebrow kicker="The Life Paths" label="المسارات الحياتية" />
          <h2 className="font-editorial text-4xl sm:text-5xl md:text-6xl text-primary leading-[1.05] tracking-tight">
            لكلّ عُمرٍ <em className="not-italic italic text-accent">فلاحُه.</em>
          </h2>
        </div>
        <div className="relative grid md:grid-cols-3 gap-8">
          {paths.map((p, i) => (
            <article
              key={p.id}
              className={`reveal relative bg-card p-10 border border-border shadow-md hover:shadow-elegant hover:-translate-y-1 transition-smooth ${
                i === 1 ? "md:translate-y-12" : i === 2 ? "md:translate-y-6" : ""
              }`}
              style={{ transitionDelay: `${i * 90}ms` }}
            >
              <div className="absolute top-0 right-0 left-0 h-px bg-gradient-to-r from-transparent via-accent to-transparent" />
              <p className="font-editorial italic text-3xl text-accent/70 mb-6">
                {String(i + 1).padStart(2, "0")}
              </p>
              <p className="font-sans2 text-[10px] tracking-[0.4em] uppercase text-accent mb-3">
                {p.age}
              </p>
              <h3 className="font-editorial text-3xl text-primary mb-5">{p.title}</h3>
              <p className="font-quran text-base text-primary/70 mb-5 leading-loose">"{p.quote}"</p>
              <p className="text-muted-foreground leading-loose text-[15px]">{p.focus}</p>
            </article>
          ))}
        </div>
      </section>

      {/* SERVICES — Masonry */}
      <section id="services" className="relative bg-[hsl(40_30%_91%)] py-40 md:py-56 overflow-hidden">
        <ParallaxBg image={heroPattern} speed={0.18} opacity={0.05} />
        <div className="relative container">
        <div className="reveal text-center mb-24 max-w-3xl mx-auto">
          <Eyebrow kicker="Inside the Platform" label="داخل المنصّة" />
          <h2 className="font-editorial text-4xl sm:text-5xl md:text-6xl text-primary leading-[1.05] tracking-tight mb-6">
            منظومةٌ <em className="not-italic italic text-accent">متكاملة.</em>
          </h2>
          <p className="font-editorial italic text-lg text-muted-foreground leading-relaxed">
            تخطيطٌ، وتزكيةٌ، وإنجاز — في فضاءٍ واحدٍ مدروس.
          </p>
        </div>
        <div className="columns-1 md:columns-2 lg:columns-3 gap-6 [column-fill:_balance]">
          {[
            { icon: ListTodo, t: "مخطّط المهام", d: "أضف مهامك وأهدافك حسب المجال والأولوية والتاريخ.", href: "/app" },
            { icon: Layers, t: "المجالات الثمانية", d: "تابع تقدّمك في 8 مجالات حياتية بنظرة شاملة.", href: "/app" },
            { icon: Sunrise, t: "اليومية الإيمانية", d: "وِرد، صلوات، تدبّر، طمأنينة وطاقة — في صفحة واحدة.", href: "/app" },
            { icon: Trophy, t: "الإنجازات والمستويات", d: "اجمع نقاطًا، ارتقِ مستويات، واحصد الأوسمة.", href: "/app" },
            { icon: BookOpen, t: "تصنيف القرآن", d: "استكشف آيات القرآن مصنّفة وفق منهج الفلاح السداسي.", href: "/quran" },
            { icon: Compass, t: "المرشد الذكي", d: "استشر القرآن في موقفك واحصل على هداية وأدعية وخطوات.", href: "/guide" },
          ].map((s, i) => (
            <Link
              key={i}
              to={s.href}
              aria-label={s.t}
              className={`reveal group block break-inside-avoid mb-6 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent bg-background border border-border/50 hover:bg-card hover:shadow-elegant transition-smooth p-8 relative ${
                i % 3 === 0 ? "pb-16" : i % 3 === 1 ? "pb-10" : "pb-12"
              }`}
              style={{ transitionDelay: `${(i % 6) * 70}ms` }}
            >
              <div className="flex items-start justify-between mb-6">
                <s.icon className="w-7 h-7 text-accent" strokeWidth={1.4} />
                <span className="font-editorial italic text-2xl text-accent/50">
                  {String(i + 1).padStart(2, "0")}
                </span>
              </div>
              <h3 className="font-editorial text-2xl text-primary mb-3">{s.t}</h3>
              <p className="text-sm text-muted-foreground leading-loose mb-5">{s.d}</p>
              <span className="inline-flex items-center gap-2 text-xs font-sans2 tracking-[0.3em] uppercase text-accent group-hover:gap-3 transition-all">
                استكشف <ArrowLeft className="w-3.5 h-3.5" />
              </span>
              <span className="absolute bottom-0 left-0 h-[2px] w-0 bg-accent group-hover:w-full transition-all duration-700" />
            </Link>
          ))}
        </div>
        </div>
      </section>

      {/* CTA */}
      <section className="container py-40 md:py-56">
        <div className="relative overflow-hidden bg-[hsl(155_45%_8%)] p-14 md:p-24 text-center shadow-elegant border border-accent/20">
          <div
            className="absolute inset-0 opacity-[0.06]"
            style={{ backgroundImage: `url(${heroPattern})`, backgroundSize: "cover" }}
            aria-hidden
          />
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "radial-gradient(ellipse at 50% 0%, hsl(38 75% 55% / 0.18), transparent 70%)",
            }}
            aria-hidden
          />
          <div className="reveal relative">
            <div className="inline-flex items-center gap-3 mb-7">
              <span className="h-px w-10 bg-accent/70" />
              <span className="font-sans2 text-[11px] tracking-[0.45em] uppercase text-accent-glow">
                Begin · ابدأ
              </span>
              <span className="h-px w-10 bg-accent/70" />
            </div>
            <h2 className="font-editorial text-3xl sm:text-4xl md:text-6xl text-primary-foreground mb-7 leading-[1.1] tracking-tight">
              ابدأ رحلتك نحو
              <br />
              <em className="not-italic italic text-gradient-gold">الفلاح</em> اليوم.
            </h2>
            <p className="font-editorial italic text-primary-foreground/70 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
              قياسٌ أسبوعي، خططٌ يومية، وأدواتٌ عملية تُترجم القرآن إلى سلوكٍ وأثر.
            </p>
            <Button
              asChild
              size="lg"
              className="btn-lux bg-gradient-gold text-accent-foreground hover:opacity-90 shadow-gold text-base px-12 h-14 rounded-none font-sans2 tracking-[0.3em] uppercase"
            >
              <Link to="/app">
                ادخل التطبيق <ArrowLeft className="mr-2 w-4 h-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* LEGACY · GOVERNANCE · ENGAGEMENT */}
      <LegacySection />
      <ContributeSection />
      <Governance />
      <EngagementHub />

      <SiteFooter />
    </div>
  );
};

export default Index;
