export type Verdict = "PROCEED" | "FIX" | "KILL";
export type SentimentState = "CONFIDENCE" | "CAUTION" | "DOUBT" | "REGRET";
export type ChurnRisk = "LOW" | "MEDIUM" | "HIGH";

// ============================================================================
// PRE-SALE DIAGNOSTIC RULES
// ============================================================================

export interface SubmissionData {
    company_name: string;
    stage: string;
    domain: string;
    buyer_role: string;
    budget_authority: boolean;
    buyer_justification: string;
    workflow: string;
    pain_frequency: string;
    pain_trigger: string;
    current_solution: string;
    why_good_enough: string;
    proof_type: string[];
    evidence_links: string;
    inaction_cost_type: string[];
    inaction_description: string;
}

export function evaluateDiagnostic(data: SubmissionData) {
    const flags = {
        hasBudget: data.budget_authority,
        isFrequent: ["daily", "weekly"].includes(data.pain_frequency),
        hasProof: data.proof_type.length > 0,
        hasInactionCost: data.inaction_cost_type.length > 0,
    };

    let verdict: Verdict = "PROCEED";
    let reason = "This is a high-conviction opportunity with clear buyer intent and frequent pain.";

    if (!flags.hasBudget) {
        verdict = "KILL";
        reason = "No budget authority detected. You are selling to someone who cannot sign the check.";
    } else if (!flags.isFrequent) {
        verdict = "KILL";
        reason = "The pain frequency is too low. Buyers rarely pay for 'sometimes' problems.";
    } else if (!flags.hasProof && !flags.hasInactionCost) {
        verdict = "FIX";
        reason = "You have no proof of trust and the cost of inaction is unclear. Buyers will default to 'no'.";
    } else if (!flags.hasProof) {
        verdict = "FIX";
        reason = "Strong pain but weak trust. You need more evidence that you can actually deliver.";
    }

    return { verdict, reason };
}

// ============================================================================
// POST-SALE REALITY RULES
// ============================================================================

export interface PostSaleData {
    salesPromise: {
        fasterExecution: boolean;
        costReduction: boolean;
        exactLanguage: string;
    };
    usageSignals: string[];
    behaviorDescription: string;
    customerLanguage: string;
    mrr: number;
    topCustomerPercent: number;
    top3CustomersPercent: number;
}

export async function classifySentiment(text: string): Promise<SentimentState> {
    // In a real app, this would use AI. For now, we'll use keyword matching.
    const lowerText = text.toLowerCase();
    if (lowerText.includes("love") || lowerText.includes("amazing") || lowerText.includes("essential")) {
        return "CONFIDENCE";
    }
    if (lowerText.includes("expensive") || lowerText.includes("slow") || lowerText.includes("difficult")) {
        return "CAUTION";
    }
    if (lowerText.includes("useless") || lowerText.includes("cancel") || lowerText.includes("stop")) {
        return "REGRET";
    }
    return "DOUBT";
}

export function calculateChurnRisk(data: {
    sentimentState: SentimentState;
    usageSignals: string[];
    revenueConcentration: { top1: number; top3: number };
}): ChurnRisk {
    let riskScore = 0;

    if (data.sentimentState === "REGRET") riskScore += 5;
    if (data.sentimentState === "DOUBT") riskScore += 3;
    if (data.sentimentState === "CAUTION") riskScore += 1;

    if (data.usageSignals.includes("Silence / inactivity")) riskScore += 3;
    if (data.usageSignals.includes("Feature avoidance")) riskScore += 2;
    if (data.usageSignals.includes("Support dependency")) riskScore += 1;

    if (data.revenueConcentration.top1 > 40) riskScore += 2;

    if (riskScore >= 7) return "HIGH";
    if (riskScore >= 4) return "MEDIUM";
    return "LOW";
}

export function classifyRevenue(data: {
    mrr: number;
    sentimentState: SentimentState;
    churnRisk: ChurnRisk;
}) {
    const atRisk = data.churnRisk === "HIGH" ? data.mrr : data.churnRisk === "MEDIUM" ? data.mrr * 0.5 : 0;
    const stable = data.mrr - atRisk;

    return {
        stable,
        atRisk,
        illusory: data.sentimentState === "REGRET" ? data.mrr : 0
    };
}
