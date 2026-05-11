import { motion } from "framer-motion";
import { ArrowRight, PlayCircle, Sparkles } from "lucide-react";
import heroImg from "@/assets/hero-ai.jpg";

const stats = [
  { value: "+500", label: "PME accompagnées" },
  { value: "92%", label: "Satisfaction client" },
  { value: "+1M", label: "Messages automatisés" },
];

export function Hero() {
  return (
    <section id="accueil" className="relative overflow-hidden pt-32 pb-20 lg:pt-40 lg:pb-28">
      <div className="absolute inset-0 grid-pattern opacity-50 [mask-image:radial-gradient(ellipse_at_center,black,transparent_70%)]" />
      <div className="absolute -top-32 -left-32 h-96 w-96 rounded-full bg-primary/20 blur-3xl" />
      <div className="absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-violet/20 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-12 items-center">
        <div>
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-3 py-1 text-xs font-medium text-muted-foreground"
          >
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            Plateforme IA pour PME camerounaises
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.6 }}
            className="mt-6 font-display text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.05]"
          >
            Boostez votre <span className="gradient-text">communication digitale</span> avec l'intelligence artificielle
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="mt-6 text-lg text-muted-foreground max-w-xl leading-relaxed"
          >
            SmartCom PME automatise votre marketing, analyse vos données clients et déploie un chatbot intelligent — une solution SaaS pensée pour les petites et moyennes entreprises au Cameroun.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="mt-8 flex flex-wrap gap-3"
          >
            <a
              href="#fonctionnalites"
              className="inline-flex items-center gap-2 h-12 rounded-full px-6 text-sm font-semibold text-primary-foreground gradient-hero-bg shadow-glow hover:scale-[1.03] transition-transform"
            >
              Démarrer gratuitement <ArrowRight className="h-4 w-4" />
            </a>
            <a
              href="#apropos"
              className="inline-flex items-center gap-2 h-12 rounded-full border border-border bg-card px-6 text-sm font-semibold hover:bg-muted transition"
            >
              <PlayCircle className="h-4 w-4 text-primary" /> Découvrir le projet
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-12 grid grid-cols-3 gap-4 max-w-lg"
          >
            {stats.map((s) => (
              <div key={s.label} className="border-l-2 border-primary/40 pl-3">
                <div className="font-display text-2xl sm:text-3xl font-bold gradient-text">{s.value}</div>
                <div className="text-xs text-muted-foreground mt-1">{s.label}</div>
              </div>
            ))}
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative"
        >
          <div className="absolute -inset-4 gradient-hero-bg rounded-3xl blur-2xl opacity-30" />
          <div className="relative rounded-3xl overflow-hidden border border-border shadow-elegant">
            <img src={heroImg} alt="Illustration IA SmartCom PME" width={1280} height={1024} className="w-full h-auto" />
          </div>
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 4, repeat: Infinity }}
            className="absolute -left-6 top-10 hidden sm:flex items-center gap-3 rounded-2xl bg-card border border-border p-3 shadow-elegant"
          >
            <span className="h-10 w-10 rounded-xl gradient-hero-bg flex items-center justify-center">
              <Sparkles className="h-5 w-5 text-primary-foreground" />
            </span>
            <div>
              <div className="text-xs text-muted-foreground">Engagement</div>
              <div className="font-bold">+38% ce mois</div>
            </div>
          </motion.div>
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 5, repeat: Infinity }}
            className="absolute -right-4 bottom-10 hidden sm:block rounded-2xl bg-card border border-border p-4 shadow-elegant"
          >
            <div className="text-xs text-muted-foreground">Chatbot IA</div>
            <div className="font-bold text-sm">24/7 actif</div>
            <div className="mt-2 flex gap-1">
              {[1, 2, 3].map((i) => (
                <span key={i} className="h-1.5 w-6 rounded-full gradient-hero-bg" />
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
