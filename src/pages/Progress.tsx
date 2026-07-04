import { Link } from "react-router-dom";
import { Navbar } from "@/components/falah/Navbar";
import { SiteFooter } from "@/components/falah/SiteFooter";
import { OrnamentalDivider } from "@/components/falah/OrnamentalDivider";
import { JourneyProgress } from "@/components/falah/JourneyProgress";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useUserProgress } from "@/hooks/useUserProgress";
import { useRecentActivity } from "@/hooks/useRecentActivity";
import { useDomains } from "@/hooks/useDomains";
import { useUserProfile } from "@/hooks/useUserProfile";
import { BookOpenCheck, Heart, ArrowRight } from "lucide-react";

const ProgressPage = () => {
  const { data: progress, isLoading } = useUserProgress();
  const { data: activity } = useRecentActivity(12);
  const { data: domains } = useDomains();
  const { data: profile, isLoading: profileLoading } = useUserProfile();
  const domainLabel = (code: string) =>
    domains?.find((d) => d.code === code)?.label_ar ?? code;

  return (
    <div className="min-h-screen flex flex-col bg-background" dir="rtl">
      <Navbar />
      <JourneyProgress currentStep={7} />
      <main className="flex-1 page-enter">
        <section className="container max-w-5xl py-16 md:py-20">
          <Link
            to="/reflection"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-smooth mb-8"
          >
            <ArrowRight className="w-4 h-4" /> رجوع
          </Link>
          <header className="text-center mb-10 space-y-3">
            <p className="text-caption text-accent">الخطوة السادسة</p>
            <h1 className="text-display text-primary">رحلتك</h1>
            <p className="text-body-lg text-muted-foreground">
              نموّك القرآني — هادئًا، صادقًا، متّسقًا.
            </p>
          </header>

          <OrnamentalDivider />

          {!profileLoading && !profile && (
            <div className="card-rest rounded-xl px-5 py-4 mt-8 mb-2 flex items-center justify-between gap-4">
              <p className="text-body text-muted-foreground">
                أكمل ملفك الشخصي ليكون منهج الفلاح أقرب إليك.
              </p>
              <Button asChild variant="outline" className="shrink-0">
                <Link to="/onboarding">أكمل ملفك</Link>
              </Button>
            </div>
          )}

          {isLoading ? (
            <div className="grid md:grid-cols-3 gap-6">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-40 rounded-xl" />
              ))}
            </div>
          ) : (
            <div className="grid md:grid-cols-3 gap-6 mb-10">
              <div className="card-sacred rounded-xl p-8 text-center">
                <p className="text-caption text-accent mb-3">مؤشّر الفلاح</p>
                <p className="font-display text-6xl text-gradient-gold leading-none">
                  {progress?.falahIndex ?? 0}
                </p>
                <p className="text-xs text-muted-foreground mt-3">من 100</p>
              </div>
              <div className="card-rest rounded-xl p-8 text-center">
                <p className="text-caption text-accent mb-3">السلوكيات</p>
                <p className="font-display text-5xl text-primary leading-none">
                  {progress?.completedActions ?? 0}
                  <span className="text-2xl text-muted-foreground">/{progress?.totalActions ?? 0}</span>
                </p>
                <p className="text-xs text-muted-foreground mt-3">المُنجزة من الملتزَم بها</p>
              </div>
              <div className="card-rest rounded-xl p-8 text-center">
                <p className="text-caption text-accent mb-3">التفكرات</p>
                <p className="font-display text-5xl text-primary leading-none">
                  {progress?.totalReflections ?? 0}
                </p>
                <p className="text-xs text-muted-foreground mt-3">
                  عبر {progress?.domainsTouched ?? 0} مجال
                </p>
              </div>
            </div>
          )}

          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h2 className="text-h2 text-primary mb-4">المجالات التي عشتها</h2>
              <div className="space-y-2">
                {(domains ?? []).map((d) => {
                  const stat = progress?.perDomain?.[d.code];
                  return (
                    <div
                      key={d.code}
                      className="card-rest rounded-lg px-5 py-4 flex items-center justify-between"
                    >
                      <span className="text-body text-primary">{d.label_ar}</span>
                      <span className="text-sm text-muted-foreground">
                        {stat ? `${stat.actions} سلوك • ${stat.reflections} تفكر` : "—"}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div>
              <h2 className="text-h2 text-primary mb-4">نشاطك الأخير</h2>
              {(activity ?? []).length === 0 ? (
                <div className="card-rest rounded-xl p-8 text-center space-y-4">
                  <p className="text-body text-muted-foreground">
                    لم تبدأ بعد. الرحلة تبدأ بنيّة.
                  </p>
                  <Button asChild className="bg-gradient-emerald text-primary-foreground">
                    <Link to="/intent">ابدأ الآن</Link>
                  </Button>
                </div>
              ) : (
                <div className="space-y-2">
                  {activity!.map((a) => (
                    <div
                      key={`${a.kind}-${a.id}`}
                      className="card-rest rounded-lg px-5 py-4 flex items-start gap-3"
                    >
                      {a.kind === "action" ? (
                        <BookOpenCheck className="w-4 h-4 text-accent mt-1 shrink-0" />
                      ) : (
                        <Heart className="w-4 h-4 text-accent mt-1 shrink-0" />
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-body text-primary truncate">{a.title}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {domainLabel(a.domain_code)} •{" "}
                          {new Date(a.created_at).toLocaleDateString("ar")}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
};

export default ProgressPage;