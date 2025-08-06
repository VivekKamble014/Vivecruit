import React from 'react'
import Image from 'next/image'
import { Input } from '@/components/ui/input'
import {Button} from '@/components/ui/button'
import {Copy , Clock, List, Mail, MessageSquare, Send, PlusCircle, ArrowLeft} from 'lucide-react'
import Link from "next/link";
import { toast } from 'sonner'

export default function InterviewLink({interview_Id, formData}) {
    const url=process.env.NEXT_PUBLIC_HOST_URL+'/'+interview_Id 

    const GetInterviewUrl=()=>{
        return url;
    }

const onCopyLink=async()=>{
    await navigator.clipboard.writeText(url);
    toast("Linked Copied");
}

  return (
    <div className='flex flex-col items-center justify-center mt-10'> 
      <Image src={"/check.png"} alt="check" width={200} height={200}
        className='w-[150px] h-[150px]'
      />
      <h2 className='font-bold text-lg mt-4 mb-4'>Your AI Interview is Ready...!</h2>
      <p>Share this link with your candidates to start their interview</p>

<div className='w-full p-7 mt-6 rounded-lg bg-white'>
    <div className='flex justify-between items-center'>
        <h2>Interview Link</h2>
        <h2 className='p-2 px-2  text-violet-700 bg-violet-50 rounded-xl '>Valid for 30 Days</h2>


    </div>

<div className='mt-3 flex gap-3 items-center'>
     <Input
          id="interview-link"
          value={GetInterviewUrl()}
          disabled
          className="w-full bg-gray-100 cursor-not-allowed"
        />
    <Button onClick={()=>onCopyLink()}><Copy/>Copy Link</Button>
</div>
<hr className='my-7'/>
<div>
    <h2 className='text-sm text-violet-500 flex gap-2 items-center'>
<Clock className='h-4 w-4'/>{formData?.duration}
    </h2>

        <h2 className='text-sm text-violet-500 flex gap-2 items-center'>
<List className='h-4 w-4'/>10 Questions
    </h2>

        {/* <h2 className='text-sm text-violet-500 flex gap-2 items-center'><Calender className='h-4 w-4'/>30 Min{formData?.duration}</h2> */}
    
</div>
</div>
<div className="mt-7 bg-white p-5 rounded-lg w-full shadow-md">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Share Via</h2>
        <div className="flex flex-wrap gap-4">
          <Button variant="outline" className="flex items-center gap-2 px-4 py-2">
            <MessageSquare size={18} />
            Slack
          </Button>
          <Button variant="outline" className="flex items-center gap-2 px-4 py-2">
            <Mail size={18} />
            Email
          </Button>
          <Button variant="outline" className="flex items-center gap-2 px-4 py-2">
            <Send size={18} />
            WhatsApp
          </Button>
        </div>
      </div>

      {/* Action Buttons Section */}
      <div className="mt-6 bg-white p-5 rounded-lg w-full shadow-md flex flex-wrap justify-between items-center gap-4">
      <Link href={'/dashboard/create-interview'}>

        <Button
          variant="default"
          className="flex items-center gap-2 px-5 py-2"
        >
          <PlusCircle size={18} />
          Create New Interview
        </Button>
      </Link>
        <Link href={'/dashboard'}>

        <Button
          variant="secondary"
          className="flex items-center gap-2 px-5 py-2"
        >
          <ArrowLeft size={18} />
          Go Back to Dashboard
        </Button>
        </Link>
      </div>

    </div>

  )
}

