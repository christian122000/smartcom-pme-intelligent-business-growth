import { createFileRoute } from "@tanstack/react-router";
import { Megaphone } from "lucide-react";

export const Route = createFileRoute("/admin/campaigns")({ component: () => <Placeholder /> });

const data = [
  { name: "Promo Ramadan", pme: "Boulangerie Akwa", channel: "WhatsApp", reach: 2400, ctr: "12.4%" },
  { name: "Lancement App", pme: "TechCM Solutions", channel: "Email", reach: 5800, ctr: "8.9%" },
  { name: "Black Friday", pme: "Mode Bafoussam", channel: "SMS", reach: 1200, ctr: "15.1%" },
];

function Placeholder() {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2"><Megaphone className="h-5 w-5 text-primary" /><h2 className="text-lg font-semibold">Campagnes marketing</h2></div>
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 text-muted-foreground">
            <tr><th className="text-left px-4 py-3">Campagne</th><th className="text-left px-4 py-3">PME</th><th className="text-left px-4 py-3">Canal</th><th className="text-left px-4 py-3">Audience</th><th className="text-left px-4 py-3">CTR</th></tr>
          </thead>
          <tbody>
            {data.map((d) => (
              <tr key={d.name} className="border-t border-border hover:bg-muted/30">
                <td className="px-4 py-3 font-medium">{d.name}</td>
                <td className="px-4 py-3 text-muted-foreground">{d.pme}</td>
                <td className="px-4 py-3"><span className="px-2 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">{d.channel}</span></td>
                <td className="px-4 py-3">{d.reach.toLocaleString("fr-FR")}</td>
                <td className="px-4 py-3 text-emerald-600 font-medium">{d.ctr}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
