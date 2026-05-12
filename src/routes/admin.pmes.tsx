import { createFileRoute } from "@tanstack/react-router";
import { Building2, MapPin, Phone } from "lucide-react";
import { motion } from "framer-motion";

export const Route = createFileRoute("/admin/pmes")({ component: PMEs });

const mock = [
  { name: "Boulangerie Akwa", city: "Douala", phone: "+237 6 99 00 12 34", sector: "Restauration", status: "Active" },
  { name: "TechCM Solutions", city: "Yaoundé", phone: "+237 6 77 12 34 56", sector: "Tech", status: "Active" },
  { name: "Mode Bafoussam", city: "Bafoussam", phone: "+237 6 55 22 33 44", sector: "Mode", status: "En attente" },
  { name: "AgroBénin Plus", city: "Limbé", phone: "+237 6 91 87 65 43", sector: "Agro", status: "Active" },
  { name: "Coiffure Kribi", city: "Kribi", phone: "+237 6 70 11 22 33", sector: "Beauté", status: "Suspendue" },
];

function PMEs() {
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold">PME enregistrées</h2>
        <p className="text-sm text-muted-foreground">Annuaire des PME utilisant SmartCom PME.</p>
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {mock.map((p, i) => (
          <motion.div key={p.name} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} whileHover={{ y: -2 }} className="rounded-xl border border-border bg-card p-5 shadow-sm hover:shadow-lg transition">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <span className="h-10 w-10 rounded-lg bg-gradient-to-br from-primary/20 to-accent/20 text-primary inline-flex items-center justify-center"><Building2 className="h-5 w-5" /></span>
                <div>
                  <div className="font-semibold">{p.name}</div>
                  <div className="text-xs text-muted-foreground">{p.sector}</div>
                </div>
              </div>
              <span className={`text-[11px] px-2 py-1 rounded-full font-medium ${p.status === "Active" ? "bg-emerald-500/10 text-emerald-600" : p.status === "Suspendue" ? "bg-destructive/10 text-destructive" : "bg-amber-500/10 text-amber-600"}`}>{p.status}</span>
            </div>
            <div className="mt-4 space-y-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-2"><MapPin className="h-4 w-4" />{p.city}</div>
              <div className="flex items-center gap-2"><Phone className="h-4 w-4" />{p.phone}</div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
