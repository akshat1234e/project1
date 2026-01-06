import { classifySentiment, calculateChurnRisk, classifyRevenue } from "@/lib/rules/verdict";
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

        // Fetch user profile for organization_id
        const { data: profile } = await supabase
            .from("profiles")
            .select("organization_id")
            .eq("id", user.id)
            .single();

        const data = await req.json();

        // 1. Classify Sentiment
        const sentimentState = await classifySentiment(data.customerLanguage);

        // 2. Calculate Churn Risk
        const churnRisk = calculateChurnRisk({
            sentimentState,
            usageSignals: data.usageSignals,
            revenueConcentration: {
                top1: data.topCustomerPercent,
                top3: data.top3CustomersPercent
            }
        });

        // 3. Classify Revenue
        const revenue = classifyRevenue({
            mrr: data.mrr,
            sentimentState,
            churnRisk
        });

        // 4. Create Snapshot
        const { data: snapshot, error: snapshotError } = await supabase
            .from("post_sale_snapshots")
            .insert({
                userId: user.id,
                organization_id: profile?.organization_id,
                companyName: user.user_metadata?.company_name || "Unknown",
                salesPromise: data.salesPromise,
                usageSignals: data.usageSignals,
                sentimentData: data.customerLanguage.split("\n"),
                mrr: data.mrr,
                customerCount: 10,
                renewalsIn90: 2,
                revenueConcentration: {
                    top1: data.topCustomerPercent,
                    top3: data.top3CustomersPercent
                },
                status: "COMPLETED",
                processedAt: new Date().toISOString(),
            })
            .select()
            .single();

        if (snapshotError) throw snapshotError;

        // 5. Create Assessment
        const { data: assessment, error: assessmentError } = await supabase
            .from("post_sale_assessments")
            .insert({
                snapshotId: snapshot.id,
                expectationDelta: {
                    findings: [
                        `Detected ${sentimentState} sentiment in customer language.`,
                        `Churn risk is ${churnRisk} based on usage signals and concentration.`,
                        `₹${revenue.atRisk.toLocaleString()} of your MRR is currently at risk.`
                    ]
                },
                sentimentState,
                churnRisk,
                revenueClassification: revenue,
                revenueAtRisk: revenue.atRisk,
                recommendation: "Schedule a review with your top customer immediately. Address the specific pain points mentioned in the sentiment analysis. Diversify your revenue to reduce concentration risk."
            })
            .select()
            .single();

        if (assessmentError) throw assessmentError;

        return NextResponse.json({ success: true, id: assessment.id });
    } catch (error: any) {
        console.error("Post-sale analysis error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
