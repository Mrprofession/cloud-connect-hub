import { motion } from "framer-motion";
import { DashboardLayout } from "@/components/DashboardLayout";
import { useData } from "@/context/DataContext";
import { CheckCircle, XCircle, Clock, Code } from "lucide-react";

export default function RunHistory() {
  const { data } = useData();
  const sorted = [...data.codeRuns].reverse();

  return (
    <DashboardLayout>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <h1 className="font-display text-2xl font-bold mb-6">Run History</h1>
        {sorted.length === 0 ? (
          <div className="glass-card p-8 text-center text-muted-foreground">No code runs yet. Head to the editor!</div>
        ) : (
          <div className="space-y-2">
            {sorted.map(run => (
              <div key={run.id} className="glass-card p-4 flex items-center gap-4">
                {run.success ? (
                  <CheckCircle className="w-5 h-5 text-primary shrink-0" />
                ) : (
                  <XCircle className="w-5 h-5 text-destructive shrink-0" />
                )}
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm flex items-center gap-2">
                    <Code className="w-3 h-3" />
                    <span className="uppercase text-xs bg-secondary px-2 py-0.5 rounded">{run.language}</span>
                  </div>
                  <div className="text-xs text-muted-foreground mt-1 truncate font-mono">{run.code.substring(0, 80)}...</div>
                </div>
                <div className="text-right shrink-0">
                  <div className="text-xs text-muted-foreground flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {run.executionTime}ms
                  </div>
                  <div className="text-[10px] text-muted-foreground/60">{new Date(run.timestamp).toLocaleString()}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </motion.div>
    </DashboardLayout>
  );
}
