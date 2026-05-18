import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Bot, Image as ImageIcon, PenLine, Megaphone, Languages, Mic, Video, Sparkles, ExternalLink } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/dashboard/ai-tools")({
  head: () => ({ meta: [{ title: "Outils IA | SmartCom PME" }] }),
  component: AiToolsPage,
});

type Tool = {
  name: string;
  description: string;
  url: string;
  category: string;
  icon: typeof Bot;
  internal?: boolean;
};

const tools: Tool[] = [
  {
    name: "Assistant SmartCom (Gemini)",
    description: "Votre chatbot marketing intégré : slogans, idées de campagnes, conseils stratégiques pour PME camerounaises.",
    url: "/dashboard/chatbot",
    category: "Intégré",
    icon: Sparkles,
    internal: true,
  },
  {
    name: "Générateur d'images SmartCom",
    description: "Créez vos visuels publicitaires (affiches, posts Facebook/Instagram, bannières WhatsApp) à partir d'une description. Intégré, gratuit.",
    url: "/dashboard/image-generator",
    category: "Intégré",
    icon: ImageIcon,
    internal: true,
  },
  {
    name: "ChatGPT",
    description: "Génération de textes publicitaires, e-mails, posts réseaux sociaux et réponses clients.",
    url: "https://chat.openai.com",
    category: "Texte",
    icon: Bot,
  },
  {
    name: "Google Gemini",
    description: "Assistant IA multimodal pour rédaction marketing et analyse de documents.",
    url: "https://gemini.google.com",
    category: "Texte",
    icon: Bot,
  },
  {
    name: "Claude (Anthropic)",
    description: "Excellent pour rédiger des contenus longs et structurer une stratégie marketing.",
    url: "https://claude.ai",
    category: "Texte",
    icon: PenLine,
  },
  {
    name: "Copy.ai",
    description: "Spécialisé en copywriting : slogans, descriptions produits, e-mails de vente.",
    url: "https://www.copy.ai",
    category: "Marketing",
    icon: Megaphone,
  },
  {
    name: "Jasper AI",
    description: "Plateforme marketing IA pour campagnes publicitaires et contenus de marque.",
    url: "https://www.jasper.ai",
    category: "Marketing",
    icon: Megaphone,
  },
  {
    name: "Canva Magic Studio",
    description: "Génération d'images et de visuels marketing prêts pour Facebook, Instagram, WhatsApp.",
    url: "https://www.canva.com/magic-studio/",
    category: "Image",
    icon: ImageIcon,
  },
  {
    name: "Midjourney",
    description: "Création d'images publicitaires haut de gamme via Discord.",
    url: "https://www.midjourney.com",
    category: "Image",
    icon: ImageIcon,
  },
  {
    name: "Leonardo AI",
    description: "Générateur d'images IA gratuit, idéal pour visuels de campagnes.",
    url: "https://leonardo.ai",
    category: "Image",
    icon: ImageIcon,
  },
  {
    name: "DeepL Translator",
    description: "Traduction de qualité française ↔ anglaise pour vos campagnes bilingues.",
    url: "https://www.deepl.com",
    category: "Langue",
    icon: Languages,
  },
  {
    name: "ElevenLabs",
    description: "Voix off IA pour vos spots radio et vidéos publicitaires.",
    url: "https://elevenlabs.io",
    category: "Audio",
    icon: Mic,
  },
  {
    name: "Runway ML",
    description: "Création et édition vidéo par IA pour campagnes sur Instagram et TikTok.",
    url: "https://runwayml.com",
    category: "Vidéo",
    icon: Video,
  },
];

const categories = ["Tous", "Intégré", "Texte", "Marketing", "Image", "Langue", "Audio", "Vidéo"];

function AiToolsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-display font-bold tracking-tight">Outils d'Intelligence Artificielle</h1>
        <p className="text-muted-foreground max-w-2xl">
          Une sélection des meilleures IA pour booster la communication digitale de votre PME. Cliquez sur une carte pour ouvrir l'outil.
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {categories.map((c) => (
          <Badge key={c} variant="secondary" className="cursor-default">{c}</Badge>
        ))}
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {tools.map((tool, i) => {
          const Icon = tool.icon;
          const CardInner = (
            <Card className="h-full transition-all hover:shadow-lg hover:-translate-y-1 hover:border-primary/40">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-primary/20 to-accent/20 text-primary">
                    <Icon className="h-5 w-5" />
                  </div>
                  <Badge variant={tool.internal ? "default" : "outline"}>{tool.category}</Badge>
                </div>
                <CardTitle className="text-lg mt-3 flex items-center gap-2">
                  {tool.name}
                  {!tool.internal && <ExternalLink className="h-3.5 w-3.5 text-muted-foreground" />}
                </CardTitle>
                <CardDescription className="line-clamp-3">{tool.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant={tool.internal ? "default" : "secondary"} size="sm" className="w-full">
                  {tool.internal ? "Ouvrir l'assistant" : "Visiter le site"}
                </Button>
              </CardContent>
            </Card>
          );
          return (
            <motion.div
              key={tool.name}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
            >
              {tool.internal ? (
                <Link to={tool.url}>{CardInner}</Link>
              ) : (
                <a href={tool.url} target="_blank" rel="noopener noreferrer">{CardInner}</a>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
