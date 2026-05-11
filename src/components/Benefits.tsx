import { motion } from "framer-motion";
import { Clock, TrendingUp, MessageCircle, Cog } from "lucide-react";

const benefits = [
  { icon: Clock, title: "Gain de temps", text: "Automatisez les tâches répétitives et concentrez-vous sur la croissance de votre business." },
  { icon: TrendingUp, title: "Marketing optimisé", text: "Campagnes ciblées, ROI mesurable et stratégies pilotées par la donnée." },
  { icon: MessageCircle, title: "Meilleure relation client", text: "Communication personnalisée, rapide et disponible sur tous les canaux." },
  { icon: Cog, title: "Automatisation intelligente", text: "L'IA orchestre vos workflows et déclenche les bonnes actions au bon moment." },
];

export function Benefits() {
  return (
    <section className="py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-14 items-center">
        <div>
          <span className="text-xs font-semibold uppercase tracking-widest text-primary">Avantages</span>
          <h2 className="mt-3 font-display text-3xl sm:text-4xl lg:text-5xl font-bold">
            Pensé pour les <span className="gradient-text">PME camerounaises</span>
          </h2>
          <p className="mt-4 text-muted-foreground text-lg">
            SmartCom PME a été conçu en tenant compte des réalités du marché local : connexion variable, multilinguisme, canaux mobiles dominants et budgets maîtrisés.
          </p>
          <div className="mt-8 inline-flex items-center gap-3 rounded-2xl border border-border bg-card p-4 shadow-card">
            <span className="h-10 w-10 rounded-xl gradient-hero-bg flex items-center justify-center text-primary-foreground font-bold">🇨🇲</span>
            <div className="text-sm">
              <div className="font-semibold">Made in Cameroun</div>
              <div className="text-muted-foreground text-xs">Adapté aux PME locales</div>
            </div>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-5">
          {benefits.map((b, i) => (
            <motion.div
              key={b.title}
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="rounded-2xl border border-border bg-card p-6 shadow-card hover:shadow-elegant hover:-translate-y-1 transition-all"
            >
              <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl gradient-hero-bg shadow-glow">
                <b.icon className="h-5 w-5 text-primary-foreground" />
              </div>
              <h3 className="mt-4 font-display font-bold">{b.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{b.text}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
