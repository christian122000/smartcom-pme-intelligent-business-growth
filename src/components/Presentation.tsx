import { motion } from "framer-motion";
import { Target, AlertCircle, Lightbulb, CheckCircle2 } from "lucide-react";

const items = [
  {
    icon: AlertCircle,
    title: "Contexte",
    text: "Les PME camerounaises peinent à exploiter leurs données et à structurer leur communication digitale dans un environnement numérique en pleine mutation.",
  },
  {
    icon: Target,
    title: "Problématique",
    text: "Comment automatiser et optimiser les stratégies marketing des PME locales pour améliorer l'engagement client et la croissance ?",
  },
  {
    icon: Lightbulb,
    title: "Solution",
    text: "Une plateforme SaaS intelligente intégrant IA, analyse de données, automatisation marketing et chatbot pour piloter toute la communication.",
  },
  {
    icon: CheckCircle2,
    title: "Objectifs",
    text: "Faciliter la gestion clients, automatiser les campagnes, fournir des recommandations IA et renforcer la relation client des PME.",
  },
];

export function Presentation() {
  return (
    <section id="apropos" className="py-24 relative">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <span className="text-xs font-semibold uppercase tracking-widest text-primary">Présentation du projet</span>
          <h2 className="mt-3 font-display text-3xl sm:text-4xl lg:text-5xl font-bold">
            Une réponse <span className="gradient-text">intelligente</span> aux défis des PME
          </h2>
          <p className="mt-4 text-muted-foreground text-lg">
            SmartCom PME est un projet académique conçu pour transformer la communication digitale des petites et moyennes entreprises au Cameroun.
          </p>
        </div>

        <div className="mt-14 grid sm:grid-cols-2 gap-5">
          {items.map((it, i) => (
            <motion.div
              key={it.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="group relative rounded-2xl border border-border bg-card p-7 shadow-card hover:shadow-elegant transition-all hover:-translate-y-1"
            >
              <div className="absolute inset-0 gradient-card-bg rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl gradient-hero-bg shadow-glow">
                  <it.icon className="h-6 w-6 text-primary-foreground" />
                </div>
                <h3 className="mt-5 font-display text-xl font-bold">{it.title}</h3>
                <p className="mt-2 text-muted-foreground leading-relaxed">{it.text}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
