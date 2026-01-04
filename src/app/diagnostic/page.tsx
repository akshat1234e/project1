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
});

type FormData = z.infer<typeof formSchema>;

const steps = [
    { id: "context", title: "Founder Context", icon: <Briefcase size={24} /> },
    { id: "buyer", title: "Buyer Reality", icon: <Users size={24} /> },
    { id: "pain", title: "Pain & Workflow", icon: <Zap size={24} /> },
    { id: "alternatives", title: "Alternatives", icon: <Search size={24} /> },
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
            proof_type: [],
            inaction_cost_type: [],
        }
    });

    const nextStep = async () => {
        const fieldsByStep: any[][] = [
            ["company_name", "stage", "domain"],
            ["buyer_role", "budget_authority", "buyer_justification"],
            ["workflow", "pain_frequency", "pain_trigger"],
            ["current_solution", "why_good_enough"],
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

    const toggleArrayItem = (field: "proof_type" | "inaction_cost_type", value: string) => {
        const current = watch(field) as string[];
        if (current.includes(value)) {
            setValue(field, current.filter((i) => i !== value));
        } else {
            setValue(field, [...current, value]);
        }
    };

    return (
        <div className="min-h-screen bg-[#FAFAFA] py-20">
            <div className="max-w-3xl mx-auto px-6">
                <div className="mb-16 space-y-4">
                    <div className="flex items-center justify-between">
                        <h1 className="text-4xl font-bold text-[#111111]">Intake Diagnostic</h1>
                        <span className="text-sm font-bold text-[#6B6B6B] uppercase tracking-widest">
                            Step {currentStep + 1} / {steps.length}
                        </span>
                    </div>
                    <ProgressBar current={currentStep + 1} total={steps.length} />
                </div>

                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentStep}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                    >
                        <div className="flex items-center gap-4 mb-12">
                            <div className="h-12 w-12 bg-[#111111] text-white flex items-center justify-center">
                                {steps[currentStep].icon}
                            </div>
                            <h2 className="text-2xl font-bold text-[#111111] uppercase tracking-tight">
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
                                            <label className="text-sm font-bold text-[#111111] uppercase tracking-widest">Stage</label>
                                            <select {...register("stage")} className="flex h-[48px] w-full border border-[#E5E5E5] bg-[#FAFAFA] px-4 py-2 text-base focus:border-[#111111] focus:outline-none rounded-none">
                                                <option value="pre-seed">Pre-seed</option>
                                                <option value="seed">Seed</option>
                                                <option value="series-a">Series A</option>
                                            </select>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-[#111111] uppercase tracking-widest">Domain</label>
                                            <select {...register("domain")} className="flex h-[48px] w-full border border-[#E5E5E5] bg-[#FAFAFA] px-4 py-2 text-base focus:border-[#111111] focus:outline-none rounded-none">
                                                <option value="ai">AI / Machine Learning</option>
                                                <option value="fintech">Fintech</option>
                                                <option value="saas">SaaS</option>
                                                <option value="other">Other</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {currentStep === 1 && (
                                <div className="space-y-8">
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-[#111111] uppercase tracking-widest">Buyer Role</label>
                                        <Input {...register("buyer_role")} placeholder="e.g. VP Engineering, CFO" />
                                    </div>
                                    <Checkbox
                                        label="They have direct budget authority for this purchase"
                                        checked={watch("budget_authority")}
                                        onChange={(e) => setValue("budget_authority", e.target.checked)}
                                    />
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-[#111111] uppercase tracking-widest">Buyer Justification</label>
                                        <Textarea
                                            {...register("buyer_justification")}
                                            placeholder="Why would they pay for this right now?"
                                            className="min-h-[150px]"
                                        />
                                    </div>
                                </div>
                            )}

                            {currentStep === 2 && (
                                <div className="space-y-8">
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-[#111111] uppercase tracking-widest">Workflow Steps</label>
                                        <Textarea
                                            {...register("workflow")}
                                            placeholder="Step 1: ...&#10;Step 2: ..."
                                            className="min-h-[150px]"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-[#111111] uppercase tracking-widest">Pain Frequency</label>
                                        <select {...register("pain_frequency")} className="flex h-[48px] w-full border border-[#E5E5E5] bg-[#FAFAFA] px-4 py-2 text-base focus:border-[#111111] focus:outline-none rounded-none">
                                            <option value="daily">Daily</option>
                                            <option value="weekly">Weekly</option>
                                            <option value="monthly">Monthly</option>
                                            <option value="rarely">Rarely</option>
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-[#111111] uppercase tracking-widest">Trigger Description</label>
                                        <Textarea
                                            {...register("pain_trigger")}
                                            placeholder="What exactly triggers this pain?"
                                            className="min-h-[100px]"
                                        />
                                    </div>
                                </div>
                            )}

                            {currentStep === 3 && (
                                <div className="space-y-8">
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-[#111111] uppercase tracking-widest">Current Solution</label>
                                        <select {...register("current_solution")} className="flex h-[48px] w-full border border-[#E5E5E5] bg-[#FAFAFA] px-4 py-2 text-base focus:border-[#111111] focus:outline-none rounded-none">
                                            <option value="excel">Excel / Spreadsheets</option>
                                            <option value="tool">Existing Tool</option>
                                            <option value="manual">Manual Process</option>
                                            <option value="none">None</option>
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-[#111111] uppercase tracking-widest">Why is it 'good enough'?</label>
                                        <Textarea
                                            {...register("why_good_enough")}
                                            placeholder="Why haven't they switched yet?"
                                            className="min-h-[150px]"
                                        />
                                    </div>
                                </div>
                            )}

                            {currentStep === 4 && (
                                <div className="space-y-8">
                                    <div className="space-y-4">
                                        <label className="text-sm font-bold text-[#111111] uppercase tracking-widest">Trust Proof Type</label>
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
                                        <label className="text-sm font-bold text-[#111111] uppercase tracking-widest">Evidence Links</label>
                                        <Input {...register("evidence_links")} placeholder="https://... (one per line)" />
                                    </div>
                                    <div className="space-y-4">
                                        <label className="text-sm font-bold text-[#111111] uppercase tracking-widest">Inaction Cost Type</label>
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
                                        <label className="text-sm font-bold text-[#111111] uppercase tracking-widest">Inaction Description</label>
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
