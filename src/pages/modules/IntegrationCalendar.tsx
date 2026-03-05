import { useState } from "react";
import { motion } from "framer-motion";
import { DashboardLayout } from "@/components/DashboardLayout";
import { useData } from "@/context/DataContext";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { CalendarIcon, CheckCircle, Bell, Clock } from "lucide-react";

export default function IntegrationCalendar() {
  const { data } = useData();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());

  const dateStr = selectedDate ? format(selectedDate, "yyyy-MM-dd") : "";

  // Tasks due on selected date (using createdAt as proxy)
  const dayTasks = data.tasks.filter(t => t.createdAt.startsWith(dateStr));
  const dayReminders = data.reminders.filter(r => r.dueDate.startsWith(dateStr));
  const dayHealth = data.health.filter(h => h.date.startsWith(dateStr));

  // Highlight dates with events
  const eventDates = new Set([
    ...data.tasks.map(t => t.createdAt.split("T")[0]),
    ...data.reminders.map(r => r.dueDate.split("T")[0]),
  ]);

  return (
    <DashboardLayout>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <h1 className="font-display text-2xl font-bold mb-6">Calendar</h1>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="glass-card p-5 flex justify-center">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              modifiers={{ hasEvent: (date) => eventDates.has(format(date, "yyyy-MM-dd")) }}
              modifiersClassNames={{ hasEvent: "bg-primary/20 font-bold" }}
              className="rounded-md"
            />
          </div>
          <div className="space-y-4">
            <h2 className="font-display font-semibold text-lg">
              {selectedDate ? format(selectedDate, "MMMM d, yyyy") : "Select a date"}
            </h2>

            {dayTasks.length > 0 && (
              <div className="glass-card p-4">
                <h3 className="text-sm font-medium text-muted-foreground mb-2 flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" /> Tasks ({dayTasks.length})
                </h3>
                {dayTasks.map(t => (
                  <div key={t.id} className="text-sm py-1 flex items-center gap-2">
                    <span className={t.status === "done" ? "line-through text-muted-foreground" : ""}>{t.title}</span>
                    <span className="text-xs text-muted-foreground capitalize">{t.status.replace("_", " ")}</span>
                  </div>
                ))}
              </div>
            )}

            {dayReminders.length > 0 && (
              <div className="glass-card p-4">
                <h3 className="text-sm font-medium text-muted-foreground mb-2 flex items-center gap-2">
                  <Bell className="w-4 h-4" /> Reminders ({dayReminders.length})
                </h3>
                {dayReminders.map(r => (
                  <div key={r.id} className="text-sm py-1">
                    <span className={r.isCompleted ? "line-through text-muted-foreground" : ""}>{r.title}</span>
                  </div>
                ))}
              </div>
            )}

            {dayHealth.length > 0 && (
              <div className="glass-card p-4">
                <h3 className="text-sm font-medium text-muted-foreground mb-2 flex items-center gap-2">
                  <Clock className="w-4 h-4" /> Health Logs ({dayHealth.length})
                </h3>
                {dayHealth.map((h, i) => (
                  <div key={i} className="text-sm py-1 text-muted-foreground">
                    Sleep: {h.sleep}h • Stress: {h.stress}/10 • Water: {h.water} glasses
                  </div>
                ))}
              </div>
            )}

            {dayTasks.length === 0 && dayReminders.length === 0 && dayHealth.length === 0 && (
              <div className="glass-card p-6 text-center text-muted-foreground text-sm">
                No events for this date
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </DashboardLayout>
  );
}
