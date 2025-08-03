'use client';
import React,{useState} from 'react'
import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Progress } from "@/components/ui/progress"
import FormContainer from './components/FormContainer';
export default function CreateInterview() {
    const router=useRouter();
    const [step,setStep]=useState(1);
  return (
    <div className='px-10 md:px-24 lg:px-44 xl:px-56 '>
    <div className='flex gap-3 items-conter'>
        <ArrowLeft onClick={()=> router.back()} className='cursor-pointer'/>
        <h2 className='font-bold text-2xl '>Create New Interview</h2>
    </div>
        <Progress value={step * 33.33} className='my-5'/>
      <FormContainer/>  
      
    </div>
  )
}
