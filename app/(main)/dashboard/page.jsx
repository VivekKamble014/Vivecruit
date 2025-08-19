import React from 'react'
import WelcomeContainer from './_components/WelcomeContainer'
import CreateOptions from './_components/CreateOptions'; 
import LatestInterviewList from './_components/LatestInterviewList';

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <WelcomeContainer/>
      <div className="bg-white rounded-lg p-6 shadow-sm">
        <h2 className='font-bold text-2xl mb-5'>Dashboard</h2>
        <CreateOptions />
      </div>
      <LatestInterviewList/>
    </div>
  )
}
