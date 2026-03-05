import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./AuthContext";

export interface HealthEntry {
  id?: string;
  date: string;
  sleep: number;
  stress: number;
  headache: boolean;
  eyeStrain: boolean;
  mood: string;
  exercise: number;
  water: number;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: "todo" | "in_progress" | "done";
  category: string;
  estimatedTime: number;
  actualTime: number;
  createdAt: string;
}

export interface CodeRun {
  id: string;
  language: string;
  code: string;
  output: string;
  executionTime: number;
  timestamp: string;
  success: boolean;
}

export interface FinanceEntry {
  id: string;
  type: "income" | "expense";
  amount: number;
  category: string;
  description: string;
  date: string;
}

export interface Note {
  id: string;
  title: string;
  content: string;
  linkedTaskId: string | null;
  color: string;
  createdAt: string;
  updatedAt: string;
}

export interface Reminder {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  isCompleted: boolean;
  linkedTaskId: string | null;
  createdAt: string;
}

interface UserData {
  health: HealthEntry[];
  tasks: Task[];
  codeRuns: CodeRun[];
  finance: FinanceEntry[];
  notes: Note[];
  reminders: Reminder[];
  healthScore: number;
  productivityScore: number;
  codeScore: number;
  financeScore: number;
}

interface DataContextType {
  data: UserData;
  addHealthEntry: (entry: Omit<HealthEntry, "id">) => Promise<void>;
  addTask: (task: Omit<Task, "id" | "createdAt">) => Promise<void>;
  updateTask: (id: string, updates: Partial<Task>) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  addCodeRun: (run: Omit<CodeRun, "id" | "timestamp">) => Promise<void>;
  addFinanceEntry: (entry: Omit<FinanceEntry, "id">) => Promise<void>;
  deleteFinanceEntry: (id: string) => Promise<void>;
  addNote: (note: Omit<Note, "id" | "createdAt" | "updatedAt">) => Promise<void>;
  updateNote: (id: string, updates: Partial<Note>) => Promise<void>;
  deleteNote: (id: string) => Promise<void>;
  addReminder: (reminder: Omit<Reminder, "id" | "createdAt">) => Promise<void>;
  updateReminder: (id: string, updates: Partial<Reminder>) => Promise<void>;
  deleteReminder: (id: string) => Promise<void>;
  refreshData: () => Promise<void>;
}

const defaultData: UserData = {
  health: [], tasks: [], codeRuns: [], finance: [], notes: [], reminders: [],
  healthScore: 0, productivityScore: 0, codeScore: 0, financeScore: 0,
};

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [data, setData] = useState<UserData>(defaultData);

  const calculateScores = (health: HealthEntry[], tasks: Task[], codeRuns: CodeRun[], finance: FinanceEntry[]) => {
    let healthScore = 0;
    if (health.length > 0) {
      const latest = health[health.length - 1];
      healthScore = Math.min(100, Math.max(0,
        (latest.sleep * 8) - (latest.stress * 5) - (latest.eyeStrain ? 10 : 0) + (latest.exercise * 2) + (latest.water * 3)
      ));
    }
    const doneTasks = tasks.filter(t => t.status === "done").length;
    const productivityScore = tasks.length > 0 ? Math.round((doneTasks / tasks.length) * 100) : 0;
    const successRuns = codeRuns.filter(r => r.success).length;
    const codeScore = codeRuns.length > 0 ? Math.round((successRuns / codeRuns.length) * 100) : 0;
    const income = finance.filter(f => f.type === "income").reduce((s, f) => s + f.amount, 0);
    const expense = finance.filter(f => f.type === "expense").reduce((s, f) => s + f.amount, 0);
    const financeScore = income > 0 ? Math.min(100, Math.round(((income - expense) / income) * 100)) : 0;
    return { healthScore, productivityScore, codeScore, financeScore };
  };

  const refreshData = useCallback(async () => {
    if (!user) { setData(defaultData); return; }

    const [healthRes, tasksRes, codeRes, financeRes, notesRes, remindersRes] = await Promise.all([
      supabase.from("health_entries").select("*").eq("user_id", user.id).order("created_at"),
      supabase.from("tasks").select("*").eq("user_id", user.id).order("created_at"),
      supabase.from("code_runs").select("*").eq("user_id", user.id).order("created_at"),
      supabase.from("finance_entries").select("*").eq("user_id", user.id).order("created_at"),
      supabase.from("notes" as any).select("*").eq("user_id", user.id).order("created_at"),
      supabase.from("reminders" as any).select("*").eq("user_id", user.id).order("due_date"),
    ]);

    const health: HealthEntry[] = (healthRes.data || []).map((h: any) => ({
      id: h.id, date: h.date, sleep: Number(h.sleep), stress: Number(h.stress),
      headache: h.headache, eyeStrain: h.eye_strain, mood: h.mood,
      exercise: Number(h.exercise), water: Number(h.water),
    }));
    const tasks: Task[] = (tasksRes.data || []).map((t: any) => ({
      id: t.id, title: t.title, description: t.description,
      status: t.status as Task["status"], category: t.category,
      estimatedTime: Number(t.estimated_time), actualTime: Number(t.actual_time),
      createdAt: t.created_at,
    }));
    const codeRuns: CodeRun[] = (codeRes.data || []).map((c: any) => ({
      id: c.id, language: c.language, code: c.code, output: c.output,
      executionTime: Number(c.execution_time), timestamp: c.created_at, success: c.success,
    }));
    const finance: FinanceEntry[] = (financeRes.data || []).map((f: any) => ({
      id: f.id, type: f.type as FinanceEntry["type"], amount: Number(f.amount),
      category: f.category, description: f.description, date: f.date,
    }));
    const notes: Note[] = ((notesRes.data as any[]) || []).map((n: any) => ({
      id: n.id, title: n.title, content: n.content,
      linkedTaskId: n.linked_task_id, color: n.color,
      createdAt: n.created_at, updatedAt: n.updated_at,
    }));
    const reminders: Reminder[] = ((remindersRes.data as any[]) || []).map((r: any) => ({
      id: r.id, title: r.title, description: r.description,
      dueDate: r.due_date, isCompleted: r.is_completed,
      linkedTaskId: r.linked_task_id, createdAt: r.created_at,
    }));

    const scores = calculateScores(health, tasks, codeRuns, finance);
    setData({ health, tasks, codeRuns, finance, notes, reminders, ...scores });
  }, [user]);

  useEffect(() => { refreshData(); }, [refreshData]);

  const addHealthEntry = async (entry: Omit<HealthEntry, "id">) => {
    if (!user) return;
    await supabase.from("health_entries").insert({
      user_id: user.id, date: entry.date, sleep: entry.sleep, stress: entry.stress,
      headache: entry.headache, eye_strain: entry.eyeStrain, mood: entry.mood,
      exercise: entry.exercise, water: entry.water,
    });
    await refreshData();
  };

  const addTask = async (task: Omit<Task, "id" | "createdAt">) => {
    if (!user) return;
    await supabase.from("tasks").insert({
      user_id: user.id, title: task.title, description: task.description,
      status: task.status, category: task.category,
      estimated_time: task.estimatedTime, actual_time: task.actualTime,
    });
    await refreshData();
  };

  const updateTask = async (id: string, updates: Partial<Task>) => {
    if (!user) return;
    const dbUpdates: Record<string, unknown> = {};
    if (updates.title !== undefined) dbUpdates.title = updates.title;
    if (updates.description !== undefined) dbUpdates.description = updates.description;
    if (updates.status !== undefined) dbUpdates.status = updates.status;
    if (updates.category !== undefined) dbUpdates.category = updates.category;
    if (updates.estimatedTime !== undefined) dbUpdates.estimated_time = updates.estimatedTime;
    if (updates.actualTime !== undefined) dbUpdates.actual_time = updates.actualTime;
    await supabase.from("tasks").update(dbUpdates).eq("id", id);
    await refreshData();
  };

  const deleteTask = async (id: string) => {
    if (!user) return;
    await supabase.from("tasks").delete().eq("id", id);
    await refreshData();
  };

  const addCodeRun = async (run: Omit<CodeRun, "id" | "timestamp">) => {
    if (!user) return;
    await supabase.from("code_runs").insert({
      user_id: user.id, language: run.language, code: run.code,
      output: run.output, execution_time: run.executionTime, success: run.success,
    });
    await refreshData();
  };

  const addFinanceEntry = async (entry: Omit<FinanceEntry, "id">) => {
    if (!user) return;
    await supabase.from("finance_entries").insert({
      user_id: user.id, type: entry.type, amount: entry.amount,
      category: entry.category, description: entry.description, date: entry.date,
    });
    await refreshData();
  };

  const deleteFinanceEntry = async (id: string) => {
    if (!user) return;
    await supabase.from("finance_entries").delete().eq("id", id);
    await refreshData();
  };

  const addNote = async (note: Omit<Note, "id" | "createdAt" | "updatedAt">) => {
    if (!user) return;
    await (supabase.from("notes" as any) as any).insert({
      user_id: user.id, title: note.title, content: note.content,
      linked_task_id: note.linkedTaskId, color: note.color,
    });
    await refreshData();
  };

  const updateNote = async (id: string, updates: Partial<Note>) => {
    if (!user) return;
    const dbUpdates: Record<string, unknown> = {};
    if (updates.title !== undefined) dbUpdates.title = updates.title;
    if (updates.content !== undefined) dbUpdates.content = updates.content;
    if (updates.color !== undefined) dbUpdates.color = updates.color;
    if (updates.linkedTaskId !== undefined) dbUpdates.linked_task_id = updates.linkedTaskId;
    await (supabase.from("notes" as any) as any).update(dbUpdates).eq("id", id);
    await refreshData();
  };

  const deleteNote = async (id: string) => {
    if (!user) return;
    await (supabase.from("notes" as any) as any).delete().eq("id", id);
    await refreshData();
  };

  const addReminder = async (reminder: Omit<Reminder, "id" | "createdAt">) => {
    if (!user) return;
    await (supabase.from("reminders" as any) as any).insert({
      user_id: user.id, title: reminder.title, description: reminder.description,
      due_date: reminder.dueDate, is_completed: reminder.isCompleted,
      linked_task_id: reminder.linkedTaskId,
    });
    await refreshData();
  };

  const updateReminder = async (id: string, updates: Partial<Reminder>) => {
    if (!user) return;
    const dbUpdates: Record<string, unknown> = {};
    if (updates.title !== undefined) dbUpdates.title = updates.title;
    if (updates.description !== undefined) dbUpdates.description = updates.description;
    if (updates.dueDate !== undefined) dbUpdates.due_date = updates.dueDate;
    if (updates.isCompleted !== undefined) dbUpdates.is_completed = updates.isCompleted;
    if (updates.linkedTaskId !== undefined) dbUpdates.linked_task_id = updates.linkedTaskId;
    await (supabase.from("reminders" as any) as any).update(dbUpdates).eq("id", id);
    await refreshData();
  };

  const deleteReminder = async (id: string) => {
    if (!user) return;
    await (supabase.from("reminders" as any) as any).delete().eq("id", id);
    await refreshData();
  };

  return (
    <DataContext.Provider value={{
      data, addHealthEntry, addTask, updateTask, deleteTask, addCodeRun,
      addFinanceEntry, deleteFinanceEntry,
      addNote, updateNote, deleteNote,
      addReminder, updateReminder, deleteReminder,
      refreshData,
    }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error("useData must be used within DataProvider");
  return ctx;
}
