
import { Loader2, Loader2Icon } from 'lucide-react';
import React, { useEffect, useState } from 'react'
import { toast } from 'sonner';

import axios from 'axios';

import { Button } from '@/components/ui/button';
import QuestionListContainer from './QuestionListContainer';
import { v4 as uuidv4 } from 'uuid';
import { useUser } from '@/app/provider';

import { supabase } from '../../../../../services/supabaseClient';


export default function QuestionList({formData ,onCreateLink}) {
  // console.log("Getting from QUestion List: ",formData)

const [questionList,setQuestionList]=useState();
const {user}=useUser();
const [saveLoading,setSaveLoading]=useState(false);

const GenerateQuestionList= async()=>{
  setLoading(true);
  try{
  const result=await axios.post('/api/ai-model',{
    ...formData
  })
  console.log("API Response:", result.data);

  // Check for API errors
  if (result.data?.error) {
    console.error("API Error:", result.data.error);
    toast.error(result.data.error);
    setLoading(false);
    return;
  }

  const Content = result.data?.content;
  console.log("Content:", Content);
  
  if (!Content) {
    console.error("No content received from API");
    toast.error('No questions generated. Please try again.');
    setLoading(false);
    return;
  }

  // const FINAL_JSON=Content.replace('"```json','').replace('```','')
  const FINAL_JSON = Content.replace(/```json|```/g, '').trim();
  console.log("FINAL_JSON:", FINAL_JSON);

  // setQuestionList(JSON.parse(FINAL_JSON)?.interviewQuestions);
  const parsed = JSON.parse(FINAL_JSON);
  console.log("Parsed data:", parsed);
  setQuestionList(parsed?.interviewQuestions || []);


  setLoading(false);

}catch(e){
  console.log("Error from QL", e)
  
  // Handle specific error types
  if (e.response?.status === 429) {
    toast.error('Rate limit exceeded. Please wait a few minutes and try again.');
  } else if (e.response?.data?.error) {
    toast.error(e.response.data.error);
  } else {
    toast.error('Server Error. Please try again.');
  }
  
  setLoading(false);
}
}
  const [loading, setLoading]=useState(true);

useEffect(()=>{
  if(formData){
    GenerateQuestionList();
  }
},[formData])


const onFinish=async()=>{
  setSaveLoading(true);
  const interview_id=uuidv4();
  const { data, error } = await supabase
  .from('interviews')
  .insert([
    {
      ...formData,
      questionList:questionList,
      userEmail:user?.email,
      interview_Id:interview_id
      
     },
  ])
  .select()
  
  if (error) {
  console.log("Supabase insert error:", error);
  toast.error('Failed to save interview data.');
} else {
  setSaveLoading(false);
  console.log("Record Inserted", data);
  toast.success('Interview saved successfully.');
  onCreateLink(interview_id)

}

// console.log("Record Inserted",data);
}







  return (
    <div>
  {loading && (
    <div className="p-8 bg-violet-50 rounded-2xl border border-violet-500 flex items-center gap-4">
      <Loader2Icon className="w-8 h-8 text-violet-600 animate-spin" />

      <div>
        <h2 className="text-xl font-semibold text-gray-800">Generating Interview Questions...</h2>
        <p className="text-lg text-violet-500">Please wait while we prepare your personalized questions.</p>
      </div>
    </div>
  )}
  
  {!loading && !questionList?.length && (
    <div className="p-8 bg-red-50 rounded-2xl border border-red-500 flex flex-col items-center gap-4">
      <div className="text-center">
        <h2 className="text-xl font-semibold text-red-800">Failed to Generate Questions</h2>
        <p className="text-lg text-red-600 mb-4">There was an issue generating your interview questions.</p>
        <button 
          onClick={GenerateQuestionList}
          className="px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
        >
          Try Again
        </button>
      </div>
    </div>
  )}
  {questionList?.length > 0 && (
    <div>
    <QuestionListContainer questionList={questionList}/>
  </div>
)}

<div className='flex justify-end mt-10' >
  <Button onClick={()=>onFinish()} disabled={saveLoading}>
  {saveLoading && <Loader2 className='animate-spin'/>}
  Create Interview Link & Finish</Button>
</div>
</div>

  )
}
