import { useEffect, type ReactNode } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useAuth, type AppRole } from "@/hooks/use-auth";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { DashboardSidebar, type NavItem } from "@/components/dashboard/DashboardSidebar";
import { Loader2, Bell } from "lucide-react";

export function DashboardShell({
  requiredRole, items, label, title, children,
}: {
  requiredRole: AppRole; items: NavItem[]; label: string; title: string; children: ReactNode;
}) {
  const { user, role, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (loading) return;
    if (!user) navigate({ to: "/auth" });
    else if (role && role !== requiredRole) {
      navigate({ to: role === "admin" ? "/admin" : "/dashboard" });
    }
  }, [user, role, loading, navigate, requiredRole]);

  if (loading || !user || role !== requiredRole) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-muted/30">
        <DashboardSidebar items={items} label={label} />
        <SidebarInset>
          <header className="sticky top-0 z-10 flex h-14 items-center gap-3 border-b border-border bg-background/80 backdrop-blur px-4">
            <SidebarTrigger />
            <h1 className="font-display font-semibold">{title}</h1>
            <div className="ml-auto flex items-center gap-2">
              <button className="relative h-9 w-9 rounded-lg border border-border bg-background hover:bg-muted inline-flex items-center justify-center">
                <Bell className="h-4 w-4" />
                <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-primary" />
              </button>
            </div>
          </header>
          <main className="p-4 sm:p-6">{children}</main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
