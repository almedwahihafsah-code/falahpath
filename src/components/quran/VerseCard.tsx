import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { ClassificationChips } from "./ClassificationChips";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Bookmark, BookmarkCheck, ChevronDown, ChevronUp } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

interface Props {
  verse: { id: string; verse_number: number; text_ar: string };
  classification?: any;
  onClick: () => void;
  surahName?: string;
  onTagClick?: (tag: string) => void;
  onDomainClick?: (domain: string) => void;
  onThemeClick?: (theme: string) => void;
  onFunctionClick?: (fn: string) => void;
  bookmarked?: boolean;
  onBookmarkToggle?: (verseId: string, next: boolean) => void;
}

export const VerseCard = ({
  verse,
  classification,
  onClick,
  surahName,
  onTagClick,
  onDomainClick,
  onThemeClick,
  onFunctionClick,
  bookmarked = false,
  onBookmarkToggle,
}: Props) => {
  const { user } = useAuth();
  const [saving, setSaving] = useState(false);
  const [contextOpen, setContextOpen] = useState(false);

  const ctx = classification?.context as string | undefined;
  const ctxLong = !!ctx && ctx.length > 120;

  const handleBookmark = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user) { toast.error("سجّل الدخول لحفظ الآية"); return; }
    setSaving(true);
    try {
      if (bookmarked) {
        const { error } = await supabase.from("verse_bookmarks").delete().eq("user_id", user.id).eq("verse_id", verse.id);
        if (error) throw error;
        toast.success("أُزيلت من المحفوظات");
        onBookmarkToggle?.(verse.id, false);
      } else {
        const { error } = await supabase.from("verse_bookmarks").insert({ user_id: user.id, verse_id: verse.id });
        if (error) throw error;
        toast.success("حُفظت في مسار الفلاح");
        onBookmarkToggle?.(verse.id, true);
      }
    } catch (err: any) {
      toast.error(err.message || "تعذّر الحفظ");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card className="p-5 hover:shadow-elegant transition-smooth bg-gradient-card group">
      <div className="flex items-start gap-4">
        <div className="shrink-0 w-10 h-10 rounded-full bg-gradient-emerald text-primary-foreground flex items-center justify-center font-display text-sm shadow-soft">
          {verse.verse_number}
        </div>
        <div className="flex-1 space-y-3 min-w-0">
          <div className="flex items-start justify-between gap-2">
            {surahName ? (
              <div className="text-xs text-accent font-medium tracking-wide">
                سورة {surahName} • آية {verse.verse_number}
              </div>
            ) : <span />}
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 -mt-1 -me-1 shrink-0"
              onClick={handleBookmark}
              disabled={saving}
              aria-label={bookmarked ? "إزالة من المحفوظات" : "حفظ الآية"}
              title={bookmarked ? "إزالة من المحفوظات" : "حفظ في مسار الفلاح"}
            >
              {bookmarked
                ? <BookmarkCheck className="w-5 h-5 text-accent fill-accent" />
                : <Bookmark className="w-5 h-5 text-muted-foreground hover:text-accent transition-colors" />}
            </Button>
          </div>

          <p
            onClick={onClick}
            className="font-quran text-[1.7rem] leading-[2.6] text-foreground cursor-pointer tracking-wide"
            dir="rtl"
            style={{ fontFeatureSettings: '"liga", "calt"' }}
          >
            {verse.text_ar}
          </p>

          <ClassificationChips
            classification={classification}
            onTagClick={onTagClick}
            onDomainClick={onDomainClick}
            onThemeClick={onThemeClick}
            onFunctionClick={onFunctionClick}
          />

          {ctx && (
            <Collapsible open={contextOpen} onOpenChange={setContextOpen}>
              <div className="rounded-md bg-muted/40 border border-border/50 p-3">
                <div className="flex items-center justify-between gap-2">
                  <h5 className="text-xs font-display text-primary">السياق</h5>
                  {ctxLong && (
                    <CollapsibleTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-7 px-2 text-xs gap-1">
                        {contextOpen ? <>إخفاء <ChevronUp className="w-3 h-3" /></> : <>قراءة المزيد <ChevronDown className="w-3 h-3" /></>}
                      </Button>
                    </CollapsibleTrigger>
                  )}
                </div>
                {!ctxLong && <p className="text-xs text-muted-foreground leading-relaxed mt-1">{ctx}</p>}
                {ctxLong && !contextOpen && (
                  <p className="text-xs text-muted-foreground leading-relaxed mt-1 line-clamp-2">{ctx}</p>
                )}
                <CollapsibleContent>
                  <p className="text-xs text-muted-foreground leading-relaxed mt-1">{ctx}</p>
                </CollapsibleContent>
              </div>
            </Collapsible>
          )}
        </div>
      </div>
    </Card>
  );
};
