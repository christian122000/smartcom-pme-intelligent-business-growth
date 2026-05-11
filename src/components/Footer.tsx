import { Sparkles, Mail, MapPin, Phone } from "lucide-react";

export function Footer() {
  return (
    <footer id="contact" className="relative border-t border-border bg-card/40">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-4 gap-10">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2">
              <span className="h-9 w-9 rounded-xl gradient-hero-bg flex items-center justify-center shadow-glow">
                <Sparkles className="h-5 w-5 text-primary-foreground" />
              </span>
              <span className="font-display font-bold text-lg">
                SmartCom <span className="gradient-text">PME</span>
              </span>
            </div>
            <p className="mt-4 text-muted-foreground max-w-md leading-relaxed">
              Plateforme SaaS intelligente d'automatisation marketing et de communication digitale pour les PME camerounaises. Projet académique de soutenance universitaire.
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              {["React", "TypeScript", "Tailwind CSS", "Shadcn UI", "Framer Motion", "Recharts"].map((t) => (
                <span key={t} className="text-xs px-3 py-1 rounded-full border border-border bg-card text-muted-foreground">
                  {t}
                </span>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-display font-bold mb-4">Navigation</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#accueil" className="hover:text-primary transition">Accueil</a></li>
              <li><a href="#fonctionnalites" className="hover:text-primary transition">Fonctionnalités</a></li>
              <li><a href="#apropos" className="hover:text-primary transition">À propos</a></li>
              <li><a href="#contact" className="hover:text-primary transition">Contact</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-display font-bold mb-4">Contact</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex items-center gap-2"><Mail className="h-4 w-4 text-primary" /> contact@smartcompme.cm</li>
              <li className="flex items-center gap-2"><Phone className="h-4 w-4 text-primary" /> +237 6 00 00 00 00</li>
              <li className="flex items-center gap-2"><MapPin className="h-4 w-4 text-primary" /> Yaoundé, Cameroun</li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} SmartCom PME · Projet de soutenance universitaire
          </p>
          <p className="text-xs text-muted-foreground">
            Conçu avec <span className="gradient-text font-semibold">passion</span> pour les PME du Cameroun
          </p>
        </div>
      </div>
    </footer>
  );
}
