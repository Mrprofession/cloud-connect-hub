import { motion, useScroll, useTransform } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Heart, Zap, Code, Brain, Link2, ArrowRight, Sparkles, DollarSign, Shield, Users, BarChart3, Layers } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { useEffect, useRef, useState } from "react";

const modules = [
  { icon: Heart, title: "Healthcare Monitor", desc: "BMI, sleep, mood tracking & wellness analytics", color: "from-rose-500 to-pink-600" },
  { icon: Zap, title: "Productivity Intelligence", desc: "Tasks, goals, habits & smart productivity scoring", color: "from-amber-500 to-orange-600" },
  { icon: DollarSign, title: "Finance Tracker", desc: "Expense tracking, budgets & financial reports", color: "from-yellow-500 to-amber-600" },
  { icon: Code, title: "AI Compiler Lab", desc: "Multi-language code editor, execution & AI refactoring", color: "from-emerald-500 to-teal-600" },
  { icon: Brain, title: "AI Insight Core", desc: "Cross-module intelligence & smart reports", color: "from-violet-500 to-purple-600" },
  { icon: Link2, title: "Integration Hub", desc: "Calendar, notes, reminders & cross-module links", color: "from-cyan-500 to-blue-600" },
];

const stats = [
  { label: "Tasks Completed", value: 45000 },
  { label: "Code Executions", value: 89000 },
  { label: "Health Logs", value: 12000 },
  { label: "Productivity Insights", value: 23000 },
  { label: "Finance Records", value: 34000 },
];

const whyReasons = [
  { icon: Layers, title: "Unified Platform", desc: "Stop juggling 10 apps. Health, productivity, finance, code — one intelligent system." },
  { icon: Shield, title: "Enterprise Security", desc: "Bank-grade encryption, row-level security, and isolated data per user." },
  { icon: Users, title: "Role-Based Access", desc: "Students, teachers, developers, managers — each gets a tailored experience." },
  { icon: BarChart3, title: "AI-Powered Insights", desc: "Cross-module analytics powered by AI detect burnout, track trends, and suggest actions." },
];

function AnimatedCounter({ target, suffix = "" }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setStarted(true); }, { threshold: 0.5 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    if (!started) return;
    const duration = 2000;
    const steps = 60;
    const increment = target / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) { setCount(target); clearInterval(timer); }
      else setCount(Math.floor(current));
    }, duration / steps);
    return () => clearInterval(timer);
  }, [started, target]);

  const formatted = count >= 1000 ? `${(count / 1000).toFixed(count >= target ? 0 : 1)}K+` : `${count}${suffix}`;
  return <div ref={ref} className="text-3xl md:text-4xl font-display font-bold gradient-text">{formatted}</div>;
}

function WaveBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <svg className="absolute bottom-0 w-full h-64 opacity-10" viewBox="0 0 1440 320" preserveAspectRatio="none">
        <motion.path
          d="M0,160L48,170.7C96,181,192,203,288,192C384,181,480,139,576,138.7C672,139,768,181,864,186.7C960,192,1056,160,1152,149.3C1248,139,1344,149,1392,154.7L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          fill="hsl(var(--primary))"
          animate={{ d: [
            "M0,160L48,170.7C96,181,192,203,288,192C384,181,480,139,576,138.7C672,139,768,181,864,186.7C960,192,1056,160,1152,149.3C1248,139,1344,149,1392,154.7L1440,160L1440,320L0,320Z",
            "M0,192L48,186.7C96,181,192,171,288,181.3C384,192,480,224,576,213.3C672,203,768,149,864,128C960,107,1056,117,1152,144C1248,171,1344,213,1392,234.7L1440,256L1440,320L0,320Z",
            "M0,160L48,170.7C96,181,192,203,288,192C384,181,480,139,576,138.7C672,139,768,181,864,186.7C960,192,1056,160,1152,149.3C1248,139,1344,149,1392,154.7L1440,160L1440,320L0,320Z",
          ] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
      </svg>
      <svg className="absolute bottom-0 w-full h-48 opacity-5" viewBox="0 0 1440 320" preserveAspectRatio="none">
        <motion.path
          d="M0,224L48,213.3C96,203,192,181,288,186.7C384,192,480,224,576,229.3C672,235,768,213,864,208C960,203,1056,213,1152,218.7C1248,224,1344,224,1392,224L1440,224L1440,320L0,320Z"
          fill="hsl(var(--accent))"
          animate={{ d: [
            "M0,224L48,213.3C96,203,192,181,288,186.7C384,192,480,224,576,229.3C672,235,768,213,864,208C960,203,1056,213,1152,218.7C1248,224,1344,224,1392,224L1440,224L1440,320L0,320Z",
            "M0,256L48,245.3C96,235,192,213,288,202.7C384,192,480,192,576,202.7C672,213,768,235,864,240C960,245,1056,235,1152,224C1248,213,1344,203,1392,197.3L1440,192L1440,320L0,320Z",
            "M0,224L48,213.3C96,203,192,181,288,186.7C384,192,480,224,576,229.3C672,235,768,213,864,208C960,203,1056,213,1152,218.7C1248,224,1344,224,1392,224L1440,224L1440,320L0,320Z",
          ] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
      </svg>
    </div>
  );
}

export default function Index() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <div className="absolute inset-0 grid-pattern opacity-20 pointer-events-none" />
      <div className="absolute top-20 left-1/4 w-[500px] h-[500px] bg-primary/8 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-40 right-1/4 w-[400px] h-[400px] bg-accent/8 rounded-full blur-[150px] pointer-events-none" />
      <WaveBackground />

      {/* Nav */}
      <nav className="relative z-10 flex items-center justify-between px-6 md:px-8 py-5 max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <Sparkles className="w-7 h-7 text-primary" />
          <span className="font-display text-xl md:text-2xl font-bold gradient-text">FLOWDUCTIVE</span>
        </div>
        <div className="flex gap-2">
          {isAuthenticated ? (
            <Button onClick={() => navigate("/dashboard")} className="bg-primary text-primary-foreground hover:bg-primary/90">Dashboard</Button>
          ) : (
            <>
              <Button variant="ghost" onClick={() => navigate("/signin")} className="text-muted-foreground hover:text-foreground">Sign In</Button>
              <Button onClick={() => navigate("/signup")} className="bg-primary text-primary-foreground hover:bg-primary/90">Get Started</Button>
            </>
          )}
        </div>
      </nav>

      {/* Hero */}
      <section className="relative z-10 flex flex-col items-center text-center px-6 pt-16 pb-28 max-w-5xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/30 bg-primary/5 mb-8">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm text-primary font-medium">A Product by Integraflow Technologies</span>
          </div>
          <h1 className="text-5xl sm:text-6xl md:text-8xl font-display font-bold tracking-tight mb-6">
            <span className="gradient-text">FLOWDUCTIVE</span>
          </h1>
          <p className="text-lg md:text-2xl text-muted-foreground max-w-2xl mx-auto mb-10">
            Your Personal Life Operating System.
          </p>
          <div className="flex gap-3 justify-center flex-wrap">
            <Button size="lg" onClick={() => navigate(isAuthenticated ? "/dashboard" : "/signup")}
              className="bg-primary text-primary-foreground hover:bg-primary/90 text-base md:text-lg px-6 md:px-8 py-5 md:py-6 glow-border">
              Launch Dashboard <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <Button size="lg" variant="outline"
              onClick={() => document.getElementById("features")?.scrollIntoView({ behavior: "smooth" })}
              className="border-border text-foreground hover:bg-secondary text-base md:text-lg px-6 md:px-8 py-5 md:py-6">
              Explore Platform
            </Button>
          </div>
        </motion.div>
      </section>

      {/* Stats */}
      <section className="relative z-10 max-w-6xl mx-auto px-6 pb-20">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {stats.map((stat, i) => (
            <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="glass-card p-5 text-center">
              <AnimatedCounter target={stat.value} />
              <div className="text-xs text-muted-foreground mt-1">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section id="features" className="relative z-10 max-w-6xl mx-auto px-6 pb-24">
        <motion.h2 initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
          className="text-3xl md:text-4xl font-display font-bold text-center mb-4">
          Six Engines. <span className="gradient-text">One Platform.</span>
        </motion.h2>
        <p className="text-center text-muted-foreground mb-14 max-w-xl mx-auto">
          Health + Productivity + Finance + Code + AI + Integration — unified in one intelligent system.
        </p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {modules.map((mod, i) => (
            <motion.div key={mod.title} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ delay: i * 0.08 }}
              className="glass-card p-7 group hover:glow-border transition-all duration-300 cursor-pointer">
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${mod.color} flex items-center justify-center mb-4`}>
                <mod.icon className="w-6 h-6 text-foreground" />
              </div>
              <h3 className="font-display text-lg font-semibold mb-2">{mod.title}</h3>
              <p className="text-muted-foreground text-sm">{mod.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Why Flowductive */}
      <section className="relative z-10 max-w-6xl mx-auto px-6 pb-24">
        <motion.h2 initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
          className="text-3xl md:text-4xl font-display font-bold text-center mb-4">
          Why <span className="gradient-text">FLOWDUCTIVE</span>?
        </motion.h2>
        <p className="text-center text-muted-foreground mb-14 max-w-xl mx-auto">
          One intelligent system that unifies your entire life management into a single powerful platform.
        </p>
        <div className="grid sm:grid-cols-2 gap-5">
          {whyReasons.map((reason, i) => (
            <motion.div key={reason.title} initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
              whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
              className="glass-card p-7 flex gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                <reason.icon className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="font-display text-lg font-semibold mb-1">{reason.title}</h3>
                <p className="text-muted-foreground text-sm">{reason.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-border py-8 text-center text-sm text-muted-foreground">
        © 2026 Integraflow Technologies. All rights reserved.
      </footer>
    </div>
  );
}
