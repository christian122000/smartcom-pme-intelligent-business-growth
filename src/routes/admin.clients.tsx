import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Users, Loader2, Mail, Phone } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/clients")({ component: AdminClients });

type Row = {
  id: string; name: string; email: string | null; phone: string | null; company: string | null;
  tag: string; created_at: string; user_id: string;
  owner?: { company_name: string | null; full_name: string | null } | null;
};

function AdminClients() {
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data, error } = await supabase.from("clients").select("*").order("created_at", { ascending: false });
      if (error) { toast.error(error.message); setLoading(false); return; }
      const list = (data as Row[]) ?? [];
      const userIds = [...new Set(list.map((c) => c.user_id))];
      const { data: profs } = userIds.length
        ? await supabase.from("profiles").select("id,company_name,full_name").in("id", userIds)
        : { data: [] as any[] };
      const map = new Map((profs ?? []).map((p: any) => [p.id, p]));
      setRows(list.map((c) => ({ ...c, owner: map.get(c.user_id) ?? null })));
      setLoading(false);
    })();
  }, []);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Users className="h-5 w-5 text-primary" />
        <h2 className="text-lg font-semibold">Clients ajoutés ({rows.length})</h2>
      </div>
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 text-muted-foreground">
              <tr>
                <th className="text-left px-4 py-3 font-medium">Client</th>
                <th className="text-left px-4 py-3 font-medium">Contact</th>
                <th className="text-left px-4 py-3 font-medium">Tag</th>
                <th className="text-left px-4 py-3 font-medium">Ajouté par (PME)</th>
                <th className="text-left px-4 py-3 font-medium">Date</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={5} className="py-8 text-center"><Loader2 className="h-5 w-5 animate-spin inline text-primary" /></td></tr>
              ) : rows.length === 0 ? (
                <tr><td colSpan={5} className="py-8 text-center text-muted-foreground">Aucun client.</td></tr>
              ) : rows.map((r) => (
                <tr key={r.id} className="border-t border-border hover:bg-muted/30">
                  <td className="px-4 py-3 font-medium">{r.name}{r.company ? <span className="text-xs text-muted-foreground"> · {r.company}</span> : null}</td>
                  <td className="px-4 py-3 text-muted-foreground text-xs">
                    {r.email && <div className="flex items-center gap-1"><Mail className="h-3 w-3" />{r.email}</div>}
                    {r.phone && <div className="flex items-center gap-1"><Phone className="h-3 w-3" />{r.phone}</div>}
                  </td>
                  <td className="px-4 py-3"><span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary font-medium">{r.tag}</span></td>
                  <td className="px-4 py-3 text-muted-foreground">{r.owner?.company_name ?? r.owner?.full_name ?? "—"}</td>
                  <td className="px-4 py-3 text-muted-foreground">{new Date(r.created_at).toLocaleDateString("fr-FR")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
