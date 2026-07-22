import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { waInviteLink, WHATSAPP_INVITE_MESSAGE } from "@/lib/share";

/**
 * "شارك مع أحد" — a standalone card inviting the user to pass the daily
 * Qur'anic journey on to someone they love. Framed as ongoing charity
 * (صدقة جارية), not marketing. Motion is intentionally quiet.
 */
export const ShareJourneyCard = ({ className = "" }: { className?: string }) => {
  const href = waInviteLink(WHATSAPP_INVITE_MESSAGE);
  return (
    <div
      dir="rtl"
      className={
        "relative bg-card border border-border/70 shadow-md p-8 md:p-10 overflow-hidden transition-smooth hover:shadow-elegant " +
        className
      }
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-l from-transparent via-accent/40 to-transparent"
      />
      <div className="flex items-center gap-3 mb-4">
        <span className="h-px w-8 bg-accent/50" />
        <span className="font-sans2 text-[10px] tracking-[0.4em] uppercase text-accent">
          صدقة جارية
        </span>
      </div>
      <h3 className="font-editorial text-2xl md:text-3xl text-primary leading-snug mb-4">
        شارك مع أحد
      </h3>
      <p className="text-muted-foreground leading-loose text-[15px] mb-6">
        الدالُّ على الخير كفاعله. ادعُ من تحب إلى الرحلة اليومية مع القرآن — آيةٌ،
        وعمل، وتدبّر. شاركها لتكون لك مثل أجرها، ما اهتدى بها قلبٌ إلى يوم الدين.
      </p>
      <Button
        asChild
        className="btn-lux bg-primary text-primary-foreground hover:bg-primary/90 h-12 rounded-none font-sans2 tracking-widest uppercase w-full sm:w-auto"
      >
        <a href={href} target="_blank" rel="noopener noreferrer">
          <MessageCircle className="w-4 h-4 ml-2" strokeWidth={1.6} />
          شارك عبر واتساب
        </a>
      </Button>
    </div>
  );
};

export default ShareJourneyCard;