import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import { DataProvider } from "@/context/DataContext";
import Index from "./pages/Index";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import RoleSelection from "./pages/RoleSelection";
import ModuleSelection from "./pages/ModuleSelection";
import Dashboard from "./pages/Dashboard";
import HealthEntry from "./pages/modules/HealthEntry";
import HealthHistory from "./pages/modules/HealthHistory";
import BurnoutDetection from "./pages/modules/BurnoutDetection";
import Tasks from "./pages/modules/Tasks";
import FocusSession from "./pages/modules/FocusSession";
import CodeEditor from "./pages/modules/CodeEditor";
import AICommands from "./pages/modules/AICommands";
import IntegrationScore from "./pages/modules/IntegrationScore";
import GenericModulePage from "./pages/modules/GenericModulePage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <DataProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/signin" element={<SignIn />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/role-selection" element={<RoleSelection />} />
              <Route path="/module-selection" element={<ModuleSelection />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/dashboard/health/entry" element={<HealthEntry />} />
              <Route path="/dashboard/health/history" element={<HealthHistory />} />
              <Route path="/dashboard/health/burnout" element={<BurnoutDetection />} />
              <Route path="/dashboard/productivity/tasks" element={<Tasks />} />
              <Route path="/dashboard/productivity/focus" element={<FocusSession />} />
              <Route path="/dashboard/productivity/goals" element={<GenericModulePage title="Goals & Habits" description="Track your weekly goals and daily habits." />} />
              <Route path="/dashboard/productivity/analytics" element={<GenericModulePage title="Productivity Analytics" description="Detailed analytics on your productivity trends." />} />
              <Route path="/dashboard/compiler/editor" element={<CodeEditor />} />
              <Route path="/dashboard/compiler/history" element={<GenericModulePage title="Run History" description="View your past code executions." />} />
              <Route path="/dashboard/compiler/analytics" element={<GenericModulePage title="Code Analytics" description="Analyze your coding patterns and performance." />} />
              <Route path="/dashboard/ai/commands" element={<AICommands />} />
              <Route path="/dashboard/ai/report" element={<GenericModulePage title="Weekly Report" description="AI-generated weekly intelligence report." />} />
              <Route path="/dashboard/ai/insights" element={<GenericModulePage title="Insights" description="Smart insights based on your data." />} />
              <Route path="/dashboard/integration/score" element={<IntegrationScore />} />
              <Route path="/dashboard/integration/correlations" element={<GenericModulePage title="Correlations" description="Health-productivity-code correlation analysis." />} />
              <Route path="/dashboard/integration/settings" element={<GenericModulePage title="Settings" description="Integration configuration and preferences." />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </DataProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
