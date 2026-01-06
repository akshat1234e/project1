"use client";

import * as React from "react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Checkbox } from "@/components/ui/Checkbox";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { ArrowRight, ArrowLeft, Briefcase, Users, Zap, ShieldAlert, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/components/ui/Toaster";

const formSchema = z.object({
    company_name: z.string().min(2, "Company name is required"),
    stage: z.string().min(1, "Stage is required"),
    domain: z.string().min(1, "Domain is required"),
    buyer_role: z.string().min(2, "Role is required"),
    budget_authority: z.boolean(),
    buyer_justification: z.string().min(10, "Justification is required"),
    workflow: z.string().min(10, "Describe the workflow steps"),
    pain_frequency: z.string().min(1, "Frequency is required"),
    pain_trigger: z.string().min(10, "Describe the trigger"),
    current_solution: z.string().min(1, "Current solution is required"),
    why_good_enough: z.string().min(10, "Explain why it's good enough"),
    proof_type: z.array(z.string()).min(1, "Select at least one"),
    evidence_links: z.string(),
    inaction_cost_type: z.array(z.string()).min(1, "Select at least one"),
    inaction_description: z.string().min(10, "Describe the cost of inaction"),
    // Team Section
    team_experience: z.string().min(10, "Describe your team's experience"),
    technical_founder: z.boolean(),
    team_track_record: z.string().min(10, "Describe your team's track record"),
    // Market Section
    market_size_tam: z.string().min(1, "TAM is required"),
    market_tailwinds: z.string().min(10, "Describe the market tailwinds"),
    // Defensibility Section
    moat_type: z.array(z.string()).min(1, "Select at least one moat type"),
    moat_description: z.string().min(10, "Describe your defensibility"),
    // Unit Economics Section
    unit_economics_ltv: z.string().min(1, "LTV is required"),
    unit_economics_cac: z.string().min(1, "CAC is required"),
});

type FormData = z.infer<typeof formSchema>;

const steps = [
    { id: "context", title: "Founder Context", icon: <Briefcase size={24} /> },
    { id: "team", title: "Team Strength", icon: <Users size={24} /> },
    { id: "market", title: "Market Opportunity", icon: <Search size={24} /> },
    { id: "buyer", title: "Buyer Reality", icon: <Users size={24} /> },
    { id: "pain", title: "Pain & Workflow", icon: <Zap size={24} /> },
    { id: "alternatives", title: "Alternatives", icon: <Search size={24} /> },
    { id: "defensibility", title: "Defensibility", icon: <ShieldAlert size={24} /> },
    { id: "economics", title: "Unit Economics", icon: <Zap size={24} /> },
    { id: "proof", title: "Trust & Inaction", icon: <ShieldAlert size={24} /> },
];

export default function DiagnosticPage() {
    const [currentStep, setCurrentStep] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { showToast } = useToast();

    const { register, handleSubmit, trigger, watch, setValue, formState: { errors } } = useForm<FormData>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            budget_authority: false,
            technical_founder: false,
            proof_type: [],
            inaction_cost_type: [],
            moat_type: [],
        }
    });

    const nextStep = async () => {
        const fieldsByStep: any[][] = [
            ["company_name", "stage", "domain"],
            ["team_experience", "technical_founder", "team_track_record"],
            ["market_size_tam", "market_tailwinds"],
            ["buyer_role", "budget_authority", "buyer_justification"],
            ["workflow", "pain_frequency", "pain_trigger"],
            ["current_solution", "why_good_enough"],
            ["moat_type", "moat_description"],
            ["unit_economics_ltv", "unit_economics_cac"],
            ["proof_type", "evidence_links", "inaction_cost_type", "inaction_description"],
        ];
        const isValid = await trigger(fieldsByStep[currentStep]);
        if (isValid) setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
    };

    const onSubmit = async (data: FormData) => {
        setIsSubmitting(true);
        try {
            const response = await fetch("/api/submit", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });

            const result = await response.json();
            if (result.success) {
                showToast("Diagnostic complete. Generating report...", "success");
                window.location.href = `/report/${result.id}`;
            } else {
                showToast(result.error || "Something went wrong. Please try again.", "error");
            }
        } catch (error) {
            console.error("Submission error:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const toggleArrayItem = (field: "proof_type" | "inaction_cost_type" | "moat_type", value: string) => {
        const current = watch(field) as string[];
        if (current.includes(value)) {
            setValue(field, current.filter((i) => i !== value));
        } else {
            setValue(field, [...current, value]);
        }
    };

    return (
        <div className="min-h-screen bg-background py-20 relative overflow-hidden">
            {/* Ambient Background Glows */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-accent/10 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-accent-secondary/10 rounded-full blur-[120px] pointer-events-none" />

            <div className="max-w-3xl mx-auto px-6 relative z-10">
                <div className="mb-16 space-y-4">
                    <div className="flex items-center justify-between">
                        <h1 className="text-4xl font-black text-white tracking-tighter text-glow">
                            Intake Diagnostic
                        </h1>
                        <span className="text-xs font-bold text-accent uppercase tracking-[0.3em]">
                            Step {currentStep + 1} / {steps.length}
                        </span>
                    </div>
                    <ProgressBar current={currentStep + 1} total={steps.length} />
                </div>

                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentStep}
                        initial={{ opacity: 0, x: 20, filter: "blur(10px)" }}
                        animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                        exit={{ opacity: 0, x: -20, filter: "blur(10px)" }}
                        transition={{ duration: 0.4, ease: "circOut" }}
                        className="glass p-12 border-glow"
                    >
                        <div className="flex items-center gap-6 mb-12">
                            <div className="h-14 w-14 bg-accent text-background flex items-center justify-center shadow-[0_0_30px_rgba(0,242,255,0.3)]">
                                {steps[currentStep].icon}
                            </div>
                            <h2 className="text-2xl font-black text-white uppercase tracking-tight">
                                {steps[currentStep].title}
                            </h2>
                        </div>

                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-12">
                            {currentStep === 0 && (
                                <div className="space-y-8">
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-[#111111] uppercase tracking-widest">Company Name</label>
                                        <Input {...register("company_name")} placeholder="e.g. Acme AI" />
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-accent uppercase tracking-[0.2em]">Stage</label>
                                            <select {...register("stage")} className="flex h-[48px] w-full border border-white/10 bg-white/5 px-4 py-2 text-base text-white focus:border-accent focus:outline-none rounded-none backdrop-blur-md appearance-none">
                                                <option value="pre-seed" className="bg-background">Pre-seed</option>
                                                <option value="seed" className="bg-background">Seed</option>
                                                <option value="series-a" className="bg-background">Series A</option>
                                            </select>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-accent uppercase tracking-[0.2em]">Domain</label>
                                            <select {...register("domain")} className="flex h-[48px] w-full border border-white/10 bg-white/5 px-4 py-2 text-base text-white focus:border-accent focus:outline-none rounded-none backdrop-blur-md appearance-none">
                                                <option value="ai" className="bg-background">AI / Machine Learning</option>
                                                <option value="fintech" className="bg-background">Fintech</option>
                                                <option value="saas" className="bg-background">SaaS</option>
                                                <option value="other" className="bg-background">Other</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {currentStep === 1 && (
                                <div className="space-y-8">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-accent uppercase tracking-[0.2em]">Team Experience</label>
                                        <Textarea
                                            {...register("team_experience")}
                                            placeholder="What makes your team uniquely qualified to solve this?"
                                            className="min-h-[120px]"
                                        />
                                    </div>
                                    <Checkbox
                                        label="We have a technical co-founder / internal engineering team"
                                        checked={watch("technical_founder")}
                                        onChange={(e) => setValue("technical_founder", e.target.checked)}
                                    />
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-accent uppercase tracking-[0.2em]">Team Track Record</label>
                                        <Textarea
                                            {...register("team_track_record")}
                                            placeholder="Previous exits, relevant industry experience, or notable achievements."
                                            className="min-h-[120px]"
                                        />
                                    </div>
                                </div>
                            )}

                            {currentStep === 2 && (
                                <div className="space-y-8">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-accent uppercase tracking-[0.2em]">Market Size (TAM)</label>
                                        <Input {...register("market_size_tam")} placeholder="e.g. $10B+, 50M potential users" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-accent uppercase tracking-[0.2em]">Market Tailwinds</label>
                                        <Textarea
                                            {...register("market_tailwinds")}
                                            placeholder="Why is now the right time? (e.g. regulatory changes, AI shifts)"
                                            className="min-h-[150px]"
                                        />
                                    </div>
                                </div>
                            )}

                            {currentStep === 3 && (
                                <div className="space-y-8">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-accent uppercase tracking-[0.2em]">Buyer Role</label>
                                        <Input {...register("buyer_role")} placeholder="e.g. VP Engineering, CFO" />
                                    </div>
                                    <Checkbox
                                        label="They have direct budget authority for this purchase"
                                        checked={watch("budget_authority")}
                                        onChange={(e) => setValue("budget_authority", e.target.checked)}
                                    />
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-accent uppercase tracking-[0.2em]">Buyer Justification</label>
                                        <Textarea
                                            {...register("buyer_justification")}
                                            placeholder="Why would they pay for this right now?"
                                            className="min-h-[150px]"
                                        />
                                    </div>
                                </div>
                            )}

                            {currentStep === 4 && (
                                <div className="space-y-8">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-accent uppercase tracking-[0.2em]">Workflow Steps</label>
                                        <Textarea
                                            {...register("workflow")}
                                            placeholder="Step 1: ...&#10;Step 2: ..."
                                            className="min-h-[150px]"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-accent uppercase tracking-[0.2em]">Pain Frequency</label>
                                        <select {...register("pain_frequency")} className="flex h-[48px] w-full border border-white/10 bg-white/5 px-4 py-2 text-base text-white focus:border-accent focus:outline-none rounded-none backdrop-blur-md appearance-none">
                                            <option value="daily" className="bg-background">Daily</option>
                                            <option value="weekly" className="bg-background">Weekly</option>
                                            <option value="monthly" className="bg-background">Monthly</option>
                                            <option value="rarely" className="bg-background">Rarely</option>
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-accent uppercase tracking-[0.2em]">Trigger Description</label>
                                        <Textarea
                                            {...register("pain_trigger")}
                                            placeholder="What exactly triggers this pain?"
                                            className="min-h-[100px]"
                                        />
                                    </div>
                                </div>
                            )}

                            {currentStep === 5 && (
                                <div className="space-y-8">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-accent uppercase tracking-[0.2em]">Current Solution</label>
                                        <select {...register("current_solution")} className="flex h-[48px] w-full border border-white/10 bg-white/5 px-4 py-2 text-base text-white focus:border-accent focus:outline-none rounded-none backdrop-blur-md appearance-none">
                                            <option value="excel" className="bg-background">Excel / Spreadsheets</option>
                                            <option value="tool" className="bg-background">Existing Tool</option>
                                            <option value="manual" className="bg-background">Manual Process</option>
                                            <option value="none" className="bg-background">None</option>
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-accent uppercase tracking-[0.2em]">Why is it 'good enough'?</label>
                                        <Textarea
                                            {...register("why_good_enough")}
                                            placeholder="Why haven't they switched yet?"
                                            className="min-h-[150px]"
                                        />
                                    </div>
                                </div>
                            )}

                            {currentStep === 6 && (
                                <div className="space-y-8">
                                    <div className="space-y-4">
                                        <label className="text-[10px] font-black text-accent uppercase tracking-[0.2em]">Moat Type (Defensibility)</label>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {["IP / Patents", "Network Effects", "High Switching Costs", "Economies of Scale", "Proprietary Data"].map((t) => (
                                                <Checkbox
                                                    key={t}
                                                    label={t}
                                                    checked={watch("moat_type").includes(t)}
                                                    onChange={() => toggleArrayItem("moat_type", t)}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-accent uppercase tracking-[0.2em]">Moat Description</label>
                                        <Textarea
                                            {...register("moat_description")}
                                            placeholder="How will you stop competitors from copying you?"
                                            className="min-h-[150px]"
                                        />
                                    </div>
                                </div>
                            )}

                            {currentStep === 7 && (
                                <div className="space-y-8">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-accent uppercase tracking-[0.2em]">Estimated LTV</label>
                                            <Input {...register("unit_economics_ltv")} placeholder="e.g. $5,000" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-accent uppercase tracking-[0.2em]">Estimated CAC</label>
                                            <Input {...register("unit_economics_cac")} placeholder="e.g. $500" />
                                        </div>
                                    </div>
                                    <p className="text-[10px] text-muted tracking-wide uppercase">
                                        VCs look for an LTV/CAC ratio of at least 3:1.
                                    </p>
                                </div>
                            )}

                            {currentStep === 8 && (
                                <div className="space-y-8">
                                    <div className="space-y-4">
                                        <label className="text-[10px] font-black text-accent uppercase tracking-[0.2em]">Trust Proof Type</label>
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                            {["Users", "Revenue", "Domain Experience"].map((t) => (
                                                <Checkbox
                                                    key={t}
                                                    label={t}
                                                    checked={watch("proof_type").includes(t)}
                                                    onChange={() => toggleArrayItem("proof_type", t)}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-accent uppercase tracking-[0.2em]">Evidence Links</label>
                                        <Input {...register("evidence_links")} placeholder="https://... (one per line)" />
                                    </div>
                                    <div className="space-y-4">
                                        <label className="text-[10px] font-black text-accent uppercase tracking-[0.2em]">Inaction Cost Type</label>
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                            {["Financial", "Risk", "Time"].map((t) => (
                                                <Checkbox
                                                    key={t}
                                                    label={t}
                                                    checked={watch("inaction_cost_type").includes(t)}
                                                    onChange={() => toggleArrayItem("inaction_cost_type", t)}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-accent uppercase tracking-[0.2em]">Inaction Description</label>
                                        <Textarea
                                            {...register("inaction_description")}
                                            placeholder="What happens if they do nothing?"
                                            className="min-h-[150px]"
                                        />
                                    </div>
                                </div>
                            )}

                            <div className="flex justify-between pt-12 border-t border-[#E5E5E5]">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setCurrentStep((p) => p - 1)}
                                    className={cn("gap-2", currentStep === 0 && "invisible")}
                                >
                                    <ArrowLeft size={20} /> Back
                                </Button>
                                {currentStep === steps.length - 1 ? (
                                    <Button
                                        type="submit"
                                        size="lg"
                                        className="min-w-[200px]"
                                        disabled={isSubmitting}
                                    >
                                        {isSubmitting ? "Analyzing..." : "Get Verdict"}
                                    </Button>
                                ) : (
                                    <Button
                                        type="button"
                                        size="lg"
                                        onClick={nextStep}
                                        className="min-w-[200px] gap-2"
                                    >
                                        Next Step <ArrowRight size={20} />
                                    </Button>
                                )}
                            </div>
                        </form>
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
}
