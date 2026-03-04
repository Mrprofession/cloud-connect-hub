import { motion } from "framer-motion";
import { Heart, Zap, Code, Brain, TrendingUp } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useData } from "@/context/DataContext";
import { DashboardLayout } from "@/components/DashboardLayout";

function ScoreCard({ icon: Icon, label, score, color }: { icon: any; label: string; score: number; color: string }) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-6">
      <div className="flex items-center gap-3 mb-3">
        <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${color} flex items-center justify-center`}>
          <Icon className="w-5 h-5 text-foreground" />
        </div>
        <span className="text-sm text-muted-foreground">{label}</span>
      </div>
      <div className="text-3xl font-display font-bold">{score}</div>
      <div className="w-full bg-secondary rounded-full h-2 mt-3">
        <div className={`h-2 rounded-full bg-gradient-to-r ${color} transition-all duration-1000`} style={{ width: `${score}%` }} />
      </div>
    </motion.div>
  );
}

function DashboardContent() {
  const { user } = useAuth();
  const { data } = useData();

  if (!user) return null;

  const overallScore = Math.round(
    (data.healthScore * 0.3) + (data.productivityScore * 0.3) + (data.codeScore * 0.4)
  );

  return (
    <div>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <h1 className="font-display text-3xl font-bold mb-1">
          Welcome back, <span className="gradient-text">{user.name}</span>
        </h1>
        <p className="text-muted-foreground text-sm mb-8">
          Your {user.selectedModule} dashboard • {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
        </p>
      </motion.div>

      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="glass-card glow-border p-8 mb-8 text-center">
        <TrendingUp className="w-8 h-8 text-primary mx-auto mb-2" />
        <div className="text-5xl font-display font-bold gradient-text mb-1">{overallScore}</div>
        <div className="text-sm text-muted-foreground">Overall Performance Score</div>
        <div className="text-xs text-muted-foreground mt-1">(Health × 0.3 + Productivity × 0.3 + Code × 0.4)</div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <ScoreCard icon={Heart} label="Health Score" score={data.healthScore} color="from-rose-500 to-pink-600" />
        <ScoreCard icon={Zap} label="Productivity" score={data.productivityScore} color="from-amber-500 to-orange-600" />
        <ScoreCard icon={Code} label="Code Quality" score={data.codeScore} color="from-emerald-500 to-teal-600" />
        <ScoreCard icon={Brain} label="AI Insights" score={data.financeScore} color="from-violet-500 to-purple-600" />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="glass-card p-4 text-center">
          <div className="text-2xl font-display font-bold">{data.health.length}</div>
          <div className="text-xs text-muted-foreground">Health Logs</div>
        </div>
        <div className="glass-card p-4 text-center">
          <div className="text-2xl font-display font-bold">{data.tasks.length}</div>
          <div className="text-xs text-muted-foreground">Total Tasks</div>
        </div>
        <div className="glass-card p-4 text-center">
          <div className="text-2xl font-display font-bold">{data.codeRuns.length}</div>
          <div className="text-xs text-muted-foreground">Code Runs</div>
        </div>
        <div className="glass-card p-4 text-center">
          <div className="text-2xl font-display font-bold">{data.finance.length}</div>
          <div className="text-xs text-muted-foreground">Finance Entries</div>
        </div>
      </div>
    </div>
  );
}

export default function Dashboard() {
  return (
    <DashboardLayout>
      <DashboardContent />
    </DashboardLayout>
  );
}
