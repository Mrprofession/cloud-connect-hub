import { useState } from "react";
import { motion } from "framer-motion";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Target, Plus, Trash2, CheckCircle } from "lucide-react";
import { toast } from "sonner";

interface Goal {
  id: string;
  title: string;
  target: number;
  current: number;
}

export default function GoalsHabits() {
  const [goals, setGoals] = useState<Goal[]>([
    { id: "1", title: "Read 30 minutes daily", target: 7, current: 3 },
    { id: "2", title: "Exercise 5 days/week", target: 5, current: 2 },
    { id: "3", title: "Complete all tasks", target: 10, current: 6 },
  ]);
  const [newTitle, setNewTitle] = useState("");
  const [newTarget, setNewTarget] = useState("7");

  const addGoal = () => {
    if (!newTitle.trim()) return;
    setGoals([...goals, { id: Date.now().toString(), title: newTitle, target: Number(newTarget), current: 0 }]);
    setNewTitle(""); setNewTarget("7");
    toast.success("Goal added!");
  };

  const increment = (id: string) => {
    setGoals(goals.map(g => g.id === id ? { ...g, current: Math.min(g.target, g.current + 1) } : g));
  };

  const remove = (id: string) => {
    setGoals(goals.filter(g => g.id !== id));
  };

  return (
    <DashboardLayout>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-2xl">
        <h1 className="font-display text-2xl font-bold mb-6">Goals & Habits</h1>

        <div className="glass-card p-4 mb-6 flex gap-3 flex-wrap">
          <Input placeholder="Goal title" value={newTitle} onChange={e => setNewTitle(e.target.value)}
            className="bg-secondary border-border flex-1 min-w-[200px]" />
          <Input type="number" placeholder="Target" value={newTarget} onChange={e => setNewTarget(e.target.value)}
            className="bg-secondary border-border w-20" />
          <Button onClick={addGoal} className="bg-primary text-primary-foreground">
            <Plus className="w-4 h-4 mr-1" /> Add
          </Button>
        </div>

        <div className="space-y-3">
          {goals.map(goal => {
            const pct = goal.target > 0 ? (goal.current / goal.target) * 100 : 0;
            return (
              <div key={goal.id} className="glass-card p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Target className="w-4 h-4 text-primary" />
                    <span className="font-medium text-sm">{goal.title}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">{goal.current}/{goal.target}</span>
                    <Button size="sm" variant="ghost" onClick={() => increment(goal.id)}
                      className="h-6 w-6 p-0" disabled={goal.current >= goal.target}>
                      <CheckCircle className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => remove(goal.id)} className="h-6 w-6 p-0 text-destructive">
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
                <Progress value={pct} className="h-2" />
                {pct >= 100 && <div className="text-xs text-primary mt-1">🎉 Goal completed!</div>}
              </div>
            );
          })}
        </div>
      </motion.div>
    </DashboardLayout>
  );
}
