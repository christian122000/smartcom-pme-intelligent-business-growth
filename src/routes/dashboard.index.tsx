import { createFileRoute } from "@tanstack/react-router";
import { Users, TrendingUp, Megaphone, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { StatCard } from "@/components/dashboard/StatCard";
import { AreaChart, Area, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { useAuth } from "@/hooks/use-auth";

export const Route = createFileRoute("/dashboard/")({ component: ClientHome });

const perf = Array.from({ length: 7 }, (_, i) => ({ d: `J${i + 1}`, v: Math.round(50 + Math.random() * 80) }));

function ClientHome() {
  const { user } = useAuth();
  const name = (user?.user_metadata?.full_name as string) || user?.email?.split("@")[0] || "PME";

  return (
    <div className="space-y-6">
      <div className="rounded-2xl bg-gradient-to-br from-primary via-primary/90 to-accent text-primary-foreground p-6 shadow-xl relative overflow-hidden">
        <div className="absolute -top-10 -right-10 h-48 w-48 rounded-full bg-white/10 blur-3xl" />
        <div className="relative">
          <div className="text-xs uppercase tracking-wider opacity-80">Bienvenue</div>
          <h2 className="text-2xl sm:text-3xl font-display font-bold mt-1">Bonjour {name} 👋</h2>
          <p className="mt-2 opacity-90 text-sm">Votre IA a généré 3 nouvelles recommandations pour booster votre engagement.</p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Mes clients" value="284" trend="+12 cette semaine" icon={Users} />
        <StatCard label="Engagement" value="74.6%" trend="+5.2%" icon={TrendingUp} accent="emerald" />
        <StatCard label="Campagnes actives" value="7" icon={Megaphone} accent="accent" />
        <StatCard label="Recommandations IA" value="12" trend="3 nouvelles" icon={Sparkles} accent="amber" />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="lg:col-span-2 rounded-xl border border-border bg-card p-5">
          <h3 className="font-semibold mb-4">Performance des campagnes</h3>
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={perf}>
              <defs><linearGradient id="cg" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="var(--accent)" stopOpacity={0.5} /><stop offset="100%" stopColor="var(--accent)" stopOpacity={0} /></linearGradient></defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="d" stroke="var(--muted-foreground)" fontSize={12} />
              <YAxis stroke="var(--muted-foreground)" fontSize={12} />
              <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 8 }} />
              <Area type="monotone" dataKey="v" stroke="var(--accent)" fill="url(#cg)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="rounded-xl border border-border bg-card p-5">
          <div className="flex items-center gap-2 mb-4"><Sparkles className="h-4 w-4 text-primary" /><h3 className="font-semibold">Recommandations IA</h3></div>
          <ul className="space-y-3 text-sm">
            {[
              "Lancez une campagne WhatsApp ce vendredi : +32% engagement attendu.",
              "Vos clients VIP n'ont pas reçu d'offre depuis 2 semaines.",
              "Le créneau 18h-20h convertit 2× mieux pour votre secteur.",
            ].map((t, i) => (
              <li key={i} className="rounded-lg border border-border bg-muted/30 p-3 hover:border-primary/40 transition">
                <span className="text-primary font-semibold mr-1">{i + 1}.</span>{t}
              </li>
            ))}
          </ul>
        </motion.div>
      </div>
    </div>
  );
}
