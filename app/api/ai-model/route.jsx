import { QUESTIONS_PROMPT } from '@/services/Constants';
import { NextResponse } from 'next/server';
import OpenAI from 'openai';

export async function POST(request){
    // # gets API Key from environment variable 
    // OPENAI_API_KEY

const {jobPosition, jobDescription, duration, type} = await request.json();

const FINAL_QUESTIONS_PROMPT = QUESTIONS_PROMPT.replace("{jobTitle}", jobPosition)
.replace("{jobDescription}", jobDescription)
.replace("{duration}", duration)
.replace("{type}", type)
console.log(FINAL_QUESTIONS_PROMPT);

try{
// const openai = OpenAI(
//   baseURL = "https://openrouter.ai/api/v1",
//   api_key = process.env.OPENROUTER_API_KET,
// )

const openai = new OpenAI({
  baseURL: 'https://openrouter.ai/api/v1',
  apiKey:"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", 
  
});

const completion = await openai.chat.completions.create({
    // model: "google/gemini-2.5-pro-exp-03-25",
  model: 'openai/gpt-4o',
    max_tokens: 2000,
    messages: [
        {
        role: "user",
        content: FINAL_QUESTIONS_PROMPT,
        },
        
    ],
})
console.log(completion.choices[0].message)
return NextResponse.json(completion.choices[0].message);
}catch(e){
    console.log(e);
    return NextResponse.json(e)
}}