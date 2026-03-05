import { useNavigate, Link } from "react-router-dom";
import {
  Heart, Zap, Code, Brain, Link2, LogOut, Sparkles, Home,
  Activity, ListTodo, Timer, Target, BarChart3, FileCode, Terminal,
  Lightbulb, MessageSquare, TrendingUp, PieChart, Settings,
  DollarSign, Receipt, Wallet, Calendar, StickyNote, Bell,
} from "lucide-react";
import { useAuth, Module } from "@/context/AuthContext";
import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupLabel,
  SidebarGroupContent, SidebarMenu, SidebarMenuItem, SidebarMenuButton,
} from "@/components/ui/sidebar";
import { NavLink } from "@/components/NavLink";

const moduleConfig: Record<Module, { label: string; icon: any; color: string; subItems: { title: string; path: string; icon: any }[] }> = {
  health: {
    label: "Healthcare Monitor",
    icon: Heart,
    color: "text-rose-400",
    subItems: [
      { title: "Dashboard", path: "/dashboard", icon: Home },
      { title: "Daily Entry", path: "/dashboard/health/entry", icon: Activity },
      { title: "Health History", path: "/dashboard/health/history", icon: BarChart3 },
      { title: "Burnout Detection", path: "/dashboard/health/burnout", icon: TrendingUp },
      { title: "BMI Calculator", path: "/dashboard/health/bmi", icon: Target },
    ],
  },
  productivity: {
    label: "Productivity Intelligence",
    icon: Zap,
    color: "text-amber-400",
    subItems: [
      { title: "Dashboard", path: "/dashboard", icon: Home },
      { title: "Tasks", path: "/dashboard/productivity/tasks", icon: ListTodo },
      { title: "Focus Session", path: "/dashboard/productivity/focus", icon: Timer },
      { title: "Goals & Habits", path: "/dashboard/productivity/goals", icon: Target },
      { title: "Analytics", path: "/dashboard/productivity/analytics", icon: PieChart },
    ],
  },
  finance: {
    label: "Finance Tracker",
    icon: DollarSign,
    color: "text-yellow-400",
    subItems: [
      { title: "Dashboard", path: "/dashboard", icon: Home },
      { title: "Add Transaction", path: "/dashboard/finance/add", icon: Receipt },
      { title: "History", path: "/dashboard/finance/history", icon: Wallet },
      { title: "Reports", path: "/dashboard/finance/reports", icon: PieChart },
      { title: "Budget Planner", path: "/dashboard/finance/budget", icon: Target },
    ],
  },
  compiler: {
    label: "AI Compiler Lab",
    icon: Code,
    color: "text-emerald-400",
    subItems: [
      { title: "Dashboard", path: "/dashboard", icon: Home },
      { title: "Code Editor", path: "/dashboard/compiler/editor", icon: FileCode },
      { title: "AI Refactor", path: "/dashboard/compiler/refactor", icon: Lightbulb },
      { title: "Run History", path: "/dashboard/compiler/history", icon: Terminal },
    ],
  },
  ai: {
    label: "AI Insight Core",
    icon: Brain,
    color: "text-violet-400",
    subItems: [
      { title: "Dashboard", path: "/dashboard", icon: Home },
      { title: "Smart Chat", path: "/dashboard/ai/commands", icon: MessageSquare },
      { title: "Weekly Report", path: "/dashboard/ai/report", icon: FileCode },
      { title: "Insights", path: "/dashboard/ai/insights", icon: Lightbulb },
    ],
  },
  integration: {
    label: "Integration Hub",
    icon: Link2,
    color: "text-cyan-400",
    subItems: [
      { title: "Dashboard", path: "/dashboard", icon: Home },
      { title: "Calendar", path: "/dashboard/integration/calendar", icon: Calendar },
      { title: "Notes", path: "/dashboard/integration/notes", icon: StickyNote },
      { title: "Reminders", path: "/dashboard/integration/reminders", icon: Bell },
      { title: "Performance", path: "/dashboard/integration/score", icon: TrendingUp },
    ],
  },
};

export function DashboardSidebar() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  if (!user) return null;

  const config = moduleConfig[user.selectedModule];
  const ModIcon = config.icon;

  const handleSignOut = async () => { await signOut(); navigate("/"); };

  return (
    <Sidebar className="border-r border-sidebar-border bg-sidebar">
      <SidebarContent className="flex flex-col h-full">
        <div className="p-4 border-b border-sidebar-border">
          <Link to="/dashboard" className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            <span className="font-display text-lg font-bold gradient-text">FLOWDUCTIVE</span>
          </Link>
        </div>
        <div className="px-4 py-3 border-b border-sidebar-border">
          <div className="flex items-center gap-2">
            <ModIcon className={`w-4 h-4 ${config.color}`} />
            <span className="text-xs font-medium text-sidebar-foreground truncate">{config.label}</span>
          </div>
          <button onClick={() => navigate("/module-selection")} className="text-[10px] text-primary hover:underline mt-1">
            Switch Module
          </button>
        </div>
        <SidebarGroup className="flex-1">
          <SidebarGroupLabel className="text-sidebar-foreground/60 text-xs px-4">Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {config.subItems.map(item => (
                <SidebarMenuItem key={item.path}>
                  <SidebarMenuButton asChild>
                    <NavLink to={item.path} end={item.path === "/dashboard"}
                      className="flex items-center gap-3 px-4 py-2 text-sm text-sidebar-foreground hover:bg-sidebar-accent rounded-md transition-colors"
                      activeClassName="bg-sidebar-accent text-primary font-medium">
                      <item.icon className="w-4 h-4" />
                      <span>{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <div className="p-4 border-t border-sidebar-border">
          <div className="text-xs text-sidebar-foreground/60 mb-1 truncate">{user.name}</div>
          <div className="text-[10px] text-sidebar-foreground/40 mb-3 truncate">{user.email}</div>
          <button onClick={handleSignOut}
            className="flex items-center gap-2 text-xs text-destructive hover:text-destructive/80 transition-colors">
            <LogOut className="w-3 h-3" /> Sign Out
          </button>
        </div>
      </SidebarContent>
    </Sidebar>
  );
}
