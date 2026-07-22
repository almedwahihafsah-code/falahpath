import { useEffect, useState } from "react";
import { Smartphone, Share as ShareIcon, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

const isIos = () => {
  if (typeof navigator === "undefined") return false;
  const ua = navigator.userAgent || "";
  const iPadOS = /Macintosh/.test(ua) && "ontouchend" in document;
  return /iPad|iPhone|iPod/.test(ua) || iPadOS;
};

const isStandalone = () => {
  if (typeof window === "undefined") return false;
  return (
    window.matchMedia?.("(display-mode: standalone)").matches ||
    (window.navigator as any).standalone === true
  );
};

export const InstallPwaButton = ({ className = "" }: { className?: string }) => {
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(null);
  const [showIosSheet, setShowIosSheet] = useState(false);
  const [installed, setInstalled] = useState<boolean>(() => isStandalone());
  const ios = isIos();

  useEffect(() => {
    const onPrompt = (e: Event) => {
      e.preventDefault();
      setDeferred(e as BeforeInstallPromptEvent);
    };
    const onInstalled = () => setInstalled(true);
    window.addEventListener("beforeinstallprompt", onPrompt as EventListener);
    window.addEventListener("appinstalled", onInstalled);
    return () => {
      window.removeEventListener("beforeinstallprompt", onPrompt as EventListener);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  if (installed) return null;

  const handleClick = async () => {
    if (deferred) {
      try {
        await deferred.prompt();
        const { outcome } = await deferred.userChoice;
        if (outcome === "accepted") setInstalled(true);
      } finally {
        setDeferred(null);
      }
      return;
    }
    // iOS fallback: show step-by-step instructions.
    setShowIosSheet(true);
  };

  return (
    <>
      <Button
        onClick={handleClick}
        variant="outline"
        className={
          "h-11 rounded-none border-primary/25 bg-transparent text-primary hover:bg-primary/5 font-sans2 text-xs tracking-[0.25em] uppercase " +
          className
        }
      >
        <Smartphone className="w-4 h-4 ml-2" strokeWidth={1.5} />
        أضِف فلاح إلى شاشتك الرئيسية
      </Button>

      {showIosSheet && (
        <div
          role="dialog"
          aria-modal="true"
          dir="rtl"
          className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center bg-primary/40 backdrop-blur-sm px-4"
          onClick={() => setShowIosSheet(false)}
        >
          <div
            className="w-full sm:max-w-md bg-background border border-border shadow-elegant p-8 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              aria-label="إغلاق"
              onClick={() => setShowIosSheet(false)}
              className="absolute top-4 left-4 text-muted-foreground hover:text-foreground"
            >
              <X className="w-5 h-5" />
            </button>
            <p className="font-sans2 text-[10px] tracking-[0.4em] uppercase text-accent mb-3">
              للأجهزة التي تعمل بـ iPhone / iPad
            </p>
            <h3 className="font-editorial text-2xl text-primary mb-6 leading-snug">
              أضِف فلاح إلى شاشتك الرئيسية
            </h3>
            <ol className="space-y-5 text-sm text-foreground/85 leading-relaxed">
              <li className="flex items-start gap-3">
                <span className="mt-0.5 w-7 h-7 shrink-0 rounded-full border border-accent/40 text-accent inline-flex items-center justify-center text-xs font-medium">
                  ١
                </span>
                <span>افتح هذه الصفحة داخل متصفح Safari.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-0.5 w-7 h-7 shrink-0 rounded-full border border-accent/40 text-accent inline-flex items-center justify-center text-xs font-medium">
                  ٢
                </span>
                <span className="flex items-center gap-2 flex-wrap">
                  اضغط أيقونة المشاركة
                  <ShareIcon className="w-4 h-4 text-accent inline" strokeWidth={1.6} />
                  في شريط Safari.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-0.5 w-7 h-7 shrink-0 rounded-full border border-accent/40 text-accent inline-flex items-center justify-center text-xs font-medium">
                  ٣
                </span>
                <span className="flex items-center gap-2 flex-wrap">
                  اختر
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 border border-border text-xs">
                    <Plus className="w-3 h-3" /> إضافة إلى الشاشة الرئيسية
                  </span>
                </span>
              </li>
            </ol>
            <p className="mt-6 pt-6 border-t border-border/60 text-xs text-muted-foreground leading-relaxed">
              بعد الإضافة، ستجد فلاح كأيقونة مستقلة على شاشتك — رفيقًا يوميًا للقرآن.
            </p>
          </div>
        </div>
      )}
    </>
  );
};

export default InstallPwaButton;