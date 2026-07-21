import portrait from "@/assets/founder-father-portrait.jpg";
import { useLandingLang } from "@/i18n/landing/LandingLang";

export const LegacySection = () => {
  const { t } = useLandingLang();
  const l = t.legacy;
  return (
    <section id="legacy" className="relative bg-[hsl(40_30%_94%)] py-24 md:py-32 overflow-hidden">
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, hsl(var(--primary)) 1px, transparent 0)",
          backgroundSize: "32px 32px",
        }}
        aria-hidden
      />
      <div className="container relative">
        <div className="text-center mb-16 md:mb-24">
          <div className="inline-flex items-center gap-3 mb-6">
            <span className="h-px w-10 bg-accent/60" />
            <span className="font-sans2 text-[11px] tracking-[0.45em] uppercase text-accent">
              {l.eyebrow}
            </span>
            <span className="h-px w-10 bg-accent/60" />
          </div>
          <h2 className="font-editorial text-5xl md:text-7xl text-primary leading-[1.05] tracking-tight">
            {l.titleLead}
            <br />
            <em className="text-accent not-italic font-editorial italic">{l.titleEm}</em>
          </h2>
        </div>

        <div className="grid md:grid-cols-12 gap-10 md:gap-16 items-start">
          <div className="md:col-span-5 lg:col-span-5">
            <figure className="relative mx-auto max-w-sm">
              <div
                className="relative border-2 border-accent shadow-lg p-2 bg-[hsl(40_30%_96%)]"
                style={{ boxShadow: "0 24px 60px -20px hsl(118 18% 14% / 0.35)" }}
              >
                <div className="relative overflow-hidden aspect-[3/4]">
                  <img
                    src={portrait}
                    alt={l.name}
                    loading="lazy"
                    className="absolute inset-0 w-full h-full object-cover object-center block"
                  />
                  <div
                    className="absolute inset-x-0 bottom-0 h-1/3 pointer-events-none"
                    style={{
                      background:
                        "linear-gradient(to top, hsl(118 18% 14% / 0.35) 0%, transparent 100%)",
                    }}
                    aria-hidden
                  />
                </div>
              </div>
              <figcaption className="mt-10 text-center">
                <p className="font-sans2 text-[10px] tracking-[0.4em] uppercase text-muted-foreground mb-2">
                  {l.memoryLabel}
                </p>
                <p className="font-editorial text-2xl md:text-3xl text-primary" dir="rtl">
                  {l.name}
                </p>
                <p className="font-sans2 text-sm text-muted-foreground mt-1 tracking-widest">
                  {l.years}
                </p>
                <p className="font-quran text-xl md:text-2xl text-primary mt-6 leading-loose" dir="rtl">
                  ﴿ {l.verse} ﴾
                </p>
                {l.verseTranslation ? (
                  <p className="font-editorial italic text-sm text-muted-foreground mt-2">
                    {l.verseTranslation}
                  </p>
                ) : null}
              </figcaption>
            </figure>
          </div>

          <div className="md:col-span-7 lg:col-span-7 md:pt-6">
            <p className="font-editorial italic text-2xl md:text-3xl text-primary/85 leading-relaxed mb-8 first-letter:font-editorial first-letter:text-7xl first-letter:float-right first-letter:ml-0 first-letter:mr-0 first-letter:pl-3 first-letter:pt-1 first-letter:text-accent first-letter:leading-none">
              {l.lead}
            </p>

            <div className="space-y-6 text-[17px] leading-[2] text-foreground/80 font-body">
              <p>
                {l.p1Lead}
                <span className="font-semibold text-primary"> {l.p1Name}</span>
                {l.p1Rest}
              </p>
              <p>
                {l.p2Lead} <span className="text-accent font-semibold">{l.p2Brand}</span>
                {l.p2Rest}
              </p>
            </div>

            <blockquote className="mt-12 border-r-2 border-accent pr-6 py-2">
              <p className="font-editorial italic text-xl md:text-2xl text-primary leading-relaxed">
                {l.pullQuote}
              </p>
            </blockquote>

            <div className="mt-10 grid grid-cols-3 gap-4 md:gap-6">
              {l.badges.map((b, i) => (
                <div key={i} className="text-center border-t border-primary/15 pt-4">
                  <p className="font-editorial text-2xl md:text-3xl text-primary">{b.k}</p>
                  <p className="font-sans2 text-[11px] tracking-widest text-muted-foreground mt-1 uppercase">
                    {b.v}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
