import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { ScrollReveal } from "@/components/animations/ScrollReveal";
import { ParallaxSection } from "@/components/animations/ParallaxSection";
import { ParallaxText } from "@/components/animations/ParallaxText";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col">
      {/* Navigation */}
      <nav className="fixed top-0 z-50 w-full border-b border-foreground/5 bg-background/80 backdrop-blur-md">
        <div className="container mx-auto flex h-16 items-center justify-between px-6">
          <Link href="/" className="text-lg font-bold tracking-tighter uppercase">
            Startup Diagnostic
          </Link>
          <div className="flex items-center gap-8">
            <Link href="/login" className="text-sm font-medium uppercase tracking-widest text-muted hover:text-foreground transition-colors">
              Sign In
            </Link>
            <Link href="/diagnostic">
              <Button size="sm" className="rounded-none">
                Get Diagnostic
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative flex min-h-screen flex-col items-center justify-center px-6 pt-32 text-center">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_50%_50%,rgba(17,17,17,0.02),transparent)]" />

        <ScrollReveal>
          <span className="mb-4 inline-block text-sm font-medium tracking-widest uppercase text-muted">
            The Reality Check
          </span>
        </ScrollReveal>

        <ScrollReveal delay={0.1}>
          <ParallaxSection offset={30}>
            <h1 className="max-w-4xl text-5xl font-semibold leading-[1.1] tracking-tight sm:text-7xl md:text-8xl">
              Most startup ideas fail because <span className="text-muted italic">nobody actually wants them.</span>
            </h1>
          </ParallaxSection>
        </ScrollReveal>

        <ScrollReveal delay={0.2} className="mt-8 max-w-2xl">
          <p className="text-xl leading-relaxed text-muted sm:text-2xl">
            We provide a cold, hard diagnostic of your business idea. No fluff. No "friendly" advice. Just the truth about whether buyers will care.
          </p>
        </ScrollReveal>

        <ScrollReveal delay={0.3} className="mt-12">
          <Link href="/diagnostic">
            <Button size="lg" isMagnetic className="rounded-none">
              Get a Diagnostic
            </Button>
          </Link>
        </ScrollReveal>

        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 animate-bounce text-muted">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M7 13l5 5 5-5M7 6l5 5 5-5" />
          </svg>
        </div>
      </section>

      {/* Verdict Section */}
      <section className="bg-foreground py-32 text-background overflow-hidden">
        <div className="container mx-auto px-6">
          <ScrollReveal className="mb-20 text-center">
            <h2 className="text-4xl font-semibold sm:text-5xl">What this does.</h2>
          </ScrollReveal>

          <div className="grid gap-8 md:grid-cols-3">
            <ScrollReveal delay={0.1}>
              <ParallaxSection offset={20}>
                <Card className="h-full border-background/20 bg-transparent text-background">
                  <div className="mb-6 text-2xl font-semibold">01. Issues a verdict.</div>
                  <p className="text-lg leading-relaxed text-background/60">
                    A deterministic decision: PROCEED, FIX, or KILL. We don't do "maybe."
                  </p>
                </Card>
              </ParallaxSection>
            </ScrollReveal>

            <ScrollReveal delay={0.2}>
              <ParallaxSection offset={40}>
                <Card className="h-full border-background/20 bg-transparent text-background">
                  <div className="mb-6 text-2xl font-semibold">02. Explains why.</div>
                  <p className="text-lg leading-relaxed text-background/60">
                    We articulate the exact objections buyers will have before you ever talk to them.
                  </p>
                </Card>
              </ParallaxSection>
            </ScrollReveal>

            <ScrollReveal delay={0.3}>
              <ParallaxSection offset={60}>
                <Card className="h-full border-background/20 bg-transparent text-background">
                  <div className="mb-6 text-2xl font-semibold">03. Tells you what to do.</div>
                  <p className="text-lg leading-relaxed text-background/60">
                    Specific, actionable steps to fix the trust gap or a clear directive to stop.
                  </p>
                </Card>
              </ParallaxSection>
            </ScrollReveal>
          </div>
        </div>

        <div className="mt-32 opacity-10">
          <ParallaxText baseVelocity={-200} className="text-[10vw] font-bold uppercase tracking-tighter">
            Reality Check • No Fluff • Just Truth • Reality Check • No Fluff • Just Truth •
          </ParallaxText>
        </div>
      </section>

      {/* Who it's for */}
      <section className="py-32 overflow-hidden">
        <div className="container mx-auto px-6">
          <div className="flex flex-col items-center gap-16 md:flex-row">
            <div className="flex-1">
              <ScrollReveal>
                <h2 className="text-4xl font-semibold sm:text-5xl">Built for founders who value time over ego.</h2>
              </ScrollReveal>
              <ScrollReveal delay={0.1} className="mt-8">
                <ul className="space-y-6 text-xl text-muted">
                  <li className="flex items-start gap-4">
                    <span className="mt-1.5 h-2 w-2 shrink-0 bg-foreground" />
                    Early-stage B2B AI / Fintech founders.
                  </li>
                  <li className="flex items-start gap-4">
                    <span className="mt-1.5 h-2 w-2 shrink-0 bg-foreground" />
                    Pre-PMF teams looking for reality.
                  </li>
                  <li className="flex items-start gap-4">
                    <span className="mt-1.5 h-2 w-2 shrink-0 bg-foreground" />
                    Anyone who has built something but isn't seeing traction.
                  </li>
                </ul>
              </ScrollReveal>
            </div>
            <div className="flex-1">
              <ParallaxSection offset={80}>
                <div className="aspect-square bg-foreground/5 p-12">
                  <div className="h-full w-full border border-foreground/10 bg-background p-8 shadow-2xl">
                    <div className="mb-8 h-4 w-24 bg-verdict-fix" />
                    <div className="mb-4 h-8 w-full bg-foreground/10" />
                    <div className="mb-4 h-8 w-3/4 bg-foreground/10" />
                    <div className="mb-12 h-8 w-1/2 bg-foreground/10" />
                    <div className="h-32 w-full bg-foreground/5" />
                  </div>
                </div>
              </ParallaxSection>
            </div>
          </div>
        </div>
      </section>

      {/* Post-Sale Module */}
      <section className="bg-background py-32 overflow-hidden">
        <div className="container mx-auto px-6">
          <div className="flex flex-col items-center gap-16 md:flex-row-reverse">
            <div className="flex-1">
              <ScrollReveal>
                <span className="mb-4 inline-block text-sm font-medium tracking-widest uppercase text-muted">
                  Phase 2: Post-Sale
                </span>
                <h2 className="text-4xl font-semibold sm:text-5xl">Post-Sale Reality & Revenue Risk Analysis.</h2>
              </ScrollReveal>
              <ScrollReveal delay={0.1} className="mt-8">
                <p className="text-xl leading-relaxed text-muted">
                  The truth doesn't stop at the sale. This module assesses whether your revenue is stable, at risk, or illusory based on customer belief and behavior.
                </p>
                <Link href="/post-sale" className="mt-8 inline-block">
                  <Button variant="outline" className="rounded-none">
                    Explore Post-Sale Analysis
                  </Button>
                </Link>
              </ScrollReveal>
            </div>
            <div className="flex-1">
              <ParallaxSection offset={-60}>
                <div className="aspect-video bg-foreground/5 p-8">
                  <div className="h-full w-full border border-foreground/10 bg-background p-6 shadow-xl">
                    <div className="mb-4 h-2 w-16 bg-verdict-kill" />
                    <div className="mb-2 h-4 w-full bg-foreground/10" />
                    <div className="mb-8 h-4 w-2/3 bg-foreground/10" />
                    <div className="grid grid-cols-2 gap-4">
                      <div className="h-12 bg-foreground/5" />
                      <div className="h-12 bg-foreground/5" />
                    </div>
                  </div>
                </div>
              </ParallaxSection>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="border-t border-foreground/5 py-32 text-center overflow-hidden">
        <ScrollReveal>
          <ParallaxSection offset={30}>
            <h2 className="mb-12 text-4xl font-semibold sm:text-6xl">Ready for the truth?</h2>
            <Link href="/diagnostic">
              <Button size="lg" isMagnetic className="rounded-none">
                Start Diagnostic — ₹999
              </Button>
            </Link>
            <p className="mt-6 text-sm text-muted">No account required. Results in 60 seconds.</p>
          </ParallaxSection>
        </ScrollReveal>
      </section>

      {/* Footer */}
      <footer className="border-t border-foreground/5 py-12">
        <div className="container mx-auto px-6 text-center text-sm text-muted">
          &copy; {new Date().getFullYear()} Startup Diagnostic. Authoritative software for serious founders.
        </div>
      </footer>
    </div>
  );
}
