"use client";
import React, { useState, useEffect } from 'react';
import { useUser } from '@/app/provider';
import Image from 'next/image';
import { Bell, LogOut, User } from 'lucide-react';
import { supabase } from '@/services/supabaseClient';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function DashboardNavbar() {
  const { user } = useUser();
  const router = useRouter();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

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
    <nav className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
      <div className="flex justify-between items-center">
        {/* Logo and Brand */}
        <div className="flex items-center gap-4">
          <Image 
            src="/logo.png" 
            alt="ViveCruit Logo" 
            width={120} 
            height={40} 
            className="h-8 w-auto"
          />
          <span className="text-lg font-semibold text-gray-800">Dashboard</span>
        </div>

        {/* Right Side - Notifications and Profile */}
        <div className="flex items-center gap-4">
          {/* Notifications */}
          <button className="p-2 hover:bg-gray-100 rounded-lg relative">
            <Bell className="h-5 w-5 text-gray-600" />
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
              3
            </span>
          </button>

          {/* Profile Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-3 p-2 hover:bg-gray-100 rounded-lg"
            >
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
                  <User className="h-4 w-4 text-white" />
                </div>
              )}
              <div className="text-left">
                <p className="text-sm font-medium text-gray-900">
                  {user?.name || user?.email || 'User'}
                </p>
                <p className="text-xs text-gray-500">
                  {user?.email || 'user@example.com'}
                </p>
              </div>
            </button>

            {/* Dropdown Menu */}
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-3 px-4 py-2 hover:bg-red-50 w-full text-left"
                >
                  <LogOut className="h-4 w-4 text-red-600" />
                  <span className="text-sm text-red-600">Logout</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Close dropdown when clicking outside */}
      {isDropdownOpen && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setIsDropdownOpen(false)}
        />
      )}
    </nav>
  );
}
