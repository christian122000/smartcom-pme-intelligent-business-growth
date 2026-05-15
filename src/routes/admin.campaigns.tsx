import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Megaphone, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/campaigns")({ component: AdminCampaigns });

type Row = {
  id: string; name: string; channel: string; status: string; sent_count: number;
  created_at: string; user_id: string;
  profiles?: { company_name: string | null; full_name: string | null } | null;
  recipients_count?: number;
};

function AdminCampaigns() {
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data: campaigns, error } = await supabase
        .from("campaigns").select("*").order("created_at", { ascending: false });
      if (error) { toast.error(error.message); setLoading(false); return; }
      const list = (campaigns as Row[]) ?? [];

      const userIds = [...new Set(list.map((c) => c.user_id))];
      const ids = list.map((c) => c.id);

      const [{ data: profs }, { data: recs }] = await Promise.all([
        userIds.length ? supabase.from("profiles").select("id,company_name,full_name").in("id", userIds) : Promise.resolve({ data: [] as any[] }),
        ids.length ? supabase.from("campaign_recipients").select("campaign_id").in("campaign_id", ids) : Promise.resolve({ data: [] as any[] }),
      ]);

      const profMap = new Map((profs ?? []).map((p: any) => [p.id, p]));
      const countMap = new Map<string, number>();
      (recs ?? []).forEach((r: any) => countMap.set(r.campaign_id, (countMap.get(r.campaign_id) ?? 0) + 1));

      setRows(list.map((c) => ({
        ...c,
        profiles: profMap.get(c.user_id) ?? null,
        recipients_count: countMap.get(c.id) ?? 0,
      })));
      setLoading(false);
    })();
  }, []);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Megaphone className="h-5 w-5 text-primary" />
        <h2 className="text-lg font-semibold">Campagnes marketing ({rows.length})</h2>
      </div>
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 text-muted-foreground">
              <tr>
                <th className="text-left px-4 py-3 font-medium">Campagne</th>
                <th className="text-left px-4 py-3 font-medium">PME</th>
                <th className="text-left px-4 py-3 font-medium">Canal</th>
                <th className="text-left px-4 py-3 font-medium">Destinataires</th>
                <th className="text-left px-4 py-3 font-medium">Envoyés</th>
                <th className="text-left px-4 py-3 font-medium">Statut</th>
                <th className="text-left px-4 py-3 font-medium">Date</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={7} className="py-8 text-center"><Loader2 className="h-5 w-5 animate-spin inline text-primary" /></td></tr>
              ) : rows.length === 0 ? (
                <tr><td colSpan={7} className="py-8 text-center text-muted-foreground">Aucune campagne.</td></tr>
              ) : rows.map((d) => (
                <tr key={d.id} className="border-t border-border hover:bg-muted/30">
                  <td className="px-4 py-3 font-medium">{d.name}</td>
                  <td className="px-4 py-3 text-muted-foreground">{d.profiles?.company_name ?? d.profiles?.full_name ?? "—"}</td>
                  <td className="px-4 py-3"><span className="px-2 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium capitalize">{d.channel}</span></td>
                  <td className="px-4 py-3">{d.recipients_count}</td>
                  <td className="px-4 py-3 text-emerald-600 font-medium">{d.sent_count}</td>
                  <td className="px-4 py-3"><span className={`text-xs px-2 py-1 rounded-full font-medium ${d.status === "envoyée" ? "bg-emerald-500/10 text-emerald-600" : d.status === "partiel" ? "bg-amber-500/10 text-amber-600" : "bg-muted text-muted-foreground"}`}>{d.status}</span></td>
                  <td className="px-4 py-3 text-muted-foreground">{new Date(d.created_at).toLocaleDateString("fr-FR")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
