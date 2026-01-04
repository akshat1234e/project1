import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { ScrollReveal } from "@/components/animations/ScrollReveal";
import { AlertTriangle, ShieldCheck, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useToast } from "@/components/ui/Toaster";
import { useRouter } from "next/navigation";

export default function PaymentPage() {
    const { showToast } = useToast();
    const router = useRouter();
    const [isProcessing, setIsProcessing] = useState(false);

    const handlePayment = async () => {
        setIsProcessing(true);
        showToast("Initializing secure payment...", "info");

        // Simulate payment processing
        await new Promise(resolve => setTimeout(resolve, 2000));

        showToast("Payment successful!", "success");
        router.push("/account-setup");
    };

    const deliverables = [
        "A clear verdict: PROCEED, FIX, or KILL",
        "The primary reason buyers will say no",
        "The trust gap holding you back",
        "One concrete fix (only one)",
        "A single next action"
    ];

    return (
        <div className="min-h-screen bg-[#FAFAFA] flex flex-col items-center">
            {/* Warning Header */}
            <div className="w-full bg-[#7A1E1E] text-white py-12 px-6">
                <div className="max-w-[800px] mx-auto flex flex-col md:flex-row items-center gap-8">
                    <AlertTriangle size={48} className="shrink-0" />
                    <div className="space-y-2 text-center md:text-left">
                        <h1 className="text-2xl md:text-3xl font-bold uppercase tracking-tight">
                            Non-Reversible Diagnostic Review
                        </h1>
                        <p className="text-lg opacity-90">
                            You are about to submit your idea for professional evaluation.
                            This is not a growth tool. This is a judgment system.
                        </p>
                    </div>
                </div>
            </div>

            <div className="max-w-[800px] w-full px-6 py-12 space-y-12">
                {/* Deliverables */}
                <ScrollReveal>
                    <div className="bg-white border-2 border-[#E5E5E5] p-8 md:p-12 space-y-8">
                        <h2 className="text-2xl font-bold text-[#111111]">What You Will Receive</h2>
                        <div className="space-y-4">
                            {deliverables.map((item, index) => (
                                <div key={index} className="flex items-center gap-6">
                                    <div className="h-8 w-8 bg-[#111111] text-white flex items-center justify-center font-bold shrink-0">
                                        {index + 1}
                                    </div>
                                    <p className="text-lg text-[#111111]">{item}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </ScrollReveal>

                {/* Outcome Warning */}
                <ScrollReveal delay={0.1}>
                    <div className="bg-[#FFF8E1] border-2 border-[#8A5A00] p-8 space-y-4">
                        <div className="flex items-center gap-3 text-[#8A5A00]">
                            <AlertTriangle size={24} />
                            <h3 className="font-bold text-lg uppercase">The outcome may recommend:</h3>
                        </div>
                        <ul className="list-disc list-inside space-y-2 text-[#111111] pl-2">
                            <li>Significant changes to your approach, or</li>
                            <li>That you stop pursuing this idea entirely</li>
                        </ul>
                        <p className="font-bold text-[#111111] pt-2">
                            Proceed only if you want an honest verdict.
                        </p>
                    </div>
                </ScrollReveal>

                {/* Pricing & CTA */}
                <ScrollReveal delay={0.2}>
                    <div className="text-center space-y-8">
                        <div className="space-y-2">
                            <div className="text-5xl font-bold text-[#111111]">₹4,999</div>
                            <p className="text-[#6B6B6B] uppercase tracking-widest text-sm">One-time diagnostic fee</p>
                        </div>

                        <div className="max-w-[600px] mx-auto space-y-4">
                            <Button
                                size="lg"
                                className="w-full h-16 text-xl"
                                onClick={handlePayment}
                                disabled={isProcessing}
                            >
                                {isProcessing ? "Processing..." : "Pay ₹4,999 and Continue"} <ArrowRight className="ml-2" />
                            </Button>
                            <div className="flex items-center justify-center gap-2 text-[#6B6B6B] text-sm">
                                <ShieldCheck size={16} />
                                <span>Secure payment processed by Razorpay (Test Mode)</span>
                            </div>
                        </div>
                    </div>
                </ScrollReveal>
            </div>
        </div>
    );
}
