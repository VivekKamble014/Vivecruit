// "use client";
// import { InterviewDataContext } from '@/context/InterviewData'
// import React, { useEffect, useState } from 'react'
// import { useContext } from 'react';
// import {Timer,Mic,Phone} from 'lucide-react'
// import Image from 'next/image';
// import Vapi from '@vapi-ai/web';
// import AlertConformation from './_components/AlertConformation';
// import { toast } from 'sonner';
// import { useRouter } from "next/navigation";



// export default function StartInterview() {

//     const router = useRouter();

//   const {interviewInfo,setInterviewInfo}=useContext(InterviewDataContext);
// const vapi = new Vapi(process.env.NEXT_PUBLIC_VAPI_PUBLIC_KEY ||'700899a8-bae6-4538-bf87-4817245fb314');

// const [activeUser,setActiveUser]=useState(false);
// const [conversation,setConversation]=useState();
// useEffect(()=>{
//   interviewInfo&&startCall();
// },[interviewInfo])


// const startCall = () => {
//   let questionList;
//   interviewInfo?.interviewData?.questionList.forEach((item, index) => (
//     questionList = item?.question + "," + questionList
//   ));

//   const assistantOptions = {
//     name: "AI Recruiter",
//     firstMessage: "Hi " + interviewInfo?.userName + ", how are you? Ready for your interview on " + interviewInfo?.interviewData?.jobPosition,
//     model: {
//       provider: "openai",
//     model: "gpt-4o",
//     temperature: 0.7,
//       messages: [
//         {
//           role: "system",
//           // content: "You are a friendly sales representative. Keep responses under 30 words.",
//           content:`
// You are an AI voice assistant conducting interviews.
// Your job is to ask candidates provided interview questions, assess their responses.
// Begin the conversation with a friendly introduction, setting a relaxed yet professional tone. Example:
// "Hey there! Welcome to your `+interviewInfo?.interviewData?.jobPosition+` interview. Lets get started with a few questions!"
// Ask one question at a time and wait for the candidates response before proceeding. Keep the questions clear and concise. Below are the questions ask one by one:
// Questions: `+questionList+`

// If the candidate struggles, offer hints or rephrase the question without giving away the answer. Example:
// "Need a hint? Think about how React tracks component updates!"
// Provide brief, encouraging feedback after each answer. Example:
// "Nice! Thats a solid answer."
// "Hmm, not quite! Want to try again?"
// Keep the conversation natural and engaging—use casual phrases like "Alright, next up..." or "Lets tackle a tricky one!"
// After 5 to 7 questions, wrap up the interview smoothly by summarizing their performance. Example:
// "That was great! You handled some tough questions well. Keep sharpening your skills!"
// End on a positive note:
// "Thanks for chatting! Hope to see you crushing projects soon!"

// Key Guidelines:
// ✅ Be friendly, engaging, and witty
// ✅ Keep responses short and natural, like a real conversation
// ✅ Adapt based on the candidates confidence level
// ✅ Ensure the interview remains focused on React
// `.trim(),
//         }],

//     },
//       voice: {
//     provider: "11labs",
//     voiceId: "21m00Tcm4TlvDq8ikWAM"
//   }
//   };

//   vapi.start(assistantOptions);
// };


// const stopInterview=async()=>{
//    if (!vapi) return console.error("VAPI instance not found");

//   // Add one-time event listener
//   vapi.once("call-end", async () => {
//     console.log("Call has Ended");
//     toast.success("Interview Ended...!");

//     await GenrateFeedback();

//     router.push("/dashboard");
//   });

//   // Stop the call (this triggers "call-end")
//   vapi.stop();
// }
// vapi.on("call-start",()=>{
//   console.log("Call has started");
//   toast.success("Call Connected...!")
// });

// vapi.on("speech-start",()=>{
//   console.log("Assistant speech has started");
//   setActiveUser(false);
// });

// vapi.on("speech-end",()=>{
//   console.log("Assistant speech has Ended");
//   setActiveUser(true);
// });


// vapi.on("message",(message)=>{
//   console.log(message?.conversation);
//   setConversation(message?.conversation);
// });

// const GenrateFeedback = async () => {
//   if (!conversation) {
//     console.warn("No conversation data available.");
//     return;
//   }

//   try {
//     const result = await axios.post('/api/ai-feedback', {
//       conversation: conversation
//     });

//     const finalPrompt = result?.data?.content?.replace(/```json|```/g, '').trim();
//     console.log("FINAL_PROMPT:", finalPrompt);

//     // TODO: Save finalPrompt to DB if needed here

//   } catch (error) {
//     console.error("Error generating feedback:", error);
//   }
// };

//   return (
//     <div className='p-20 lg:px-48 xl:px-56'>
//     <h2 className='font-bold text-xl flex justify-between'>AI Interview Taker
    
//     <span className='flex gap-2 items-center'>
//       <Timer/>
  
//     </span>
      
//     </h2>
//     <div className='grid grid-cols-1 md:grid-cols-2 gap-7 mt-5'>
//     <div className='bg-white h-[500px] rounded-lg border flex flex-col gap-3 items-center justify-center'>

//   {/* Image with animated ping behind it */}
//   <div className="relative w-[150px] h-[150px]">
//     {/* Animation behind image */}
//     <div className="absolute inset-0 flex items-center justify-center">
//       {!activeUser && (
        
//           <span className="absolute w-full h-full rounded-full bg-violet-500 opacity-75 animate-ping" />
        
        
//       )}
//     </div>

//     {/* Image itself */}
//     <Image
//       src="/ai.jpg"
//       alt="ai"
//       width={150}
//       height={150}
//       className="rounded-full object-cover w-full h-full relative z-10"
//     />
//   </div>

//   <h2 className="">VivCruit-AI</h2>
// </div>
//  <div className='bg-white h-[500px] rounded-lg border flex flex-col gap-3 items-center justify-center '>
//  <div className="relative">
//       {activeUser && (

//           <span className="absolute w-full h-full rounded-full bg-violet-500 opacity-75 animate-ping" />
        
    
//       )}
//       <h2 className='text-7xl bg-primary text-white p-3 rounded-full px-6 mb-4'>{interviewInfo?.userName[0]}</h2>
//     </div>
//       <h2>{interviewInfo?.userName}</h2>
//     </div>
//     </div>
//     <div className='flex items-center gap-5 justify-center mt-7'>
//       <Mic className='h-12 w-12 p-3 bg-violet-500 text-white  rounded-full cursor-pointer'/>

//      <AlertConformation stopInterview={()=>stopInterview()}>
//       <Phone className='h-12 w-12 p-3 bg-red-500 text-white rounded-full cursor-pointer'
//       />
//      </AlertConformation>
//     </div>
//     <h2 className='flex justify-center mt-7 text-violet-400'>Interview In Prgress ...</h2>
//     </div>
//   )
// }


"use client";
import { InterviewDataContext } from '@/context/InterviewData'
import React, { useEffect, useState } from 'react'
import { useContext } from 'react';
import { Timer, Mic, Phone } from 'lucide-react'
import Image from 'next/image';
import Vapi from '@vapi-ai/web';
import AlertConformation from './_components/AlertConformation';
import { toast } from 'sonner';
import { useRouter } from "next/navigation";
import axios from 'axios'; // ✅ Make sure axios is imported

export default function StartInterview() {
  const router = useRouter();
  const { interviewInfo } = useContext(InterviewDataContext);
  const [activeUser, setActiveUser] = useState(false);
  const [conversation, setConversation] = useState(null);
  const vapi = new Vapi(process.env.NEXT_PUBLIC_VAPI_PUBLIC_KEY || '700899a8-bae6-4538-bf87-4817245fb314');

  // ✅ Start call once interviewInfo is loaded
  useEffect(() => {
    if (interviewInfo) startCall();
  }, [interviewInfo]);

  // ✅ Setup event listeners only once
  useEffect(() => {
    vapi.on("call-start", () => {
      console.log("Call has started");
      toast.success("Call Connected...!");
    });

    vapi.on("speech-start", () => {
      console.log("Assistant speech has started");
      setActiveUser(false);
    });

    vapi.on("speech-end", () => {
      console.log("Assistant speech has Ended");
      setActiveUser(true);
    });

    vapi.on("message", (message) => {
      console.log(message?.conversation);
      setConversation(message?.conversation);
    });
  }, []);

  const startCall = () => {
    const questionList = interviewInfo?.interviewData?.questionList
      ?.map((item) => item?.question)
      ?.join(', '); // ✅ fixed

    const assistantOptions = {
      name: "AI Recruiter",
      firstMessage: `Hi ${interviewInfo?.userName}, how are you? Ready for your interview on ${interviewInfo?.interviewData?.jobPosition}?`,
      model: {
        provider: "openai",
        model: "gpt-4o",
        temperature: 0.7,
        messages: [
          {
            role: "system",
            content: `
You are an AI voice assistant conducting interviews.
Your job is to ask candidates provided interview questions, assess their responses.
Begin the conversation with a friendly introduction, setting a relaxed yet professional tone. Example:
"Hey there! Welcome to your ${interviewInfo?.interviewData?.jobPosition} interview. Let's get started with a few questions!"
Ask one question at a time and wait for the candidate’s response before proceeding. Keep the questions clear and concise.
Questions: ${questionList}

If the candidate struggles, offer hints or rephrase the question without giving away the answer.
Provide brief, encouraging feedback after each answer.
After 5 to 7 questions, wrap up the interview and end on a positive note.
`.trim()
          }
        ],
      },
      voice: {
        provider: "11labs",
        voiceId: "21m00Tcm4TlvDq8ikWAM"
      }
    };

    vapi.start(assistantOptions);
  };

  const stopInterview = async () => {
    if (!vapi) return console.error("VAPI instance not found");

    // ✅ Trigger only once
    vapi.once("call-end", async () => {
      console.log("Call has Ended");
      toast.success("Interview Ended...!");

      await GenrateFeedback();
      router.push("/dashboard");
    });

    vapi.stop(); // ✅ This triggers call-end event
  };

  const GenrateFeedback = async () => {
    if (!conversation) {
      console.warn("No conversation data available.");
      return;
    }

    try {
      const result = await axios.post('/api/ai-feedback', {
        conversation: conversation
      });

      const finalPrompt = result?.data?.content?.replace(/```json|```/g, '').trim();
      console.log("FINAL_PROMPT:", finalPrompt);

      // TODO: Save finalPrompt to DB here if needed

    } catch (error) {
      console.error("Error generating feedback:", error);
    }
  };

  return (
    <div className='p-20 lg:px-48 xl:px-56'>
      <h2 className='font-bold text-xl flex justify-between'>
        AI Interview Taker
        <span className='flex gap-2 items-center'><Timer /></span>
      </h2>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-7 mt-5'>
        <div className='bg-white h-[500px] rounded-lg border flex flex-col gap-3 items-center justify-center'>
          <div className="relative w-[150px] h-[150px]">
            <div className="absolute inset-0 flex items-center justify-center">
              {!activeUser && (
                <span className="absolute w-full h-full rounded-full bg-violet-500 opacity-75 animate-ping" />
              )}
            </div>
            <Image
              src="/ai.jpg"
              alt="ai"
              width={150}
              height={150}
              className="rounded-full object-cover w-full h-full relative z-10"
            />
          </div>
          <h2 className="">VivCruit-AI</h2>
        </div>

        <div className='bg-white h-[500px] rounded-lg border flex flex-col gap-3 items-center justify-center'>
          <div className="relative">
            {activeUser && (
              <span className="absolute w-full h-full rounded-full bg-violet-500 opacity-75 animate-ping" />
            )}
            <h2 className='text-7xl bg-primary text-white p-3 rounded-full px-6 mb-4'>
              {interviewInfo?.userName[0]}
            </h2>
          </div>
          <h2>{interviewInfo?.userName}</h2>
        </div>
      </div>

      <div className='flex items-center gap-5 justify-center mt-7'>
        <Mic className='h-12 w-12 p-3 bg-violet-500 text-white  rounded-full cursor-pointer' />

        <AlertConformation stopInterview={stopInterview}>
          <Phone className='h-12 w-12 p-3 bg-red-500 text-white rounded-full cursor-pointer' />
        </AlertConformation>
      </div>

      <h2 className='flex justify-center mt-7 text-violet-400'>Interview In Progress ...</h2>
    </div>
  );
}