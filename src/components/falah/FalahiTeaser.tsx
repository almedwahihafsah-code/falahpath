import { useState } from "react";
import { Bell, BookOpen, Compass } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { z } from "zod";
import { toast } from "sonner";

const emailSchema = z.string().trim().email().max(255);

const features = [
  {
    icon: Bell,
    title: "يُذكّرك",
    desc: "حين تشغلك الدنيا، يُذكّرك بآياتك والتزاماتك التي اخترتَها بنفسك.",
  },
  {
    icon: BookOpen,
    title: "يساعدك على التدبّر",
    desc: "يفتح لك بابًا بسؤالٍ لطيف، فيتحوّل التدبّر من عابرٍ إلى عميق.",
  },
  {
    icon: Compass,
    title: "يرافق رحلتك",
    desc: "يسير معك خطوةً بخطوة، يلاحظ نموّك، ويستبشر بتقدّمك في كل مجال.",
  },
];

export const FalahiTeaser = () => {
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = emailSchema.safeParse(email);
    if (!parsed.success) {
      toast.error("الرجاء إدخال بريد إلكتروني صحيح");
      return;
    }
    setSubmitting(true);
    const { error } = await supabase
      .from("newsletter_subscribers")
      .insert({ email: parsed.data.toLowerCase(), source: "falahi_waitlist", locale: "ar" });
    setSubmitting(false);

    // Treat duplicates (23505) the same as success
    if (error && error.code !== "23505") {
      toast.error("تعذّر الحفظ الآن، حاول لاحقًا");
      return;
    }
    setDone(true);
    toast.success("بارك الله فيك — سننبّهك حين يحين الوقت، بإذن الله.");
  };

  return (
    <section
      id="falahi"
      className="relative overflow-hidden py-24 md:py-32"
      style={{
        background:
          "linear-gradient(160deg, hsl(var(--primary)) 0%, hsl(155 45% 7%) 100%)",
      }}
    >
      {/* gold dot pattern */}
      <div
        className="absolute inset-0 opacity-[0.06] pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, hsl(var(--accent)) 1px, transparent 0)",
          backgroundSize: "32px 32px",
        }}
        aria-hidden
      />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at 50% 0%, hsl(var(--accent) / 0.12), transparent 65%)",
        }}
        aria-hidden
      />

      <div className="container relative text-center">
        {/* eyebrow */}
        <div className="inline-flex items-center gap-3 mb-6">
          <span className="h-px w-10 bg-accent/60" />
          <span className="font-sans2 text-[11px] tracking-[0.45em] uppercase text-accent font-medium">
            قريبًا في فلاح · COMING SOON
          </span>
          <span className="h-px w-10 bg-accent/60" />
        </div>

        {/* title */}
        <h2 className="font-editorial text-5xl sm:text-6xl md:text-7xl text-primary-foreground leading-[1] tracking-tight mb-4">
          <em className="not-italic italic text-gradient-gold">فلاحي</em>
        </h2>
        <p className="font-editorial italic text-lg md:text-2xl text-primary-foreground/75 mb-6">
          رفيقُك في رحلة الفلاح
        </p>

        {/* badge */}
        <div className="inline-flex items-center gap-2.5 border border-accent/50 px-4 py-1.5 mb-8 rounded-full bg-accent/5">
          <span className="relative flex h-2 w-2">
            <span className="absolute inset-0 rounded-full bg-accent animate-ping opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
          </span>
          <span className="font-sans2 text-xs tracking-[0.25em] uppercase text-accent">
            قريبًا بإذن الله
          </span>
        </div>

        {/* intro */}
        <p className="max-w-2xl mx-auto text-primary-foreground/70 leading-loose text-base md:text-lg mb-10">
          رفيقٌ رقميٌّ يُعينك على عيش القرآن في تفاصيل يومك. لا يَعِظُك من بعيد، بل يسير معك — يُذكّرك بعهدك، ويساعدك على التدبّر، ويستبشر بكل خطوة تخطوها.
        </p>

        {/* divider */}
        <div className="flex items-center justify-center gap-3 mb-14" aria-hidden>
          <span className="h-px w-12 bg-accent/40" />
          <span className="w-1.5 h-1.5 rotate-45 bg-accent/70" />
          <span className="h-px w-12 bg-accent/40" />
        </div>

        {/* feature cards */}
        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto mb-16">
          {features.map((f, i) => (
            <div
              key={i}
              className="group p-8 border border-accent/20 hover:border-accent/50 hover:-translate-y-1 transition-smooth shadow-md hover:shadow-elegant text-center"
              style={{ background: "hsl(155 35% 12% / 0.6)" }}
            >
              <div className="mx-auto mb-5 flex items-center justify-center w-14 h-14 rounded-full border border-accent/50 bg-accent/10">
                <f.icon className="w-6 h-6 text-accent" strokeWidth={1.5} />
              </div>
              <h3 className="font-editorial text-2xl text-primary-foreground mb-3">
                {f.title}
              </h3>
              <p className="text-sm text-primary-foreground/65 leading-loose">
                {f.desc}
              </p>
            </div>
          ))}
        </div>

        {/* waitlist box */}
        <div
          className="max-w-2xl mx-auto p-8 md:p-10 border border-accent/30 rounded-lg"
          style={{ background: "hsl(155 45% 6% / 0.55)" }}
        >
          <h3 className="font-editorial text-2xl md:text-3xl text-primary-foreground mb-3">
            كن أوّل من يلتقي <em className="not-italic italic text-accent">فلاحي</em>
          </h3>
          <p className="text-primary-foreground/65 text-sm md:text-base leading-loose mb-6">
            اترك بريدك، ونُبشّرك حين يصبح فلاحي جاهزًا — بإذن الله.
          </p>

          {done ? (
            <p className="font-editorial italic text-accent text-lg py-3">
              بارك الله فيك — سننبّهك حين يحين الوقت، بإذن الله.
            </p>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="flex flex-col sm:flex-row gap-3"
              dir="ltr"
            >
              <Input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                maxLength={255}
                className="bg-background/10 border-accent/30 text-primary-foreground placeholder:text-primary-foreground/40 h-12 rounded-none"
              />
              <Button
                type="submit"
                disabled={submitting}
                className="bg-gradient-gold text-accent-foreground hover:opacity-90 shadow-gold h-12 px-8 rounded-none font-sans2 tracking-[0.2em] uppercase text-xs whitespace-nowrap"
              >
                {submitting ? "..." : "نبّهني عند الإطلاق"}
              </Button>
            </form>
          )}
        </div>

        {/* footer line */}
        <p className="mt-10 font-sans2 text-[11px] tracking-[0.35em] uppercase text-primary-foreground/45">
          فلاحي مجانيٌّ، جزءٌ من وقف الفلاح · من الوحي… إلى الحياة
        </p>
      </div>
    </section>
  );
};