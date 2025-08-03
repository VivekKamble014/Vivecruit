"use client";
import React from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { supabase } from '../../services/supabaseClient.jsx'

export default function login() {
// used for SIGN IN with Google Authenticator
const signInWithGoogle =async() => {
  const {error}= await supabase.auth.signInWithOAuth({
    provider: 'google'
    
    
  });
  if (error) {
    console.error("Error signing in with Google:", error.message);
    return;
  }
  // Implement Google Sign-In logic here
  console.log("Google Sign-In clicked");
  
};


  return (
    <div className='flex flex-col items-center justify-center h-screen '>
      <div className='flex flex-col items-center border rounded-2xl p-8'>
        <Image
          src="/logo.png"
          alt="Vivecruit Logo"
          width={400}
          height={100}
          className='w-[150px]'
        />
        <div className='flex flex-col'>
          <Image src="/login.jpg"
            alt="Login Illustration"
            width={600}
            height={400}
            className='w-[400px] h-[300px] rounded-2xl'
          />
          <h2 className='text-2xl font-bold text-center mt-3'>Welcome to Vivecruit</h2>
          <p className='text-gray-500 text-center '>Sign-in with google Authanticator</p>
          <Button className='mt-7 w-full' 
          onClick={signInWithGoogle}
          >Login with Google</Button>
        </div>
      </div>
    </div>
  )
}
