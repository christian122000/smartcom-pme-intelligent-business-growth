import { createFileRoute } from "@tanstack/react-router";
import { Bell, AlertCircle, CheckCircle2, Info } from "lucide-react";

export const Route = createFileRoute("/admin/notifications")({ component: () => <Notifs /> });

const items = [
  { icon: AlertCircle, color: "text-amber-500 bg-amber-500/10", title: "Nouvelle PME en attente de validation", time: "il y a 5 min" },
  { icon: CheckCircle2, color: "text-emerald-500 bg-emerald-500/10", title: "Sauvegarde quotidienne terminée", time: "il y a 1 h" },
  { icon: Info, color: "text-primary bg-primary/10", title: "Mise à jour système v1.2 disponible", time: "il y a 3 h" },
  { icon: Bell, color: "text-accent bg-accent/10", title: "Pic de trafic détecté sur la plateforme", time: "hier" },
];

function Notifs() {
  return (
    <div className="space-y-4 max-w-2xl">
      <h2 className="text-lg font-semibold">Notifications système</h2>
      <div className="rounded-xl border border-border bg-card divide-y divide-border">
        {items.map((n, i) => (
          <div key={i} className="p-4 flex items-start gap-3 hover:bg-muted/30 transition">
            <span className={`h-9 w-9 rounded-lg inline-flex items-center justify-center ${n.color}`}><n.icon className="h-4 w-4" /></span>
            <div className="flex-1">
              <div className="font-medium text-sm">{n.title}</div>
              <div className="text-xs text-muted-foreground mt-0.5">{n.time}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
