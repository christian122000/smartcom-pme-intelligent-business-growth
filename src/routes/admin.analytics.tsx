import { createFileRoute } from "@tanstack/react-router";
import { LineChart, Line, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid, PieChart, Pie, Cell, Legend } from "recharts";

export const Route = createFileRoute("/admin/analytics")({ component: Analytics });

const lineData = Array.from({ length: 12 }, (_, i) => ({ m: `S${i + 1}`, eng: Math.round(40 + Math.random() * 60), conv: Math.round(20 + Math.random() * 40) }));
const pie = [{ name: "WhatsApp", v: 40 }, { name: "Email", v: 28 }, { name: "SMS", v: 18 }, { name: "Réseaux", v: 14 }];
const colors = ["hsl(var(--primary))", "hsl(var(--accent))", "#10b981", "#f59e0b"];

function Analytics() {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Statistiques détaillées</h2>
      <div className="grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2 rounded-xl border border-border bg-card p-5">
          <h3 className="font-semibold mb-4">Engagement & conversions</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={lineData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="m" stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8 }} />
              <Line type="monotone" dataKey="eng" stroke="hsl(var(--primary))" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="conv" stroke="hsl(var(--accent))" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="rounded-xl border border-border bg-card p-5">
          <h3 className="font-semibold mb-4">Répartition par canal</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={pie} dataKey="v" nameKey="name" innerRadius={50} outerRadius={90} paddingAngle={4}>
                {pie.map((_, i) => <Cell key={i} fill={colors[i]} />)}
              </Pie>
              <Legend />
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
