import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

type Insights = {
  summary: string;
  segments: { name: string; size: number; description: string }[];
  recommendations: {
    title: string;
    channel: "email" | "sms" | "whatsapp" | "facebook" | "instagram";
    audience: string;
    message: string;
    bestTime: string;
    priority: "haute" | "moyenne" | "basse";
  }[];
  trends: string[];
};

export const analyzeClientsWithAI = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase } = context;
    const apiKey = process.env.LOVABLE_API_KEY;
    if (!apiKey) throw new Error("LOVABLE_API_KEY manquant");

    const { data: clients, error: cErr } = await supabase
      .from("clients")
      .select("name,email,phone,company,tag,notes,created_at");
    if (cErr) throw new Error(cErr.message);

    const { data: campaigns } = await supabase
      .from("campaigns")
      .select("name,channel,status,sent_count,created_at")
      .order("created_at", { ascending: false })
      .limit(20);

    const total = clients?.length ?? 0;
    if (total === 0) {
      return {
        summary: "Aucun client enregistré pour le moment. Ajoutez vos premiers clients pour obtenir une analyse IA personnalisée.",
        segments: [],
        recommendations: [],
        trends: [],
      } as Insights;
    }

    const tagCount: Record<string, number> = {};
    for (const c of clients ?? []) {
      const t = (c.tag as string) || "Non classé";
      tagCount[t] = (tagCount[t] ?? 0) + 1;
    }

    const sample = (clients ?? []).slice(0, 50).map((c) => ({
      name: c.name,
      tag: c.tag,
      hasEmail: !!c.email,
      hasPhone: !!c.phone,
      company: c.company ?? null,
      notes: (c.notes ?? "").slice(0, 120),
    }));

    const prompt = `Tu es un expert marketing pour PME camerounaises (SmartCom). Analyse cette base client et propose des recommandations de campagnes concrètes.

Contexte:
- Total clients: ${total}
- Répartition par tag: ${JSON.stringify(tagCount)}
- Campagnes récentes: ${JSON.stringify(campaigns ?? [])}
- Échantillon de clients (max 50): ${JSON.stringify(sample)}

Réponds STRICTEMENT en JSON valide (sans markdown, sans \`\`\`) avec ce schéma:
{
  "summary": "résumé en 2-3 phrases en français",
  "segments": [{"name":"...","size":number,"description":"..."}],
  "recommendations": [{"title":"...","channel":"email|sms|whatsapp|facebook|instagram","audience":"...","message":"texte prêt à envoyer en français","bestTime":"ex: Mardi 10h","priority":"haute|moyenne|basse"}],
  "trends": ["observation 1", "observation 2"]
}

Donne 3-5 segments et 3-5 recommandations actionnables adaptées au contexte camerounais (WhatsApp très populaire, mobile money, etc.).`;

    const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: "Tu retournes uniquement du JSON valide, sans texte autour." },
          { role: "user", content: prompt },
        ],
        response_format: { type: "json_object" },
      }),
    });

    if (!res.ok) {
      const txt = await res.text();
      if (res.status === 429) throw new Error("Limite IA atteinte. Réessayez dans un instant.");
      if (res.status === 402) throw new Error("Crédits IA épuisés.");
      throw new Error(`Erreur IA (${res.status}): ${txt.slice(0, 200)}`);
    }

    const json = await res.json();
    const content = json?.choices?.[0]?.message?.content ?? "{}";
    let parsed: Insights;
    try {
      parsed = JSON.parse(content);
    } catch {
      const m = content.match(/\{[\s\S]*\}/);
      parsed = m ? JSON.parse(m[0]) : ({ summary: content, segments: [], recommendations: [], trends: [] } as Insights);
    }
    return parsed;
  });
