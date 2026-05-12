import { Link, useRouterState } from "@tanstack/react-router";
import { Sparkles, LogOut, type LucideIcon } from "lucide-react";
import { motion } from "framer-motion";
import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel,
  SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarFooter,
} from "@/components/ui/sidebar";
import { useAuth } from "@/hooks/use-auth";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export type NavItem = { title: string; url: string; icon: LucideIcon };

export function DashboardSidebar({ items, label }: { items: NavItem[]; label: string }) {
  const path = useRouterState({ select: (s) => s.location.pathname });
  const { user, signOut } = useAuth();
  const initials = (user?.email ?? "?").slice(0, 2).toUpperCase();

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="border-b border-sidebar-border">
        <Link to="/" className="flex items-center gap-2 px-2 py-2">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-accent text-primary-foreground shadow">
            <Sparkles className="h-4 w-4" />
          </span>
          <span className="font-display font-bold text-sm group-data-[collapsible=icon]:hidden">
            SmartCom <span className="text-primary">PME</span>
          </span>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>{label}</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => {
                const active = path === item.url;
                return (
                  <SidebarMenuItem key={item.url}>
                    <SidebarMenuButton asChild isActive={active}>
                      <Link to={item.url} className="flex items-center gap-2">
                        <item.icon className="h-4 w-4" />
                        <span>{item.title}</span>
                        {active && (
                          <motion.span layoutId="nav-dot" className="ml-auto h-1.5 w-1.5 rounded-full bg-primary group-data-[collapsible=icon]:hidden" />
                        )}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="border-t border-sidebar-border">
        <div className="flex items-center gap-2 px-2 py-2">
          <Avatar className="h-8 w-8"><AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">{initials}</AvatarFallback></Avatar>
          <div className="flex-1 min-w-0 group-data-[collapsible=icon]:hidden">
            <div className="text-xs font-medium truncate">{user?.email}</div>
            <button onClick={signOut} className="text-[11px] text-muted-foreground hover:text-foreground inline-flex items-center gap-1">
              <LogOut className="h-3 w-3" /> Déconnexion
            </button>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
