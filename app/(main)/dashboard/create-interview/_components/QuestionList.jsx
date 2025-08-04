"use client";
import React, { useEffect, useState } from 'react'
import axios from 'axios';

import { toast } from 'sonner';
import { Loader2Icon } from 'lucide-react';
export default function QuestionList({formData}) {

  const [loading, setLoading] = useState(false);


useEffect(() => {
  if(formData)
  {
    // GenerateQuestionList();
  }},[formData]) // useEffect to handle formData changes

  const GenerateQuestionList=async()=>{
    setLoading(true);
    try{
    const result = await axios.post('/api/ai-model', {
      ...formData
    })
    console.log(result.data.content);
    setLoading(false);
  }
  catch(e){
    toast('Server Error, please try again later');
    setLoading(false);
 
  }
  };
  return (
    <div>
     {loading&&<div className='p-5 bg-violet-50 rounded-xl border-gray-200 flex gap-5 items-center'>
<Loader2Icon className="w-6 h-6 animate-spin" />
<div>
  <h2 className='font-medium'>Genrating Interview Questions</h2 >
  <p className='text-primary'>Personalized Interview Questions, Generated Instantly by ViveCruit AI</p>
</div>
     </div>}
    </div>
  );
}
