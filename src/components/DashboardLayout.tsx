import { ReactNode } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { DashboardSidebar } from "@/components/DashboardSidebar";
import { useAuth } from "@/context/AuthContext";

const roleBgClass: Record<string, string> = {
  student: "role-bg-student",
  teacher: "role-bg-teacher",
  software_professional: "role-bg-professional",
  project_manager: "role-bg-manager",
  examiner: "role-bg-examiner",
};

export function DashboardLayout({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const bgClass = user ? roleBgClass[user.role] || "" : "";

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <DashboardSidebar />
        <div className="flex-1 flex flex-col">
          <header className="h-12 flex items-center border-b border-border bg-card/50 backdrop-blur-sm px-2">
            <SidebarTrigger className="ml-2" />
            {user && (
              <div className="ml-4 text-sm text-muted-foreground">
                <span className="capitalize">{user.role.replace("_", " ")}</span>
                <span className="mx-2">•</span>
                <span className="text-primary capitalize">{user.selectedModule}</span>
              </div>
            )}
          </header>
          <main className={`flex-1 relative ${bgClass}`}>
            <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" />
            <div className="relative z-10 p-6">
              {children}
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
