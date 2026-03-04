import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Heart, Zap, Code, Brain, Link2, ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";

const modules = [
  { icon: Heart, title: "Healthcare Intelligence", desc: "Track health, detect burnout, monitor wellness", color: "from-rose-500 to-pink-600" },
  { icon: Zap, title: "Productivity Engine", desc: "Tasks, goals, habits & smart analytics", color: "from-amber-500 to-orange-600" },
  { icon: Code, title: "Smart Compiler Lab", desc: "Multi-language code execution & analysis", color: "from-emerald-500 to-teal-600" },
  { icon: Brain, title: "AI Insight Core", desc: "Cross-module intelligence & reports", color: "from-violet-500 to-purple-600" },
  { icon: Link2, title: "Integration Analytics", desc: "Unified performance scoring", color: "from-cyan-500 to-blue-600" },
];

const stats = [
  { label: "Health Logs", value: "12K+" },
  { label: "Tasks Completed", value: "45K+" },
  { label: "Code Executions", value: "89K+" },
  { label: "AI Insights", value: "23K+" },
];

export default function Index() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <div className="absolute inset-0 grid-pattern opacity-30 pointer-events-none" />
      <div className="absolute top-20 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-20 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-[120px] pointer-events-none" />

      <nav className="relative z-10 flex items-center justify-between px-8 py-6 max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <Sparkles className="w-8 h-8 text-primary" />
          <span className="font-display text-2xl font-bold gradient-text">FLOWDUCTIVE</span>
        </div>
        <div className="flex gap-3">
          {isAuthenticated ? (
            <Button onClick={() => navigate("/dashboard")} className="bg-primary text-primary-foreground hover:bg-primary/90">
              Dashboard
            </Button>
          ) : (
            <>
              <Button variant="ghost" onClick={() => navigate("/signin")} className="text-muted-foreground hover:text-foreground">
                Sign In
              </Button>
              <Button onClick={() => navigate("/signup")} className="bg-primary text-primary-foreground hover:bg-primary/90">
                Get Started
              </Button>
            </>
          )}
        </div>
      </nav>

      <section className="relative z-10 flex flex-col items-center text-center px-8 pt-20 pb-32 max-w-5xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/30 bg-primary/5 mb-8">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm text-primary font-medium">A Product by Integraflow Technologies</span>
          </div>
          <h1 className="text-6xl md:text-8xl font-display font-bold tracking-tight mb-6">
            <span className="gradient-text">FLOWDUCTIVE</span>
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto mb-10">
            Your Personal Life Operating System.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Button size="lg" onClick={() => navigate(isAuthenticated ? "/dashboard" : "/signup")}
              className="bg-primary text-primary-foreground hover:bg-primary/90 text-lg px-8 py-6 glow-border">
              Launch Dashboard <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <Button size="lg" variant="outline"
              onClick={() => document.getElementById("features")?.scrollIntoView({ behavior: "smooth" })}
              className="border-border text-foreground hover:bg-secondary text-lg px-8 py-6">
              Explore Platform
            </Button>
          </div>
        </motion.div>
      </section>

      <section className="relative z-10 max-w-5xl mx-auto px-8 pb-20">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat, i) => (
            <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + i * 0.1 }} className="glass-card p-6 text-center">
              <div className="text-3xl font-display font-bold gradient-text">{stat.value}</div>
              <div className="text-sm text-muted-foreground mt-1">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      <section id="features" className="relative z-10 max-w-6xl mx-auto px-8 pb-32">
        <motion.h2 initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
          className="text-4xl font-display font-bold text-center mb-4">
          Five Engines. <span className="gradient-text">One Platform.</span>
        </motion.h2>
        <p className="text-center text-muted-foreground mb-16 max-w-xl mx-auto">
          Health + Productivity + Code + AI + Integration — unified in one intelligent system.
        </p>
        <div className="grid md:grid-cols-3 gap-6">
          {modules.map((mod, i) => (
            <motion.div key={mod.title} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ delay: i * 0.1 }}
              className="glass-card p-8 group hover:glow-border transition-all duration-300 cursor-pointer">
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${mod.color} flex items-center justify-center mb-4`}>
                <mod.icon className="w-6 h-6 text-foreground" />
              </div>
              <h3 className="font-display text-xl font-semibold mb-2">{mod.title}</h3>
              <p className="text-muted-foreground text-sm">{mod.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <footer className="relative z-10 border-t border-border py-8 text-center text-sm text-muted-foreground">
        © 2026 Integraflow Technologies. All rights reserved.
      </footer>
    </div>
  );
}
