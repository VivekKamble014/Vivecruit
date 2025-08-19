"use client";

import { useUser } from '@/app/provider';
import React from 'react';
import Image from 'next/image';
import { User } from 'lucide-react';

export default function WelcomeContainer() {
    
const {user} = useUser();

  return (
    <div className='bg-white p-5 rounded-xl flex justify-between items-center shadow-sm'>
     <div >
     <h2 className='text-lg font-bold'>Welcome Back, {user?.name || 'User'}!</h2>
     <h2 className='text-gray-500'>AI-Driven Interview, Hassle-free Hiring</h2>
     </div>
     {user?.picture ? (
       <Image src={user.picture} alt='user profile' width={40} height={40} className='rounded-full' />
     ) : (
       <div className='w-10 h-10 bg-primary rounded-full flex items-center justify-center'>
         <User className='text-white text-sm' />
       </div>
     )}
    </div>
  )
}
