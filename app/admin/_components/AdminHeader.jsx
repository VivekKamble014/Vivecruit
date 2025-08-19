"use client";
import React, { useState, useEffect } from 'react';
import { Bell, Search, LogOut, User, Moon, Sun, Settings, Activity, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/services/supabaseClient';

export default function AdminHeader({ onLogout, darkMode, toggleDarkMode }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [unreadContacts, setUnreadContacts] = useState(0);
  const [showSearch, setShowSearch] = useState(false);

  useEffect(() => {
    fetchUnreadContacts();
    // Set up interval to check for new contacts every 30 seconds
    const interval = setInterval(fetchUnreadContacts, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchUnreadContacts = async () => {
    try {
      const { count, error } = await supabase
        .from('contact_us')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'unread');

      if (!error && count !== null) {
        setUnreadContacts(count);
      }
    } catch (error) {
      console.error('Error fetching unread contacts:', error);
    }
  };

  const handleNotificationClick = () => {
    // Navigate to contact us page
    window.location.href = '/admin/contact-us';
  };

  return (
    <header className={`${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'} shadow-lg border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'} px-6 py-4`}>
      <div className="flex justify-between items-center">
        {/* Left Side - Search and Breadcrumb */}
        <div className="flex items-center space-x-4">
          {/* Search Bar */}
          <div className={`transition-all duration-300 ${showSearch ? 'w-80' : 'w-64'}`}>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className={`h-5 w-5 ${darkMode ? 'text-gray-400' : 'text-gray-400'}`} />
              </div>
              <input
                type="text"
                placeholder="Search users, interviews, payments..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setShowSearch(true)}
                onBlur={() => setShowSearch(false)}
                className={`block w-full pl-10 pr-4 py-2 border rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all duration-300 ${
                  darkMode 
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                    : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500'
                }`}
              />
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              className={`p-2 rounded-lg transition-all duration-200 ${
                darkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-100 text-gray-600'
              }`}
            >
              <Activity className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className={`p-2 rounded-lg transition-all duration-200 ${
                darkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-100 text-gray-600'
              }`}
            >
              <TrendingUp className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Right Side */}
        <div className="flex items-center space-x-4">
          {/* Dark Mode Toggle */}
          <button
            onClick={toggleDarkMode}
            className={`p-2 rounded-lg transition-all duration-200 ${
              darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
            }`}
          >
            {darkMode ? (
              <Sun className="h-5 w-5 text-yellow-400" />
            ) : (
              <Moon className="h-5 w-5 text-gray-600" />
            )}
          </button>

          {/* Notifications */}
          <button 
            onClick={handleNotificationClick}
            className={`p-2 rounded-lg relative transition-all duration-200 ${
              darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
            }`}
          >
            <Bell className={`h-5 w-5 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`} />
            {unreadContacts > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-semibold animate-pulse">
                {unreadContacts > 99 ? '99+' : unreadContacts}
              </span>
            )}
          </button>

          {/* Settings */}
          <button
            className={`p-2 rounded-lg transition-all duration-200 ${
              darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
            }`}
          >
            <Settings className={`h-5 w-5 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`} />
          </button>

          {/* Divider */}
          <div className={`w-px h-8 ${darkMode ? 'bg-gray-600' : 'bg-gray-300'}`}></div>

          {/* Admin Profile */}
          <div className="flex items-center space-x-3">
            <div className="text-right hidden md:block">
              <p className={`text-sm font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Admin User</p>
              <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Super Administrator</p>
            </div>
            <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
              <User className="h-5 w-5 text-white" />
            </div>
          </div>

          {/* Logout Button */}
          <Button
            onClick={onLogout}
            variant="outline"
            size="sm"
            className={`flex items-center space-x-2 transition-all duration-200 ${
              darkMode 
                ? 'border-gray-600 text-gray-300 hover:bg-red-600 hover:border-red-600 hover:text-white' 
                : 'border-gray-300 text-gray-700 hover:bg-red-50 hover:border-red-300 hover:text-red-700'
            }`}
          >
            <LogOut className="h-4 w-4" />
            <span className="hidden sm:inline">Logout</span>
          </Button>
        </div>
      </div>

      {/* Search Results Dropdown (if needed) */}
      {showSearch && searchQuery && (
        <div className={`absolute top-full left-0 right-0 mt-2 mx-6 rounded-xl shadow-xl border z-50 ${
          darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
        }`}>
          <div className="p-4">
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              Search results for "{searchQuery}" will appear here...
            </p>
          </div>
        </div>
      )}
    </header>
  );
}
