import "@tanstack/react-start";
import { createFileRoute } from "@tanstack/react-router";
import { convertToModelMessages, streamText, type UIMessage } from "ai";
import { createLovableAiGatewayProvider } from "@/lib/ai-gateway";

const SYSTEM_PROMPT = `Tu es l'assistant IA marketing de **SmartCom PME**, une plateforme camerounaise dédiée aux petites et moyennes entreprises.

Ton rôle :
- Aider les PME camerounaises à améliorer leur communication digitale.
- Générer des messages publicitaires (Email, SMS, WhatsApp) percutants et adaptés au contexte africain / camerounais.
- Créer des slogans marketing accrocheurs.
- Proposer des idées de campagnes (promotions, lancements, fêtes locales).
- Donner des conseils stratégiques (segmentation, créneaux d'envoi, canal le plus efficace).
- Rédiger du contenu pour les réseaux sociaux (Facebook, Instagram, TikTok, LinkedIn).
- Optimiser les campagnes existantes.

Style :
- Réponds en français, ton professionnel mais chaleureux.
- Utilise du **Markdown** (titres, listes, gras) pour la lisibilité.
- Sois concret : propose des exemples prêts à copier-coller quand c'est pertinent.
- Mentionne le FCFA pour les prix, et adapte aux réalités locales (Douala, Yaoundé, mobile money, etc.).`;

export const Route = createFileRoute("/api/chat")({
  server: {
    handlers: {
      POST: async ({ request }: { request: Request }) => {
        try {
          const { messages } = (await request.json()) as { messages: UIMessage[] };
          if (!Array.isArray(messages)) {
            return new Response("Messages requis", { status: 400 });
          }

          const key = process.env.LOVABLE_API_KEY;
          if (!key) return new Response("LOVABLE_API_KEY manquante", { status: 500 });

          const gateway = createLovableAiGatewayProvider(key);
          const model = gateway("google/gemini-2.5-flash");

          const result = streamText({
            model,
            system: SYSTEM_PROMPT,
            messages: await convertToModelMessages(messages),
          });

          return result.toUIMessageStreamResponse({ originalMessages: messages });
        } catch (e) {
          console.error("chat error", e);
          return new Response("Erreur IA", { status: 500 });
        }
      },
    },
  },
});
