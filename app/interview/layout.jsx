"use client";
import React from 'react'
import { useState } from 'react';
import InterviewHeader from './_components/InterviewHeader'
import { InterviewDataContext } from '@/context/InterviewData'

export default function InterviewLayout({children}) {

    const [interviewInfo, setInterviewInfo]= useState();

  return (
    <InterviewDataContext.Provider value={{interviewInfo, setInterviewInfo}}>


    <div className='bg-secondary'>
        <InterviewHeader/>
    
      {children}
    </div>
    </InterviewDataContext.Provider>
  )
}
