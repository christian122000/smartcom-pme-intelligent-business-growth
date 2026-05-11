import { motion } from "framer-motion";
import { BarChart3, Zap, Bot, Sparkles, Bell, Share2 } from "lucide-react";

const features = [
  { icon: BarChart3, title: "Analyse des données clients", text: "Visualisations claires, segmentation automatique et insights actionnables sur le comportement de vos clients." },
  { icon: Zap, title: "Automatisation marketing", text: "Lancez des campagnes multicanales déclenchées par des scénarios intelligents adaptés à vos objectifs." },
  { icon: Bot, title: "Chatbot intelligent", text: "Un assistant IA conversationnel disponible 24/7 pour répondre, qualifier et convertir vos prospects." },
  { icon: Sparkles, title: "Recommandations IA", text: "Des suggestions personnalisées de contenu, d'offres et d'actions optimisées par machine learning." },
  { icon: Bell, title: "Notifications intelligentes", text: "Alertes contextuelles sur les opportunités, anomalies et performances clés de vos campagnes." },
  { icon: Share2, title: "Intégration réseaux sociaux", text: "Pilotez Facebook, Instagram, WhatsApp Business et plus depuis un tableau de bord unifié." },
];

export function Features() {
  return (
    <section id="fonctionnalites" className="py-24 relative gradient-soft-bg">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto">
          <span className="text-xs font-semibold uppercase tracking-widest text-primary">Fonctionnalités</span>
          <h2 className="mt-3 font-display text-3xl sm:text-4xl lg:text-5xl font-bold">
            Tout ce qu'il faut pour <span className="gradient-text">scaler</span> votre PME
          </h2>
          <p className="mt-4 text-muted-foreground text-lg">
            Une suite d'outils IA pensée pour faire passer votre communication au niveau supérieur.
          </p>
        </div>

        <div className="mt-16 grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.5 }}
              className="group relative rounded-2xl border border-border bg-card p-7 shadow-card hover:shadow-glow transition-all hover:-translate-y-2"
            >
              <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl gradient-card-bg border border-border group-hover:gradient-hero-bg transition-all">
                <f.icon className="h-7 w-7 text-primary group-hover:text-primary-foreground transition-colors" />
              </div>
              <h3 className="mt-6 font-display text-lg font-bold">{f.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{f.text}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
