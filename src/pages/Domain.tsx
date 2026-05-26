import { useSearchParams, Link } from "react-router-dom";
import { Navbar } from "@/components/falah/Navbar";
import { SiteFooter } from "@/components/falah/SiteFooter";
import { DomainCard } from "@/components/falah/DomainCard";
import { OrnamentalDivider } from "@/components/falah/OrnamentalDivider";
import { useDomains, useDomainCoverage } from "@/hooks/useDomains";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowRight } from "lucide-react";

const DomainPage = () => {
  const [searchParams] = useSearchParams();
  const intent = searchParams.get("intent") ?? "falah";
  const { data: domains, isLoading, error } = useDomains();
  const { data: coverage } = useDomainCoverage();

  return (
    <div className="min-h-screen flex flex-col bg-background" dir="rtl">
      <Navbar />
      <main className="flex-1 page-enter">
        <section className="container max-w-6xl py-16 md:py-24">
          <Link
            to="/intent"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-smooth mb-10"
          >
            <ArrowRight className="w-4 h-4" /> رجوع
          </Link>
          <header className="text-center mb-12 space-y-4">
            <p className="text-caption text-accent">الخطوة الثانية</p>
            <h1 className="text-display text-primary">
              أي جانب من حياتك تريد أن يهديه القرآن اليوم؟
            </h1>
          </header>
          <OrnamentalDivider />

          {error && (
            <p className="text-center text-destructive">تعذّر تحميل المجالات. حاول لاحقًا.</p>
          )}

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            {isLoading
              ? Array.from({ length: 8 }).map((_, i) => <Skeleton key={i} className="h-48 rounded-xl" />)
              : (domains ?? []).map((domain) => (
                  <DomainCard
                    key={domain.code}
                    domain={domain}
                    intentCode={intent}
                    ayahCount={coverage ? (coverage[domain.code] ?? 0) : undefined}
                  />
                ))}
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
};

export default DomainPage;