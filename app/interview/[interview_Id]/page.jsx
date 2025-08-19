"use client";
import React, { useContext, useEffect, useReducer } from 'react';
import { useState } from 'react';
import Image from 'next/image';
import {Clock, Info, Video, AlertCircle, CheckCircle} from 'lucide-react'
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useParams } from 'next/navigation';
import { supabase } from '@/services/supabaseClient';
import { toast } from 'sonner';
import { InterviewDataContext } from '@/context/InterviewData';
import { useRouter } from 'next/navigation';
import { VivecruitSpinner } from '@/components/ui/vivecruit-loader';
export default function Interview() {
    const {interview_Id}=useParams();
    console.log(interview_Id);
    const [interviewData,setInterviewData]=useState();
    const [userName,setUserName]=useState();
    const [userEmail,setUserEmail]=useState();
    const [loading,setLoading]=useState(false);
    const [scheduledInterview, setScheduledInterview] = useState(null);
    const [timeStatus, setTimeStatus] = useState('loading'); // 'loading', 'early', 'on-time', 'late'
    const [timeLeft, setTimeLeft] = useState(null);

    const {interviewInfo, setInterviewInfo}=useContext(InterviewDataContext);
const router=useRouter();
useEffect(()=>{
    if(interview_Id) {
        GetInterviewDetail();
        checkScheduledTime();
    }
},[interview_Id])

useEffect(() => {
    if (timeStatus === 'early' && timeLeft) {
        const timer = setInterval(() => {
            const now = new Date();
            const scheduledTime = new Date(scheduledInterview.scheduled_date);
            const diff = scheduledTime - now;
            
            if (diff <= 0) {
                setTimeStatus('on-time');
                setTimeLeft(null);
                clearInterval(timer);
            } else {
                setTimeLeft(diff);
            }
        }, 1000);
        
        return () => clearInterval(timer);
    }
}, [timeStatus, timeLeft, scheduledInterview]);


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

    const checkScheduledTime = async () => {
        try {
            // Check if there's a scheduled interview for this interview_id
            const { data: scheduled, error } = await supabase
                .from('scheduled_interviews')
                .select('*')
                .eq('interview_id', interview_Id)
                .single();

            if (error || !scheduled) {
                // No scheduled interview found, allow access
                setTimeStatus('on-time');
                return;
            }

            setScheduledInterview(scheduled);
            
            const now = new Date();
            const scheduledTime = new Date(scheduled.scheduled_date);
            const timeDiff = scheduledTime - now;
            
            // Allow 15 minutes before and 30 minutes after the scheduled time
            const fifteenMinutesBefore = 15 * 60 * 1000; // 15 minutes in milliseconds
            const thirtyMinutesAfter = 30 * 60 * 1000; // 30 minutes in milliseconds
            
            if (timeDiff > fifteenMinutesBefore) {
                // Too early
                setTimeStatus('early');
                setTimeLeft(timeDiff);
            } else if (timeDiff < -thirtyMinutesAfter) {
                // Too late
                setTimeStatus('late');
            } else {
                // On time
                setTimeStatus('on-time');
            }
            
        } catch (error) {
            console.error('Error checking scheduled time:', error);
            setTimeStatus('on-time'); // Default to allowing access
        }
    }

    const formatTimeLeft = (milliseconds) => {
        const hours = Math.floor(milliseconds / (1000 * 60 * 60));
        const minutes = Math.floor((milliseconds % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((milliseconds % (1000 * 60)) / 1000);
        
        return {
            hours: hours.toString().padStart(2, '0'),
            minutes: minutes.toString().padStart(2, '0'),
            seconds: seconds.toString().padStart(2, '0')
        };
    }

 const onJoinInterview=async()=>{
    setLoading(true);
    let { data: interviews, error } = await supabase
  .from('interviews')
  .select("*")
.eq('interview_Id',interview_Id)
console.log(interviews[0]);
const interviewInfoData = {
    userName: userName,
    userEmail: userEmail,
    interviewData: interviews[0]
};

console.log("🎯 Setting interview info in context:", interviewInfoData);
setInterviewInfo(interviewInfoData);

// Add a small delay to ensure context is set before navigation
setTimeout(() => {
    console.log("🚀 Navigating to interview start page...");
    router.push(`/interview/${interview_Id}/start?name=${encodeURIComponent(userName)}&email=${encodeURIComponent(userEmail)}`);
}, 100);
setLoading(false);
 }

  return (
    <div className='md:px-28 lg:px-48 xl:px-64 mt-16 p-10'>
      <div className='flex flex-col items-center justify-center border rounded-lg bg-white p-7 lg:px-32 xl:px-52'>
        <Image src={'/logo.png'} alt='logo' width={200} height={100} className='w-[100px]'/>
        <h2 className='mt-3'>AI Powered Interview Platform</h2>
        <Image src={'/interview.jpg'} alt='Interview' width={300} height={300} className='w-[280] my-6'/>

        {timeStatus === 'loading' && (
          <div className="text-center">
            <VivecruitSpinner />
            <p className="mt-4 text-gray-600">Checking interview schedule...</p>
          </div>
        )}

        {timeStatus === 'early' && (
          <div className="text-center w-full">
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-6">
              <AlertCircle className="h-12 w-12 text-yellow-600 mx-auto mb-4" />
              <h2 className="text-xl font-bold text-yellow-800 mb-2">Interview Not Started Yet</h2>
              <p className="text-yellow-700 mb-4">
                Your interview is scheduled for {scheduledInterview?.scheduled_time} on {new Date(scheduledInterview?.scheduled_date).toLocaleDateString()}
              </p>
              
              {timeLeft && (
                <div className="bg-white rounded-lg p-4 border border-yellow-300">
                  <p className="text-sm text-yellow-700 mb-2">Time remaining until interview starts:</p>
                  <div className="flex justify-center gap-4 text-2xl font-mono font-bold text-yellow-800">
                    <div className="text-center">
                      <div className="bg-yellow-100 rounded-lg p-2 min-w-[60px]">
                        {formatTimeLeft(timeLeft).hours}
                      </div>
                      <div className="text-xs text-yellow-600 mt-1">Hours</div>
                    </div>
                    <div className="text-center">
                      <div className="bg-yellow-100 rounded-lg p-2 min-w-[60px]">
                        {formatTimeLeft(timeLeft).minutes}
                      </div>
                      <div className="text-xs text-yellow-600 mt-1">Minutes</div>
                    </div>
                    <div className="text-center">
                      <div className="bg-yellow-100 rounded-lg p-2 min-w-[60px]">
                        {formatTimeLeft(timeLeft).seconds}
                      </div>
                      <div className="text-xs text-yellow-600 mt-1">Seconds</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {timeStatus === 'late' && (
          <div className="text-center w-full">
            <div className="bg-red-50 border border-red-200 rounded-lg p-6">
              <AlertCircle className="h-12 w-12 text-red-600 mx-auto mb-4" />
              <h2 className="text-xl font-bold text-red-800 mb-2">Interview Time Expired</h2>
              <p className="text-red-700 mb-4">
                Your interview was scheduled for {scheduledInterview?.scheduled_time} on {new Date(scheduledInterview?.scheduled_date).toLocaleDateString()}
              </p>
              <p className="text-red-600">
                The interview window has closed. Please contact the hiring team to reschedule.
              </p>
            </div>
          </div>
        )}

        {timeStatus === 'on-time' && (
          <>
            <h2 className='font-bold text-xl '>{interviewData?.jobPosition}</h2>
            <h2 className='flex gap-2 items-center text-violet-500 mt-3' >
              <Clock className='h-4 w-4'/>{interviewData?.duration}
            </h2>

            {scheduledInterview && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4 w-full">
                <div className="flex items-center gap-2 text-green-800">
                  <CheckCircle className="h-4 w-4" />
                  <span className="font-semibold">Interview Time: {scheduledInterview.scheduled_time}</span>
                </div>
              </div>
            )}

            <div className='w-full '>
              <h2 className=''>Enter Your Full Name</h2>
              <Input
                placeholder="eg. vivek kamble"
                className='mt-2'
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
              />
            </div>
            <div className='w-full '>
              <h2 className=''>Enter Your Email</h2>
              <Input
                placeholder="eg. vivek@gmail.com"
                className='mt-2'
                value={userEmail}
                onChange={(e) => setUserEmail(e.target.value)}
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
            <Button 
              className={'mt-5 font-bold w-full'}
              disabled={!userName || !userEmail || !/^\S+@\S+\.\S+$/.test(userEmail)}
              onClick={()=>onJoinInterview()}
            >
              <Video/>{loading&&<VivecruitSpinner/>}Join Interview
            </Button>
          </>
        )}
      </div>
    </div>
  )
}
