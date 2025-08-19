"use client"
import React from 'react';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarProvider } from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { 
  Home, 
  Plus, 
  Calendar, 
  Users, 
  LogOut, 
  User,
  CreditCard,
  BarChart3,
  Clock
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { supabase } from '@/services/supabaseClient';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { useUser } from '@/app/provider';

export default function AppSidebar({ children }) {
  const router = useRouter();
  const { user } = useUser();

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Error signing out:', error);
        toast.error('Error signing out');
        return;
      }
      toast.success('Signed out successfully');
      router.push('/auth');
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error signing out');
    }
  };

  return (
    <SidebarProvider>
      <Sidebar className="border-r border-gray-200 bg-white">
        <SidebarHeader className="flex items-center mt-5 p-4">
          <Image 
            src={'/logo.png'} 
            alt="Logo" 
            width={250} 
            height={30} 
            className="w-[140px] h-[70px]"
          />
          <Link href="/dashboard/create-interview">
            <Button className="w-full mt-5 p-5 bg-primary text-white hover:bg-primary/90">
              <Plus className="mr-2" />
              Create New Interview
            </Button>
          </Link>
        </SidebarHeader>
        
        <SidebarContent className="p-4">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild className="p-5">
                <Link href="/dashboard">
                  <Home className="text-[16px] text-gray-600" />
                  <span className="text-[16px] text-gray-600">Dashboard</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            
            <SidebarMenuItem>
              <SidebarMenuButton asChild className="p-5">
                <Link href="/dashboard/create-interview">
                  <Plus className="text-[16px] text-gray-600" />
                  <span className="text-[16px] text-gray-600">Create Interview</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            
            <SidebarMenuItem>
              <SidebarMenuButton asChild className="p-5">
                <Link href="/schedule-interview">
                  <Clock className="text-[16px] text-gray-600" />
                  <span className="text-[16px] text-gray-600">Schedule Interview</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            
            <SidebarMenuItem>
              <SidebarMenuButton asChild className="p-5">
                <Link href="/all-interviews">
                  <BarChart3 className="text-[16px] text-gray-600" />
                  <span className="text-[16px] text-gray-600">All Interviews</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            
            <SidebarMenuItem>
              <SidebarMenuButton asChild className="p-5">
                <Link href="/billing">
                  <CreditCard className="text-[16px] text-gray-600" />
                  <span className="text-[16px] text-gray-600">Billing</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarContent>
        
        <SidebarFooter className="p-4 border-t">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-3 p-3">
              {user?.picture ? (
                <Image 
                  src={user.picture} 
                  alt="Profile" 
                  width={32} 
                  height={32} 
                  className="rounded-full"
                />
              ) : (
                <div className="w-8 h-8 bg-violet-600 rounded-full flex items-center justify-center">
                  <User className="text-white text-sm" />
                </div>
              )}
              <div className="flex flex-col">
                <span className="text-sm font-medium text-gray-900">
                  {user?.name || user?.email || 'User'}
                </span>
                <span className="text-xs text-gray-500">
                  {user?.email || 'user@example.com'}
                </span>
              </div>
            </div>
            
            <SidebarMenuButton 
              onClick={handleLogout}
              className="p-3 hover:bg-red-50 rounded-lg text-red-600 hover:text-red-700"
            >
              <LogOut className="text-[16px]" />
              <span className="text-[16px]">Logout</span>
            </SidebarMenuButton>
          </div>
        </SidebarFooter>
      </Sidebar>
      {children}
    </SidebarProvider>
  );
}