import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useMutation } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Sparkles, TrendingUp, Users, Lightbulb, Mail, MessageCircle, Phone, Facebook, Instagram, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { analyzeClientsWithAI } from "@/lib/ai-insights.functions";

export const Route = createFileRoute("/dashboard/ai-insights")({
  head: () => ({ meta: [{ title: "Analyse IA & Recommandations | SmartCom PME" }] }),
  component: Page,
});

const channelIcon = {
  email: Mail,
  sms: Phone,
  whatsapp: MessageCircle,
  facebook: Facebook,
  instagram: Instagram,
} as const;

const priorityColor = {
  haute: "bg-red-500/10 text-red-600 border-red-500/20",
  moyenne: "bg-amber-500/10 text-amber-600 border-amber-500/20",
  basse: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
} as const;

function Page() {
  const analyze = useServerFn(analyzeClientsWithAI);
  const m = useMutation({
    mutationFn: () => analyze({}),
    onError: (e: Error) => toast.error(e.message),
    onSuccess: () => toast.success("Analyse IA générée"),
  });

  const data = m.data;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
        <div>
          <h1 className="text-3xl font-display font-bold tracking-tight flex items-center gap-2">
            <Sparkles className="h-7 w-7 text-primary" /> Analyse IA & Recommandations
          </h1>
          <p className="text-muted-foreground max-w-2xl mt-2">
            L'IA analyse votre base clients et vos campagnes pour identifier des segments, détecter des tendances et proposer des actions marketing prêtes à l'emploi.
          </p>
        </div>
        <Button onClick={() => m.mutate()} disabled={m.isPending} size="lg">
          {m.isPending ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Analyse en cours…</> : <><Sparkles className="h-4 w-4 mr-2" /> Lancer l'analyse</>}
        </Button>
      </div>

      {!data && !m.isPending && (
        <Card className="border-dashed">
          <CardContent className="py-12 text-center text-muted-foreground">
            <Sparkles className="h-10 w-10 mx-auto mb-3 text-primary/50" />
            Cliquez sur « Lancer l'analyse » pour obtenir vos insights personnalisés.
          </CardContent>
        </Card>
      )}

      {data && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          <Card className="bg-gradient-to-br from-primary/5 to-accent/5 border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Lightbulb className="h-5 w-5 text-primary" /> Synthèse</CardTitle>
            </CardHeader>
            <CardContent className="text-sm leading-relaxed">{data.summary}</CardContent>
          </Card>

          {data.segments?.length > 0 && (
            <section>
              <h2 className="text-lg font-semibold mb-3 flex items-center gap-2"><Users className="h-5 w-5" /> Segments détectés</h2>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {data.segments.map((s, i) => (
                  <Card key={i}>
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-base">{s.name}</CardTitle>
                        <Badge variant="secondary">{s.size} clients</Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="text-sm text-muted-foreground">{s.description}</CardContent>
                  </Card>
                ))}
              </div>
            </section>
          )}

          {data.recommendations?.length > 0 && (
            <section>
              <h2 className="text-lg font-semibold mb-3 flex items-center gap-2"><Sparkles className="h-5 w-5" /> Recommandations de campagnes</h2>
              <div className="grid gap-4 lg:grid-cols-2">
                {data.recommendations.map((r, i) => {
                  const Icon = channelIcon[r.channel] ?? Mail;
                  return (
                    <Card key={i} className="hover:shadow-md transition-shadow">
                      <CardHeader>
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <div className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                              <Icon className="h-4 w-4" />
                            </div>
                            <div>
                              <CardTitle className="text-base">{r.title}</CardTitle>
                              <CardDescription className="text-xs mt-0.5">{r.channel.toUpperCase()} • {r.bestTime}</CardDescription>
                            </div>
                          </div>
                          <Badge variant="outline" className={priorityColor[r.priority]}>{r.priority}</Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        <div className="text-xs font-medium text-muted-foreground">Audience: <span className="text-foreground">{r.audience}</span></div>
                        <div className="rounded-md bg-muted/50 p-3 text-sm whitespace-pre-wrap">{r.message}</div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </section>
          )}

          {data.trends?.length > 0 && (
            <section>
              <h2 className="text-lg font-semibold mb-3 flex items-center gap-2"><TrendingUp className="h-5 w-5" /> Tendances détectées</h2>
              <Card>
                <CardContent className="pt-6">
                  <ul className="space-y-2">
                    {data.trends.map((t, i) => (
                      <li key={i} className="flex gap-2 text-sm">
                        <span className="text-primary">•</span>
                        <span>{t}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </section>
          )}
        </motion.div>
      )}
    </div>
  );
}
