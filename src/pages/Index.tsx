import { Navbar } from "@/components/falah/Navbar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { ArrowLeft, BookOpen, Compass, Sparkles } from "lucide-react";
import heroPattern from "@/assets/hero-pattern.jpg";
import { domains, paths, methodSteps } from "@/data/falah";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* HERO */}
      <section className="relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-20"
          style={{ backgroundImage: `url(${heroPattern})`, backgroundSize: "cover", backgroundPosition: "center" }}
          aria-hidden
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/80 to-background" aria-hidden />
        <div className="container relative py-24 md:py-36 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-accent/30 bg-accent/5 mb-6 animate-float-in">
            <Sparkles className="w-3.5 h-3.5 text-accent" />
            <span className="text-xs text-accent">مشروع قرآني تطبيقي</span>
          </div>
          <h1 className="font-display text-5xl md:text-7xl lg:text-8xl font-bold text-primary leading-tight mb-6 animate-float-in">
            منهج <span className="text-gradient-gold">الفلاح</span>
          </h1>
          <p className="font-quran text-2xl md:text-3xl text-primary/80 mb-4">﴿ قَدْ أَفْلَحَ مَن زَكَّاهَا ﴾</p>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
            من الوحي... إلى الحياة. القرآن هدايةٌ تُعاش، وسلوكٌ يُنجز، وفلاحٌ لا ينقطع.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Button asChild size="lg" className="bg-gradient-emerald text-primary-foreground hover:opacity-90 shadow-elegant text-base px-8">
              <Link to="/app">ابدأ رحلتك <ArrowLeft className="mr-2 w-4 h-4" /></Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="border-primary/30 text-base px-8">
              <a href="#perspective">تعرّف على المنهج</a>
            </Button>
          </div>
        </div>
      </section>

      {/* PERSPECTIVE */}
      <section id="perspective" className="container py-24">
        <div className="text-center mb-16">
          <p className="text-accent text-sm tracking-widest mb-3">المنظور</p>
          <h2 className="font-display text-4xl md:text-5xl text-primary mb-4">رؤيتنا، رسالتنا، قِيَمنا</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { t: "الرؤية", d: "بناء إنسانٍ مهتدٍ بالقرآن، يحقّق الفلاح في دنياه ويصل إلى الجنّة في آخرته." },
            { t: "الرسالة", d: "تقديم منهج قرآني عملي شامل يُحوّل الآيات إلى بوصلة حياة وسلوك وإنجاز." },
            { t: "القيم", d: "القرآن أصلٌ ومنهج، الهداية قبل الإنجاز، السلوك قبل النتائج، الدنيا مزرعة الآخرة." },
          ].map((item, i) => (
            <Card key={i} className="p-8 bg-gradient-card border-border/60 shadow-soft hover:shadow-elegant transition-smooth">
              <div className="w-12 h-12 rounded-xl bg-gradient-emerald flex items-center justify-center mb-5">
                <Compass className="w-6 h-6 text-primary-foreground" />
              </div>
              <h3 className="font-display text-2xl text-primary mb-3">{item.t}</h3>
              <p className="text-muted-foreground leading-relaxed">{item.d}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* METHOD */}
      <section id="method" className="bg-gradient-emerald text-primary-foreground py-24">
        <div className="container">
          <div className="text-center mb-16">
            <p className="text-accent-glow text-sm tracking-widest mb-3">المنهج</p>
            <h2 className="font-display text-4xl md:text-5xl mb-4">من الآية... إلى الفلاح</h2>
            <p className="text-primary-foreground/70 max-w-2xl mx-auto">أربع خطوات تُحوّل الوحي إلى سلوكٍ وأثرٍ ومآلٍ كريم.</p>
          </div>
          <div className="grid md:grid-cols-4 gap-6">
            {methodSteps.map((s) => (
              <div key={s.n} className="relative p-7 rounded-2xl bg-primary-foreground/5 border border-primary-foreground/10 backdrop-blur-sm hover:bg-primary-foreground/10 transition-smooth">
                <span className="font-display text-5xl text-gradient-gold opacity-90">{s.n}</span>
                <h3 className="font-display text-2xl mt-3 mb-2">{s.title}</h3>
                <p className="text-primary-foreground/70 text-sm leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* DOMAINS */}
      <section id="domains" className="container py-24">
        <div className="text-center mb-16">
          <p className="text-accent text-sm tracking-widest mb-3">المجالات الثمانية</p>
          <h2 className="font-display text-4xl md:text-5xl text-primary mb-4">رحلة الحياة المتكاملة</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">ثمانية مجالات تُغطّي الإنسان كلّه: قلبه، جسده، عقله، عمله، ماله، أسرته، أمّته، وابتلاءاته.</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
          {domains.map((d) => (
            <Card key={d.id} className="group p-6 bg-gradient-card border-border/60 hover:shadow-elegant hover:-translate-y-1 transition-smooth cursor-default">
              <div className="flex items-start justify-between mb-4">
                <div className="w-11 h-11 rounded-lg bg-primary/10 flex items-center justify-center font-display text-primary text-lg">
                  {d.id.toString().padStart(2, "0")}
                </div>
                <BookOpen className="w-5 h-5 text-accent opacity-60 group-hover:opacity-100 transition-smooth" />
              </div>
              <h3 className="font-display text-xl text-primary mb-1">{d.title}</h3>
              <p className="text-xs text-accent mb-3">{d.subtitle}</p>
              <p className="font-quran text-sm text-primary/70 mb-3 leading-loose">﴿ {d.quote} ﴾</p>
              <p className="text-sm text-muted-foreground leading-relaxed">{d.desc}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* PATHS */}
      <section id="paths" className="bg-secondary/40 py-24">
        <div className="container">
          <div className="text-center mb-16">
            <p className="text-accent text-sm tracking-widest mb-3">المسارات الحياتية</p>
            <h2 className="font-display text-4xl md:text-5xl text-primary mb-4">لكل عُمرٍ فلاحُه</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {paths.map((p) => (
              <Card key={p.id} className="p-8 bg-card shadow-soft hover:shadow-elegant transition-smooth border-t-4 border-t-accent">
                <p className="text-xs text-accent tracking-widest mb-2">{p.age}</p>
                <h3 className="font-display text-3xl text-primary mb-4">{p.title}</h3>
                <p className="font-quran text-base text-primary/70 mb-4 leading-loose">"{p.quote}"</p>
                <p className="text-muted-foreground leading-relaxed">{p.focus}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="container py-24">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-hero p-12 md:p-20 text-center shadow-elegant">
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: `url(${heroPattern})`, backgroundSize: "cover" }} aria-hidden />
          <div className="relative">
            <h2 className="font-display text-4xl md:text-5xl text-primary-foreground mb-5">ابدأ رحلتك نحو الفلاح اليوم</h2>
            <p className="text-primary-foreground/70 text-lg max-w-2xl mx-auto mb-8">
              قياسٌ أسبوعي، خططٌ يومية، وأدواتٌ عملية تُترجم القرآن إلى سلوكٍ وأثر.
            </p>
            <Button asChild size="lg" className="bg-gradient-gold text-accent-foreground hover:opacity-90 shadow-gold text-base px-10">
              <Link to="/app">ادخل التطبيق <ArrowLeft className="mr-2 w-4 h-4" /></Link>
            </Button>
          </div>
        </div>
      </section>

      <footer className="border-t border-border/60 py-10">
        <div className="container text-center text-sm text-muted-foreground">
          <p className="font-quran text-base text-primary mb-2">القرآن... هداية تُعاش، وسلوك يُنجز، وفلاح لا ينقطع</p>
          <p>© {new Date().getFullYear()} منهج الفلاح — وقفٌ معرفي رقمي</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
