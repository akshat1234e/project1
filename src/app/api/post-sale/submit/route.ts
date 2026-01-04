import { NextResponse } from "next/server";
import { assessSnapshot, PostSaleSnapshot } from "@/lib/rules/post-sale";
import { supabase } from "@/lib/supabase";

export async function POST(request: Request) {
    try {
        const snapshotData: PostSaleSnapshot = await request.json();

        // 1. Insert Snapshot
        const { data: snapshot, error: snapError } = await supabase
            .from("post_sale_snapshots")
            .insert({
                period: snapshotData.period,
                sales_promise: snapshotData.sales_promise,
                observed_behavior: snapshotData.observed_behavior,
                raw_customer_language: snapshotData.raw_customer_language,
                revenue_context: snapshotData.revenue_context
            })
            .select()
            .single();

        if (snapError) throw snapError;

        // 2. Run Logic
        const assessment = assessSnapshot({ ...snapshotData, id: snapshot.id });

        // 3. Insert Assessment
        const { data: finalAssessment, error: assessError } = await supabase
            .from("post_sale_assessments")
            .insert({ ...assessment, snapshot_id: snapshot.id })
            .select()
            .single();

        if (assessError) throw assessError;

        return NextResponse.json({
            success: true,
            id: finalAssessment.id,
            result: assessment
        });
    } catch (error) {
        console.error("Post-sale submission error:", error);
        return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
    }
}
