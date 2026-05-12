import { createFileRoute } from "@tanstack/react-router";
import { Settings as SettingsIcon } from "lucide-react";

export const Route = createFileRoute("/admin/settings")({ component: () => <Settings /> });

function Settings() {
  return (
    <div className="space-y-4 max-w-2xl">
      <div className="flex items-center gap-2"><SettingsIcon className="h-5 w-5 text-primary" /><h2 className="text-lg font-semibold">Paramètres</h2></div>
      <div className="rounded-xl border border-border bg-card p-6 space-y-4">
        <Toggle label="Mode maintenance" desc="Désactiver l'accès public temporairement." />
        <Toggle label="Notifications email" desc="Recevoir un récapitulatif quotidien." defaultChecked />
        <Toggle label="Inscriptions ouvertes" desc="Autoriser de nouveaux utilisateurs à s'inscrire." defaultChecked />
      </div>
    </div>
  );
}

function Toggle({ label, desc, defaultChecked }: { label: string; desc: string; defaultChecked?: boolean }) {
  return (
    <label className="flex items-center justify-between gap-4 cursor-pointer">
      <div>
        <div className="font-medium text-sm">{label}</div>
        <div className="text-xs text-muted-foreground">{desc}</div>
      </div>
      <input type="checkbox" defaultChecked={defaultChecked} className="h-5 w-9 appearance-none rounded-full bg-muted checked:bg-primary relative transition before:content-[''] before:absolute before:top-0.5 before:left-0.5 before:h-4 before:w-4 before:rounded-full before:bg-white before:transition checked:before:translate-x-4" />
    </label>
  );
}
