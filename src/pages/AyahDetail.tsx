import { useState } from "react";
import { useParams, useSearchParams, useNavigate, Link } from "react-router-dom";
import { Navbar } from "@/components/falah/Navbar";
import { SiteFooter } from "@/components/falah/SiteFooter";
import { OrnamentalDivider } from "@/components/falah/OrnamentalDivider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { useAyahById } from "@/hooks/useAyahById";
import { useCreateAction } from "@/hooks/useCreateAction";
import { toast } from "sonner";
import { ArrowRight } from "lucide-react";

const AyahDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const intentCode = searchParams.get("intent") ?? "falah";
  const domainCode = searchParams.get("domain") ?? "heart";

  const { data: ayah, isLoading } = useAyahById(id);
  const createAction = useCreateAction();

  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");

  const handleCommit = async () => {
    if (!title.trim()) {
      toast.error("اكتب عنوانًا قصيرًا للسلوك الذي تلتزم به");
      return;
    }
    if (!id) return;
    try {
      const action = await createAction.mutateAsync({
        verse_id: id,
        domain_code: domainCode,
        intent_code: intentCode,
        title: title.trim(),
        body: body.trim() || undefined,
      });
      toast.success("تم الالتزام بالسلوك");
      navigate(
        `/reflection?action=${action.id}&verse=${id}&domain=${domainCode}&intent=${intentCode}`,
      );
    } catch (e: any) {
      toast.error(e?.message ?? "تعذّر حفظ السلوك");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background" dir="rtl">
      <Navbar />
      <main className="flex-1 page-enter">
        <section className="container max-w-3xl py-16 md:py-20">
          <header className="mb-12">
            <Link
              to={`/ayat?intent=${intentCode}&domain=${domainCode}`}
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-smooth"
            >
              <ArrowRight className="w-4 h-4" /> عودة إلى الآيات
            </Link>
          </header>

          {isLoading || !ayah ? (
            <div className="space-y-6">
              <Skeleton className="h-40 rounded-xl" />
              <Skeleton className="h-24 rounded-xl" />
            </div>
          ) : (
            <>
              <div className="card-sacred rounded-xl p-10 md:p-14 text-center">
                <p className="text-caption text-accent mb-6">
                  {ayah.surah_name_ar ?? `سورة ${ayah.surah_number}`} • آية {ayah.verse_number}
                </p>
                <p className="text-quran leading-loose">﴿ {ayah.text_ar} ﴾</p>
              </div>

              <OrnamentalDivider />

              <div className="card-rest rounded-xl p-8 space-y-3">
                <p className="text-caption text-accent">المعنى</p>
                <p className="text-body text-muted-foreground italic">
                  {ayah.meaning_ar ??
                    "المعنى التفصيلي قيد الإعداد من قِبَل فريق المحتوى."}
                </p>
              </div>

              <div className="card-rest rounded-xl p-8 mt-6 space-y-3">
                <p className="text-caption text-accent">الصلة بحياتك اليوم</p>
                <p className="text-body text-muted-foreground italic">
                  {ayah.contemporary_relevance_ar ??
                    "اقرأ الآية بقلب حاضر، ثم اسأل نفسك: ما السلوك الواحد الذي يمكنني تطبيقه اليوم؟"}
                </p>
              </div>

              <OrnamentalDivider />

              <section className="card-elevated rounded-xl p-8 space-y-5">
                <header className="space-y-1">
                  <p className="text-caption text-accent">الخطوة الرابعة</p>
                  <h2 className="text-h2 text-primary">التزم بسلوك واحد اليوم</h2>
                  <p className="text-body text-muted-foreground">
                    حوّل هذه الآية إلى فعل ملموس. ابدأ صغيرًا، ابدأ صادقًا.
                  </p>
                </header>

                <div className="space-y-2">
                  <Label htmlFor="action-title">السلوك</Label>
                  <Input
                    id="action-title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="مثال: سأقرأ ورد الصباح قبل الانشغال بهاتفي"
                    maxLength={140}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="action-body">تفاصيل (اختياري)</Label>
                  <Textarea
                    id="action-body"
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                    rows={3}
                    placeholder="متى؟ أين؟ كيف ستذكّر نفسك؟"
                  />
                </div>

                <Button
                  onClick={handleCommit}
                  disabled={createAction.isPending}
                  size="lg"
                  className="w-full bg-gradient-emerald text-primary-foreground shadow-elegant"
                >
                  {createAction.isPending ? "جارٍ الحفظ..." : "ألتزم بهذا السلوك"}
                </Button>
              </section>
            </>
          )}
        </section>
      </main>
      <SiteFooter />
    </div>
  );
};

export default AyahDetailPage;