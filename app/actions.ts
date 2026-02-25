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
            redirectTo: `${headers().get('origin')}/api/auth/callback`,
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

import { generateCaption } from "@/lib/ai/service";

export async function createCaptionAction(formData: FormData) {
    "use server";
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        throw new Error("Not authenticated");
    }

    const productName = formData.get("productName") as string;
    const usp = formData.get("usp") as string;
    const platform = formData.get("platform") as string;
    const language = formData.get("language") as "ms" | "en";
    const tone = formData.get("tone") as string;

    try {
        const caption = await generateCaption({ productName, usp, platform, language, tone });

        // Save to history
        await supabase
            .from("ai_generations")
            .insert({
                user_id: user.id,
                tool_type: "caption",
                input_data: { productName, usp, platform, language, tone },
                output_content: caption
            });

        revalidatePath("/dashboard", "layout");

        return { success: true, caption };
    } catch (error: any) {
        return { success: false, error: error.message || "Failed to generate caption" };
    }
}

import { generateHooks, generateImage, generateSalesScript, generateCalendar } from "@/lib/ai/service";

export async function createHooksAction(formData: FormData) {
    "use server";
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        throw new Error("Not authenticated");
    }

    const topic = formData.get("topic") as string;
    const language = formData.get("language") as "ms" | "en";

    try {
        const hooks = await generateHooks({ topic, language });

        // Save to history
        await supabase
            .from("ai_generations")
            .insert({
                user_id: user.id,
                tool_type: "hook",
                input_data: { topic, language },
                output_content: JSON.stringify(hooks) // save array as JSON string
            });

        revalidatePath("/dashboard", "layout");

        return { success: true, hooks };
    } catch (error: any) {
        return { success: false, error: error.message || "Failed to generate hooks" };
    }
}

export async function createImageAction(formData: FormData) {
    "use server";
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) throw new Error("Not authenticated");

    const promptText = formData.get("prompt") as string;

    try {
        const imageUrl = await generateImage({ promptText });

        // Save to history
        await supabase
            .from("ai_generations")
            .insert({
                user_id: user.id,
                tool_type: "image",
                input_data: { prompt: promptText },
                output_content: imageUrl
            });

        revalidatePath("/dashboard", "layout");
        return { success: true, imageUrl };
    } catch (error: any) {
        return { success: false, error: error.message || "Failed to generate image" };
    }
}

export async function createSalesScriptAction(formData: FormData) {
    "use server";
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) throw new Error("Not authenticated");

    const objection = formData.get("objection") as string;
    const language = formData.get("language") as "ms" | "en";

    try {
        const script = await generateSalesScript({ objection, language });

        // Save to history
        await supabase
            .from("ai_generations")
            .insert({
                user_id: user.id,
                tool_type: "script",
                input_data: { objection, language },
                output_content: script
            });

        revalidatePath("/dashboard", "layout");
        return { success: true, script };
    } catch (error: any) {
        return { success: false, error: error.message || "Failed to generate script" };
    }
}

export async function createCalendarAction(formData: FormData) {
    "use server";
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) throw new Error("Not authenticated");

    const niche = formData.get("niche") as string;
    const goal = formData.get("goal") as string;
    const language = formData.get("language") as "ms" | "en";

    try {
        const calendar = await generateCalendar({ niche, goal, language });

        // Save to history
        await supabase
            .from("ai_generations")
            .insert({
                user_id: user.id,
                tool_type: "calendar",
                input_data: { niche, goal, language },
                output_content: JSON.stringify(calendar)
            });

        revalidatePath("/dashboard", "layout");
        return { success: true, calendar };
    } catch (error: any) {
        return { success: false, error: error.message || "Failed to generate calendar" };
    }
}

export async function updateSettingsAction(formData: FormData) {
    "use server";
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) throw new Error("Not authenticated");

    const businessName = formData.get("businessName") as string;
    const niche = formData.get("niche") as string;
    const primaryGoal = formData.get("primaryGoal") as string;

    const { error } = await supabase
        .from("business_profile")
        .update({
            business_name: businessName,
            niche,
            primary_goal: primaryGoal
        })
        .eq("user_id", user.id);

    if (error) {
        return { success: false, error: error.message };
    }

    revalidatePath("/dashboard", "layout");
    return { success: true };
}
