import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Facebook, Instagram, MessageCircle, CheckCircle2, ArrowRight, Lightbulb, Target, TrendingUp } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const Route = createFileRoute("/dashboard/social-campaigns")({
  head: () => ({ meta: [{ title: "Campagnes Réseaux Sociaux | SmartCom PME" }] }),
  component: SocialCampaignsPage,
});

type Platform = {
  id: string;
  name: string;
  icon: typeof Facebook;
  color: string;
  url: string;
  audience: string;
  bestFor: string;
  steps: { title: string; description: string }[];
  tips: string[];
};

const platforms: Platform[] = [
  {
    id: "facebook",
    name: "Facebook",
    icon: Facebook,
    color: "from-blue-500 to-blue-700",
    url: "https://www.facebook.com/business/ads",
    audience: "Très large au Cameroun — tous âges, urbain et rural.",
    bestFor: "Notoriété, génération de leads, ventes locales.",
    steps: [
      { title: "Créer une Page Facebook Business", description: "Allez sur facebook.com/pages/create et créez la page de votre PME (nom, logo, description, contact)." },
      { title: "Accéder au Gestionnaire de publicités", description: "Rendez-vous sur business.facebook.com puis cliquez sur 'Ads Manager'." },
      { title: "Choisir un objectif", description: "Notoriété, trafic, engagement, prospects, conversions ou ventes — selon votre besoin." },
      { title: "Définir votre audience", description: "Ciblez par ville (Douala, Yaoundé…), âge, sexe, centres d'intérêt et comportements." },
      { title: "Fixer le budget", description: "Budget quotidien à partir de 1 000 FCFA. Choisissez la durée de la campagne." },
      { title: "Créer la publicité", description: "Image ou vidéo, titre accrocheur, texte court, bouton d'appel à l'action (Acheter, WhatsApp, Appeler)." },
      { title: "Lancer et suivre", description: "Validez le paiement (Visa, Mastercard, Mobile Money via certains intermédiaires) et suivez les statistiques en temps réel." },
    ],
    tips: [
      "Utilisez des visuels en français + image locale (Cameroun) pour mieux convertir.",
      "Activez le bouton 'Envoyer un message' pour rediriger vers WhatsApp Business.",
      "Testez 2 ou 3 visuels différents (A/B test) avec un petit budget avant de scaler.",
    ],
  },
  {
    id: "instagram",
    name: "Instagram",
    icon: Instagram,
    color: "from-pink-500 via-fuchsia-500 to-orange-500",
    url: "https://business.instagram.com/advertising",
    audience: "Jeunes urbains 18-35 ans, mode, beauté, food, lifestyle.",
    bestFor: "Image de marque, lancements de produits, influence.",
    steps: [
      { title: "Passer en compte Professionnel", description: "Dans Instagram → Paramètres → Compte → 'Passer à un compte professionnel'." },
      { title: "Connecter votre Page Facebook", description: "Liez Instagram à la Page Facebook de votre PME via le Gestionnaire Meta Business." },
      { title: "Choisir le format", description: "Publication Feed, Story (vertical 9:16), Reels (vidéo courte), Carousel." },
      { title: "Créer la campagne dans Ads Manager", description: "Même outil que Facebook : sélectionnez Instagram comme placement publicitaire." },
      { title: "Soigner le visuel", description: "Instagram est très visuel : photos pro, vidéos verticales, cohérence des couleurs." },
      { title: "Ajouter des hashtags pertinents", description: "Exemple : #MadeInCameroun #DoualaShopping #YaoundeBusiness." },
      { title: "Lancer et analyser", description: "Suivez impressions, portée, clics et conversions dans Meta Business Suite." },
    ],
    tips: [
      "Les Reels offrent la meilleure portée organique en 2026.",
      "Collaborez avec un micro-influenceur local (5k-50k abonnés) pour plus d'impact à coût réduit.",
      "Publiez 3-5 fois par semaine pour maintenir l'algorithme actif.",
    ],
  },
  {
    id: "whatsapp",
    name: "WhatsApp",
    icon: MessageCircle,
    color: "from-emerald-500 to-green-600",
    url: "https://business.whatsapp.com",
    audience: "Quasi-universel au Cameroun, idéal pour relation client directe.",
    bestFor: "Service client, ventes 1-à-1, promotions ciblées, fidélisation.",
    steps: [
      { title: "Installer WhatsApp Business", description: "Téléchargez l'app gratuite WhatsApp Business sur Play Store ou App Store." },
      { title: "Configurer le profil entreprise", description: "Logo, description, horaires, adresse, site web, catalogue de produits." },
      { title: "Créer un catalogue", description: "Ajoutez vos produits avec photo, prix en FCFA et description directement dans l'app." },
      { title: "Préparer des messages d'accueil", description: "Réponse automatique, message d'absence, réponses rapides (/promo, /tarif…)." },
      { title: "Construire votre liste de diffusion", description: "Via SmartCom PME, sélectionnez vos clients et envoyez la campagne. WhatsApp limite à 256 contacts par liste." },
      { title: "Lancer une campagne publicitaire", description: "Depuis Facebook Ads Manager, créez une pub 'Click-to-WhatsApp' qui ouvre directement une conversation." },
      { title: "Mesurer et relancer", description: "Suivez les conversations entamées, les ventes conclues et relancez les clients inactifs." },
    ],
    tips: [
      "Privilégiez la qualité à la quantité : un message personnalisé convertit 5x plus.",
      "Utilisez WhatsApp Business API pour automatiser à grande échelle (via partenaires : Twilio, 360dialog).",
      "Respectez les heures (8h-20h) pour ne pas être marqué spam.",
    ],
  },
];

function SocialCampaignsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-display font-bold tracking-tight">Lancer une campagne sur les réseaux sociaux</h1>
        <p className="text-muted-foreground max-w-3xl">
          Guide pas-à-pas pour lancer vos premières campagnes publicitaires sur <b>Facebook</b>, <b>Instagram</b> et <b>WhatsApp</b> depuis votre propre compte, adapté au marché camerounais.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {[
          { icon: Target, title: "Ciblez juste", text: "Définissez précisément votre audience avant de dépenser." },
          { icon: Lightbulb, title: "Créativité d'abord", text: "Un bon visuel vaut mieux qu'un gros budget." },
          { icon: TrendingUp, title: "Mesurez, ajustez", text: "Suivez chaque FCFA dépensé et optimisez." },
        ].map((c, i) => (
          <motion.div key={c.title} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
            <Card className="bg-gradient-to-br from-card to-muted/30">
              <CardHeader>
                <c.icon className="h-6 w-6 text-primary" />
                <CardTitle className="text-base">{c.title}</CardTitle>
                <CardDescription>{c.text}</CardDescription>
              </CardHeader>
            </Card>
          </motion.div>
        ))}
      </div>

      <Tabs defaultValue="facebook" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          {platforms.map((p) => (
            <TabsTrigger key={p.id} value={p.id} className="flex items-center gap-2">
              <p.icon className="h-4 w-4" /> {p.name}
            </TabsTrigger>
          ))}
        </TabsList>

        {platforms.map((p) => (
          <TabsContent key={p.id} value={p.id} className="space-y-6 mt-6">
            <Card className="overflow-hidden">
              <div className={`h-2 bg-gradient-to-r ${p.color}`} />
              <CardHeader>
                <div className="flex items-start justify-between flex-wrap gap-3">
                  <div className="flex items-center gap-3">
                    <div className={`inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${p.color} text-white shadow-lg`}>
                      <p.icon className="h-6 w-6" />
                    </div>
                    <div>
                      <CardTitle>{p.name}</CardTitle>
                      <CardDescription>{p.bestFor}</CardDescription>
                    </div>
                  </div>
                  <Button asChild>
                    <a href={p.url} target="_blank" rel="noopener noreferrer">
                      Ouvrir {p.name} <ArrowRight className="ml-2 h-4 w-4" />
                    </a>
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                <Badge variant="outline">Audience : {p.audience}</Badge>
              </CardContent>
            </Card>

            <div className="grid gap-4 lg:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Étapes pour lancer votre campagne</CardTitle>
                </CardHeader>
                <CardContent>
                  <ol className="space-y-4">
                    {p.steps.map((step, idx) => (
                      <motion.li
                        key={step.title}
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.04 }}
                        className="flex gap-3"
                      >
                        <div className="flex-shrink-0 inline-flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 text-primary text-sm font-bold">
                          {idx + 1}
                        </div>
                        <div>
                          <div className="font-semibold text-sm">{step.title}</div>
                          <div className="text-sm text-muted-foreground">{step.description}</div>
                        </div>
                      </motion.li>
                    ))}
                  </ol>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-primary/5 to-accent/5">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Lightbulb className="h-5 w-5 text-primary" /> Conseils d'expert
                  </CardTitle>
                  <CardDescription>Bonnes pratiques pour le marché camerounais</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {p.tips.map((tip) => (
                      <li key={tip} className="flex gap-2 text-sm">
                        <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
