import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { ScrollReveal } from "@/components/animations/ScrollReveal";
import { ParallaxSection } from "@/components/animations/ParallaxSection";
import { ParallaxText } from "@/components/animations/ParallaxText";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col bg-background relative overflow-hidden">
      {/* Ambient Background Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-accent/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-accent-secondary/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Navigation */}
      <nav className="fixed top-0 z-50 w-full border-b border-white/10 glass">
        <div className="container mx-auto flex h-20 items-center justify-between px-6">
          <Link href="/" className="text-xl font-black tracking-tighter uppercase text-white text-glow">
            Startup Diagnostic
          </Link>
          <div className="flex items-center gap-12">
            <Link href="/login" className="text-[10px] font-black uppercase tracking-[0.2em] text-muted hover:text-accent transition-colors">
              Sign In
            </Link>
            <Link href="/diagnostic">
              <Button size="sm">
                Get Diagnostic
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative flex min-h-screen flex-col items-center justify-center px-6 pt-32 text-center">
        <ScrollReveal>
          <span className="mb-6 inline-block text-[10px] font-black tracking-[0.4em] uppercase text-accent">
            The Reality Check
          </span>
        </ScrollReveal>

        <ScrollReveal delay={0.1}>
          <ParallaxSection offset={30}>
            <h1 className="max-w-5xl text-6xl font-black leading-[0.9] tracking-tighter sm:text-8xl md:text-9xl text-white uppercase">
              Most startup ideas fail because <span className="text-accent italic text-glow">nobody actually wants them.</span>
            </h1>
          </ParallaxSection>
        </ScrollReveal>

        <ScrollReveal delay={0.2} className="mt-12 max-w-2xl">
          <p className="text-lg leading-relaxed text-muted sm:text-xl tracking-wide">
            We provide a cold, hard diagnostic of your business idea. No fluff. No "friendly" advice. Just the truth about whether buyers will care.
          </p>
        </ScrollReveal>

        <ScrollReveal delay={0.3} className="mt-16">
          <Link href="/diagnostic">
            <Button size="lg" isMagnetic>
              Get a Diagnostic
            </Button>
          </Link>
        </ScrollReveal>

        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 animate-bounce text-accent">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <path d="M7 13l5 5 5-5M7 6l5 5 5-5" />
          </svg>
        </div>
      </section>

      {/* Verdict Section */}
      <section className="py-32 relative overflow-hidden">
        <div className="container mx-auto px-6 relative z-10">
          <ScrollReveal className="mb-24 text-center">
            <h2 className="text-5xl font-black sm:text-7xl text-white uppercase tracking-tighter">What this does.</h2>
          </ScrollReveal>

          <div className="grid gap-12 md:grid-cols-3">
            {[
              { num: "01", title: "Issues a verdict.", desc: "A deterministic decision: PROCEED, FIX, or KILL. We don't do \"maybe.\"" },
              { num: "02", title: "Explains why.", desc: "We articulate the exact objections buyers will have before you ever talk to them." },
              { num: "03", title: "Tells you what to do.", desc: "Specific, actionable steps to fix the trust gap or a clear directive to stop." }
            ].map((item, idx) => (
              <ScrollReveal key={idx} delay={idx * 0.1}>
                <ParallaxSection offset={(idx + 1) * 20}>
                  <div className="glass p-12 h-full border-glow flex flex-col space-y-8">
                    <div className="text-accent font-black text-4xl tracking-tighter">{item.num}</div>
                    <div className="text-2xl font-black text-white uppercase tracking-tight">{item.title}</div>
                    <p className="text-muted leading-relaxed tracking-wide">
                      {item.desc}
                    </p>
                  </div>
                </ParallaxSection>
              </ScrollReveal>
            ))}
          </div>
        </div>

        <div className="mt-32 opacity-5">
          <ParallaxText baseVelocity={-200} className="text-[12vw] font-black uppercase tracking-tighter text-white">
            Reality Check • No Fluff • Just Truth • Reality Check • No Fluff • Just Truth •
          </ParallaxText>
        </div>
      </section>

      {/* Who it's for */}
      <section className="py-32 relative overflow-hidden">
        <div className="container mx-auto px-6 relative z-10">
          <div className="flex flex-col items-center gap-24 md:flex-row">
            <div className="flex-1 space-y-12">
              <ScrollReveal>
                <h2 className="text-5xl font-black sm:text-7xl text-white uppercase tracking-tighter leading-[0.9]">Built for founders who value time over ego.</h2>
              </ScrollReveal>
              <ScrollReveal delay={0.1}>
                <ul className="space-y-8">
                  {[
                    "Early-stage B2B AI / Fintech founders.",
                    "Pre-PMF teams looking for reality.",
                    "Anyone who has built something but isn't seeing traction."
                  ].map((text, idx) => (
                    <li key={idx} className="flex items-start gap-6 group">
                      <span className="mt-2 h-3 w-3 shrink-0 bg-accent shadow-[0_0_10px_rgba(0,242,255,0.5)] group-hover:scale-150 transition-transform" />
                      <span className="text-xl text-muted group-hover:text-white transition-colors tracking-wide">{text}</span>
                    </li>
                  ))}
                </ul>
              </ScrollReveal>
            </div>
            <div className="flex-1">
              <ParallaxSection offset={80}>
                <div className="glass p-12 border-glow">
                  <div className="aspect-square bg-white/5 p-8 border border-white/10 relative overflow-hidden">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(0,242,255,0.1),transparent)]" />
                    <div className="relative z-10 space-y-6">
                      <div className="h-4 w-32 bg-verdict-fix shadow-[0_0_15px_rgba(255,184,0,0.3)]" />
                      <div className="space-y-3">
                        <div className="h-8 w-full bg-white/10" />
                        <div className="h-8 w-3/4 bg-white/10" />
                        <div className="h-8 w-1/2 bg-white/10" />
                      </div>
                      <div className="h-40 w-full bg-white/5 border border-white/10" />
                    </div>
                  </div>
                </div>
              </ParallaxSection>
            </div>
          </div>
        </div>
      </section>

      {/* Post-Sale Module */}
      <section className="py-32 relative overflow-hidden">
        <div className="container mx-auto px-6 relative z-10">
          <div className="flex flex-col items-center gap-24 md:flex-row-reverse">
            <div className="flex-1 space-y-12">
              <ScrollReveal>
                <span className="mb-6 inline-block text-[10px] font-black tracking-[0.4em] uppercase text-accent">
                  Phase 2: Post-Sale
                </span>
                <h2 className="text-5xl font-black sm:text-7xl text-white uppercase tracking-tighter leading-[0.9]">Post-Sale Reality & Revenue Risk Analysis.</h2>
              </ScrollReveal>
              <ScrollReveal delay={0.1} className="space-y-12">
                <p className="text-xl leading-relaxed text-muted tracking-wide">
                  The truth doesn't stop at the sale. This module assesses whether your revenue is stable, at risk, or illusory based on customer belief and behavior.
                </p>
                <Link href="/post-sale" className="inline-block">
                  <Button variant="outline">
                    Explore Post-Sale Analysis
                  </Button>
                </Link>
              </ScrollReveal>
            </div>
            <div className="flex-1">
              <ParallaxSection offset={-60}>
                <div className="glass p-12 border-glow">
                  <div className="aspect-video bg-white/5 p-8 border border-white/10 relative overflow-hidden">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(112,0,255,0.1),transparent)]" />
                    <div className="relative z-10 space-y-6">
                      <div className="h-4 w-24 bg-verdict-kill shadow-[0_0_15px_rgba(255,0,77,0.3)]" />
                      <div className="space-y-3">
                        <div className="h-6 w-full bg-white/10" />
                        <div className="h-6 w-2/3 bg-white/10" />
                      </div>
                      <div className="grid grid-cols-2 gap-6 mt-12">
                        <div className="h-16 bg-white/5 border border-white/10" />
                        <div className="h-16 bg-white/5 border border-white/10" />
                      </div>
                    </div>
                  </div>
                </div>
              </ParallaxSection>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-48 text-center relative overflow-hidden">
        <ScrollReveal>
          <ParallaxSection offset={30}>
            <h2 className="mb-16 text-6xl font-black sm:text-9xl text-white uppercase tracking-tighter text-glow">Ready for the truth?</h2>
            <Link href="/diagnostic">
              <Button size="lg" isMagnetic>
                Start Diagnostic — ₹999
              </Button>
            </Link>
            <p className="mt-12 text-[10px] text-muted uppercase tracking-[0.3em] font-black">No account required. Results in 60 seconds.</p>
          </ParallaxSection>
        </ScrollReveal>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-16 glass">
        <div className="container mx-auto px-6 text-center text-[10px] font-black uppercase tracking-[0.5em] text-muted">
          &copy; {new Date().getFullYear()} Startup Diagnostic. Authoritative software for serious founders.
        </div>
      </footer>
    </div>
  );
}
