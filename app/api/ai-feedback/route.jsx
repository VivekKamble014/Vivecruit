import { FEEDBACK_PROMPT } from "@/services/Constants";
import OpenAI from "openai";
import { NextResponse } from "next/server";

export async function POST(req){
    try {
        const {conversation} = await req.json();
        
        if (!conversation) {
            return NextResponse.json(
                { error: "No conversation data provided" },
                { status: 400 }
            );
        }

        const FINAL_PROMPT = FEEDBACK_PROMPT.replace('{{conversation}}', JSON.stringify(conversation));

        const openai = new OpenAI({
            baseURL: "https://openrouter.ai/api/v1",
            apiKey: process.env.OPENROUTER_API_KEY, // Fixed typo: was OPENROUTER_API_KET
        });

        const completion = await openai.chat.completions.create({
            model: "cognitivecomputations/dolphin-mistral-24b-venice-edition:free",
            messages: [
                { role: "user", content: FINAL_PROMPT }
            ],
        });

        return NextResponse.json(completion.choices[0].message);
    } catch (error) {
        console.error("AI Feedback API Error:", error);
        return NextResponse.json(
            { 
                error: "Failed to generate feedback",
                details: error.message 
            },
            { status: 500 }
        );
    }
}