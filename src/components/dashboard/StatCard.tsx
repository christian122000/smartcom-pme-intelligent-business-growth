import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import { ArrowUpRight } from "lucide-react";

export function StatCard({
  label, value, icon: Icon, trend, accent = "primary",
}: {
  label: string; value: string; icon: LucideIcon; trend?: string;
  accent?: "primary" | "accent" | "emerald" | "amber";
}) {
  const accents: Record<string, string> = {
    primary: "from-primary/20 to-primary/5 text-primary",
    accent: "from-accent/20 to-accent/5 text-accent",
    emerald: "from-emerald-500/20 to-emerald-500/5 text-emerald-500",
    amber: "from-amber-500/20 to-amber-500/5 text-amber-500",
  };
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      className="relative overflow-hidden rounded-xl border border-border bg-card p-5 shadow-sm hover:shadow-lg transition"
    >
      <div className={`absolute -top-10 -right-10 h-32 w-32 rounded-full bg-gradient-to-br ${accents[accent]} blur-2xl opacity-60`} />
      <div className="relative flex items-start justify-between">
        <div>
          <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{label}</div>
          <div className="mt-2 text-3xl font-bold font-display">{value}</div>
          {trend && (
            <div className="mt-2 inline-flex items-center gap-1 text-xs text-emerald-600 font-medium">
              <ArrowUpRight className="h-3 w-3" /> {trend}
            </div>
          )}
        </div>
        <div className={`h-10 w-10 rounded-lg inline-flex items-center justify-center bg-gradient-to-br ${accents[accent]}`}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </motion.div>
  );
}
