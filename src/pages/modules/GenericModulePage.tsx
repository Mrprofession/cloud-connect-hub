import { motion } from "framer-motion";
import { DashboardLayout } from "@/components/DashboardLayout";

export default function GenericModulePage({ title, description }: { title: string; description: string }) {
  return (
    <DashboardLayout>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-2xl">
        <h1 className="font-display text-2xl font-bold mb-2">{title}</h1>
        <p className="text-muted-foreground text-sm mb-6">{description}</p>
        <div className="glass-card p-8 text-center text-muted-foreground">
          This section is under development. Data will populate as you use the platform.
        </div>
      </motion.div>
    </DashboardLayout>
  );
}
