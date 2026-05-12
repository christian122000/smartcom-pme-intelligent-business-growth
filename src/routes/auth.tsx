import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Loader2, Eye, EyeOff, Mail, ArrowLeft } from "lucide-react";
import { z } from "zod";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import { useAuth } from "@/hooks/use-auth";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Connexion | SmartCom PME" },
      { name: "description", content: "Connectez-vous ou créez un compte SmartCom PME." },
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

type Mode = "signin" | "signup" | "forgot";

function AuthPage() {
  const navigate = useNavigate();
  const { user, role, loading } = useAuth();
  const [mode, setMode] = useState<Mode>("signin");
  const [submitting, setSubmitting] = useState(false);
  const [showPwd, setShowPwd] = useState(false);

  useEffect(() => {
    if (!loading && user && role) {
      navigate({ to: role === "admin" ? "/admin" : "/dashboard" });
    }
  }, [user, role, loading, navigate]);

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
        if (!parsed.success) return toast.error(parsed.error.issues[0].message);
        const { error } = await supabase.auth.signUp({
          email: parsed.data.email,
          password: parsed.data.password,
          options: {
            emailRedirectTo: `${window.location.origin}/`,
            data: { full_name: parsed.data.full_name, company_name: parsed.data.company_name },
          },
        });
        if (error) return toast.error(error.message.includes("already") ? "Cet email est déjà utilisé." : error.message);
        toast.success("Compte créé ! Vérifiez votre email pour confirmer.");
      } else if (mode === "signin") {
        const parsed = signInSchema.safeParse({ email: fd.get("email"), password: fd.get("password") });
        if (!parsed.success) return toast.error(parsed.error.issues[0].message);
        const { error } = await supabase.auth.signInWithPassword(parsed.data);
        if (error) return toast.error(error.message.includes("Invalid") ? "Email ou mot de passe incorrect." : error.message);
        toast.success("Connexion réussie !");
      } else {
        const email = String(fd.get("email") ?? "").trim();
        if (!z.string().email().safeParse(email).success) return toast.error("Email invalide");
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/reset-password`,
        });
        if (error) return toast.error(error.message);
        toast.success("Email de réinitialisation envoyé !");
        setMode("signin");
      }
    } finally {
      setSubmitting(false);
    }
  }

  async function handleGoogle() {
    setSubmitting(true);
    const result = await lovable.auth.signInWithOAuth("google", { redirect_uri: window.location.origin });
    if (result.error) {
      toast.error("Connexion Google impossible.");
      setSubmitting(false);
      return;
    }
    if (result.redirected) return;
  }

  return (
    <main className="min-h-screen grid lg:grid-cols-2 bg-background">
      {/* Left visual */}
      <div className="hidden lg:flex relative overflow-hidden bg-gradient-to-br from-primary via-primary/80 to-accent text-primary-foreground p-12 flex-col justify-between">
        <div className="absolute -top-20 -right-20 w-96 h-96 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute bottom-0 -left-20 w-96 h-96 rounded-full bg-accent/30 blur-3xl" />
        <Link to="/" className="relative flex items-center gap-2">
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-white/20 backdrop-blur">
            <Sparkles className="h-5 w-5" />
          </span>
          <span className="font-display font-bold text-xl">SmartCom PME</span>
        </Link>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="relative">
          <h2 className="text-4xl font-bold font-display leading-tight">
            L'intelligence artificielle au service des PME camerounaises.
          </h2>
          <p className="mt-4 text-lg opacity-90">
            Automatisez vos campagnes, comprenez vos clients, et faites grandir votre entreprise.
          </p>
          <div className="mt-8 grid grid-cols-3 gap-4">
            {[{ k: "500+", v: "PME" }, { k: "98%", v: "Satisfaction" }, { k: "24/7", v: "IA" }].map((s) => (
              <div key={s.k} className="rounded-xl bg-white/10 backdrop-blur p-4">
                <div className="text-2xl font-bold">{s.k}</div>
                <div className="text-xs opacity-80">{s.v}</div>
              </div>
            ))}
          </div>
        </motion.div>
        <p className="relative text-xs opacity-70">© SmartCom PME · Cameroun 🇨🇲</p>
      </div>

      {/* Right form */}
      <div className="flex items-center justify-center px-4 py-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
          <Link to="/" className="lg:hidden flex items-center justify-center gap-2 mb-6">
            <Sparkles className="h-5 w-5 text-primary" />
            <span className="font-display font-bold">SmartCom PME</span>
          </Link>

          <div className="rounded-2xl border border-border bg-card p-6 sm:p-8 shadow-xl">
            <AnimatePresence mode="wait">
              <motion.div key={mode} initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -8 }} transition={{ duration: 0.2 }}>
                {mode === "forgot" ? (
                  <button onClick={() => setMode("signin")} className="text-sm text-muted-foreground hover:text-foreground inline-flex items-center gap-1 mb-4">
                    <ArrowLeft className="h-4 w-4" /> Retour
                  </button>
                ) : null}

                <h1 className="text-2xl font-bold font-display">
                  {mode === "signin" && "Bon retour 👋"}
                  {mode === "signup" && "Créer un compte"}
                  {mode === "forgot" && "Mot de passe oublié"}
                </h1>
                <p className="text-sm text-muted-foreground mt-1">
                  {mode === "signin" && "Connectez-vous à votre tableau de bord."}
                  {mode === "signup" && "Rejoignez SmartCom PME en quelques secondes."}
                  {mode === "forgot" && "Nous vous enverrons un lien de réinitialisation."}
                </p>

                {mode !== "forgot" && (
                  <>
                    <button
                      type="button"
                      onClick={handleGoogle}
                      disabled={submitting}
                      className="mt-6 w-full h-11 rounded-lg border border-border bg-background hover:bg-muted transition flex items-center justify-center gap-2 text-sm font-medium disabled:opacity-50"
                    >
                      <svg className="h-4 w-4" viewBox="0 0 48 48"><path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.4 29.3 35.5 24 35.5c-6.3 0-11.5-5.2-11.5-11.5S17.7 12.5 24 12.5c2.9 0 5.6 1.1 7.6 2.9l5.7-5.7C33.6 6.4 29.1 4.5 24 4.5 13.2 4.5 4.5 13.2 4.5 24S13.2 43.5 24 43.5 43.5 34.8 43.5 24c0-1.2-.1-2.3-.4-3.5z"/><path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 16 19 12.5 24 12.5c2.9 0 5.6 1.1 7.6 2.9l5.7-5.7C33.6 6.4 29.1 4.5 24 4.5 16.3 4.5 9.7 8.9 6.3 14.7z"/><path fill="#4CAF50" d="M24 43.5c5 0 9.5-1.9 12.9-5l-6-5c-1.9 1.4-4.3 2.2-6.9 2.2-5.3 0-9.7-3.1-11.3-7.5l-6.5 5C9.5 39.1 16.2 43.5 24 43.5z"/><path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.3-2.4 4.3-4.4 5.5l6 5c-.4.4 6.6-4.8 6.6-14.5 0-1.2-.1-2.3-.4-3.5z"/></svg>
                      Continuer avec Google
                    </button>
                    <div className="my-5 flex items-center gap-3 text-xs text-muted-foreground">
                      <div className="h-px flex-1 bg-border" />ou avec votre email<div className="h-px flex-1 bg-border" />
                    </div>
                  </>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  {mode === "signup" && (
                    <>
                      <Field name="full_name" label="Nom complet" placeholder="Jean Mbarga" required />
                      <Field name="company_name" label="Entreprise (optionnel)" placeholder="Ma PME SARL" />
                    </>
                  )}
                  <Field name="email" type="email" label="Email" placeholder="vous@exemple.cm" icon={<Mail className="h-4 w-4" />} required />
                  {mode !== "forgot" && (
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label htmlFor="password" className="text-sm font-medium">Mot de passe</label>
                        {mode === "signin" && (
                          <button type="button" onClick={() => setMode("forgot")} className="text-xs text-primary hover:underline">
                            Oublié ?
                          </button>
                        )}
                      </div>
                      <div className="relative">
                        <input
                          id="password"
                          name="password"
                          type={showPwd ? "text" : "password"}
                          required
                          minLength={6}
                          placeholder="••••••••"
                          className="w-full h-11 rounded-lg border border-border bg-background px-3 pr-10 text-sm outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition"
                        />
                        <button type="button" onClick={() => setShowPwd((v) => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                          {showPwd ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full h-11 rounded-lg bg-gradient-to-r from-primary to-accent text-primary-foreground font-semibold shadow-lg hover:opacity-95 transition flex items-center justify-center gap-2 disabled:opacity-60"
                  >
                    {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
                    {mode === "signin" && "Se connecter"}
                    {mode === "signup" && "Créer mon compte"}
                    {mode === "forgot" && "Envoyer le lien"}
                  </button>
                </form>

                {mode !== "forgot" && (
                  <p className="mt-6 text-center text-sm text-muted-foreground">
                    {mode === "signin" ? "Pas encore de compte ?" : "Déjà inscrit ?"}{" "}
                    <button type="button" onClick={() => setMode(mode === "signin" ? "signup" : "signin")} className="font-semibold text-primary hover:underline">
                      {mode === "signin" ? "Créer un compte" : "Se connecter"}
                    </button>
                  </p>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </main>
  );
}

function Field({ name, label, type = "text", placeholder, required, icon }: { name: string; label: string; type?: string; placeholder?: string; required?: boolean; icon?: React.ReactNode }) {
  return (
    <label className="block">
      <span className="block text-sm font-medium mb-1.5">{label}</span>
      <div className="relative">
        {icon && <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">{icon}</span>}
        <input
          name={name}
          type={type}
          placeholder={placeholder}
          required={required}
          className={`w-full h-11 rounded-lg border border-border bg-background ${icon ? "pl-9" : "pl-3"} pr-3 text-sm outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition`}
        />
      </div>
    </label>
  );
}
