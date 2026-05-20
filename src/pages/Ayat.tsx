import { useSearchParams, Link } from "react-router-dom";
import { Navbar } from "@/components/falah/Navbar";
import { SiteFooter } from "@/components/falah/SiteFooter";
import { OrnamentalDivider } from "@/components/falah/OrnamentalDivider";
import { AyahCard } from "@/components/falah/AyahCard";
import { useAyatByDomain } from "@/hooks/useAyatByDomain";
import { useDomains } from "@/hooks/useDomains";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

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
      <main className="flex-1 page-enter">
        <section className="container max-w-4xl py-16 md:py-24">
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
            <div className="card-sacred rounded-xl p-12 text-center space-y-4">
              <p className="text-h2 text-primary">آيات هذا المجال قيد التصنيف</p>
              <p className="text-body text-muted-foreground">
                تعود قريبًا. جرّب مجالًا آخر.
              </p>
              <Button asChild variant="outline">
                <Link to={intentCode ? `/domain?intent=${intentCode}` : "/domain"}>
                  العودة إلى المجالات
                </Link>
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6">
              {ayat!.map((a) => (
                <AyahCard key={a.id} ayah={a} intentCode={intentCode} domainCode={domainCode} />
              ))}
            </div>
          )}
        </section>
      </main>
      <SiteFooter />
    </div>
  );
};

export default AyatPage;