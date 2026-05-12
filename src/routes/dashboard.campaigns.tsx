import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Plus, Megaphone, Mail, MessageSquare, Smartphone } from "lucide-react";
import { motion } from "framer-motion";

export const Route = createFileRoute("/dashboard/campaigns")({ component: Campaigns });

const seed = [
  { name: "Promo Vendredi", channel: "WhatsApp", icon: MessageSquare, status: "Active", reach: 1240, ctr: "11.2%" },
  { name: "Newsletter Octobre", channel: "Email", icon: Mail, status: "Programmée", reach: 0, ctr: "—" },
  { name: "Rappel rendez-vous", channel: "SMS", icon: Smartphone, status: "Terminée", reach: 320, ctr: "18.4%" },
];

function Campaigns() {
  const [open, setOpen] = useState(false);
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div><h2 className="text-lg font-semibold">Campagnes marketing</h2><p className="text-sm text-muted-foreground">Créez et suivez vos campagnes multi-canal.</p></div>
        <button onClick={() => setOpen(true)} className="h-10 px-4 rounded-lg bg-gradient-to-r from-primary to-accent text-primary-foreground font-medium text-sm inline-flex items-center gap-2 shadow"><Plus className="h-4 w-4" /> Nouvelle campagne</button>
      </div>

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {seed.map((c, i) => (
          <motion.div key={c.name} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} whileHover={{ y: -2 }} className="rounded-xl border border-border bg-card p-5 hover:shadow-lg transition">
            <div className="flex items-start justify-between">
              <span className="h-10 w-10 rounded-lg bg-primary/10 text-primary inline-flex items-center justify-center"><c.icon className="h-5 w-5" /></span>
              <span className={`text-[11px] px-2 py-1 rounded-full font-medium ${c.status === "Active" ? "bg-emerald-500/10 text-emerald-600" : c.status === "Programmée" ? "bg-amber-500/10 text-amber-600" : "bg-muted text-muted-foreground"}`}>{c.status}</span>
            </div>
            <div className="mt-3 font-semibold">{c.name}</div>
            <div className="text-xs text-muted-foreground">{c.channel}</div>
            <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
              <div><div className="text-xs text-muted-foreground">Audience</div><div className="font-semibold">{c.reach.toLocaleString("fr-FR")}</div></div>
              <div><div className="text-xs text-muted-foreground">CTR</div><div className="font-semibold text-emerald-600">{c.ctr}</div></div>
            </div>
          </motion.div>
        ))}
      </div>

      {open && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4" onClick={() => setOpen(false)}>
          <div onClick={(e) => e.stopPropagation()} className="w-full max-w-lg rounded-2xl bg-card border border-border p-6 shadow-2xl">
            <div className="flex items-center gap-2 mb-4"><Megaphone className="h-5 w-5 text-primary" /><h3 className="font-semibold text-lg">Nouvelle campagne</h3></div>
            <div className="space-y-3">
              <input placeholder="Nom de la campagne" className="w-full h-11 rounded-lg border border-border bg-background px-3 text-sm" />
              <select className="w-full h-11 rounded-lg border border-border bg-background px-3 text-sm">
                <option>WhatsApp</option><option>Email</option><option>SMS</option>
              </select>
              <textarea rows={4} placeholder="Message..." className="w-full rounded-lg border border-border bg-background p-3 text-sm" />
            </div>
            <div className="mt-6 flex justify-end gap-2">
              <button onClick={() => setOpen(false)} className="h-10 px-4 rounded-lg border border-border text-sm">Annuler</button>
              <button onClick={() => setOpen(false)} className="h-10 px-4 rounded-lg bg-gradient-to-r from-primary to-accent text-primary-foreground text-sm font-medium">Créer</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
