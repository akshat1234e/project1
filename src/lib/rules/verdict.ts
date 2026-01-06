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
    // VC-Level Fields
    team_experience: string;
    technical_founder: boolean;
    team_track_record: string;
    market_size_tam: string;
    market_tailwinds: string;
    moat_type: string[];
    moat_description: string;
    unit_economics_ltv: string;
    unit_economics_cac: string;
}

export interface DiagnosticResult {
    verdict: Verdict;
    reason: string;
    score: number;
    flags: string[];
    breakdown: {
        team: number;
        market: number;
        product: number;
        traction: number;
    };
}

export function evaluateDiagnostic(data: SubmissionData): DiagnosticResult {
    const flags: string[] = [];

    // 1. Team Score (35%)
    let teamScore = 0;
    if (data.technical_founder) teamScore += 15;
    else flags.push("No technical co-founder detected");

    if (data.team_experience.length > 50) teamScore += 10;
    if (data.team_track_record.length > 50) teamScore += 10;

    // 2. Market Score (25%)
    let marketScore = 0;
    const tamLower = data.market_size_tam.toLowerCase();
    if (tamLower.includes("b") || tamLower.includes("billion")) marketScore += 15;
    else if (tamLower.includes("m") || tamLower.includes("million")) marketScore += 10;
    else flags.push("Market size may be too small for VC scale");

    if (data.market_tailwinds.length > 50) marketScore += 10;

    // 3. Product/Buyer Score (20%)
    let productScore = 0;
    if (data.budget_authority) productScore += 10;
    else flags.push("Selling to non-budget holders");

    if (["daily", "weekly"].includes(data.pain_frequency)) productScore += 10;
    else flags.push("Low pain frequency");

    // 4. Traction/Trust Score (20%)
    let tractionScore = 0;
    if (data.proof_type.length > 0) tractionScore += 10;
    if (data.inaction_cost_type.length > 0) tractionScore += 10;

    // Unit Economics Check
    const ltv = parseFloat(data.unit_economics_ltv.replace(/[^0-9.]/g, ''));
    const cac = parseFloat(data.unit_economics_cac.replace(/[^0-9.]/g, ''));
    if (!isNaN(ltv) && !isNaN(cac)) {
        if (ltv / cac < 3) flags.push("Weak unit economics (LTV/CAC < 3)");
    }

    const totalScore = teamScore + marketScore + productScore + tractionScore;

    let verdict: Verdict = "PROCEED";
    let reason = "This is a high-conviction opportunity with strong VC-level fundamentals.";

    if (totalScore < 40 || flags.length >= 3) {
        verdict = "KILL";
        reason = "Fundamental weaknesses in team, market, or unit economics make this a high-risk venture.";
    } else if (totalScore < 70 || flags.length >= 1) {
        verdict = "FIX";
        reason = "Promising signs, but critical gaps in defensibility or trust need to be addressed before scaling.";
    }

    return {
        verdict,
        reason,
        score: totalScore,
        flags,
        breakdown: {
            team: teamScore,
            market: marketScore,
            product: productScore,
            traction: tractionScore,
        }
    };
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
