"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Users, 
  FileText, 
  CreditCard, 
  Settings, 
  BarChart3,
  Calendar,
  MessageSquare,
  Shield,
  LogOut,
  ChevronLeft,
  ChevronRight,
  UserCheck,
  DollarSign,
  HelpCircle
} from 'lucide-react';
import { supabase } from '@/services/supabaseClient';

export default function AdminSidebar({ darkMode }) {
  const [collapsed, setCollapsed] = useState(false);
  const [quickStats, setQuickStats] = useState({
    totalUsers: 0,
    totalRevenue: 0,
    totalInterviews: 0
  });
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();

  // Fetch real data for quick stats
  useEffect(() => {
    fetchQuickStats();
  }, []);

  const fetchQuickStats = async () => {
    try {
      setLoading(true);
      
      // Fetch total users
      const { count: usersCount, error: usersError } = await supabase
        .from('Users')
        .select('*', { count: 'exact', head: true });

      // Fetch total interviews
      const { count: interviewsCount, error: interviewsError } = await supabase
        .from('interviews')
        .select('*', { count: 'exact', head: true });

      // Fetch total revenue from completed payments
      const { data: paymentsData, error: paymentsError } = await supabase
        .from('payments')
        .select('amount')
        .eq('status', 'completed');

      if (usersError) console.error('Error fetching users:', usersError);
      if (interviewsError) console.error('Error fetching interviews:', interviewsError);
      if (paymentsError) console.error('Error fetching payments:', paymentsError);

      const totalRevenue = paymentsData?.reduce((sum, payment) => sum + (payment.amount || 0), 0) || 0;

      setQuickStats({
        totalUsers: usersCount || 0,
        totalRevenue: totalRevenue,
        totalInterviews: interviewsCount || 0
      });
    } catch (error) {
      console.error('Error fetching quick stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatNumber = (num) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  const formatCurrency = (amount) => {
    return `₹${formatNumber(amount)}`;
  };

  const menuItems = [
    {
      title: 'Dashboard',
      icon: LayoutDashboard,
      href: '/admin/dashboard',
      color: 'text-blue-600',
      activeColor: 'text-blue-100',
      bgColor: 'bg-blue-50',
      darkBgColor: 'bg-blue-900/20'
    },
    {
      title: 'Users',
      icon: Users,
      href: '/admin/users',
      color: 'text-green-600',
      activeColor: 'text-green-100',
      bgColor: 'bg-green-50',
      darkBgColor: 'bg-green-900/20'
    },
    {
      title: 'Interviews',
      icon: FileText,
      href: '/admin/interviews',
      color: 'text-purple-600',
      activeColor: 'text-purple-100',
      bgColor: 'bg-purple-50',
      darkBgColor: 'bg-purple-900/20'
    },
    {
      title: 'Payments',
      icon: CreditCard,
      href: '/admin/payments',
      color: 'text-orange-600',
      activeColor: 'text-orange-100',
      bgColor: 'bg-orange-50',
      darkBgColor: 'bg-orange-900/20'
    },
    {
      title: 'Contact Us',
      icon: MessageSquare,
      href: '/admin/contact-us',
      color: 'text-pink-600',
      activeColor: 'text-pink-100',
      bgColor: 'bg-pink-50',
      darkBgColor: 'bg-pink-900/20'
    },
    {
      title: 'Analytics',
      icon: BarChart3,
      href: '/admin/analytics',
      color: 'text-red-600',
      activeColor: 'text-red-100',
      bgColor: 'bg-red-50',
      darkBgColor: 'bg-red-900/20'
    },
    {
      title: 'Scheduled Interviews',
      icon: Calendar,
      href: '/admin/scheduled-interviews',
      color: 'text-indigo-600',
      activeColor: 'text-indigo-100',
      bgColor: 'bg-indigo-50',
      darkBgColor: 'bg-indigo-900/20'
    },
    {
      title: 'Support',
      icon: HelpCircle,
      href: '/admin/support',
      color: 'text-cyan-600',
      activeColor: 'text-cyan-100',
      bgColor: 'bg-cyan-50',
      darkBgColor: 'bg-cyan-900/20'
    },
    {
      title: 'Settings',
      icon: Settings,
      href: '/admin/settings',
      color: 'text-gray-600',
      activeColor: 'text-gray-100',
      bgColor: 'bg-gray-50',
      darkBgColor: 'bg-gray-900/20'
    }
  ];

  const statsData = [
    { 
      label: 'Total Users', 
      value: loading ? '...' : formatNumber(quickStats.totalUsers), 
      icon: UserCheck, 
      color: 'text-green-600' 
    },
    { 
      label: 'Revenue', 
      value: loading ? '...' : formatCurrency(quickStats.totalRevenue), 
      icon: DollarSign, 
      color: 'text-blue-600' 
    },
    { 
      label: 'Interviews', 
      value: loading ? '...' : formatNumber(quickStats.totalInterviews), 
      icon: FileText, 
      color: 'text-purple-600' 
    }
  ];

  return (
    <div className={`${darkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'} shadow-xl transition-all duration-300 ${collapsed ? 'w-20' : 'w-72'} h-screen flex flex-col`}>
      {/* Header */}
      <div className={`p-4 border-b ${darkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-gray-50'} flex-shrink-0`}>
        <div className="flex items-center justify-between">
          {!collapsed && (
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-violet-600 rounded-xl flex items-center justify-center shadow-lg">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-violet-600">ViveCruit</h1>
                <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Admin Panel</p>
              </div>
            </div>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className={`p-2 rounded-lg transition-all duration-200 ${
              darkMode 
                ? 'hover:bg-gray-700 text-gray-300 hover:text-white' 
                : 'hover:bg-gray-100 text-gray-600 hover:text-gray-900'
            }`}
          >
            {collapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </button>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto">
        <nav className="p-4 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`group flex items-center ${collapsed ? 'justify-center' : 'space-x-3'} px-4 py-3 rounded-xl transition-all duration-200 relative ${
                  isActive
                    ? `${darkMode ? 'bg-violet-600 text-white shadow-lg border-r-4 border-violet-400' : 'bg-violet-100 text-violet-800 border-r-4 border-violet-600 shadow-md'}`
                    : `${darkMode ? 'text-gray-300 hover:bg-gray-800 hover:text-white' : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'}`
                }`}
              >
                <div className={`p-2 rounded-lg transition-all duration-200 ${
                  isActive 
                    ? `${darkMode ? 'bg-white/20' : 'bg-violet-200'}`
                    : `${darkMode ? 'group-hover:bg-gray-700' : 'group-hover:bg-gray-100'}`
                }`}>
                  <Icon className={`h-5 w-5 ${isActive ? (darkMode ? 'text-white' : 'text-violet-700') : item.color}`} />
                </div>
                {!collapsed && (
                  <span className={`font-medium transition-all duration-200 ${
                    isActive ? (darkMode ? 'text-white' : 'text-violet-800') : ''
                  }`}>
                    {item.title}
                  </span>
                )}
                
                {/* Tooltip for collapsed state */}
                {collapsed && (
                  <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                    {item.title}
                  </div>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Quick Stats (only when not collapsed) */}
        {!collapsed && (
          <div className={`mx-4 p-4 rounded-xl ${darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-gray-50 border border-gray-200'}`}>
            <div className="flex items-center justify-between mb-3">
              <h3 className={`text-sm font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Quick Stats
              </h3>
              <button
                onClick={fetchQuickStats}
                className={`p-1 rounded transition-all duration-200 ${
                  darkMode ? 'hover:bg-gray-700 text-gray-400 hover:text-white' : 'hover:bg-gray-200 text-gray-500 hover:text-gray-700'
                }`}
                title="Refresh stats"
              >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </button>
            </div>
            <div className="space-y-3">
              {statsData.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Icon className={`h-4 w-4 ${stat.color}`} />
                      <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        {stat.label}
                      </span>
                    </div>
                    <span className={`text-sm font-semibold ${darkMode ? 'text-white' : 'text-gray-900'} ${loading ? 'animate-pulse' : ''}`}>
                      {stat.value}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className={`p-4 border-t ${darkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-gray-50'} flex-shrink-0`}>
        {!collapsed ? (
          <div className="space-y-3">
            {/* Admin Profile */}
            <div className="flex items-center space-x-3 p-3 rounded-xl bg-white/50 dark:bg-gray-700/50">
              <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                <Shield className="h-5 w-5 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                  Admin User
                </p>
                <p className={`text-xs truncate ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  Super Administrator
                </p>
              </div>
            </div>

            {/* System Status */}
            <div className={`p-3 rounded-xl ${darkMode ? 'bg-green-900/20 border border-green-700/30' : 'bg-green-50 border border-green-200'}`}>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className={`text-xs font-medium ${darkMode ? 'text-green-400' : 'text-green-700'}`}>
                  System Online
                </span>
              </div>
            </div>

            {/* Logout Button */}
            <button
              onClick={() => {
                localStorage.removeItem('adminAuthenticated');
                localStorage.removeItem('adminEmail');
                window.location.href = '/admin/login';
              }}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                darkMode 
                  ? 'text-gray-300 hover:bg-red-600 hover:text-white' 
                  : 'text-gray-700 hover:bg-red-50 hover:text-red-700'
              }`}
            >
              <LogOut className="h-5 w-5" />
              <span className="font-medium">Logout</span>
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center space-y-4">
            {/* Admin Icon */}
            <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
              <Shield className="h-5 w-5 text-white" />
            </div>

            {/* System Status */}
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>

            {/* Logout Icon */}
            <button
              onClick={() => {
                localStorage.removeItem('adminAuthenticated');
                localStorage.removeItem('adminEmail');
                window.location.href = '/admin/login';
              }}
              className={`p-2 rounded-lg transition-all duration-200 group relative ${
                darkMode 
                  ? 'text-gray-300 hover:bg-red-600 hover:text-white' 
                  : 'text-gray-600 hover:bg-red-50 hover:text-red-700'
              }`}
            >
              <LogOut className="h-5 w-5" />
              
              {/* Tooltip for logout */}
              <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                Logout
              </div>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
