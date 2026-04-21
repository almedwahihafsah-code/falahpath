import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ClassificationChips } from "./ClassificationChips";
import { domainCodeToFalah, domainLabel } from "@/data/quran/taxonomy";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { Plus } from "lucide-react";

interface Props {
  open: boolean;
  onClose: () => void;
  verse: any;
  classification: any;
  isAdmin: boolean;
  onEdit: () => void;
}

export const ClassificationDrawer = ({ open, onClose, verse, classification, isAdmin, onEdit }: Props) => {
  const { user } = useAuth();
  if (!verse) return null;

  const addTask = async () => {
    if (!user) { toast.error("سجّل الدخول أولًا"); return; }
    const domainId = classification?.domain_code ? domainCodeToFalah[classification.domain_code] : null;
    const { error } = await supabase.from("tasks").insert({
      user_id: user.id,
      title: `تدبر الآية ${verse.verse_number} من سورة البقرة`,
      description: verse.text_ar.slice(0, 200),
      domain_id: domainId,
      priority: "medium",
      type: "task",
      points: 10,
    });
    if (error) toast.error("تعذّر الإضافة"); else toast.success("أُضيفت إلى مهامك");
  };

  return (
    <Sheet open={open} onOpenChange={(o) => !o && onClose()}>
      <SheetContent side="left" className="w-full sm:max-w-lg overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="font-display text-primary">البقرة • آية {verse.verse_number}</SheetTitle>
        </SheetHeader>
        <div className="space-y-5 mt-5">
          <p className="font-quran text-xl leading-loose" dir="rtl">{verse.text_ar}</p>

          <div>
            <h4 className="text-sm font-display text-primary mb-2">التصنيف</h4>
            <ClassificationChips classification={classification} />
          </div>

          {classification && (
            <>
              {classification.context && <Detail label="السياق" value={classification.context} />}
              {classification.educational_effects?.length > 0 && (
                <Detail label="الأثر التربوي" value={classification.educational_effects.join("، ")} />
              )}
              {classification.notes && <Detail label="ملاحظات وتدبر" value={classification.notes} />}
            </>
          )}

          <div className="flex flex-col gap-2 pt-3">
            <Button onClick={addTask} className="bg-gradient-emerald text-primary-foreground gap-2">
              <Plus className="w-4 h-4" /> أضف إلى مهامي
            </Button>
            {isAdmin && (
              <Button variant="outline" onClick={onEdit}>
                {classification ? "تعديل التصنيف" : "تصنيف هذه الآية"}
              </Button>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

const Detail = ({ label, value }: { label: string; value: string }) => (
  <div>
    <h4 className="text-sm font-display text-primary mb-1">{label}</h4>
    <p className="text-sm text-muted-foreground leading-relaxed">{value}</p>
  </div>
);
