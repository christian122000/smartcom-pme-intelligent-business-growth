import { createFileRoute, Outlet } from "@tanstack/react-router";
import { LayoutDashboard, Users, Building2, Megaphone, BarChart3, Bell, Settings } from "lucide-react";
import { DashboardShell } from "@/components/dashboard/DashboardShell";

export const adminNav = [
  { title: "Tableau de bord", url: "/admin", icon: LayoutDashboard },
  { title: "Utilisateurs", url: "/admin/users", icon: Users },
  { title: "PME enregistrées", url: "/admin/pmes", icon: Building2 },
  { title: "Campagnes", url: "/admin/campaigns", icon: Megaphone },
  { title: "Statistiques", url: "/admin/analytics", icon: BarChart3 },
  { title: "Notifications", url: "/admin/notifications", icon: Bell },
  { title: "Paramètres", url: "/admin/settings", icon: Settings },
];

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [{ title: "Administration | SmartCom PME" }] }),
  component: () => (
    <DashboardShell requiredRole="admin" items={adminNav} label="Administration" title="Espace administrateur">
      <Outlet />
    </DashboardShell>
  ),
});
