"use client";
import { Button } from '@/components/ui/button';
import { Video } from 'lucide-react';
import React, { useState } from 'react'
export default function LatestInterviewList() {
    const [InterviewList, setInterviewList]=useState([]);
  return (
    <div className='m-5'> 
    <h2 className='font-bold text-2xl'>Previously Created Interview</h2>
      
{ InterviewList?.length ==0 &&
    <div className='w-full p-10 flex flex-col  gap-3 items-center bg-white rounded-xl  mt-5'>
        <Video className='h-14 w-14 text-primary '/>
        <h2 className='text-xl'>You don't have any Interview Created!</h2>
        <Button className='p-5 bg-primary text-l text-white'>+ Create New Interview</Button>
    </div>}
    </div>
  )
}
