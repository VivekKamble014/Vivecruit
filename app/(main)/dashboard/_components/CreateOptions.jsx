import React from 'react'
import { Video, Phone } from 'lucide-react';
import Link from 'next/link';

export default function CreateOptions() {
  return (
    <div className='grid grid-cols-1 md:grid-cols-2 gap-5'>
      <Link 
        href={'/dashboard/create-interview'} 
        className='bg-white border border-gray-200 rounded-lg p-6 cursor-pointer hover:shadow-md transition-shadow hover:border-primary/20'
      >
        <Video className="p-3 text-primary bg-purple-50 rounded-lg h-14 w-14" />
        <h2 className='font-bold mt-4 text-lg'>Create New Interview</h2>
        <p className='text-gray-500 mt-2'>Create AI-powered interviews and schedule them for candidates</p>
      </Link>
      <div className='bg-white border border-gray-200 rounded-lg p-6 opacity-60'>
        <Phone className="p-3 text-primary bg-purple-50 rounded-lg h-14 w-14" />
        <h2 className='font-bold mt-4 text-lg'>Create Phone Screening Call</h2>
        <p className='text-gray-500 mt-2'>Coming soon - AI-powered phone screening calls</p>
      </div>
    </div>
  )
}
