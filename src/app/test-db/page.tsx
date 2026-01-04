"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function TestSupabase() {
    const [status, setStatus] = useState<string>("Testing...");

    useEffect(() => {
        async function test() {
            try {
                const { data, error } = await supabase.from("submissions").select("id").limit(1);
                if (error) {
                    setStatus("Error: " + error.message);
                } else {
                    setStatus("Connected successfully! Found " + data.length + " submissions.");
                }
            } catch (e: any) {
                setStatus("Failed to connect: " + e.message);
            }
        }
        test();
    }, []);

    return (
        <div className="flex min-h-screen items-center justify-center bg-background text-foreground">
            <div className="text-center">
                <h1 className="text-4xl font-bold mb-4">Supabase Connection Test</h1>
                <p className="text-xl">{status}</p>
            </div>
        </div>
    );
}
