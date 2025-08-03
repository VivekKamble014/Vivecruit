import { Sidebar } from 'lucide-react'
import React from 'react'
import { SidebarProvider } from '@/components/ui/sidebar'
import { AppSidebar } from './_components/AppSidebar'
import { SidebarTrigger } from '@/components/ui/sidebar'
import WelcomeContainer from './dashboard/_components/WelcomeContainer'

export default function DashboardProvider({children}) {
  return (
    <SidebarProvider>
    <AppSidebar/>
    <div className='w-full'>
    {/* <SidebarTrigger /> */}
    <WelcomeContainer/>
      {children}
    </div>
    </SidebarProvider>
    
  )
}
