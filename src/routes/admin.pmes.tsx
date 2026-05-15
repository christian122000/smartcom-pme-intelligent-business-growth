import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Building2, Phone, Loader2, User } from "lucide-react";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/pmes")({ component: PMEs });

type Profile = { id: string; full_name: string | null; company_name: string | null; phone: string | null; created_at: string };

function PMEs() {
  const [list, setList] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .not("company_name", "is", null)
        .order("created_at", { ascending: false });
      if (error) toast.error(error.message);
      setList((data as Profile[]) ?? []);
      setLoading(false);
    })();
  }, []);

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold">PME enregistrées</h2>
        <p className="text-sm text-muted-foreground">Annuaire des entreprises ajoutées par les utilisateurs ({list.length}).</p>
      </div>

      {loading ? (
        <div className="py-12 text-center"><Loader2 className="h-6 w-6 animate-spin inline text-primary" /></div>
      ) : list.length === 0 ? (
        <div className="py-16 text-center text-muted-foreground border border-dashed border-border rounded-xl">
          Aucune PME pour l'instant.
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {list.map((p, i) => (
            <motion.div key={p.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} whileHover={{ y: -2 }} className="rounded-xl border border-border bg-card p-5 shadow-sm hover:shadow-lg transition">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <span className="h-10 w-10 rounded-lg bg-gradient-to-br from-primary/20 to-accent/20 text-primary inline-flex items-center justify-center"><Building2 className="h-5 w-5" /></span>
                  <div>
                    <div className="font-semibold">{p.company_name ?? "Sans nom"}</div>
                    <div className="text-xs text-muted-foreground">Inscrite le {new Date(p.created_at).toLocaleDateString("fr-FR")}</div>
                  </div>
                </div>
                <span className="text-[11px] px-2 py-1 rounded-full font-medium bg-emerald-500/10 text-emerald-600">Active</span>
              </div>
              <div className="mt-4 space-y-2 text-sm text-muted-foreground">
                <div className="flex items-center gap-2"><User className="h-4 w-4" />{p.full_name ?? "—"}</div>
                <div className="flex items-center gap-2"><Phone className="h-4 w-4" />{p.phone ?? "—"}</div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
