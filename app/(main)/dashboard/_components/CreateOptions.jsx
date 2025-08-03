import React from 'react'
import { Video ,Phone} from 'lucide-react';
import Link from 'next/link';
export default function CreateOptions() {
  return (
    <div className='grid grid-cols-2 gap-5 '>
      <Link href={'/dashboard/create-interview'} className='bg-white border-gray-200 rounded-l p-10 cursor-pointer'>
      <Video className="p-3 text-primary bg-purple-50 rounded-lg h-14 w-14" />
        <h2 className='font-bold mt-5'>Create New Interview</h2>
        <p className='text-gray-500'>Create AI Interviews and Schedule it for candidate</p>
      </Link>
       <div className='bg-white border-gray-200 rounded-l p-10'>
      <Phone className="p-3 text-primary bg-purple-50 rounded-lg h-14 w-14" />
        <h2 className='font-bold mt-5'>Create Phone Screening Call</h2>
        <p className='text-gray-500'>Create AI Interviews and Schedule it for candidate</p>
      </div>
    </div>
  )
}
