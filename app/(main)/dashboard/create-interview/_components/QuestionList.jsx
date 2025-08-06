
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
  console.log(result.data.content);

  const Content=result.data.content;
  // const FINAL_JSON=Content.replace('"```json','').replace('```','')
  const FINAL_JSON = Content.replace(/```json|```/g, '').trim();

  // setQuestionList(JSON.parse(FINAL_JSON)?.interviewQuestions);
  const parsed = JSON.parse(FINAL_JSON);
  setQuestionList(parsed?.interviewQuestions);


  setLoading(false);

}catch(e){
  toast('Server Error Try Again ...!')
  console.log("Error from QL", e)
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
  {questionList?.length > 0 && (
    <div>
    <QuestionListContainer questionList={questionList}/>
  </div>
)}

<div className='flex justify-end mt-10' >
  <Button onClick={()=>onFinish()} disable={saveLoading}>
  {saveLoading && <Loader2 className='animate-spin'/>}
  Create Interview Link & Finish</Button>
</div>
</div>

  )
}
