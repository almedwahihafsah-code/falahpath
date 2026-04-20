import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { domains } from "@/data/falah";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Plus } from "lucide-react";

interface Props {
  userId: string;
  onCreated: () => void;
}

export const TaskForm = ({ userId, onCreated }: Props) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [domainId, setDomainId] = useState<string>("1");
  const [priority, setPriority] = useState("medium");
  const [type, setType] = useState("task");
  const [dueDate, setDueDate] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    if (!title.trim()) return toast.error("اكتب عنوان المهمة");
    setLoading(true);
    const { error } = await supabase.from("tasks").insert({
      user_id: userId,
      title: title.trim(),
      description: description.trim() || null,
      domain_id: parseInt(domainId),
      priority,
      type,
      due_date: dueDate || null,
      points: priority === "high" ? 15 : priority === "low" ? 5 : 10,
    });
    setLoading(false);
    if (error) return toast.error("تعذّر الحفظ");
    toast.success("تمت إضافة المهمة");
    setTitle(""); setDescription(""); setDueDate("");
    onCreated();
  };

  return (
    <Card className="p-5 bg-card shadow-soft space-y-3">
      <Input placeholder="عنوان المهمة" value={title} onChange={(e) => setTitle(e.target.value)} />
      <Textarea placeholder="وصف (اختياري)" value={description} onChange={(e) => setDescription(e.target.value)} rows={2} />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Select value={domainId} onValueChange={setDomainId}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>{domains.map((d) => <SelectItem key={d.id} value={String(d.id)}>{d.title}</SelectItem>)}</SelectContent>
        </Select>
        <Select value={priority} onValueChange={setPriority}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="high">عالية</SelectItem>
            <SelectItem value="medium">متوسطة</SelectItem>
            <SelectItem value="low">منخفضة</SelectItem>
          </SelectContent>
        </Select>
        <Select value={type} onValueChange={setType}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="task">مهمة</SelectItem>
            <SelectItem value="habit">عادة</SelectItem>
            <SelectItem value="goal">هدف</SelectItem>
          </SelectContent>
        </Select>
        <Input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
      </div>
      <Button onClick={submit} disabled={loading} className="w-full bg-gradient-emerald text-primary-foreground">
        <Plus className="w-4 h-4" /> أضف المهمة
      </Button>
    </Card>
  );
};
