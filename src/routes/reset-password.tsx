import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Loader2, KeyRound } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/reset-password")({
  head: () => ({ meta: [{ title: "Réinitialiser le mot de passe | SmartCom PME" }] }),
  component: ResetPage,
});

function ResetPage() {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const password = String(fd.get("password") ?? "");
    if (password.length < 6) return toast.error("Au moins 6 caractères");
    setSubmitting(true);
    const { error } = await supabase.auth.updateUser({ password });
    setSubmitting(false);
    if (error) return toast.error(error.message);
    toast.success("Mot de passe mis à jour !");
    navigate({ to: "/auth" });
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-background px-4">
      <form onSubmit={onSubmit} className="w-full max-w-md rounded-2xl border border-border bg-card p-8 shadow-xl">
        <div className="flex items-center gap-3 mb-6">
          <span className="h-10 w-10 rounded-xl bg-primary/10 text-primary inline-flex items-center justify-center"><KeyRound className="h-5 w-5" /></span>
          <div>
            <h1 className="text-xl font-bold">Nouveau mot de passe</h1>
            <p className="text-sm text-muted-foreground">Choisissez un mot de passe sécurisé.</p>
          </div>
        </div>
        <label className="block">
          <span className="block text-sm font-medium mb-1.5">Mot de passe</span>
          <input name="password" type="password" required minLength={6} className="w-full h-11 rounded-lg border border-border bg-background px-3 text-sm focus:ring-2 focus:ring-primary/50" />
        </label>
        <button disabled={submitting} className="mt-6 w-full h-11 rounded-lg bg-gradient-to-r from-primary to-accent text-primary-foreground font-semibold flex items-center justify-center gap-2 disabled:opacity-60">
          {submitting && <Loader2 className="h-4 w-4 animate-spin" />} Enregistrer
        </button>
      </form>
    </main>
  );
}
