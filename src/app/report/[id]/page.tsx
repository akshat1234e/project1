import { VerdictBlock } from '@/components/report/VerdictBlock'
import { ReportSection } from '@/components/report/ReportSection'
import { Button } from '@/components/ui/Button'
import { Download, ShieldAlert } from 'lucide-react'
import { notFound } from 'next/navigation'
import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"

export default async function ReportPage({ params }: { params: { id: string } }) {
    const cookieStore = await cookies();
    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return cookieStore.getAll();
                },
            },
        }
    );

    const { data: report, error } = await supabase
        .from("reports")
        .select("*, submission:submissions(*)")
        .eq("id", params.id)
        .single();

    if (error || !report) {
        notFound()
    }

    // Increment view count
    await supabase
        .from("reports")
        .update({
            viewCount: (report.viewCount || 0) + 1,
            lastViewedAt: new Date().toISOString()
        })
        .eq("id", params.id);

    const sections = report.sections as any;

    return (
        <div className="min-h-screen bg-background py-20 relative overflow-hidden">
            {/* Ambient Background Glows */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-accent/10 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-accent-secondary/10 rounded-full blur-[120px] pointer-events-none" />

            <div className="max-w-4xl mx-auto px-6 space-y-16 relative z-10">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div className="space-y-2">
                        <h1 className="text-4xl font-black text-white tracking-tighter text-glow uppercase">
                            Startup Diagnostic Report
                        </h1>
                        <p className="text-accent text-[10px] font-black uppercase tracking-[0.3em]">
                            Generated on {new Date(report.createdAt).toLocaleDateString()}
                        </p>
                    </div>
                    <Button variant="outline" className="gap-2">
                        <Download size={20} /> Export PDF
                    </Button>
                </div>

                {/* Verdict Block */}
                <div className="glass p-12 border-glow">
                    <VerdictBlock
                        verdict={report.verdict}
                        reason={report.verdictReason}
                        score={report.ruleScore?.total}
                    />
                </div>

                {/* Red Flags */}
                {report.aiGenerated?.redFlags?.length > 0 && (
                    <div className="glass p-8 border-verdict-kill/50 bg-verdict-kill/5 shadow-[0_0_30px_rgba(255,0,77,0.1)]">
                        <h3 className="text-verdict-kill text-xs font-black uppercase tracking-[0.3em] mb-6 flex items-center gap-2">
                            <ShieldAlert size={16} /> Detected Red Flags
                        </h3>
                        <ul className="space-y-4">
                            {report.aiGenerated.redFlags.map((flag: string, i: number) => (
                                <li key={i} className="text-white text-sm font-bold flex items-center gap-3">
                                    <div className="h-1.5 w-1.5 bg-verdict-kill" />
                                    {flag}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {/* Report Sections */}
                <div className="space-y-12">
                    {[
                        { title: "Why this verdict was issued", content: sections.whyVerdict },
                        { title: "Team Analysis", content: sections.teamAnalysis },
                        { title: "Market Analysis", content: sections.marketAnalysis },
                        { title: "Moat & Defensibility", content: sections.moatAnalysis },
                        { title: "What buyers will actually hear", content: sections.buyerPerspective },
                        { title: "Primary objection", content: sections.primaryObjection },
                        { title: "Trust gap", content: sections.trustGap },
                        { title: "One fix", content: sections.fix },
                        { title: "Next action", content: sections.nextAction }
                    ].filter(s => s.content).map((section, idx) => (
                        <div key={idx} className="glass p-8 border-glow">
                            <ReportSection
                                title={section.title}
                                content={section.content}
                            />
                        </div>
                    ))}
                </div>

                <div className="pt-12 border-t border-white/10 text-center">
                    <p className="text-muted text-[10px] uppercase tracking-[0.5em] font-black">
                        End of Diagnostic Report
                    </p>
                </div>
            </div>
        </div>
    )
}
