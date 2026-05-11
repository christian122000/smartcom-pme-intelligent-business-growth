import { motion } from "framer-motion";
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis } from "recharts";

const data = [
  { m: "Jan", v: 32 },
  { m: "Fév", v: 48 },
  { m: "Mar", v: 61 },
  { m: "Avr", v: 75 },
  { m: "Mai", v: 88 },
  { m: "Jun", v: 96 },
];

const cards = [
  { value: "500+", label: "PME accompagnées", color: "from-primary to-violet" },
  { value: "12K+", label: "Campagnes automatisées" },
  { value: "+38%", label: "Taux d'engagement moyen" },
  { value: "92%", label: "Satisfaction client" },
];

export function Stats() {
  return (
    <section className="py-24 gradient-soft-bg">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto">
          <span className="text-xs font-semibold uppercase tracking-widest text-primary">Statistiques</span>
          <h2 className="mt-3 font-display text-3xl sm:text-4xl lg:text-5xl font-bold">
            Des résultats <span className="gradient-text">mesurables</span>
          </h2>
        </div>

        <div className="mt-14 grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 rounded-2xl border border-border bg-card p-6 shadow-card">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-muted-foreground">Engagement client (6 derniers mois)</div>
                <div className="font-display text-3xl font-bold gradient-text mt-1">+96%</div>
              </div>
              <span className="text-xs px-3 py-1 rounded-full bg-primary/10 text-primary font-semibold">Croissance</span>
            </div>
            <div className="mt-6 h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data}>
                  <defs>
                    <linearGradient id="bar" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="oklch(0.58 0.24 295)" />
                      <stop offset="100%" stopColor="oklch(0.52 0.22 265)" />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="m" stroke="oklch(0.5 0.04 265)" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip
                    cursor={{ fill: "oklch(0.52 0.22 265 / 0.08)" }}
                    contentStyle={{
                      background: "var(--color-card)",
                      border: "1px solid var(--color-border)",
                      borderRadius: "12px",
                    }}
                  />
                  <Bar dataKey="v" fill="url(#bar)" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-1 gap-4">
            {cards.map((c, i) => (
              <motion.div
                key={c.label}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="rounded-2xl border border-border bg-card p-5 shadow-card hover:shadow-glow transition-all"
              >
                <div className="font-display text-3xl font-bold gradient-text">{c.value}</div>
                <div className="text-xs text-muted-foreground mt-1">{c.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
