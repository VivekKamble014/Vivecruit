"use client";
import React, { useContext, useEffect, useReducer } from 'react';
import { useState } from 'react';
import Image from 'next/image';
import {Clock, Info, Loader2Icon, Video} from 'lucide-react'
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useParams } from 'next/navigation';
import { supabase } from '@/services/supabaseClient';
import { toast } from 'sonner';
import { InterviewDataContext } from '@/context/InterviewData';
import { useRouter } from 'next/navigation';
export default function Interview() {
    const {interview_Id}=useParams();
    console.log(interview_Id);
    const [interviewData,setInterviewData]=useState();
    const [userName,setUserName]=useState();
    const [loading,setLoading]=useState(false);

    const {interviewInfo, setInterviewInfo}=useContext(InterviewDataContext);
const router=useRouter();
useEffect(()=>{
interview_Id&&GetInterviewDetail();
},[interview_Id])


    const GetInterviewDetail = async()=>{
        setLoading(true);
        try{
        let { data: interviews, error } = await supabase
  .from('interviews')
  .select("jobPosition,jobDescription,duration,type").eq('interview_Id',interview_Id)
if (!interviews || interviews.length === 0) {
    setLoading(false);
    toast.error("Invalid or expired interview link.");
    return;
}

setInterviewData(interviews[0]);
toast.success("Interview link validated successfully!", {
  icon: "✅",
});
setLoading(false);

}catch(e){
            setLoading(false);
            console.log(e);
        }
    }

 const onJoinInterview=async()=>{
    setLoading(true);
    let { data: interviews, error } = await supabase
  .from('interviews')
  .select("*")
.eq('interview_Id',interview_Id)
console.log(interviews[0]);
setInterviewInfo({
    userName:userName,
interviewData: interviews[0]
});


router.push('/interview/'+interview_Id+'/start');
setLoading(false);
 }

  return (
    <div className='md:px-28 lg:px-48 xl:px-64 mt-16 p-10'>
      <div className='flex flex-col items-center justify-center border rounded-lg bg-white p-7 lg:px-32 xl:px-52'>
             <Image src={'/logo.png'} alt='logo' width={200} height={100} className='w-[100px]'/>
             <h2 className='mt-3'>AI Powered Interview Platorim</h2>
    <Image src={'/interview.jpg'} alt='Interview' width={300} height={300} className='w-[280] my-6'/>


    <h2 className='font-bold text-xl '>{interviewData?.jobPosition}</h2>
    <h2 className='flex gap-2 items-center text-violet-500 mt-3' ><Clock className='h-4 w-4'/>{interviewData?.duration}</h2>


    <div className='w-full '>
        <h2 className=''>Enter Your Full Name</h2>
      <Input
  placeholder="eg. vivek kamble"
  className='mt-2'
  value={userName}
  onChange={(e) => setUserName(e.target.value)}
/>
    </div>
    <div className="p-4 bg-violet-100 flex items-start gap-4 rounded-lg mt-4 max-w-xl w-full mx-auto">
  <Info className="text-primary mt-1" />
  <div>
    <h2 className="font-semibold text-gray-800 mb-2">Before You Begin</h2>
    <ul className="list-disc list-inside text-sm text-primary space-y-1">
      <li>Test your internet connection</li>
      <li>Check your camera and microphone</li>
      <li>Find a quiet, well-lit environment</li>
      <li>Keep your documents ready</li>
    </ul>
  </div>
</div>
<Button className={'mt-5 font-bold w-full'}
  disabled={!userName}
onClick={()=>onJoinInterview()}
><Video/>{loading&&<Loader2Icon/>}Join Interview</Button>
      </div>

    </div>
  )
}
