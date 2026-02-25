import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";

export async function loginWithEmail(formData: FormData) {
    "use server";
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const supabase = createClient();

    const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
    });

    if (error) {
        redirect("/login?error=" + encodeURIComponent(error.message));
    }

    revalidatePath("/", "layout");
    redirect("/dashboard");
}

export async function loginWithGoogle() {
    "use server";
    const supabase = createClient();
    const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
            redirectTo: `${headers().get('origin')}/auth/callback`,
        },
    });

    if (error) {
        redirect("/login?error=" + encodeURIComponent(error.message));
    }

    if (data.url) {
        redirect(data.url);
    }
}

export async function signupWithEmail(formData: FormData) {
    "use server";
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const supabase = createClient();

    const { data, error } = await supabase.auth.signUp({
        email,
        password,
    });

    if (error) {
        redirect("/login?error=" + encodeURIComponent(error.message));
    }

    if (data.user && !data.session) {
        redirect("/login?error=" + encodeURIComponent("Registration successful! Please check your email to verify your account."));
    }

    revalidatePath("/", "layout");
    redirect("/dashboard");
}

export async function saveOnboarding(formData: FormData) {
    "use server";
    const businessName = formData.get("businessName") as string;
    const niche = formData.get("niche") as string;
    const primaryGoal = formData.get("primaryGoal") as string;

    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login?error=" + encodeURIComponent("Not authenticated"));
    }

    const { error } = await supabase
        .from("business_profile")
        .insert({
            user_id: user.id,
            business_name: businessName,
            niche,
            primary_goal: primaryGoal
        });

    if (error) {
        redirect("/onboarding?error=" + encodeURIComponent(error.message));
    }

    revalidatePath("/", "layout");
    redirect("/dashboard");
}
