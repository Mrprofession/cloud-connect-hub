import { useState } from "react";
import { motion } from "framer-motion";
import Editor from "@monaco-editor/react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { useData } from "@/context/DataContext";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Play, Download, RotateCcw } from "lucide-react";
import { Input } from "@/components/ui/input";

const templates: Record<string, string> = {
  python: `# Python\nprint("Hello, World!")`,
  java: `// Java\npublic class Main {\n  public static void main(String[] args) {\n    System.out.println("Hello, World!");\n  }\n}`,
  c: `// C\n#include <stdio.h>\nint main() {\n  printf("Hello, World!\\n");\n  return 0;\n}`,
  cpp: `// C++\n#include <iostream>\nint main() {\n  std::cout << "Hello, World!" << std::endl;\n  return 0;\n}`,
};

const monacoLang: Record<string, string> = { python: "python", java: "java", c: "c", cpp: "cpp" };
const langMap: Record<string, string> = { python: "python3", java: "java", c: "c", cpp: "cpp" };

export default function CodeEditor() {
  const { addCodeRun } = useData();
  const [language, setLanguage] = useState("python");
  const [code, setCode] = useState(templates.python);
  const [stdin, setStdin] = useState("");
  const [output, setOutput] = useState("");
  const [execTime, setExecTime] = useState<number | null>(null);
  const [running, setRunning] = useState(false);

  const handleRun = async () => {
    setRunning(true);
    setOutput("Running...");
    setExecTime(null);
    const start = Date.now();
    try {
      const res = await fetch("https://emkc.org/api/v2/piston/execute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ language: langMap[language], version: "*", files: [{ content: code }], stdin }),
      });
      const data = await res.json();
      const elapsed = Date.now() - start;
      const result = data.run?.output || data.run?.stderr || "No output";
      const success = !data.run?.stderr;
      setOutput(result);
      setExecTime(elapsed);
      await addCodeRun({ language, code, output: result, executionTime: elapsed, success });
      toast.success(`Executed in ${elapsed}ms`);
    } catch {
      setOutput("Error: Could not connect to execution service");
      await addCodeRun({ language, code, output: "Connection error", executionTime: Date.now() - start, success: false });
    } finally {
      setRunning(false);
    }
  };

  const handleDownload = () => {
    const ext: Record<string, string> = { python: ".py", java: ".java", c: ".c", cpp: ".cpp" };
    const blob = new Blob([code], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `code${ext[language] || ".txt"}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <DashboardLayout>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
          <h1 className="font-display text-2xl font-bold">Code Editor</h1>
          <div className="flex gap-2 items-center flex-wrap">
            <Select value={language} onValueChange={v => { setLanguage(v); setCode(templates[v]); }}>
              <SelectTrigger className="w-28 bg-secondary border-border"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="python">Python</SelectItem>
                <SelectItem value="java">Java</SelectItem>
                <SelectItem value="c">C</SelectItem>
                <SelectItem value="cpp">C++</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" onClick={() => setCode(templates[language])} className="border-border">
              <RotateCcw className="w-4 h-4" />
            </Button>
            <Button variant="outline" onClick={handleDownload} className="border-border">
              <Download className="w-4 h-4" />
            </Button>
            <Button onClick={handleRun} disabled={running} className="bg-primary text-primary-foreground">
              <Play className="w-4 h-4 mr-1" /> {running ? "Running..." : "Run"}
            </Button>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="glass-card overflow-hidden">
            <div className="px-4 py-2 border-b border-border text-xs text-muted-foreground flex items-center justify-between">
              <span>Editor — {language.toUpperCase()}</span>
              {execTime !== null && <span className="text-primary">{execTime}ms</span>}
            </div>
            <Editor
              height="400px"
              language={monacoLang[language]}
              value={code}
              onChange={v => setCode(v || "")}
              theme="vs-dark"
              options={{ minimap: { enabled: false }, fontSize: 14, padding: { top: 12 }, scrollBeyondLastLine: false }}
            />
          </div>
          <div className="flex flex-col gap-4">
            <div className="glass-card overflow-hidden">
              <div className="px-4 py-2 border-b border-border text-xs text-muted-foreground">Custom Input (stdin)</div>
              <textarea value={stdin} onChange={e => setStdin(e.target.value)}
                className="w-full h-24 p-4 bg-transparent font-mono text-sm text-foreground resize-none focus:outline-none"
                placeholder="Enter input here..." />
            </div>
            <div className="glass-card overflow-hidden flex-1">
              <div className="px-4 py-2 border-b border-border text-xs text-muted-foreground">Output</div>
              <pre className="w-full min-h-[260px] p-4 font-mono text-sm text-foreground overflow-auto whitespace-pre-wrap">{output}</pre>
            </div>
          </div>
        </div>
      </motion.div>
    </DashboardLayout>
  );
}
