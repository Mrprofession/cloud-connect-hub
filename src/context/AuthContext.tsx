import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { User as SupabaseUser } from "@supabase/supabase-js";

export type Role = "student" | "teacher" | "software_professional" | "project_manager" | "examiner";
export type Module = "health" | "productivity" | "compiler" | "ai" | "integration";

interface User {
  id: string;
  email: string;
  name: string;
  role: Role;
  selectedModule: Module;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  selectRole: (role: Role) => Promise<void>;
  selectModule: (module: Module) => Promise<void>;
  signOut: () => Promise<void>;
  pendingUser: { email: string; name: string } | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [pendingUser, setPendingUser] = useState<{ email: string; name: string } | null>(null);

  const fetchProfile = async (supaUser: SupabaseUser) => {
    const { data: profile } = await supabase
      .from("profiles")
      .select("*")
      .eq("user_id", supaUser.id)
      .single();

    if (profile) {
      setUser({
        id: supaUser.id,
        email: supaUser.email || "",
        name: profile.name || "",
        role: profile.role as Role,
        selectedModule: profile.selected_module as Module,
      });
    }
  };

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        // Use setTimeout to avoid Supabase deadlock
        setTimeout(() => fetchProfile(session.user), 0);
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        fetchProfile(session.user);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw new Error(error.message);
  };

  const signUp = async (email: string, password: string, name: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { name } },
    });
    if (error) throw new Error(error.message);
    setPendingUser({ email, name });
  };

  const selectRole = async (role: Role) => {
    const { data: { user: authUser } } = await supabase.auth.getUser();
    if (!authUser) throw new Error("Not authenticated");
    
    const { error } = await supabase
      .from("profiles")
      .update({ role })
      .eq("user_id", authUser.id);
    if (error) throw new Error(error.message);
  };

  const selectModule = async (module: Module) => {
    const { data: { user: authUser } } = await supabase.auth.getUser();
    if (!authUser) throw new Error("Not authenticated");
    
    const { error } = await supabase
      .from("profiles")
      .update({ selected_module: module })
      .eq("user_id", authUser.id);
    if (error) throw new Error(error.message);

    await fetchProfile(authUser);
    setPendingUser(null);
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setPendingUser(null);
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated: !!user,
      loading,
      signIn,
      signUp,
      selectRole,
      selectModule,
      signOut,
      pendingUser,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
