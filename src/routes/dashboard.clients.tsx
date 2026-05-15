import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Plus, Search, Mail, Phone, Trash2, Loader2, Building2 } from "lucide-react";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const Route = createFileRoute("/dashboard/clients")({ component: Clients });

type Client = {
  id: string; name: string; email: string | null; phone: string | null;
  company: string | null; tag: string; created_at: string;
};

function Clients() {
  const [list, setList] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const [saving, setSaving] = useState(false);

  async function load() {
    setLoading(true);
    const { data, error } = await supabase.from("clients").select("*").order("created_at", { ascending: false });
    if (error) toast.error(error.message);
    setList((data as Client[]) ?? []);
    setLoading(false);
  }
  useEffect(() => { load(); }, []);

  async function add(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    const fd = new FormData(e.currentTarget);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { toast.error("Non connecté"); setSaving(false); return; }
    const payload = {
      user_id: user.id,
      name: String(fd.get("name") || "").trim(),
      email: String(fd.get("email") || "").trim() || null,
      phone: String(fd.get("phone") || "").trim() || null,
      company: String(fd.get("company") || "").trim() || null,
      tag: String(fd.get("tag") || "Nouveau"),
    };
    const { error } = await supabase.from("clients").insert(payload);
    setSaving(false);
    if (error) return toast.error(error.message);
    toast.success("Client ajouté");
    setOpen(false);
    load();
  }

  async function remove(id: string) {
    if (!confirm("Supprimer ce client ?")) return;
    const { error } = await supabase.from("clients").delete().eq("id", id);
    if (error) return toast.error(error.message);
    setList((l) => l.filter((c) => c.id !== id));
  }

  const filtered = useMemo(
    () => list.filter((c) => [c.name, c.email, c.phone, c.company].join(" ").toLowerCase().includes(q.toLowerCase())),
    [list, q]
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h2 className="text-lg font-semibold">Mes clients</h2>
          <p className="text-sm text-muted-foreground">Gérez votre base de contacts ({list.length}).</p>
        </div>
        <button onClick={() => setOpen(true)} className="h-10 px-4 rounded-lg bg-gradient-to-r from-primary to-accent text-primary-foreground font-medium text-sm inline-flex items-center gap-2 shadow">
          <Plus className="h-4 w-4" /> Nouveau client
        </button>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Rechercher..." className="w-full h-10 rounded-lg border border-border bg-card pl-9 pr-3 text-sm focus:ring-2 focus:ring-primary/50" />
      </div>

      {loading ? (
        <div className="py-12 text-center"><Loader2 className="h-6 w-6 animate-spin inline text-primary" /></div>
      ) : filtered.length === 0 ? (
        <div className="py-16 text-center text-muted-foreground border border-dashed border-border rounded-xl">
          Aucun client. Cliquez sur « Nouveau client » pour commencer.
        </div>
      ) : (
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((c, i) => (
            <motion.div key={c.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }} className="rounded-xl border border-border bg-card p-4 hover:shadow-md transition group">
              <div className="flex items-center gap-3">
                <span className="h-10 w-10 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 text-primary inline-flex items-center justify-center font-semibold">
                  {c.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="font-medium truncate">{c.name}</div>
                  <div className="text-xs text-muted-foreground">{c.tag}</div>
                </div>
                <button onClick={() => remove(c.id)} className="opacity-0 group-hover:opacity-100 transition h-8 w-8 inline-flex items-center justify-center rounded-md hover:bg-destructive/10 text-destructive">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
              <div className="mt-3 space-y-1 text-xs text-muted-foreground">
                {c.email && <div className="flex items-center gap-2 truncate"><Mail className="h-3.5 w-3.5 shrink-0" />{c.email}</div>}
                {c.phone && <div className="flex items-center gap-2"><Phone className="h-3.5 w-3.5" />{c.phone}</div>}
                {c.company && <div className="flex items-center gap-2"><Building2 className="h-3.5 w-3.5" />{c.company}</div>}
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {open && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4" onClick={() => setOpen(false)}>
          <form onSubmit={add} onClick={(e) => e.stopPropagation()} className="w-full max-w-md rounded-2xl bg-card border border-border p-6 shadow-2xl">
            <h3 className="font-semibold text-lg mb-4">Nouveau client</h3>
            <div className="space-y-3">
              <input name="name" required placeholder="Nom complet" className="w-full h-11 rounded-lg border border-border bg-background px-3 text-sm" />
              <input name="email" type="email" placeholder="Email" className="w-full h-11 rounded-lg border border-border bg-background px-3 text-sm" />
              <input name="phone" placeholder="Téléphone" className="w-full h-11 rounded-lg border border-border bg-background px-3 text-sm" />
              <input name="company" placeholder="Entreprise (optionnel)" className="w-full h-11 rounded-lg border border-border bg-background px-3 text-sm" />
              <select name="tag" className="w-full h-11 rounded-lg border border-border bg-background px-3 text-sm">
                <option>Nouveau</option><option>Régulier</option><option>VIP</option>
              </select>
            </div>
            <div className="mt-6 flex justify-end gap-2">
              <button type="button" onClick={() => setOpen(false)} className="h-10 px-4 rounded-lg border border-border text-sm">Annuler</button>
              <button disabled={saving} className="h-10 px-4 rounded-lg bg-primary text-primary-foreground text-sm font-medium disabled:opacity-50">
                {saving ? "Ajout..." : "Ajouter"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
