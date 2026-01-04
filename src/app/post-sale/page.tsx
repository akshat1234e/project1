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
import { ScrollReveal } from "@/components/animations/ScrollReveal";
import { ArrowRight, ArrowLeft, BarChart3, MessageSquare, ShieldAlert, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/components/ui/Toaster";

const postSaleSchema = z.object({
    salesPromise: z.object({
        fasterExecution: z.boolean(),
        costReduction: z.boolean(),
        exactLanguage: z.string().min(50, "Minimum 50 words required for context"),
    }),
    usageSignals: z.array(z.string()).min(1, "Select at least one signal"),
    behaviorDescription: z.string().min(10, "Describe customer behavior"),
    customerLanguage: z.string().min(10, "Provide customer snippets"),
    mrr: z.number().min(0),
    topCustomerPercent: z.number().min(0).max(100),
    top3CustomersPercent: z.number().min(0).max(100),
});

type PostSaleFormData = z.infer<typeof postSaleSchema>;

const steps = [
    { id: "promises", title: "Sales Promise Snapshot", icon: <TrendingUp size={24} /> },
    { id: "reality", title: "Customer Reality Signals", icon: <BarChart3 size={24} /> },
    { id: "sentiment", title: "Sentiment Evidence", icon: <MessageSquare size={24} /> },
    { id: "revenue", title: "Revenue Exposure", icon: <ShieldAlert size={24} /> },
];

export default function PostSalePage() {
    const [currentStep, setCurrentStep] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { showToast } = useToast();
    const [assessment, setAssessment] = useState(null);

    const { register, handleSubmit, trigger, formState: { errors }, watch, setValue } = useForm<PostSaleFormData>({
        resolver: zodResolver(postSaleSchema),
        defaultValues: {
            salesPromise: {
                fasterExecution: false,
                costReduction: false,
            },
            usageSignals: [],
        }
    });

    const nextStep = async () => {
        const fieldsByStep: any[][] = [
            ["salesPromise.fasterExecution", "salesPromise.costReduction", "salesPromise.exactLanguage"],
            ["usageSignals", "behaviorDescription"],
            ["customerLanguage"],
            ["mrr", "topCustomerPercent", "top3CustomersPercent"],
        ];
        const isValid = await trigger(fieldsByStep[currentStep]);
        if (isValid) setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
    };

    const onSubmit = async (data: PostSaleFormData) => {
        setIsSubmitting(true);
        try {
            const res = await fetch('/api/post-sale/analyze', {
                method: 'POST',
                body: JSON.stringify(data)
            });
            const result = await res.json();
            if (result.success) {
                showToast("Analysis complete. Generating snapshot...", "success");
                setAssessment(result);
            } else {
                showToast(result.error || "Analysis failed", "error");
            }
        } catch (error) {
            console.error(error);
            showToast("Something went wrong", "error");
        } finally {
            setIsSubmitting(false);
        }
    };

    const usageOptions = [
        'Active usage',
        'Partial usage',
        'Feature avoidance',
        'Silence / inactivity',
        'Support dependency',
        'Escalations / complaints'
    ];

    const toggleUsageSignal = (signal: string) => {
        const current = watch("usageSignals");
        if (current.includes(signal)) {
            setValue("usageSignals", current.filter((i) => i !== signal));
        } else {
            setValue("usageSignals", [...current, signal]);
        }
    };

    if (assessment) {
        return <div className="p-20 text-center">Assessment View Implementation Pending</div>;
    }

    return (
        <div className="min-h-screen bg-[#FAFAFA] py-20">
            <div className="max-w-3xl mx-auto px-6">
                <div className="mb-16 space-y-4">
                    <div className="flex items-center justify-between">
                        <h1 className="text-4xl font-bold text-[#111111]">Post-Sale Reality Analysis</h1>
                        <span className="text-sm font-bold text-[#6B6B6B] uppercase tracking-widest">
                            Step {currentStep + 1} / {steps.length}
                        </span>
                    </div>
                    <div className="h-1 w-full bg-[#E5E5E5]">
                        <motion.div
                            className="h-full bg-[#111111]"
                            initial={{ width: "0%" }}
                            animate={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
                            transition={{ duration: 0.5, ease: "circOut" }}
                        />
                    </div>
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
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <Checkbox
                                            label="Faster execution"
                                            checked={watch("salesPromise.fasterExecution")}
                                            onChange={(e) => setValue("salesPromise.fasterExecution", e.target.checked)}
                                        />
                                        <Checkbox
                                            label="Cost reduction"
                                            checked={watch("salesPromise.costReduction")}
                                            onChange={(e) => setValue("salesPromise.costReduction", e.target.checked)}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-[#111111] uppercase tracking-widest">Exact Sales Language</label>
                                        <Textarea
                                            {...register("salesPromise.exactLanguage")}
                                            placeholder="Paste the exact language used in sales/demo (min 50 words)..."
                                            className="min-h-[200px]"
                                            error={!!errors.salesPromise?.exactLanguage}
                                        />
                                        {errors.salesPromise?.exactLanguage && (
                                            <p className="text-xs text-[#7A1E1E] font-bold">{errors.salesPromise.exactLanguage.message}</p>
                                        )}
                                    </div>
                                </div>
                            )}

                            {currentStep === 1 && (
                                <div className="space-y-8">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {usageOptions.map((option) => (
                                            <Checkbox
                                                key={option}
                                                label={option}
                                                checked={watch("usageSignals").includes(option)}
                                                onChange={() => toggleUsageSignal(option)}
                                            />
                                        ))}
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-[#111111] uppercase tracking-widest">Behavior Description</label>
                                        <Textarea
                                            {...register("behaviorDescription")}
                                            placeholder="What are customers actually doing?"
                                            className="min-h-[150px]"
                                        />
                                    </div>
                                </div>
                            )}

                            {currentStep === 2 && (
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-[#111111] uppercase tracking-widest">Customer Language Snippets</label>
                                    <Textarea
                                        {...register("customerLanguage")}
                                        placeholder="Paste 3-5 recent customer snippets (emails, support, Slack)..."
                                        className="min-h-[300px]"
                                    />
                                </div>
                            )}

                            {currentStep === 3 && (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-[#111111] uppercase tracking-widest">Current MRR (₹)</label>
                                        <Input
                                            type="number"
                                            {...register("mrr", { valueAsNumber: true })}
                                            placeholder="e.g. 500000"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-[#111111] uppercase tracking-widest">Top 1 Customer %</label>
                                        <Input
                                            type="number"
                                            {...register("topCustomerPercent", { valueAsNumber: true })}
                                            placeholder="e.g. 25"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-[#111111] uppercase tracking-widest">Top 3 Customers %</label>
                                        <Input
                                            type="number"
                                            {...register("top3CustomersPercent", { valueAsNumber: true })}
                                            placeholder="e.g. 60"
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
                                        {isSubmitting ? "Analyzing..." : "Generate Analysis"}
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
