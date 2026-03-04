import { motion } from "framer-motion";
import { DashboardLayout } from "@/components/DashboardLayout";
import { useData } from "@/context/DataContext";
import { TrendingUp, Heart, Zap, Code } from "lucide-react";

export default function IntegrationScore() {
  const { data } = useData();
  const overall = Math.round((data.healthScore * 0.3) + (data.productivityScore * 0.3) + (data.codeScore * 0.4));
  const riskLevel = overall >= 70 ? "Low" : overall >= 40 ? "Medium" : "High";
  const riskColor = overall >= 70 ? "text-primary" : overall >= 40 ? "text-amber-400" : "text-destructive";

  return (
    <DashboardLayout>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-3xl mx-auto">
        <h1 className="font-display text-2xl font-bold mb-6">Performance Score</h1>
        <div className="glass-card glow-border p-10 text-center mb-6">
          <TrendingUp className="w-10 h-10 text-primary mx-auto mb-3" />
          <div className="text-6xl font-display font-bold gradient-text mb-2">{overall}</div>
          <div className="text-muted-foreground">Overall Performance Score</div>
          <div className={`text-sm mt-2 font-medium ${riskColor}`}>Risk Level: {riskLevel}</div>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div className="glass-card p-6 text-center">
            <Heart className="w-6 h-6 text-rose-400 mx-auto mb-2" />
            <div className="text-2xl font-display font-bold">{data.healthScore}</div>
            <div className="text-xs text-muted-foreground">Health (30%)</div>
          </div>
          <div className="glass-card p-6 text-center">
            <Zap className="w-6 h-6 text-amber-400 mx-auto mb-2" />
            <div className="text-2xl font-display font-bold">{data.productivityScore}</div>
            <div className="text-xs text-muted-foreground">Productivity (30%)</div>
          </div>
          <div className="glass-card p-6 text-center">
            <Code className="w-6 h-6 text-emerald-400 mx-auto mb-2" />
            <div className="text-2xl font-display font-bold">{data.codeScore}</div>
            <div className="text-xs text-muted-foreground">Code Quality (40%)</div>
          </div>
        </div>
      </motion.div>
    </DashboardLayout>
  );
}
