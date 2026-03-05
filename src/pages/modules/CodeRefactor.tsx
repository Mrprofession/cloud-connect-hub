import { useState } from "react";
import { motion } from "framer-motion";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sparkles, Loader2 } from "lucide-react";
import { streamAI } from "@/lib/ai-stream";
import { toast } from "sonner";

export default function CodeRefactor() {
  const [language, setLanguage] = useState("python");
  const [code, setCode] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRefactor = async () => {
    if (!code.trim()) { toast.error("Paste some code first"); return; }
    setLoading(true);
    setResult("");
    let acc = "";
    try {
      await streamAI({
        action: "refactor",
        code,
        language,
        onDelta: (chunk) => { acc += chunk; setResult(acc); },
        onDone: () => setLoading(false),
      });
    } catch (e: any) {
      toast.error(e.message);
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
          <h1 className="font-display text-2xl font-bold">AI Code Refactor</h1>
          <div className="flex gap-2 items-center">
            <Select value={language} onValueChange={setLanguage}>
              <SelectTrigger className="w-28 bg-secondary border-border"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="python">Python</SelectItem>
                <SelectItem value="java">Java</SelectItem>
                <SelectItem value="c">C</SelectItem>
                <SelectItem value="cpp">C++</SelectItem>
                <SelectItem value="javascript">JavaScript</SelectItem>
                <SelectItem value="typescript">TypeScript</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={handleRefactor} disabled={loading} className="bg-primary text-primary-foreground">
              {loading ? <Loader2 className="w-4 h-4 mr-1 animate-spin" /> : <Sparkles className="w-4 h-4 mr-1" />}
              Refactor
            </Button>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="glass-card overflow-hidden">
            <div className="px-4 py-2 border-b border-border text-xs text-muted-foreground">Paste Your Code</div>
            <textarea value={code} onChange={e => setCode(e.target.value)}
              className="w-full h-96 p-4 bg-transparent font-mono text-sm text-foreground resize-none focus:outline-none"
              placeholder="Paste code here to refactor..." spellCheck={false} />
          </div>
          <div className="glass-card overflow-hidden">
            <div className="px-4 py-2 border-b border-border text-xs text-muted-foreground">AI Refactored Result</div>
            <pre className="w-full h-96 p-4 font-mono text-sm text-foreground overflow-auto whitespace-pre-wrap">
              {result || "Refactored code will appear here..."}
            </pre>
          </div>
        </div>
      </motion.div>
    </DashboardLayout>
  );
}
