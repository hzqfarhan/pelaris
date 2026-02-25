import { GoogleGenerativeAI } from '@google/generative-ai';
import OpenAI from 'openai';

const ai = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const model = 'gemini-1.5-flash';

// Base prompt strategy for context injection
const generatePrompt = (context: string, language: "ms" | "en", tone?: string) => {
    const slangRules = language === "ms"
        ? "Use modern Malaysian slang (e.g., 'power gila', 'padu', 'murmur je', 'ngam'). Maintain a conversational tone suitable for local SMEs."
        : "Use conversational, energetic English suitable for the Malaysian SME market. Keep it professional but highly engaging.";

    const toneRule = tone ? `The tone should be: ${tone}.` : "";

    return `
    You are an expert AI Marketing Assistant for Malaysian SMEs. 
    ${slangRules}
    ${toneRule}
    
    TASK CONTEXT:
    ${context}
    
    Return ONLY the requested output format. No conversational filler or markdown code blocks around the text, unless explicitly asked.
  `;
}

export const generateCaption = async ({
    productName,
    usp,
    platform,
    language = "ms",
    tone = "Hard Sell"
}: {
    productName: string,
    usp: string,
    platform: string,
    language?: "ms" | "en",
    tone?: string
}) => {
    const context = `
    Create a highly engaging social media caption for ${platform}.
    Product: ${productName}
    Unique Selling Proposition: ${usp}
    
    The caption must include:
    - A strong stop-scrolling hook
    - Emoji strategy
    - A clear Call To Action (CTA)
    - 5-8 relevant hashtags suitable for the localized market
  `;

    const prompt = generatePrompt(context, language, tone);

    const genModel = ai.getGenerativeModel({ model });
    const response = await genModel.generateContent(prompt);

    return response.response.text();
}

export const generateHooks = async ({
    topic,
    language = "ms"
}: {
    topic: string,
    language?: "ms" | "en"
}) => {
    const context = `
    Generate exactly 5 different video hooks for TikTok/Reels based on the topic: "${topic}".
    Format the output as a strict JSON array of objects with keys: "category" and "hookText".
    
    The categories must be EXACTLY: "FOMO", "Shock", "Problem", "Testimonial", "Educational".
  `;

    const prompt = generatePrompt(context, language);

    const genModel = ai.getGenerativeModel({ model });
    const response = await genModel.generateContent(prompt);

    // Strip JSON code block formatting if present
    let raw = response.response.text() || "[]";
    if (raw.startsWith("```json")) raw = raw.replace(/```json/g, "").replace(/```/g, "").trim();

    try {
        return JSON.parse(raw);
    } catch (e) {
        console.error("Failed to parse hooks JSON", e);
        return [];
    }
}

export const generateSalesScript = async ({
    objection,
    language = "ms"
}: {
    objection: string,
    language?: "ms" | "en"
}) => {
    const context = `
    You are writing a WhatsApp auto-reply script to handle a customer objection.
    The customer said: "${objection}".
    
    Generate a persuasive, empathetic, and professional response that handles the objection and guides them towards a sale.
    Example objection: "Mahal sangat".
  `;

    const prompt = generatePrompt(context, language);

    const genModel = ai.getGenerativeModel({ model });
    const response = await genModel.generateContent(prompt);

    return response.response.text();
}

export const generateCalendar = async ({
    niche,
    goal,
    language = "ms"
}: {
    niche: string,
    goal: string,
    language?: "ms" | "en"
}) => {
    const context = `
    Create a 30-day content plan for a business in the "${niche}" niche. Their primary goal is "${goal}".
    
    Output exactly a JSON array of 30 objects representing each day.
    Keys required: "day" (number 1-30), "contentType" (e.g., Reel, Carousel, Story), "hook" (the hook idea), "captionIdea" (a brief summary), "platform" (e.g., TikTok, Instagram).
  `;

    const prompt = generatePrompt(context, language);

    const genModel = ai.getGenerativeModel({
        model,
        generationConfig: {
            responseMimeType: "application/json",
        }
    });
    const response = await genModel.generateContent(prompt);

    let raw = response.response.text() || "[]";
    if (raw.startsWith("```json")) raw = raw.replace(/```json/g, "").replace(/```/g, "").trim();

    try {
        return JSON.parse(raw);
    } catch (e) {
        console.error("Failed to parse calendar JSON", e);
        return [];
    }
}

export const analyzePerformance = async (data: any) => {
    const context = `
    Analyze the following engagement data for a Malaysian SME:
    ${JSON.stringify(data)}
    
    Provide 3 actionable insights to improve their marketing strategy.
  `;

    const prompt = generatePrompt(context, "en"); // analytics reporting usually in EN or mixed

    const genModel = ai.getGenerativeModel({ model });
    const response = await genModel.generateContent(prompt);

    return response.response.text();
}

export const generateImage = async ({
    promptText,
    size = "1024x1024"
}: {
    promptText: string;
    size?: "256x256" | "512x512" | "1024x1024";
}) => {
    try {
        const response = await openai.images.generate({
            model: "dall-e-3",
            prompt: promptText,
            n: 1,
            size,
            quality: "standard",
        });

        if (!response.data || !response.data[0] || !response.data[0].url) {
            throw new Error("No image URL returned from OpenAI");
        }

        return response.data[0].url;
    } catch (error: any) {
        console.error("OpenAI Image Generation Error:", error?.response?.data || error.message);
        throw error;
    }
}
