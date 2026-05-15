import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Plus, Megaphone, Mail, MessageSquare, Smartphone, Send, Loader2, Trash2, Users } from "lucide-react";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { sendCampaign } from "@/lib/campaigns.functions";

export const Route = createFileRoute("/dashboard/campaigns")({ component: Campaigns });

type Client = { id: string; name: string; email: string | null };
type Campaign = {
  id: string; name: string; channel: string; subject: string | null; message: string;
  status: string; sent_count: number; created_at: string; sent_at: string | null;
};

const channelIcon = (c: string) => c === "email" ? Mail : c === "sms" ? Smartphone : MessageSquare;

function Campaigns() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [sendingId, setSendingId] = useState<string | null>(null);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [form, setForm] = useState({ name: "", channel: "email", subject: "", message: "" });

  const sendFn = useServerFn(sendCampaign);

  async function load() {
    setLoading(true);
    const [c, k] = await Promise.all([
      supabase.from("campaigns").select("*").order("created_at", { ascending: false }),
      supabase.from("clients").select("id,name,email").order("name"),
    ]);
    if (c.error) toast.error(c.error.message);
    if (k.error) toast.error(k.error.message);
    setCampaigns((c.data as Campaign[]) ?? []);
    setClients((k.data as Client[]) ?? []);
    setLoading(false);
  }
  useEffect(() => { load(); }, []);

  function toggleAll() {
    const eligible = clients.filter((c) => c.email);
    if (selected.size === eligible.length) setSelected(new Set());
    else setSelected(new Set(eligible.map((c) => c.id)));
  }

  async function create(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { toast.error("Non connecté"); setSaving(false); return; }
    if (form.channel === "email" && selected.size === 0) {
      toast.error("Sélectionnez au moins un client avec email");
      setSaving(false); return;
    }

    const { data: campaign, error } = await supabase.from("campaigns").insert({
      user_id: user.id, name: form.name, channel: form.channel,
      subject: form.subject || null, message: form.message, status: "brouillon",
    }).select().single();

    if (error || !campaign) { setSaving(false); return toast.error(error?.message ?? "Erreur"); }

    const recipients = clients
      .filter((c) => selected.has(c.id) && c.email)
      .map((c) => ({ campaign_id: campaign.id, client_id: c.id, email: c.email!, status: "pending" }));

    if (recipients.length) {
      const { error: rErr } = await supabase.from("campaign_recipients").insert(recipients);
      if (rErr) toast.error(rErr.message);
    }

    toast.success("Campagne créée");
    setOpen(false);
    setForm({ name: "", channel: "email", subject: "", message: "" });
    setSelected(new Set());
    setSaving(false);
    load();
  }

  async function send(id: string) {
    setSendingId(id);
    try {
      const r = await sendFn({ data: { campaignId: id } });
      toast.success(`${r.sent} envoyé(s)${r.failed ? `, ${r.failed} échec(s)` : ""}${r.simulated ? " — mode démo (clé Resend non configurée)" : ""}`);
      load();
    } catch (e: any) {
      toast.error(e?.message ?? "Erreur d'envoi");
    } finally {
      setSendingId(null);
    }
  }

  async function remove(id: string) {
    if (!confirm("Supprimer cette campagne ?")) return;
    const { error } = await supabase.from("campaigns").delete().eq("id", id);
    if (error) return toast.error(error.message);
    setCampaigns((l) => l.filter((c) => c.id !== id));
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h2 className="text-lg font-semibold">Campagnes marketing</h2>
          <p className="text-sm text-muted-foreground">Sélectionnez vos clients et envoyez des campagnes email.</p>
        </div>
        <button onClick={() => setOpen(true)} className="h-10 px-4 rounded-lg bg-gradient-to-r from-primary to-accent text-primary-foreground font-medium text-sm inline-flex items-center gap-2 shadow">
          <Plus className="h-4 w-4" /> Nouvelle campagne
        </button>
      </div>

      {loading ? (
        <div className="py-12 text-center"><Loader2 className="h-6 w-6 animate-spin inline text-primary" /></div>
      ) : campaigns.length === 0 ? (
        <div className="py-16 text-center text-muted-foreground border border-dashed border-border rounded-xl">
          Aucune campagne. Créez votre première campagne pour engager vos clients.
        </div>
      ) : (
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {campaigns.map((c, i) => {
            const Icon = channelIcon(c.channel);
            return (
              <motion.div key={c.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }} whileHover={{ y: -2 }} className="rounded-xl border border-border bg-card p-5 hover:shadow-lg transition group">
                <div className="flex items-start justify-between">
                  <span className="h-10 w-10 rounded-lg bg-primary/10 text-primary inline-flex items-center justify-center"><Icon className="h-5 w-5" /></span>
                  <span className={`text-[11px] px-2 py-1 rounded-full font-medium ${
                    c.status === "envoyée" ? "bg-emerald-500/10 text-emerald-600"
                      : c.status === "partiel" ? "bg-amber-500/10 text-amber-600"
                      : "bg-muted text-muted-foreground"
                  }`}>{c.status}</span>
                </div>
                <div className="mt-3 font-semibold">{c.name}</div>
                <div className="text-xs text-muted-foreground capitalize">{c.channel}{c.subject ? ` · ${c.subject}` : ""}</div>
                <p className="mt-2 text-xs text-muted-foreground line-clamp-2">{c.message}</p>
                <div className="mt-4 flex items-center justify-between text-sm">
                  <div className="text-xs text-muted-foreground">Envoyés: <span className="font-semibold text-foreground">{c.sent_count}</span></div>
                  <div className="flex items-center gap-1">
                    {c.channel === "email" && c.status !== "envoyée" && (
                      <button onClick={() => send(c.id)} disabled={sendingId === c.id} className="h-8 px-3 rounded-md bg-primary text-primary-foreground text-xs font-medium inline-flex items-center gap-1 disabled:opacity-50">
                        {sendingId === c.id ? <Loader2 className="h-3 w-3 animate-spin" /> : <Send className="h-3 w-3" />} Envoyer
                      </button>
                    )}
                    <button onClick={() => remove(c.id)} className="h-8 w-8 inline-flex items-center justify-center rounded-md hover:bg-destructive/10 text-destructive">
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {open && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4" onClick={() => setOpen(false)}>
          <form onSubmit={create} onClick={(e) => e.stopPropagation()} className="w-full max-w-2xl rounded-2xl bg-card border border-border p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center gap-2 mb-4"><Megaphone className="h-5 w-5 text-primary" /><h3 className="font-semibold text-lg">Nouvelle campagne</h3></div>
            <div className="grid gap-3 sm:grid-cols-2">
              <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Nom de la campagne" className="h-11 rounded-lg border border-border bg-background px-3 text-sm sm:col-span-2" />
              <select value={form.channel} onChange={(e) => setForm({ ...form, channel: e.target.value })} className="h-11 rounded-lg border border-border bg-background px-3 text-sm">
                <option value="email">Email</option><option value="sms">SMS</option><option value="whatsapp">WhatsApp</option>
              </select>
              <input value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} placeholder="Sujet (email)" className="h-11 rounded-lg border border-border bg-background px-3 text-sm" />
              <textarea required rows={5} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} placeholder="Message..." className="rounded-lg border border-border bg-background p-3 text-sm sm:col-span-2" />
            </div>

            <div className="mt-5">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2 text-sm font-medium"><Users className="h-4 w-4 text-primary" /> Destinataires ({selected.size})</div>
                <button type="button" onClick={toggleAll} className="text-xs text-primary hover:underline">Tout sélectionner</button>
              </div>
              <div className="max-h-56 overflow-y-auto rounded-lg border border-border divide-y divide-border">
                {clients.length === 0 ? (
                  <div className="p-4 text-sm text-muted-foreground text-center">Ajoutez d'abord des clients.</div>
                ) : clients.map((c) => {
                  const noEmail = !c.email;
                  return (
                    <label key={c.id} className={`flex items-center gap-3 p-2.5 text-sm hover:bg-muted/30 cursor-pointer ${noEmail ? "opacity-50" : ""}`}>
                      <input type="checkbox" disabled={noEmail} checked={selected.has(c.id)} onChange={(e) => {
                        const n = new Set(selected);
                        e.target.checked ? n.add(c.id) : n.delete(c.id);
                        setSelected(n);
                      }} />
                      <span className="flex-1 truncate">{c.name}</span>
                      <span className="text-xs text-muted-foreground truncate">{c.email ?? "Pas d'email"}</span>
                    </label>
                  );
                })}
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-2">
              <button type="button" onClick={() => setOpen(false)} className="h-10 px-4 rounded-lg border border-border text-sm">Annuler</button>
              <button disabled={saving} className="h-10 px-4 rounded-lg bg-gradient-to-r from-primary to-accent text-primary-foreground text-sm font-medium disabled:opacity-50">
                {saving ? "Création..." : "Créer la campagne"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
