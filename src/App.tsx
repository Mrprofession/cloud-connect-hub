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
import BMICalculator from "./pages/modules/BMICalculator";
import Tasks from "./pages/modules/Tasks";
import FocusSession from "./pages/modules/FocusSession";
import GoalsHabits from "./pages/modules/GoalsHabits";
import ProductivityAnalytics from "./pages/modules/ProductivityAnalytics";
import FinanceAdd from "./pages/modules/FinanceAdd";
import FinanceHistory from "./pages/modules/FinanceHistory";
import FinanceReports from "./pages/modules/FinanceReports";
import FinanceBudget from "./pages/modules/FinanceBudget";
import CodeEditor from "./pages/modules/CodeEditor";
import CodeRefactor from "./pages/modules/CodeRefactor";
import RunHistory from "./pages/modules/RunHistory";
import AICommands from "./pages/modules/AICommands";
import IntegrationScore from "./pages/modules/IntegrationScore";
import IntegrationCalendar from "./pages/modules/IntegrationCalendar";
import NotesManager from "./pages/modules/NotesManager";
import RemindersManager from "./pages/modules/RemindersManager";
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
              {/* Health */}
              <Route path="/dashboard/health/entry" element={<HealthEntry />} />
              <Route path="/dashboard/health/history" element={<HealthHistory />} />
              <Route path="/dashboard/health/burnout" element={<BurnoutDetection />} />
              <Route path="/dashboard/health/bmi" element={<BMICalculator />} />
              {/* Productivity */}
              <Route path="/dashboard/productivity/tasks" element={<Tasks />} />
              <Route path="/dashboard/productivity/focus" element={<FocusSession />} />
              <Route path="/dashboard/productivity/goals" element={<GoalsHabits />} />
              <Route path="/dashboard/productivity/analytics" element={<ProductivityAnalytics />} />
              {/* Finance */}
              <Route path="/dashboard/finance/add" element={<FinanceAdd />} />
              <Route path="/dashboard/finance/history" element={<FinanceHistory />} />
              <Route path="/dashboard/finance/reports" element={<FinanceReports />} />
              <Route path="/dashboard/finance/budget" element={<FinanceBudget />} />
              {/* Compiler */}
              <Route path="/dashboard/compiler/editor" element={<CodeEditor />} />
              <Route path="/dashboard/compiler/refactor" element={<CodeRefactor />} />
              <Route path="/dashboard/compiler/history" element={<RunHistory />} />
              {/* AI */}
              <Route path="/dashboard/ai/commands" element={<AICommands />} />
              <Route path="/dashboard/ai/report" element={<GenericModulePage title="Weekly Report" description="AI-generated weekly intelligence report." />} />
              <Route path="/dashboard/ai/insights" element={<GenericModulePage title="Insights" description="Smart insights based on your data." />} />
              {/* Integration */}
              <Route path="/dashboard/integration/calendar" element={<IntegrationCalendar />} />
              <Route path="/dashboard/integration/notes" element={<NotesManager />} />
              <Route path="/dashboard/integration/reminders" element={<RemindersManager />} />
              <Route path="/dashboard/integration/score" element={<IntegrationScore />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </DataProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
