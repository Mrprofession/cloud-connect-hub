import { useState } from "react";
import { motion } from "framer-motion";
import { DashboardLayout } from "@/components/DashboardLayout";
import { useData } from "@/context/DataContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { PlusCircle } from "lucide-react";

const categories = ["Food", "Transport", "Entertainment", "Bills", "Shopping", "Health", "Education", "Salary", "Freelance", "Investment", "Other"];

export default function FinanceAdd() {
  const { addFinanceEntry } = useData();
  const [type, setType] = useState<"income" | "expense">("expense");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("Food");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || Number(amount) <= 0) { toast.error("Enter a valid amount"); return; }
    await addFinanceEntry({
      type, amount: Number(amount), category, description,
      date: new Date(date).toISOString(),
    });
    toast.success(`${type === "income" ? "Income" : "Expense"} added!`);
    setAmount("");
    setDescription("");
  };

  return (
    <DashboardLayout>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-xl">
        <h1 className="font-display text-2xl font-bold mb-6">Add Transaction</h1>
        <form onSubmit={handleSubmit} className="glass-card p-6 space-y-4">
          <div className="flex gap-2">
            <Button type="button" variant={type === "expense" ? "default" : "outline"}
              onClick={() => setType("expense")}
              className={type === "expense" ? "bg-destructive text-destructive-foreground flex-1" : "border-border flex-1"}>
              Expense
            </Button>
            <Button type="button" variant={type === "income" ? "default" : "outline"}
              onClick={() => setType("income")}
              className={type === "income" ? "bg-primary text-primary-foreground flex-1" : "border-border flex-1"}>
              Income
            </Button>
          </div>
          <div>
            <label className="text-sm text-muted-foreground mb-1 block">Amount</label>
            <Input type="number" min="0" step="0.01" placeholder="0.00" value={amount}
              onChange={e => setAmount(e.target.value)} className="bg-secondary border-border text-xl font-bold" required />
          </div>
          <div>
            <label className="text-sm text-muted-foreground mb-1 block">Category</label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="bg-secondary border-border"><SelectValue /></SelectTrigger>
              <SelectContent>
                {categories.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="text-sm text-muted-foreground mb-1 block">Description</label>
            <Input placeholder="What was this for?" value={description}
              onChange={e => setDescription(e.target.value)} className="bg-secondary border-border" />
          </div>
          <div>
            <label className="text-sm text-muted-foreground mb-1 block">Date</label>
            <Input type="date" value={date} onChange={e => setDate(e.target.value)} className="bg-secondary border-border" />
          </div>
          <Button type="submit" className="w-full bg-primary text-primary-foreground">
            <PlusCircle className="w-4 h-4 mr-2" /> Add {type === "income" ? "Income" : "Expense"}
          </Button>
        </form>
      </motion.div>
    </DashboardLayout>
  );
}
