import { createFileRoute, Outlet } from "@tanstack/react-router";
import { LayoutDashboard, Users, Megaphone, Bot, BarChart3, Bell, Settings, Sparkles, Share2, Brain } from "lucide-react";
import { DashboardShell } from "@/components/dashboard/DashboardShell";

export const clientNav = [
  { title: "Tableau de bord", url: "/dashboard", icon: LayoutDashboard },
  { title: "Mes clients", url: "/dashboard/clients", icon: Users },
  { title: "Campagnes", url: "/dashboard/campaigns", icon: Megaphone },
  { title: "Analyse IA", url: "/dashboard/ai-insights", icon: Brain },
  { title: "Chatbot IA", url: "/dashboard/chatbot", icon: Bot },
  { title: "Outils IA", url: "/dashboard/ai-tools", icon: Sparkles },
  { title: "Réseaux sociaux", url: "/dashboard/social-campaigns", icon: Share2 },
  { title: "Analyses", url: "/dashboard/analytics", icon: BarChart3 },
  { title: "Notifications", url: "/dashboard/notifications", icon: Bell },
  { title: "Paramètres", url: "/dashboard/settings", icon: Settings },
];

export const Route = createFileRoute("/dashboard")({
  head: () => ({ meta: [{ title: "Mon espace | SmartCom PME" }] }),
  component: () => (
    <DashboardShell requiredRole="client" items={clientNav} label="Mon espace" title="Tableau de bord PME">
      <Outlet />
    </DashboardShell>
  ),
});
