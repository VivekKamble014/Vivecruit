"use client";
import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { toast } from 'sonner';
import { Loader2Icon } from 'lucide-react';


export default function QuestionList({formData}) {

  const [loading, setLoading] = useState(true);

  const [questionList, setQuestionList] = useState();

useEffect(() => {
  if(formData)
  {
    GenerateQuestionList();
  }},[formData]) // useEffect to handle formData changes

  const GenerateQuestionList=async()=>{
    setLoading(true);
    try{
    const result = await axios.post('/api/ai-model', {
      ...formData,
    })
    console.log(result.data.content);
    const Content = JSON.parse(result.data.content);

    setQuestionList(Content);
    toast('Interview Questions Generated Successfully');
    setLoading(false);
  }
  catch(e){
    toast('Server Error, please try again later');
    console.log(e);
    setLoading(false);
 
  }
  };
  return (
    <div>
     {loading&&<div className='p-5 bg-violet-50 rounded-xl border border-gray-200 flex gap-5 items-center'>
<Loader2Icon className="w-6 h-6 animate-spin" />
<div>
  <h2 className='font-medium'>Genrating Interview Questions</h2 >
  <p className='text-primary'>Personalized Interview Questions, Generated Instantly by ViveCruit AI</p>
</div>


     </div>}
<div>
<h1 className='text-2xl font-semibold mt-5'>Interview Questions</h1>
     {questionList?.length >0 && <div className='p-5 border border-gray-300 rounded-xl'>
  {questionList.map((item, index) =>{
    <div key={index} className='p-3 border border-gray-200 rounded-xl'>
      <h2 className='font-medium'>{item?.question}</h2>
      <h2>Type: {item?.type}</h2>
    </div>
  })}
</div>}
</div>
    </div>
  );
}


