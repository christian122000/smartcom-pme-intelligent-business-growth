import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";

export const Route = createFileRoute("/dashboard/settings")({ component: Settings });

function Settings() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ full_name: "", company_name: "", phone: "" });

  useEffect(() => {
    if (!user) return;
    (async () => {
      const { data } = await supabase.from("profiles").select("*").eq("id", user.id).maybeSingle();
      if (data) setForm({ full_name: data.full_name ?? "", company_name: data.company_name ?? "", phone: data.phone ?? "" });
      setLoading(false);
    })();
  }, [user]);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;
    setSaving(true);
    const { error } = await supabase.from("profiles").update(form).eq("id", user.id);
    setSaving(false);
    if (error) toast.error(error.message); else toast.success("Profil mis à jour ✨");
  }

  if (loading) return <div className="flex items-center justify-center py-12"><Loader2 className="h-5 w-5 animate-spin text-primary" /></div>;

  return (
    <div className="max-w-xl space-y-4">
      <h2 className="text-lg font-semibold">Paramètres du profil</h2>
      <form onSubmit={save} className="rounded-xl border border-border bg-card p-6 space-y-4">
        <Field label="Email" value={user?.email ?? ""} disabled />
        <Field label="Nom complet" value={form.full_name} onChange={(v) => setForm({ ...form, full_name: v })} />
        <Field label="Entreprise" value={form.company_name} onChange={(v) => setForm({ ...form, company_name: v })} />
        <Field label="Téléphone" value={form.phone} onChange={(v) => setForm({ ...form, phone: v })} />
        <button disabled={saving} className="h-11 px-5 rounded-lg bg-gradient-to-r from-primary to-accent text-primary-foreground font-medium inline-flex items-center gap-2 disabled:opacity-60">
          {saving && <Loader2 className="h-4 w-4 animate-spin" />} Enregistrer
        </button>
      </form>
    </div>
  );
}

function Field({ label, value, onChange, disabled }: { label: string; value: string; onChange?: (v: string) => void; disabled?: boolean }) {
  return (
    <label className="block">
      <span className="block text-sm font-medium mb-1.5">{label}</span>
      <input value={value} onChange={(e) => onChange?.(e.target.value)} disabled={disabled} className="w-full h-11 rounded-lg border border-border bg-background px-3 text-sm focus:ring-2 focus:ring-primary/50 disabled:opacity-60" />
    </label>
  );
}
