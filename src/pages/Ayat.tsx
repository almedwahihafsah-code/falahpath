import { useSearchParams, Link } from "react-router-dom";
import { Navbar } from "@/components/falah/Navbar";
import { SiteFooter } from "@/components/falah/SiteFooter";
import { OrnamentalDivider } from "@/components/falah/OrnamentalDivider";
import { JourneyProgress } from "@/components/falah/JourneyProgress";
import { AyahCard } from "@/components/falah/AyahCard";
import { DomainJourneyPanel } from "@/components/falah/DomainJourneyPanel";
import { useAyatByDomain } from "@/hooks/useAyatByDomain";
import { useDomains } from "@/hooks/useDomains";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const AyatPage = () => {
  const [searchParams] = useSearchParams();
  const domainCode = searchParams.get("domain") ?? undefined;
  const intentCode = searchParams.get("intent") ?? undefined;

  const { data: ayat, isLoading, error } = useAyatByDomain(domainCode);
  const { data: domains } = useDomains();
  const domain = domains?.find((d) => d.code === domainCode);

  return (
    <div className="min-h-screen flex flex-col bg-background" dir="rtl">
      <Navbar />
      <JourneyProgress currentStep={3} context={{ intent: intentCode, domain: domainCode }} />
      <main className="flex-1 page-enter">
        <section className="container max-w-4xl py-16 md:py-24">
          <Link
            to={intentCode ? `/domain?intent=${intentCode}` : "/domain"}
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-smooth mb-10"
          >
            <ArrowRight className="w-4 h-4" /> رجوع
          </Link>
          <header className="text-center mb-10 space-y-4">
            <p className="text-caption text-accent">الخطوة الثالثة</p>
            <h1 className="text-display text-primary">
              {domain ? `آيات في مجال "${domain.label_ar}"` : "آيات لهذا المجال"}
            </h1>
            {domain?.subtitle_ar && (
              <p className="text-body-lg text-muted-foreground">{domain.subtitle_ar}</p>
            )}
          </header>
          <OrnamentalDivider />

          {error && (
            <p className="text-center text-destructive">تعذّر تحميل الآيات. حاول لاحقًا.</p>
          )}

          {isLoading ? (
            <div className="grid grid-cols-1 gap-6">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-44 rounded-xl" />
              ))}
            </div>
          ) : (ayat ?? []).length === 0 ? (
            <div className="space-y-8">
              {domainCode && (
                <DomainJourneyPanel
                  domainCode={domainCode}
                  intentCode={intentCode}
                  emphasized
                />
              )}
              <div className="text-center">
                <Button asChild variant="outline">
                  <Link to={intentCode ? `/domain?intent=${intentCode}` : "/domain"}>
                    استكشف مجالًا آخر
                  </Link>
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-10">
              {domainCode && (
                <DomainJourneyPanel domainCode={domainCode} intentCode={intentCode} />
              )}
              <div className="grid grid-cols-1 gap-6">
                {ayat!.map((a) => (
                  <AyahCard key={a.id} ayah={a} intentCode={intentCode} domainCode={domainCode} />
                ))}
              </div>
            </div>
          )}
        </section>
      </main>
      <SiteFooter />
    </div>
  );
};

export default AyatPage;