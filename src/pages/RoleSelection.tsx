import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Sparkles, GraduationCap, BookOpen, Code, BarChart3, ClipboardCheck } from "lucide-react";
import { useAuth, Role } from "@/context/AuthContext";
import { toast } from "sonner";

const roles: { role: Role; label: string; icon: any; desc: string; color: string }[] = [
  { role: "student", label: "Student", icon: GraduationCap, desc: "Track your learning, health & productivity", color: "from-indigo-500 to-purple-600" },
  { role: "teacher", label: "Teacher", icon: BookOpen, desc: "Monitor students, analyze performance", color: "from-blue-500 to-slate-600" },
  { role: "software_professional", label: "Software Professional", icon: Code, desc: "KPIs, focus scores & code analytics", color: "from-cyan-500 to-blue-600" },
  { role: "project_manager", label: "Project Manager", icon: BarChart3, desc: "Team metrics, burnout alerts & deadlines", color: "from-emerald-500 to-teal-600" },
  { role: "examiner", label: "External Examiner", icon: ClipboardCheck, desc: "Read-only evaluation & reports", color: "from-gray-400 to-gray-500" },
];

export default function RoleSelection() {
  const { selectRole, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleSelect = async (role: Role) => {
    if (!isAuthenticated) {
      toast.error("Please sign up first");
      navigate("/signup");
      return;
    }
    try {
      await selectRole(role);
      navigate("/module-selection");
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center relative overflow-hidden px-4">
      <div className="absolute inset-0 grid-pattern opacity-20 pointer-events-none" />
      <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-primary/10 rounded-full blur-[100px] pointer-events-none" />

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-2xl relative z-10">
        <div className="flex items-center gap-2 justify-center mb-6">
          <Sparkles className="w-6 h-6 text-primary" />
          <span className="font-display text-xl font-bold gradient-text">FLOWDUCTIVE</span>
        </div>
        <h2 className="font-display text-3xl font-bold text-center mb-2">Select Your Role</h2>
        <p className="text-muted-foreground text-center text-sm mb-10">This determines your dashboard experience</p>

        <div className="grid gap-4">
          {roles.map((r, i) => (
            <motion.button key={r.role} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.08 }} onClick={() => handleSelect(r.role)}
              className="glass-card p-5 flex items-center gap-5 text-left hover:glow-border transition-all group">
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${r.color} flex items-center justify-center shrink-0`}>
                <r.icon className="w-6 h-6 text-foreground" />
              </div>
              <div>
                <div className="font-display font-semibold text-lg">{r.label}</div>
                <div className="text-muted-foreground text-sm">{r.desc}</div>
              </div>
            </motion.button>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
