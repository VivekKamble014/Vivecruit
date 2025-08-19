
import { Loader2, Loader2Icon, Plus, RefreshCw } from 'lucide-react';
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
const [showManualModal, setShowManualModal] = useState(false);
const [newQuestion, setNewQuestion] = useState('');
const [newQuestionType, setNewQuestionType] = useState('Technical');

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

  // Handle the specific format returned by AI: "interviewQuestions=[...]"
  let FINAL_JSON = Content.trim();
  
  // If it starts with "interviewQuestions=", extract the array part
  if (FINAL_JSON.startsWith('interviewQuestions=')) {
    FINAL_JSON = FINAL_JSON.replace('interviewQuestions=', '').trim();
  }
  
  // Remove any markdown code blocks if present
  FINAL_JSON = FINAL_JSON.replace(/```json|```/g, '').trim();
  
  console.log("FINAL_JSON:", FINAL_JSON);

  // Parse the JSON array directly
  const parsed = JSON.parse(FINAL_JSON);
  console.log("Parsed data:", parsed);
  
  // If parsed is an array, use it directly, otherwise look for interviewQuestions property
  const questions = Array.isArray(parsed) ? parsed : parsed?.interviewQuestions || [];
  setQuestionList(questions);

  setLoading(false);

}catch(e){
  console.log("Error from QL", e)
  
  // Handle specific error types
  if (e.response?.status === 429) {
    toast.error('Rate limit exceeded. Please wait a few minutes and try again.');
  } else if (e.response?.data?.error) {
    toast.error(e.response.data.error);
  } else if (e.name === 'SyntaxError') {
    toast.error('Invalid response format from AI. Please try again.');
  } else {
    toast.error('Server Error. Please try again.');
  }
  
  setLoading(false);
}
}

const addManualQuestion = () => {
  if (!newQuestion.trim()) {
    toast.error('Please enter a question');
    return;
  }

  const questionToAdd = {
    question: newQuestion.trim(),
    type: newQuestionType
  };

  setQuestionList(prev => [...(prev || []), questionToAdd]);
  setNewQuestion('');
  setNewQuestionType('Technical');
  setShowManualModal(false);
  toast.success('Question added successfully');
};

const removeQuestion = (index) => {
  setQuestionList(prev => prev.filter((_, i) => i !== index));
  toast.success('Question removed');
};

const [loading, setLoading]=useState(true);

useEffect(()=>{
  if(formData){
    GenerateQuestionList();
  }
},[formData])


const onFinish=async()=>{
  setSaveLoading(true);
  
  try {
    // Check if user exists
    if (!user?.email) {
      console.error('No user email available');
      toast.error('User authentication required. Please log in again.');
      setSaveLoading(false);
      return;
    }

    console.log('Checking user for interview creation:', user.email);

    // Check if user exists in Users table (without billing columns)
    const { data: userData, error: userError } = await supabase
      .from('Users')
      .select('email, name')
      .eq('email', user.email)
      .single();

    if (userError) {
      console.error('Error fetching user data:', userError);
      
      // Handle specific error cases
      if (userError.code === 'PGRST116') {
        // User not found in Users table, create them
        console.log('User not found in Users table, creating...');
        const { data: newUser, error: createError } = await supabase
          .from('Users')
          .insert([
            {
              email: user.email,
              name: user.name || user.user_metadata?.name || 'User',
              picture: user.picture || user.user_metadata?.picture
            }
          ])
          .select()
          .single();

        if (createError) {
          console.error('Error creating user:', createError);
          toast.error('Error setting up user account. Please try again.');
          setSaveLoading(false);
          return;
        }

        console.log('New user created:', newUser);
      } else {
        toast.error('Error checking user. Please try again.');
        setSaveLoading(false);
        return;
      }
    }

    // For now, allow unlimited interviews (you can add billing logic later)
    console.log('User verified, proceeding with interview creation');

    const interview_id=uuidv4();
    const { data, error } = await supabase
      .from('interviews')
      .insert([
        {
          jobPosition: formData.jobPosition,
          jobDescription: formData.jobDescription,
          duration: formData.duration,
          type: formData.type,
          questionList: questionList,
          userEmail: user.email,
          interview_Id: interview_id
        },
      ])
      .select();
    
    if (error) {
      console.log("Supabase insert error:", error);
      toast.error('Failed to save interview data.');
      setSaveLoading(false);
      return;
    }

    setSaveLoading(false);
    console.log("Record Inserted", data);
    toast.success('Interview saved successfully.');
    onCreateLink(interview_id);

  } catch (error) {
    console.error('Error in onFinish:', error);
    toast.error('Failed to save interview data.');
    setSaveLoading(false);
  }
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
        <div className="flex gap-3">
          <button 
            onClick={GenerateQuestionList}
            className="px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Try Again
          </button>
          <button 
            onClick={() => setShowManualModal(true)}
            className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Manually
          </button>
        </div>
      </div>
    </div>
  )}
  
  {questionList?.length > 0 && (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-gray-800">
          Generated Questions ({questionList.length})
        </h3>
        <div className="flex gap-3">
          <Button 
            onClick={GenerateQuestionList}
            variant="outline"
            className="flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Regenerate
          </Button>
          <Button 
            onClick={() => setShowManualModal(true)}
            className="flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Question
          </Button>
        </div>
      </div>
      <QuestionListContainer questionList={questionList} onRemoveQuestion={removeQuestion}/>
    </div>
  )}

  {/* Manual Question Modal */}
  {showManualModal && (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <h3 className="text-lg font-semibold mb-4">Add Question Manually</h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Question
            </label>
            <textarea
              value={newQuestion}
              onChange={(e) => setNewQuestion(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent"
              rows={3}
              placeholder="Enter your interview question..."
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Question Type
            </label>
            <select
              value={newQuestionType}
              onChange={(e) => setNewQuestionType(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent"
            >
              <option value="Technical">Technical</option>
              <option value="Behavioral">Behavioral</option>
              <option value="Experience-Based">Experience-Based</option>
              <option value="Problem Solving">Problem Solving</option>
              <option value="Leadership">Leadership</option>
              <option value="Situational">Situational</option>
              <option value="Theoretical">Theoretical</option>
            </select>
          </div>
        </div>
        
        <div className="flex gap-3 mt-6">
          <Button
            onClick={addManualQuestion}
            className="flex-1"
          >
            Add Question
          </Button>
          <Button
            onClick={() => setShowManualModal(false)}
            variant="outline"
            className="flex-1"
          >
            Cancel
          </Button>
        </div>
      </div>
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
