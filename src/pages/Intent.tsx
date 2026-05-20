import { Navbar } from "@/components/falah/Navbar";
import { SiteFooter } from "@/components/falah/SiteFooter";
import { IntentCard } from "@/components/falah/IntentCard";
import { OrnamentalDivider } from "@/components/falah/OrnamentalDivider";
import { useIntents } from "@/hooks/useIntents";
import { Skeleton } from "@/components/ui/skeleton";

const IntentPage = () => {
  const { data: intents, isLoading, error } = useIntents();

  const handleSelect = (code: string) => {
    try { sessionStorage.setItem("current_intent", code); } catch {}
  };

  return (
    <div className="min-h-screen flex flex-col bg-background" dir="rtl">
      <Navbar />
      <main className="flex-1 page-enter">
        <section className="container max-w-5xl py-16 md:py-24">
          <header className="text-center mb-12 space-y-4">
            <p className="text-caption text-accent">الخطوة الأولى</p>
            <h1 className="text-display text-primary">ما الذي تطلبه اليوم؟</h1>
            <p className="text-body-lg text-muted-foreground max-w-2xl mx-auto">
              اختر النيّة التي تقود قلبك في هذه اللحظة
            </p>
          </header>
          <OrnamentalDivider />

          {error && (
            <p className="text-center text-destructive">تعذّر تحميل النيّات. حاول لاحقًا.</p>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {isLoading
              ? Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-56 rounded-xl" />)
              : (intents ?? []).map((intent) => (
                  <IntentCard key={intent.code} intent={intent} onSelect={handleSelect} />
                ))}
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
};

export default IntentPage;