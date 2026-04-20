import { Card } from "@/components/ui/card";
import { ListTodo, CheckCircle2, Sparkles, Trophy } from "lucide-react";

interface Props {
  tasks: number;
  completed: number;
  points: number;
  level: number;
}

export const StatsBar = ({ tasks, completed, points, level }: Props) => {
  const items = [
    { icon: ListTodo, label: "مهام", value: tasks },
    { icon: CheckCircle2, label: "منجزة", value: completed },
    { icon: Sparkles, label: "نقاط", value: points },
    { icon: Trophy, label: "المستوى", value: level },
  ];
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {items.map((it) => (
        <Card key={it.label} className="p-4 bg-gradient-card shadow-soft">
          <div className="flex items-center gap-2 text-muted-foreground text-xs mb-1">
            <it.icon className="w-4 h-4 text-accent" /> {it.label}
          </div>
          <div className="font-display text-3xl text-primary">{it.value}</div>
        </Card>
      ))}
    </div>
  );
};
