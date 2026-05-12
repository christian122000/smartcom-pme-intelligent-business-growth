import { createFileRoute } from "@tanstack/react-router";
import { useState, useRef, useEffect } from "react";
import { Send, Bot, User, Sparkles, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export const Route = createFileRoute("/dashboard/chatbot")({ component: Chatbot });

type Msg = { role: "user" | "assistant"; content: string };

const suggestions = [
  "Quel canal performe le mieux pour mon secteur ?",
  "Rédige une campagne WhatsApp pour mes clients VIP.",
  "Quels sont les meilleurs créneaux pour publier ?",
];

const mockReplies = [
  "D'après l'analyse de vos données, **WhatsApp** génère le meilleur engagement (CTR 11.2%) sur votre cible. Je recommande de programmer vos campagnes promotionnelles entre 18h et 20h.",
  "Voici une suggestion : « 🎉 Cher(e) client(e) VIP, profitez de -20% sur notre nouvelle collection ce week-end uniquement ! Réservez via WhatsApp. » Souhaitez-vous que j'ajuste le ton ?",
  "Pour votre audience, les pics d'activité sont le **mardi** et **vendredi** entre 18h-21h. Évitez les lundis matins (faible engagement).",
];

function Chatbot() {
  const [messages, setMessages] = useState<Msg[]>([
    { role: "assistant", content: "Bonjour 👋 Je suis votre assistant IA SmartCom. Posez-moi une question sur vos clients, vos campagnes ou demandez-moi de rédiger un message." },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, loading]);

  function send(text: string) {
    if (!text.trim()) return;
    setMessages((m) => [...m, { role: "user", content: text }]);
    setInput("");
    setLoading(true);
    setTimeout(() => {
      setMessages((m) => [...m, { role: "assistant", content: mockReplies[m.length % mockReplies.length] }]);
      setLoading(false);
    }, 900);
  }

  return (
    <div className="flex flex-col h-[calc(100vh-7rem)] max-w-3xl mx-auto">
      <div className="flex items-center gap-3 pb-4 border-b border-border">
        <span className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary to-accent text-primary-foreground inline-flex items-center justify-center"><Sparkles className="h-5 w-5" /></span>
        <div>
          <h2 className="font-semibold">Assistant IA SmartCom</h2>
          <p className="text-xs text-muted-foreground flex items-center gap-1.5"><span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" /> En ligne</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto py-4 space-y-4">
        <AnimatePresence initial={false}>
          {messages.map((m, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className={`flex gap-3 ${m.role === "user" ? "flex-row-reverse" : ""}`}>
              <span className={`h-8 w-8 rounded-lg shrink-0 inline-flex items-center justify-center ${m.role === "user" ? "bg-primary text-primary-foreground" : "bg-gradient-to-br from-primary/20 to-accent/20 text-primary"}`}>
                {m.role === "user" ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
              </span>
              <div className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-sm ${m.role === "user" ? "bg-primary text-primary-foreground rounded-tr-sm" : "bg-card border border-border rounded-tl-sm"}`}>
                {m.content.split("**").map((part, j) => j % 2 === 1 ? <strong key={j}>{part}</strong> : <span key={j}>{part}</span>)}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        {loading && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-3">
            <span className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary/20 to-accent/20 text-primary inline-flex items-center justify-center"><Bot className="h-4 w-4" /></span>
            <div className="rounded-2xl bg-card border border-border px-4 py-3"><Loader2 className="h-4 w-4 animate-spin text-primary" /></div>
          </motion.div>
        )}
        <div ref={endRef} />
      </div>

      {messages.length === 1 && (
        <div className="flex flex-wrap gap-2 mb-3">
          {suggestions.map((s) => (
            <button key={s} onClick={() => send(s)} className="text-xs px-3 py-1.5 rounded-full border border-border bg-card hover:border-primary/50 hover:text-primary transition">{s}</button>
          ))}
        </div>
      )}

      <form onSubmit={(e) => { e.preventDefault(); send(input); }} className="flex gap-2 pt-3 border-t border-border">
        <input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Écrivez votre message..." className="flex-1 h-11 rounded-xl border border-border bg-card px-4 text-sm focus:ring-2 focus:ring-primary/50" />
        <button disabled={loading || !input.trim()} className="h-11 px-4 rounded-xl bg-gradient-to-r from-primary to-accent text-primary-foreground inline-flex items-center gap-2 disabled:opacity-50 shadow">
          <Send className="h-4 w-4" />
        </button>
      </form>
    </div>
  );
}
