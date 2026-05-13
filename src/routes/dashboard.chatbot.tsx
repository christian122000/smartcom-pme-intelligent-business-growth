import { createFileRoute } from "@tanstack/react-router";
import { useState, useRef, useEffect, useMemo } from "react";
import { Send, Bot, User, Sparkles, Loader2, Plus, MessageSquare, Trash2, Wand2, Megaphone, Lightbulb, TrendingUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, type UIMessage } from "ai";

export const Route = createFileRoute("/dashboard/chatbot")({ component: Chatbot });

type Thread = { id: string; title: string; messages: UIMessage[]; updatedAt: number };
const STORAGE_KEY = "smartcom-chat-threads";

const suggestions = [
  { icon: Megaphone, label: "Campagne promo WhatsApp pour mes clients VIP", color: "from-emerald-500 to-teal-500" },
  { icon: Wand2, label: "Génère 5 slogans pour ma boutique de mode à Douala", color: "from-violet-500 to-fuchsia-500" },
  { icon: Lightbulb, label: "Idées de campagne pour la rentrée scolaire", color: "from-amber-500 to-orange-500" },
  { icon: TrendingUp, label: "Comment optimiser mon taux d'ouverture Email ?", color: "from-blue-500 to-cyan-500" },
];

function loadThreads(): Thread[] {
  if (typeof window === "undefined") return [];
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]"); } catch { return []; }
}
function saveThreads(t: Thread[]) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(t.slice(0, 50))); } catch {}
}
function newThread(): Thread {
  return { id: crypto.randomUUID(), title: "Nouvelle conversation", messages: [], updatedAt: Date.now() };
}

function Chatbot() {
  const [threads, setThreads] = useState<Thread[]>([]);
  const [activeId, setActiveId] = useState<string>("");

  // hydrate
  useEffect(() => {
    const t = loadThreads();
    if (t.length === 0) {
      const nt = newThread();
      setThreads([nt]); setActiveId(nt.id);
    } else {
      setThreads(t); setActiveId(t[0].id);
    }
  }, []);

  const active = useMemo(() => threads.find((t) => t.id === activeId), [threads, activeId]);

  const transport = useMemo(() => new DefaultChatTransport({ api: "/api/chat" }), []);

  const { messages, sendMessage, status, setMessages } = useChat({
    id: activeId,
    messages: active?.messages ?? [],
    transport,
  });

  // persist on changes
  useEffect(() => {
    if (!activeId) return;
    setThreads((prev) => {
      const updated = prev.map((t) => {
        if (t.id !== activeId) return t;
        const firstUser = messages.find((m) => m.role === "user");
        const titleText = firstUser?.parts.map((p) => (p.type === "text" ? p.text : "")).join(" ").trim();
        return {
          ...t,
          messages,
          updatedAt: Date.now(),
          title: titleText ? titleText.slice(0, 40) : t.title,
        };
      });
      saveThreads(updated);
      return updated;
    });
  }, [messages, activeId]);

  const [input, setInput] = useState("");
  const endRef = useRef<HTMLDivElement>(null);
  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, status]);

  const isLoading = status === "submitted" || status === "streaming";

  function handleSend(text: string) {
    const t = text.trim();
    if (!t || isLoading) return;
    setInput("");
    sendMessage({ text: t });
  }

  function createNew() {
    const nt = newThread();
    const updated = [nt, ...threads];
    setThreads(updated); saveThreads(updated);
    setActiveId(nt.id);
    setMessages([]);
  }

  function selectThread(id: string) {
    const t = threads.find((x) => x.id === id);
    if (!t) return;
    setActiveId(id);
    setMessages(t.messages);
  }

  function deleteThread(id: string) {
    const updated = threads.filter((t) => t.id !== id);
    if (updated.length === 0) updated.push(newThread());
    setThreads(updated); saveThreads(updated);
    if (id === activeId) {
      setActiveId(updated[0].id);
      setMessages(updated[0].messages);
    }
  }

  return (
    <div className="flex h-[calc(100vh-7rem)] gap-4">
      {/* Sidebar threads */}
      <aside className="hidden md:flex w-64 flex-col rounded-2xl border border-border bg-card/50 backdrop-blur p-3">
        <button onClick={createNew} className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-gradient-to-r from-primary to-accent text-primary-foreground text-sm font-medium shadow-lg shadow-primary/20 hover:shadow-primary/40 transition">
          <Plus className="h-4 w-4" /> Nouvelle conversation
        </button>
        <div className="mt-4 text-[11px] uppercase tracking-wider text-muted-foreground px-2 mb-2">Historique</div>
        <div className="flex-1 overflow-y-auto space-y-1 pr-1">
          {threads.map((t) => (
            <button
              key={t.id}
              onClick={() => selectThread(t.id)}
              className={`group w-full flex items-center gap-2 px-3 py-2 rounded-lg text-left text-sm transition ${t.id === activeId ? "bg-primary/10 text-primary border border-primary/20" : "hover:bg-muted/50 text-foreground/80"}`}
            >
              <MessageSquare className="h-3.5 w-3.5 shrink-0 opacity-70" />
              <span className="truncate flex-1">{t.title}</span>
              <Trash2
                onClick={(e) => { e.stopPropagation(); deleteThread(t.id); }}
                className="h-3.5 w-3.5 opacity-0 group-hover:opacity-60 hover:!opacity-100 hover:text-destructive transition"
              />
            </button>
          ))}
        </div>
      </aside>

      {/* Chat */}
      <div className="flex-1 flex flex-col rounded-2xl border border-border bg-gradient-to-b from-card/50 to-background backdrop-blur overflow-hidden">
        <header className="flex items-center gap-3 px-5 py-4 border-b border-border bg-card/30">
          <span className="relative h-10 w-10 rounded-xl bg-gradient-to-br from-primary via-accent to-primary text-primary-foreground inline-flex items-center justify-center shadow-lg shadow-primary/30">
            <Sparkles className="h-5 w-5" />
            <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-emerald-500 ring-2 ring-background animate-pulse" />
          </span>
          <div className="flex-1">
            <h2 className="font-semibold flex items-center gap-2">
              Assistant IA SmartCom
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-gradient-to-r from-primary/20 to-accent/20 text-primary border border-primary/20 font-medium">GEMINI</span>
            </h2>
            <p className="text-xs text-muted-foreground">Votre stratège marketing IA pour PME</p>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto px-5 py-6 space-y-5">
          {messages.length === 0 && (
            <div className="h-full flex flex-col items-center justify-center text-center max-w-xl mx-auto">
              <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="h-16 w-16 rounded-2xl bg-gradient-to-br from-primary to-accent text-primary-foreground inline-flex items-center justify-center shadow-2xl shadow-primary/30 mb-5">
                <Sparkles className="h-8 w-8" />
              </motion.div>
              <h3 className="text-2xl font-display font-bold bg-gradient-to-r from-foreground to-foreground/60 bg-clip-text text-transparent mb-2">Bonjour 👋</h3>
              <p className="text-muted-foreground mb-8">Je suis votre assistant marketing IA. Comment puis-je vous aider à booster votre PME aujourd'hui ?</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
                {suggestions.map((s, i) => (
                  <motion.button
                    key={s.label}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 + i * 0.05 }}
                    onClick={() => handleSend(s.label)}
                    className="group flex items-start gap-3 p-3 rounded-xl border border-border bg-card hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5 text-left transition"
                  >
                    <span className={`h-9 w-9 rounded-lg bg-gradient-to-br ${s.color} text-white inline-flex items-center justify-center shrink-0 shadow-md`}>
                      <s.icon className="h-4 w-4" />
                    </span>
                    <span className="text-sm text-foreground/80 group-hover:text-foreground">{s.label}</span>
                  </motion.button>
                ))}
              </div>
            </div>
          )}

          <AnimatePresence initial={false}>
            {messages.map((m) => {
              const text = m.parts.map((p) => (p.type === "text" ? p.text : "")).join("");
              return (
                <motion.div key={m.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className={`flex gap-3 ${m.role === "user" ? "flex-row-reverse" : ""}`}>
                  <span className={`h-8 w-8 rounded-lg shrink-0 inline-flex items-center justify-center shadow-sm ${m.role === "user" ? "bg-gradient-to-br from-primary to-accent text-primary-foreground" : "bg-gradient-to-br from-muted to-card border border-border text-primary"}`}>
                    {m.role === "user" ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                  </span>
                  <div className={`max-w-[78%] rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm ${m.role === "user" ? "bg-gradient-to-br from-primary to-accent text-primary-foreground rounded-tr-sm" : "bg-card border border-border rounded-tl-sm"}`}>
                    <Markdown text={text} />
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>

          {isLoading && messages[messages.length - 1]?.role === "user" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-3">
              <span className="h-8 w-8 rounded-lg bg-gradient-to-br from-muted to-card border border-border text-primary inline-flex items-center justify-center"><Bot className="h-4 w-4" /></span>
              <div className="rounded-2xl bg-card border border-border px-4 py-3 flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin text-primary" />
                <span className="text-xs text-muted-foreground">Réflexion...</span>
              </div>
            </motion.div>
          )}
          <div ref={endRef} />
        </div>

        <form onSubmit={(e) => { e.preventDefault(); handleSend(input); }} className="p-4 border-t border-border bg-card/30">
          <div className="flex items-end gap-2 p-2 rounded-2xl border border-border bg-background focus-within:border-primary/50 focus-within:ring-4 focus-within:ring-primary/10 transition">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(input); } }}
              rows={1}
              placeholder="Posez votre question marketing..."
              className="flex-1 resize-none bg-transparent px-3 py-2 text-sm focus:outline-none max-h-32"
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="h-9 w-9 rounded-xl bg-gradient-to-br from-primary to-accent text-primary-foreground inline-flex items-center justify-center disabled:opacity-40 hover:shadow-lg hover:shadow-primary/30 transition"
            >
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            </button>
          </div>
          <p className="text-[10px] text-muted-foreground text-center mt-2">Propulsé par Gemini · Les réponses peuvent être imparfaites, vérifiez avant publication.</p>
        </form>
      </div>
    </div>
  );
}

// Minimal markdown: **bold**, line breaks, lists, headings, code
function Markdown({ text }: { text: string }) {
  const lines = text.split("\n");
  return (
    <div className="space-y-1.5 [&_strong]:font-semibold">
      {lines.map((line, i) => {
        if (line.startsWith("### ")) return <h3 key={i} className="font-semibold text-base mt-2">{renderInline(line.slice(4))}</h3>;
        if (line.startsWith("## ")) return <h2 key={i} className="font-bold text-lg mt-3">{renderInline(line.slice(3))}</h2>;
        if (line.startsWith("# ")) return <h1 key={i} className="font-bold text-xl mt-3">{renderInline(line.slice(2))}</h1>;
        if (/^\s*[-*]\s/.test(line)) return <div key={i} className="flex gap-2 pl-2"><span className="opacity-50">•</span><span>{renderInline(line.replace(/^\s*[-*]\s/, ""))}</span></div>;
        if (/^\s*\d+\.\s/.test(line)) {
          const m = line.match(/^\s*(\d+)\.\s(.*)/);
          return <div key={i} className="flex gap-2 pl-2"><span className="opacity-60 font-medium">{m?.[1]}.</span><span>{renderInline(m?.[2] ?? "")}</span></div>;
        }
        if (line.trim() === "") return <div key={i} className="h-1" />;
        return <p key={i}>{renderInline(line)}</p>;
      })}
    </div>
  );
}

function renderInline(text: string) {
  const parts = text.split(/(\*\*[^*]+\*\*|`[^`]+`)/g);
  return parts.map((p, i) => {
    if (p.startsWith("**") && p.endsWith("**")) return <strong key={i}>{p.slice(2, -2)}</strong>;
    if (p.startsWith("`") && p.endsWith("`")) return <code key={i} className="px-1 py-0.5 rounded bg-muted text-[0.85em] font-mono">{p.slice(1, -1)}</code>;
    return <span key={i}>{p}</span>;
  });
}
