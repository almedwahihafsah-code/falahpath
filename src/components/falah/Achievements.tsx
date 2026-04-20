import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { badges, calcLevel, pointsForLevel, progressToNextLevel } from "@/lib/falah-points";
import { Trophy, Flame, Star, Lock } from "lucide-react";

interface Props {
  points: number;
  habitCount: number;
  streak: number;
}

export const Achievements = ({ points, habitCount, streak }: Props) => {
  const lvl = calcLevel(points);
  const next = pointsForLevel(lvl + 1);
  const pct = progressToNextLevel(points);

  return (
    <div className="space-y-5">
      <Card className="p-7 bg-gradient-emerald text-primary-foreground shadow-elegant">
        <div className="flex items-center gap-3 mb-4">
          <Trophy className="w-6 h-6" />
          <span className="text-sm opacity-80">المستوى الحالي</span>
        </div>
        <div className="flex items-end gap-4 mb-4">
          <div className="font-display text-7xl text-gradient-gold">{lvl}</div>
          <div className="text-sm opacity-75 mb-3">{points} / {next} نقطة</div>
        </div>
        <Progress value={pct} className="h-2 bg-primary-foreground/15" />
      </Card>

      <div className="grid grid-cols-2 gap-3">
        <Card className="p-5 bg-card shadow-soft">
          <div className="flex items-center gap-2 text-muted-foreground text-sm mb-1"><Flame className="w-4 h-4 text-accent" /> سلسلة الأيام</div>
          <div className="font-display text-4xl text-primary">{streak}</div>
        </Card>
        <Card className="p-5 bg-card shadow-soft">
          <div className="flex items-center gap-2 text-muted-foreground text-sm mb-1"><Star className="w-4 h-4 text-accent" /> العادات المنجزة</div>
          <div className="font-display text-4xl text-primary">{habitCount}</div>
        </Card>
      </div>

      <div>
        <h3 className="font-display text-xl text-primary mb-3">الأوسمة</h3>
        <div className="grid sm:grid-cols-2 gap-3">
          {badges.map((b) => {
            const earned = b.check(points, habitCount);
            return (
              <Card key={b.id} className={`p-4 flex items-center gap-3 ${earned ? "bg-gradient-card shadow-soft" : "bg-muted/30 opacity-60"}`}>
                {earned ? <Trophy className="w-8 h-8 text-accent" /> : <Lock className="w-8 h-8 text-muted-foreground" />}
                <div>
                  <div className="font-medium text-sm">{b.title}</div>
                  <div className="text-xs text-muted-foreground">{b.desc}</div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
};
