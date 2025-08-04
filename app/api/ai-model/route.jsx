import { QUESTIONS_PROMPT } from '@/services/Constants';
import { NextResponse } from 'next/server';
import OpenAI from 'openai';

export async function POST(request){
const {jobPosition, jobDescription, duration, type} = await request.json();

const FINAL_QUESTIONS_PROMPT = QUESTIONS_PROMPT.replace("{jobTitle}", jobPosition)
.replace("{jobDescription}", jobDescription)
.replace("{duration}", duration)
.replace("{type}", type)
console.log(FINAL_QUESTIONS_PROMPT);

try{

const openai = new OpenAI({
  baseURL: 'https://openrouter.ai/api/v1',
  apiKey:'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', 
  
});

const completion = await openai.chat.completions.create({
    // model: "google/gemini-2.5-pro-exp-03-25",
  model: 'openai/gpt-4o',
    max_tokens: 2000,
    temperature: 0.7,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
    
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


