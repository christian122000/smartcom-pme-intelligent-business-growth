import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Search, Trash2, Pencil, Loader2, ShieldCheck } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/users")({
  component: AdminUsers,
});

type Row = { id: string; full_name: string | null; company_name: string | null; phone: string | null; created_at: string };

function AdminUsers() {
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");

  useEffect(() => {
    (async () => {
      const { data, error } = await supabase.from("profiles").select("*").order("created_at", { ascending: false });
      if (error) toast.error(error.message);
      setRows((data as Row[]) ?? []);
      setLoading(false);
    })();
  }, []);

  const filtered = useMemo(
    () => rows.filter((r) => [r.full_name, r.company_name, r.phone].join(" ").toLowerCase().includes(q.toLowerCase())),
    [rows, q]
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3 sm:items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">Gestion des utilisateurs</h2>
          <p className="text-sm text-muted-foreground">Consultez et gérez les comptes inscrits.</p>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Rechercher..." className="w-full sm:w-72 h-10 rounded-lg border border-border bg-card pl-9 pr-3 text-sm focus:ring-2 focus:ring-primary/50" />
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 text-muted-foreground">
              <tr>
                <th className="text-left px-4 py-3 font-medium">Nom</th>
                <th className="text-left px-4 py-3 font-medium">Entreprise</th>
                <th className="text-left px-4 py-3 font-medium">Téléphone</th>
                <th className="text-left px-4 py-3 font-medium">Inscrit</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={5} className="py-8 text-center"><Loader2 className="h-5 w-5 animate-spin inline text-primary" /></td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={5} className="py-8 text-center text-muted-foreground">Aucun utilisateur trouvé.</td></tr>
              ) : filtered.map((r) => (
                <tr key={r.id} className="border-t border-border hover:bg-muted/30 transition">
                  <td className="px-4 py-3 font-medium flex items-center gap-2">
                    <span className="h-7 w-7 rounded-full bg-primary/10 text-primary text-xs inline-flex items-center justify-center font-semibold">
                      {(r.full_name ?? "?").slice(0, 2).toUpperCase()}
                    </span>
                    {r.full_name ?? "—"}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{r.company_name ?? "—"}</td>
                  <td className="px-4 py-3 text-muted-foreground">{r.phone ?? "—"}</td>
                  <td className="px-4 py-3 text-muted-foreground">{new Date(r.created_at).toLocaleDateString("fr-FR")}</td>
                  <td className="px-4 py-3 text-right">
                    <div className="inline-flex items-center gap-1">
                      <button className="h-8 w-8 inline-flex items-center justify-center rounded-md hover:bg-muted" title="Promouvoir admin"><ShieldCheck className="h-4 w-4 text-primary" /></button>
                      <button className="h-8 w-8 inline-flex items-center justify-center rounded-md hover:bg-muted"><Pencil className="h-4 w-4" /></button>
                      <button className="h-8 w-8 inline-flex items-center justify-center rounded-md hover:bg-destructive/10 text-destructive"><Trash2 className="h-4 w-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
