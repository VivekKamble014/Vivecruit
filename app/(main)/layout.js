import React from 'react'
import DashboardProvider from '../provider';
import Provider from './provider';
import AppSidebar from './_components/AppSidebar'
import DashboardNavbar from './_components/DashboardNavbar'

export default function MainLayout({ children }) {
  return (
    <div className='bg-secondary'>
      <DashboardProvider>
        <Provider>
          <div className="flex h-screen">
            <AppSidebar>
              <div className="flex-1 flex flex-col">
                <DashboardNavbar />
                <div className='p-6 flex-1 overflow-auto'>
                  {children}
                </div>
              </div>
            </AppSidebar>
          </div>
        </Provider>
      </DashboardProvider>
    </div>
  )
}
