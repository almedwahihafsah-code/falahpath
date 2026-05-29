import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import {
  ArrowRight, Loader2, Sprout, TreeDeciduous, Moon, Camera,
  Heart, Activity, Sparkles, Briefcase, Coins, Users, Globe2, Mountain,
  Sun, Feather, Compass, Anchor, HandHeart, Sunrise,
} from "lucide-react";

type AgeBracket = "youth" | "maturity" | "harvest";

const AGE_OPTIONS: { code: AgeBracket; title: string; range: string; Icon: typeof Sprout }[] = [
  { code: "youth", title: "شباب", range: "18 – 35", Icon: Sprout },
  { code: "maturity", title: "نضج", range: "35 – 55", Icon: TreeDeciduous },
  { code: "harvest", title: "حصاد", range: "55+", Icon: Moon },
];

const DOMAIN_OPTIONS = [
  { code: "heart", label: "القلب والروح", Icon: Heart },
  { code: "body", label: "الجسد والصحة", Icon: Activity },
  { code: "mind", label: "العقل والمعرفة", Icon: Sparkles },
  { code: "work", label: "العمل والإنجاز", Icon: Briefcase },
  { code: "wealth", label: "المال والموارد", Icon: Coins },
  { code: "family", label: "الأسرة والعلاقات", Icon: Users },
  { code: "ummah", label: "المجتمع والأمة", Icon: Globe2 },
  { code: "trials", label: "الابتلاءات", Icon: Mountain },
];

const INTENT_OPTIONS = [
  { code: "sakinah", label: "مطمئن", Icon: Feather },
  { code: "hidayah", label: "تائه", Icon: Compass },
  { code: "shukr", label: "ممتنّ", Icon: HandHeart },
  { code: "inabah", label: "منكسر", Icon: Sunrise },
  { code: "falah", label: "عازم", Icon: Sun },
  { code: "thabat", label: "متزعزع", Icon: Anchor },
];

const TOTAL_STEPS = 5;

const ProgressDots = ({ step }: { step: number }) => (
  <div className="flex items-center justify-center gap-2 mb-10" aria-label={`الخطوة ${step} من ${TOTAL_STEPS}`}>
    {Array.from({ length: TOTAL_STEPS }).map((_, i) => {
      const active = i < step;
      const current = i === step - 1;
      return (
        <span
          key={i}
          className={`h-1.5 rounded-full transition-all duration-500 ${
            current ? "w-8 bg-accent" : active ? "w-5 bg-accent/60" : "w-5 bg-border"
          }`}
        />
      );
    })}
  </div>
);

const Eyebrow = ({ children }: { children: React.ReactNode }) => (
  <p className="text-caption text-accent tracking-widest mb-3 text-center uppercase">{children}</p>
);

const Title = ({ children }: { children: React.ReactNode }) => (
  <h1 className="font-display text-3xl md:text-4xl text-primary text-center leading-snug">{children}</h1>
);

const Whisper = ({ children }: { children: React.ReactNode }) => (
  <p className="text-body text-muted-foreground text-center mt-3">{children}</p>
);

const Onboarding = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [welcoming, setWelcoming] = useState(false);

  // form state
  const [ageBracket, setAgeBracket] = useState<AgeBracket | null>(null);
  const [domains, setDomains] = useState<string[]>([]);
  const [intentCode, setIntentCode] = useState<string | null>(null);
  const [challenge, setChallenge] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Auth gate + skip if profile already exists
  useEffect(() => {
    if (loading) return;
    if (!user) { navigate("/auth", { replace: true }); return; }
    (async () => {
      const { data } = await supabase
        .from("user_profiles" as any)
        .select("user_id,initial_intent_code")
        .eq("user_id", user.id)
        .maybeSingle();
      if (data) {
        const ic = (data as any).initial_intent_code;
        navigate(ic ? `/intent?intent=${ic}` : "/intent", { replace: true });
      }
    })();
  }, [user, loading, navigate]);

  const toggleDomain = (code: string) => {
    setDomains((prev) => {
      if (prev.includes(code)) return prev.filter((c) => c !== code);
      if (prev.length >= 2) return [prev[1], code]; // drop oldest
      return [...prev, code];
    });
  };

  const handleAvatarPick = (file: File | null) => {
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      toast.error("الحدّ الأقصى للصورة 2 ميغابايت");
      return;
    }
    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  };

  const canNext = useMemo(() => {
    switch (step) {
      case 1: return !!ageBracket;
      case 2: return domains.length === 2;
      case 3: return !!intentCode;
      case 4: return true; // optional
      case 5: return displayName.trim().length >= 2;
      default: return false;
    }
  }, [step, ageBracket, domains, intentCode, displayName]);

  const next = () => setStep((s) => Math.min(TOTAL_STEPS, s + 1));
  const back = () => setStep((s) => Math.max(1, s - 1));

  const complete = async () => {
    if (!user) return;
    if (!displayName.trim()) { toast.error("اكتب اسمك"); return; }
    setSubmitting(true);
    try {
      let avatar_url: string | null = null;
      if (avatarFile) {
        const ext = avatarFile.name.split(".").pop()?.toLowerCase() || "jpg";
        const path = `${user.id}/avatar.${ext}`;
        const { error: upErr } = await supabase.storage
          .from("avatars")
          .upload(path, avatarFile, { upsert: true, contentType: avatarFile.type });
        if (upErr) throw upErr;
        const { data: pub } = supabase.storage.from("avatars").getPublicUrl(path);
        avatar_url = pub.publicUrl;
      }

      const { error: pErr } = await supabase.from("user_profiles" as any).insert({
        user_id: user.id,
        display_name: displayName.trim(),
        avatar_url,
        age_bracket: ageBracket,
        preferred_domains: domains,
        initial_intent_code: intentCode,
        initial_challenge: challenge.trim() || null,
        locale: "ar",
      });
      if (pErr) throw pErr;

      await supabase.from("user_profile_signals" as any).insert({ user_id: user.id });

      setWelcoming(true);
      setTimeout(() => {
        navigate(`/intent?intent=${intentCode}`, { replace: true });
      }, 2000);
    } catch (err: any) {
      toast.error(err?.message || "تعذّر حفظ بياناتك");
      setSubmitting(false);
    }
  };

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-accent" />
      </div>
    );
  }

  if (welcoming) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-6" dir="rtl">
        <div className="text-center page-enter">
          <p className="text-caption text-accent tracking-widest mb-4">بِسْمِ اللَّهِ</p>
          <h2 className="font-display text-3xl md:text-4xl text-primary">
            أهلًا {displayName.trim()}. رحلتك تبدأ الآن 🌿
          </h2>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col" dir="rtl">
      <main className="flex-1 flex flex-col">
        <div className="container max-w-2xl py-10 md:py-16 flex-1 flex flex-col">
          {step > 1 && (
            <button
              type="button"
              onClick={back}
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-smooth mb-8 self-start"
            >
              <ArrowRight className="w-4 h-4" /> رجوع
            </button>
          )}
          {step === 1 && <div className="mb-8" />}

          <ProgressDots step={step} />

          <div className="flex-1 page-enter" key={step}>
            {step === 1 && (
              <section>
                <Eyebrow>بداية رحلتك · STEP 1 OF 5</Eyebrow>
                <Title>في أيّ مرحلة من العمر أنت؟</Title>
                <Whisper>نُلائم نبرة الرحلة وأمثلتها لحياتك.</Whisper>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-10">
                  {AGE_OPTIONS.map(({ code, title, range, Icon }) => {
                    const active = ageBracket === code;
                    return (
                      <button
                        key={code}
                        type="button"
                        onClick={() => setAgeBracket(code)}
                        className={`card-rest card-lift rounded-xl p-8 flex flex-col items-center gap-4 text-center transition-all ${
                          active ? "ring-2 ring-accent border-accent/50 shadow-[var(--shadow-gold)]" : ""
                        }`}
                      >
                        <Icon className="w-10 h-10 text-accent" strokeWidth={1.5} />
                        <div>
                          <h3 className="text-h2 text-primary">{title}</h3>
                          <p className="text-caption text-muted-foreground mt-1">{range}</p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </section>
            )}

            {step === 2 && (
              <section>
                <Eyebrow>STEP 2 OF 5</Eyebrow>
                <Title>ما هما المجالان الأهمّ في حياتك الآن؟</Title>
                <Whisper>اختر اثنين — سنبدأ منهما.</Whisper>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-10">
                  {DOMAIN_OPTIONS.map(({ code, label, Icon }) => {
                    const active = domains.includes(code);
                    return (
                      <button
                        key={code}
                        type="button"
                        onClick={() => toggleDomain(code)}
                        className={`card-rest card-lift rounded-xl p-5 flex flex-col items-center gap-3 text-center transition-all ${
                          active ? "ring-2 ring-accent border-accent/50 shadow-[var(--shadow-gold)]" : ""
                        }`}
                      >
                        <Icon className="w-8 h-8 text-accent" strokeWidth={1.5} />
                        <span className="text-body text-primary leading-tight">{label}</span>
                      </button>
                    );
                  })}
                </div>
                <p className="text-center text-xs text-muted-foreground mt-6">
                  {domains.length}/2 مختار
                </p>
              </section>
            )}

            {step === 3 && (
              <section>
                <Eyebrow>STEP 3 OF 5</Eyebrow>
                <Title>كيف حالك القلبي اليوم؟</Title>
                <Whisper>نبدأ رحلتك بنيّة تناسب لحظتك.</Whisper>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-10">
                  {INTENT_OPTIONS.map(({ code, label, Icon }) => {
                    const active = intentCode === code;
                    return (
                      <button
                        key={code}
                        type="button"
                        onClick={() => setIntentCode(code)}
                        className={`card-rest card-lift rounded-xl p-6 flex flex-col items-center gap-3 text-center transition-all ${
                          active ? "ring-2 ring-accent border-accent/50 shadow-[var(--shadow-gold)]" : ""
                        }`}
                      >
                        <Icon className="w-8 h-8 text-accent" strokeWidth={1.5} />
                        <span className="text-body text-primary">{label}</span>
                      </button>
                    );
                  })}
                </div>
              </section>
            )}

            {step === 4 && (
              <section>
                <Eyebrow>STEP 4 OF 5 · اختيارية</Eyebrow>
                <Title>ما أكبر تحدٍّ تواجهه الآن؟</Title>
                <Whisper>هذا بينك وبين الله — لن يطّلع عليه أحد. اكتب أو تخطَّ.</Whisper>
                <div className="mt-10 space-y-2">
                  <Textarea
                    value={challenge}
                    onChange={(e) => setChallenge(e.target.value.slice(0, 140))}
                    maxLength={140}
                    rows={4}
                    placeholder="اكتب بحرّية…"
                    className="bg-card/60 border-border resize-none text-body"
                  />
                  <div className="flex justify-end text-xs text-muted-foreground">
                    {challenge.length}/140
                  </div>
                </div>
              </section>
            )}

            {step === 5 && (
              <section>
                <Eyebrow>STEP 5 OF 5</Eyebrow>
                <Title>بأي اسم نناديك؟</Title>
                <Whisper>اسمك الأول يكفي. وصورتك اختيارية.</Whisper>
                <div className="mt-10 space-y-8 max-w-md mx-auto">
                  <div className="flex flex-col items-center gap-3">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="relative w-28 h-28 rounded-full bg-secondary border-2 border-dashed border-accent/40 flex items-center justify-center overflow-hidden hover:border-accent transition-smooth"
                    >
                      {avatarPreview ? (
                        <img src={avatarPreview} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <Camera className="w-7 h-7 text-accent" strokeWidth={1.5} />
                      )}
                    </button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleAvatarPick(e.target.files?.[0] ?? null)}
                    />
                    <p className="text-xs text-muted-foreground">صورة اختيارية · حتى 2MB</p>
                  </div>
                  <div>
                    <Label htmlFor="display_name" className="text-primary mb-2 block">الاسم</Label>
                    <Input
                      id="display_name"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value.slice(0, 60))}
                      placeholder="اسمك الأول"
                      className="bg-card/60"
                    />
                  </div>
                </div>
              </section>
            )}
          </div>

          <div className="mt-12 pt-6 border-t border-border/50 flex items-center justify-between gap-4">
            {step === 4 ? (
              <Button
                type="button"
                variant="ghost"
                onClick={() => { setChallenge(""); next(); }}
                className="text-muted-foreground hover:text-primary"
              >
                تخطَّ
              </Button>
            ) : <span />}

            {step < TOTAL_STEPS ? (
              <Button
                type="button"
                onClick={next}
                disabled={!canNext}
                className="bg-gradient-emerald text-primary-foreground shadow-soft hover:opacity-90 px-8"
              >
                التالي
              </Button>
            ) : (
              <Button
                type="button"
                onClick={complete}
                disabled={!canNext || submitting}
                className="bg-gradient-emerald text-primary-foreground shadow-soft hover:opacity-90 px-8"
              >
                {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : "ابدأ رحلتي"}
              </Button>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Onboarding;