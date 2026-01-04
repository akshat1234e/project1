import { VerdictBlock } from '@/components/report/VerdictBlock'
import { ReportSection } from '@/components/report/ReportSection'
import { Button } from '@/components/ui/Button'
import { Download } from 'lucide-react'
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
        <div className="min-h-screen bg-[#FAFAFA] py-20">
            <div className="max-w-4xl mx-auto px-6 space-y-16">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div className="space-y-1">
                        <h1 className="text-3xl font-bold text-[#111111]">Startup Diagnostic Report</h1>
                        <p className="text-[#6B6B6B]">Generated on {new Date(report.createdAt).toLocaleDateString()}</p>
                    </div>
                    <Button variant="outline" className="gap-2">
                        <Download size={20} /> Export PDF
                    </Button>
                </div>
                {/* Verdict Block */}
                <VerdictBlock
                    verdict={report.verdict}
                    reason={report.verdictReason}
                />

                {/* Report Sections */}
                <div className="space-y-12">
                    <ReportSection
                        title="Why this verdict was issued"
                        content={sections.whyVerdict}
                    />

                    <ReportSection
                        title="What buyers will actually hear"
                        content={sections.buyerPerspective}
                    />

                    <ReportSection
                        title="Primary objection"
                        content={sections.primaryObjection}
                    />

                    <ReportSection
                        title="Trust gap"
                        content={sections.trustGap}
                    />

                    <ReportSection
                        title="One fix"
                        content={sections.fix}
                    />

                    <ReportSection
                        title="Next action"
                        content={sections.nextAction}
                    />
                </div>

                <div className="pt-12 border-t border-[#E5E5E5] text-center">
                    <p className="text-[#6B6B6B] text-sm uppercase tracking-widest font-bold">
                        End of Diagnostic Report
                    </p>
                </div>
            </div>
        </div>
    )
}
