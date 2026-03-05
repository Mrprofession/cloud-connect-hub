import { useState } from "react";
import { motion } from "framer-motion";
import { DashboardLayout } from "@/components/DashboardLayout";
import { useData } from "@/context/DataContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash2, Plus, Edit2, Check } from "lucide-react";
import { toast } from "sonner";

const noteColors = ["default", "blue", "green", "yellow", "pink", "purple"];
const colorMap: Record<string, string> = {
  default: "border-border", blue: "border-blue-500/40", green: "border-emerald-500/40",
  yellow: "border-yellow-500/40", pink: "border-pink-500/40", purple: "border-violet-500/40",
};

export default function NotesManager() {
  const { data, addNote, updateNote, deleteNote } = useData();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [color, setColor] = useState("default");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState("");

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    await addNote({ title, content, color, linkedTaskId: null });
    setTitle(""); setContent(""); setColor("default");
    toast.success("Note added!");
  };

  const handleSaveEdit = async (id: string) => {
    await updateNote(id, { content: editContent });
    setEditingId(null);
    toast.success("Note updated!");
  };

  return (
    <DashboardLayout>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <h1 className="font-display text-2xl font-bold mb-6">Notes</h1>
        <form onSubmit={handleAdd} className="glass-card p-4 mb-6 space-y-3">
          <Input placeholder="Note title" value={title} onChange={e => setTitle(e.target.value)}
            className="bg-secondary border-border" required />
          <textarea value={content} onChange={e => setContent(e.target.value)}
            className="w-full h-20 p-3 bg-secondary border border-border rounded-md text-sm text-foreground resize-none focus:outline-none focus:ring-2 focus:ring-ring"
            placeholder="Write your note..." />
          <div className="flex items-center gap-2">
            {noteColors.map(c => (
              <button key={c} type="button" onClick={() => setColor(c)}
                className={`w-6 h-6 rounded-full border-2 ${colorMap[c]} ${color === c ? "ring-2 ring-primary" : ""}`} />
            ))}
            <Button type="submit" className="ml-auto bg-primary text-primary-foreground">
              <Plus className="w-4 h-4 mr-1" /> Add Note
            </Button>
          </div>
        </form>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {data.notes.map(note => (
            <motion.div key={note.id} layout className={`glass-card p-4 border-l-4 ${colorMap[note.color] || colorMap.default}`}>
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-medium text-sm">{note.title}</h3>
                <div className="flex gap-1">
                  {editingId === note.id ? (
                    <button onClick={() => handleSaveEdit(note.id)} className="text-primary"><Check className="w-4 h-4" /></button>
                  ) : (
                    <button onClick={() => { setEditingId(note.id); setEditContent(note.content); }} className="text-muted-foreground hover:text-foreground">
                      <Edit2 className="w-3 h-3" />
                    </button>
                  )}
                  <button onClick={() => { deleteNote(note.id); toast.success("Note deleted"); }} className="text-destructive/60 hover:text-destructive">
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              </div>
              {editingId === note.id ? (
                <textarea value={editContent} onChange={e => setEditContent(e.target.value)}
                  className="w-full h-16 p-2 bg-secondary border border-border rounded text-xs text-foreground resize-none focus:outline-none" />
              ) : (
                <p className="text-xs text-muted-foreground whitespace-pre-wrap">{note.content}</p>
              )}
              <div className="text-[10px] text-muted-foreground/60 mt-2">
                {new Date(note.updatedAt).toLocaleDateString()}
              </div>
            </motion.div>
          ))}
        </div>
        {data.notes.length === 0 && (
          <div className="glass-card p-8 text-center text-muted-foreground">No notes yet.</div>
        )}
      </motion.div>
    </DashboardLayout>
  );
}
