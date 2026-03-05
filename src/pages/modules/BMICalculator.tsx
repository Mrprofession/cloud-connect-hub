import { useState } from "react";
import { motion } from "framer-motion";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calculator, Heart } from "lucide-react";
import { streamAI } from "@/lib/ai-stream";

export default function BMICalculator() {
  const [weight, setWeight] = useState("70");
  const [height, setHeight] = useState("175");
  const [bmi, setBmi] = useState<number | null>(null);
  const [tips, setTips] = useState("");
  const [loadingTips, setLoadingTips] = useState(false);

  const calculate = () => {
    const w = Number(weight);
    const h = Number(height) / 100;
    if (w > 0 && h > 0) {
      const b = w / (h * h);
      setBmi(Math.round(b * 10) / 10);
    }
  };

  const getCategory = (b: number) => {
    if (b < 18.5) return { label: "Underweight", color: "text-amber-400" };
    if (b < 25) return { label: "Normal", color: "text-primary" };
    if (b < 30) return { label: "Overweight", color: "text-amber-400" };
    return { label: "Obese", color: "text-destructive" };
  };

  const getHealthTips = async () => {
    if (!bmi) return;
    setLoadingTips(true);
    setTips("");
    let acc = "";
    try {
      await streamAI({
        action: "health-tips",
        messages: [{ role: "user", content: `My BMI is ${bmi} (${getCategory(bmi).label}). Weight: ${weight}kg, Height: ${height}cm. Give me personalized health tips.` }],
        onDelta: (chunk) => { acc += chunk; setTips(acc); },
        onDone: () => setLoadingTips(false),
      });
    } catch { setLoadingTips(false); }
  };

  return (
    <DashboardLayout>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-xl">
        <h1 className="font-display text-2xl font-bold mb-6">BMI Calculator</h1>
        <div className="glass-card p-6 space-y-4 mb-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-muted-foreground mb-1 block">Weight (kg)</label>
              <Input type="number" value={weight} onChange={e => setWeight(e.target.value)} className="bg-secondary border-border" />
            </div>
            <div>
              <label className="text-sm text-muted-foreground mb-1 block">Height (cm)</label>
              <Input type="number" value={height} onChange={e => setHeight(e.target.value)} className="bg-secondary border-border" />
            </div>
          </div>
          <Button onClick={calculate} className="w-full bg-primary text-primary-foreground">
            <Calculator className="w-4 h-4 mr-2" /> Calculate BMI
          </Button>
        </div>

        {bmi !== null && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass-card glow-border p-6 text-center mb-4">
            <div className="text-5xl font-display font-bold gradient-text mb-2">{bmi}</div>
            <div className={`font-medium ${getCategory(bmi).color}`}>{getCategory(bmi).label}</div>
            <Button variant="outline" onClick={getHealthTips} disabled={loadingTips}
              className="mt-4 border-border text-foreground">
              <Heart className="w-4 h-4 mr-2" /> {loadingTips ? "Getting tips..." : "Get AI Health Tips"}
            </Button>
          </motion.div>
        )}

        {tips && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card p-5">
            <h3 className="font-display font-semibold mb-2">AI Health Tips</h3>
            <div className="text-sm text-muted-foreground whitespace-pre-wrap">{tips}</div>
          </motion.div>
        )}
      </motion.div>
    </DashboardLayout>
  );
}
