import { useState } from "react";
import { motion } from "framer-motion";
import { DashboardLayout } from "@/components/DashboardLayout";
import { useData } from "@/context/DataContext";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Play } from "lucide-react";

const templates: Record<string, string> = {
  python: `# Python\nprint("Hello, World!")`,
  java: `// Java\npublic class Main {\n  public static void main(String[] args) {\n    System.out.println("Hello, World!");\n  }\n}`,
  c: `// C\n#include <stdio.h>\nint main() {\n  printf("Hello, World!\\n");\n  return 0;\n}`,
  cpp: `// C++\n#include <iostream>\nint main() {\n  std::cout << "Hello, World!" << std::endl;\n  return 0;\n}`,
};

const langMap: Record<string, string> = { python: "python3", java: "java", c: "c", cpp: "cpp" };

export default function CodeEditor() {
  const { addCodeRun } = useData();
  const [language, setLanguage] = useState("python");
  const [code, setCode] = useState(templates.python);
  const [output, setOutput] = useState("");
  const [running, setRunning] = useState(false);

  const handleRun = async () => {
    setRunning(true);
    setOutput("Running...");
    const start = Date.now();
    try {
      const res = await fetch("https://emkc.org/api/v2/piston/execute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ language: langMap[language], version: "*", files: [{ content: code }] }),
      });
      const data = await res.json();
      const elapsed = Date.now() - start;
      const result = data.run?.output || data.run?.stderr || "No output";
      const success = !data.run?.stderr;
      setOutput(result);
      await addCodeRun({ language, code, output: result, executionTime: elapsed, success });
      toast.success(`Executed in ${elapsed}ms`);
    } catch {
      setOutput("Error: Could not connect to execution service");
      await addCodeRun({ language, code, output: "Connection error", executionTime: Date.now() - start, success: false });
    } finally {
      setRunning(false);
    }
  };

  return (
    <DashboardLayout>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <div className="flex items-center justify-between mb-4">
          <h1 className="font-display text-2xl font-bold">Code Editor</h1>
          <div className="flex gap-3 items-center">
            <Select value={language} onValueChange={v => { setLanguage(v); setCode(templates[v]); }}>
              <SelectTrigger className="w-32 bg-secondary border-border"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="python">Python</SelectItem>
                <SelectItem value="java">Java</SelectItem>
                <SelectItem value="c">C</SelectItem>
                <SelectItem value="cpp">C++</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={handleRun} disabled={running} className="bg-primary text-primary-foreground">
              <Play className="w-4 h-4 mr-1" /> {running ? "Running..." : "Run"}
            </Button>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="glass-card overflow-hidden">
            <div className="px-4 py-2 border-b border-border text-xs text-muted-foreground">Editor</div>
            <textarea value={code} onChange={e => setCode(e.target.value)}
              className="w-full h-80 p-4 bg-transparent font-mono text-sm text-foreground resize-none focus:outline-none"
              spellCheck={false} />
          </div>
          <div className="glass-card overflow-hidden">
            <div className="px-4 py-2 border-b border-border text-xs text-muted-foreground">Output</div>
            <pre className="w-full h-80 p-4 font-mono text-sm text-foreground overflow-auto whitespace-pre-wrap">{output}</pre>
          </div>
        </div>
      </motion.div>
    </DashboardLayout>
  );
}
