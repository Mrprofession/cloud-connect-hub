import { motion } from "framer-motion";
import { DashboardLayout } from "@/components/DashboardLayout";
import { useData } from "@/context/DataContext";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, LineChart, Line } from "recharts";
import { DollarSign, TrendingUp, TrendingDown, Wallet } from "lucide-react";

const COLORS = ["#00C49F", "#FF8042", "#FFBB28", "#0088FE", "#8884d8", "#FF6B6B", "#4ECDC4", "#45B7D1"];

export default function FinanceReports() {
  const { data } = useData();

  const totalIncome = data.finance.filter(f => f.type === "income").reduce((s, f) => s + f.amount, 0);
  const totalExpense = data.finance.filter(f => f.type === "expense").reduce((s, f) => s + f.amount, 0);
  const savings = totalIncome - totalExpense;

  // Expense by category
  const expenseByCategory: Record<string, number> = {};
  data.finance.filter(f => f.type === "expense").forEach(f => {
    expenseByCategory[f.category] = (expenseByCategory[f.category] || 0) + f.amount;
  });
  const pieData = Object.entries(expenseByCategory).map(([name, value]) => ({ name, value }));

  // Monthly trend
  const monthlyData: Record<string, { income: number; expense: number }> = {};
  data.finance.forEach(f => {
    const month = new Date(f.date).toLocaleDateString("en-US", { month: "short", year: "2-digit" });
    if (!monthlyData[month]) monthlyData[month] = { income: 0, expense: 0 };
    monthlyData[month][f.type] += f.amount;
  });
  const barData = Object.entries(monthlyData).map(([month, d]) => ({ month, ...d }));

  return (
    <DashboardLayout>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <h1 className="font-display text-2xl font-bold mb-6">Financial Reports</h1>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="glass-card p-5 text-center">
            <TrendingUp className="w-6 h-6 text-primary mx-auto mb-2" />
            <div className="text-2xl font-display font-bold text-primary">${totalIncome.toFixed(2)}</div>
            <div className="text-xs text-muted-foreground">Total Income</div>
          </div>
          <div className="glass-card p-5 text-center">
            <TrendingDown className="w-6 h-6 text-destructive mx-auto mb-2" />
            <div className="text-2xl font-display font-bold text-destructive">${totalExpense.toFixed(2)}</div>
            <div className="text-xs text-muted-foreground">Total Expenses</div>
          </div>
          <div className="glass-card p-5 text-center">
            <Wallet className="w-6 h-6 text-accent mx-auto mb-2" />
            <div className={`text-2xl font-display font-bold ${savings >= 0 ? "text-primary" : "text-destructive"}`}>
              ${Math.abs(savings).toFixed(2)}
            </div>
            <div className="text-xs text-muted-foreground">{savings >= 0 ? "Net Savings" : "Net Loss"}</div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="glass-card p-5">
            <h3 className="font-display font-semibold mb-4">Expense Distribution</h3>
            {pieData.length > 0 ? (
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                    {pieData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[250px] flex items-center justify-center text-muted-foreground text-sm">No expense data</div>
            )}
          </div>
          <div className="glass-card p-5">
            <h3 className="font-display font-semibold mb-4">Monthly Trend</h3>
            {barData.length > 0 ? (
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={barData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <Tooltip />
                  <Bar dataKey="income" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="expense" fill="hsl(var(--destructive))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[250px] flex items-center justify-center text-muted-foreground text-sm">No data yet</div>
            )}
          </div>
        </div>
      </motion.div>
    </DashboardLayout>
  );
}
