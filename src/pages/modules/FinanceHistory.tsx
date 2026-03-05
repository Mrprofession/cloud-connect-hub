import { motion } from "framer-motion";
import { DashboardLayout } from "@/components/DashboardLayout";
import { useData } from "@/context/DataContext";
import { Trash2, ArrowUpCircle, ArrowDownCircle } from "lucide-react";
import { toast } from "sonner";

export default function FinanceHistory() {
  const { data, deleteFinanceEntry } = useData();

  const handleDelete = async (id: string) => {
    await deleteFinanceEntry(id);
    toast.success("Entry deleted");
  };

  const sorted = [...data.finance].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <DashboardLayout>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <h1 className="font-display text-2xl font-bold mb-6">Transaction History</h1>
        {sorted.length === 0 ? (
          <div className="glass-card p-8 text-center text-muted-foreground">No transactions yet.</div>
        ) : (
          <div className="space-y-2">
            {sorted.map(entry => (
              <div key={entry.id} className="glass-card p-4 flex items-center gap-4">
                {entry.type === "income" ? (
                  <ArrowUpCircle className="w-5 h-5 text-primary shrink-0" />
                ) : (
                  <ArrowDownCircle className="w-5 h-5 text-destructive shrink-0" />
                )}
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm truncate">{entry.description || entry.category}</div>
                  <div className="text-xs text-muted-foreground">{entry.category} • {new Date(entry.date).toLocaleDateString()}</div>
                </div>
                <div className={`font-display font-bold text-sm ${entry.type === "income" ? "text-primary" : "text-destructive"}`}>
                  {entry.type === "income" ? "+" : "-"}${entry.amount.toFixed(2)}
                </div>
                <button onClick={() => handleDelete(entry.id)} className="text-destructive/60 hover:text-destructive">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </motion.div>
    </DashboardLayout>
  );
}
