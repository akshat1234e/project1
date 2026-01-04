export type BeliefState = "Confidence" | "Caution" | "Doubt" | "Regret";
export type ChurnRisk = "Low" | "Medium" | "High";
export type RevenueClassification = "Stable" | "At-risk" | "Illusory";

// 5. PostSaleSnapshot (Reality capture)
export interface PostSaleSnapshot {
    id?: string;
    company_id?: string;
    period: "30_days" | "60_days" | "90_days";
    sales_promise: {
        promised_outcomes: string[];
        original_language: string;
    };
    observed_behavior: {
        usage_pattern: "full" | "partial" | "none";
        support_dependency: boolean;
        silence_detected: boolean;
    };
    raw_customer_language: string[];
    revenue_context: {
        mrr: number;
        top_3_concentration_pct: number;
        renewals_due: number;
    };
    created_at?: string;
}

// 6. PostSaleAssessment (Revenue & churn judgment)
export interface PostSaleAssessment {
    id?: string;
    snapshot_id: string;
    assessed_at?: string;
    expectation_reality_delta: string;
    sentiment_state: {
        confidence: number;
        caution: number;
        doubt: number;
        regret: number;
    };
    churn_risk: ChurnRisk;
    revenue_classification: {
        stable: number;
        at_risk: number;
        illusory: number;
    };
    single_recommendation: string;
}

// Legacy types for compatibility during refactor
export type PostSaleData = PostSaleSnapshot;
export type PostSaleResult = PostSaleAssessment;

export function assessSnapshot(snapshot: PostSaleSnapshot): PostSaleAssessment {
    const delta = snapshot.observed_behavior.support_dependency ? "High support dependency vs promised low effort." : "Aligned with expectations.";

    const sentiment = {
        confidence: snapshot.observed_behavior.usage_pattern === "full" ? 5 : 2,
        caution: snapshot.observed_behavior.support_dependency ? 3 : 1,
        doubt: snapshot.observed_behavior.silence_detected ? 4 : 0,
        regret: snapshot.observed_behavior.usage_pattern === "none" ? 5 : 0,
    };

    let risk: ChurnRisk = "Low";
    if (sentiment.regret > 0 || sentiment.doubt > 2) risk = "High";
    else if (sentiment.caution > 2) risk = "Medium";

    const mrr = snapshot.revenue_context.mrr;
    const revenue_classification = {
        stable: risk === "Low" ? mrr : risk === "Medium" ? mrr * 0.7 : mrr * 0.3,
        at_risk: risk === "Medium" ? mrr * 0.3 : risk === "High" ? mrr * 0.4 : 0,
        illusory: risk === "High" ? mrr * 0.3 : 0,
    };

    return {
        snapshot_id: snapshot.id || "temp-id",
        expectation_reality_delta: delta,
        sentiment_state: sentiment,
        churn_risk: risk,
        revenue_classification,
        single_recommendation: risk === "High" ? "Immediate executive intervention required." : risk === "Medium" ? "Schedule a success review." : "Monitor for expansion opportunities.",
    };
}

// Legacy wrapper for compatibility
export function analyzePostSale(data: PostSaleData): PostSaleResult {
    return assessSnapshot(data);
}
