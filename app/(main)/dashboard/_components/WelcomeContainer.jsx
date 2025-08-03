"use client";

import { useUser } from '@/app/provider';
import React from 'react';
import Image from 'next/image';
export default function WelcomeContainer() {
    
const {user} = useUser();

  return (
    <div className='bg-white p-5 rounded-xl flex justify-between items-center m-10'>
     <div >
     <h2 className='text-lg font-bold'>Welcome Back,{user?.name} </h2>
     <h2 className='text-gray-500'>AI-Driven Interview, Hassal-free Hiring</h2>
     </div>
     {user && <Image src={user?.picture} alt='user profile' width={40} height={40} className='rounded-full' />}

    </div>
  )
}
