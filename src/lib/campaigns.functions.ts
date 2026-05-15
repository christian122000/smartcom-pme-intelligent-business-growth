import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const SendInput = z.object({
  campaignId: z.string().uuid(),
});

export const sendCampaign = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d) => SendInput.parse(d))
  .handler(async ({ data, context }) => {
    const { supabase } = context;

    const { data: campaign, error: cErr } = await supabase
      .from("campaigns")
      .select("*")
      .eq("id", data.campaignId)
      .single();
    if (cErr || !campaign) throw new Error("Campagne introuvable");

    const { data: recipients, error: rErr } = await supabase
      .from("campaign_recipients")
      .select("*")
      .eq("campaign_id", data.campaignId)
      .eq("status", "pending");
    if (rErr) throw new Error(rErr.message);
    if (!recipients?.length) throw new Error("Aucun destinataire en attente");

    const apiKey = process.env.RESEND_API_KEY;
    const fromAddr = process.env.RESEND_FROM || "SmartCom PME <onboarding@resend.dev>";

    let sent = 0;
    let failed = 0;

    for (const r of recipients) {
      let status = "sent";
      let error: string | null = null;

      if (apiKey) {
        try {
          const res = await fetch("https://api.resend.com/emails", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${apiKey}`,
            },
            body: JSON.stringify({
              from: fromAddr,
              to: [r.email],
              subject: campaign.subject || campaign.name,
              html: `<div style="font-family:Arial,sans-serif;max-width:560px;margin:auto;padding:24px;background:#fff;color:#111">
                <h2 style="color:#4f46e5;margin:0 0 12px">${campaign.name}</h2>
                <div style="white-space:pre-wrap;font-size:15px;line-height:1.5">${(campaign.message || "").replace(/</g, "&lt;")}</div>
                <hr style="margin:24px 0;border:none;border-top:1px solid #eee" />
                <p style="font-size:12px;color:#888">Envoyé via SmartCom PME</p>
              </div>`,
            }),
          });
          if (!res.ok) {
            status = "failed";
            error = (await res.text()).slice(0, 300);
            failed++;
          } else sent++;
        } catch (e: any) {
          status = "failed";
          error = String(e?.message ?? e).slice(0, 300);
          failed++;
        }
      } else {
        // Mode démo: simulate
        sent++;
      }

      await supabase
        .from("campaign_recipients")
        .update({ status, error, sent_at: new Date().toISOString() })
        .eq("id", r.id);
    }

    await supabase
      .from("campaigns")
      .update({
        status: failed > 0 ? "partiel" : "envoyée",
        sent_count: (campaign.sent_count ?? 0) + sent,
        sent_at: new Date().toISOString(),
      })
      .eq("id", campaign.id);

    return { sent, failed, simulated: !apiKey };
  });
