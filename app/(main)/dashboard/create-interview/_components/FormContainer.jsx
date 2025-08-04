import React from 'react'
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { InterviewType } from '../../../../../services/Constants'
import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

import { useState, useEffect } from 'react';

export default function FormContainer({handleInputChange,GoToNext}) {

    const [interviewType, setInterviewType] = useState([]);

    useEffect(() => {
        if(interviewType){
            handleInputChange('type', interviewType);
        }

    },[interviewType]);

const AddInterviewType = (type) => {
  const data = interviewType.includes(type);

    if (!data) {
        setInterviewType(prevTypes => [...prevTypes, type]);
    } else {
        const result= interviewType.filter(item => item !== type);
        setInterviewType(result);
    }
};
  return (
    <div>
    <div className='p-5 bg-white'>
        <h2 className='text-sm font-medium'>Job Position</h2>
      <Input placeholder="e.g Full Stack Developer" className='mt-2'

      onChange={(event)=>handleInputChange('jobPosition', event.target.value)}
      />
    </div>
    <div className='p-5 bg-white'>
        <h2 className='text-sm font-medium'>Job Description</h2>
     <Textarea placeholder="Enter Job Decription in detail" className="h-[200px] mt-2"
        onChange={(event)=>handleInputChange('jobDescription', event.target.value)}
     />
    </div>
    <div className='p-5 bg-white'>
        <h2 className='text-sm'>Interview Duration </h2>
        <Select onValueChange={(value) => handleInputChange('duration', value)}>
  <SelectTrigger className="w-full mt-2">
    <SelectValue placeholder="Select Duration" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="5 Min">5 Min</SelectItem>
    <SelectItem value="15 Min">15 Min</SelectItem>
    <SelectItem value="30 Min">30 Min</SelectItem>
    <SelectItem value="45 Min">45 Min</SelectItem>
    <SelectItem value="60 Min">60 Min</SelectItem>

  </SelectContent>
</Select>
    
    </div>
    <div className='p-5 bg-white'>
        <h2 className='text-sm font-medium'>Interview Type</h2>
        <div className='flex flex-wrap gap-3 mt-2'>
            {InterviewType.map((type,index) => (
                <div key={index} 
               className={`flex gap-2 p-1 px-2 bg-violet-100 items-center  rounded-2xl cursor-pointer
                hover:bg-violet-200
                ${interviewType.includes(type.title) &&'bg-violet-300 text-black'}
                `}
                onClick={() => AddInterviewType(type.title)}
                >
                <type.icon/>
                <span>{type.title}</span>

                </div>
            ))}
        </div>
     
    <div className='mt-7 flex justify-end' onClick={()=>GoToNext()}>
    <Button className='text-[14px] font-bold'>Genrate Questions <ArrowRight/></Button>
    </div>
    </div>
    </div>
  )
}
