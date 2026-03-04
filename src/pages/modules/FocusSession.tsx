import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Play, Pause, RotateCcw } from "lucide-react";

export default function FocusSession() {
  const [duration, setDuration] = useState(25 * 60);
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [running, setRunning] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (running && timeLeft > 0) {
      intervalRef.current = setInterval(() => setTimeLeft(t => t - 1), 1000);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [running, timeLeft]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const progress = ((duration - timeLeft) / duration) * 100;

  return (
    <DashboardLayout>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-md mx-auto text-center">
        <h1 className="font-display text-2xl font-bold mb-8">Focus Session</h1>
        <div className="glass-card glow-border p-12 mb-6">
          <div className="text-6xl font-display font-bold gradient-text mb-4">
            {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
          </div>
          <div className="w-full bg-secondary rounded-full h-2 mb-6">
            <div className="h-2 rounded-full bg-gradient-to-r from-primary to-accent transition-all" style={{ width: `${progress}%` }} />
          </div>
          <div className="flex gap-3 justify-center">
            <Button onClick={() => setRunning(!running)} className="bg-primary text-primary-foreground">
              {running ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
            </Button>
            <Button variant="outline" onClick={() => { setRunning(false); setTimeLeft(duration); }} className="border-border">
              <RotateCcw className="w-5 h-5" />
            </Button>
          </div>
        </div>
        <div className="flex gap-2 justify-center">
          {[15, 25, 45, 60].map(m => (
            <Button key={m} variant="ghost" size="sm" onClick={() => { setDuration(m * 60); setTimeLeft(m * 60); setRunning(false); }}
              className={`text-xs ${duration === m * 60 ? "text-primary" : "text-muted-foreground"}`}>
              {m}min
            </Button>
          ))}
        </div>
      </motion.div>
    </DashboardLayout>
  );
}
