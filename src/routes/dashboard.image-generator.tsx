import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { motion } from "framer-motion";
import { Sparkles, Download, Loader2, ImageIcon } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/sonner";
import { generateImage } from "@/lib/image-gen.functions";

export const Route = createFileRoute("/dashboard/image-generator")({
  head: () => ({ meta: [{ title: "Générateur d'images IA | SmartCom PME" }] }),
  component: ImageGeneratorPage,
});

const examples = [
  "Affiche publicitaire pour un restaurant africain à Douala, ambiance chaleureuse, plats colorés",
  "Visuel Instagram pour une boutique de mode camerounaise, style moderne",
  "Bannière Facebook pour la promotion d'un salon de coiffure",
  "Logo minimaliste pour une PME de transport urbain à Yaoundé",
];

function ImageGeneratorPage() {
  const [prompt, setPrompt] = useState("");
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const gen = useServerFn(generateImage);

  const handleGenerate = async () => {
    if (prompt.trim().length < 3) {
      toast.error("Décrivez l'image que vous voulez créer.");
      return;
    }
    setLoading(true);
    setImageUrl(null);
    try {
      const { imageUrl } = await gen({ data: { prompt: prompt.trim() } });
      setImageUrl(imageUrl);
      toast.success("Image générée !");
    } catch (e: any) {
      toast.error(e?.message || "Échec de la génération");
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (!imageUrl) return;
    const a = document.createElement("a");
    a.href = imageUrl;
    a.download = `smartcom-${Date.now()}.png`;
    a.click();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-display font-bold tracking-tight flex items-center gap-2">
          <Sparkles className="h-7 w-7 text-primary" />
          Générateur d'images IA
        </h1>
        <p className="text-muted-foreground max-w-2xl">
          Créez des visuels publicitaires pour vos campagnes Facebook, Instagram, WhatsApp à partir d'une simple description.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Décrivez votre visuel</CardTitle>
            <CardDescription>
              Soyez précis : sujet, ambiance, couleurs, style. Plus la description est claire, meilleur est le résultat.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Ex : Affiche publicitaire pour une boulangerie à Douala, style moderne, couleurs chaudes..."
              rows={6}
              maxLength={1000}
            />
            <div className="flex flex-wrap gap-2">
              {examples.map((ex) => (
                <button
                  key={ex}
                  type="button"
                  onClick={() => setPrompt(ex)}
                  className="text-xs px-2 py-1 rounded-md bg-muted hover:bg-muted/70 text-muted-foreground transition"
                >
                  {ex.slice(0, 40)}…
                </button>
              ))}
            </div>
            <Button onClick={handleGenerate} disabled={loading} className="w-full">
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Génération en cours…
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4 mr-2" />
                  Générer l'image
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Résultat</CardTitle>
            <CardDescription>L'image apparaîtra ici. Téléchargez-la pour l'utiliser dans vos campagnes.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="aspect-square w-full rounded-lg border bg-muted/30 flex items-center justify-center overflow-hidden">
              {loading ? (
                <div className="flex flex-col items-center gap-3 text-muted-foreground">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  <p className="text-sm">Création de votre visuel…</p>
                </div>
              ) : imageUrl ? (
                <motion.img
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  src={imageUrl}
                  alt="Image générée par IA"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="flex flex-col items-center gap-3 text-muted-foreground">
                  <ImageIcon className="h-12 w-12" />
                  <p className="text-sm">Aucune image pour le moment</p>
                </div>
              )}
            </div>
            {imageUrl && (
              <Button onClick={handleDownload} variant="secondary" className="w-full mt-4">
                <Download className="h-4 w-4 mr-2" />
                Télécharger
              </Button>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
