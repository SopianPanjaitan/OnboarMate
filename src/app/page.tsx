import React from "react";
import Link from "next/link";
import {
  CheckCircle,
  Bot,
  Shield,
  Users,
  ArrowRight,
  Building2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const features = [
  {
    icon: <Bot size={24} />,
    title: "AI-Powered Assistant",
    description:
      "Employees get instant, grounded answers from your approved documents via a conversational AI assistant.",
  },
  {
    icon: <CheckCircle size={24} />,
    title: "Structured Onboarding",
    description:
      "HR creates reusable templates; employees follow clear checklists with tracked progress.",
  },
  {
    icon: <Shield size={24} />,
    title: "Secure by Design",
    description:
      "Tenant-isolated, role-scoped access. Private document storage with signed URL downloads.",
  },
  {
    icon: <Users size={24} />,
    title: "HR-Managed Invitations",
    description:
      "No public sign-ups. HR invites employees directly; roles are scoped per organization.",
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-surface-white">
      {/* Nav */}
      <header className="border-b border-surface-border bg-surface-white sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-md bg-brand-navy flex items-center justify-center">
              <Building2 size={16} className="text-white" />
            </div>
            <span className="font-bold text-brand-navy text-lg">OnboardMate</span>
          </div>
          <nav className="hidden md:flex items-center gap-6 text-sm text-text-secondary">
            <a href="#features" className="hover:text-text-primary">Features</a>
            <a href="#how-it-works" className="hover:text-text-primary">How it works</a>
          </nav>
          <div className="flex items-center gap-3">
            <Button asChild variant="outline" size="sm">
              <Link href="/login">Log in</Link>
            </Button>
            <Button asChild size="sm">
              <Link href="/login">Get started</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-6 py-24 text-center">
        <div className="inline-flex items-center gap-2 bg-brand-blue-light text-brand-blue rounded-full px-4 py-1.5 text-xs font-medium mb-6">
          <Bot size={12} /> AI-Powered Onboarding
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-brand-navy mb-6 leading-tight">
          Onboard employees faster<br className="hidden md:block" /> with AI-guided workflows
        </h1>
        <p className="text-lg text-text-secondary max-w-2xl mx-auto mb-10">
          OnboardMate combines structured checklists, a knowledge base, and a conversational AI
          assistant so every new hire gets the right information from day one.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild size="lg">
            <Link href="/login" className="flex items-center gap-2">
              Get started <ArrowRight size={16} />
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/app/dashboard">View employee demo</Link>
          </Button>
        </div>
        <p className="mt-4 text-xs text-text-muted">
          Demo uses Nexora Technologies — fictional demonstration data only.
        </p>
      </section>

      {/* Features */}
      <section id="features" className="bg-surface-gray py-20">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-2xl font-bold text-text-primary text-center mb-12">
            Everything your HR team needs
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f) => (
              <Card key={f.title}>
                <CardContent className="pt-6">
                  <div className="h-10 w-10 rounded-lg bg-brand-blue-light text-brand-blue flex items-center justify-center mb-4">
                    {f.icon}
                  </div>
                  <h3 className="font-semibold text-text-primary mb-2">{f.title}</h3>
                  <p className="text-sm text-text-secondary">{f.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="max-w-6xl mx-auto px-6 py-20">
        <h2 className="text-2xl font-bold text-text-primary text-center mb-12">
          How it works
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { step: "1", title: "HR uploads documents", desc: "Policies, procedures, and handbooks are indexed into the knowledge base." },
            { step: "2", title: "Assign onboarding templates", desc: "HR assigns structured task templates to each new hire." },
            { step: "3", title: "Employee completes onboarding", desc: "Employees follow checklists and ask the AI assistant for guidance." },
          ].map((s) => (
            <div key={s.step} className="flex flex-col items-center text-center gap-4">
              <div className="h-12 w-12 rounded-full bg-brand-navy text-white font-bold text-lg flex items-center justify-center">
                {s.step}
              </div>
              <h3 className="font-semibold text-text-primary">{s.title}</h3>
              <p className="text-sm text-text-secondary">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-brand-navy py-20">
        <div className="max-w-2xl mx-auto px-6 text-center">
          <h2 className="text-2xl font-bold text-white mb-4">
            Ready to streamline onboarding?
          </h2>
          <p className="text-brand-blue-muted mb-8">
            Contact your platform administrator to set up your organization.
          </p>
          <Button asChild variant="primary" size="lg">
            <Link href="/login">Log in to your account</Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-surface-border py-8 text-center text-xs text-text-muted">
        © 2026 OnboardMate · Demo data (Nexora Technologies) is entirely fictional.
      </footer>
    </div>
  );
}
