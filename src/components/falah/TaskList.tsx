import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { domains } from "@/data/falah";
import { Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface Task {
  id: string;
  title: string;
  description: string | null;
  domain_id: number | null;
  priority: string;
  due_date: string | null;
  type: string;
  status: string;
  points: number;
}

interface Props {
  tasks: Task[];
  onChange: () => void;
  onComplete: (points: number) => void;
}

const priorityColor: Record<string, string> = {
  high: "bg-destructive/15 text-destructive",
  medium: "bg-accent/15 text-accent",
  low: "bg-muted text-muted-foreground",
};

export const TaskList = ({ tasks, onChange, onComplete }: Props) => {
  const toggle = async (t: Task) => {
    const newStatus = t.status === "done" ? "active" : "done";
    const { error } = await supabase
      .from("tasks")
      .update({ status: newStatus, completed_at: newStatus === "done" ? new Date().toISOString() : null })
      .eq("id", t.id);
    if (error) return toast.error("خطأ");
    if (newStatus === "done") { onComplete(t.points); toast.success(`+${t.points} نقطة`); }
    onChange();
  };
  const remove = async (id: string) => {
    await supabase.from("tasks").delete().eq("id", id);
    onChange();
  };

  if (!tasks.length) return <p className="text-center text-muted-foreground py-8">لا توجد مهام بعد. أضف أولى مهامك.</p>;

  return (
    <div className="space-y-2">
      {tasks.map((t) => {
        const done = t.status === "done";
        const dom = domains.find((d) => d.id === t.domain_id);
        return (
          <Card key={t.id} className="p-4 flex items-start gap-3 bg-card shadow-soft">
            <Checkbox checked={done} onCheckedChange={() => toggle(t)} className="mt-1" />
            <div className="flex-1 min-w-0">
              <div className={`font-medium ${done ? "line-through text-muted-foreground" : "text-foreground"}`}>{t.title}</div>
              {t.description && <p className="text-sm text-muted-foreground mt-1">{t.description}</p>}
              <div className="flex flex-wrap gap-2 mt-2">
                {dom && <Badge variant="outline" className="text-xs">{dom.title}</Badge>}
                <Badge className={`text-xs ${priorityColor[t.priority]}`} variant="secondary">
                  {t.priority === "high" ? "عالية" : t.priority === "low" ? "منخفضة" : "متوسطة"}
                </Badge>
                <Badge variant="outline" className="text-xs">+{t.points} نقطة</Badge>
                {t.due_date && <Badge variant="outline" className="text-xs">{t.due_date}</Badge>}
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={() => remove(t.id)}>
              <Trash2 className="w-4 h-4 text-destructive" />
            </Button>
          </Card>
        );
      })}
    </div>
  );
};
