import { createFileRoute } from "@tanstack/react-router";
import { BarChart, Bar, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid, RadialBarChart, RadialBar, Legend } from "recharts";

export const Route = createFileRoute("/dashboard/analytics")({ component: A });

const bars = [{ d: "Lun", v: 24 }, { d: "Mar", v: 38 }, { d: "Mer", v: 31 }, { d: "Jeu", v: 45 }, { d: "Ven", v: 62 }, { d: "Sam", v: 50 }, { d: "Dim", v: 28 }];
const radial = [
  { name: "WhatsApp", v: 82, fill: "hsl(var(--primary))" },
  { name: "Email", v: 64, fill: "hsl(var(--accent))" },
  { name: "SMS", v: 48, fill: "#10b981" },
];

function A() {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Analyses marketing</h2>
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-xl border border-border bg-card p-5">
          <h3 className="font-semibold mb-4">Engagement hebdomadaire</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={bars}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="d" stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8 }} />
              <Bar dataKey="v" fill="hsl(var(--primary))" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="rounded-xl border border-border bg-card p-5">
          <h3 className="font-semibold mb-4">Performance par canal</h3>
          <ResponsiveContainer width="100%" height={280}>
            <RadialBarChart innerRadius="30%" outerRadius="100%" data={radial} startAngle={180} endAngle={0}>
              <RadialBar dataKey="v" cornerRadius={8} background />
              <Legend iconSize={10} />
              <Tooltip />
            </RadialBarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
