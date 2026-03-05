import { useState } from "react";
import { motion } from "framer-motion";
import { DashboardLayout } from "@/components/DashboardLayout";
import { useData } from "@/context/DataContext";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Calculator } from "lucide-react";

export default function FinanceBudget() {
  const { data } = useData();
  const [monthlyBudget, setMonthlyBudget] = useState("2000");
  const [savingsGoal, setSavingsGoal] = useState("500");

  const now = new Date();
  const thisMonth = data.finance.filter(f => {
    const d = new Date(f.date);
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  });

  const monthIncome = thisMonth.filter(f => f.type === "income").reduce((s, f) => s + f.amount, 0);
  const monthExpense = thisMonth.filter(f => f.type === "expense").reduce((s, f) => s + f.amount, 0);
  const budget = Number(monthlyBudget) || 0;
  const goal = Number(savingsGoal) || 0;
  const budgetUsed = budget > 0 ? Math.min(100, (monthExpense / budget) * 100) : 0;
  const savingsProgress = goal > 0 ? Math.min(100, ((monthIncome - monthExpense) / goal) * 100) : 0;

  return (
    <DashboardLayout>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-2xl">
        <h1 className="font-display text-2xl font-bold mb-6">Budget Planner</h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <div className="glass-card p-5">
            <label className="text-sm text-muted-foreground mb-2 block">Monthly Budget ($)</label>
            <Input type="number" value={monthlyBudget} onChange={e => setMonthlyBudget(e.target.value)}
              className="bg-secondary border-border text-lg font-bold" />
          </div>
          <div className="glass-card p-5">
            <label className="text-sm text-muted-foreground mb-2 block">Savings Goal ($)</label>
            <Input type="number" value={savingsGoal} onChange={e => setSavingsGoal(e.target.value)}
              className="bg-secondary border-border text-lg font-bold" />
          </div>
        </div>

        <div className="space-y-4">
          <div className="glass-card p-5">
            <div className="flex justify-between mb-2">
              <span className="text-sm font-medium">Budget Usage</span>
              <span className="text-sm text-muted-foreground">${monthExpense.toFixed(2)} / ${budget.toFixed(2)}</span>
            </div>
            <Progress value={budgetUsed} className="h-3" />
            <div className={`text-xs mt-2 ${budgetUsed > 90 ? "text-destructive" : budgetUsed > 70 ? "text-amber-400" : "text-primary"}`}>
              {budgetUsed > 100 ? "⚠️ Over budget!" : budgetUsed > 90 ? "⚠️ Almost at limit" : `${(100 - budgetUsed).toFixed(0)}% remaining`}
            </div>
          </div>

          <div className="glass-card p-5">
            <div className="flex justify-between mb-2">
              <span className="text-sm font-medium">Savings Progress</span>
              <span className="text-sm text-muted-foreground">${Math.max(0, monthIncome - monthExpense).toFixed(2)} / ${goal.toFixed(2)}</span>
            </div>
            <Progress value={Math.max(0, savingsProgress)} className="h-3" />
            <div className={`text-xs mt-2 ${savingsProgress >= 100 ? "text-primary" : "text-muted-foreground"}`}>
              {savingsProgress >= 100 ? "🎉 Goal reached!" : `${Math.max(0, savingsProgress).toFixed(0)}% towards goal`}
            </div>
          </div>

          <div className="glass-card p-5">
            <h3 className="font-display font-semibold mb-3">This Month Summary</h3>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-lg font-bold text-primary">${monthIncome.toFixed(2)}</div>
                <div className="text-xs text-muted-foreground">Income</div>
              </div>
              <div>
                <div className="text-lg font-bold text-destructive">${monthExpense.toFixed(2)}</div>
                <div className="text-xs text-muted-foreground">Expenses</div>
              </div>
              <div>
                <div className={`text-lg font-bold ${monthIncome - monthExpense >= 0 ? "text-primary" : "text-destructive"}`}>
                  ${Math.abs(monthIncome - monthExpense).toFixed(2)}
                </div>
                <div className="text-xs text-muted-foreground">{monthIncome - monthExpense >= 0 ? "Saved" : "Over"}</div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </DashboardLayout>
  );
}
