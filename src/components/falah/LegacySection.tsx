import portrait from "@/assets/founder-father-portrait.jpg";

export const LegacySection = () => {
  return (
    <section id="legacy" className="relative bg-[hsl(40_30%_94%)] py-28 md:py-36 overflow-hidden">
      {/* subtle museum texture */}
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
        {/* Editorial eyebrow */}
        <div className="text-center mb-16 md:mb-24">
          <div className="inline-flex items-center gap-3 mb-6">
            <span className="h-px w-10 bg-accent/60" />
            <span className="font-sans2 text-[11px] tracking-[0.45em] uppercase text-accent">
              The Legacy · قصة الوفاء
            </span>
            <span className="h-px w-10 bg-accent/60" />
          </div>
          <h2 className="font-editorial text-5xl md:text-7xl text-primary leading-[1.05] tracking-tight">
            من برٍّ شخصي…
            <br />
            <em className="text-accent not-italic font-editorial italic">إلى وقفٍ للإنسانية.</em>
          </h2>
        </div>

        <div className="grid md:grid-cols-12 gap-10 md:gap-16 items-start">
          {/* PORTRAIT */}
          <div className="md:col-span-5 lg:col-span-5">
            <figure className="relative mx-auto max-w-sm">
              {/* Gold double frame */}
              <div
                className="relative p-[3px] rounded-sm"
                style={{ background: "linear-gradient(135deg, hsl(38 75% 55%), hsl(42 85% 70%), hsl(38 60% 40%))" }}
              >
                <div className="bg-[hsl(40_30%_94%)] p-2">
                  <div className="border border-accent/40 p-[6px]">
                    <div className="relative overflow-hidden bg-[hsl(155_40%_8%)] aspect-[3/4]">
                      <img
                        src={portrait}
                        alt="بورتريه المرحوم أحمد يحيى المضواحي"
                        loading="lazy"
                        className="absolute inset-0 w-full h-full object-cover object-center block"
                        style={{
                          filter:
                            "grayscale(100%) contrast(1.15) brightness(0.92)",
                        }}
                      />
                      {/* shadows tone — deep olive/emerald */}
                      <div
                        className="absolute inset-0 mix-blend-multiply pointer-events-none"
                        style={{
                          background:
                            "linear-gradient(160deg, hsl(155 45% 12%) 0%, hsl(150 30% 22%) 60%, hsl(40 35% 28%) 100%)",
                        }}
                        aria-hidden
                      />
                      {/* highlights tone — pearl & muted gold */}
                      <div
                        className="absolute inset-0 mix-blend-screen pointer-events-none opacity-80"
                        style={{
                          background:
                            "linear-gradient(160deg, hsl(42 55% 72%) 0%, hsl(38 35% 58%) 55%, hsl(40 30% 88%) 100%)",
                        }}
                        aria-hidden
                      />
                      {/* gentle vignette for museum depth */}
                      <div
                        className="absolute inset-0 pointer-events-none"
                        style={{
                          background:
                            "radial-gradient(ellipse at 50% 40%, transparent 55%, hsl(155 45% 6% / 0.55) 100%)",
                        }}
                        aria-hidden
                      />
                      {/* subtle paper grain */}
                      <div
                        className="absolute inset-0 pointer-events-none opacity-[0.07] mix-blend-overlay"
                        style={{
                          backgroundImage:
                            "radial-gradient(hsl(40 30% 90%) 1px, transparent 1px)",
                          backgroundSize: "3px 3px",
                        }}
                        aria-hidden
                      />
                    </div>
                  </div>
                </div>
              </div>
              <figcaption className="mt-7 text-center">
                <p className="font-sans2 text-[10px] tracking-[0.4em] uppercase text-muted-foreground mb-2">
                  In Loving Memory
                </p>
                <p className="font-editorial text-2xl md:text-3xl text-primary">
                  أحمد يحيى المضواحي
                </p>
                <p className="font-sans2 text-sm text-muted-foreground mt-1 tracking-widest">
                  ١٩٥٣ — ٢٠١٨
                </p>
                <p className="font-quran text-base text-primary/70 mt-4 leading-loose">
                  ﴿ رَبِّ ارْحَمْهُمَا كَمَا رَبَّيَانِي صَغِيرًا ﴾
                </p>
              </figcaption>
            </figure>
          </div>

          {/* NARRATIVE */}
          <div className="md:col-span-7 lg:col-span-7 md:pt-6">
            <p className="font-editorial italic text-2xl md:text-3xl text-primary/85 leading-relaxed mb-8 first-letter:font-editorial first-letter:text-7xl first-letter:float-right first-letter:ml-0 first-letter:mr-0 first-letter:pl-3 first-letter:pt-1 first-letter:text-accent first-letter:leading-none">
              كان والدًا، ومعلّمًا، وقدوةً في التوازن بين القيم والنجاح.
              من رحم محبّته وذكراه، وُلد منهج الفلاح.
            </p>

            <div className="space-y-6 text-[17px] leading-[2] text-foreground/80 font-body">
              <p>
                بدأ المشروع بِرًّا شخصيًا بوالد المؤسس، المرحوم
                <span className="font-semibold text-primary"> أحمد يحيى المضواحي</span>،
                صدقةً جارية تُهدى إلى روحه الطاهرة. ثم اتّسعت الدائرة
                لتشمل كل أبٍ وأمٍّ من المسلمين، وكل من يبحث عن
                هدايةٍ تُعاش لا تُقرأ فحسب.
              </p>
              <p>
                اليوم، يقف <span className="text-accent font-semibold">منهج الفلاح</span>
                {" "}كوقفٍ معرفي رقمي مفتوحٍ بالكامل، مجاني للأفراد، يَنهَلُ منه
                المسلم في أي مكانٍ من العالم — دون اشتراك، ودون مقابل،
                ابتغاء وجه الله، وصدقةً جارية عن أرواح آبائنا وأمهاتنا
                من المسلمين أجمعين.
              </p>
            </div>

            {/* Pull quote */}
            <blockquote className="mt-12 border-r-2 border-accent pr-6 py-2">
              <p className="font-editorial italic text-xl md:text-2xl text-primary leading-relaxed">
                "ما كان لله دام واتّصل، وما كان لغيره انقطع وانفصل."
              </p>
            </blockquote>

            {/* Endowment badges */}
            <div className="mt-10 grid grid-cols-3 gap-4 md:gap-6">
              {[
                { k: "مجاني", v: "بالكامل · للأفراد" },
                { k: "وقفي", v: "صدقة جارية" },
                { k: "مفتوح", v: "لكل المسلمين" },
              ].map((b, i) => (
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