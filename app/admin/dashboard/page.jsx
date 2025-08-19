"use client";
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Users, 
  FileText, 
  CreditCard, 
  TrendingUp, 
  TrendingDown,
  Calendar,
  DollarSign,
  Activity,
  Eye,
  Download
} from 'lucide-react';
import { supabase } from '@/services/supabaseClient';
import { toast } from 'sonner';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalInterviews: 0,
    totalPayments: 0,
    totalRevenue: 0,
    recentUsers: [],
    recentInterviews: [],
    recentPayments: []
  });
  const [loading, setLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const savedDarkMode = localStorage.getItem('adminDarkMode') === 'true';
    setDarkMode(savedDarkMode);
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // Fetch total users
      const { count: userCount } = await supabase
        .from('Users')
        .select('*', { count: 'exact', head: true });

      // Fetch total interviews
      const { count: interviewCount } = await supabase
        .from('interviews')
        .select('*', { count: 'exact', head: true });

      // Fetch total payments
      const { count: paymentCount } = await supabase
        .from('payments')
        .select('*', { count: 'exact', head: true });

      // Fetch total revenue
      const { data: payments } = await supabase
        .from('payments')
        .select('amount')
        .eq('status', 'completed');

      const totalRevenue = payments?.reduce((sum, payment) => sum + (payment.amount || 0), 0) || 0;

      // Fetch recent users
      const { data: recentUsers } = await supabase
        .from('Users')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);

      // Fetch recent interviews
      const { data: recentInterviews } = await supabase
        .from('interviews')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);

      // Fetch recent payments
      const { data: recentPayments } = await supabase
        .from('payments')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);

      setStats({
        totalUsers: userCount || 0,
        totalInterviews: interviewCount || 0,
        totalPayments: paymentCount || 0,
        totalRevenue,
        recentUsers: recentUsers || [],
        recentInterviews: recentInterviews || [],
        recentPayments: recentPayments || []
      });

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ title, value, icon: Icon, trend, trendValue, color }) => (
    <Card className={darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>{title}</CardTitle>
        <Icon className={`h-4 w-4 ${color}`} />
      </CardHeader>
      <CardContent>
        <div className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{value}</div>
        {trend && (
          <div className={`flex items-center text-xs ${trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
            {trend === 'up' ? <TrendingUp className="h-3 w-3 mr-1" /> : <TrendingDown className="h-3 w-3 mr-1" />}
            {trendValue}
          </div>
        )}
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-violet-600 mx-auto"></div>
          <p className={`mt-2 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Admin Dashboard</h1>
          <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'} mt-1`}>Welcome back! Here's what's happening with your platform.</p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline" className={`flex items-center space-x-2 ${
            darkMode ? 'border-gray-600 text-gray-300 hover:bg-gray-700' : 'border-gray-300 text-gray-700 hover:bg-gray-50'
          }`}>
            <Download className="h-4 w-4" />
            <span>Export Report</span>
          </Button>
          <Button className="flex items-center space-x-2">
            <Activity className="h-4 w-4" />
            <span>View Analytics</span>
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Users"
          value={stats.totalUsers}
          icon={Users}
          trend="up"
          trendValue="+12% from last month"
          color="text-blue-600"
        />
        <StatCard
          title="Total Interviews"
          value={stats.totalInterviews}
          icon={FileText}
          trend="up"
          trendValue="+8% from last month"
          color="text-green-600"
        />
        <StatCard
          title="Total Payments"
          value={stats.totalPayments}
          icon={CreditCard}
          trend="up"
          trendValue="+15% from last month"
          color="text-orange-600"
        />
        <StatCard
          title="Total Revenue"
          value={`₹${stats.totalRevenue.toLocaleString()}`}
          icon={DollarSign}
          trend="up"
          trendValue="+20% from last month"
          color="text-purple-600"
        />
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Users */}
        <Card className={darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}>
          <CardHeader>
            <CardTitle className={`flex items-center justify-between ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              <span>Recent Users</span>
              <Button variant="ghost" size="sm" className={darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'}>
                <Eye className="h-4 w-4" />
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.recentUsers.map((user) => (
                <div key={user.id} className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                    <Users className="h-4 w-4 text-gray-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'} truncate`}>
                      {user.name || 'Unknown User'}
                    </p>
                    <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'} truncate`}>{user.email}</p>
                  </div>
                  <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    {new Date(user.created_at).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Interviews */}
        <Card className={darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}>
          <CardHeader>
            <CardTitle className={`flex items-center justify-between ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              <span>Recent Interviews</span>
              <Button variant="ghost" size="sm" className={darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'}>
                <Eye className="h-4 w-4" />
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.recentInterviews.map((interview) => (
                <div key={interview.id} className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                    <FileText className="h-4 w-4 text-purple-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'} truncate`}>
                      {interview.jobPosition || 'Untitled Interview'}
                    </p>
                    <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'} truncate`}>{interview.userEmail}</p>
                  </div>
                  <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    {new Date(interview.created_at).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Payments */}
        <Card className={darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}>
          <CardHeader>
            <CardTitle className={`flex items-center justify-between ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              <span>Recent Payments</span>
              <Button variant="ghost" size="sm" className={darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'}>
                <Eye className="h-4 w-4" />
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.recentPayments.map((payment) => (
                <div key={payment.id} className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <CreditCard className="h-4 w-4 text-green-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'} truncate`}>
                      {payment.plan_name} Plan
                    </p>
                    <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'} truncate`}>₹{payment.amount}</p>
                  </div>
                  <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    {new Date(payment.created_at).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className={darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}>
        <CardHeader>
          <CardTitle className={darkMode ? 'text-white' : 'text-gray-900'}>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button variant="outline" className={`flex flex-col items-center space-y-2 h-20 ${
              darkMode ? 'border-gray-600 text-gray-300 hover:bg-gray-700' : 'border-gray-300 text-gray-700 hover:bg-gray-50'
            }`}>
              <Users className="h-6 w-6" />
              <span className="text-sm">Manage Users</span>
            </Button>
            <Button variant="outline" className={`flex flex-col items-center space-y-2 h-20 ${
              darkMode ? 'border-gray-600 text-gray-300 hover:bg-gray-700' : 'border-gray-300 text-gray-700 hover:bg-gray-50'
            }`}>
              <FileText className="h-6 w-6" />
              <span className="text-sm">View Interviews</span>
            </Button>
            <Button variant="outline" className={`flex flex-col items-center space-y-2 h-20 ${
              darkMode ? 'border-gray-600 text-gray-300 hover:bg-gray-700' : 'border-gray-300 text-gray-700 hover:bg-gray-50'
            }`}>
              <CreditCard className="h-6 w-6" />
              <span className="text-sm">Payment History</span>
            </Button>
            <Button variant="outline" className={`flex flex-col items-center space-y-2 h-20 ${
              darkMode ? 'border-gray-600 text-gray-300 hover:bg-gray-700' : 'border-gray-300 text-gray-700 hover:bg-gray-50'
            }`}>
              <Calendar className="h-6 w-6" />
              <span className="text-sm">Scheduled Interviews</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
