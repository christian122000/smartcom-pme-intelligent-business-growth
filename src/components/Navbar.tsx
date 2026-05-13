import { useState } from "react";
import { motion } from "framer-motion";
import { Menu, X, Sparkles, LogOut, User as UserIcon } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { ThemeToggle } from "./ThemeToggle";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "sonner";

const links = [
  { label: "Accueil", href: "#accueil" },
  { label: "Fonctionnalités", href: "#fonctionnalites" },
  { label: "À propos", href: "#apropos" },
  { label: "Contact", href: "#contact" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const { user, role, signOut, loading } = useAuth();
  const dashboardPath = role === "admin" ? "/admin" : "/dashboard";

  async function handleSignOut() {
    await signOut();
    toast.success("Déconnexion réussie");
  }

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 inset-x-0 z-50 glass border-b border-border/60"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <span className="relative inline-flex h-9 w-9 items-center justify-center rounded-xl gradient-hero-bg shadow-glow">
            <Sparkles className="h-5 w-5 text-primary-foreground" />
          </span>
          <span className="font-display font-bold text-lg tracking-tight">
            SmartCom <span className="gradient-text">PME</span>
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors relative after:absolute after:bottom-[-6px] after:left-0 after:h-[2px] after:w-0 after:bg-primary after:transition-all hover:after:w-full"
            >
              {l.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          {!loading && user ? (
            <>
              <Link
                to={dashboardPath}
                className="hidden sm:inline-flex h-10 items-center gap-2 rounded-full border border-border bg-card px-4 text-sm font-medium hover:bg-muted transition"
              >
                <UserIcon className="h-4 w-4" /> Mon espace
              </Link>
              <button
                onClick={handleSignOut}
                className="hidden sm:inline-flex h-10 items-center gap-1.5 rounded-full px-4 text-sm font-semibold text-primary-foreground gradient-hero-bg shadow-elegant hover:shadow-glow transition-all hover:scale-[1.03]"
              >
                <LogOut className="h-4 w-4" /> Déconnexion
              </button>
            </>
          ) : (
            <>
              <Link
                to="/auth"
                className="hidden sm:inline-flex h-10 items-center rounded-full border border-border bg-card px-4 text-sm font-medium hover:bg-muted transition"
              >
                Connexion
              </Link>
              <Link
                to="/auth"
                className="hidden sm:inline-flex h-10 items-center rounded-full px-5 text-sm font-semibold text-primary-foreground gradient-hero-bg shadow-elegant hover:shadow-glow transition-all hover:scale-[1.03]"
              >
                Inscription
              </Link>
            </>
          )}
          <button
            className="md:hidden inline-flex h-10 w-10 items-center justify-center rounded-full border border-border"
            onClick={() => setOpen((v) => !v)}
            aria-label="Menu"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          className="md:hidden border-t border-border bg-background"
        >
          <div className="px-4 py-4 flex flex-col gap-3">
            {links.map((l) => (
              <a key={l.href} href={l.href} onClick={() => setOpen(false)} className="py-2 text-sm font-medium">
                {l.label}
              </a>
            ))}
            <div className="flex gap-2 pt-2">
              {user ? (
                <button onClick={handleSignOut} className="flex-1 h-10 rounded-full text-sm font-semibold text-primary-foreground gradient-hero-bg">
                  Déconnexion
                </button>
              ) : (
                <>
                  <Link to="/auth" className="flex-1 h-10 rounded-full border border-border text-sm font-medium flex items-center justify-center">
                    Connexion
                  </Link>
                  <Link to="/auth" className="flex-1 h-10 rounded-full text-sm font-semibold text-primary-foreground gradient-hero-bg flex items-center justify-center">
                    Inscription
                  </Link>
                </>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </motion.header>
  );
}
