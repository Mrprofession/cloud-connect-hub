import { motion } from "framer-motion";
import { DashboardLayout } from "@/components/DashboardLayout";
import { useData } from "@/context/DataContext";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, PieChart, Pie, Cell } from "recharts";
import { TrendingUp, CheckCircle, Clock, Target } from "lucide-react";

const COLORS = ["#00C49F", "#FF8042", "#FFBB28", "#0088FE"];

export default function ProductivityAnalytics() {
  const { data } = useData();

  const statusCounts = {
    todo: data.tasks.filter(t => t.status === "todo").length,
    in_progress: data.tasks.filter(t => t.status === "in_progress").length,
    done: data.tasks.filter(t => t.status === "done").length,
  };

  const pieData = [
    { name: "To Do", value: statusCounts.todo },
    { name: "In Progress", value: statusCounts.in_progress },
    { name: "Done", value: statusCounts.done },
  ].filter(d => d.value > 0);

  const categoryData: Record<string, number> = {};
  data.tasks.forEach(t => { categoryData[t.category] = (categoryData[t.category] || 0) + 1; });
  const barData = Object.entries(categoryData).map(([cat, count]) => ({ category: cat, count }));

  const totalEstimated = data.tasks.reduce((s, t) => s + t.estimatedTime, 0);
  const totalActual = data.tasks.reduce((s, t) => s + t.actualTime, 0);

  return (
    <DashboardLayout>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <h1 className="font-display text-2xl font-bold mb-6">Productivity Analytics</h1>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="glass-card p-4 text-center">
            <Target className="w-5 h-5 mx-auto mb-1 text-primary" />
            <div className="text-xl font-display font-bold">{data.tasks.length}</div>
            <div className="text-xs text-muted-foreground">Total Tasks</div>
          </div>
          <div className="glass-card p-4 text-center">
            <CheckCircle className="w-5 h-5 mx-auto mb-1 text-primary" />
            <div className="text-xl font-display font-bold">{statusCounts.done}</div>
            <div className="text-xs text-muted-foreground">Completed</div>
          </div>
          <div className="glass-card p-4 text-center">
            <TrendingUp className="w-5 h-5 mx-auto mb-1 text-amber-400" />
            <div className="text-xl font-display font-bold">{data.productivityScore}%</div>
            <div className="text-xs text-muted-foreground">Score</div>
          </div>
          <div className="glass-card p-4 text-center">
            <Clock className="w-5 h-5 mx-auto mb-1 text-accent" />
            <div className="text-xl font-display font-bold">{totalEstimated}m</div>
            <div className="text-xs text-muted-foreground">Total Estimated</div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="glass-card p-5">
            <h3 className="font-display font-semibold mb-4">Task Status Distribution</h3>
            {pieData.length > 0 ? (
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                    {pieData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[250px] flex items-center justify-center text-muted-foreground text-sm">No tasks yet</div>
            )}
          </div>
          <div className="glass-card p-5">
            <h3 className="font-display font-semibold mb-4">Tasks by Category</h3>
            {barData.length > 0 ? (
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={barData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="category" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <Tooltip />
                  <Bar dataKey="count" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
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
