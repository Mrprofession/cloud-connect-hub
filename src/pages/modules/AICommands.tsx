import { useState } from "react";
import { motion } from "framer-motion";
import { DashboardLayout } from "@/components/DashboardLayout";
import { useData } from "@/context/DataContext";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send } from "lucide-react";

interface ChatMessage { role: "user" | "ai"; content: string; }

export default function AICommands() {
  const { data } = useData();
  const { user } = useAuth();
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: "ai", content: "Welcome to AI Insight Core! Try commands like `/analyze health`, `/analyze productivity`, or `/generate report`." }
  ]);

  const generateResponse = (cmd: string): string => {
    const c = cmd.toLowerCase().trim();
    if (c.includes("/analyze health") || c.includes("health")) {
      const entries = data.health.length;
      if (entries === 0) return "📊 No health data found. Start logging daily entries!";
      const latest = data.health[data.health.length - 1];
      const score = Math.min(100, Math.max(0, (latest.sleep * 8) - (latest.stress * 5) - (latest.eyeStrain ? 10 : 0)));
      return `📊 **Health Analysis** (${entries} entries)\n\n• Latest Score: ${score}/100\n• Sleep: ${latest.sleep}h | Stress: ${latest.stress}/10\n• Mood: ${latest.mood}\n\n${latest.stress >= 7 ? "⚠️ High stress detected." : "✅ Stress levels manageable."}`;
    }
    if (c.includes("/analyze productivity") || c.includes("productivity")) {
      const total = data.tasks.length;
      const done = data.tasks.filter(t => t.status === "done").length;
      if (total === 0) return "📋 No tasks found. Create tasks in the Productivity module!";
      return `📋 **Productivity Analysis**\n\n• Total: ${total} | Done: ${done} (${Math.round((done/total)*100)}%)\n• In Progress: ${data.tasks.filter(t => t.status === "in_progress").length}\n\n${done/total > 0.7 ? "🎉 Great productivity!" : "💡 Try smaller steps."}`;
    }
    if (c.includes("/generate report") || c.includes("report")) {
      const overall = Math.round((data.healthScore * 0.3) + (data.productivityScore * 0.3) + (data.codeScore * 0.4));
      return `📄 **Weekly Report**\n\nUser: ${user?.name}\n\n• Health: ${data.healthScore}/100\n• Productivity: ${data.productivityScore}/100\n• Code: ${data.codeScore}/100\n• **Overall: ${overall}/100**\n\n${overall >= 70 ? "🌟 Excellent!" : "📈 Room for improvement."}`;
    }
    return `🤖 Try: \`/analyze health\`, \`/analyze productivity\`, \`/generate report\``;
  };

  const handleSend = () => {
    if (!input.trim()) return;
    setMessages(prev => [...prev, { role: "user", content: input }, { role: "ai", content: generateResponse(input) }]);
    setInput("");
  };

  return (
    <DashboardLayout>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-3xl mx-auto flex flex-col h-[calc(100vh-8rem)]">
        <h1 className="font-display text-2xl font-bold mb-4">AI Smart Commands</h1>
        <div className="glass-card flex-1 flex flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[80%] p-3 rounded-lg text-sm whitespace-pre-wrap ${
                  msg.role === "user" ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground"
                }`}>{msg.content}</div>
              </div>
            ))}
          </div>
          <div className="p-4 border-t border-border flex gap-2">
            <Input value={input} onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleSend()} placeholder="Type a command..." className="bg-secondary border-border" />
            <Button onClick={handleSend} className="bg-primary text-primary-foreground"><Send className="w-4 h-4" /></Button>
          </div>
        </div>
      </motion.div>
    </DashboardLayout>
  );
}
