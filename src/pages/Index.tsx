import { Navbar } from "@/components/falah/Navbar";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import {
  ArrowLeft,
  ArrowRight,
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
import { LegacySection } from "@/components/falah/LegacySection";
import { ContributeSection } from "@/components/falah/ContributeSection";
import { FalahiTeaser } from "@/components/falah/FalahiTeaser";
import { Governance } from "@/components/falah/Governance";
import { EngagementHub } from "@/components/falah/EngagementHub";
import { SiteFooter } from "@/components/falah/SiteFooter";
import { ShareJourneyCard } from "@/components/falah/ShareJourneyCard";
import { InstallPwaButton } from "@/components/falah/InstallPwaButton";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { LandingLangProvider, LanguageBar, useLandingLang } from "@/i18n/landing/LandingLang";

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

const IndexInner = () => {
  useScrollReveal();
  const { user } = useAuth();
  const { t, dir } = useLandingLang();
  const domainsHref = user ? "/domain" : "/auth";
  const ArrowFwd = dir === "rtl" ? ArrowLeft : ArrowRight;
  return (
    <div className="min-h-screen bg-background">
      <LanguageBar />
      <Navbar />

      {/* HERO — Museumcore Cinematic */}
      <section className="relative overflow-hidden bg-background flex items-center">
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
            <Eyebrow kicker={t.hero.eyebrowKicker} label={t.hero.eyebrowLabel} />
          </div>

          <h1 className="font-editorial text-[2.75rem] xs:text-[3.25rem] sm:text-6xl md:text-8xl lg:text-[8.5rem] text-primary leading-[1] tracking-tight mb-8 animate-float-in">
            {t.hero.titleLead}{" "}
            <em className="not-italic font-editorial italic text-gradient-gold">
              {t.hero.titleEm}
            </em>
          </h1>

          {/* Ornament rule */}
          <div className="flex items-center justify-center gap-4 mb-7" aria-hidden>
            <span className="h-px w-16 md:w-24 bg-accent/50" />
            <span className="w-1.5 h-1.5 rotate-45 bg-accent/70" />
            <span className="h-px w-16 md:w-24 bg-accent/50" />
          </div>

          <p className="font-quran text-xl sm:text-2xl md:text-4xl text-primary/85 mb-6 leading-loose">
            ﴿ {t.hero.verse} ﴾
          </p>
          {t.hero.verseTranslation ? (
            <p className="font-editorial italic text-sm sm:text-base text-muted-foreground/90 mb-6">
              {t.hero.verseTranslation}
            </p>
          ) : null}

          <p className="font-editorial italic text-base sm:text-lg md:text-2xl text-muted-foreground max-w-2xl mx-auto mb-12 leading-relaxed">
            {t.hero.subtitle}
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 mb-16">
            <Button
              asChild
              size="lg"
              className="btn-lux bg-primary text-primary-foreground hover:bg-primary/90 shadow-elegant text-base px-10 h-12 rounded-none font-sans2 tracking-widest uppercase"
            >
              <Link to="/app">
                {t.hero.ctaStart} <ArrowFwd className="ms-2 w-4 h-4" />
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="btn-lux border-primary/30 hover:border-accent text-primary text-base px-10 h-12 rounded-none font-sans2 tracking-widest uppercase bg-transparent"
            >
              <a href="#perspective">{t.hero.ctaLearn}</a>
            </Button>
          </div>

          {/* Editorial film frame */}
          <div className="max-w-5xl mx-auto animate-float-in">
            <p className="font-sans2 text-[10px] tracking-[0.45em] uppercase text-accent mb-4">
              <PlayCircle className="inline w-3.5 h-3.5 mb-0.5 ms-1" />
              {t.hero.featuredFilm}
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
                      title={t.hero.videoTitle}
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
              {t.hero.videoCaption}
            </p>
          </div>
        </div>
      </section>

      {/* PERSPECTIVE */}
      <section id="perspective" className="relative container py-24 md:py-32 overflow-hidden">
        <ParallaxBg image={heroPattern} speed={0.18} opacity={0.05} />
        <div className="reveal relative text-center mb-24 max-w-3xl mx-auto">
          <Eyebrow kicker={t.perspective.eyebrowKicker} label={t.perspective.eyebrowLabel} />
          <h2 className="font-editorial text-4xl sm:text-5xl md:text-6xl text-primary leading-[1.05] tracking-tight">
            {t.perspective.titleLead}{" "}
            <em className="not-italic italic text-accent">{t.perspective.titleEm}</em>
          </h2>
        </div>
        <div className="relative grid md:grid-cols-3 gap-px bg-border/50">
          {t.perspective.items.map((item, i) => (
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
      <section id="method" className="relative bg-[hsl(118_18%_10%)] text-primary-foreground py-24 md:py-32 overflow-hidden">
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
                {t.method.eyebrow}
              </span>
              <span className="h-px w-10 bg-accent/70" />
            </div>
            <h2 className="font-editorial text-4xl sm:text-5xl md:text-6xl leading-[1.05] tracking-tight mb-6">
              {t.method.titleLead}{" "}
              <em className="not-italic italic text-gradient-gold">{t.method.titleEm}</em>
            </h2>
            <p className="font-editorial italic text-lg md:text-xl text-primary-foreground/65 leading-relaxed">
              {t.method.subtitle}
            </p>
          </div>
          <div className="grid md:grid-cols-4 gap-px bg-primary-foreground/10">
            {t.method.steps.map((s, i) => (
              <div
                key={i}
                className="reveal relative bg-[hsl(155_45%_8%)] p-8 md:p-10 hover:bg-[hsl(155_40%_11%)] transition-smooth group"
                style={{ transitionDelay: `${i * 80}ms` }}
              >
                <div className="flex items-baseline gap-3 mb-6">
                  <span className="font-editorial text-6xl text-gradient-gold leading-none">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="font-sans2 text-[10px] tracking-[0.4em] uppercase text-accent/70">
                    {t.method.stepLabel}
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
      <section id="domains" className="relative bg-[hsl(40_30%_91%)] py-24 md:py-32 overflow-hidden">
        <ParallaxBg image={heroPattern} speed={0.12} opacity={0.06} />
        <div className="relative container">
          <div className="reveal text-center mb-24 max-w-3xl mx-auto">
            <Eyebrow kicker={t.domains.eyebrowKicker} label={t.domains.eyebrowLabel} />
            <h2 className="font-editorial text-4xl sm:text-5xl md:text-6xl text-primary leading-[1.05] tracking-tight mb-6">
              {t.domains.titleLead}{" "}
              <em className="not-italic italic text-accent">{t.domains.titleEm}</em>
            </h2>
            <p className="font-editorial italic text-lg text-muted-foreground leading-relaxed">
              {t.domains.subtitle}
            </p>
          </div>
          <div className="columns-1 md:columns-2 lg:columns-3 gap-6 [column-fill:_balance]">
            {t.domains.items.map((d, i) => (
              <Link
                to={domainsHref}
                key={i}
                className={`reveal group break-inside-avoid mb-6 block bg-card border border-border shadow-md p-8 hover:bg-card hover:shadow-elegant hover:-translate-y-1 transition-smooth relative overflow-hidden cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
                  i % 3 === 0 ? "pb-14" : i % 3 === 1 ? "pb-10" : "pb-12"
                }`}
                style={{ transitionDelay: `${(i % 6) * 70}ms` }}
              >
                <div className="flex items-start justify-between mb-6">
                  <span className="font-editorial italic text-5xl text-accent/60 leading-none">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <BookOpen className="w-4 h-4 text-accent opacity-50 group-hover:opacity-100 transition-smooth" />
                </div>
                <h3 className="font-editorial text-2xl text-foreground mb-1 leading-tight">{d.title}</h3>
                <p className="font-sans2 text-[10px] tracking-[0.35em] uppercase text-accent mb-4">
                  {d.subtitle}
                </p>
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
      <section id="paths" className="relative container py-24 md:py-32 overflow-hidden">
        <ParallaxBg image={heroMuseum} speed={0.15} opacity={0.04} />
        <div className="reveal relative text-center mb-24 max-w-3xl mx-auto">
          <Eyebrow kicker={t.paths.eyebrowKicker} label={t.paths.eyebrowLabel} />
          <h2 className="font-editorial text-4xl sm:text-5xl md:text-6xl text-primary leading-[1.05] tracking-tight">
            {t.paths.titleLead}{" "}
            <em className="not-italic italic text-accent">{t.paths.titleEm}</em>
          </h2>
        </div>
        <div className="relative grid md:grid-cols-3 gap-8">
          {t.paths.items.map((p, i) => (
            <article
              key={i}
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
              <p className="text-muted-foreground leading-loose text-[15px]">{p.focus}</p>
            </article>
          ))}
        </div>
      </section>

      {/* SERVICES — Masonry */}
      <section id="services" className="relative bg-[hsl(40_30%_91%)] py-24 md:py-32 overflow-hidden">
        <ParallaxBg image={heroPattern} speed={0.18} opacity={0.05} />
        <div className="relative container">
        <div className="reveal text-center mb-24 max-w-3xl mx-auto">
          <Eyebrow kicker={t.services.eyebrowKicker} label={t.services.eyebrowLabel} />
          <h2 className="font-editorial text-4xl sm:text-5xl md:text-6xl text-primary leading-[1.05] tracking-tight mb-6">
            {t.services.titleLead}{" "}
            <em className="not-italic italic text-accent">{t.services.titleEm}</em>
          </h2>
          <p className="font-editorial italic text-lg text-muted-foreground leading-relaxed">
            {t.services.subtitle}
          </p>
        </div>
        <div className="columns-1 md:columns-2 lg:columns-3 gap-6 [column-fill:_balance]">
          {[
            { icon: ListTodo, href: "/app" },
            { icon: Layers, href: "/app" },
            { icon: Sunrise, href: "/app" },
            { icon: Trophy, href: "/app" },
            { icon: BookOpen, href: "/quran" },
            { icon: Compass, href: "/guide" },
          ].map((s, i) => (
            <Link
              key={i}
              to={s.href}
              aria-label={t.services.items[i]?.t}
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
              <h3 className="font-editorial text-2xl text-primary mb-3">{t.services.items[i]?.t}</h3>
              <p className="text-sm text-muted-foreground leading-loose mb-5">{t.services.items[i]?.d}</p>
              <span className="inline-flex items-center gap-2 text-xs font-sans2 tracking-[0.3em] uppercase text-accent group-hover:gap-3 transition-all">
                {t.services.explore} <ArrowFwd className="w-3.5 h-3.5" />
              </span>
              <span className="absolute bottom-0 left-0 h-[2px] w-0 bg-accent group-hover:w-full transition-all duration-700" />
            </Link>
          ))}
        </div>
        </div>
      </section>

      {/* CTA */}
      <section className="container py-24 md:py-32">
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
                {t.cta.eyebrow}
              </span>
              <span className="h-px w-10 bg-accent/70" />
            </div>
            <h2 className="font-editorial text-3xl sm:text-4xl md:text-6xl text-primary-foreground mb-7 leading-[1.1] tracking-tight">
              {t.cta.titleLead}
              <br />
              <em className="not-italic italic text-gradient-gold">{t.cta.titleEm}</em>{" "}
              {t.cta.titleSuffix}
            </h2>
            <p className="font-editorial italic text-primary-foreground/70 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
              {t.cta.subtitle}
            </p>
            <Button
              asChild
              size="lg"
              className="btn-lux bg-gradient-gold text-accent-foreground hover:opacity-90 shadow-gold text-base px-12 h-14 rounded-none font-sans2 tracking-[0.3em] uppercase"
            >
              <Link to="/app">
                {t.cta.button} <ArrowFwd className="ms-2 w-4 h-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* LEGACY · GOVERNANCE · ENGAGEMENT */}
      <LegacySection />
      <ContributeSection />
      <section className="bg-background py-16 md:py-20" dir="rtl">
        <div className="container max-w-3xl">
          <ShareJourneyCard />
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4 text-center">
            <p className="text-sm text-muted-foreground leading-relaxed">
              اجعل فلاح رفيقًا يوميًا — على شاشة هاتفك.
            </p>
            <InstallPwaButton />
          </div>
        </div>
      </section>
      <Governance />
      <EngagementHub />

      <SiteFooter />
    </div>
  );
};

const Index = () => (
  <LandingLangProvider>
    <IndexInner />
  </LandingLangProvider>
);

export default Index;
