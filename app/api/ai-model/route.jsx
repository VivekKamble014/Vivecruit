
import { NextResponse } from "next/server";
import OpenAI from "openai"
import {QUESTIONS_PROMPT} from "@/services/Constants"

export async function POST(req){
const {jobPosition, jobDescription, duration,type}=await req.json();


const FINAL_PROMPT=QUESTIONS_PROMPT.replace('{{jobTitle}}',jobPosition)
.replace('{{jobDescription}}',jobDescription)
.replace('{{duration}}',duration)
.replace('{{type}}',type)

console.log(FINAL_PROMPT);
    try{
    const openai = new OpenAI({
    baseURL: "https://openrouter.ai/api/v1",
    apiKey: process.env.OPENROUTER_API_KET,
   
    })
     const completion = await openai.chat.completions.create({
    // model: "google/gemini-2.0-flash-exp:free",
    model: "openai/gpt-3.5-turbo", // Using a more reliable model
    
    messages: [
      { role: "user", content: FINAL_PROMPT }
    ],
    // response_format:'json'
  })
//   console.log(completion.choices[0].message)
  return NextResponse.json({ content: completion.choices[0].message.content })
}
catch(e){
    console.log("API Error:", e)
    
    // Handle rate limit errors
    if (e.status === 429 || e.code === 429) {
      return NextResponse.json({ 
        error: "Rate limit exceeded. Please try again in a few minutes.",
        code: 429 
      }, { status: 429 })
    }
    
    // Handle other errors
    return NextResponse.json({ 
      error: "Failed to generate questions. Please try again.",
      details: e.message 
    }, { status: 500 })
}
}