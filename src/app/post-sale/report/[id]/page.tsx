"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Card } from "@/components/ui/Card";
import { ScrollReveal } from "@/components/animations/ScrollReveal";
import { PostSaleResult } from "@/lib/rules/post-sale";

export default function PostSaleReportPage({ params }: { params: { id: string } }) {
    const [result, setResult] = useState<PostSaleResult | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchResult() {
            const { data, error } = await supabase
                .from("post_sale_assessments")
                .select("*")
                .eq("id", params.id)
                .single();

            if (data) {
                setResult(data as PostSaleResult);
            }
            setLoading(false);
        }
        fetchResult();
    }, [params.id]);

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <div className="text-2xl font-medium animate-pulse">Analyzing Revenue Durability...</div>
            </div>
        );
    }

    if (!result) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <div className="text-2xl font-medium">Memo not found.</div>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen flex-col items-center px-6 py-20">
            <div className="w-full max-w-3xl space-y-16">
                <ScrollReveal>
                    <div className="border-b border-foreground/10 pb-8">
                        <span className="text-sm font-medium uppercase tracking-widest text-muted">Confidential Decision Memo</span>
                        <h1 className="mt-4 text-4xl font-semibold">Post-Sale Reality & Revenue Risk Report</h1>
                        <p className="mt-2 text-muted">Period: Last 60 Days</p>
                    </div>
                </ScrollReveal>

                {/* Executive Summary */}
                <ScrollReveal delay={0.1}>
                    <section className="space-y-4">
                        <h2 className="text-sm font-medium uppercase tracking-widest text-muted">1. Expectation vs Reality Delta</h2>
                        <p className="text-2xl font-medium leading-tight">
                            {result.expectation_reality_delta}
                        </p>
                    </section>
                </ScrollReveal>

                {/* Sentiment State */}
                <ScrollReveal delay={0.3}>
                    <section className="space-y-6">
                        <h2 className="text-sm font-medium uppercase tracking-widest text-muted">2. Sentiment State</h2>
                        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                            <div className="border border-foreground/5 p-4 text-center">
                                <div className="text-3xl font-bold">{result.sentiment_state.confidence}</div>
                                <div className="text-xs uppercase tracking-widest text-muted">Confidence</div>
                            </div>
                            <div className="border border-foreground/5 p-4 text-center">
                                <div className="text-3xl font-bold">{result.sentiment_state.caution}</div>
                                <div className="text-xs uppercase tracking-widest text-muted">Caution</div>
                            </div>
                            <div className="border border-foreground/5 p-4 text-center">
                                <div className="text-3xl font-bold">{result.sentiment_state.doubt}</div>
                                <div className="text-xs uppercase tracking-widest text-muted">Doubt</div>
                            </div>
                            <div className="border border-foreground/5 p-4 text-center">
                                <div className="text-3xl font-bold">{result.sentiment_state.regret}</div>
                                <div className="text-xs uppercase tracking-widest text-muted">Regret</div>
                            </div>
                        </div>
                    </section>
                </ScrollReveal>

                {/* Churn Risk */}
                <ScrollReveal delay={0.4}>
                    <section className="space-y-6">
                        <h2 className="text-sm font-medium uppercase tracking-widest text-muted">3. Churn Risk Summary</h2>
                        <Card className={cn("border-2", result.churn_risk === "High" ? "border-verdict-kill" : result.churn_risk === "Medium" ? "border-verdict-fix" : "border-verdict-proceed")}>
                            <div className="text-xl font-semibold uppercase tracking-widest">{result.churn_risk} RISK</div>
                            <p className="mt-2 text-lg">The current risk profile is based on observed usage patterns and support dependency.</p>
                        </Card>
                    </section>
                </ScrollReveal>

                {/* Revenue Classification */}
                <ScrollReveal delay={0.5}>
                    <section className="space-y-6">
                        <h2 className="text-sm font-medium uppercase tracking-widest text-muted">4. Revenue Classification</h2>
                        <div className="grid gap-8 md:grid-cols-3">
                            <div className="space-y-2">
                                <div className="text-sm text-muted">Stable</div>
                                <div className="text-3xl font-bold">₹{result.revenue_classification.stable.toLocaleString()}</div>
                            </div>
                            <div className="space-y-2">
                                <div className="text-sm text-muted">At Risk</div>
                                <div className="text-3xl font-bold text-verdict-fix">₹{result.revenue_classification.at_risk.toLocaleString()}</div>
                            </div>
                            <div className="space-y-2">
                                <div className="text-sm text-muted">Illusory</div>
                                <div className="text-3xl font-bold text-verdict-kill">₹{result.revenue_classification.illusory.toLocaleString()}</div>
                            </div>
                        </div>
                    </section>
                </ScrollReveal>

                {/* Recommendation */}
                <ScrollReveal delay={0.6}>
                    <section className="space-y-6 border-t border-foreground/5 pt-12">
                        <h2 className="text-sm font-medium uppercase tracking-widest text-muted">5. Single Recommendation</h2>
                        <p className="text-3xl font-semibold leading-tight">
                            {result.single_recommendation}
                        </p>
                    </section>
                </ScrollReveal>

                <ScrollReveal delay={0.7} className="pt-12 text-center">
                    <p className="text-sm text-muted">This report is a closed truth loop assessment. CFO-grade value.</p>
                </ScrollReveal>
            </div>
        </div>
    );
}

function cn(...inputs: any[]) {
    return inputs.filter(Boolean).join(" ");
}
