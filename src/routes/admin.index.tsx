import { createFileRoute } from "@tanstack/react-router";
import { Building2, Users, Megaphone, TrendingUp, Activity } from "lucide-react";
import { motion } from "framer-motion";
import { StatCard } from "@/components/dashboard/StatCard";
import { AreaChart, Area, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid, BarChart, Bar } from "recharts";

export const Route = createFileRoute("/admin/")({
  component: AdminHome,
});

const traffic = [
  { m: "Jan", v: 120 }, { m: "Fév", v: 180 }, { m: "Mar", v: 240 }, { m: "Avr", v: 320 },
  { m: "Mai", v: 410 }, { m: "Juin", v: 520 }, { m: "Juil", v: 640 },
];
const campaigns = [
  { name: "SMS", v: 42 }, { name: "Email", v: 78 }, { name: "WhatsApp", v: 95 }, { name: "Réseaux", v: 60 },
];
const activity = [
  { t: "Il y a 2 min", txt: "Nouvelle PME inscrite : Boulangerie Akwa" },
  { t: "Il y a 14 min", txt: "Campagne « Promo Ramadan » lancée par TechCM" },
  { t: "Il y a 1 h", txt: "12 utilisateurs ont activé leur compte" },
  { t: "Il y a 3 h", txt: "Rapport hebdomadaire généré" },
];

function AdminHome() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="PME enregistrées" value="528" trend="+12% ce mois" icon={Building2} accent="primary" />
        <StatCard label="Utilisateurs actifs" value="1 247" trend="+8.4%" icon={Users} accent="accent" />
        <StatCard label="Campagnes créées" value="3 412" trend="+22%" icon={Megaphone} accent="emerald" />
        <StatCard label="Taux d'engagement" value="68.2%" trend="+3.1%" icon={TrendingUp} accent="amber" />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="lg:col-span-2 rounded-xl border border-border bg-card p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="font-semibold">Croissance des inscriptions</h2>
              <p className="text-xs text-muted-foreground">7 derniers mois</p>
            </div>
            <span className="text-xs px-2 py-1 rounded-full bg-emerald-500/10 text-emerald-600 font-medium">+233%</span>
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={traffic}>
              <defs>
                <linearGradient id="gp" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="m" stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8 }} />
              <Area type="monotone" dataKey="v" stroke="hsl(var(--primary))" fill="url(#gp)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="rounded-xl border border-border bg-card p-5 shadow-sm">
          <h2 className="font-semibold mb-4">Canaux populaires</h2>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={campaigns}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8 }} />
              <Bar dataKey="v" fill="hsl(var(--primary))" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <Activity className="h-4 w-4 text-primary" />
          <h2 className="font-semibold">Activités récentes</h2>
        </div>
        <ul className="divide-y divide-border">
          {activity.map((a, i) => (
            <motion.li key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }} className="py-3 flex items-center justify-between text-sm">
              <span>{a.txt}</span>
              <span className="text-xs text-muted-foreground">{a.t}</span>
            </motion.li>
          ))}
        </ul>
      </div>
    </div>
  );
}
