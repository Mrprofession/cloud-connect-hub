import { motion } from "framer-motion";
import { DashboardLayout } from "@/components/DashboardLayout";
import { useData } from "@/context/DataContext";
import { AlertTriangle, CheckCircle } from "lucide-react";

export default function BurnoutDetection() {
  const { data } = useData();
  const recent = data.health.slice(-7);
  const highStressDays = recent.filter(e => e.stress >= 7).length;
  const lowSleepDays = recent.filter(e => e.sleep < 5).length;
  const burnoutRisk = highStressDays >= 3 || lowSleepDays >= 3;

  return (
    <DashboardLayout>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-2xl">
        <h1 className="font-display text-2xl font-bold mb-6">Burnout Detection</h1>
        <div className={`glass-card p-8 text-center ${burnoutRisk ? "glow-border border-destructive/50" : "glow-border"}`}>
          {burnoutRisk ? (
            <>
              <AlertTriangle className="w-16 h-16 text-destructive mx-auto mb-4" />
              <h2 className="font-display text-2xl font-bold text-destructive mb-2">⚠️ Burnout Risk Detected</h2>
              <p className="text-muted-foreground">High stress for {highStressDays} days and low sleep for {lowSleepDays} days in the last week.</p>
            </>
          ) : (
            <>
              <CheckCircle className="w-16 h-16 text-primary mx-auto mb-4" />
              <h2 className="font-display text-2xl font-bold mb-2">You're Doing Well!</h2>
              <p className="text-muted-foreground">No burnout risk detected. ({recent.length} entries analyzed)</p>
            </>
          )}
        </div>
      </motion.div>
    </DashboardLayout>
  );
}
