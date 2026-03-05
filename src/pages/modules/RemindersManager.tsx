import { useState } from "react";
import { motion } from "framer-motion";
import { DashboardLayout } from "@/components/DashboardLayout";
import { useData } from "@/context/DataContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Bell, Trash2, CheckCircle, Clock, Plus } from "lucide-react";
import { toast } from "sonner";

export default function RemindersManager() {
  const { data, addReminder, updateReminder, deleteReminder } = useData();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [linkedTaskId, setLinkedTaskId] = useState("");

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !dueDate) { toast.error("Title and due date required"); return; }
    await addReminder({
      title, description, dueDate: new Date(dueDate).toISOString(),
      isCompleted: false, linkedTaskId: linkedTaskId || null,
    });
    setTitle(""); setDescription(""); setDueDate(""); setLinkedTaskId("");
    toast.success("Reminder added!");
  };

  const toggleComplete = async (id: string, current: boolean) => {
    await updateReminder(id, { isCompleted: !current });
  };

  const upcoming = [...data.reminders].filter(r => !r.isCompleted).sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
  const completed = data.reminders.filter(r => r.isCompleted);

  const isOverdue = (date: string) => new Date(date) < new Date();

  return (
    <DashboardLayout>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <h1 className="font-display text-2xl font-bold mb-6">Reminders</h1>

        <form onSubmit={handleAdd} className="glass-card p-4 mb-6 space-y-3">
          <div className="flex gap-3 flex-wrap">
            <Input placeholder="Reminder title" value={title} onChange={e => setTitle(e.target.value)}
              className="bg-secondary border-border flex-1 min-w-[200px]" required />
            <Input type="datetime-local" value={dueDate} onChange={e => setDueDate(e.target.value)}
              className="bg-secondary border-border w-auto" required />
          </div>
          <Input placeholder="Description (optional)" value={description} onChange={e => setDescription(e.target.value)}
            className="bg-secondary border-border" />
          {data.tasks.length > 0 && (
            <select value={linkedTaskId} onChange={e => setLinkedTaskId(e.target.value)}
              className="w-full p-2 bg-secondary border border-border rounded-md text-sm text-foreground">
              <option value="">Link to task (optional)</option>
              {data.tasks.map(t => <option key={t.id} value={t.id}>{t.title}</option>)}
            </select>
          )}
          <Button type="submit" className="bg-primary text-primary-foreground">
            <Plus className="w-4 h-4 mr-1" /> Add Reminder
          </Button>
        </form>

        {upcoming.length > 0 && (
          <div className="mb-6">
            <h2 className="text-sm font-medium text-muted-foreground mb-3">Upcoming ({upcoming.length})</h2>
            <div className="space-y-2">
              {upcoming.map(r => (
                <div key={r.id} className={`glass-card p-4 flex items-center gap-3 ${isOverdue(r.dueDate) ? "border-l-2 border-destructive" : ""}`}>
                  <button onClick={() => toggleComplete(r.id, r.isCompleted)} className="text-muted-foreground hover:text-primary">
                    <Clock className="w-5 h-5" />
                  </button>
                  <div className="flex-1">
                    <div className="font-medium text-sm">{r.title}</div>
                    {r.description && <div className="text-xs text-muted-foreground">{r.description}</div>}
                    <div className={`text-xs mt-1 ${isOverdue(r.dueDate) ? "text-destructive" : "text-muted-foreground"}`}>
                      {isOverdue(r.dueDate) ? "⚠️ Overdue • " : ""}{new Date(r.dueDate).toLocaleString()}
                    </div>
                  </div>
                  <button onClick={() => { deleteReminder(r.id); toast.success("Deleted"); }} className="text-destructive/60 hover:text-destructive">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {completed.length > 0 && (
          <div>
            <h2 className="text-sm font-medium text-muted-foreground mb-3">Completed ({completed.length})</h2>
            <div className="space-y-2">
              {completed.map(r => (
                <div key={r.id} className="glass-card p-4 flex items-center gap-3 opacity-60">
                  <button onClick={() => toggleComplete(r.id, r.isCompleted)} className="text-primary">
                    <CheckCircle className="w-5 h-5" />
                  </button>
                  <div className="flex-1">
                    <div className="font-medium text-sm line-through">{r.title}</div>
                  </div>
                  <button onClick={() => { deleteReminder(r.id); toast.success("Deleted"); }} className="text-destructive/60 hover:text-destructive">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {data.reminders.length === 0 && (
          <div className="glass-card p-8 text-center text-muted-foreground">No reminders yet.</div>
        )}
      </motion.div>
    </DashboardLayout>
  );
}
