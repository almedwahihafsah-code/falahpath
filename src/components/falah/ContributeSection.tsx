import { Share2, HandHeart, MessageCircle, Twitter, Link2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useLandingLang } from "@/i18n/landing/LandingLang";
import {
  SHARE_URL,
  WHATSAPP_INVITE_MESSAGE,
  WHATSAPP_CONTRIBUTE_MESSAGE,
  waInviteLink,
  waContactLink,
} from "@/lib/share";

export const ContributeSection = () => {
  const { toast } = useToast();
  const { t } = useLandingLang();
  const c = t.contribute;
  const [showFallback, setShowFallback] = useState(false);

  const handleShare = async () => {
    if (typeof navigator !== "undefined" && (navigator as any).share) {
      try {
        await (navigator as any).share({
          title: "Falah",
          text: c.shareText,
          url: SHARE_URL,
        });
        return;
      } catch {
        // user cancelled — fall through
      }
    }
    setShowFallback((s) => !s);
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(SHARE_URL);
      toast({ description: c.copied });
    } catch {
      toast({ description: c.copyFail, variant: "destructive" });
    }
  };

  const whatsappShare = waInviteLink(WHATSAPP_INVITE_MESSAGE);
  const twitterShare = `https://twitter.com/intent/tweet?text=${encodeURIComponent(c.shareText)}&url=${encodeURIComponent(SHARE_URL)}`;
  const whatsappContribute = waContactLink(WHATSAPP_CONTRIBUTE_MESSAGE);

  return (
    <section id="contribute" className="relative bg-background py-24 md:py-32 overflow-hidden">
      <div className="container relative">
        <div className="text-center max-w-3xl mx-auto mb-16 md:mb-20">
          <div className="inline-flex items-center gap-3 mb-6">
            <span className="h-px w-10 bg-accent/60" />
            <span className="font-sans2 text-[11px] tracking-[0.45em] uppercase text-accent font-medium">
              {c.eyebrow}
            </span>
            <span className="h-px w-10 bg-accent/60" />
          </div>
          <h2 className="font-editorial text-4xl sm:text-5xl md:text-6xl text-primary leading-[1.05] tracking-tight mb-8">
            {c.titleLead} <em className="not-italic italic text-accent">{c.titleEm}</em>
          </h2>
          <p className="font-editorial italic text-lg md:text-xl text-muted-foreground leading-relaxed">
            {c.intro}
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 md:gap-8 max-w-4xl mx-auto">
          <div className="bg-card border border-border shadow-md p-8 md:p-10 flex flex-col">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Share2 className="w-5 h-5 text-primary" strokeWidth={1.6} />
              </div>
              <h3 className="font-editorial text-2xl md:text-3xl text-foreground">{c.shareTitle}</h3>
            </div>
            <p className="text-muted-foreground leading-loose text-[15px] mb-8 flex-1">
              {c.shareDesc}
            </p>
            <Button
              onClick={handleShare}
              className="btn-lux bg-primary text-primary-foreground hover:bg-primary/90 h-12 rounded-none font-sans2 tracking-widest uppercase"
            >
              {c.shareBtn}
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
                  <span className="font-sans2 text-[10px] tracking-widest uppercase text-muted-foreground">{c.labelWa}</span>
                </a>
                <a
                  href={twitterShare}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col items-center gap-2 p-3 border border-border hover:bg-muted transition-smooth"
                >
                  <Twitter className="w-5 h-5 text-accent" strokeWidth={1.5} />
                  <span className="font-sans2 text-[10px] tracking-widest uppercase text-muted-foreground">{c.labelX}</span>
                </a>
                <button
                  onClick={copyLink}
                  className="flex flex-col items-center gap-2 p-3 border border-border hover:bg-muted transition-smooth"
                >
                  <Link2 className="w-5 h-5 text-accent" strokeWidth={1.5} />
                  <span className="font-sans2 text-[10px] tracking-widest uppercase text-muted-foreground">{c.labelCopy}</span>
                </button>
              </div>
            )}
          </div>

          <div className="bg-card border border-border shadow-md p-8 md:p-10 flex flex-col">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-full bg-accent/15 flex items-center justify-center">
                <HandHeart className="w-5 h-5 text-accent" strokeWidth={1.6} />
              </div>
              <h3 className="font-editorial text-2xl md:text-3xl text-foreground">{c.contributeTitle}</h3>
            </div>
            <p className="text-muted-foreground leading-loose text-[15px] mb-8 flex-1">
              {c.contributeDesc}
            </p>
            <Button
              asChild
              className="btn-lux bg-accent text-accent-foreground hover:bg-accent/90 h-12 rounded-none font-sans2 tracking-widest uppercase"
            >
              <a href={whatsappContribute} target="_blank" rel="noopener noreferrer">
                {c.contributeBtn}
              </a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};
