import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Sparkles, Heart, Zap, Code, Brain, Link2 } from "lucide-react";
import { useAuth, Module } from "@/context/AuthContext";
import { toast } from "sonner";

const modules: { module: Module; label: string; icon: any; desc: string; color: string }[] = [
  { module: "health", label: "Healthcare Intelligence", icon: Heart, desc: "BMI, sleep, mood, burnout detection & wellness analytics", color: "from-rose-500 to-pink-600" },
  { module: "productivity", label: "Productivity Engine", icon: Zap, desc: "Tasks, habits, focus sessions & productivity scoring", color: "from-amber-500 to-orange-600" },
  { module: "compiler", label: "Smart Compiler Lab", icon: Code, desc: "Multi-language code editor, execution & analysis", color: "from-emerald-500 to-teal-600" },
  { module: "ai", label: "AI Insight Core", icon: Brain, desc: "Cross-module intelligence, reports & smart commands", color: "from-violet-500 to-purple-600" },
  { module: "integration", label: "Integration Analytics", icon: Link2, desc: "Unified dashboard with performance scoring", color: "from-cyan-500 to-blue-600" },
];

export default function ModuleSelection() {
  const { selectModule, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleSelect = async (mod: Module) => {
    if (!isAuthenticated) {
      toast.error("Please sign up first");
      navigate("/signup");
      return;
    }
    try {
      await selectModule(mod);
      navigate("/dashboard");
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center relative overflow-hidden px-4">
      <div className="absolute inset-0 grid-pattern opacity-20 pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-accent/10 rounded-full blur-[100px] pointer-events-none" />

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-2xl relative z-10">
        <div className="flex items-center gap-2 justify-center mb-6">
          <Sparkles className="w-6 h-6 text-primary" />
          <span className="font-display text-xl font-bold gradient-text">FLOWDUCTIVE</span>
        </div>
        <h2 className="font-display text-3xl font-bold text-center mb-2">Choose Your Module</h2>
        <p className="text-muted-foreground text-center text-sm mb-10">Select the module to access on your dashboard</p>

        <div className="grid gap-4">
          {modules.map((m, i) => (
            <motion.button key={m.module} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.08 }} onClick={() => handleSelect(m.module)}
              className="glass-card p-5 flex items-center gap-5 text-left hover:glow-border transition-all group">
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${m.color} flex items-center justify-center shrink-0`}>
                <m.icon className="w-6 h-6 text-foreground" />
              </div>
              <div>
                <div className="font-display font-semibold text-lg">{m.label}</div>
                <div className="text-muted-foreground text-sm">{m.desc}</div>
              </div>
            </motion.button>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
