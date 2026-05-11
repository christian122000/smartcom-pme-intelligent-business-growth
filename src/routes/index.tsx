import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { Presentation } from "@/components/Presentation";
import { Features } from "@/components/Features";
import { Benefits } from "@/components/Benefits";
import { Stats } from "@/components/Stats";
import { Testimonials } from "@/components/Testimonials";
import { Footer } from "@/components/Footer";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "SmartCom PME — Communication digitale intelligente pour les PME camerounaises" },
      { name: "description", content: "Plateforme SaaS IA d'automatisation marketing, analyse client et chatbot intelligent pour les PME au Cameroun." },
      { property: "og:title", content: "SmartCom PME — Plateforme IA pour PME" },
      { property: "og:description", content: "Automatisez votre marketing et boostez votre communication digitale avec l'IA." },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <Navbar />
      <Hero />
      <Presentation />
      <Features />
      <Benefits />
      <Stats />
      <Testimonials />
      <Footer />
    </main>
  );
}
