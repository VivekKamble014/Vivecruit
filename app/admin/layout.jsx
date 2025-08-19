"use client";
import React, { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { toast } from 'sonner';
import AdminSidebar from './_components/AdminSidebar';
import AdminHeader from './_components/AdminHeader';

export default function AdminLayout({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Check if admin is authenticated
    const adminAuth = localStorage.getItem('adminAuthenticated');
    const adminEmail = localStorage.getItem('adminEmail');
    const savedDarkMode = localStorage.getItem('adminDarkMode') === 'true';

    setDarkMode(savedDarkMode);

    if (!adminAuth || adminEmail !== 'mrvivekkamble8@gmail.com') {
      if (pathname !== '/admin/login') {
        router.push('/admin/login');
      }
      setLoading(false);
      return;
    }

    setIsAuthenticated(true);
    setLoading(false);
  }, [pathname, router]);

  const handleLogout = () => {
    localStorage.removeItem('adminAuthenticated');
    localStorage.removeItem('adminEmail');
    setIsAuthenticated(false);
    toast.success('Admin logged out successfully');
    router.push('/admin/login');
  };

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    localStorage.setItem('adminDarkMode', newDarkMode.toString());
  };

  if (loading) {
    return (
      <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-50'} flex items-center justify-center`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-600 mx-auto"></div>
          <p className={`mt-4 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Loading admin panel...</p>
        </div>
      </div>
    );
  }

  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="flex">
        {/* Sidebar */}
        <AdminSidebar darkMode={darkMode} />
        
        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          <AdminHeader onLogout={handleLogout} darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
          <main className={`flex-1 p-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
