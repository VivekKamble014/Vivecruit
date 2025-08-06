"use client"
import { InterviewDataContext } from '@/context/InterviewData'
import React from 'react'
import { useContext } from 'react';
import {Timer,Mic,Phone} from 'lucide-react'
import Image from 'next/image';
export default function StartInterview() {
  const {interviewInfo,setInterviewInfo}=useContext(InterviewDataContext);
  return (
    <div className='p-20 lg:px-48 xl:px-56'>
    <h2 className='font-bold text-xl flex justify-between'>AI Interview Taker
    
    <span className='flex gap-2 items-center'>
      <Timer/>
      00:00:00
    </span>
      
    </h2>
    <div className='grid grid-cols-1 md:grid-cols-2 gap-7 mt-5'>
    <div className='bg-white h-[500px] rounded-lg border flex flex-col gap-3 items-center justify-center '>
      <Image src={'/ai.jpg'} alt='ai'
        width={200}
        height={200}
        className='w-[150px] h-[150px] rounded-full object-cover'
      />
      <h2 className=''>VivCruit-AI</h2>
    </div>
 <div className='bg-white h-[500px] rounded-lg border flex flex-col gap-3 items-center justify-center '>
      <h2 className='text-7xl bg-primary text-white p-3 rounded-full px-6 mb-4'>{interviewInfo?.userName[0]}</h2>
      <h2>{interviewInfo?.userName}</h2>
    </div>
    </div>
    <div className='flex items-center gap-5 justify-center mt-7'>
      <Mic className='h-12 w-12 p-3 bg-violet-500 text-white  rounded-full cursor-pointer'/>
      <Phone className='h-12 w-12 p-3 bg-red-500 text-white rounded-full cursor-pointer'/>
    </div>
    <h2 className='flex justify-center mt-7 text-violet-400'>Interview In Prgress ...</h2>
    </div>
  )
}
