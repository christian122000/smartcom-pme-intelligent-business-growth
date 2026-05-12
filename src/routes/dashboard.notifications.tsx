import { createFileRoute } from "@tanstack/react-router";
import { Sparkles, Bell, TrendingUp, AlertCircle } from "lucide-react";

export const Route = createFileRoute("/dashboard/notifications")({ component: () => <N /> });

const items = [
  { icon: Sparkles, color: "text-primary bg-primary/10", title: "Nouvelle recommandation IA disponible", time: "il y a 10 min" },
  { icon: TrendingUp, color: "text-emerald-500 bg-emerald-500/10", title: "Votre dernière campagne a dépassé son objectif (+18%)", time: "il y a 2 h" },
  { icon: Bell, color: "text-accent bg-accent/10", title: "12 nouveaux contacts ajoutés cette semaine", time: "hier" },
  { icon: AlertCircle, color: "text-amber-500 bg-amber-500/10", title: "Pensez à programmer votre campagne du week-end", time: "hier" },
];

function N() {
  return (
    <div className="space-y-4 max-w-2xl">
      <h2 className="text-lg font-semibold">Notifications intelligentes</h2>
      <div className="rounded-xl border border-border bg-card divide-y divide-border">
        {items.map((n, i) => (
          <div key={i} className="p-4 flex items-start gap-3 hover:bg-muted/30 transition">
            <span className={`h-9 w-9 rounded-lg inline-flex items-center justify-center ${n.color}`}><n.icon className="h-4 w-4" /></span>
            <div className="flex-1"><div className="font-medium text-sm">{n.title}</div><div className="text-xs text-muted-foreground mt-0.5">{n.time}</div></div>
          </div>
        ))}
      </div>
    </div>
  );
}
