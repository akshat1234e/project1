import { evaluateDiagnostic } from "@/lib/rules/verdict";
import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function POST(req: Request) {
    try {
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

        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const formData = await req.json();
        const { verdict, reason } = evaluateDiagnostic(formData);

        // 1. Create Payment (Mock)
        const { data: payment, error: paymentError } = await supabase
            .from("payments")
            .insert({
                userId: user.id,
                amount: 499900,
                status: "COMPLETED",
                razorpayOrderId: `order_${Date.now()}`,
            })
            .select()
            .single();

        if (paymentError) throw paymentError;

        // 2. Create Submission
        const { data: submission, error: submissionError } = await supabase
            .from("submissions")
            .insert({
                userId: user.id,
                paymentId: payment.id,
                formData: formData,
                status: "COMPLETED",
                processedAt: new Date().toISOString(),
            })
            .select()
            .single();

        if (submissionError) throw submissionError;

        // 3. Create Report
        const { data: report, error: reportError } = await supabase
            .from("reports")
            .insert({
                submissionId: submission.id,
                userId: user.id,
                verdict: verdict,
                verdictReason: reason,
                sections: {
                    whyVerdict: reason,
                    buyerPerspective: "The buyer is looking for immediate relief from the pain described.",
                    primaryObjection: "The primary objection will be the lack of trust proof.",
                    trustGap: "You need to bridge the gap between your promise and your evidence.",
                    fix: "Focus on gathering one strong case study.",
                    nextAction: "Re-validate with 3 more potential buyers.",
                },
                ruleScore: {
                    clarity: 8,
                    pain: 7,
                    trust: 4
                },
                aiGenerated: {
                    summary: "AI analysis suggests a strong core idea with execution gaps."
                }
            })
            .select()
            .single();

        if (reportError) throw reportError;

        return NextResponse.json({ success: true, id: report.id });
    } catch (error: any) {
        console.error("Submission error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
