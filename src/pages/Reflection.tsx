import { useState } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { Navbar } from "@/components/falah/Navbar";
import { SiteFooter } from "@/components/falah/SiteFooter";
import { OrnamentalDivider } from "@/components/falah/OrnamentalDivider";
import { JourneyProgress } from "@/components/falah/JourneyProgress";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { useAyahById } from "@/hooks/useAyahById";
import { useCreateReflection } from "@/hooks/useCreateReflection";
import { toast } from "sonner";
import { ArrowRight } from "lucide-react";
import { ShareJourneyCard } from "@/components/falah/ShareJourneyCard";

const ReflectionPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const actionId = searchParams.get("action");
  const verseId = searchParams.get("verse") ?? "";
  const domainCode = searchParams.get("domain") ?? "heart";
  const intentCode = searchParams.get("intent") ?? "falah";

  const { data: ayah } = useAyahById(verseId || undefined);
  const createReflection = useCreateReflection();

  const [body, setBody] = useState("");
  const [clarity, setClarity] = useState(5);
  const [difficulty, setDifficulty] = useState(5);

  const handleSubmit = async () => {
    if (body.trim().length < 10) {
      toast.error("اكتب تفكرًا صادقًا (10 أحرف على الأقل)");
      return;
    }
    if (!verseId) {
      toast.error("الآية غير معروفة");
      return;
    }
    try {
      await createReflection.mutateAsync({
        verse_id: verseId,
        domain_code: domainCode,
        intent_code: intentCode,
        body: body.trim(),
        action_id: actionId,
        clarity_score: clarity,
        difficulty_score: difficulty,
      });
      toast.success("تم حفظ التفكر");
      navigate("/progress");
    } catch (e: any) {
      toast.error(e?.message ?? "تعذّر حفظ التفكر");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background" dir="rtl">
      <Navbar />
      <JourneyProgress
        currentStep={6}
        context={{ intent: intentCode, domain: domainCode, verse: verseId, action: actionId ?? undefined }}
      />
      <main className="flex-1 page-enter">
        <section className="container max-w-3xl py-16 md:py-20">
          <Link
            to={verseId ? `/ayah/${verseId}?intent=${intentCode}&domain=${domainCode}` : `/ayat?intent=${intentCode}&domain=${domainCode}`}
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-smooth mb-10"
          >
            <ArrowRight className="w-4 h-4" /> رجوع
          </Link>
          <header className="text-center mb-8 space-y-3">
            <p className="text-caption text-accent">الخطوة الخامسة</p>
            <h1 className="text-display text-primary">تفكر</h1>
            <p className="text-body-lg text-muted-foreground">
              ما الذي تحرّك في قلبك؟ ما الذي صعب؟ ما الذي تغيّر؟
            </p>
          </header>

          {ayah && (
            <div className="card-sacred rounded-xl p-8 text-center mb-8">
              <p className="text-caption text-accent mb-4">
                {ayah.surah_name_ar ?? `سورة ${ayah.surah_number}`} • {ayah.verse_number}
              </p>
              <p className="text-quran leading-loose line-clamp-3">﴿ {ayah.text_ar} ﴾</p>
            </div>
          )}

          <OrnamentalDivider />

          <div className="card-elevated rounded-xl p-8 space-y-6">
            <div className="space-y-2">
              <Label htmlFor="reflection-body">تفكرك</Label>
              <Textarea
                id="reflection-body"
                value={body}
                onChange={(e) => setBody(e.target.value)}
                rows={8}
                placeholder="اكتب بصدق وبدون تجميل. هذه مساحتك الخاصة."
              />
              <p className="text-xs text-muted-foreground">{body.length} حرفًا</p>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">الوضوح</span>
                <span className="text-accent font-medium">{clarity}/10</span>
              </div>
              <Slider value={[clarity]} min={1} max={10} step={1} onValueChange={(v) => setClarity(v[0])} />
            </div>

            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">صعوبة التطبيق</span>
                <span className="text-accent font-medium">{difficulty}/10</span>
              </div>
              <Slider value={[difficulty]} min={1} max={10} step={1} onValueChange={(v) => setDifficulty(v[0])} />
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                onClick={handleSubmit}
                disabled={createReflection.isPending}
                size="lg"
                className="flex-1 bg-gradient-emerald text-primary-foreground shadow-elegant"
              >
                {createReflection.isPending ? "جارٍ الحفظ..." : "احفظ التفكر"}
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link to="/progress">تخطٍّ</Link>
              </Button>
            </div>
          </div>

          <div className="mt-12">
            <ShareJourneyCard />
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
};

export default ReflectionPage;