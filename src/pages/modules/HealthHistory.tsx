import { motion } from "framer-motion";
import { DashboardLayout } from "@/components/DashboardLayout";
import { useData } from "@/context/DataContext";

export default function HealthHistory() {
  const { data } = useData();

  return (
    <DashboardLayout>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <h1 className="font-display text-2xl font-bold mb-6">Health History</h1>
        {data.health.length === 0 ? (
          <div className="glass-card p-8 text-center text-muted-foreground">
            No health entries yet. Start logging your daily health!
          </div>
        ) : (
          <div className="space-y-3">
            {[...data.health].reverse().map((entry, i) => (
              <div key={i} className="glass-card p-4 flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium">{new Date(entry.date).toLocaleDateString()}</div>
                  <div className="text-xs text-muted-foreground">
                    Sleep: {entry.sleep}h • Stress: {entry.stress}/10 • Mood: {entry.mood} • Water: {entry.water} glasses
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-muted-foreground">Focus Score</div>
                  <div className="font-display font-bold text-primary">
                    {Math.min(100, Math.max(0, (entry.sleep * 8) - (entry.stress * 5) - (entry.eyeStrain ? 10 : 0) + (entry.exercise * 2) + (entry.water * 3)))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </motion.div>
    </DashboardLayout>
  );
}
