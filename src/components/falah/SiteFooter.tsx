import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { Instagram, Twitter, Youtube, Linkedin, Send } from "lucide-react";

export const SiteFooter = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      toast({ title: "بريد غير صالح", description: "يرجى إدخال بريد إلكتروني صحيح." });
      return;
    }
    setLoading(true);
    // graceful no-op: front-end only confirmation
    setTimeout(() => {
      toast({ title: "تم الاشتراك", description: "ستصلك تأمّلات الفلاح الأسبوعية قريبًا." });
      setEmail("");
      setLoading(false);
    }, 600);
  };

  const socials = [
    { icon: Instagram, href: "https://instagram.com", label: "Instagram" },
    { icon: Twitter, href: "https://twitter.com", label: "Twitter / X" },
    { icon: Youtube, href: "https://youtube.com", label: "YouTube" },
    { icon: Linkedin, href: "https://linkedin.com", label: "LinkedIn" },
  ];

  return (
    <footer className="relative bg-[hsl(118_18%_10%)] text-primary-foreground">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent/60 to-transparent" />
      <div className="container py-20 md:py-28">
        {/* Newsletter */}
        <div className="reveal max-w-3xl mx-auto text-center mb-20">
          <p className="font-sans2 text-[10px] tracking-[0.45em] uppercase text-accent mb-5">
            Newsletter · النشرة الأسبوعية
          </p>
          <h3 className="font-editorial text-3xl sm:text-4xl md:text-5xl leading-tight mb-5">
            تأمّلاتٌ في القرآن، <em className="not-italic italic text-accent-glow">إلى بريدك.</em>
          </h3>
          <p className="text-sm md:text-base text-primary-foreground/60 mb-8 leading-relaxed">
            رسالةٌ واحدة كلّ أسبوع: آيةٌ، تأمّلٌ، وخطوةٌ عملية نحو الفلاح.
          </p>
          <form
            onSubmit={onSubscribe}
            className="flex flex-col sm:flex-row gap-3 max-w-xl mx-auto"
          >
            <Input
              type="email"
              dir="ltr"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="h-12 bg-primary-foreground/5 border-primary-foreground/15 text-primary-foreground placeholder:text-primary-foreground/40 rounded-none focus-visible:ring-accent focus-visible:border-accent"
            />
            <Button
              type="submit"
              disabled={loading}
              className="btn-lux h-12 px-7 rounded-none bg-accent text-accent-foreground hover:bg-accent font-sans2 text-xs tracking-[0.35em] uppercase"
            >
              {loading ? "..." : "اشترك"} <Send className="w-4 h-4" />
            </Button>
          </form>
        </div>

        {/* Grid */}
        <div className="reveal grid md:grid-cols-12 gap-12 md:gap-10 pb-14 border-t border-primary-foreground/10 pt-14">
          <div className="md:col-span-5">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-11 h-11 rounded-sm bg-gradient-emerald flex items-center justify-center border border-accent/40">
                <span className="font-editorial text-xl text-primary-foreground">ف</span>
              </div>
              <div>
                <p className="font-editorial text-2xl leading-none">وقف الفلاح</p>
                <p className="font-sans2 text-[10px] tracking-[0.4em] uppercase text-accent mt-1">
                  A Perpetual Endowment
                </p>
              </div>
            </div>
            <p className="font-quran text-base text-primary-foreground/85 leading-loose mb-4">
              ﴿ قَدْ أَفْلَحَ مَن زَكَّاهَا ﴾
            </p>
            <p className="text-sm text-primary-foreground/55 leading-relaxed max-w-md">
              مشروع وقفي معرفي رقمي، مجاني للأفراد، صدقة جارية عن أرواح آبائنا وأمهاتنا
              من المسلمين أجمعين.
            </p>
          </div>

          <div className="md:col-span-3">
            <p className="font-sans2 text-[10px] tracking-[0.4em] uppercase text-accent mb-5">
              Quick Links
            </p>
            <ul className="space-y-3 text-sm">
              {[
                { to: "/#perspective", label: "المنظور" },
                { to: "/#method", label: "المنهج" },
                { to: "/#domains", label: "المجالات الثمانية" },
                { to: "/#legacy", label: "قصة الوفاء" },
                { to: "/#engagement", label: "تواصل معنا" },
              ].map((l) => (
                <li key={l.to}>
                  <a
                    href={l.to}
                    className="text-primary-foreground/70 hover:text-accent transition-smooth"
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-4">
            <p className="font-sans2 text-[10px] tracking-[0.4em] uppercase text-accent mb-5">
              Operated By
            </p>
            <p className="font-editorial text-2xl mb-1">Markets Movers</p>
            <p className="font-display text-base text-primary-foreground/80 mb-4">
              ماركتس موفرز للاستشارات
            </p>
            <div className="flex items-center gap-2">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="btn-lux w-10 h-10 inline-flex items-center justify-center border border-primary-foreground/15 text-primary-foreground/70 hover:text-accent hover:border-accent rounded-none"
                >
                  <s.icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-primary-foreground/10 pt-7 flex flex-col md:flex-row md:items-center md:justify-between gap-4 text-xs text-primary-foreground/45">
          <p>© {new Date().getFullYear()} منهج الفلاح — وقفٌ معرفي رقمي</p>
          <p className="font-sans2 tracking-widest uppercase">
            تطوير وإدارة: ماركتس موفرز للاستشارات
          </p>
        </div>
      </div>
    </footer>
  );
};