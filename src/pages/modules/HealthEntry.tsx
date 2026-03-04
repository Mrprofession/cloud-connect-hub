import { useState } from "react";
import { motion } from "framer-motion";
import { DashboardLayout } from "@/components/DashboardLayout";
import { useData } from "@/context/DataContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";

export default function HealthEntry() {
  const { addHealthEntry } = useData();
  const [sleep, setSleep] = useState("7");
  const [stress, setStress] = useState("5");
  const [headache, setHeadache] = useState(false);
  const [eyeStrain, setEyeStrain] = useState(false);
  const [mood, setMood] = useState("neutral");
  const [exercise, setExercise] = useState("30");
  const [water, setWater] = useState("8");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await addHealthEntry({
      date: new Date().toISOString(),
      sleep: Number(sleep), stress: Number(stress), headache, eyeStrain,
      mood, exercise: Number(exercise), water: Number(water),
    });
    toast.success("Health entry logged!");
  };

  return (
    <DashboardLayout>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-2xl">
        <h1 className="font-display text-2xl font-bold mb-6">Daily Health Entry</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="glass-card p-6 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-muted-foreground mb-1 block">Sleep Hours</label>
                <Input type="number" min="0" max="24" value={sleep} onChange={e => setSleep(e.target.value)} className="bg-secondary border-border" />
              </div>
              <div>
                <label className="text-sm text-muted-foreground mb-1 block">Stress Level (1-10)</label>
                <Input type="number" min="1" max="10" value={stress} onChange={e => setStress(e.target.value)} className="bg-secondary border-border" />
              </div>
              <div>
                <label className="text-sm text-muted-foreground mb-1 block">Exercise (minutes)</label>
                <Input type="number" min="0" value={exercise} onChange={e => setExercise(e.target.value)} className="bg-secondary border-border" />
              </div>
              <div>
                <label className="text-sm text-muted-foreground mb-1 block">Water (glasses)</label>
                <Input type="number" min="0" value={water} onChange={e => setWater(e.target.value)} className="bg-secondary border-border" />
              </div>
            </div>
            <div>
              <label className="text-sm text-muted-foreground mb-1 block">Mood</label>
              <Select value={mood} onValueChange={setMood}>
                <SelectTrigger className="bg-secondary border-border"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="great">😄 Great</SelectItem>
                  <SelectItem value="good">🙂 Good</SelectItem>
                  <SelectItem value="neutral">😐 Neutral</SelectItem>
                  <SelectItem value="low">😔 Low</SelectItem>
                  <SelectItem value="bad">😢 Bad</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex gap-8">
              <label className="flex items-center gap-2 text-sm">
                <Switch checked={headache} onCheckedChange={setHeadache} /> Headache
              </label>
              <label className="flex items-center gap-2 text-sm">
                <Switch checked={eyeStrain} onCheckedChange={setEyeStrain} /> Eye Strain
              </label>
            </div>
          </div>
          <Button type="submit" className="bg-primary text-primary-foreground">Log Entry</Button>
        </form>
      </motion.div>
    </DashboardLayout>
  );
}
