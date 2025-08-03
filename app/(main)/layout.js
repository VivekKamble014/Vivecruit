import React from 'react'
import DashboardProvider from '../provider';
import Provider from './provider';
export default function DashboardLayout({children}) {
  return (

        <div className='bg-secondary'>
        
        <DashboardProvider>
        <Provider>

        <div className='p-10'>

        {children}
        </div>
        </Provider>
        </DashboardProvider>
      
        </div>

  )
}
