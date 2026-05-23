import { Share2, HandHeart, MessageCircle, Twitter, Link2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const SHARE_URL = "https://falah.me";
const SHARE_TEXT = "منهج الفلاح — من الوحي إلى الحياة. رحلتك القرآنية اليومية.";
const WHATSAPP_CONTACT = "971555851944";
const WHATSAPP_MESSAGE = "السلام عليكم، أرغب في الإسهام في وقف الفلاح.";

export const ContributeSection = () => {
  const { toast } = useToast();
  const [showFallback, setShowFallback] = useState(false);

  const handleShare = async () => {
    if (typeof navigator !== "undefined" && (navigator as any).share) {
      try {
        await (navigator as any).share({
          title: "منهج الفلاح",
          text: SHARE_TEXT,
          url: SHARE_URL,
        });
        return;
      } catch {
        // user cancelled or error — fall through to fallback
      }
    }
    setShowFallback((s) => !s);
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(SHARE_URL);
      toast({ description: "تم نسخ الرابط" });
    } catch {
      toast({ description: "تعذّر نسخ الرابط", variant: "destructive" });
    }
  };

  const whatsappShare = `https://wa.me/?text=${encodeURIComponent(`${SHARE_TEXT} ${SHARE_URL}`)}`;
  const twitterShare = `https://twitter.com/intent/tweet?text=${encodeURIComponent(SHARE_TEXT)}&url=${encodeURIComponent(SHARE_URL)}`;
  const whatsappContribute = `https://wa.me/${WHATSAPP_CONTACT}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`;

  return (
    <section id="contribute" className="relative bg-background py-28 md:py-40 overflow-hidden">
      <div className="container relative">
        <div className="text-center max-w-3xl mx-auto mb-16 md:mb-20">
          <div className="inline-flex items-center gap-3 mb-6">
            <span className="h-px w-10 bg-accent/60" />
            <span className="font-sans2 text-[11px] tracking-[0.45em] uppercase text-accent font-medium">
              Share in the Reward · شارك في الأجر
            </span>
            <span className="h-px w-10 bg-accent/60" />
          </div>
          <h2 className="font-editorial text-4xl sm:text-5xl md:text-6xl text-primary leading-[1.05] tracking-tight mb-8">
            كن سببًا في <em className="not-italic italic text-accent">هداية.</em>
          </h2>
          <p className="font-editorial italic text-lg md:text-xl text-muted-foreground leading-relaxed">
            الدالُّ على الخير كفاعله. شارك فلاح مع من تحب، فكل قلبٍ يهتدي بآيةٍ تصل إليه عبرك — لك مثل أجره.
            وهذا وقفٌ مفتوح، من أراد الإسهام في إدامته فله ذلك.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 md:gap-8 max-w-4xl mx-auto">
          {/* Card 1 — Share */}
          <div className="bg-card border border-border shadow-md p-8 md:p-10 flex flex-col">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Share2 className="w-5 h-5 text-primary" strokeWidth={1.6} />
              </div>
              <h3 className="font-editorial text-2xl md:text-3xl text-foreground">انشر فلاح</h3>
            </div>
            <p className="text-muted-foreground leading-loose text-[15px] mb-8 flex-1">
              بضغطة واحدة، أهدِ فلاح لأصدقائك — صدقة جارية تجري لك ولوالديك.
            </p>
            <Button
              onClick={handleShare}
              className="btn-lux bg-primary text-primary-foreground hover:bg-primary/90 h-12 rounded-none font-sans2 tracking-widest uppercase"
            >
              شارك الآن
            </Button>

            {showFallback && (
              <div className="mt-6 pt-6 border-t border-border/60 grid grid-cols-3 gap-3">
                <a
                  href={whatsappShare}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col items-center gap-2 p-3 border border-border hover:bg-muted transition-smooth"
                >
                  <MessageCircle className="w-5 h-5 text-accent" strokeWidth={1.5} />
                  <span className="font-sans2 text-[10px] tracking-widest uppercase text-muted-foreground">واتساب</span>
                </a>
                <a
                  href={twitterShare}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col items-center gap-2 p-3 border border-border hover:bg-muted transition-smooth"
                >
                  <Twitter className="w-5 h-5 text-accent" strokeWidth={1.5} />
                  <span className="font-sans2 text-[10px] tracking-widest uppercase text-muted-foreground">X</span>
                </a>
                <button
                  onClick={copyLink}
                  className="flex flex-col items-center gap-2 p-3 border border-border hover:bg-muted transition-smooth"
                >
                  <Link2 className="w-5 h-5 text-accent" strokeWidth={1.5} />
                  <span className="font-sans2 text-[10px] tracking-widest uppercase text-muted-foreground">نسخ</span>
                </button>
              </div>
            )}
          </div>

          {/* Card 2 — Contribute */}
          <div className="bg-card border border-border shadow-md p-8 md:p-10 flex flex-col">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-full bg-accent/15 flex items-center justify-center">
                <HandHeart className="w-5 h-5 text-accent" strokeWidth={1.6} />
              </div>
              <h3 className="font-editorial text-2xl md:text-3xl text-foreground">أسهِم في إدامة الوقف</h3>
            </div>
            <p className="text-muted-foreground leading-loose text-[15px] mb-8 flex-1">
              من أراد المشاركة في استمرار هذا الوقف — احتسابًا، أو إهداءً لمن فقدهم — فبابنا مفتوح.
            </p>
            <Button
              asChild
              className="btn-lux bg-accent text-accent-foreground hover:bg-accent/90 h-12 rounded-none font-sans2 tracking-widest uppercase"
            >
              <a href={whatsappContribute} target="_blank" rel="noopener noreferrer">
                تواصل للمساهمة
              </a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};