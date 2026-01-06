import { supabase } from "@/lib/supabase";

export interface Profile {
    id: string;
    full_name: string | null;
    company_name: string | null;
    role: string | null;
    stage: string | null;
    context: string | null;
    organization_id: string | null;
    updated_at: string | null;
}

export async function getProfile(userId: string) {
    const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

    if (error) {
        console.error("Error fetching profile:", error);
        return null;
    }

    return data as Profile;
}

export async function updateProfile(userId: string, updates: Partial<Profile>) {
    const { data, error } = await supabase
        .from("profiles")
        .update({
            ...updates,
            updated_at: new Date().toISOString(),
        })
        .eq("id", userId)
        .select()
        .single();

    if (error) {
        console.error("Error updating profile:", error);
        throw error;
    }

    return data as Profile;
}
