import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Plus, Search, Mail, Phone } from "lucide-react";
import { motion } from "framer-motion";

export const Route = createFileRoute("/dashboard/clients")({ component: Clients });

const seed = [
  { name: "Aïcha Nfor", email: "aicha@example.cm", phone: "+237 6 99 11 22 33", tag: "VIP" },
  { name: "Paul Tchatchoua", email: "paul@example.cm", phone: "+237 6 77 44 55 66", tag: "Régulier" },
  { name: "Marie Eteki", email: "marie@example.cm", phone: "+237 6 55 66 77 88", tag: "Nouveau" },
  { name: "David Kemdeu", email: "david@example.cm", phone: "+237 6 70 12 34 56", tag: "VIP" },
];

function Clients() {
  const [list, setList] = useState(seed);
  const [open, setOpen] = useState(false);

  function add(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    setList([{ name: String(fd.get("name")), email: String(fd.get("email")), phone: String(fd.get("phone")), tag: "Nouveau" }, ...list]);
    setOpen(false);
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div><h2 className="text-lg font-semibold">Mes clients</h2><p className="text-sm text-muted-foreground">Gérez votre base de contacts.</p></div>
        <button onClick={() => setOpen(true)} className="h-10 px-4 rounded-lg bg-gradient-to-r from-primary to-accent text-primary-foreground font-medium text-sm inline-flex items-center gap-2 shadow"><Plus className="h-4 w-4" /> Nouveau client</button>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input placeholder="Rechercher..." className="w-full h-10 rounded-lg border border-border bg-card pl-9 pr-3 text-sm focus:ring-2 focus:ring-primary/50" />
      </div>

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {list.map((c, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }} className="rounded-xl border border-border bg-card p-4 hover:shadow-md transition">
            <div className="flex items-center gap-3">
              <span className="h-10 w-10 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 text-primary inline-flex items-center justify-center font-semibold">{c.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}</span>
              <div className="flex-1 min-w-0">
                <div className="font-medium truncate">{c.name}</div>
                <div className="text-xs text-muted-foreground">{c.tag}</div>
              </div>
              <span className={`text-[11px] px-2 py-1 rounded-full font-medium ${c.tag === "VIP" ? "bg-amber-500/10 text-amber-600" : c.tag === "Nouveau" ? "bg-emerald-500/10 text-emerald-600" : "bg-primary/10 text-primary"}`}>{c.tag}</span>
            </div>
            <div className="mt-3 space-y-1 text-xs text-muted-foreground">
              <div className="flex items-center gap-2"><Mail className="h-3.5 w-3.5" />{c.email}</div>
              <div className="flex items-center gap-2"><Phone className="h-3.5 w-3.5" />{c.phone}</div>
            </div>
          </motion.div>
        ))}
      </div>

      {open && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4" onClick={() => setOpen(false)}>
          <form onSubmit={add} onClick={(e) => e.stopPropagation()} className="w-full max-w-md rounded-2xl bg-card border border-border p-6 shadow-2xl">
            <h3 className="font-semibold text-lg mb-4">Nouveau client</h3>
            <div className="space-y-3">
              <input name="name" required placeholder="Nom complet" className="w-full h-11 rounded-lg border border-border bg-background px-3 text-sm" />
              <input name="email" type="email" required placeholder="Email" className="w-full h-11 rounded-lg border border-border bg-background px-3 text-sm" />
              <input name="phone" required placeholder="Téléphone" className="w-full h-11 rounded-lg border border-border bg-background px-3 text-sm" />
            </div>
            <div className="mt-6 flex justify-end gap-2">
              <button type="button" onClick={() => setOpen(false)} className="h-10 px-4 rounded-lg border border-border text-sm">Annuler</button>
              <button className="h-10 px-4 rounded-lg bg-primary text-primary-foreground text-sm font-medium">Ajouter</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
