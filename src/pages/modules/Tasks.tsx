import { useState } from "react";
import { motion } from "framer-motion";
import { DashboardLayout } from "@/components/DashboardLayout";
import { useData } from "@/context/DataContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash2, CheckCircle, Clock } from "lucide-react";
import { toast } from "sonner";

export default function Tasks() {
  const { data, addTask, updateTask, deleteTask } = useData();
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [estTime, setEstTime] = useState("30");

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    await addTask({ title, description: desc, status: "todo", category: "general", estimatedTime: Number(estTime), actualTime: 0 });
    setTitle(""); setDesc("");
    toast.success("Task added!");
  };

  const statusColors: Record<string, string> = { todo: "text-muted-foreground", in_progress: "text-amber-400", done: "text-primary" };

  return (
    <DashboardLayout>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <h1 className="font-display text-2xl font-bold mb-6">Tasks</h1>
        <form onSubmit={handleAdd} className="glass-card p-4 mb-6 flex gap-3 flex-wrap">
          <Input placeholder="Task title" value={title} onChange={e => setTitle(e.target.value)} className="bg-secondary border-border flex-1 min-w-[200px]" required />
          <Input placeholder="Description" value={desc} onChange={e => setDesc(e.target.value)} className="bg-secondary border-border flex-1 min-w-[200px]" />
          <Input type="number" placeholder="Est. min" value={estTime} onChange={e => setEstTime(e.target.value)} className="bg-secondary border-border w-24" />
          <Button type="submit" className="bg-primary text-primary-foreground">Add</Button>
        </form>

        <div className="space-y-2">
          {data.tasks.length === 0 && <div className="glass-card p-8 text-center text-muted-foreground">No tasks yet.</div>}
          {data.tasks.map(task => (
            <div key={task.id} className="glass-card p-4 flex items-center gap-4">
              <button onClick={() => {
                const next = task.status === "todo" ? "in_progress" : task.status === "in_progress" ? "done" : "todo";
                updateTask(task.id, { status: next as any });
              }} className={statusColors[task.status]}>
                {task.status === "done" ? <CheckCircle className="w-5 h-5" /> : <Clock className="w-5 h-5" />}
              </button>
              <div className="flex-1">
                <div className={`font-medium text-sm ${task.status === "done" ? "line-through text-muted-foreground" : ""}`}>{task.title}</div>
                {task.description && <div className="text-xs text-muted-foreground">{task.description}</div>}
              </div>
              <span className="text-xs text-muted-foreground capitalize">{task.status.replace("_", " ")}</span>
              <button onClick={() => deleteTask(task.id)} className="text-destructive hover:text-destructive/80">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </motion.div>
    </DashboardLayout>
  );
}
