import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Instagram, Twitter, Youtube, Linkedin, Send } from "lucide-react";
import { useLandingLang } from "@/i18n/landing/LandingLang";

export const SiteFooter = () => {
  const { t, lang } = useLandingLang();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      toast({ title: t.footer.invalidEmail, description: t.footer.invalidEmailDesc });
      return;
    }
    setLoading(true);
    const { error } = await supabase
      .from("newsletter_subscribers")
      .insert({ email: email.trim().toLowerCase(), source: "footer", locale: lang });
    setLoading(false);
    if (error && error.code !== "23505") {
      toast({ title: t.footer.subFail, description: t.footer.subFailDesc });
      return;
    }
    toast({ title: t.footer.subOk, description: t.footer.subOkDesc });
    setEmail("");
  };

  const socials = [
    { icon: Instagram, href: "https://instagram.com", label: "Instagram" },
    { icon: Twitter, href: "https://twitter.com", label: "Twitter / X" },
    { icon: Youtube, href: "https://youtube.com", label: "YouTube" },
    { icon: Linkedin, href: "https://linkedin.com", label: "LinkedIn" },
  ];

  return (
    <footer className="relative w-full bg-[hsl(118_18%_10%)] text-primary-foreground">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent/60 to-transparent" />
      <div className="max-w-6xl mx-auto px-6 py-12 flex flex-col gap-8">
        {/* Newsletter */}
        <div className="max-w-3xl mx-auto text-center">
          <p className="font-sans2 text-[10px] tracking-[0.45em] uppercase text-accent mb-4">
            {t.footer.newsletterKicker}
          </p>
          <h3 className="font-editorial text-2xl sm:text-3xl md:text-4xl leading-tight mb-4">
            {t.footer.newsletterTitleLead}{" "}
            <em className="not-italic italic text-accent-glow">{t.footer.newsletterTitleEm}</em>
          </h3>
          <p className="text-sm text-primary-foreground/60 mb-6 leading-relaxed">
            {t.footer.newsletterSub}
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
              {loading ? "..." : t.footer.subscribe} <Send className="w-4 h-4" />
            </Button>
          </form>
        </div>

        {/* Grid */}
        <div className="grid md:grid-cols-12 gap-8 border-t border-primary-foreground/10 pt-8">
          <div className="md:col-span-5">
            <div className="flex items-center gap-3 mb-4">
              <img
                src="/falah_logo_transparent.png"
                alt="الفلاح"
                loading="lazy"
                decoding="async"
                className="h-16 w-auto object-contain"
              />
              <div className="flex flex-col items-start gap-1.5">
                <p className="font-editorial text-2xl leading-none">{t.footer.endowmentBrand}</p>
                <p className="font-sans2 text-[10px] tracking-[0.4em] uppercase text-primary-foreground/50">
                  {t.footer.endowmentTag}
                </p>
              </div>
            </div>
            <p className="font-quran text-base text-primary-foreground/85 leading-loose mb-4">
              ﴿ {t.footer.verse} ﴾
            </p>
            <p className="text-sm text-primary-foreground/55 leading-relaxed max-w-md">
              {t.footer.about}
            </p>
          </div>

          <div className="md:col-span-3">
            <p className="font-sans2 text-[10px] tracking-[0.4em] uppercase text-accent mb-4">
              {t.footer.quickLinks}
            </p>
            <ul className="space-y-2 text-sm">
              {t.footer.links.map((l) => (
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
            <p className="font-sans2 text-[10px] tracking-[0.4em] uppercase text-accent mb-4">
              {t.footer.operatedBy}
            </p>
            <p className="font-editorial text-2xl mb-1">{t.footer.brandLatin}</p>
            <p className="font-display text-base text-primary-foreground/80 mb-4">
              {t.footer.brandAr}
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

        <div className="border-t border-primary-foreground/10 pt-6 flex flex-col md:flex-row md:items-center md:justify-between gap-3 text-xs text-primary-foreground/45">
          <p>© {new Date().getFullYear()} {t.footer.rights}</p>
          <p className="font-sans2 tracking-widest uppercase">
            {t.footer.credit}
          </p>
        </div>
      </div>
    </footer>
  );
};