import React from 'react'
import WelcomeContainer from './_components/WelcomeContainer'
import CreateOptions from './_components/CreateOptions'; 
import LatestInterviewList from './_components/LatestInterviewList';
export default function Dashboard() {
  return (
    <div >
      {/* <WelcomeContainer/> */}
      <h2 className='font-bold text-2xl mb-5'>Dashboard</h2>
      <CreateOptions />
     <LatestInterviewList/>
    </div>
  )
}
