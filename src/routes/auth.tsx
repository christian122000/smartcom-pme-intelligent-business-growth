import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, Loader2 } from "lucide-react";
import { z } from "zod";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import { useAuth } from "@/hooks/use-auth";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Connexion | SmartCom PME" },
      { name: "description", content: "Connectez-vous ou créez un compte SmartCom PME pour gérer la communication digitale de votre PME." },
    ],
  }),
  component: AuthPage,
});

const signInSchema = z.object({
  email: z.string().trim().email("Email invalide").max(255),
  password: z.string().min(6, "Au moins 6 caractères").max(72),
});

const signUpSchema = signInSchema.extend({
  full_name: z.string().trim().min(2, "Nom requis").max(100),
  company_name: z.string().trim().max(120).optional().or(z.literal("")),
});

function AuthPage() {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!loading && user) navigate({ to: "/" });
  }, [user, loading, navigate]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    setSubmitting(true);
    try {
      if (mode === "signup") {
        const parsed = signUpSchema.safeParse({
          email: fd.get("email"),
          password: fd.get("password"),
          full_name: fd.get("full_name"),
          company_name: fd.get("company_name") || "",
        });
        if (!parsed.success) {
          toast.error(parsed.error.issues[0].message);
          return;
        }
        const { error } = await supabase.auth.signUp({
          email: parsed.data.email,
          password: parsed.data.password,
          options: {
            emailRedirectTo: `${window.location.origin}/`,
            data: {
              full_name: parsed.data.full_name,
              company_name: parsed.data.company_name,
            },
          },
        });
        if (error) {
          toast.error(error.message.includes("already") ? "Cet email est déjà utilisé." : error.message);
          return;
        }
        toast.success("Compte créé ! Vérifiez votre email pour confirmer.");
      } else {
        const parsed = signInSchema.safeParse({
          email: fd.get("email"),
          password: fd.get("password"),
        });
        if (!parsed.success) {
          toast.error(parsed.error.issues[0].message);
          return;
        }
        const { error } = await supabase.auth.signInWithPassword(parsed.data);
        if (error) {
          toast.error(error.message.includes("Invalid") ? "Email ou mot de passe incorrect." : error.message);
          return;
        }
        toast.success("Connexion réussie !");
        navigate({ to: "/" });
      }
    } finally {
      setSubmitting(false);
    }
  }

  async function handleGoogle() {
    setSubmitting(true);
    const result = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin,
    });
    if (result.error) {
      toast.error("Connexion Google impossible.");
      setSubmitting(false);
      return;
    }
    if (result.redirected) return;
    navigate({ to: "/" });
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-background px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md"
      >
        <Link to="/" className="flex items-center justify-center gap-2 mb-8">
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl gradient-hero-bg shadow-glow">
            <Sparkles className="h-5 w-5 text-primary-foreground" />
          </span>
          <span className="font-display font-bold text-xl">
            SmartCom <span className="gradient-text">PME</span>
          </span>
        </Link>

        <div className="rounded-2xl border border-border bg-card p-6 sm:p-8 shadow-elegant">
          <h1 className="text-2xl font-bold font-display">
            {mode === "signin" ? "Connexion" : "Créer un compte"}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {mode === "signin"
              ? "Accédez à votre tableau de bord SmartCom PME."
              : "Rejoignez les PME camerounaises qui digitalisent leur communication."}
          </p>

          <button
            type="button"
            onClick={handleGoogle}
            disabled={submitting}
            className="mt-6 w-full h-11 rounded-lg border border-border bg-background hover:bg-muted transition flex items-center justify-center gap-2 text-sm font-medium disabled:opacity-50"
          >
            <svg className="h-4 w-4" viewBox="0 0 48 48"><path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.4 29.3 35.5 24 35.5c-6.3 0-11.5-5.2-11.5-11.5S17.7 12.5 24 12.5c2.9 0 5.6 1.1 7.6 2.9l5.7-5.7C33.6 6.4 29.1 4.5 24 4.5 13.2 4.5 4.5 13.2 4.5 24S13.2 43.5 24 43.5 43.5 34.8 43.5 24c0-1.2-.1-2.3-.4-3.5z"/><path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 16 19 12.5 24 12.5c2.9 0 5.6 1.1 7.6 2.9l5.7-5.7C33.6 6.4 29.1 4.5 24 4.5 16.3 4.5 9.7 8.9 6.3 14.7z"/><path fill="#4CAF50" d="M24 43.5c5 0 9.5-1.9 12.9-5l-6-5c-1.9 1.4-4.3 2.2-6.9 2.2-5.3 0-9.7-3.1-11.3-7.5l-6.5 5C9.5 39.1 16.2 43.5 24 43.5z"/><path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.3-2.4 4.3-4.4 5.5l6 5c-.4.4 6.6-4.8 6.6-14.5 0-1.2-.1-2.3-.4-3.5z"/></svg>
            Continuer avec Google
          </button>

          <div className="my-6 flex items-center gap-3 text-xs text-muted-foreground">
            <div className="h-px flex-1 bg-border" />
            ou avec votre email
            <div className="h-px flex-1 bg-border" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === "signup" && (
              <>
                <Field name="full_name" label="Nom complet" placeholder="Jean Mbarga" required />
                <Field name="company_name" label="Entreprise (optionnel)" placeholder="Ma PME SARL" />
              </>
            )}
            <Field name="email" type="email" label="Email" placeholder="vous@exemple.cm" required />
            <Field name="password" type="password" label="Mot de passe" placeholder="••••••••" required />

            <button
              type="submit"
              disabled={submitting}
              className="w-full h-11 rounded-lg gradient-hero-bg text-primary-foreground font-semibold shadow-elegant hover:shadow-glow transition flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
              {mode === "signin" ? "Se connecter" : "Créer mon compte"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            {mode === "signin" ? "Pas encore de compte ?" : "Déjà inscrit ?"}{" "}
            <button
              type="button"
              onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
              className="font-semibold text-primary hover:underline"
            >
              {mode === "signin" ? "Créer un compte" : "Se connecter"}
            </button>
          </p>
        </div>
      </motion.div>
    </main>
  );
}

function Field({
  name,
  label,
  type = "text",
  placeholder,
  required,
}: {
  name: string;
  label: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
}) {
  return (
    <label className="block">
      <span className="block text-sm font-medium mb-1.5">{label}</span>
      <input
        name={name}
        type={type}
        placeholder={placeholder}
        required={required}
        className="w-full h-11 rounded-lg border border-border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition"
      />
    </label>
  );
}
