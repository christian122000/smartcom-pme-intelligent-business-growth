import { motion } from "framer-motion";
import { Quote } from "lucide-react";

const testimonials = [
  {
    name: "Aïcha Mballa",
    role: "Fondatrice, Boutique Étoile",
    text: "SmartCom PME a transformé notre relation client. Le chatbot répond la nuit et nos ventes ont augmenté de 40% en trois mois.",
  },
  {
    name: "Jean-Paul Nkomo",
    role: "Directeur, AgroPlus SARL",
    text: "L'automatisation marketing nous fait gagner un temps fou. Les recommandations IA sont étonnamment pertinentes.",
  },
  {
    name: "Mireille Tchatchoua",
    role: "Responsable digital, KamerFood",
    text: "Une plateforme intuitive, locale et puissante. C'est exactement ce qu'il manquait aux PME camerounaises.",
  },
];

export function Testimonials() {
  return (
    <section className="py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto">
          <span className="text-xs font-semibold uppercase tracking-widest text-primary">Témoignages</span>
          <h2 className="mt-3 font-display text-3xl sm:text-4xl lg:text-5xl font-bold">
            Ils nous font <span className="gradient-text">confiance</span>
          </h2>
        </div>

        <div className="mt-14 grid md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="relative rounded-2xl border border-border bg-card p-7 shadow-card hover:shadow-elegant transition-all"
            >
              <Quote className="h-8 w-8 text-primary/30" />
              <p className="mt-4 text-foreground leading-relaxed">"{t.text}"</p>
              <div className="mt-6 flex items-center gap-3 pt-4 border-t border-border">
                <div className="h-11 w-11 rounded-full gradient-hero-bg flex items-center justify-center text-primary-foreground font-bold">
                  {t.name.split(" ").map((n) => n[0]).join("")}
                </div>
                <div>
                  <div className="font-semibold text-sm">{t.name}</div>
                  <div className="text-xs text-muted-foreground">{t.role}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
